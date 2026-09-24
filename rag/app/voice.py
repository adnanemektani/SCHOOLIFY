import asyncio
import base64
from typing import Any

from .config import Settings


class VoiceService:
    """Optional ElevenLabs text-to-speech adapter."""

    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self._client: Any = None
        if settings.voice_configured:
            from elevenlabs import ElevenLabs

            self._client = ElevenLabs(api_key=settings.elevenlabs_api_key)

    @property
    def available(self) -> bool:
        return self._client is not None

    async def synthesize(self, text: str) -> bytes:
        if not self._client:
            raise RuntimeError("ElevenLabs is not configured")
        clean_text = text.strip()
        if not clean_text:
            raise ValueError("Text is required for speech synthesis")

        return await asyncio.to_thread(self._synthesize_sync, clean_text[:5000])

    def _synthesize_sync(self, text: str) -> bytes:
        response = self._client.text_to_speech.convert(
            voice_id=self.settings.elevenlabs_voice_id,
            text=text,
            model_id=self.settings.elevenlabs_model_id,
            output_format="mp3_44100_128",
        )
        if isinstance(response, (bytes, bytearray)):
            return bytes(response)
        if hasattr(response, "read"):
            return bytes(response.read())
        if isinstance(response, str):
            return base64.b64decode(response)
        chunks: list[bytes] = []
        for chunk in response:
            if isinstance(chunk, str):
                chunks.append(base64.b64decode(chunk))
            elif isinstance(chunk, (bytes, bytearray)):
                chunks.append(bytes(chunk))
        if not chunks:
            raise RuntimeError("ElevenLabs returned no audio")
        return b"".join(chunks)
