import os
from functools import lru_cache
from pathlib import Path

from dotenv import dotenv_values
from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


def _load_chatbot_llm_credentials() -> None:
    """Reuse the existing chatbot key without copying it into tracked files."""

    if os.getenv("LLM_API_KEY") or os.getenv("GROQ_API_KEY"):
        return

    local_values = dotenv_values(".env")
    if local_values.get("LLM_API_KEY") or local_values.get("GROQ_API_KEY"):
        return

    configured_path = os.getenv("CHATBOT_ENV_FILE") or local_values.get("CHATBOT_ENV_FILE")
    candidates = []
    if configured_path:
        candidates.append(Path(configured_path))
    candidates.append(Path(__file__).resolve().parents[2] / "ai-service" / ".env")

    for path in candidates:
        if not path.is_file():
            continue
        chatbot_values = dotenv_values(path)
        key = chatbot_values.get("LLM_API_KEY") or chatbot_values.get("GROQ_API_KEY")
        if not key:
            continue
        os.environ["LLM_API_KEY"] = key
        if not os.getenv("LLM_MODEL") and not local_values.get("LLM_MODEL") and chatbot_values.get("MODEL_NAME"):
            os.environ["LLM_MODEL"] = chatbot_values["MODEL_NAME"]
        break


_load_chatbot_llm_credentials()


class Settings(BaseSettings):
    """Runtime configuration loaded from rag/.env or process environment."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "Schoolify RAG Study Assistant"
    app_env: str = "development"

    database_url: str = "postgresql://schoolify_rag:schoolify_rag_dev_password@localhost:5435/schoolify_rag"

    llm_api_key: str | None = Field(
        default=None,
        validation_alias=AliasChoices("LLM_API_KEY", "GROQ_API_KEY"),
    )
    llm_model: str = "openai/gpt-oss-120b"
    llm_base_url: str = "https://api.groq.com/openai/v1"
    llm_temperature: float = Field(default=0.2, ge=0, le=1)
    llm_max_tokens: int = Field(default=900, ge=128, le=4096)
    llm_timeout_seconds: float = Field(default=45, gt=0, le=180)

    embedding_model: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    embedding_dimensions: int = Field(default=384, ge=64, le=4096)
    embedding_cache_dir: str | None = None

    elevenlabs_api_key: str | None = None
    elevenlabs_voice_id: str = "21m00Tcm4TlvDq8ikWAM"
    elevenlabs_model_id: str = "eleven_multilingual_v2"

    rag_api_key: str | None = None
    cors_origins: str = "http://localhost:3000"

    auto_ingest: bool = False
    knowledge_dir: str = "data/knowledge"
    upload_dir: str = "data/knowledge/uploads"
    allowed_upload_extensions: str = ".md,.txt,.pdf"
    max_upload_mb: int = Field(default=20, ge=1, le=100)
    max_context_documents: int = Field(default=5, ge=1, le=10)
    max_history_messages: int = Field(default=8, ge=0, le=20)
    chunk_size: int = Field(default=1200, ge=300, le=4000)
    chunk_overlap: int = Field(default=160, ge=0, le=800)

    @property
    def resolved_embedding_cache_dir(self) -> str:
        if self.embedding_cache_dir and self.embedding_cache_dir.strip():
            return self.embedding_cache_dir
        if os.name == "nt":
            local_app_data = os.getenv("LOCALAPPDATA") or str(Path.home() / "AppData" / "Local")
            return str(Path(local_app_data) / "Schoolify" / "fastembed")
        return ".cache/fastembed"

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def allowed_upload_suffixes(self) -> set[str]:
        return {
            f".{part.strip().lstrip('.').lower()}"
            for part in self.allowed_upload_extensions.split(",")
            if part.strip().lstrip(".")
        }

    @property
    def llm_configured(self) -> bool:
        return bool(self.llm_api_key and self.llm_api_key.strip())

    @property
    def voice_configured(self) -> bool:
        return bool(self.elevenlabs_api_key and self.elevenlabs_api_key.strip())


@lru_cache
def get_settings() -> Settings:
    return Settings()
