import { NextRequest, NextResponse } from "next/server";
import { validateRegisterPayload, hasErrors, type RegisterPayload } from "@/lib/validate";
import { createUser, findUserByEmail } from "@/lib/store";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST(req: NextRequest) {
  let body: Partial<RegisterPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ errors: { form: "Requête invalide." } }, { status: 400 });
  }

  const errors = validateRegisterPayload(body);
  if (hasErrors(errors)) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const existing = await findUserByEmail(body.email!.trim());
  if (existing) {
    return NextResponse.json(
      { errors: { email: "Un compte existe déjà avec cet email." } },
      { status: 409 },
    );
  }

  const user = await createUser(body as RegisterPayload);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
