import json

from prompts.system_prompt import SYSTEM_PROMPT
from services.llm_client import chat_completion

def generate_response(message=None, messages=None, context=None):
    llm_messages = [
        {
        "role": "system",
        "content": SYSTEM_PROMPT
        }
    ]

    if context is not None:
        llm_messages.append({
            "role": "system",
            "content": f"Schoolify Context:\n{json.dumps(context, indent=2, ensure_ascii=False)}"
        })

    if messages is not None:
        llm_messages.extend(messages)
    else:
        llm_messages.append({
            "role": "user",
            "content": message
        })

    print("\n========== PROMPT SENT TO LLM ==========", flush=True)
    print(json.dumps(llm_messages, indent=2, ensure_ascii=False), flush=True)
    print("========================================\n", flush=True)

    return chat_completion(llm_messages)
