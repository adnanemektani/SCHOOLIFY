import Link from "next/link";
import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { LogoutButton } from "@/components/logout-button";
import { getSessionUserId } from "@/lib/security";
import { findUserById } from "@/lib/users";
import styles from "./account.module.css";

const tracks = [
  { tag: "Web3", title: "Web3 & Blockchain", text: "Smart contracts, wallets et applications décentralisées.", level: "Débutant", duration: "8 semaines" },
  { tag: "IA", title: "Intelligence artificielle", text: "Machine learning, IA générative et prompt engineering.", level: "Débutant", duration: "10 semaines" },
  { tag: "Business", title: "Digital business", text: "Marketing digital, produit et croissance en ligne.", level: "Intermédiaire", duration: "6 semaines" },
];

const assistantFeatures = ["Explications pas à pas", "Résumés de cours", "Quiz d’entraînement", "Plan de révision"];

export default async function AccountPage() {
  const id = await getSessionUserId();
  const user = id ? await findUserById(id) : undefined;
  if (!user) redirect("/login");
  const first = user.firstName;
  const initials = `${first.slice(0, 1)}${user.lastName.slice(0, 1)}`.toUpperCase();
  const ragUrl = process.env.RAG_UI_URL || "http://localhost:8000/test";
  const memberSince = new Date(user.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const progress = 72;

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Brand />
          <nav className={styles.nav} aria-label="Navigation du compte">
            <Link href="/account" className={styles.navActive}>Tableau de bord</Link>
            <a href="#cours">Mes cours</a>
            <a href="#parcours">Parcours</a>
            <a href={ragUrl}>Assistant IA</a>
          </nav>
          <div className={styles.userMenu}>
            <span className={user.verified ? styles.badgeOk : styles.badgeWarn}>{user.verified ? "Email vérifié" : "Email à confirmer"}</span>
            <span className={styles.avatarSmall} aria-hidden="true">{initials}</span>
            <LogoutButton className={styles.logout} />
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.welcome}>
          <div>
            <p className={styles.overline}>Tableau de bord</p>
            <h1>Bonjour, {first}</h1>
            <p className={styles.lead}>Reprends ton apprentissage là où tu t’es arrêté.</p>
          </div>
          <a className={styles.primaryButton} href={ragUrl}>Poser une question à l’IA</a>
        </section>

        <section className={styles.stats} aria-label="Statistiques">
          <div className={styles.stat}><span>Cours en cours</span><strong>1</strong></div>
          <div className={styles.stat}><span>Progression</span><strong>{progress}%</strong></div>
          <div className={styles.stat}><span>Série</span><strong>1 <small>jour</small></strong></div>
          <div className={styles.stat}><span>Membre depuis</span><strong className={styles.statText}>{memberSince}</strong></div>
        </section>

        <div className={styles.grid}>
          <div className={styles.column}>
            <section id="cours" className={styles.card}>
              <div className={styles.cardHead}>
                <h2>Reprendre l’apprentissage</h2>
              </div>
              <div className={styles.course}>
                <div className={styles.thumb} aria-hidden="true">IA</div>
                <div className={styles.courseBody}>
                  <p className={styles.courseMeta}>Intelligence artificielle · Module 1 · Les fondamentaux</p>
                  <h3>Découvrir l’IA générative</h3>
                  <div className={styles.progressRow}>
                    <div className={styles.progressTrack}><span style={{ width: `${progress}%` }} /></div>
                    <span className={styles.progressLabel}>{progress}% terminé</span>
                  </div>
                </div>
                <a className={styles.primaryButton} href={ragUrl}>Reprendre</a>
              </div>
            </section>

            <section id="parcours" className={styles.card}>
              <div className={styles.cardHead}>
                <h2>Parcours recommandés</h2>
                <Link href="/" className={styles.textLink}>Tout voir</Link>
              </div>
              <div className={styles.tracks}>
                {tracks.map((track) => (
                  <article key={track.title} className={styles.track}>
                    <span className={styles.tag}>{track.tag}</span>
                    <h3>{track.title}</h3>
                    <p>{track.text}</p>
                    <div className={styles.trackMeta}><span>{track.level}</span><span>{track.duration}</span></div>
                    <Link href="/" className={styles.textLink}>Voir le parcours →</Link>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className={styles.column}>
            <section className={styles.card}>
              <div className={styles.profile}>
                <span className={styles.avatar} aria-hidden="true">{initials}</span>
                <div>
                  <h2>{first} {user.lastName}</h2>
                  <p>{user.email}</p>
                </div>
              </div>
              <dl className={styles.details}>
                <div><dt>Localisation</dt><dd>{user.region}, {user.country}</dd></div>
                <div><dt>Zone</dt><dd>{user.residence === "urban" ? "Urbaine" : "Rurale"}</dd></div>
                <div><dt>Parcours</dt><dd>À définir</dd></div>
              </dl>
            </section>

            <section className={styles.assistant}>
              <p className={styles.overlineLight}>Assistant d’étude</p>
              <h2>Pose tes questions à Schoolify AI</h2>
              <p>Un assistant basé sur les cours de la plateforme, qui cite ses sources.</p>
              <ul>{assistantFeatures.map((feature) => <li key={feature}>{feature}</li>)}</ul>
              <a className={styles.lightButton} href={ragUrl}>Ouvrir l’assistant</a>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHead}>
                <h2>Objectif de la semaine</h2>
                <span className={styles.goalCount}>1 / 5</span>
              </div>
              <div className={styles.progressTrack}><span style={{ width: "20%" }} /></div>
              <p className={styles.goalText}>Sessions d’étude terminées cette semaine.</p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
