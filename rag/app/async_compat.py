import asyncio
import threading
from collections.abc import Coroutine
from typing import Any, TypeVar


ResultT = TypeVar("ResultT")


class SelectorLoopRunner:
    """Run psycopg async work off a Windows Proactor Uvicorn loop."""

    def __init__(self) -> None:
        self.loop = asyncio.SelectorEventLoop()
        self._thread = threading.Thread(target=self._run_loop, name="schoolify-rag-db", daemon=True)
        self._thread.start()

    def _run_loop(self) -> None:
        asyncio.set_event_loop(self.loop)
        self.loop.run_forever()

    def run(self, coroutine: Coroutine[Any, Any, ResultT]) -> ResultT:
        future = asyncio.run_coroutine_threadsafe(coroutine, self.loop)
        return future.result()

    def close(self) -> None:
        if not self.loop.is_closed():
            self.loop.call_soon_threadsafe(self.loop.stop)
            self._thread.join(timeout=5)
            self.loop.close()
