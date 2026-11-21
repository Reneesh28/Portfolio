import type { RegionId } from '../data/worldGeography';
import {
  createJourneyState,
  currentStop,
  destinationStop,
  navigateJourney,
  scrollJourney,
  stepJourney,
  type JourneyConfig,
  type JourneyPhase,
  type JourneyState,
} from './journey';
import { JOURNEY_STOP_COUNT, regionAtStop, stopOfRegion } from './route';

/** Journey timing for full motion. */
export const JOURNEY_CONFIG: JourneyConfig = {
  stopCount: JOURNEY_STOP_COUNT,
  followRate: 3.2,
  maxScrollSpeed: 1.1,
  settleDelay: 0.32,
  settleThreshold: 0.15,
  navigationBase: 1.3,
  navigationPerStop: 0.35,
  navigationMax: 3,
};

/** Reduced motion: short, near-instant transitions; same route and destinations. */
export const REDUCED_MOTION_JOURNEY_CONFIG: JourneyConfig = {
  ...JOURNEY_CONFIG,
  followRate: 12,
  maxScrollSpeed: 6,
  navigationBase: 0.35,
  navigationPerStop: 0,
  navigationMax: 0.35,
};

/** Discrete experience state for the UI. Changes only when one of these fields changes. */
export interface ExperienceSnapshot {
  currentRegion: RegionId;
  destinationRegion: RegionId;
  phase: JourneyPhase;
  reducedMotion: boolean;
}

/**
 * Single source of truth for the World Forge journey.
 *
 * Writers: input/navigation code calls `scroll`, `navigateTo` and `stepRegion`
 * (requests only).
 *
 * Input priority (locked): user interaction → direct navigation → open panel →
 * scroll → ambient motion. Direct navigation always wins over scroll (see the
 * journey model). An open panel/menu blocks scroll via `blockScroll`, so the
 * camera never moves behind it; direct navigation is still honoured. The camera controller is the only caller of `advance`, which
 * moves the journey forward in time. Per-frame values are read with `getJourney`
 * without React re-renders; the UI subscribes to the discrete snapshot.
 */
export interface ExperienceStore {
  getJourney(): JourneyState;
  getConfig(): JourneyConfig;
  getSnapshot(): ExperienceSnapshot;
  subscribe(listener: () => void): () => void;
  /** Scroll request in stops (positive = forward). Ignored while scroll is blocked. */
  scroll(deltaStops: number): void;
  /**
   * Blocks scroll-driven travel (e.g. while a panel or menu is open). Returns a
   * release function; blocks from several layers stack, and releasing twice is harmless.
   */
  blockScroll(): () => void;
  isScrollBlocked(): boolean;
  /** Direct navigation to a region. */
  navigateTo(region: RegionId): void;
  /** Direct navigation one region forward/back from the current destination. */
  stepRegion(direction: -1 | 1): void;
  /** Advance journey time; camera controller only. */
  advance(dt: number): void;
  setReducedMotion(reduced: boolean): void;
  /**
   * Called whenever the journey needs frames (e.g. to `invalidate()` a demand
   * frameloop). The renderer registers it; null unregisters.
   */
  setWakeHandler(handler: (() => void) | null): void;
}

export function createExperienceStore(start: RegionId = 'void'): ExperienceStore {
  let journey = createJourneyState(stopOfRegion(start));
  let reducedMotion = false;
  let wake: (() => void) | null = null;
  let scrollBlocks = 0;
  const listeners = new Set<() => void>();

  const config = () => (reducedMotion ? REDUCED_MOTION_JOURNEY_CONFIG : JOURNEY_CONFIG);

  const buildSnapshot = (): ExperienceSnapshot => ({
    currentRegion: regionAtStop(currentStop(journey)).id,
    destinationRegion: regionAtStop(destinationStop(journey, config())).id,
    phase: journey.phase,
    reducedMotion,
  });

  let snapshot = buildSnapshot();

  const publish = () => {
    const next = buildSnapshot();
    if (
      next.currentRegion === snapshot.currentRegion &&
      next.destinationRegion === snapshot.destinationRegion &&
      next.phase === snapshot.phase &&
      next.reducedMotion === snapshot.reducedMotion
    ) {
      return;
    }
    snapshot = next;
    listeners.forEach((listener) => listener());
  };

  const update = (next: JourneyState) => {
    if (next === journey) return;
    journey = next;
    if (journey.phase !== 'idle') wake?.();
    publish();
  };

  return {
    getJourney: () => journey,
    getConfig: config,
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    scroll(deltaStops) {
      if (scrollBlocks > 0) return;
      update(scrollJourney(journey, deltaStops, config()));
    },
    blockScroll() {
      scrollBlocks += 1;
      let released = false;
      return () => {
        if (released) return;
        released = true;
        scrollBlocks -= 1;
      };
    },
    isScrollBlocked: () => scrollBlocks > 0,
    navigateTo(region) {
      update(navigateJourney(journey, stopOfRegion(region), config()));
    },
    stepRegion(direction) {
      update(navigateJourney(journey, destinationStop(journey, config()) + direction, config()));
    },
    advance(dt) {
      update(stepJourney(journey, dt, config()));
    },
    setReducedMotion(reduced) {
      if (reduced === reducedMotion) return;
      reducedMotion = reduced;
      publish();
    },
    setWakeHandler(handler) {
      wake = handler;
      if (handler && journey.phase !== 'idle') handler();
    },
  };
}
