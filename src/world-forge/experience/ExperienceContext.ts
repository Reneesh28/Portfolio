import { createContext, useContext, useSyncExternalStore } from 'react';
import type { ExperienceSnapshot, ExperienceStore } from './experienceStore';

/** The World Forge experience store, provided to both the DOM UI and the R3F scene. */
export const ExperienceContext = createContext<ExperienceStore | null>(null);

export function useExperienceStore(): ExperienceStore {
  const store = useContext(ExperienceContext);
  if (!store) throw new Error('useExperienceStore must be used inside an ExperienceContext provider');
  return store;
}

/** Discrete experience state (current region, destination, phase). Re-renders only when it changes. */
export function useExperienceSnapshot(): ExperienceSnapshot {
  const store = useExperienceStore();
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}
