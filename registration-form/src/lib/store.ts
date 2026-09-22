import { randomUUID } from "crypto";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import type { RegisterPayload } from "./validate";

// Stockage fichier JSON — suffisant pour la démo du hackathon (Jour 1),
// à remplacer par une vraie base de données pour la production.

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "users.json");

export type StoredUser = RegisterPayload & {
  id: string;
  passwordHash: string;
  createdAt: string;
};

export type PublicUser = Omit<StoredUser, "passwordHash" | "password">;

async function readUsers(): Promise<StoredUser[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

async function writeUsers(users: StoredUser[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export function toPublicUser(user: StoredUser): PublicUser {
  const { passwordHash: _passwordHash, password: _password, ...rest } = user as StoredUser & {
    password?: string;
  };
  void _passwordHash;
  void _password;
  return rest;
}

export async function findUserByEmail(email: string) {
  const users = await readUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function findUserById(id: string) {
  const users = await readUsers();
  return users.find((u) => u.id === id);
}

export async function createUser(payload: RegisterPayload): Promise<StoredUser> {
  const users = await readUsers();
  const passwordHash = await bcrypt.hash(payload.password, 10);

  const user: StoredUser = {
    id: randomUUID(),
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    email: payload.email.trim().toLowerCase(),
    password: "", // jamais stocké en clair — conservé uniquement pour le typage du payload
    passwordHash,
    gender: payload.gender,
    birthDate: payload.birthDate,
    country: payload.country.trim(),
    region: payload.region.trim(),
    city: payload.city.trim(),
    zone: payload.zone,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeUsers(users);
  return user;
}
