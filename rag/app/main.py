import asyncio
import base64
import hmac
import json
import logging
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Annotated, AsyncIterator

from fastapi import Depends, FastAPI, File, Header, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles

from .config import get_settings
from .engine import RagEngine
from .schemas import (
    HealthResponse,
    KnowledgeFile,
    KnowledgeFileList,
    KnowledgeUrlRequest,
    KnowledgeUrlResponse,
    ReindexResponse,
    StudyRequest,
    StudyResponse,
    TTSRequest,
    TTSResponse,
    UploadResponse,
)
from .uploads import safe_upload_name, unique_upload_path, validate_upload_bytes
from .web_source import WebSourceError, fetch_web_document, web_document_filename, web_document_markdown


logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    settings = get_settings()
    engine = RagEngine(settings)
    await engine.start()
    app.state.engine = engine
    app.state.settings = settings
    yield
    await engine.close()


settings = get_settings()
app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="Retrieval-augmented study coach for Schoolify learners.",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["Content-Type", "X-RAG-API-Key"],
)

UI_DIR = Path(__file__).resolve().parents[1] / "ui"
if UI_DIR.is_dir():
    app.mount("/test-ui", StaticFiles(directory=UI_DIR, html=True), name="test-ui")


async def require_api_key(
    x_rag_api_key: Annotated[str | None, Header(alias="X-RAG-API-Key")] = None,
) -> None:
    configured_key = get_settings().rag_api_key
    if configured_key and (not x_rag_api_key or not hmac.compare_digest(configured_key, x_rag_api_key)):
        raise HTTPException(status_code=401, detail="Invalid RAG service key.")


@app.get("/", tags=["system"])
async def root() -> dict[str, str]:
    return {"service": settings.app_name, "docs": "/docs", "test_ui": "/test"}


@app.get("/test", include_in_schema=False)
async def test_ui() -> FileResponse:
    return FileResponse(UI_DIR / "index.html", headers={"Cache-Control": "no-store"})


@app.get("/health", response_model=HealthResponse, tags=["system"])
async def health(request: Request) -> HealthResponse:
    engine: RagEngine = request.app.state.engine
    status = engine.status()
    database_ready = bool(status["database"])
    return HealthResponse(
        status="ok" if database_ready else "degraded",
        service=settings.app_name,
        database="ready" if database_ready else "not_ready",
        llm="configured" if status["llm"] else "not_configured",
        voice="configured" if status["voice"] else "not_configured",
        documents=await engine.count_documents() if database_ready else len(engine.fallback_documents),
        ingesting=bool(status["ingesting"]),
        max_upload_mb=settings.max_upload_mb,
    )


@app.get("/ready", response_model=HealthResponse, tags=["system"])
async def ready(request: Request) -> HealthResponse:
    """Readiness endpoint for Docker and deployment platforms."""

    return await health(request)


@app.post("/api/v1/ask", response_model=StudyResponse, tags=["study"])
async def ask(
    payload: StudyRequest,
    request: Request,
    _: None = Depends(require_api_key),
) -> StudyResponse:
    engine: RagEngine = request.app.state.engine
    try:
        return await engine.answer(payload)
    except Exception as error:
        logger.exception("Study request failed: %s", type(error).__name__)
        raise HTTPException(status_code=503, detail="The study assistant is temporarily unavailable.") from error


@app.post("/api/v1/ask/stream", tags=["study"])
async def ask_stream(
    payload: StudyRequest,
    request: Request,
    _: None = Depends(require_api_key),
) -> StreamingResponse:
    """Stream the answer as newline-delimited JSON events (sources, delta, replace, done, error)."""

    engine: RagEngine = request.app.state.engine

    async def events() -> AsyncIterator[bytes]:
        try:
            async for event in engine.answer_stream(payload):
                yield (json.dumps(event, ensure_ascii=False) + "\n").encode("utf-8")
        except Exception as error:
            logger.exception("Streaming study request failed: %s", type(error).__name__)
            yield (json.dumps({"type": "error", "detail": "The study assistant is temporarily unavailable."}) + "\n").encode("utf-8")

    return StreamingResponse(
        events(),
        media_type="application/x-ndjson",
        headers={"Cache-Control": "no-store", "X-Accel-Buffering": "no"},
    )


@app.post("/api/v1/chat", response_model=StudyResponse, tags=["study"])
async def chat(
    payload: StudyRequest,
    request: Request,
    _: None = Depends(require_api_key),
) -> StudyResponse:
    """Compatibility alias for the existing Schoolify chatbot contract."""

    return await ask(payload, request, None)


def _upload_root() -> Path:
    root = Path(settings.upload_dir)
    root.mkdir(parents=True, exist_ok=True)
    return root


def _knowledge_file(path: Path) -> KnowledgeFile:
    stat = path.stat()
    return KnowledgeFile(
        name=path.name,
        extension=path.suffix.lower().lstrip("."),
        size_bytes=stat.st_size,
        modified_at=datetime.fromtimestamp(stat.st_mtime, tz=timezone.utc).isoformat(),
    )


def _upload_source(path: Path) -> str:
    knowledge_root = Path(settings.knowledge_dir).resolve()
    resolved_path = path.resolve()
    try:
        return resolved_path.relative_to(knowledge_root).as_posix()
    except ValueError:
        return path.name


@app.get("/api/v1/knowledge/files", response_model=KnowledgeFileList, tags=["knowledge"])
async def list_knowledge_files(_: None = Depends(require_api_key)) -> KnowledgeFileList:
    root = _upload_root()
    files = [
        _knowledge_file(path)
        for path in sorted(root.iterdir())
        if path.is_file() and not path.is_symlink() and path.suffix.lower() in settings.allowed_upload_suffixes
    ]
    return KnowledgeFileList(files=files, directory=str(root))


@app.post("/api/v1/knowledge/upload", response_model=UploadResponse, tags=["knowledge"])
async def upload_knowledge_file(
    request: Request,
    file: UploadFile = File(...),
    _: None = Depends(require_api_key),
) -> UploadResponse:
    engine: RagEngine = request.app.state.engine
    if not engine.repository.ready:
        await file.close()
        raise HTTPException(status_code=503, detail="The vector database is not ready.")

    max_bytes = settings.max_upload_mb * 1024 * 1024
    original_filename = file.filename
    try:
        content = await file.read(max_bytes + 1)
    finally:
        await file.close()
    if len(content) > max_bytes:
        raise HTTPException(status_code=413, detail=f"Files must be smaller than {settings.max_upload_mb} MB.")

    try:
        filename = safe_upload_name(original_filename)
        validate_upload_bytes(filename, content, settings.allowed_upload_suffixes)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error

    destination: Path | None = None
    try:
        destination = unique_upload_path(settings.upload_dir, filename)
        await asyncio.to_thread(destination.write_bytes, content)
        result = await engine.index_knowledge(reset=False)
    except Exception as error:
        logger.exception("Knowledge upload failed: %s", type(error).__name__)
        detail = "The file was saved but could not be indexed yet." if destination and destination.exists() else "The file could not be stored."
        raise HTTPException(status_code=503, detail=detail) from error

    assert destination is not None
    return UploadResponse(
        filename=destination.name,
        indexed_chunks=result.inserted,
        message="The course was added and the knowledge index was refreshed.",
    )


@app.post("/api/v1/knowledge/url", response_model=KnowledgeUrlResponse, tags=["knowledge"])
async def add_knowledge_url(
    payload: KnowledgeUrlRequest,
    request: Request,
    _: None = Depends(require_api_key),
) -> KnowledgeUrlResponse:
    """Fetch an external training page and index its readable text as a course."""

    engine: RagEngine = request.app.state.engine
    if not engine.repository.ready:
        raise HTTPException(status_code=503, detail="The vector database is not ready.")
    try:
        document = await fetch_web_document(payload.url, settings.max_upload_mb * 1024 * 1024)
    except WebSourceError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error

    destination: Path | None = None
    try:
        destination = unique_upload_path(settings.upload_dir, web_document_filename(document))
        await asyncio.to_thread(destination.write_text, web_document_markdown(document), "utf-8")
        result = await engine.index_knowledge(reset=False)
    except Exception as error:
        logger.exception("Knowledge URL import failed: %s", type(error).__name__)
        detail = "The page was saved but could not be indexed yet." if destination and destination.exists() else "The page could not be stored."
        raise HTTPException(status_code=503, detail=detail) from error

    return KnowledgeUrlResponse(
        filename=destination.name,
        indexed_chunks=result.inserted,
        message="The page was added and the knowledge index was refreshed.",
        title=document.title,
        url=document.url,
    )


@app.post("/api/v1/knowledge/reindex", response_model=ReindexResponse, tags=["knowledge"])
async def reindex_knowledge(
    request: Request,
    _: None = Depends(require_api_key),
) -> ReindexResponse:
    engine: RagEngine = request.app.state.engine
    try:
        result = await engine.index_knowledge(reset=True)
    except Exception as error:
        logger.exception("Knowledge reindex failed: %s", type(error).__name__)
        raise HTTPException(status_code=503, detail="The knowledge index could not be rebuilt.") from error
    return ReindexResponse(
        files=result.files,
        chunks=result.chunks,
        indexed=result.inserted,
        message="The knowledge index was rebuilt.",
    )


@app.delete("/api/v1/knowledge/files/{filename}", tags=["knowledge"])
async def delete_knowledge_file(
    request: Request,
    filename: str,
    _: None = Depends(require_api_key),
) -> dict[str, str | bool]:
    engine: RagEngine = request.app.state.engine
    try:
        safe_name = safe_upload_name(filename)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    if safe_name != filename or "/" in filename or "\\" in filename:
        raise HTTPException(status_code=400, detail="Invalid filename.")
    path = _upload_root() / safe_name
    if not path.is_file() or path.is_symlink():
        raise HTTPException(status_code=404, detail="Knowledge file not found.")
    try:
        await engine.delete_knowledge_source(_upload_source(path))
        await asyncio.to_thread(path.unlink)
    except Exception as error:
        logger.exception("Knowledge file deletion failed: %s", type(error).__name__)
        raise HTTPException(status_code=503, detail="The knowledge file could not be deleted.") from error
    return {"ok": True, "filename": safe_name}


@app.post("/api/v1/tts", response_model=TTSResponse, tags=["voice"])
async def tts(
    payload: TTSRequest,
    request: Request,
    _: None = Depends(require_api_key),
) -> TTSResponse:
    engine: RagEngine = request.app.state.engine
    if not engine.voice.available:
        raise HTTPException(status_code=503, detail="ElevenLabs voice is not configured.")
    try:
        audio = await engine.synthesize(payload.text)
    except Exception as error:
        logger.exception("Speech synthesis failed: %s", type(error).__name__)
        raise HTTPException(status_code=502, detail="Speech synthesis is temporarily unavailable.") from error
    return TTSResponse(
        audio_base64=base64.b64encode(audio).decode("ascii"),
        voice_id=get_settings().elevenlabs_voice_id,
    )
