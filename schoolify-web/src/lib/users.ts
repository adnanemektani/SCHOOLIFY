import "server-only";

import { Prisma, Gender as PrismaGender, User as PrismaUser } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Gender, Residence, User } from "@/lib/types";

function toPrismaGender(gender: Gender): PrismaGender {
  return gender === "prefer-not-to-say" ? "prefer_not_to_say" : gender;
}

function fromPrismaGender(gender: PrismaGender): Gender {
  return gender === "prefer_not_to_say" ? "prefer-not-to-say" : gender;
}

function dateOnly(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function toDateOnlyString(value: Date) {
  return value.toISOString().slice(0, 10);
}

function fromPrisma(row: PrismaUser): User {
  return {
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    passwordHash: row.passwordHash,
    gender: fromPrismaGender(row.gender),
    dateOfBirth: toDateOnlyString(row.dateOfBirth),
    country: row.country,
    region: row.region,
    residence: row.residence as Residence,
    verified: row.verified,
    verificationTokenHash: row.verificationTokenHash ?? undefined,
    verificationExpiresAt: row.verificationExpiresAt ? row.verificationExpiresAt.toISOString() : undefined,
    resetTokenHash: row.resetTokenHash ?? undefined,
    resetExpiresAt: row.resetExpiresAt ? row.resetExpiresAt.toISOString() : undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function findUserByEmail(email: string) {
  const row = await prisma.user.findUnique({ where: { email } });
  return row ? fromPrisma(row) : undefined;
}

export async function findUserById(id: string) {
  const row = await prisma.user.findUnique({ where: { id } });
  return row ? fromPrisma(row) : undefined;
}

export async function createUser(user: User) {
  try {
    await prisma.user.create({
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        passwordHash: user.passwordHash,
        gender: toPrismaGender(user.gender),
        dateOfBirth: dateOnly(user.dateOfBirth),
        country: user.country,
        region: user.region,
        residence: user.residence,
        verified: user.verified,
        verificationTokenHash: user.verificationTokenHash ?? null,
        verificationExpiresAt: user.verificationExpiresAt ? new Date(user.verificationExpiresAt) : null,
        createdAt: new Date(user.createdAt),
      },
    });
    return true;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return false;
    throw error;
  }
}

function toPrismaUpdate(update: Partial<User>) {
  const data: Prisma.UserUpdateInput = {};
  if ("firstName" in update) data.firstName = update.firstName;
  if ("lastName" in update) data.lastName = update.lastName;
  if ("email" in update) data.email = update.email;
  if ("passwordHash" in update) data.passwordHash = update.passwordHash;
  if ("gender" in update && update.gender) data.gender = toPrismaGender(update.gender);
  if ("dateOfBirth" in update && update.dateOfBirth) data.dateOfBirth = dateOnly(update.dateOfBirth);
  if ("country" in update) data.country = update.country;
  if ("region" in update) data.region = update.region;
  if ("residence" in update && update.residence) data.residence = update.residence;
  if ("verified" in update) data.verified = update.verified;
  if ("verificationTokenHash" in update) data.verificationTokenHash = update.verificationTokenHash ?? null;
  if ("verificationExpiresAt" in update)
    data.verificationExpiresAt = update.verificationExpiresAt ? new Date(update.verificationExpiresAt) : null;
  if ("resetTokenHash" in update) data.resetTokenHash = update.resetTokenHash ?? null;
  if ("resetExpiresAt" in update) data.resetExpiresAt = update.resetExpiresAt ? new Date(update.resetExpiresAt) : null;
  return data;
}

export async function updateUser(id: string, update: Partial<User>) {
  try {
    const row = await prisma.user.update({ where: { id }, data: toPrismaUpdate(update) });
    return fromPrisma(row);
  } catch {
    return undefined;
  }
}

export async function findUserByVerificationHash(tokenHash: string) {
  const row = await prisma.user.findFirst({
    where: { verificationTokenHash: tokenHash, verificationExpiresAt: { gt: new Date() } },
  });
  return row ? fromPrisma(row) : undefined;
}

export async function findUserByResetHash(tokenHash: string) {
  const row = await prisma.user.findFirst({
    where: { resetTokenHash: tokenHash, resetExpiresAt: { gt: new Date() } },
  });
  return row ? fromPrisma(row) : undefined;
}
