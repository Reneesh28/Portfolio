/**
 * THE WORLD FORGE — journey model (pure, deterministic, framework-free).
 *
 * The journey is a single continuous `position` along the region route, measured
 * in stops: 0 = THE VOID, 1 = THE ORIGIN SANCTUM … last = THE HORIZON.
 * Fractional positions are travel between two stops. The camera pose is derived
 * from this one number, so there is exactly one source of truth for progress.
 *
 * Inputs never move the camera directly; they change the journey's destination:
 *  - `scrollJourney` nudges a scroll target (compressible travel, settles to a stop
 *    once input stops).
 *  - `navigateJourney` starts a timed transition to one stop. Direct navigation
 *    outranks scroll: while it runs, scroll input is ignored. A newer navigation
 *    request always replaces the older one, starting from the current position,
 *    so a stale transition can never overwrite a newer command.
 *  - `stepJourney` advances time; it is the only function that moves `position`.
 *
 * No imports with runtime effect: this module is unit-tested directly under Node.
 */

export type JourneyPhase = 'idle' | 'scrolling' | 'navigating';

export interface JourneyConfig {
  /** Number of stops on the route (≥ 1). */
  stopCount: number;
  /** Exponential follow rate toward the scroll target, per second. */
  followRate: number;
  /** Speed limit while following scroll, in stops per second (no sudden acceleration). */
  maxScrollSpeed: number;
  /** Seconds without scroll input before the journey settles onto a stop. */
  settleDelay: number;
  /**
   * How far past a stop (fraction of a segment) scroll must carry before settling
   * continues to the next stop in the scroll direction instead of falling back.
   */
  settleThreshold: number;
  /** Navigation duration = base + perStop × distance, capped at max (seconds). */
  navigationBase: number;
  navigationPerStop: number;
  navigationMax: number;
}

export interface NavigationTransition {
  /** Monotonic request id; the newest request always wins. */
  id: number;
  from: number;
  to: number;
  elapsed: number;
  duration: number;
}

export interface JourneyState {
  readonly position: number;
  readonly phase: JourneyPhase;
  /** Where scroll is heading (equals `position` when idle). */
  readonly scrollTarget: number;
  /** Direction of the most recent scroll input. */
  readonly scrollDirection: -1 | 0 | 1;
  /** Seconds since the last scroll input. */
  readonly sinceScroll: number;
  readonly navigation: NavigationTransition | null;
  /** Id the next navigation request will receive. */
  readonly nextNavigationId: number;
}

/** Largest time step applied per update, so a stalled tab doesn't teleport the camera. */
export const MAX_STEP_SECONDS = 0.1;
const SETTLE_EPSILON = 1e-3;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const lastStop = (config: JourneyConfig) => Math.max(0, config.stopCount - 1);
const clampToRoute = (value: number, config: JourneyConfig) => clamp(value, 0, lastStop(config));

/** Smooth start and stop, no overshoot. */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export function createJourneyState(start = 0): JourneyState {
  return {
    position: start,
    phase: 'idle',
    scrollTarget: start,
    scrollDirection: 0,
    sinceScroll: 0,
    navigation: null,
    nextNavigationId: 1,
  };
}

/** The stop a released scroll gesture settles onto (direction-biased, deterministic). */
export function settleStop(target: number, direction: -1 | 0 | 1, config: JourneyConfig): number {
  const t = config.settleThreshold;
  const stop = direction > 0 ? Math.ceil(target - t) : direction < 0 ? Math.floor(target + t) : Math.round(target);
  return clampToRoute(stop, config);
}

export function navigationDuration(distance: number, config: JourneyConfig): number {
  return Math.min(config.navigationMax, config.navigationBase + config.navigationPerStop * Math.abs(distance));
}

/**
 * Scroll input, in stops (positive = forward). Ignored while a direct navigation
 * runs, because direct navigation outranks scroll.
 */
export function scrollJourney(state: JourneyState, deltaStops: number, config: JourneyConfig): JourneyState {
  if (state.phase === 'navigating' || deltaStops === 0 || !Number.isFinite(deltaStops)) return state;
  const scrollTarget = clampToRoute(state.scrollTarget + deltaStops, config);
  return {
    ...state,
    phase: 'scrolling',
    scrollTarget,
    scrollDirection: deltaStops > 0 ? 1 : -1,
    sinceScroll: 0,
  };
}

/** Direct navigation to one stop. Replaces any scroll or older navigation in progress. */
export function navigateJourney(state: JourneyState, stop: number, config: JourneyConfig): JourneyState {
  if (!Number.isFinite(stop)) return state;
  const to = clampToRoute(Math.round(stop), config);
  if (state.phase === 'idle' && state.position === to) return state;
  const from = state.position;
  return {
    ...state,
    phase: 'navigating',
    scrollTarget: to,
    scrollDirection: 0,
    sinceScroll: 0,
    navigation: {
      id: state.nextNavigationId,
      from,
      to,
      elapsed: 0,
      duration: navigationDuration(to - from, config),
    },
    nextNavigationId: state.nextNavigationId + 1,
  };
}

/** Advance time by `dt` seconds. The only function that changes `position`. */
export function stepJourney(state: JourneyState, dt: number, config: JourneyConfig): JourneyState {
  const step = clamp(Number.isFinite(dt) ? dt : 0, 0, MAX_STEP_SECONDS);
  if (state.phase === 'idle' || step === 0) return state;

  if (state.phase === 'navigating' && state.navigation) {
    const nav = state.navigation;
    const elapsed = nav.elapsed + step;
    const t = nav.duration > 0 ? Math.min(1, elapsed / nav.duration) : 1;
    if (t >= 1) {
      return { ...state, phase: 'idle', position: nav.to, scrollTarget: nav.to, navigation: null };
    }
    return {
      ...state,
      position: nav.from + (nav.to - nav.from) * easeInOutCubic(t),
      navigation: { ...nav, elapsed },
    };
  }

  // Scrolling: follow the target smoothly; once input has stopped, settle onto a stop.
  const sinceScroll = state.sinceScroll + step;
  const released = sinceScroll >= config.settleDelay;
  const target = released ? settleStop(state.scrollTarget, state.scrollDirection, config) : state.scrollTarget;
  const diff = target - state.position;
  const limit = config.maxScrollSpeed * step;
  const position = state.position + clamp(diff * (1 - Math.exp(-config.followRate * step)), -limit, limit);

  if (released && Math.abs(target - position) < SETTLE_EPSILON) {
    return { ...state, phase: 'idle', position: target, scrollTarget: target, scrollDirection: 0, sinceScroll };
  }
  return { ...state, position, scrollTarget: target, sinceScroll };
}

/** The stop the camera is at, or nearest to. */
export function currentStop(state: JourneyState): number {
  return Math.round(state.position);
}

/** The stop the journey is heading to. */
export function destinationStop(state: JourneyState, config: JourneyConfig): number {
  if (state.navigation) return state.navigation.to;
  if (state.phase === 'scrolling') return clampToRoute(Math.round(state.scrollTarget), config);
  return currentStop(state);
}
