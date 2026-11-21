/**
 * THE WORLD FORGE — scroll interpretation (pure, framework-free).
 *
 * Turns raw wheel / trackpad / touch deltas into journey requests:
 *  - Full motion: continuous scroll in stops (`{ type: 'scroll', stops }`).
 *  - Reduced motion: no continuous scroll motion. One gesture = one region step
 *    (`{ type: 'step', direction }`); a gesture must end before the next step, so a
 *    long trackpad flick can't skip several regions.
 *
 * Positive deltas mean "forward" (wheel down / finger moving up).
 */

/** Wheel pixels that make one journey stop. One mouse-wheel notch (~100 px) ≈ 0.17 stop. */
export const PIXELS_PER_STOP = 600;
/** Touch travel is shorter than wheel travel: a ~40%-of-screen swipe ≈ one stop. */
export const TOUCH_PIXELS_PER_STOP = 320;
/** Largest single input event, in stops, so one burst can't fling the journey. */
export const MAX_EVENT_STOPS = 0.6;
/** Reduced motion: accumulated stops needed to trigger a step. */
export const STEP_THRESHOLD_STOPS = 0.12;
/** Reduced motion: quiet time that ends a gesture (ms). */
export const GESTURE_GAP_MS = 220;

const LINE_HEIGHT_PX = 16;

/** Normalise `WheelEvent.deltaY` to pixels (deltaMode 0 = px, 1 = lines, 2 = pages). */
export function wheelDeltaPixels(deltaY: number, deltaMode: number, pageHeight: number): number {
  if (!Number.isFinite(deltaY)) return 0;
  if (deltaMode === 1) return deltaY * LINE_HEIGHT_PX;
  if (deltaMode === 2) return deltaY * pageHeight;
  return deltaY;
}

export type JourneyRequest = { type: 'scroll'; stops: number } | { type: 'step'; direction: -1 | 1 } | null;

export interface ScrollInterpreter {
  /** Feed a forward-positive delta in pixels; returns the journey request to make, if any. */
  input(pixels: number, pixelsPerStop: number, nowMs: number): JourneyRequest;
  setReducedMotion(reduced: boolean): void;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function createScrollInterpreter(reducedMotion = false): ScrollInterpreter {
  let reduced = reducedMotion;
  let accumulated = 0;
  let lastInputMs = -Infinity;
  let stepped = false;

  return {
    setReducedMotion(next) {
      reduced = next;
      accumulated = 0;
      stepped = false;
    },
    input(pixels, pixelsPerStop, nowMs) {
      if (!Number.isFinite(pixels) || pixels === 0 || pixelsPerStop <= 0) return null;
      const stops = clamp(pixels / pixelsPerStop, -MAX_EVENT_STOPS, MAX_EVENT_STOPS);
      if (!reduced) return { type: 'scroll', stops };

      // Reduced motion: one discrete step per gesture.
      if (nowMs - lastInputMs > GESTURE_GAP_MS || Math.sign(stops) !== Math.sign(accumulated)) {
        accumulated = 0;
        stepped = false;
      }
      lastInputMs = nowMs;
      accumulated += stops;
      if (stepped || Math.abs(accumulated) < STEP_THRESHOLD_STOPS) return null;
      stepped = true;
      return { type: 'step', direction: accumulated > 0 ? 1 : -1 };
    },
  };
}

/** What a key press means for the journey. */
export interface KeyContext {
  key: string;
  shiftKey: boolean;
  /** Ctrl, Alt or Meta held — browser/OS shortcuts, never journey input. */
  modified: boolean;
  /** Focus is on a control that uses the key itself (input, select, editable, …). */
  inTextEntry: boolean;
  /** Focus is on a button or link (Space/Enter activate it). */
  onControl: boolean;
}

/**
 * Keyboard journey travel: PageDown / ArrowDown / Space → next region;
 * PageUp / ArrowUp / Shift+Space → previous region. Home/End are not bound
 * globally (browser conflicts); they work inside the region menu.
 */
export function keyboardStep(context: KeyContext): -1 | 1 | null {
  if (context.modified || context.inTextEntry) return null;
  switch (context.key) {
    case 'PageDown':
    case 'ArrowDown':
      return 1;
    case 'PageUp':
    case 'ArrowUp':
      return -1;
    case ' ':
      if (context.onControl) return null;
      return context.shiftKey ? -1 : 1;
    default:
      return null;
  }
}
