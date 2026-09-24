import argparse
import asyncio
import hashlib
from dataclasses import dataclass
from pathlib import Path

from langchain_core.documents import Document

from .config import Settings, get_settings
from .knowledge import load_knowledge_chunks
from .vector_store import LocalMultilingualEmbeddings, VectorRepository


@dataclass(frozen=True)
class IngestResult:
    files: int
    chunks: int
    inserted: int


def _with_checksums(documents: list[Document]) -> list[Document]:
    checked: list[Document] = []
    for document in documents:
        source = str(document.metadata.get("source", "unknown"))
        checksum = hashlib.sha256(f"{source}\n{document.page_content}".encode("utf-8")).hexdigest()
        checked.append(Document(page_content=document.page_content, metadata={**document.metadata, "checksum": checksum}))
    return checked


async def ingest_directory(
    settings: Settings,
    directory: str | Path | None = None,
    reset: bool = False,
    repository: VectorRepository | None = None,
    embedder: LocalMultilingualEmbeddings | None = None,
) -> IngestResult:
    knowledge_directory = Path(directory or settings.knowledge_dir)
    chunks = load_knowledge_chunks(knowledge_directory, settings.chunk_size, settings.chunk_overlap)
    if not chunks:
        raise RuntimeError(f"No supported knowledge files found in {knowledge_directory}")

    documents = _with_checksums(
        [
            Document(
                page_content=chunk.content,
                metadata={**chunk.metadata, "content": chunk.content},
            )
            for chunk in chunks
        ]
    )
    own_repository = repository is None
    active_repository = repository or VectorRepository(settings)
    active_embedder = embedder or LocalMultilingualEmbeddings(settings.embedding_model, settings.resolved_embedding_cache_dir)

    try:
        if own_repository:
            await active_repository.connect()
        if reset:
            await active_repository.clear()
        embeddings = await asyncio.to_thread(active_embedder.embed_documents, [doc.page_content for doc in documents])
        inserted = await active_repository.upsert_documents(documents, embeddings)
        return IngestResult(files=len({doc.metadata["source"] for doc in documents}), chunks=len(documents), inserted=inserted)
    finally:
        if own_repository:
            await active_repository.close()


async def _run(args: argparse.Namespace) -> IngestResult:
    settings = get_settings()
    result = await ingest_directory(settings, directory=args.directory, reset=args.reset)
    print(f"Indexed {result.inserted} chunks from {result.files} files.")
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description="Index Schoolify study knowledge into PostgreSQL/pgvector.")
    parser.add_argument("--directory", help="Knowledge directory; defaults to KNOWLEDGE_DIR.")
    parser.add_argument("--reset", action="store_true", help="Delete existing RAG documents before indexing.")
    args = parser.parse_args()
    asyncio.run(_run(args))


if __name__ == "__main__":
    main()
