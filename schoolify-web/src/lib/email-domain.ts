import "server-only";

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "guerrillamail.com",
  "yopmail.com",
  "trashmail.com",
  "throwawaymail.com",
  "fakeinbox.com",
  "getnada.com",
  "sharklasers.com",
  "dispostable.com",
  "maildrop.cc",
]);

type DohResponse = { Status: number; Answer?: unknown[] };

async function dohQuery(domain: string, type: "MX" | "A" | "AAAA") {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`, {
      signal: controller.signal,
      headers: { accept: "application/dns-json" },
    });
    clearTimeout(timer);
    if (!response.ok) return undefined;
    const data = (await response.json()) as DohResponse;
    return { status: data.Status, hasAnswer: Array.isArray(data.Answer) && data.Answer.length > 0 };
  } catch {
    return undefined;
  }
}

/**
 * Confirms the domain can actually receive mail, via DNS-over-HTTPS (works in any
 * runtime, unlike Node's `dns` module which needs raw UDP/TCP:53 that many hosts block).
 * A resolver we couldn't reach resolves to `true` — only a domain we positively
 * confirmed (NXDOMAIN, or no MX/A/AAAA at all) is rejected, so a flaky resolver
 * never blocks a real signup.
 */
export async function isEmailDomainValid(email: string): Promise<boolean> {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  if (!domain) return false;
  if (DISPOSABLE_DOMAINS.has(domain)) return false;

  const mx = await dohQuery(domain, "MX");
  if (!mx) return true;
  if (mx.status === 3) return false;
  if (mx.hasAnswer) return true;

  const a = await dohQuery(domain, "A");
  if (a?.hasAnswer) return true;
  const aaaa = await dohQuery(domain, "AAAA");
  return Boolean(aaaa?.hasAnswer);
}
