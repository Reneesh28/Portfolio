import type { ExperienceStore } from './experienceStore';

/** Renderer counters for the last frame (development only, for performance budgets). */
export interface DevRenderStats {
  calls: number;
  triangles: number;
  points: number;
  geometries: number;
  textures: number;
  programs: number;
}

declare global {
  interface Window {
    /** Development-only test handle (absent from production builds). */
    __worldForge?: { store: ExperienceStore; render?: DevRenderStats };
  }
}

/**
 * Exposes the experience store on `window.__worldForge` during development so
 * navigation can be driven and inspected from browser automation. Production
 * builds compile this to a no-op.
 */
export function exposeDevHandle(store: ExperienceStore): () => void {
  if (!import.meta.env.DEV) return () => {};
  window.__worldForge = { store };
  return () => {
    if (window.__worldForge?.store === store) delete window.__worldForge;
  };
}
