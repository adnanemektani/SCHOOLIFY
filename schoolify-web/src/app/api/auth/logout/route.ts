import { NextResponse } from "next/server";
import { clearSession } from "@/lib/security";

export async function POST() {
  await clearSession();
  return NextResponse.json({ ok: true });
}
