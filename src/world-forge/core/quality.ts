/**
 * Quality presets (P5, DEC-020; blueprint "Adaptive quality"). Three tiers that keep
 * the same world, structure and lighting, and differ only in cost:
 * pixel ratio, glow, cloud layers and particle counts.
 */
export type QualityTier = 'high' | 'medium' | 'low';

export interface QualityPreset {
  /** Canvas device-pixel-ratio range. */
  dpr: [number, number];
  bloom: boolean;
  /** Cloud-sea sheets drawn (of 3). */
  cloudLayers: number;
  /** Share of the full ember count. */
  embers: number;
}

export const PRESETS: Readonly<Record<QualityTier, QualityPreset>> = {
  high: { dpr: [1, 1.75], bloom: true, cloudLayers: 3, embers: 1 },
  medium: { dpr: [1, 1.25], bloom: true, cloudLayers: 3, embers: 0.5 },
  low: { dpr: [1, 1], bloom: false, cloudLayers: 2, embers: 0.25 },
};

const ORDER: readonly QualityTier[] = ['high', 'medium', 'low'];

export interface DeviceHints {
  /** Smallest viewport side (CSS px). */
  minSide: number;
  /** navigator.deviceMemory (GB), when the browser reports it. */
  memory?: number;
  /** navigator.hardwareConcurrency, when reported. */
  cores?: number;
  /** A coarse (touch) primary pointer. */
  coarse: boolean;
}

/** Starting tier from device hints; the governor may step down from here. */
export function initialTier(hints: DeviceHints): QualityTier {
  const { memory, cores, coarse, minSide } = hints;
  if ((memory !== undefined && memory <= 2) || (cores !== undefined && cores <= 2)) return 'low';
  if ((memory !== undefined && memory <= 4) || (cores !== undefined && cores <= 4) || (coarse && minSide < 900)) return 'medium';
  return 'high';
}

/** A tier locked by `?quality=high|medium|low` (for testing and visual review), or null. */
export function forcedTier(search: string): QualityTier | null {
  const value = new URLSearchParams(search).get('quality');
  return value === 'high' || value === 'medium' || value === 'low' ? value : null;
}

/** The next tier down, or the same tier at the bottom. */
export function stepDown(tier: QualityTier): QualityTier {
  return ORDER[Math.min(ORDER.length - 1, ORDER.indexOf(tier) + 1)];
}

/** Governor rule: step down when the median frame time of a window stays above 25 ms (under 40 fps). */
export const GOVERNOR = { warmupSeconds: 2, windowSeconds: 2.5, slowFrameMs: 25, maxSteps: 2 } as const;

export function shouldStepDown(frameTimesMs: readonly number[]): boolean {
  if (frameTimesMs.length < 20) return false;
  const sorted = [...frameTimesMs].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] > GOVERNOR.slowFrameMs;
}

/** Device hints from the browser (safe when APIs are missing). */
export function readDeviceHints(): DeviceHints {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return {
    minSide: Math.min(window.innerWidth, window.innerHeight),
    memory: typeof nav.deviceMemory === 'number' ? nav.deviceMemory : undefined,
    cores: typeof nav.hardwareConcurrency === 'number' ? nav.hardwareConcurrency : undefined,
    coarse: window.matchMedia?.('(pointer: coarse)').matches ?? false,
  };
}
