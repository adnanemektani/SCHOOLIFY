import asyncio
import logging
import sys
from collections.abc import AsyncIterator, Coroutine
from typing import Any, TypeVar

from langchain_core.documents import Document

from .async_compat import SelectorLoopRunner
from .config import Settings
from .graph import fallback_graph, graph_prompt, normalise_graph, should_render_graph
from .ingest import IngestResult, ingest_directory
from .knowledge import keyword_search, knowledge_documents
from .llm import answer_chain, build_llm, graph_chain
from .schemas import Source, StudyGraph, StudyRequest, StudyResponse
from .vector_store import LocalMultilingualEmbeddings, VectorRepository
from .voice import VoiceService


logger = logging.getLogger(__name__)
ResultT = TypeVar("ResultT")


class RagEngine:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.embeddings = LocalMultilingualEmbeddings(settings.embedding_model, settings.resolved_embedding_cache_dir)
        self.repository = VectorRepository(settings)
        self.llm = build_llm(settings)
        self.voice = VoiceService(settings)
        self.fallback_documents: list[Document] = []
        self._db_runner: SelectorLoopRunner | None = None
        self._ingest_task: asyncio.Task[None] | None = None
        self._index_lock = asyncio.Lock()
        self._answer_chain = answer_chain(self.llm) if self.llm else None
        self._graph_chain = graph_chain(self.llm) if self.llm else None

    async def _run_db(self, coroutine: Coroutine[Any, Any, ResultT]) -> ResultT:
        if self._db_runner:
            return await asyncio.to_thread(self._db_runner.run, coroutine)
        return await coroutine

    def _should_use_selector_runner(self) -> bool:
        proactor_type = getattr(asyncio, "ProactorEventLoop", None)
        return bool(sys.platform == "win32" and proactor_type and isinstance(asyncio.get_running_loop(), proactor_type))

    async def start(self) -> None:
        self.fallback_documents = knowledge_documents(
            self.settings.knowledge_dir,
            self.settings.chunk_size,
            self.settings.chunk_overlap,
        )
        if self._should_use_selector_runner():
            self._db_runner = SelectorLoopRunner()
        try:
            await self._run_db(self.repository.connect())
        except Exception as error:  # The service can still answer from bundled files.
            logger.warning("RAG database unavailable: %s", type(error).__name__)
            await self._run_db(self.repository.close())

        if self.repository.ready and self.settings.auto_ingest:
            # Do not block HTTP startup while a first model download or index runs.
            self._ingest_task = asyncio.create_task(self._auto_ingest())

    async def index_knowledge(self, reset: bool = False) -> IngestResult:
        if not self.repository.ready:
            raise RuntimeError("Vector database is not ready")
        async with self._index_lock:
            return await self._run_db(
                ingest_directory(
                    self.settings,
                    repository=self.repository,
                    embedder=self.embeddings,
                    reset=reset,
                )
            )

    async def delete_knowledge_source(self, source: str) -> None:
        if not self.repository.ready:
            raise RuntimeError("Vector database is not ready")
        async with self._index_lock:
            await self._run_db(self.repository.delete_source(source))

    async def _auto_ingest(self) -> None:
        try:
            result = await self.index_knowledge()
            logger.info("Indexed %s RAG chunks from %s files", result.chunks, result.files)
        except asyncio.CancelledError:
            raise
        except Exception as error:
            logger.warning("RAG auto-ingest failed: %s", type(error).__name__)

    async def close(self) -> None:
        if self._ingest_task and not self._ingest_task.done():
            self._ingest_task.cancel()
            try:
                await self._ingest_task
            except asyncio.CancelledError:
                pass
        self._ingest_task = None
        await self._run_db(self.repository.close())
        if self._db_runner:
            self._db_runner.close()
            self._db_runner = None

    async def count_documents(self) -> int:
        if not self.repository.ready:
            return 0
        return await self._run_db(self.repository.count())

    async def retrieve(self, question: str) -> tuple[list[Document], bool]:
        if self.repository.ready:
            try:
                embedding = await asyncio.to_thread(self.embeddings.embed_query, question)
                documents = await self._run_db(self.repository.search(embedding, self.settings.max_context_documents))
                if documents:
                    return documents, True
            except Exception as error:
                logger.warning("Vector retrieval failed, using local fallback: %s", type(error).__name__)
        return keyword_search(question, self.fallback_documents, self.settings.max_context_documents), False

    def _chain_input(self, request: StudyRequest, context: str) -> dict[str, Any]:
        return {
            "mode": request.mode,
            "level": request.level,
            "subject": request.subject or "Non précisé",
            "question": request.question,
            "history": self._format_history(request.history) or "Aucune conversation précédente.",
            "context": context,
        }

    async def _build_graph(self, request: StudyRequest, context: str) -> StudyGraph | None:
        if not should_render_graph(request.mode, request.question or "", request.include_graph):
            return None
        graph: StudyGraph | None = None
        if self._graph_chain is not None:
            try:
                raw_graph = await self._graph_chain.ainvoke({"request": graph_prompt(request.question or "", request.subject, context)})
                graph = normalise_graph(raw_graph, request.question or "", request.subject)
            except Exception as error:
                logger.warning("Graph generation failed: %s", type(error).__name__)
        return graph or fallback_graph(request.question or "", request.subject)

    def _response(
        self,
        request: StudyRequest,
        answer: str,
        documents: list[Document],
        graph: StudyGraph | None,
        llm_used: bool,
        vector_store_used: bool,
    ) -> StudyResponse:
        clean_answer = answer.strip()
        return StudyResponse(
            answer=clean_answer,
            reply=clean_answer,
            mode=request.mode,
            level=request.level,
            sources=[self._source(document) for document in documents],
            graph=graph,
            llm_used=llm_used,
            vector_store_used=vector_store_used,
            voice_available=self.voice.available,
            degraded=not llm_used,
        )

    async def answer(self, request: StudyRequest) -> StudyResponse:
        documents, vector_store_used = await self.retrieve(request.question or "")
        context = self._format_context(documents)

        answer = ""
        llm_used = False
        if self._answer_chain is not None:
            try:
                answer = await self._answer_chain.ainvoke(self._chain_input(request, context))
                llm_used = bool(answer.strip())
            except Exception as error:
                logger.warning("LLM answer failed: %s", type(error).__name__)
        if not answer.strip():
            answer = self._fallback_answer(request, documents)

        graph = await self._build_graph(request, context)
        return self._response(request, answer, documents, graph, llm_used, vector_store_used)

    async def answer_stream(self, request: StudyRequest) -> AsyncIterator[dict[str, Any]]:
        """Yield the answer as it is generated: sources first, then text deltas, then the final payload."""

        documents, vector_store_used = await self.retrieve(request.question or "")
        context = self._format_context(documents)
        yield {"type": "sources", "sources": [self._source(document).model_dump() for document in documents]}

        answer = ""
        llm_used = False
        if self._answer_chain is not None:
            try:
                async for delta in self._answer_chain.astream(self._chain_input(request, context)):
                    if delta:
                        answer += delta
                        yield {"type": "delta", "text": delta}
                llm_used = bool(answer.strip())
            except Exception as error:
                logger.warning("LLM streaming answer failed: %s", type(error).__name__)
        if not answer.strip():
            answer = self._fallback_answer(request, documents)
            yield {"type": "replace", "text": answer}

        graph = await self._build_graph(request, context)
        response = self._response(request, answer, documents, graph, llm_used, vector_store_used)
        yield {"type": "done", "response": response.model_dump()}

    async def synthesize(self, text: str) -> bytes:
        return await self.voice.synthesize(text)

    def status(self) -> dict[str, Any]:
        return {
            "database": self.repository.ready,
            "llm": self.llm is not None,
            "voice": self.voice.available,
            "fallback_documents": len(self.fallback_documents),
            "ingesting": bool(self._ingest_task and not self._ingest_task.done()),
        }

    @staticmethod
    def _format_context(documents: list[Document]) -> str:
        if not documents:
            return "No indexed study context is available. Be explicit about this limitation."
        blocks = []
        for index, document in enumerate(documents, start=1):
            source = document.metadata.get("source", "unknown")
            title = document.metadata.get("title", source)
            content = document.page_content.strip()
            blocks.append(f"[{index}] {title} ({source})\n{content[:1600]}")
        return "\n\n".join(blocks)

    def _format_history(self, history: list[Any]) -> str:
        limit = self.settings.max_history_messages
        if limit <= 0:
            return ""
        return "\n".join(f"{item.role}: {item.content}" for item in history[-limit:])

    @staticmethod
    def _source(document: Document) -> Source:
        content = " ".join(document.page_content.split())
        score = document.metadata.get("score")
        return Source(
            title=str(document.metadata.get("title", document.metadata.get("source", "Study note"))),
            source=str(document.metadata.get("source", "unknown")),
            snippet=content[:360],
            score=float(score) if isinstance(score, (int, float)) else None,
        )

    @staticmethod
    def _fallback_answer(request: StudyRequest, documents: list[Document]) -> str:
        question = request.question or "ta question"
        if not documents:
            return (
                f"Je n’ai pas encore de document indexé pour répondre précisément à « {question} ». "
                "Démarre par une définition simple, puis cherche un exemple et transforme-le en question de révision."
            )

        snippets = "\n".join(f"- {document.page_content[:260]}" for document in documents[:3])
        if request.mode == "quiz":
            return (
                f"Pour réviser « {question} », commence par ces éléments :\n{snippets}\n\n"
                "1. Quelle est l’idée essentielle ?\n2. Quel exemple concret peux-tu réexpliquer ?\n"
                "3. Quelle erreur courante dois-tu éviter ?"
            )
        if request.mode == "plan":
            return (
                f"Voici un plan de révision pour « {question} » :\n"
                "1. Lis le point de départ dans les notes ci-dessous.\n"
                "2. Reformule chaque idée avec tes propres mots.\n"
                "3. Crée un exemple et une mini-question de contrôle.\n\n"
                f"Points à réviser :\n{snippets}"
            )
        if request.mode == "summarize":
            return f"Résumé express de « {question} » :\n{snippets}\n\nEn une phrase : relie ces idées à un exemple que tu pourrais expliquer à un ami."
        return (
            f"Pour comprendre « {question} », pars de cette idée simple :\n{snippets}\n\n"
            "Now relie ces points à un exemple concret, puis explique la différence entre la définition et l’application."
        )
