"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function VerifyEmail({ token }: { token?: string }) {
  const [state, setState] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Nous vérifions votre adresse email…");
  useEffect(() => { (async () => {
    if (!token) { setState("error"); setMessage("Ce lien est incomplet."); return; }
    const response = await fetch("/api/auth/verify-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
    const data = await response.json().catch(() => ({}));
    if (response.ok) { setState("success"); setMessage("Votre email est confirmé. Votre espace est prêt !"); } else { setState("error"); setMessage(data.message || "Ce lien est invalide ou expiré."); }
  })(); }, [token]);
  return <div className={`status-card ${state}`}><span className="status-icon">{state === "loading" ? "⋯" : state === "success" ? "✓" : "!"}</span><h1>{state === "success" ? "Email confirmé" : state === "error" ? "Vérification impossible" : "Un instant"}</h1><p>{message}</p>{state !== "loading" && <Link className="button" href={state === "success" ? "/account" : "/login"}>{state === "success" ? "Ouvrir mon espace" : "Retour à la connexion"} <span>→</span></Link>}</div>;
}
