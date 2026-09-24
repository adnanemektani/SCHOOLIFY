import io
import re
import uuid
from pathlib import Path


def safe_upload_name(filename: str | None) -> str:
    """Return a bounded basename safe for the upload directory."""

    raw_name = Path(filename or "").name.strip()
    if not raw_name or raw_name in {".", ".."}:
        raise ValueError("A filename is required.")
    suffix = Path(raw_name).suffix.lower()
    stem = Path(raw_name).stem
    safe_stem = re.sub(r"[^A-Za-z0-9._-]+", "-", stem).strip(".-") or "course"
    safe_stem = safe_stem[:100]
    return f"{safe_stem}{suffix}"


def unique_upload_path(directory: str | Path, filename: str | None) -> Path:
    root = Path(directory)
    root.mkdir(parents=True, exist_ok=True)
    safe_name = safe_upload_name(filename)
    candidate = root / safe_name
    if not candidate.exists():
        return candidate
    path = Path(safe_name)
    candidate = root / f"{path.stem}-{uuid.uuid4().hex[:8]}{path.suffix}"
    return candidate


def validate_upload_bytes(filename: str, content: bytes, allowed_suffixes: set[str]) -> None:
    suffix = Path(filename).suffix.lower()
    if suffix not in allowed_suffixes:
        allowed = ", ".join(sorted(allowed_suffixes))
        raise ValueError(f"Unsupported file type. Allowed types: {allowed}.")
    if not content:
        raise ValueError("The uploaded file is empty.")
    if suffix in {".md", ".txt"}:
        try:
            content.decode("utf-8")
        except UnicodeDecodeError as error:
            raise ValueError("Text files must use UTF-8 encoding.") from error
    if suffix == ".pdf":
        if not content.startswith(b"%PDF-"):
            raise ValueError("The uploaded file is not a valid PDF.")
        try:
            from pypdf import PdfReader

            PdfReader(io.BytesIO(content))
        except Exception as error:
            raise ValueError("The uploaded PDF could not be read.") from error
