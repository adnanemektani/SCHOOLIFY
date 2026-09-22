import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    LLM_API_KEY = os.getenv("LLM_API_KEY")
    MODEL_NAME = os.getenv("MODEL_NAME")

    TEMPERATURE = 0.7
    TOP_P = 1
    MAX_TOKENS = 256

    PORT = 5000

print("API Key loaded:", Config.LLM_API_KEY is not None, flush=True)
print("Model:", Config.MODEL_NAME, flush=True)