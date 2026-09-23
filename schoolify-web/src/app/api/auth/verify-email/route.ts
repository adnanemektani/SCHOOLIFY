import { NextRequest, NextResponse } from "next/server";
import { hashToken, setSession } from "@/lib/security";
import { findUserByVerificationHash, updateUser } from "@/lib/users";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { token?: unknown } | null;
  if (!body || typeof body.token !== "string" || body.token.length < 32) return NextResponse.json({ message: "Lien invalide." }, { status: 400 });
  const user = await findUserByVerificationHash(hashToken(body.token));
  if (!user) return NextResponse.json({ message: "Lien invalide ou expiré." }, { status: 400 });
  await updateUser(user.id, { verified: true, verificationTokenHash: undefined, verificationExpiresAt: undefined });
  await setSession(user.id);
  return NextResponse.json({ ok: true });
}
