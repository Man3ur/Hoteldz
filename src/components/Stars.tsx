export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="stars" role="img" aria-label={`${value.toFixed(1)} sur 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24">
            <defs>
              <linearGradient id={`s${i}-${Math.round(fill * 100)}`}>
                <stop offset={`${fill * 100}%`} stopColor="var(--safran)" />
                <stop offset={`${fill * 100}%`} stopColor="var(--star-empty)" />
              </linearGradient>
            </defs>
            <path
              d="M12 2.5 14.9 8.6l6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8Z"
              fill={`url(#s${i}-${Math.round(fill * 100)})`}
            />
          </svg>
        );
      })}
    </span>
  );
}

export function RatingPill({ value, count }: { value: number; count?: number }) {
  return (
    <span className="rating-pill">
      <strong>{value.toFixed(1)}</strong>
      <Stars value={value} size={12} />
      {count !== undefined && <span className="muted">({count.toLocaleString('fr-FR')})</span>}
    </span>
  );
}
