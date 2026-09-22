import Link from "next/link";
import { SiteHeader } from "@/components/brand";

export default async function WelcomePage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email } = await searchParams;
  return <main className="welcome-page"><SiteHeader minimal /><section className="welcome-card"><span className="welcome-orbit one" /><span className="welcome-orbit two" /><div className="welcome-symbol">✦</div><span className="form-step">Compte créé avec succès</span><h1>Welcome to<br /><em>E-dTech.</em></h1><p>Ton espace Schoolify est prêt. {email ? <>Un email de confirmation a été envoyé à <strong>{email}</strong>.</> : "Vérifie maintenant ta boîte email."}</p><div className="welcome-actions"><Link className="button button-large" href="/account">Découvrir mon espace <span>→</span></Link><Link className="text-link" href="/">Retour à l’accueil</Link></div></section></main>;
}
