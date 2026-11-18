import { Link } from 'react-router-dom';
import { CATEGORY_SINGULAR, priceLabel, scoreOf } from '../services/places';
import { useFavorites } from '../services/favorites';
import { formatDistance } from '../services/location';
import type { Place } from '../types';
import { Cover } from './Cover';
import { IconHeart } from './Icons';
import { RatingPill } from './Stars';


export function PlaceCard({ place, distance, variant = 'row' }: { place: Place; distance?: number; variant?: 'row' | 'tile' }) {
  const { favorites, toggle } = useFavorites();
  const { rating, count } = scoreOf(place);
  const fav = favorites.has(place.id);
  return (
    <article className={`place-card ${variant}`}>
      <Link to={`/lieu/${place.id}`} className="place-card-link" aria-label={place.name} />
      <Cover place={place} height={variant === 'tile' ? 130 : 96} />
      <div className="place-card-body">
        <div className="eyebrow">
          {CATEGORY_SINGULAR[place.category]}
          {place.stars ? ` · ${'★'.repeat(place.stars)}` : ''}
          {place.priceLevel ? ` · ${priceLabel(place.priceLevel)}` : ''}
        </div>
        <h3>{place.name}</h3>
        <RatingPill value={rating} count={count} />
        <div className="muted small">
          {place.city}
          {distance !== undefined && ` · ${formatDistance(distance)}`}
        </div>
      </div>
      <button
        className={`fav-btn ${fav ? 'on' : ''}`}
        onClick={() => toggle(place.id)}
        aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        aria-pressed={fav}
      >
        <IconHeart size={18} filled={fav} />
      </button>
    </article>
  );
}
