import json
import re
from typing import Any

from .schemas import GraphEdge, GraphNode, StudyGraph


GRAPH_KEYWORDS = {
    "graphe",
    "graphique",
    "carte",
    "relation",
    "relier",
    "visual",
    "schema",
    "mind map",
    "mindmap",
}


def should_render_graph(mode: str, question: str, requested: bool) -> bool:
    if not requested or mode == "quiz":
        return False
    normalized = question.casefold()
    return mode in {"explain", "plan"} or any(keyword in normalized for keyword in GRAPH_KEYWORDS)


def _clean_label(value: Any, fallback: str) -> str:
    if not isinstance(value, str):
        return fallback
    label = re.sub(r"\s+", " ", value).strip()
    return label[:80] or fallback


def parse_graph_json(raw: str) -> dict[str, Any] | None:
    """Accept JSON from an LLM even when it wraps it in a Markdown fence."""

    candidate = raw.strip()
    if candidate.startswith("```"):
        candidate = re.sub(r"^```(?:json)?\s*|\s*```$", "", candidate, flags=re.IGNORECASE)
    start = candidate.find("{")
    end = candidate.rfind("}")
    if start < 0 or end <= start:
        return None
    try:
        value = json.loads(candidate[start : end + 1])
    except (TypeError, json.JSONDecodeError):
        return None
    return value if isinstance(value, dict) else None


def normalise_graph(raw: str | None, question: str, subject: str | None) -> StudyGraph:
    data = parse_graph_json(raw or "") or {}
    raw_nodes = data.get("nodes") if isinstance(data.get("nodes"), list) else []
    raw_edges = data.get("edges") if isinstance(data.get("edges"), list) else []

    nodes: list[GraphNode] = []
    ids: set[str] = set()
    for index, item in enumerate(raw_nodes[:8], start=1):
        if not isinstance(item, dict):
            continue
        label = _clean_label(item.get("label"), f"Concept {index}")
        node_id = _clean_label(item.get("id"), f"node-{index}").lower().replace(" ", "-")
        if node_id in ids:
            continue
        kind = item.get("kind")
        if kind not in {"topic", "concept", "practice", "resource"}:
            kind = "concept"
        nodes.append(GraphNode(id=node_id, label=label, kind=kind))
        ids.add(node_id)

    edges: list[GraphEdge] = []
    for item in raw_edges[:16]:
        if not isinstance(item, dict):
            continue
        source = _clean_label(item.get("source"), "").lower().replace(" ", "-")
        target = _clean_label(item.get("target"), "").lower().replace(" ", "-")
        if source in ids and target in ids and source != target:
            edges.append(
                GraphEdge(
                    source=source,
                    target=target,
                    label=_clean_label(item.get("label"), ""),
                )
            )

    if len(nodes) < 2:
        return fallback_graph(question, subject)
    if not edges:
        edges = [GraphEdge(source=nodes[index].id, target=nodes[index + 1].id, label="vers") for index in range(len(nodes) - 1)]

    title = _clean_label(data.get("title"), "Carte de compréhension")
    return StudyGraph(title=title, nodes=nodes, edges=edges)


def fallback_graph(question: str, subject: str | None = None) -> StudyGraph:
    topic = (subject or question).strip()
    topic = re.sub(r"\s+", " ", topic)[:48] or "Ton sujet"
    topic_id = "topic"
    return StudyGraph(
        title="Carte de compréhension",
        nodes=[
            GraphNode(id=topic_id, label=topic, kind="topic"),
            GraphNode(id="understand", label="Comprendre", kind="concept"),
            GraphNode(id="practice", label="Pratiquer", kind="practice"),
            GraphNode(id="review", label="Réviser", kind="resource"),
        ],
        edges=[
            GraphEdge(source=topic_id, target="understand", label="explorer"),
            GraphEdge(source="understand", target="practice", label="appliquer"),
            GraphEdge(source="practice", target="review", label="mémoriser"),
        ],
    )


def graph_prompt(question: str, subject: str | None, context: str) -> str:
    return f"""Create a compact concept map for a student studying this topic.

Topic: {subject or question}
Question: {question}

Use only concepts supported by this context:
{context}

Return ONLY valid JSON with this exact shape:
{{
  "title": "short French title",
  "nodes": [{{"id": "stable-id", "label": "short label", "kind": "topic"}}],
  "edges": [{{"source": "stable-id", "target": "stable-id", "label": "short relation"}}]
}}

Use 3 to 7 nodes, valid ids, no markdown, and no extra keys. Valid kinds are topic, concept, practice, resource."""
