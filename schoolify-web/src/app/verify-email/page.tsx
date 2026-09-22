import { SiteHeader } from "@/components/brand";
import { VerifyEmail } from "@/components/verify-email";

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return <main className="auth-page"><SiteHeader minimal /><div className="status-wrap"><VerifyEmail token={token} /></div></main>;
}
