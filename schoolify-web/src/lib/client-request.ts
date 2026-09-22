"use client";

type JsonResponse = Record<string, unknown>;

/** Avoid a form UI that waits forever when the local server/API is unavailable. */
export async function requestJson(url: string, init: RequestInit, timeoutMs = 25_000) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    const data = (await response.json().catch(() => ({}))) as JsonResponse;
    return { response, data };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Le serveur met trop de temps à répondre. Vérifiez qu’il est bien lancé, puis réessayez.");
    }
    throw new Error("Impossible de joindre le serveur. Vérifiez votre connexion puis réessayez.");
  } finally {
    window.clearTimeout(timeout);
  }
}
