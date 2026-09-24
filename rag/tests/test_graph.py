from app.graph import fallback_graph, normalise_graph, parse_graph_json, should_render_graph


def test_graph_parser_accepts_markdown_fence() -> None:
    raw = '''```json
    {"title":"AI map","nodes":[{"id":"ai","label":"AI","kind":"topic"}],"edges":[]}
    ```'''
    assert parse_graph_json(raw)["title"] == "AI map"


def test_graph_normalisation_adds_safe_edges() -> None:
    graph = normalise_graph(
        '{"nodes":[{"id":"a","label":"A"},{"id":"b","label":"B"}],"edges":[]}',
        "What is AI?",
        "AI",
    )
    assert [node.id for node in graph.nodes] == ["a", "b"]
    assert graph.edges[0].source == "a"
    assert graph.edges[0].target == "b"


def test_graph_fallback_is_available_without_llm() -> None:
    graph = fallback_graph("How do I learn AI?", "AI")
    assert len(graph.nodes) == 4
    assert len(graph.edges) == 3
    assert should_render_graph("explain", "show me a concept map", True)
    assert not should_render_graph("quiz", "test me", True)
    assert not should_render_graph("explain", "explain AI", False)
