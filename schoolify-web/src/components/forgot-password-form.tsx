"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email") }) });
    const data = await response.json().catch(() => ({})); setMessage(data.message || "Vérifiez votre boîte email."); setLoading(false);
  }
  return <form className="auth-form" onSubmit={submit}><label>Votre email<input name="email" type="email" autoComplete="email" required placeholder="vous@email.com" /></label>{message && <p className="form-success" role="status">{message}</p>}<button className="button button-large form-submit" disabled={loading}>{loading ? "Envoi…" : <>Envoyer le lien <span>→</span></>}</button><p className="form-footer"><Link href="/login">← Retour à la connexion</Link></p></form>;
}
