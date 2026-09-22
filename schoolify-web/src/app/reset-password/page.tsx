import { SiteHeader } from "@/components/brand";
import { ResetPasswordForm } from "@/components/reset-password-form";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return <main className="auth-page"><SiteHeader minimal /><div className="single-form-wrap"><section className="auth-panel"><div className="auth-intro"><span className="form-step">Sécurité du compte</span><h2>Nouveau mot de passe</h2><p>Choisis un mot de passe long et unique pour protéger ton espace.</p></div><ResetPasswordForm token={token} /></section></div></main>;
}
