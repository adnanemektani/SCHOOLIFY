import Link from "next/link";
import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { LogoutButton } from "@/components/logout-button";
import { getSessionUserId } from "@/lib/security";
import { findUserById } from "@/lib/users";

export default async function AccountPage() {
  const id = await getSessionUserId();
  const user = id ? await findUserById(id) : undefined;
  if (!user) redirect("/login");
  const first = user.firstName;
  return <main className="account-page"><header className="account-header"><Brand /><div><span className="account-status"><i /> {user.verified ? "Email vérifié" : "Email à confirmer"}</span><LogoutButton /></div></header><section className="account-hero"><div><span className="eyebrow">Ton espace personnel</span><h1>Salam, {first}<span>✦</span></h1><p>Tu es à une leçon de ton prochain déclic.</p></div><div className="streak-card"><span>Ta série</span><strong>01 <small>jour</small></strong><p>Commence aujourd’hui.</p></div></section><section className="account-grid"><article className="continue-card"><div className="card-label"><span>À continuer</span><i>72%</i></div><h2>Découvrir l’IA<br />générative</h2><p>Module 1 · Les fondamentaux</p><div className="progress"><span /></div><button className="button">Reprendre <span>→</span></button></article><aside className="profile-card"><span className="card-label">Mon profil</span><div className="profile-avatar">{first.slice(0, 1)}{user.lastName.slice(0, 1)}</div><h2>{first} {user.lastName}</h2><p>{user.region}, {user.country}</p><dl><div><dt>Parcours</dt><dd>À définir</dd></div><div><dt>Zone</dt><dd>{user.residence === "urban" ? "Urbaine" : "Rurale"}</dd></div></dl><Link href="/" className="profile-link">Voir les parcours ↗</Link></aside></section><section className="account-next"><span>Pour démarrer</span><h2>Choisis ton premier <em>terrain de jeu.</em></h2><div>{["Web3 & Blockchain", "Intelligence artificielle", "Digital business"].map((item) => <button key={item}>{item}<span>→</span></button>)}</div></section></main>;
}
