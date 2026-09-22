import "server-only";

import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "schoolify_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function sessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret && process.env.NODE_ENV === "production") throw new Error("SESSION_SECRET must be configured in production.");
  return secret || "development-only-schoolify-secret-change-me";
}

function encode(payload: Record<string, unknown>) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", sessionSecret()).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function decode(value: string) {
  const [body, signature] = value.split(".");
  if (!body || !signature) return undefined;
  const expected = createHmac("sha256", sessionSecret()).update(body).digest("base64url");
  const valid = timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) return undefined;
  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as { userId?: string; exp?: number };
  return payload.userId && payload.exp && payload.exp > Date.now() ? payload : undefined;
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function makeToken() {
  return randomBytes(32).toString("base64url");
}

export async function setSession(userId: string) {
  const expires = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
  const store = await cookies();
  store.set(SESSION_COOKIE, encode({ userId, exp: expires.getTime() }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
}

export async function getSessionUserId() {
  const store = await cookies();
  const session = store.get(SESSION_COOKIE)?.value;
  if (!session) return undefined;
  try {
    return decode(session)?.userId;
  } catch {
    return undefined;
  }
}

type RateRecord = { count: number; resetAt: number };
const attempts = new Map<string, RateRecord>();

export function isRateLimited(key: string, max = 8, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const record = attempts.get(key);
  if (!record || record.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  record.count += 1;
  return record.count > max;
}
