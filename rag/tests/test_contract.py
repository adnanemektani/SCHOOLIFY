from app.schemas import StudyRequest


def test_message_alias_is_normalized_for_legacy_chat_clients() -> None:
    request = StudyRequest(message="Qu’est-ce que le RAG ?")
    assert request.question == "Qu’est-ce que le RAG ?"
    assert request.message is None


def test_legacy_messages_are_bounded_into_history() -> None:
    request = StudyRequest(
        question="Continue",
        messages=[
            {"role": "user", "content": "First question"},
            {"role": "assistant", "content": "First answer"},
        ],
    )
    assert [item.role for item in request.history] == ["user", "assistant"]


def test_request_rejects_empty_question() -> None:
    try:
        StudyRequest(question=" ")
    except Exception as error:
        assert "question" in str(error).lower() or "required" in str(error).lower()
    else:
        raise AssertionError("An empty question should be rejected")
