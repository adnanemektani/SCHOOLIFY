"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Drawer } from "vaul";

type Message = { role: "bot" | "user"; content: string };

const QUICK_REPLIES = [
  "Quel parcours choisir ?",
  "Comment ça marche ?",
  "Je veux parler à l’équipe",
] as const;

function localReply(question: string) {
  const q = question.toLowerCase();
  if (q.includes("parcours") || q.includes("formation")) {
    return "Tu peux commencer par Web3 & Blockchain, IA, ou Digital Business. Dis-moi ce qui t’attire le plus et je t’oriente.";
  }
  if (q.includes("prix") || q.includes("payer")) {
    return "L’équipe Schoolify pourra te communiquer les formules et les éventuelles bourses disponibles.";
  }
  if (q.includes("comment") || q.includes("marche")) {
    return "Tu crées ton compte, choisis ton parcours, puis tu avances à ton rythme avec des modules pratiques.";
  }
  return "Merci pour ta question ! Le chatbot IA complet arrive bientôt. En attendant, l’équipe Schoolify peut t’aider à choisir ton premier parcours.";
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Salam 👋 Je suis là pour t’aider à choisir ton parcours Web3 ou IA." },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiConnected = Boolean(process.env.NEXT_PUBLIC_CHATBOT_API_URL);

  useEffect(() => {
    if (!open) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending, open]);

  async function sendMessage(event?: FormEvent<HTMLFormElement>, preset?: string) {
    event?.preventDefault();
    const message = (preset ?? input).trim();
    if (!message || sending) return;

    setMessages((current) => [...current, { role: "user", content: message }]);
    setInput("");
    setSending(true);

    try {
      const endpoint = process.env.NEXT_PUBLIC_CHATBOT_API_URL;
      if (!endpoint) {
        setMessages((current) => [...current, { role: "bot", content: localReply(message) }]);
        return;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = (await response.json().catch(() => ({}))) as { reply?: unknown };
      setMessages((current) => [
        ...current,
        { role: "bot", content: typeof data.reply === "string" ? data.reply : localReply(message) },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "bot", content: "Je n’arrive pas à joindre l’assistant pour le moment. Réessaie dans quelques secondes." },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} direction="right" shouldScaleBackground={false}>
      <aside className="chat-widget" aria-live="polite">
        <Drawer.Trigger asChild>
          <button
            className="chat-launcher"
            type="button"
            aria-label={open ? "Fermer le chat" : "Ouvrir le chat Schoolify"}
          >
            <span className="chat-sparkle">✦</span>
            <span className="chat-launcher-text">Une question ?</span>
            <span className="chat-bubble">{open ? "×" : "◔"}</span>
          </button>
        </Drawer.Trigger>
      </aside>

      <Drawer.Portal>
        <Drawer.Overlay className="chat-drawer-overlay" />
        <Drawer.Content className="chat-drawer" aria-describedby={undefined}>
          <div className="chat-drawer-handle" aria-hidden="true" />

          <div className="chat-panel-head">
            <span className="chat-avatar">✦</span>
            <div>
              <Drawer.Title asChild>
                <strong>Ask Schoolify</strong>
              </Drawer.Title>
              <Drawer.Description asChild>
                <small>{apiConnected ? "Assistant IA connecté" : "Assistant démo · IA bientôt"}</small>
              </Drawer.Description>
            </div>
            <Drawer.Close asChild>
              <button type="button" className="chat-close" aria-label="Fermer le chat">
                ×
              </button>
            </Drawer.Close>
          </div>

          <div className="chat-messages" data-vaul-no-drag>
            {messages.map((message, index) => (
              <p className={message.role} key={`${message.role}-${index}`}>
                {message.content}
              </p>
            ))}
            {sending && <p className="bot typing">•••</p>}

            <div className="quick-replies">
              {QUICK_REPLIES.map((reply) => (
                <button key={reply} type="button" onClick={() => sendMessage(undefined, reply)} disabled={sending}>
                  {reply === "Je veux parler à l’équipe" ? "Parler à l’équipe" : reply}
                </button>
              ))}
            </div>
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input" data-vaul-no-drag onSubmit={(event) => sendMessage(event)}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Écrivez votre question…"
              aria-label="Votre question"
              maxLength={500}
              autoComplete="off"
            />
            <button type="submit" aria-label="Envoyer" disabled={!input.trim() || sending}>
              ↑
            </button>
          </form>

          {!apiConnected && (
            <p className="chat-note">Connecte `NEXT_PUBLIC_CHATBOT_API_URL` pour activer le chatbot IA de l’équipe.</p>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
