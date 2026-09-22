import "server-only";

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { User } from "@/lib/types";

const dataDirectory = path.join(process.cwd(), "data");
const usersPath = path.join(dataDirectory, "users.json");

async function readUsers(): Promise<User[]> {
  try {
    const raw = await readFile(usersPath, "utf8");
    const users = JSON.parse(raw);
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

async function saveUsers(users: User[]) {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(usersPath, JSON.stringify(users, null, 2), "utf8");
}

export async function findUserByEmail(email: string) {
  return (await readUsers()).find((user) => user.email === email);
}

export async function findUserById(id: string) {
  return (await readUsers()).find((user) => user.id === id);
}

export async function createUser(user: User) {
  const users = await readUsers();
  if (users.some((existing) => existing.email === user.email)) return false;
  users.push(user);
  await saveUsers(users);
  return true;
}

export async function updateUser(id: string, update: Partial<User>) {
  const users = await readUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index < 0) return undefined;
  users[index] = { ...users[index], ...update };
  await saveUsers(users);
  return users[index];
}

export async function findUserByVerificationHash(tokenHash: string) {
  return (await readUsers()).find(
    (user) => user.verificationTokenHash === tokenHash && user.verificationExpiresAt && new Date(user.verificationExpiresAt) > new Date(),
  );
}

export async function findUserByResetHash(tokenHash: string) {
  return (await readUsers()).find(
    (user) => user.resetTokenHash === tokenHash && user.resetExpiresAt && new Date(user.resetExpiresAt) > new Date(),
  );
}
