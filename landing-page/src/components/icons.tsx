// Petit set d'icônes "dessinées à la main" — traits irréguliers volontaires,
// pour éviter le look générique des packs d'icônes plats.

type IconProps = { className?: string };

const base = "w-9 h-9";

export function IconSimple({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <path
        d="M8 20c0-7 5-12.5 12-12.5S32 13 32 20s-5 12.3-12 12.3S8 27 8 20Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path d="M14 20.5l4 4.2 8.5-9.4" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSecure({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <path
        d="M20 6.5c3.6 2 6.8 3 10.2 3.1.4 7.6-1 16.7-10.2 21.4-9.2-4.7-10.6-13.8-10.2-21.4 3.4-.1 6.6-1.1 10.2-3.1Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      <path d="M16 19.6l3 3.2 5.4-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconFunctional({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <rect x="7.5" y="9" width="25" height="19" rx="2.4" stroke="currentColor" strokeWidth="2.1" />
      <path d="M7.5 15.3h25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M13 20.6h6M13 24.4h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconSupportHand({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <path
        d="M9 22c2.7 6 7.4 9 11.3 9 5.6 0 10.4-4.6 10.7-9.6"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M11 14.8c2-3 5.5-5 9-5s7 2 9 5"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <circle cx="20" cy="21" r="3.1" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function IconAdapted({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <path
        d="M20 7l3.4 6.9 7.6 1.1-5.5 5.4 1.3 7.6L20 24.3l-6.8 3.7 1.3-7.6-5.5-5.4 7.6-1.1L20 7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconClock({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <circle cx="20" cy="20.5" r="12.5" stroke="currentColor" strokeWidth="2.1" />
      <path d="M20 13v8l5.6 3.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconAdmin({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <path d="M9 33V13.5L20 7l11 6.5V33" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
      <path d="M15.5 33V22h9v11" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
      <path d="M9 33h22" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}

export function IconBus({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <rect x="6.5" y="11" width="27" height="15.5" rx="3" stroke="currentColor" strokeWidth="2.1" />
      <path d="M6.5 18.5h27" stroke="currentColor" strokeWidth="2" />
      <circle cx="13.5" cy="29.5" r="2.4" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="26.5" cy="29.5" r="2.4" stroke="currentColor" strokeWidth="1.9" />
      <path d="M11 14.7h6M20 14.7h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconChat({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <path
        d="M8 12.5c0-2 1.7-3.6 3.8-3.6h16.4c2.1 0 3.8 1.6 3.8 3.6v10.3c0 2-1.7 3.6-3.8 3.6H18l-6.6 5v-5h-.6c-2.1 0-3.8-1.6-3.8-3.6V12.5Z"
        stroke="currentColor"
        strokeWidth="2.05"
        strokeLinejoin="round"
      />
      <path d="M14 15.6h12M14 20h8.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

export function IconFolder({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <path
        d="M6.5 13.2c0-1.5 1.2-2.7 2.7-2.7h6.9l2.6 3h12.1c1.5 0 2.7 1.2 2.7 2.7v11.1c0 1.5-1.2 2.7-2.7 2.7H9.2c-1.5 0-2.7-1.2-2.7-2.7V13.2Z"
        stroke="currentColor"
        strokeWidth="2.05"
        strokeLinejoin="round"
      />
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
