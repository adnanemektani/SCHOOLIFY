"use client";

import { FormEvent, useState } from "react";

type Message = { role: "bot" | "user"; content: string };

function localReply(question: string) {
  const q = question.toLowerCase();
  if (q.includes("parcours") || q.includes("formation")) return "Tu peux commencer par Web3 & Blockchain, IA, ou Digital Business. Dis-moi ce qui t’attire le plus et je t’oriente.";
  if (q.includes("prix") || q.includes("payer")) return "L’équipe Schoolify pourra te communiquer les formules et les éventuelles bourses disponibles.";
  if (q.includes("comment") || q.includes("marche")) return "Tu crées ton compte, choisis ton parcours, puis tu avances à ton rythme avec des modules pratiques.";
  return "Merci pour ta question ! Le chatbot IA complet arrive bientôt. En attendant, l’équipe Schoolify peut t’aider à choisir ton premier parcours.";
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "bot", content: "Salam 👋 Je suis là pour t’aider à choisir ton parcours Web3 ou IA." }]);

  async function sendMessage(event?: FormEvent<HTMLFormElement>, preset?: string) {
    event?.preventDefault();
    const message = (preset ?? input).trim();
    if (!message || sending) return;
    setMessages((current) => [...current, { role: "user", content: message }]);
    setInput(""); setSending(true);
    try {
      const endpoint = process.env.NEXT_PUBLIC_CHATBOT_API_URL;
      if (!endpoint) { setMessages((current) => [...current, { role: "bot", content: localReply(message) }]); return; }
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message }) });
      const data = (await response.json().catch(() => ({}))) as { reply?: unknown };
      setMessages((current) => [...current, { role: "bot", content: typeof data.reply === "string" ? data.reply : localReply(message) }]);
    } catch {
      setMessages((current) => [...current, { role: "bot", content: "Je n’arrive pas à joindre l’assistant pour le moment. Réessaie dans quelques secondes." }]);
    } finally { setSending(false); }
  }

  return <aside className={`chat-widget ${open ? "is-open" : ""}`} aria-live="polite">
    {open && <div className="chat-panel">
      <div className="chat-panel-head"><span className="chat-avatar">✦</span><div><strong>Ask Schoolify</strong><small>{process.env.NEXT_PUBLIC_CHATBOT_API_URL ? "Assistant IA connecté" : "Assistant démo · IA bientôt"}</small></div><button type="button" onClick={() => setOpen(false)} aria-label="Fermer le chat">×</button></div>
      <div className="chat-messages">{messages.map((message, index) => <p className={message.role} key={`${message.role}-${index}`}>{message.content}</p>)}{sending && <p className="bot typing">•••</p>}<div className="quick-replies"><button type="button" onClick={() => sendMessage(undefined, "Quel parcours choisir ?")}>Quel parcours choisir ?</button><button type="button" onClick={() => sendMessage(undefined, "Comment ça marche ?")}>Comment ça marche ?</button><button type="button" onClick={() => sendMessage(undefined, "Je veux parler à l’équipe")}>Parler à l’équipe</button></div></div>
      <form className="chat-input" onSubmit={(event) => sendMessage(event)}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Écrivez votre question…" aria-label="Votre question" maxLength={500} /><button type="submit" aria-label="Envoyer" disabled={!input.trim() || sending}>↑</button></form>
      <p className="chat-note">Connecte `NEXT_PUBLIC_CHATBOT_API_URL` pour activer le chatbot IA de l’équipe.</p>
    </div>}
    <button className="chat-launcher" type="button" onClick={() => setOpen(!open)} aria-label={open ? "Fermer le chat" : "Ouvrir le chat Schoolify"}><span className="chat-sparkle">✦</span><span className="chat-launcher-text">Une question ?</span><span className="chat-bubble">{open ? "×" : "◔"}</span></button>
  </aside>;
}
