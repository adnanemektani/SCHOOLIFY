from io import BytesIO
from pathlib import Path

import pytest
from pypdf import PdfWriter

from app.uploads import safe_upload_name, unique_upload_path, validate_upload_bytes


def test_upload_name_removes_path_and_normalizes_extension() -> None:
    assert safe_upload_name("../../My Course.MD") == "My-Course.md"
    assert safe_upload_name("résumé final.txt") == "r-sum-final.txt"


def test_upload_name_rejects_empty_or_dot_names() -> None:
    with pytest.raises(ValueError):
        safe_upload_name("")
    with pytest.raises(ValueError):
        safe_upload_name("..")


def test_upload_bytes_validate_type_encoding_and_pdf_signature() -> None:
    validate_upload_bytes("notes.md", b"# Notes\n", {".md", ".pdf"})
    writer = PdfWriter()
    writer.add_blank_page(width=72, height=72)
    pdf_buffer = BytesIO()
    writer.write(pdf_buffer)
    validate_upload_bytes("paper.pdf", pdf_buffer.getvalue(), {".md", ".pdf"})

    with pytest.raises(ValueError):
        validate_upload_bytes("notes.md", b"\xff\xfe", {".md"})
    with pytest.raises(ValueError):
        validate_upload_bytes("paper.pdf", b"not a pdf", {".pdf"})
    with pytest.raises(ValueError):
        validate_upload_bytes("archive.zip", b"content", {".md", ".pdf"})


def test_unique_upload_path_does_not_overwrite_existing_file(tmp_path: Path) -> None:
    first = unique_upload_path(tmp_path, "course.md")
    first.write_text("first", encoding="utf-8")
    second = unique_upload_path(tmp_path, "course.md")
    assert first != second
    assert second.parent == tmp_path
    assert second.suffix == ".md"
