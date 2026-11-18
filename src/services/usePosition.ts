import { useCallback, useSyncExternalStore } from 'react';
import type { Coords } from '../types';
import { getCurrentPosition } from './location';

type State = { coords: Coords | null; loading: boolean; error: string | null };
let state: State = { coords: null, loading: false, error: null };
const listeners = new Set<() => void>();
const set = (s: Partial<State>) => {
  state = { ...state, ...s };
  listeners.forEach((l) => l());
};

/** Position partagée entre les écrans (demandée une seule fois, à la demande). */
export function usePosition() {
  const s = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
  );
  const locate = useCallback(async () => {
    set({ loading: true, error: null });
    try {
      const coords = await getCurrentPosition();
      set({ coords, loading: false });
      return coords;
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : 'Position indisponible' });
      return null;
    }
  }, []);
  return { ...s, locate };
}
