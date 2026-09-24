import Link from "next/link";
import { SiteHeader } from "@/components/brand";

export default async function WelcomePage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email } = await searchParams;
  return <main className="welcome-page"><SiteHeader minimal /><section className="welcome-card"><span className="welcome-orbit one" /><span className="welcome-orbit two" /><div className="welcome-symbol">✦</div><span className="form-step">Compte créé avec succès</span><h1>Vérifie ta<br /><em>boîte email.</em></h1><p>{email ? <>Un email de confirmation a été envoyé à <strong>{email}</strong>.</> : "Un email de confirmation vient de t’être envoyé."} Clique sur le lien reçu pour activer ton compte et accéder à ton espace Schoolify.</p><div className="welcome-actions"><Link className="button button-large" href="/login">J’ai confirmé, me connecter <span>→</span></Link><Link className="text-link" href="/">Retour à l’accueil</Link></div></section></main>;
}
