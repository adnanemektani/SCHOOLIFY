import { cookies } from "next/headers";

export const SESSION_COOKIE = "edtech_session";

export async function getSessionUserId() {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}
