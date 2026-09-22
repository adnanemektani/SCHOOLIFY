export type RegisterPayload = {
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GENDERS = ["homme", "femme", "autre"];
const ZONES = ["urbaine", "rurale"];

/** Validation serveur — ne fait jamais confiance au client. Retourne la liste des erreurs par champ. */
export function validateRegisterPayload(data: Partial<RegisterPayload>) {
  const errors: Partial<Record<keyof RegisterPayload, string>> = {};

  if (!data.firstName?.trim()) errors.firstName = "Prénom requis.";
  if (!data.lastName?.trim()) errors.lastName = "Nom requis.";

  if (!data.email?.trim()) errors.email = "Email requis.";
  else if (!EMAIL_RE.test(data.email.trim())) errors.email = "Email invalide.";

  if (!data.password || data.password.length < 8)
    errors.password = "Le mot de passe doit contenir au moins 8 caractères.";

  if (!data.gender || !GENDERS.includes(data.gender)) errors.gender = "Sexe requis.";

  if (!data.birthDate?.trim()) errors.birthDate = "Date de naissance requise.";
  else if (Number.isNaN(Date.parse(data.birthDate))) errors.birthDate = "Date invalide.";

  if (!data.country?.trim()) errors.country = "Pays requis.";
  if (!data.region?.trim()) errors.region = "Région requise.";
  if (!data.city?.trim()) errors.city = "Ville requise.";

  if (!data.zone || !ZONES.includes(data.zone)) errors.zone = "Zone de résidence requise.";

  return errors;
}

export function hasErrors(errors: Record<string, string | undefined>) {
  return Object.values(errors).some(Boolean);
}
