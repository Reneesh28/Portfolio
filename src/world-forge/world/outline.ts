import { createRandom, range } from '../core/random';
import type { Vec2 } from '../data/worldGeography';

/** Irregular closed outline around a centre — deterministic for a given seed. */
export function organicOutline(center: Vec2, radius: number, seed: number, points = 9, jitter = 0.22): Vec2[] {
  const rand = createRandom(seed);
  const offset = rand() * Math.PI * 2;
  return Array.from({ length: points }, (_, i) => {
    const angle = offset + (i / points) * Math.PI * 2 + range(rand, -0.15, 0.15);
    const r = radius * (1 + range(rand, -jitter, jitter));
    return [center[0] + Math.cos(angle) * r, center[1] + Math.sin(angle) * r] as Vec2;
  });
}
