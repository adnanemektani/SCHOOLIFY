import "server-only";

import { PublicUser, toPublicUser, User } from "@/lib/types";

/**
 * Optional bridge to Google Apps Script, a CRM, Supabase Edge Function, etc.
 * Never sends password hashes or one-time tokens.
 */
export async function notifyNewUser(user: User) {
  const endpoint = process.env.INTEGRATION_WEBHOOK_URL;
  if (!endpoint) return { delivered: false };
  const payload: PublicUser = toPublicUser(user);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(process.env.INTEGRATION_WEBHOOK_SECRET ? { "X-Schoolify-Signature": process.env.INTEGRATION_WEBHOOK_SECRET } : {}) },
    body: JSON.stringify({ event: "user.created", data: payload }),
  });
  if (!response.ok) throw new Error("Integration webhook rejected the user event.");
  return { delivered: true };
}
