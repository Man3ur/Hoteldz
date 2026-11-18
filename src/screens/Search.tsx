import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IconClose, IconLocate, IconSearch } from '../components/Icons';
import { PlaceCard } from '../components/PlaceCard';
import { CATEGORY_LABEL, searchPlaces, type SearchOptions } from '../services/places';
import { distanceKm } from '../services/location';
import { usePlaces } from '../services/usePlaces';
import { usePosition } from '../services/usePosition';
import { CITIES } from '../data/places';
import type { Category } from '../types';

const CATS: (Category | 'all')[] = ['all', 'hotel', 'restaurant', 'cafe', 'site'];

export default function Search() {
  const places = usePlaces();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const category = (params.get('cat') as Category | null) ?? 'all';
  const city = params.get('ville') ?? '';
  const minRating = Number(params.get('note') ?? 0);
  const sort = (params.get('tri') as SearchOptions['sort']) ?? 'rating';
  const { coords, locate, loading, error } = usePosition();

  const update = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v && v !== 'all' && v !== '0') next.set(k, v);
    else next.delete(k);
    setParams(next, { replace: true });
  };

  const results = useMemo(
    () => searchPlaces(places, { query, category, city: city || undefined, minRating, sort, from: coords }),
    [places, query, category, city, minRating, sort, coords],
  );

  const sortByDistance = async () => {
    const c = coords ?? (await locate());
    if (c) update('tri', 'distance');
  };

  return (
    <div className="screen search">
      <header className="screen-header sticky">
        <h1>Rechercher</h1>
        <label className="search-input">
          <IconSearch size={20} />
          <input
            autoFocus
            type="search"
            inputMode="search"
            placeholder="Nom d’un hôtel, restaurant, ville…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            enterKeyHint="search"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Effacer">
              <IconClose size={18} />
            </button>
          )}
        </label>
        <div className="chips">
          {CATS.map((c) => (
            <button key={c} className={`chip ${category === c ? 'on' : ''}`} onClick={() => update('cat', c)}>
              {c === 'all' ? 'Tout' : CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>
        <div className="filters">
          <select value={city} onChange={(e) => update('ville', e.target.value)} aria-label="Ville">
            <option value="">Toutes les villes</option>
            {CITIES.sort((a, b) => a.localeCompare(b, 'fr')).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select value={String(minRating)} onChange={(e) => update('note', e.target.value)} aria-label="Note minimale">
            <option value="0">Toutes notes</option>
            <option value="4">4+ ★</option>
            <option value="4.5">4,5+ ★</option>
          </select>
          <select value={sort} onChange={(e) => (e.target.value === 'distance' ? sortByDistance() : update('tri', e.target.value))} aria-label="Trier">
            <option value="rating">Mieux notés</option>
            <option value="reviews">Plus d’avis</option>
            <option value="distance">Plus proches</option>
            <option value="name">A → Z</option>
          </select>
          <button className="chip icon" onClick={sortByDistance} aria-label="Autour de moi">
            <IconLocate size={16} /> {loading ? '…' : 'Autour de moi'}
          </button>
        </div>
        {error && <p className="error small">{error}</p>}
      </header>

      <div className="results">
        <p className="muted small">
          {results.length} résultat{results.length > 1 ? 's' : ''}
          {city && ` à ${city}`}
        </p>
        {results.map((p) => (
          <PlaceCard key={p.id} place={p} distance={coords ? distanceKm(coords, p) : undefined} />
        ))}
        {results.length === 0 && (
          <div className="empty">
            <p>
              <strong>Aucun lieu trouvé.</strong>
            </p>
            <p className="muted">Cet établissement n’est peut-être pas encore recensé. Essayez un autre nom ou une autre ville.</p>
          </div>
        )}
      </div>
    </div>
  );
}
