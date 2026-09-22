import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { hashToken, isRateLimited } from "@/lib/security";
import { findUserByResetHash, updateUser } from "@/lib/users";
import { resetPasswordSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const client = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (isRateLimited(`reset:${client}`, 5)) return NextResponse.json({ message: "Trop de tentatives." }, { status: 429 });
  const parsed = resetPasswordSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
  const user = await findUserByResetHash(hashToken(parsed.data.token));
  if (!user) return NextResponse.json({ message: "Ce lien est invalide ou expiré." }, { status: 400 });
  await updateUser(user.id, { passwordHash: await bcrypt.hash(parsed.data.password, 12), resetTokenHash: undefined, resetExpiresAt: undefined });
  return NextResponse.json({ ok: true });
}
