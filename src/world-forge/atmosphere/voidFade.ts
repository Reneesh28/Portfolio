/** Journey distance (in stops) over which the Void's opening backdrop hands over to the world sky. */
export const VOID_FADE_STOPS = 0.45;

/**
 * Opacity of the Void's horizon glow at a journey position: 1 at the Void stop,
 * easing to 0 by `VOID_FADE_STOPS`. The world sky uses `1 − voidBackdropOpacity`,
 * so the two hand over exactly and the opening shot never shows the sky.
 */
export function voidBackdropOpacity(position: number): number {
  const t = Math.min(1, Math.max(0, position) / VOID_FADE_STOPS);
  return 1 - t * t * (3 - 2 * t);
}
