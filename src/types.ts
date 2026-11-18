export type Category = 'hotel' | 'restaurant' | 'cafe' | 'site';

export interface Place {
  id: string;
  name: string;
  category: Category;
  city: string;
  wilaya: string;
  lat: number;
  lng: number;
  /** Note de base (0-5) avant les avis ajoutés dans l'app */
  rating: number;
  reviewCount: number;
  /** 1 à 4 (€ → €€€€), absent pour les sites gratuits */
  priceLevel?: 1 | 2 | 3 | 4;
  /** Étoiles officielles, pour les hôtels */
  stars?: number;
  description: string;
  address: string;
  phone?: string;
  website?: string;
  tags: string[];
  /** Teinte de la couverture illustrée */
  hue: number;
}

export interface Review {
  id: string;
  placeId: string;
  author: string;
  rating: number;
  title: string;
  text: string;
  date: string; // ISO
  visit?: 'Famille' | 'Couple' | 'Solo' | 'Affaires' | 'Amis';
  local?: boolean; // écrit sur cet appareil
}

export interface Weather {
  temperature: number;
  code: number;
  wind: number;
  daily: { date: string; min: number; max: number; code: number }[];
}

export interface Coords {
  lat: number;
  lng: number;
}
