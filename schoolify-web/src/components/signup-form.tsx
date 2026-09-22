"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { requestJson } from "@/lib/client-request";

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (form.get("password") !== form.get("confirmPassword")) return setError("Les deux mots de passe ne correspondent pas.");
    setLoading(true); setError("");
    const payload: Record<string, unknown> = Object.fromEntries(form.entries());
    delete payload.confirmPassword;
    payload.acceptedTerms = form.get("acceptedTerms") === "on";
    try {
      const { response, data } = await requestJson("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error(typeof data.message === "string" ? data.message : "Une erreur est survenue lors de la création du compte.");
      router.push(`/welcome?email=${encodeURIComponent(String(form.get("email")))}`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return <form className="auth-form signup-form" onSubmit={submit} noValidate>
    <div className="form-row"><label>Prénom<input name="firstName" autoComplete="given-name" required minLength={2} placeholder="Ex. Sara" /></label><label>Nom<input name="lastName" autoComplete="family-name" required minLength={2} placeholder="Ex. El Amrani" /></label></div>
    <label>Email<input name="email" type="email" autoComplete="email" required placeholder="vous@email.com" /></label>
    <div className="form-row"><label>Mot de passe<input name="password" type="password" autoComplete="new-password" required minLength={12} placeholder="12 caractères minimum" /></label><label>Confirmer<input name="confirmPassword" type="password" autoComplete="new-password" required minLength={12} placeholder="Répétez votre mot de passe" /></label></div>
    <p className="input-hint">Au moins 12 caractères, avec une majuscule, une minuscule et un chiffre.</p>
    <div className="form-row"><label>Sexe<select name="gender" required defaultValue=""><option value="" disabled>Sélectionner</option><option value="female">Femme</option><option value="male">Homme</option><option value="prefer-not-to-say">Je préfère ne pas répondre</option></select></label><label>Date de naissance<input name="dateOfBirth" type="date" required max={new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().slice(0, 10)} /></label></div>
    <div className="form-row"><label>Pays<input name="country" autoComplete="country-name" required placeholder="Maroc" /></label><label>Région / ville<input name="region" autoComplete="address-level1" required placeholder="Casablanca" /></label></div>
    <fieldset><legend>Zone de résidence</legend><div className="radio-row"><label className="choice"><input type="radio" name="residence" value="urban" required /> <span>Urbaine</span></label><label className="choice"><input type="radio" name="residence" value="rural" required /> <span>Rurale</span></label></div></fieldset>
    <label className="terms"><input type="checkbox" name="acceptedTerms" required /><span>J’accepte les <a href="#">conditions d’utilisation</a> et la politique de confidentialité.</span></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="button button-large form-submit" disabled={loading}>{loading ? "Création en cours…" : <>Créer mon compte <span>→</span></>}</button>
    <p className="form-footer">Déjà membre ? <Link href="/login">Se connecter</Link></p>
  </form>;
}
