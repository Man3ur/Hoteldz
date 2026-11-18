import { PLACES } from '../data/places';
import type { Category, Coords, Place } from '../types';
import { config } from './config';
import { distanceKm } from './location';
import { userReviews } from './reviews';

/**
 * Source des lieux. Aujourd'hui : données de démo intégrées.
 * Demain : mettez VITE_PLACES_SOURCE=api et VITE_PLACES_API_URL=https://votre-api/places
 * (l'API doit renvoyer un tableau de Place, voir src/types.ts).
 */
let cache: Place[] | null = null;

export async function fetchPlaces(): Promise<Place[]> {
  if (cache) return cache;
  if (config.placesSource === 'api' && config.placesApiUrl) {
    try {
      const res = await fetch(config.placesApiUrl);
      if (res.ok) {
        cache = (await res.json()) as Place[];
        return cache;
      }
    } catch {
      /* repli sur la démo */
    }
  }
  cache = PLACES;
  return cache;
}

export function getPlaceSync(id: string) {
  return (cache ?? PLACES).find((p) => p.id === id);
}

/** Note moyenne et nombre d'avis, en intégrant les avis écrits dans l'app. */
export function scoreOf(place: Place) {
  const mine = userReviews(place.id);
  const total = place.reviewCount + mine.length;
  const sum = place.rating * place.reviewCount + mine.reduce((s, r) => s + r.rating, 0);
  return { rating: total ? sum / total : 0, count: total };
}

export function normalize(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, ' ').toLowerCase().trim();
}

export interface SearchOptions {
  query?: string;
  category?: Category | 'all';
  city?: string;
  minRating?: number;
  sort?: 'rating' | 'reviews' | 'distance' | 'name';
  from?: Coords | null;
}

export function searchPlaces(places: Place[], o: SearchOptions) {
  const q = normalize(o.query ?? '');
  const words = q.split(/\s+/).filter(Boolean);
  let list = places.filter((p) => {
    if (o.category && o.category !== 'all' && p.category !== o.category) return false;
    if (o.city && p.city !== o.city) return false;
    if (o.minRating && scoreOf(p).rating < o.minRating) return false;
    if (!words.length) return true;
    const hay = normalize([p.name, p.city, p.wilaya, p.address, ...p.tags].join(' '));
    return words.every((w) => hay.includes(w));
  });
  const sort = o.sort ?? 'rating';
  list = [...list].sort((a, b) => {
    if (sort === 'distance' && o.from) return distanceKm(o.from, a) - distanceKm(o.from, b);
    if (sort === 'reviews') return scoreOf(b).count - scoreOf(a).count;
    if (sort === 'name') return a.name.localeCompare(b.name, 'fr');
    return scoreOf(b).rating - scoreOf(a).rating;
  });
  return list;
}

export const CATEGORY_LABEL: Record<Category, string> = {
  hotel: 'Hôtels',
  restaurant: 'Restaurants',
  cafe: 'Cafés',
  site: 'À visiter',
};

export const CATEGORY_SINGULAR: Record<Category, string> = {
  hotel: 'Hôtel',
  restaurant: 'Restaurant',
  cafe: 'Café',
  site: 'Site',
};

export function priceLabel(level?: number) {
  return level ? ['', 'Économique', 'Abordable', 'Haut de gamme', 'Luxe'][level] : '';
}
