from app.knowledge import keyword_search, load_knowledge_chunks


def test_knowledge_loader_chunks_markdown(tmp_path) -> None:
    path = tmp_path / "note.md"
    path.write_text("# Retrieval\n\nRAG combines retrieval and generation.\n", encoding="utf-8")
    chunks = load_knowledge_chunks(tmp_path, chunk_size=200, overlap=20)
    assert len(chunks) == 1
    assert chunks[0].title == "Retrieval"
    assert chunks[0].source == "note.md"


def test_keyword_search_ranks_matching_note() -> None:
    from langchain_core.documents import Document

    documents = [
        Document(page_content="A wallet protects a private key.", metadata={"source": "wallet.md", "title": "Wallet"}),
        Document(page_content="RAG retrieves passages before generation.", metadata={"source": "rag.md", "title": "RAG"}),
    ]
    results = keyword_search("How does RAG retrieve passages?", documents, limit=1)
    assert results[0].metadata["source"] == "rag.md"
