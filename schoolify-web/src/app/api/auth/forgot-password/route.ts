import { NextRequest, NextResponse } from "next/server";
import { sendResetEmail } from "@/lib/mail";
import { hashToken, isRateLimited, makeToken } from "@/lib/security";
import { findUserByEmail, updateUser } from "@/lib/users";
import { emailSchema } from "@/lib/validation";

const generic = { ok: true, message: "Si cette adresse est associée à un compte, un lien sécurisé vient d'être envoyé." };

export async function POST(request: NextRequest) {
  const client = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (isRateLimited(`forgot:${client}`, 4)) return NextResponse.json(generic);
  const parsed = emailSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json(generic);
  const user = await findUserByEmail(parsed.data.email);
  if (!user) return NextResponse.json(generic);
  const token = makeToken();
  await updateUser(user.id, { resetTokenHash: hashToken(token), resetExpiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() });
  await sendResetEmail(user.firstName, user.email, token).catch(() => undefined);
  return NextResponse.json(generic);
}
