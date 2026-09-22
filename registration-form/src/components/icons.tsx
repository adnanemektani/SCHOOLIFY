type IconProps = { className?: string };

/** Étoile "doodle" reprise du logo, utilisée comme accent — cohérence avec la landing page. */
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
