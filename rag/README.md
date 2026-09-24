# Schoolify RAG study assistant

This folder contains the Schoolify Retrieval-Augmented Generation (RAG) service. It helps learners study by retrieving grounded study notes, asking a LangChain-powered LLM for an explanation, optionally generating a concept map, and optionally reading the answer with ElevenLabs.

It is deliberately separate from `schoolify-web`:

```text
Next.js /study UI ── server-side proxy ──┐
                                         ▼
                                  FastAPI RAG service :8000
                                  ├── /test standalone UI + course loader
                                  ├── LangChain + Groq-compatible ChatOpenAI
                                  ├── local multilingual embeddings
                                  ├── PostgreSQL + pgvector
                                  └── ElevenLabs text-to-speech
```

The service can start without an LLM or ElevenLabs key. In that mode it uses the bundled knowledge files and a safe deterministic fallback. The full experience is enabled when the corresponding secrets are configured.

## Features

- Retrieval from Markdown, text, and PDF study documents.
- PostgreSQL + pgvector storage and cosine similarity search.
- LangChain prompts and an OpenAI-compatible Groq model (`openai/gpt-oss-120b` by default, matching the existing chatbot).
- Local multilingual embeddings through FastEmbed, so no embedding provider key is required.
- Four study modes: `explain`, `summarize`, `quiz`, and `plan`.
- Optional concept graph returned as structured nodes/edges and rendered by the Next.js UI.
- Optional ElevenLabs multilingual voice synthesis through a separate TTS endpoint.
- Offline keyword fallback when the vector database is not ready.
- Optional shared API key and explicit CORS origins.
- A standalone `/test` UI in this folder for direct service testing and a course upload loader.

## Quick start with Docker

From this folder:

```powershell
cd C:\Users\moham\OneDrive\Desktop\schoolify3\SCHOOLIFY\rag
Copy-Item .env.example .env
# Add ELEVENLABS_API_KEY to .env when available. Leave LLM_API_KEY blank to reuse ../ai-service/.env.
docker compose up --build
```

The API will be available at `http://localhost:8000`; its OpenAPI documentation is at `http://localhost:8000/docs`. The standalone test page is at `http://localhost:8000/test` (or `/test-ui/`). It calls the same API as the Next.js `/study` page and includes a course upload panel. The bundled knowledge is automatically indexed into the pgvector database in a background task after startup, so the first model download does not block the health endpoint. `GET /health` reports `ingesting` while that task is running.

To rebuild the index after changing documents:

```powershell
docker compose exec api python -m app.ingest --reset
```

## Run without Docker

Start a PostgreSQL instance with pgvector, configure `.env`, then:

```powershell
cd C:\Users\moham\OneDrive\Desktop\schoolify3\SCHOOLIFY\rag
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m app.ingest --reset
uvicorn app.main:app --reload --port 8000
```

For development only, the service can also run with the bundled files and no database/LLM secrets. It will return a degraded health status and use keyword retrieval.

## API

### Ask a study question

```http
POST /api/v1/ask
Content-Type: application/json
```

```json
{
  "question": "Explique-moi la différence entre active recall et reread",
  "mode": "explain",
  "level": "intermediaire",
  "include_graph": true,
  "history": []
}
```

The response contains `answer`, `sources`, an optional `graph`, and capability flags. `message` is also accepted as a shorter request field.

### Stream an answer

```http
POST /api/v1/ask/stream
Content-Type: application/json
```

Same body as `/api/v1/ask`. The response is newline-delimited JSON (`application/x-ndjson`): one `sources` event, then `delta` events with text chunks (or one `replace` event for the offline fallback), then a `done` event holding the full `/ask` response. An `error` event is sent if generation fails. The `/test` UI renders these chunks as live, sanitized Markdown (Response-style, with `marked` + `DOMPurify` vendored in `ui/vendor`) and falls back to `/api/v1/ask` when streaming is unavailable.

Answers are intentionally short (about 80–150 words): a direct answer, a few key bullets and an optional example.

### Import an external training page

```http
POST /api/v1/knowledge/url
Content-Type: application/json
```

```json
{ "url": "https://example.com/course/lesson-1" }
```

The service fetches the page (HTML, plain text or PDF), extracts its readable text, stores it as a Markdown file in `data/knowledge/uploads` and indexes it, so the next questions are answered from that page. Only public `http(s)` addresses are accepted (private, loopback and link-local targets are refused, including after redirects), and the download is limited to `MAX_UPLOAD_MB`. Pages that render their content only with JavaScript cannot be read. Imported pages appear in the file list and can be deleted like uploads.

### Generate speech

```http
POST /api/v1/tts
Content-Type: application/json
```

```json
{ "text": "La réponse à écouter..." }
```

The response contains base64 MP3 data in `audio_base64`. The Next.js study UI uses this endpoint when the learner presses **Écouter**.

### Health

`GET /health` reports whether the vector database, LLM, and voice provider are configured. It does not expose secrets.

### Course upload loader

The standalone test page exposes a drag-and-drop loader. Files are accepted by these key-aware endpoints:

```http
GET    /api/v1/knowledge/files
POST   /api/v1/knowledge/upload       # multipart/form-data: file=<course>
POST   /api/v1/knowledge/reindex
DELETE /api/v1/knowledge/files/{filename}
```

For example, from PowerShell:

```powershell
curl.exe -X POST -F "file=@C:\path\to\course.pdf" http://localhost:8000/api/v1/knowledge/upload
```

`.md`, `.txt`, and `.pdf` files are supported. Uploads are stored in `data/knowledge/uploads` and included in the next pgvector index. The Docker Compose named volume `schoolify_rag_uploads` keeps them across container rebuilds; the upload directory is excluded from the Docker build context so course files are not baked into images. Uploads are validated, size-limited, and never executed or exposed as static files. If `RAG_API_KEY` is configured, enter it in the test page's **Service key** field or send `X-RAG-API-Key` with the request.

## Next.js integration

The web application proxies requests server-side, so the RAG URL and optional service key are not exposed to the browser. Add these variables to `schoolify-web/.env.local`:

```env
RAG_API_URL=http://localhost:8000
RAG_API_KEY=
```

The UI is available at `/study`. The client sends requests to the local Next.js routes:

- `POST /api/rag/ask`
- `POST /api/rag/chat` (compatibility alias for the existing widget)
- `POST /api/rag/tts`

If `RAG_API_KEY` is set in both services, the proxy sends it as `X-RAG-API-Key`.

## Adding study material

The easiest route is the **Knowledge loader** on `http://localhost:8000/test`: upload a `.md`, `.txt`, or `.pdf` course file and the service indexes it immediately. Files are stored in `data/knowledge/uploads` (or the configured `UPLOAD_DIR` when it remains inside `KNOWLEDGE_DIR`) and are persisted by the `schoolify_rag_uploads` Docker volume.

You can also add Markdown, text, or PDF files manually under `data/knowledge/`. Each file is split into overlapping chunks and indexed by source, title, and checksum. Re-run:

```powershell
python -m app.ingest --reset
```

The `source` values returned to the UI are relative knowledge paths, which makes citations easy to display and later replace with authenticated document URLs.

## Configuration notes

- `LLM_API_KEY` is a Groq API key. Leave it blank in the local RAG `.env` to reuse `LLM_API_KEY` from `../ai-service/.env`; the Docker Compose file also loads that sibling env file when present. `LLM_MODEL` defaults to the chatbot model `openai/gpt-oss-120b`. `LLM_BASE_URL` can be changed to another OpenAI-compatible provider.
- Never commit `.env` files or real provider keys. The ElevenLabs key belongs in the ignored `rag/.env`, not `.env.example`.
- `ELEVENLABS_API_KEY` is optional. Without it the text answer still works and the UI hides the voice action.
- `RAG_API_KEY` is optional in local development; set it when exposing the service outside the Next.js proxy.
- `DATABASE_URL` in Docker Compose is supplied to the API container with the `db` hostname by default. The Windows `.env.example` value uses `localhost:5435`; set `RAG_DOCKER_DATABASE_URL` only if you override the container database URL.
- If the embedding model or dimension changes, use a new vector table or run a migration; the default vector dimension is `384`.

## Tests

```powershell
pip install -r requirements-dev.txt
pytest
```

The unit tests cover graph parsing and offline knowledge retrieval. API and vector database integration can be tested after starting Docker Compose.
