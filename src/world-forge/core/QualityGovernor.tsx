import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { GOVERNOR, shouldStepDown } from './quality';

interface QualityGovernorProps {
  /** Called when sustained frame times are too slow for the current tier. */
  onStepDown: () => void;
  /** False when the tier is locked, at the bottom, or the frameloop renders on demand. */
  active: boolean;
}

/**
 * Watches frame times after a warm-up and asks for a lower tier when the median of a
 * window stays above the slow-frame threshold (at most GOVERNOR.maxSteps times).
 */
export default function QualityGovernor({ onStepDown, active }: QualityGovernorProps) {
  const state = useRef({ started: -1, windowStart: -1, frames: [] as number[], steps: 0 });

  useFrame(({ clock }, delta) => {
    const s = state.current;
    if (!active || s.steps >= GOVERNOR.maxSteps) return;
    const now = clock.elapsedTime;
    if (s.started < 0) s.started = now;
    if (now - s.started < GOVERNOR.warmupSeconds) return;
    if (s.windowStart < 0) s.windowStart = now;
    s.frames.push(delta * 1000);
    if (now - s.windowStart < GOVERNOR.windowSeconds) return;
    const slow = shouldStepDown(s.frames);
    s.frames = [];
    s.windowStart = now;
    if (slow) {
      s.steps += 1;
      // Give the new tier its own warm-up before judging again.
      s.started = now;
      s.windowStart = -1;
      onStepDown();
    }
  });
  return null;
}
