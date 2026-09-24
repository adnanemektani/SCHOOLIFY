import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/mail";
import { hashToken, isRateLimited, makeToken, setSession } from "@/lib/security";
import { findUserByEmail, updateUser } from "@/lib/users";
import { loginSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const client = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (isRateLimited(`login:${client}`, 8)) return NextResponse.json({ message: "Trop de tentatives. Réessayez plus tard." }, { status: 429 });
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Email ou mot de passe invalide." }, { status: 400 });
  const user = await findUserByEmail(parsed.data.email);
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
    return NextResponse.json({ message: "Email ou mot de passe incorrect." }, { status: 401 });
  }
  if (!user.verified) {
    const verificationToken = makeToken();
    await updateUser(user.id, {
      verificationTokenHash: hashToken(verificationToken),
      verificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
    await sendVerificationEmail(user.firstName, user.email, verificationToken).catch((error) => console.error("[login] verification email failed", error));
    return NextResponse.json({ message: "Votre email n'est pas encore confirmé. Nous venons de vous renvoyer un lien de confirmation : vérifiez votre boîte de réception." }, { status: 403 });
  }
  await setSession(user.id);
  return NextResponse.json({ ok: true });
}
