import re
from dataclasses import dataclass
from pathlib import Path

from langchain_core.documents import Document


SUPPORTED_SUFFIXES = {".md", ".txt", ".pdf"}


@dataclass(frozen=True)
class KnowledgeChunk:
    source: str
    title: str
    content: str
    metadata: dict[str, str]


def _title_from_text(text: str, fallback: str) -> str:
    for line in text.splitlines():
        clean = line.strip().lstrip("# ").strip()
        if clean:
            return clean[:160]
    return fallback


def _normalise_whitespace(text: str) -> str:
    return re.sub(r"[ \t]+", " ", text).strip()


def split_text(text: str, chunk_size: int = 1200, overlap: int = 160) -> list[str]:
    """Split Markdown into overlapping chunks without losing paragraph boundaries."""

    if overlap >= chunk_size:
        raise ValueError("overlap must be smaller than chunk_size")

    text = _normalise_whitespace(text)
    if not text:
        return []

    paragraphs = [part.strip() for part in re.split(r"\n\s*\n", text) if part.strip()]
    chunks: list[str] = []
    current = ""

    def flush() -> None:
        nonlocal current
        if current:
            chunks.append(current.strip())
            current = ""

    for paragraph in paragraphs:
        if len(paragraph) > chunk_size:
            flush()
            words = paragraph.split()
            start = 0
            while start < len(words):
                end = start
                length = 0
                while end < len(words):
                    next_length = length + len(words[end]) + (1 if end > start else 0)
                    if next_length > chunk_size and end > start:
                        break
                    length = next_length
                    end += 1
                piece = " ".join(words[start:end])
                if piece:
                    chunks.append(piece)
                if end >= len(words):
                    break
                start = max(start + 1, end - max(1, overlap // 5))
            continue

        candidate = f"{current}\n\n{paragraph}".strip() if current else paragraph
        if len(candidate) > chunk_size:
            flush()
            current = paragraph
        else:
            current = candidate

    flush()
    return chunks


def _read_knowledge_file(path: Path) -> str:
    suffix = path.suffix.lower()
    if suffix in {".md", ".txt"}:
        return path.read_text(encoding="utf-8")
    if suffix == ".pdf":
        from pypdf import PdfReader

        reader = PdfReader(str(path))
        pages: list[str] = []
        for page in reader.pages:
            extracted = (page.extract_text() or "").strip()
            if extracted:
                pages.append(extracted)
        return "\n\n".join(pages)
    raise ValueError(f"Unsupported knowledge file type: {suffix}")


def load_knowledge_chunks(directory: str | Path, chunk_size: int = 1200, overlap: int = 160) -> list[KnowledgeChunk]:
    root = Path(directory)
    if not root.exists():
        return []

    chunks: list[KnowledgeChunk] = []
    for path in sorted(root.rglob("*")):
        if path.suffix.lower() not in SUPPORTED_SUFFIXES or not path.is_file():
            continue
        relative_source = path.relative_to(root).as_posix()
        try:
            raw = _read_knowledge_file(path)
        except Exception as error:
            raise ValueError(f"Could not read knowledge file {relative_source}.") from error
        title = _title_from_text(raw, path.stem.replace("-", " ").title())
        for index, content in enumerate(split_text(raw, chunk_size, overlap), start=1):
            chunks.append(
                KnowledgeChunk(
                    source=relative_source,
                    title=title,
                    content=content,
                    metadata={
                        "source": relative_source,
                        "title": title,
                        "chunk": str(index),
                        "file_type": path.suffix.lower().lstrip("."),
                    },
                )
            )
    return chunks


def knowledge_documents(directory: str | Path, chunk_size: int = 1200, overlap: int = 160) -> list[Document]:
    return [
        Document(
            page_content=chunk.content,
            metadata={**chunk.metadata, "content": chunk.content},
        )
        for chunk in load_knowledge_chunks(directory, chunk_size, overlap)
    ]


def _tokens(value: str) -> set[str]:
    return {
        token
        for token in re.findall(r"[\wÀ-ÿ؀-ۿ]+", value.casefold())
        if len(token) > 2
    }


def keyword_search(query: str, documents: list[Document], limit: int = 5) -> list[Document]:
    """Small offline fallback when the optional database is not running yet."""

    query_tokens = _tokens(query)
    scored: list[tuple[float, Document]] = []
    for document in documents:
        text = document.page_content
        document_tokens = _tokens(text)
        overlap = len(query_tokens & document_tokens)
        phrase_bonus = 2 if query.casefold() in text.casefold() else 0
        score = overlap + phrase_bonus
        if score:
            scored.append((score, document))

    scored.sort(key=lambda item: item[0], reverse=True)
    selected = scored[:limit] if scored else documents[:limit]
    if not scored:
        return [
            Document(
                page_content=document.page_content,
                metadata={**document.metadata, "score": 0.0, "fallback": True},
            )
            for document in selected
        ]
    return [
        Document(
            page_content=document.page_content,
            metadata={**document.metadata, "score": float(score), "fallback": True},
        )
        for score, document in selected
    ]
