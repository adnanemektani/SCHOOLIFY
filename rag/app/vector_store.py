import uuid
from typing import Any

from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings
from pgvector.psycopg import register_vector_async
from psycopg import AsyncConnection
from psycopg.types.json import Jsonb
from psycopg_pool import AsyncConnectionPool

from .config import Settings


TABLE_NAME = "rag_documents"


class LocalMultilingualEmbeddings(Embeddings):
    """LangChain embedding adapter backed by a small ONNX/FastEmbed model."""

    def __init__(self, model_name: str, cache_dir: str) -> None:
        self.model_name = model_name
        self.cache_dir = cache_dir
        self._model: Any = None

    def _get_model(self) -> Any:
        if self._model is None:
            from fastembed import TextEmbedding

            self._model = TextEmbedding(model_name=self.model_name, cache_dir=self.cache_dir)
        return self._model

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        vectors = self._get_model().embed(texts)
        return [vector.tolist() for vector in vectors]

    def embed_query(self, text: str) -> list[float]:
        vector = next(iter(self._get_model().embed([text])))
        return vector.tolist()


class VectorRepository:
    """Small async PostgreSQL/pgvector repository used by the RAG service."""

    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.pool: AsyncConnectionPool | None = None
        self._ready = False

    @property
    def ready(self) -> bool:
        return self._ready and self.pool is not None

    async def _configure_connection(self, connection: AsyncConnection) -> None:
        await register_vector_async(connection)

    async def connect(self) -> None:
        if self.ready:
            return

        # Registering the pgvector adapter requires the extension to exist first.
        # Create it through a short-lived connection before opening the pool.
        bootstrap = await AsyncConnection.connect(self.settings.database_url)
        try:
            await bootstrap.execute("CREATE EXTENSION IF NOT EXISTS vector")
            await bootstrap.commit()
        finally:
            await bootstrap.close()

        self.pool = AsyncConnectionPool(
            conninfo=self.settings.database_url,
            min_size=1,
            max_size=5,
            open=False,
            configure=self._configure_connection,
        )
        await self.pool.open(wait=True)
        await self._create_schema()
        self._ready = True

    async def _create_schema(self) -> None:
        if not self.pool:
            raise RuntimeError("Database pool is not initialized")
        dimension = int(self.settings.embedding_dimensions)
        create_table = f"""
            CREATE TABLE IF NOT EXISTS {TABLE_NAME} (
                id UUID PRIMARY KEY,
                source TEXT NOT NULL,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                metadata JSONB NOT NULL DEFAULT '{{}}'::jsonb,
                embedding vector({dimension}) NOT NULL,
                checksum TEXT NOT NULL UNIQUE,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        """
        async with self.pool.connection() as connection:
            await connection.execute("CREATE EXTENSION IF NOT EXISTS vector")
            await connection.execute(create_table)
            await connection.execute(
                f"CREATE INDEX IF NOT EXISTS {TABLE_NAME}_embedding_idx ON {TABLE_NAME} USING hnsw (embedding vector_cosine_ops)"
            )
            await connection.commit()

    async def close(self) -> None:
        if self.pool:
            await self.pool.close()
        self.pool = None
        self._ready = False

    async def clear(self) -> None:
        self._require_pool()
        assert self.pool is not None
        async with self.pool.connection() as connection:
            await connection.execute(f"DELETE FROM {TABLE_NAME}")
            await connection.commit()

    async def count(self) -> int:
        if not self.ready:
            return 0
        assert self.pool is not None
        async with self.pool.connection() as connection:
            row = await (await connection.execute(f"SELECT COUNT(*) FROM {TABLE_NAME}")).fetchone()
            return int(row[0]) if row else 0

    async def delete_source(self, source: str) -> None:
        self._require_pool()
        assert self.pool is not None
        async with self.pool.connection() as connection:
            await connection.execute(f"DELETE FROM {TABLE_NAME} WHERE source = %s", (source,))
            await connection.commit()

    async def upsert_documents(self, documents: list[Document], embeddings: list[list[float]]) -> int:
        self._require_pool()
        if len(documents) != len(embeddings):
            raise ValueError("Every document must have one embedding")
        if not documents:
            return 0

        assert self.pool is not None
        async with self.pool.connection() as connection:
            async with connection.transaction():
                for document, embedding in zip(documents, embeddings):
                    metadata = dict(document.metadata)
                    source = str(metadata.get("source", "unknown"))
                    title = str(metadata.get("title", source))
                    checksum = str(metadata["checksum"])
                    await connection.execute(
                        f"""
                        INSERT INTO {TABLE_NAME} (id, source, title, content, metadata, embedding, checksum)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (checksum) DO UPDATE SET
                            source = EXCLUDED.source,
                            title = EXCLUDED.title,
                            content = EXCLUDED.content,
                            metadata = EXCLUDED.metadata,
                            embedding = EXCLUDED.embedding,
                            updated_at = NOW()
                        """,
                        (str(uuid.uuid4()), source, title, document.page_content, Jsonb(metadata), embedding, checksum),
                    )
        return len(documents)

    async def search(self, embedding: list[float], limit: int) -> list[Document]:
        self._require_pool()
        assert self.pool is not None
        async with self.pool.connection() as connection:
            cursor = await connection.execute(
                f"""
                WITH query_vector AS (SELECT %s::vector AS embedding)
                SELECT id::text, source, title, content, metadata,
                       1 - ({TABLE_NAME}.embedding <=> query_vector.embedding) AS score
                FROM {TABLE_NAME}, query_vector
                ORDER BY {TABLE_NAME}.embedding <=> query_vector.embedding
                LIMIT %s
                """,
                (embedding, limit),
            )
            rows = await cursor.fetchall()

        results: list[Document] = []
        for row in rows:
            metadata = dict(row[4] or {})
            metadata.update({"source": row[1], "title": row[2], "score": float(row[5])})
            results.append(Document(page_content=row[3], metadata=metadata))
        return results

    def _require_pool(self) -> None:
        if not self.ready:
            raise RuntimeError("Vector database is not ready")
