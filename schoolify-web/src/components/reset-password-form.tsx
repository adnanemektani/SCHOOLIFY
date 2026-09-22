"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function ResetPasswordForm({ token }: { token?: string }) {
  const router = useRouter(); const [message, setMessage] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    if (form.get("password") !== form.get("confirmPassword")) return setError("Les deux mots de passe ne correspondent pas.");
    if (!token) return setError("Ce lien est incomplet ou expiré.");
    setLoading(true); setError("");
    const response = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password: form.get("password") }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setError(data.message || "Impossible de modifier le mot de passe."); setLoading(false); return; }
    setMessage("Mot de passe mis à jour. Redirection vers la connexion…"); setTimeout(() => router.push("/login"), 1200);
  }
  return <form className="auth-form" onSubmit={submit}><label>Nouveau mot de passe<input name="password" type="password" autoComplete="new-password" required minLength={12} placeholder="12 caractères minimum" /></label><label>Confirmer le mot de passe<input name="confirmPassword" type="password" autoComplete="new-password" required minLength={12} placeholder="Répétez votre mot de passe" /></label>{error && <p className="form-error" role="alert">{error}</p>}{message && <p className="form-success" role="status">{message}</p>}<button className="button button-large form-submit" disabled={loading}>{loading ? "Mise à jour…" : <>Mettre à jour <span>→</span></>}</button><p className="form-footer"><Link href="/login">← Retour à la connexion</Link></p></form>;
}
