import time
from openai import OpenAI
from config import Config


client = OpenAI(
    api_key=Config.LLM_API_KEY,
    base_url="https://api.groq.com/openai/v1",
    timeout=30
)


def chat_completion(messages):
    print(f"Calling LLM API ({Config.MODEL_NAME})...", flush=True)

    start = time.perf_counter()

    try:
        response = client.chat.completions.create(
            model=Config.MODEL_NAME,
            messages=messages,
            temperature=Config.TEMPERATURE,
            top_p=Config.TOP_P,
            max_tokens=Config.MAX_TOKENS,
            stream=False
        )

        elapsed = time.perf_counter() - start
        print(f"LLM response time: {elapsed:.2f} seconds", flush=True)

        if hasattr(response, "usage") and response.usage:
            print(
                f"Tokens - Prompt: {response.usage.prompt_tokens}, "
                f"Completion: {response.usage.completion_tokens}, "
                f"Total: {response.usage.total_tokens}",
                flush=True
            )

        print("LLM API responded!", flush=True)

        return response.choices[0].message.content

    except Exception as e:
        print(f"LLM API ERROR ({type(e).__name__}): {e}", flush=True)
        raise
