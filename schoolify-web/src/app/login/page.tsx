import { SiteHeader } from "@/components/brand";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return <main className="auth-page"><SiteHeader minimal /><div className="auth-layout simple-auth"><aside className="auth-aside login-aside"><span className="aside-kicker">Welcome back</span><h1>Ton futur<br />t’attend <em>ici.</em></h1><p>Reprends là où ton ambition t’a laissé.</p><div className="login-graphic"><span>◈</span><i>✦</i></div></aside><section className="auth-panel"><div className="auth-intro"><span className="form-step">Ravi de te revoir</span><h2>Se connecter</h2><p>Entre dans ton espace d’apprentissage.</p></div><LoginForm /></section></div></main>;
}
