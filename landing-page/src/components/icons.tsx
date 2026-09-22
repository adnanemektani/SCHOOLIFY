// Petit set d'icônes "dessinées à la main" — traits irréguliers volontaires,
// pour éviter le look générique des packs d'icônes plats.

type IconProps = { className?: string };

const base = "w-9 h-9";

export function IconGlobeOnline({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <circle cx="20" cy="20" r="12.5" stroke="currentColor" strokeWidth="2.1" />
      <path d="M7.5 20h25M20 7.5c3.6 3.3 5.5 7.8 5.5 12.5s-1.9 9.2-5.5 12.5c-3.6-3.3-5.5-7.8-5.5-12.5S16.4 10.8 20 7.5Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
    </svg>
  );
}

export function IconMentor({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <circle cx="14.5" cy="15.5" r="4.3" stroke="currentColor" strokeWidth="2.05" />
      <path d="M7 30.5c1-5 3.9-7.6 7.5-7.6s6.5 2.6 7.5 7.6" stroke="currentColor" strokeWidth="2.05" strokeLinecap="round" />
      <circle cx="27" cy="12.5" r="3.2" stroke="currentColor" strokeWidth="1.9" />
      <path d="M21.5 21.4c1.5-1.6 3.5-2.5 5.5-2.5 3.3 0 6 2.4 6.8 6.3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

export function IconProject({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <rect x="8" y="8.5" width="24" height="23" rx="2.3" stroke="currentColor" strokeWidth="2.05" />
      <path d="M13.5 16.3l3 3-3 3M20 22.3h6.5" stroke="currentColor" strokeWidth="1.95" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCert({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <circle cx="20" cy="16" r="8.4" stroke="currentColor" strokeWidth="2.05" />
      <path d="M15.7 23l-2.4 10 6.7-3.6L26.7 33l-2.4-10" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M16.6 16.3l2.4 2.5 4.6-5" stroke="currentColor" strokeWidth="1.95" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCommunity({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <circle cx="14" cy="16" r="3.8" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="26.5" cy="16" r="3.8" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="20" cy="25.5" r="3.8" stroke="currentColor" strokeWidth="1.9" />
      <path d="M16.6 18.6l1 3M23.4 18.6l-1 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function IconGrowth({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <path d="M7 30h26" stroke="currentColor" strokeWidth="2.05" strokeLinecap="round" />
      <path d="M9 24.5l6.5-7 5 4.3L30 10.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23 10.5h7v7" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconBlockchain({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <rect x="6.5" y="9" width="9.5" height="9.5" rx="1.8" stroke="currentColor" strokeWidth="2" />
      <rect x="24" y="9" width="9.5" height="9.5" rx="1.8" stroke="currentColor" strokeWidth="2" />
      <rect x="15.3" y="22" width="9.5" height="9.5" rx="1.8" stroke="currentColor" strokeWidth="2" />
      <path d="M16 13.7h8M20 18.5v4.2M24 18.5l-3.8 4.3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

export function IconBrainAI({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <path
        d="M16 8.7c-3.4 0-5.8 2.7-5.6 5.8-2 1-3.1 3.4-2.4 5.6-1.4 1.7-1.3 4.4.5 6-.3 2.7 1.9 5.2 4.7 5.2H16V8.7Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M16 8.7c3.4 0 5.8 2.7 5.6 5.8 2 1 3.1 3.4 2.4 5.6 1.4 1.7 1.3 4.4-.5 6 .3 2.7-1.9 5.2-4.7 5.2H16"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <circle cx="13.4" cy="20" r="1.15" fill="currentColor" />
      <circle cx="18.6" cy="16" r="1.15" fill="currentColor" />
      <circle cx="18.6" cy="25" r="1.15" fill="currentColor" />
    </svg>
  );
}

export function IconPrompt({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <path
        d="M8 12.5c0-2 1.7-3.6 3.8-3.6h16.4c2.1 0 3.8 1.6 3.8 3.6v10.3c0 2-1.7 3.6-3.8 3.6H18l-6.6 5v-5h-.6c-2.1 0-3.8-1.6-3.8-3.6V12.5Z"
        stroke="currentColor"
        strokeWidth="2.05"
        strokeLinejoin="round"
      />
      <path d="M14 16.7l3 2.4-3 2.4M20.5 21.5H26" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconDataChart({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <path d="M8 32V9M8 32h24" stroke="currentColor" strokeWidth="2.05" strokeLinecap="round" />
      <path d="M13.5 27v-7M20 27V13.5M26.5 27v-11" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/** Étoile "doodle" reprise du logo, utilisée comme accent dispersé. */
export function DoodleStar({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2.5l2.4 6 6.1.6-4.7 4 1.4 6-5.2-3.3-5.2 3.3 1.4-6-4.7-4 6.1-.6L12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Trait de surlignage à main levée, posé sous un mot clé. */
export function Scribble({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 200 20" preserveAspectRatio="none" className={className}>
      <path
        d="M2 12.5C40 4 90 3 130 9c22 3.2 45 4.3 66 1.4"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
    </svg>
  );
}
