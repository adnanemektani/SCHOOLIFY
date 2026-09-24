from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator


StudyMode = Literal["explain", "summarize", "quiz", "plan"]
StudyLevel = Literal["decouvre", "intermediaire", "avance"]


class HistoryMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")

    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=6000)


class StudyRequest(BaseModel):
    """A question can be sent as `question` or as the simpler `message` alias."""

    model_config = ConfigDict(extra="ignore")

    question: str | None = Field(default=None, min_length=3, max_length=4000)
    message: str | None = Field(default=None, min_length=3, max_length=4000)
    mode: StudyMode = "explain"
    level: StudyLevel = "intermediaire"
    subject: str | None = Field(default=None, max_length=120)
    history: list[HistoryMessage] = Field(default_factory=list, max_length=20)
    messages: list[HistoryMessage] | None = Field(default=None, max_length=20)
    include_graph: bool = True
    student_id: str | None = Field(default=None, max_length=120)

    @model_validator(mode="after")
    def normalize_question(self) -> "StudyRequest":
        value = (self.question or self.message or "").strip()
        if not value:
            raise ValueError("A question is required.")
        self.question = value
        self.message = None
        if not self.history and self.messages:
            self.history = self.messages[-20:]
        return self


class Source(BaseModel):
    title: str
    source: str
    snippet: str
    score: float | None = None


class GraphNode(BaseModel):
    id: str = Field(min_length=1, max_length=80)
    label: str = Field(min_length=1, max_length=80)
    kind: Literal["topic", "concept", "practice", "resource"] = "concept"


class GraphEdge(BaseModel):
    source: str = Field(min_length=1, max_length=80)
    target: str = Field(min_length=1, max_length=80)
    label: str = Field(default="", max_length=80)


class StudyGraph(BaseModel):
    title: str = Field(default="Carte de compréhension", max_length=120)
    nodes: list[GraphNode] = Field(default_factory=list, max_length=12)
    edges: list[GraphEdge] = Field(default_factory=list, max_length=24)


class StudyResponse(BaseModel):
    answer: str
    reply: str | None = None
    mode: StudyMode
    level: StudyLevel
    sources: list[Source] = Field(default_factory=list)
    graph: StudyGraph | None = None
    llm_used: bool = False
    vector_store_used: bool = False
    voice_available: bool = False
    degraded: bool = False


class KnowledgeFile(BaseModel):
    name: str
    extension: str
    size_bytes: int
    modified_at: str


class KnowledgeFileList(BaseModel):
    files: list[KnowledgeFile] = Field(default_factory=list)
    directory: str


class UploadResponse(BaseModel):
    ok: bool = True
    filename: str
    indexed_chunks: int
    message: str


class ReindexResponse(BaseModel):
    ok: bool = True
    files: int
    chunks: int
    indexed: int
    message: str


class TTSRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")

    text: str = Field(min_length=1, max_length=5000)


class TTSResponse(BaseModel):
    audio_base64: str
    mime_type: str = "audio/mpeg"
    voice_id: str


class HealthResponse(BaseModel):
    status: Literal["ok", "degraded"]
    service: str
    database: Literal["ready", "not_ready"]
    llm: Literal["configured", "not_configured"]
    voice: Literal["configured", "not_configured"]
    documents: int = 0
    ingesting: bool = False
    max_upload_mb: int = 20
