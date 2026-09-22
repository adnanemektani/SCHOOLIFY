import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { sendRegistrationEmails } from "@/lib/mail";
import { notifyNewUser } from "@/lib/integrations";
import { hashToken, isRateLimited, makeToken, setSession } from "@/lib/security";
import { User } from "@/lib/types";
import { createUser, findUserByEmail } from "@/lib/users";
import { registrationSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return NextResponse.json({ message: "Requête non autorisée." }, { status: 403 });
  const client = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (isRateLimited(`register:${client}`, 5)) return NextResponse.json({ message: "Trop de tentatives. Réessayez plus tard." }, { status: 429 });

  const parsed = registrationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
  const input = parsed.data;
  if (await findUserByEmail(input.email)) return NextResponse.json({ message: "Un compte existe déjà avec cet email." }, { status: 409 });

  const verificationToken = makeToken();
  const user: User = {
    id: crypto.randomUUID(),
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    passwordHash: await bcrypt.hash(input.password, 12),
    gender: input.gender,
    dateOfBirth: input.dateOfBirth,
    country: input.country,
    region: input.region,
    residence: input.residence,
    verified: false,
    verificationTokenHash: hashToken(verificationToken),
    verificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  };
  if (!(await createUser(user))) return NextResponse.json({ message: "Un compte existe déjà avec cet email." }, { status: 409 });

  const mail = await sendRegistrationEmails(user.firstName, user.email, verificationToken).catch(() => ({ delivered: false }));
  await notifyNewUser(user).catch((error) => console.error("[integration] user.created failed", error));
  await setSession(user.id);
  return NextResponse.json({ ok: true, verificationSent: mail.delivered });
  } catch (error) {
    console.error("[register] failed", error);
    return NextResponse.json({ message: "La création du compte a échoué côté serveur. Réessayez dans un instant." }, { status: 500 });
  }
}
