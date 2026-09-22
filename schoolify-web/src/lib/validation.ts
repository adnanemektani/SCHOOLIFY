import { z } from "zod";

const personName = z
  .string()
  .trim()
  .min(2, "Minimum 2 caractères.")
  .max(60, "Maximum 60 caractères.")
  .regex(/^[\p{L}][\p{L}\s'-]*$/u, "Utilisez seulement des lettres, espaces, apostrophes ou tirets.");

const location = z
  .string()
  .trim()
  .min(2, "Ce champ est requis.")
  .max(100, "Maximum 100 caractères.")
  .regex(/^[\p{L}\p{N}\s,'-]+$/u, "Format invalide.");

function isAtLeastThirteen(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return false;
  const today = new Date();
  const threshold = new Date(Date.UTC(today.getUTCFullYear() - 13, today.getUTCMonth(), today.getUTCDate()));
  return date <= threshold;
}

export const registrationSchema = z.object({
  firstName: personName,
  lastName: personName,
  email: z.string().trim().toLowerCase().email("Adresse email invalide.").max(254),
  password: z
    .string()
    .min(12, "Utilisez au moins 12 caractères.")
    .max(128, "Maximum 128 caractères.")
    .regex(/[a-z]/, "Ajoutez une minuscule.")
    .regex(/[A-Z]/, "Ajoutez une majuscule.")
    .regex(/[0-9]/, "Ajoutez un chiffre."),
  gender: z.enum(["female", "male", "prefer-not-to-say"]),
  dateOfBirth: z.string().refine(isAtLeastThirteen, "Vous devez avoir au moins 13 ans."),
  country: location,
  region: location,
  residence: z.enum(["urban", "rural"]),
  acceptedTerms: z.literal(true, { error: "Vous devez accepter les conditions." }),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresse email invalide.").max(254),
  password: z.string().min(1, "Mot de passe requis.").max(128),
});

export const emailSchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresse email invalide.").max(254),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(32).max(256),
  password: z
    .string()
    .min(12, "Utilisez au moins 12 caractères.")
    .max(128, "Maximum 128 caractères.")
    .regex(/[a-z]/, "Ajoutez une minuscule.")
    .regex(/[A-Z]/, "Ajoutez une majuscule.")
    .regex(/[0-9]/, "Ajoutez un chiffre."),
});
