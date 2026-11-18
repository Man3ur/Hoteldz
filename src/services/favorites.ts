import { useCallback, useSyncExternalStore } from 'react';
import { load, save } from './storage';

const KEY = 'rihla.favorites.v1';
let favs = new Set<string>(load<string[]>(KEY, []));
const listeners = new Set<() => void>();

function emit() {
  save(KEY, [...favs]);
  listeners.forEach((l) => l());
}

export function useFavorites() {
  const snapshot = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => favs,
  );
  const toggle = useCallback((id: string) => {
    favs = new Set(favs);
    if (favs.has(id)) favs.delete(id);
    else favs.add(id);
    emit();
  }, []);
  return { favorites: snapshot, toggle };
}
