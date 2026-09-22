import { SiteHeader } from "@/components/brand";
import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return <main className="auth-page"><SiteHeader minimal /><div className="auth-layout"><aside className="auth-aside signup-aside"><span className="aside-kicker">Ton parcours commence ici</span><h1>Une nouvelle<br /><em>version</em> de toi.</h1><p>Crée ton espace personnel pour apprendre les compétences qui façonnent le monde de demain.</p><div className="aside-orbit"><span>✦</span><i /><b /></div><div className="aside-quote">“Pas besoin d’être expert·e pour commencer. Il suffit d’être curieux·se.”</div></aside><section className="auth-panel"><div className="auth-intro"><span className="form-step">Étape 1 / 1</span><h2>Crée ton compte</h2><p>Quelques détails, et on prépare ton expérience Schoolify.</p></div><SignupForm /></section></div></main>;
}
