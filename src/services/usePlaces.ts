import { useEffect, useState } from 'react';
import { PLACES } from '../data/places';
import type { Place } from '../types';
import { fetchPlaces } from './places';

export function usePlaces() {
  const [places, setPlaces] = useState<Place[]>(PLACES);
  useEffect(() => {
    fetchPlaces().then(setPlaces);
  }, []);
  return places;
}
