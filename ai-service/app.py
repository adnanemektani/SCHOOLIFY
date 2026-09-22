from flask import Flask, jsonify
from flask_cors import CORS

from routes.chatbot import chatbot_bp

app = Flask(__name__)

CORS(app)

app.register_blueprint(chatbot_bp, url_prefix="/api/v1")

@app.get("/health")
def health():
    return jsonify({
        "status": "healthy",
        "service": "Schoolify AI Service"
    })

if __name__ == "__main__":
    from config import Config

    app.run(
        host="0.0.0.0",
        port=Config.PORT,
        debug=True
    )