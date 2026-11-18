import type { Place } from '../types';
import { CategoryGlyph } from './Icons';

/** Couverture illustrée (motif zellige) en attendant les vraies photos de l'API. */
export function Cover({ place, height = 140, className = '' }: { place: Place; height?: number; className?: string }) {
  const h = place.hue;
  return (
    <div
      className={`cover cover-${place.category} ${className}`}
      style={{
        height,
        background: `linear-gradient(135deg, hsl(${(h + 15) % 360} 55% 42%), hsl(${(h + 60) % 360} 50% 28%))`,
      }}
    >
      <div className="cover-pattern" />
      <div className="cover-glyph">
        <CategoryGlyph category={place.category} size={height > 160 ? 44 : 30} />
      </div>
    </div>
  );
}
