# Schoolify AI Service

AI microservice for the Schoolify E-dTech learning platform.

This service provides an AI learning assistant ("Schoolify AI") that helps users understand the Schoolify platform, learning programs, learning paths, careers, and educational content related to Web3 and Artificial Intelligence (AI).

---

## Features

* AI learning assistant
* Schoolify platform guidance
* AI and Web3 learning guidance
* Learning path assistance
* Career-oriented guidance
* Multi-language support (English, French, Arabic, Moroccan Darija)
* Conversation history support
* Schoolify context support
* REST API
* Docker support

---

## Tech Stack

* Python 3.11
* Flask
* OpenAI SDK
* Groq API (OpenAI-compatible)
* Docker

---

## Project Structure

```text
ai-service/
├── app.py
├── config.py
├── requirements.txt
├── Dockerfile
├── .env
│
├── prompts/
│   ├── system_prompt.py
│   └── __init__.py
│
├── routes/
│   └── chatbot.py
│
└── services/
    ├── chatbot_service.py
    └── llm_client.py
```

---

## Installation

Create and activate a virtual environment:

```bash
python -m venv venv
```

Activate it:

### Windows

```bash
.\venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

---

## Environment Variables

Create a `.env` file:

```env
LLM_API_KEY=<API_KEY>
MODEL_NAME=openai/gpt-oss-120b
```

The API key must remain inside the AI service environment and must never be exposed in the frontend.

---

## Run Locally

```bash
python app.py
```

The service will run on:

```text
http://localhost:5000
```

---

# API

## Health Check

### Request

```text
GET /health
```

### Response

```json
{
    "status": "healthy",
    "service": "Schoolify AI Service"
}
```

---

## Chat

### Endpoint

```text
POST /api/v1/chat
```

### Request

```json
{
    "message": "What is Schoolify E-dTech?"
}
```

### Response

```json
{
    "reply": "Schoolify E-dTech is a learning platform focused on careers and training in Web3 and Artificial Intelligence."
}
```

---

## Chat With Schoolify Context

The AI service can receive additional Schoolify information through the `context` field.

### Request

```json
{
    "message": "Which learning path is related to artificial intelligence?",
    "context": {
        "platform": {
            "name": "Schoolify E-dTech",
            "focus": [
                "Artificial Intelligence",
                "Web3"
            ]
        },
        "learning_paths": [
            {
                "name": "Artificial Intelligence",
                "description": "Learning path focused on AI skills and careers."
            },
            {
                "name": "Web3",
                "description": "Learning path focused on Web3 technologies and careers."
            }
        ]
    }
}
```

### Response

```json
{
    "reply": "The Artificial Intelligence learning path is focused on developing AI-related skills and preparing learners for careers in this field."
}
```

The AI must only use information provided by the Schoolify context and must not invent courses, prices, certifications, schedules, or other platform information.

---

## Conversation History

The backend can provide previous messages using the `messages` field.

### Request

```json
{
    "messages": [
        {
            "role": "user",
            "content": "What is Schoolify E-dTech?"
        },
        {
            "role": "assistant",
            "content": "Schoolify E-dTech is a learning platform focused on Web3 and AI."
        },
        {
            "role": "user",
            "content": "What can I learn there?"
        }
    ]
}
```

The AI uses the conversation history to understand the user's current question.

---

# AI Scope

Schoolify AI is a **user-facing learning assistant**.

It can help users with:

* Schoolify E-dTech
* AI learning programs
* Web3 learning programs
* Learning paths
* Courses and educational content provided in the context
* Career opportunities related to AI and Web3
* How to use the Schoolify platform
* How to start learning

### Out-of-scope requests

The AI must not act as a general-purpose developer assistant.

For example, it must not provide instructions about:

* Programming
* Python
* JavaScript
* React
* Next.js
* Git
* GitHub
* npm
* Terminal commands
* Debugging
* Installing dependencies
* APIs
* Modifying source code
* Running the Schoolify project

For unrelated questions, the assistant should politely explain that it is only available to help with Schoolify E-dTech and its educational content.

---

# Language Support

The assistant responds in the same language as the user's latest message.

Supported languages include:

* English
* French
* Arabic
* Moroccan Darija

The assistant should not switch languages unless the user explicitly asks it to.

---

# Error Responses

### Invalid JSON

```json
{
    "error": "Request body must be valid JSON."
}
```

### Missing Message

```json
{
    "error": "Either 'message' or 'messages' is required."
}
```

### Invalid Context

```json
{
    "error": "'context' must be an object."
}
```

### AI Service Error

```json
{
    "error": "AI service temporarily unavailable."
}
```

---

# Integration Flow

The Schoolify frontend communicates with the AI service through the chat endpoint.

```text
Schoolify Frontend
        │
        │ POST /api/v1/chat
        ▼
Schoolify AI Service
        │
        │ Build prompt + context
        ▼
Groq API
        │
        │ AI response
        ▼
Schoolify AI Service
        │
        │ { "reply": "..." }
        ▼
Schoolify Frontend
```

When additional Schoolify information is available, the frontend or backend can provide it through the `context` field.

---

# Docker

Build the image:

```bash
docker build -t schoolify-ai-service .
```

Run the container:

```bash
docker run -p 5000:5000 --env-file .env schoolify-ai-service
```

The service will then be available at:

```text
http://localhost:5000
```

---

# Limitations

* The AI only answers questions related to Schoolify E-dTech and its educational scope.
* The AI only uses Schoolify information provided through the system prompt and available context.
* The AI does not invent missing courses, programs, prices, schedules, certifications, or platform policies.
* The AI does not act as a general-purpose programming or developer assistant.
* Conversation history must be provided through the `messages` field when required.
* Detailed Schoolify information should be provided through the `context` field when available.

---

# Development

Start the AI service locally:

```bash
python app.py
```

Test the health endpoint:

```text
GET http://localhost:5000/health
```

Test the chat endpoint:

```text
POST http://localhost:5000/api/v1/chat
```

Example:

```json
{
    "message": "What is Schoolify E-dTech?"
}
```

Expected response format:

```json
{
    "reply": "..."
}
```
