import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="brand" href="/" aria-label="Schoolify accueil">
      <span className="brand-mark"><img src="/schoolify-mark.svg" alt="" /></span>
      {!compact && <span>schoolify<span className="brand-star">✦</span></span>}
    </Link>
  );
}

export function SiteHeader({ minimal = false }: { minimal?: boolean }) {
  return (
    <header className={`site-header ${minimal ? "minimal" : ""}`}>
      <Brand />
      {!minimal && <nav className="main-nav" aria-label="Navigation principale">
        <a href="#programmes">Programmes</a><a href="#metiers">Métiers</a><a href="#comment-ca-marche">Comment ça marche</a>
      </nav>}
      <div className="header-actions">
        <Link className="text-link" href="/login">Se connecter</Link>
        <Link className="button button-small" href="/signup">Créer mon compte <span>→</span></Link>
      </div>
    </header>
  );
}
