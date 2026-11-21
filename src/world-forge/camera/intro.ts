/**
 * The Void intro (P4, DEC-016/019): a "camera letdown". The opening camera starts
 * higher and further back and eases down into the opening pose while the portal
 * ignites. It runs at most INTRO.seconds (≤ 4 s), any journey input skips it
 * (the remaining offset fades out quickly), and it never runs under reduced motion.
 */
export const INTRO = { seconds: 3.5, back: 30, up: 26, skipFade: 0.35 } as const;

const ease = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};

/**
 * Share (0–1) of the intro offset still applied `elapsed` seconds after it started.
 * `skippedAt` is the elapsed time at which input skipped it (null if not skipped).
 */
export function introRemaining(elapsed: number, skippedAt: number | null): number {
  if (!Number.isFinite(elapsed) || elapsed < 0) return 1;
  const running = 1 - ease(elapsed / INTRO.seconds);
  if (skippedAt === null || elapsed <= skippedAt) return running;
  const atSkip = 1 - ease(skippedAt / INTRO.seconds);
  return atSkip * (1 - ease((elapsed - skippedAt) / INTRO.skipFade));
}
