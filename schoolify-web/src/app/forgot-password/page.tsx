import { SiteHeader } from "@/components/brand";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return <main className="auth-page"><SiteHeader minimal /><div className="single-form-wrap"><section className="auth-panel"><div className="auth-intro"><span className="form-step">Sécurité du compte</span><h2>Mot de passe oublié ?</h2><p>Pas de souci. Indique ton email et nous t’enverrons un lien sécurisé.</p></div><ForgotPasswordForm /></section></div></main>;
}
