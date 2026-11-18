import { demoReviews } from '../data/reviews';
import type { Place, Review } from '../types';
import { load, save } from './storage';

/**
 * Avis : démo + avis écrits sur l'appareil (localStorage).
 * Pour partager les avis entre utilisateurs, remplacez addReview/userReviews
 * par des appels à votre backend (Supabase, Firebase, API maison…).
 */
const KEY = 'rihla.reviews.v1';

function all(): Review[] {
  return load<Review[]>(KEY, []);
}

export function userReviews(placeId: string) {
  return all().filter((r) => r.placeId === placeId);
}

export function reviewsFor(place: Place): Review[] {
  return [...userReviews(place.id), ...demoReviews(place.id, place.category, place.rating)].sort(
    (a, b) => b.date.localeCompare(a.date),
  );
}

export function addReview(r: Omit<Review, 'id' | 'date' | 'local'>) {
  const review: Review = { ...r, id: crypto.randomUUID?.() ?? String(Date.now()), date: new Date().toISOString(), local: true };
  save(KEY, [review, ...all()]);
  return review;
}

export function deleteReview(id: string) {
  save(KEY, all().filter((r) => r.id !== id));
}
