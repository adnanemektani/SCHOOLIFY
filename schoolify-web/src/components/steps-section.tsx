import Link from "next/link";
import { Reveal } from "@/components/reveal";
import styles from "./steps-section.module.css";

const days = [
  { label: "L", active: true },
  { label: "M", active: true },
  { label: "M", active: false },
  { label: "J", active: true },
  { label: "V", active: false },
  { label: "S", active: true },
  { label: "D", active: false },
];

function ProfileScene() {
  return (
    <div className={styles.scene} aria-hidden="true">
      <div className={styles.profileRow}>
        <span className={styles.avatar}>Y</span>
        <div>
          <strong>Salut Yasmine !</strong>
          <small>Qu’est-ce qui te motive ?</small>
        </div>
      </div>
      <div className={styles.chips}>
        <span className={styles.chipOn}>IA</span>
        <span className={styles.chipOn}>Web3</span>
        <span className={styles.chip}>Business</span>
      </div>
      <div className={styles.ready}><i />Ton espace est prêt</div>
    </div>
  );
}

function RhythmScene() {
  return (
    <div className={styles.scene} aria-hidden="true">
      <div className={styles.sceneHead}>
        <strong>Ma semaine</strong>
        <small>20 min / jour</small>
      </div>
      <div className={styles.week}>
        {days.map((day, index) => (
          <span key={index} className={day.active ? styles.dayOn : styles.day}>{day.label}</span>
        ))}
      </div>
      <div className={styles.slider}><span /><i /></div>
      <small className={styles.sceneNote}>Tu ajustes quand tu veux.</small>
    </div>
  );
}

function ActionScene() {
  return (
    <div className={styles.scene} aria-hidden="true">
      <div className={styles.project}>
        <div className={styles.projectThumb}>{"</>"}</div>
        <div>
          <strong>Mon premier chatbot</strong>
          <small>Projet · Intelligence artificielle</small>
        </div>
      </div>
      <div className={styles.projectFooter}>
        <span className={styles.published}>Publié</span>
        <div className={styles.people}>
          <span>A</span><span>S</span><span>K</span>
          <small>Partagé avec ta promo</small>
        </div>
      </div>
    </div>
  );
}

const steps = [
  { number: "1", title: "Tu crées ton espace", text: "Quelques infos sur toi et tes envies, et ton tableau de bord personnalisé t’attend.", Scene: ProfileScene },
  { number: "2", title: "Tu choisis ton rythme", text: "Dix minutes ou deux heures : tu avances à ton énergie, sans pression.", Scene: RhythmScene },
  { number: "3", title: "Tu passes à l’action", text: "Tes nouvelles compétences deviennent de vrais projets à montrer au monde.", Scene: ActionScene },
];

export function StepsSection() {
  return (
    <section id="comment-ca-marche" className={styles.section}>
      <div className={styles.shell}>
        <Reveal>
          <div className={styles.heading}>
            <span className={styles.kicker}>Simplement</span>
            <h2>
              De l’envie à{" "}
              <em>
                l’impact.
                <svg viewBox="0 0 220 18" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M3 13 C 50 4, 110 3, 217 9" />
                </svg>
              </em>
            </h2>
            <p>Trois étapes, zéro prise de tête. On t’accompagne du premier clic jusqu’à ton premier projet.</p>
          </div>
        </Reveal>

        <Reveal>
          <ol className={styles.steps}>
            <svg className={styles.path} viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true">
              <path d="M 150 30 C 300 -10, 360 70, 500 30 S 700 -10, 850 30" />
            </svg>
            {steps.map(({ number, title, text, Scene }) => (
              <li key={number} className={styles.step}>
                <span className={styles.number}>{number}</span>
                <Scene />
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <div className={styles.cta}>
          <p><strong>Ton premier pas prend deux minutes.</strong> Le reste, on le fait ensemble.</p>
          <div className={styles.ctaActions}>
            <Link href="/signup" className={styles.ctaButton}>Créer mon compte</Link>
            <Link href="/login" className={styles.ctaLink}>J’ai déjà un compte</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
