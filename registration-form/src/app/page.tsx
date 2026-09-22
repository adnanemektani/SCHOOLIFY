"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FormField from "@/components/FormField";
import RadioPills from "@/components/RadioPills";

const LANDING_URL = "http://localhost:3210";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: string;
  birthDate: string;
  country: string;
  region: string;
  city: string;
  zone: string;
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  gender: "",
  birthDate: "",
  country: "",
  region: "",
  city: "",
  zone: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | "form", string>>>({});
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors ?? { form: "Une erreur est survenue." });
        setSubmitting(false);
        return;
      }

      router.push("/welcome");
    } catch {
      setErrors({ form: "Impossible de contacter le serveur. Réessaie." });
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen px-6 py-14">
      <div className="mx-auto max-w-xl">
        <a href={LANDING_URL} className="flex items-center justify-center gap-2.5">
          <Image src="/brand/logo-mark.png" alt="" width={36} height={36} className="h-9 w-9" />
          <span className="font-display text-xl tracking-wide text-sky-deep">E-dTech</span>
        </a>

        <div className="relative mt-8 rounded-[1.75rem] border-2 border-ink/10 bg-white p-8 shadow-[8px_8px_0_0_rgba(20,36,51,0.08)] sm:p-10">
          <h1 className="font-display text-2xl text-ink sm:text-3xl">Créer mon compte</h1>
          <p className="mt-2 text-[15px] text-ink/60">
            Deux minutes suffisent pour rejoindre E-dTech et démarrer ton parcours.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                id="firstName"
                label="Prénom"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                error={errors.firstName}
                autoComplete="given-name"
              />
              <FormField
                id="lastName"
                label="Nom"
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                error={errors.lastName}
                autoComplete="family-name"
              />
            </div>

            <FormField
              id="email"
              type="email"
              label="Email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              error={errors.email}
              autoComplete="email"
            />

            <FormField
              id="password"
              type="password"
              label="Mot de passe"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              error={errors.password}
              autoComplete="new-password"
              placeholder="8 caractères minimum"
            />

            <div>
              <p className="text-sm font-bold text-ink/80">Sexe</p>
              <div className="mt-1.5">
                <RadioPills
                  name="gender"
                  value={form.gender}
                  onChange={(v) => update("gender", v)}
                  error={errors.gender}
                  options={[
                    { value: "homme", label: "Homme" },
                    { value: "femme", label: "Femme" },
                    { value: "autre", label: "Autre" },
                  ]}
                />
              </div>
            </div>

            <FormField
              id="birthDate"
              type="date"
              label="Date de naissance"
              value={form.birthDate}
              onChange={(e) => update("birthDate", e.target.value)}
              error={errors.birthDate}
            />

            <FormField
              id="country"
              label="Pays"
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              error={errors.country}
              autoComplete="country-name"
              placeholder="Maroc"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                id="region"
                label="Région"
                value={form.region}
                onChange={(e) => update("region", e.target.value)}
                error={errors.region}
                placeholder="Casablanca-Settat"
              />
              <FormField
                id="city"
                label="Ville"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                error={errors.city}
                placeholder="Casablanca"
              />
            </div>

            <div>
              <p className="text-sm font-bold text-ink/80">Zone de résidence</p>
              <div className="mt-1.5">
                <RadioPills
                  name="zone"
                  value={form.zone}
                  onChange={(v) => update("zone", v)}
                  error={errors.zone}
                  options={[
                    { value: "urbaine", label: "Urbaine" },
                    { value: "rurale", label: "Rurale" },
                  ]}
                />
              </div>
            </div>

            {errors.form && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">
                {errors.form}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-sky-deep px-7 py-3.5 text-base font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {submitting ? "Création en cours…" : "Créer mon compte"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
