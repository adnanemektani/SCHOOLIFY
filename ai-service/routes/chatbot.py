from flask import Blueprint, jsonify, request

from services.chatbot_service import generate_response

chatbot_bp = Blueprint("chatbot", __name__)


@chatbot_bp.post("/chat")
def chat():

    data = request.get_json(silent=True)

    if data is None:
        return jsonify({
            "error": "Request body must be valid JSON."
        }), 400

    message = data.get("message")
    messages = data.get("messages")
    context = data.get("context")

    if context is not None and not isinstance(context, dict):
        return jsonify({
            "error": "'context' must be an object."
        }), 400


    if not message and not messages:
        return jsonify({
            "error": "Either 'message' or 'messages' is required."
        }), 400

    if message is not None and not isinstance(message, str):
        return jsonify({
            "error": "'message' must be a string."
        }), 400

    if messages is not None and not isinstance(messages, list):
        return jsonify({
            "error": "'messages' must be an array."
        }), 400

    if messages is not None and len(messages) == 0:
        return jsonify({
            "error": "'messages' cannot be empty."
        }), 400

    if messages is not None:
        for msg in messages:
            if (
                not isinstance(msg, dict)
                or "role" not in msg
                or "content" not in msg
            ):
                return jsonify({
                    "error": "Each message must contain 'role' and 'content'."
                }), 400
                
    print("Received /chat request", flush=True)
    
    try:
        answer = generate_response(
            message=message,
            messages=messages,
            context=context
        )

        return jsonify({"reply": answer})

    except Exception as e:
        print(f"Chat endpoint error: {type(e).__name__}: {e}", flush=True)

        return jsonify({
            "error": "AI service temporarily unavailable."
        }), 500
