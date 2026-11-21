import { REGIONS, type RegionGeography, type RegionId } from '../data/worldGeography';

/**
 * The locked journey order (00 → 06), derived from the M3 region registry so the
 * route and the geography can never disagree.
 */
export const JOURNEY_ROUTE: readonly RegionGeography[] = [...REGIONS].sort((a, b) => a.index - b.index);

export const JOURNEY_STOP_COUNT = JOURNEY_ROUTE.length;

/** Journey stop of a region. */
export function stopOfRegion(id: RegionId): number {
  const stop = JOURNEY_ROUTE.findIndex((region) => region.id === id);
  if (stop < 0) throw new Error(`Region ${id} is not on the journey route`);
  return stop;
}

/** Region at a journey stop (clamped to the route). */
export function regionAtStop(stop: number): RegionGeography {
  const index = Math.min(JOURNEY_ROUTE.length - 1, Math.max(0, Math.round(stop)));
  return JOURNEY_ROUTE[index];
}
