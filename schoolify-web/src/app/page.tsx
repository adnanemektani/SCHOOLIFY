import Link from "next/link";
import { ChatWidget } from "@/components/chat-widget";
import { SiteHeader } from "@/components/brand";
import { Reveal } from "@/components/reveal";

const tracks = [
  { title: "Web3 & Blockchain", text: "Comprendre, construire et faire évoluer les nouveaux usages du web." },
  { title: "Intelligence artificielle", text: "Maîtriser les outils et les méthodes qui transforment les métiers." },
  { title: "Digital business", text: "Passer d’une idée à un projet concret, utile et durable." },
];

const jobs = ["Web3 Project Manager", "Blockchain Developer", "AI Content Strategist", "Data & AI Analyst", "Community Builder", "Product Designer"];

export default function Home() {
  return (
    <main className="landing-page">
      <section className="hero-section">
        <SiteHeader />
        <div className="hero-content">
          <div className="eyebrow">Les compétences de demain, accessibles aujourd’hui</div>
          <h1>Apprends à <em>construire</em><br />le futur.</h1>
          <p className="hero-copy">Schoolify t’ouvre les portes des métiers du Web3 et de l’IA avec des parcours concrets, humains et pensés pour passer à l’action.</p>
          <div className="hero-actions"><Link className="button button-large" href="/signup">Créer mon compte <span>→</span></Link><a className="video-link" href="#comment-ca-marche"><i>▶</i> Découvrir Schoolify</a></div>
          <div className="trust-line"><div className="avatars"><b>Y</b><b>A</b><b>S</b><b>M</b></div><span><strong>+1 200 apprenants</strong> déjà en mouvement</span></div>
        </div>
        <div className="hero-visual" aria-label="Aperçu de la progression d'un apprenant">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="blue-sphere" /><div className="neural-core"><span /><i /><b /></div>
          <div className="signal-card"><span className="signal-label">AI learning signal</span><div className="signal-bars"><i /><i /><i /><i /><i /><i /><i /><i /></div><small>adaptive path · online</small></div>
          <div className="dashboard-card main-card"><div className="card-top"><span className="live-pill">● Live learning</span><span>•••</span></div><p>Ton prochain<br /><strong>super-pouvoir</strong></p><div className="progress"><span /></div><small>72% de ton parcours</small></div>
          <div className="float-card course-card"><span className="tiny-icon">✦</span><div><small>Module en cours</small><strong>AI Essentials</strong></div><span>→</span></div>
          <div className="float-card growth-card"><span className="growth-number">+48%</span><small>de confiance<br />après 4 semaines</small></div>
          <div className="floating-dot dot-one" /><div className="floating-dot dot-two" />
        </div>
        <div className="hero-scroll">Scroll to explore <span>↓</span></div>
      </section>

      <section className="partner-strip" aria-label="Partenaires Schoolify"><span>Ils croient au potentiel de la nouvelle génération</span><div><strong>mastercard</strong><strong>startup<span>station</span></strong><strong>HEDERA</strong></div></section>

      <section className="intro-section"><div className="section-shell">
        <Reveal><div className="section-kicker">Notre mission</div><div className="intro-layout"><h2>Le digital change.<br /><em>Tu peux mener le changement.</em></h2><div><p>Schoolify est une E-dTech qui rend les compétences émergentes compréhensibles, pratiques et réellement accessibles. Ici, tu ne collectionnes pas des cours : tu construis une trajectoire.</p><Link className="arrow-link" href="/signup">Faire le premier pas <span>↗</span></Link></div></div></Reveal>
        <Reveal className="reveal-2"><div className="stats-row"><div><strong>92<sup>%</sup></strong><span>de nos apprenants se sentent prêts à appliquer leurs acquis</span></div><div><strong>18</strong><span>modules pratiques pour apprendre à ton rythme</span></div><div><strong>1</strong><span>communauté qui avance à tes côtés</span></div></div></Reveal>
      </div></section>

      <section id="programmes" className="tracks-section"><div className="section-shell"><div className="section-kicker">Explorer</div><div className="heading-row"><h2>Choisis le terrain<br />où tu veux <em>briller.</em></h2><p>Des parcours conçus autour des compétences recherchées, avec une vraie place pour la pratique.</p></div><div className="track-grid">{tracks.map((track) => <article className="track-card" key={track.title}><div className="track-card-content"><h3>{track.title}</h3><p>{track.text}</p></div></article>)}</div></div></section>

      <section id="metiers" className="jobs-section section-shell"><div className="jobs-copy"><div className="section-kicker">Des opportunités réelles</div><h2>Ta curiosité<br />peut devenir un <em>métier.</em></h2><p>Le Web3 et l’IA ont besoin de profils divers : créatifs, analytiques, organisés, visionnaires. Peut-être le tien.</p><Link className="button button-outline" href="/signup">Explorer les parcours <span>→</span></Link></div><div className="jobs-list">{jobs.map((job, index) => <div key={job}><span>0{index + 1}</span><strong>{job}</strong><i>↗</i></div>)}</div></section>

      <section id="comment-ca-marche" className="steps-section"><div className="section-shell"><div className="steps-heading"><div className="section-kicker">Simplement</div><h2>De l’envie à<br /><em>l’impact.</em></h2></div><div className="steps-grid"><article><span>01</span><div className="step-icon">⌁</div><h3>Tu crées ton espace</h3><p>Quelques informations, et ton tableau de bord personnalisé est prêt.</p></article><article><span>02</span><div className="step-icon">◉</div><h3>Tu choisis ton rythme</h3><p>Explore, pratique et avance selon ton énergie et tes objectifs.</p></article><article><span>03</span><div className="step-icon">↗</div><h3>Tu passes à l’action</h3><p>Transforme tes nouvelles compétences en projets concrets.</p></article></div></div></section>

      <section className="quote-section section-shell"><div className="quote-glow" /><p>“Je ne savais pas par où commencer dans la tech. Schoolify m’a donné une direction — et surtout la confiance de continuer.”</p><div><span className="quote-avatar">NK</span><span><strong>Nour K.</strong><small>Apprenante, Casablanca</small></span></div></section>

      <section className="final-cta"><div className="cta-noise" /><div className="section-shell"><span className="cta-symbol">✦</span><h2>Le futur ne s’attend pas.<br /><em>Il s’apprend.</em></h2><p>Ton premier module est à quelques clics.</p><Link className="button button-light button-large" href="/signup">Start learning <span>→</span></Link></div></section>
      <footer className="site-footer"><div className="section-shell"><span className="footer-brand">schoolify<span>✦</span></span><p>Les talents de demain commencent ici.</p><span>© 2026 Schoolify E-dTech</span></div></footer>
      <ChatWidget />
    </main>
  );
}
