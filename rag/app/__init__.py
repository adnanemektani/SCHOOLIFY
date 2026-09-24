"""Schoolify retrieval-augmented study assistant."""

import asyncio
import sys


# psycopg's async driver does not support Windows' default Proactor loop.
# Use a selector loop for local Windows development; Linux/Docker are unchanged.
if sys.platform == "win32" and hasattr(asyncio, "WindowsSelectorEventLoopPolicy"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

__version__ = "0.1.0"
