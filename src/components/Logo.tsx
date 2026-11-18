/** Emblème Rihla : étoile à huit branches (khatam) inspirée du zellige, boussole du voyageur. */
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect x="14" y="14" width="36" height="36" rx="4" fill="var(--terracotta)" />
      <rect x="14" y="14" width="36" height="36" rx="4" fill="var(--terracotta)" transform="rotate(45 32 32)" />
      <circle cx="32" cy="32" r="13" fill="var(--sable-50)" />
      <path d="M32 21 35.5 32 32 43 28.5 32Z" fill="var(--bleu)" />
      <path d="M32 21 35.5 32H28.5Z" fill="var(--safran)" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="wordmark">
      <LogoMark size={30} />
      <span>Rihla</span>
    </span>
  );
}
