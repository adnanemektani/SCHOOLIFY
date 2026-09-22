"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { requestJson } from "@/lib/client-request";

export function LoginForm() {
  const router = useRouter(); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      const { response, data } = await requestJson("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form.entries())) });
      if (!response.ok) throw new Error(typeof data.message === "string" ? data.message : "Impossible de vous connecter.");
      router.push("/account"); router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Impossible de vous connecter.");
    } finally {
      setLoading(false);
    }
  }
  return <form className="auth-form" onSubmit={submit} noValidate><label>Email<input name="email" type="email" autoComplete="email" required placeholder="vous@email.com" /></label><label>Mot de passe<input name="password" type="password" autoComplete="current-password" required placeholder="Votre mot de passe" /></label><Link className="forgot-link" href="/forgot-password">Mot de passe oublié ?</Link>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-large form-submit" disabled={loading}>{loading ? "Connexion…" : <>Se connecter <span>→</span></>}</button><p className="form-footer">Pas encore de compte ? <Link href="/signup">Créer mon espace</Link></p></form>;
}
