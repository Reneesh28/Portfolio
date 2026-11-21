/**
 * 02 — THE WORLD FORGE: layout of the golden spire-city hub (P3, DEC-010/018).
 *
 * Pure data. World frame, island top at y = 0. Matches the blueprint images' specs:
 * an island ≈ 420 m across, a 180 m main platform, a ≈ 320 m central spire, three
 * levels (platform, forge, observation), seven gates and archive halls. It adds a
 * Projects terrace with 8 plinths for the M5 monuments (DEC-012/013).
 */
import { atBearing, gateToward, HUB, ISLANDS, REGIONS, type RegionId, type Vec3 } from '../../data/worldGeography';

export { HUB };

/** Stepped terraces of the main platform (level 1) up to the city floor (level 2). */
export const TERRACES: ReadonlyArray<{ radius: number; bottom: number; top: number }> = [
  { radius: HUB.platformRadius, bottom: 0, top: 6 },
  { radius: 64, bottom: 6, top: 14 },
  { radius: 40, bottom: 14, top: 22 },
];
export const CITY_FLOOR = TERRACES[TERRACES.length - 1].top;

/** The spire city on the platform. */
export const CITY = { radius: 84, centralHeight: HUB.coreHeight } as const;

/** Level 3: the observation rings around the city (blueprint "Observation Ring"). */
export const RINGS: ReadonlyArray<{ y: number; radius: number; tube: number; tilt: number; yaw: number }> = [
  { y: 150, radius: 128, tube: 1.3, tilt: -0.1, yaw: 0 },
  { y: 95, radius: 166, tube: 0.9, tilt: 0.07, yaw: 0.3 },
];

/** The Forge Core: the beam rising from the central spire, and the energy glow around its base. */
export const CORE = {
  beamBottom: CITY_FLOOR + HUB.coreHeight - 10,
  beamHeight: 1400,
  beamRadius: 3.5,
  glowRadius: 14,
  baseGlow: { radius: 30, bottom: CITY_FLOOR, height: 220 },
  light: { y: 130, intensity: 92000, distance: 980 },
} as const;

/** Activation on arrival (kept from M4.7): a quick swell, then the core settles. Seconds. */
export const ACTIVATION = { rise: 0.3, fall: 0.9, glowBoost: 0.35, lightBoost: 0.6, emberBoost: 0.8 } as const;
/** While a work is focused (M5.6 "subdue"), the Forge's base glow and beam haze quieten to this share. */
export const FOCUS_SUBDUE = { glow: 0.55, seconds: 0.6 } as const;

export function activationEnvelope(t: number): number {
  if (!(t >= 0) || t >= ACTIVATION.rise + ACTIVATION.fall) return 0;
  const ease = (x: number) => x * x * (3 - 2 * x);
  return t < ACTIVATION.rise ? ease(t / ACTIVATION.rise) : 1 - ease((t - ACTIVATION.rise) / ACTIVATION.fall);
}

export interface Gate {
  id: string;
  /** The region it leads to, or the Projects terrace. */
  to: RegionId | 'projects';
  bearing: number;
  position: Vec3;
  accent: string;
}

/** The island each region gate faces (its golden spoke starts at the gate). */
const GATE_TARGET: Readonly<Record<Exclude<RegionId, 'world-forge'>, string>> = {
  void: 'void',
  'origin-sanctum': 'origin-sanctum',
  'blueprint-archive': 'blueprint-archive',
  'path-of-ascension': 'pa-1',
  'worlds-beyond': 'wb-convergence',
  horizon: 'horizon',
};

/** Gate dimensions: inner opening width and height, pillar size. */
export const GATE = { opening: 24, height: 46, pillar: 7, depth: 8 } as const;

/** The 7 gates: 6 region gates (one per spoke) plus the Projects gate (DEC-018). */
export const GATES: readonly Gate[] = [
  ...(Object.keys(GATE_TARGET) as Array<keyof typeof GATE_TARGET>).map((region): Gate => {
    const island = ISLANDS.find((i) => i.id === GATE_TARGET[region]);
    if (!island) throw new Error(`Missing island for ${region}`);
    const { bearing, position } = gateToward(island.position);
    return { id: `gate-${region}`, to: region, bearing, position, accent: REGIONS.find((r) => r.id === region)?.accent ?? '#ffffff' };
  }),
  {
    id: 'gate-projects',
    to: 'projects',
    bearing: HUB.projectsBearing,
    position: atBearing(HUB.projectsBearing, HUB.gateRadius, 0.4),
    accent: REGIONS.find((r) => r.id === 'world-forge')?.accent ?? '#ffc861',
  },
];

/** The Projects terrace (M5 monuments) inside the Projects gate. */
export const PROJECTS_TERRACE = { bearing: HUB.projectsBearing, distance: 128, radius: 30, height: 4 } as const;

export interface PlinthSite {
  id: string;
  position: Vec3;
  /** Bearing the plinth faces (outward, toward visitors arriving through the Projects gate). */
  facing: number;
}

/** 8 plinths in an arc on the terrace's hub side, facing out toward the Projects gate (M5: 8 projects). */
export const PLINTH = { size: [4.6, 1.6, 4.6] as Vec3, arcRadius: 20, arcSpan: 150 } as const;
export const PLINTH_SITES: readonly PlinthSite[] = (() => {
  const centre = atBearing(PROJECTS_TERRACE.bearing, PROJECTS_TERRACE.distance, PROJECTS_TERRACE.height);
  const towardHub = PROJECTS_TERRACE.bearing + 180;
  return Array.from({ length: 8 }, (_, i) => {
    const b = towardHub - PLINTH.arcSpan / 2 + (i * PLINTH.arcSpan) / 7;
    const [dx, , dz] = atBearing(b, PLINTH.arcRadius);
    return { id: `plinth-${i + 1}`, position: [centre[0] + dx, centre[1], centre[2] + dz] as Vec3, facing: b + 180 };
  });
})();

/** Archive halls on the outer terrace, midway between gates (blueprint "Archive Halls"). */
export const HALL = { length: 44, depth: 16, height: 14, distance: 136 } as const;
export const HALL_BEARINGS = [24, 73, 115, 172, 240, 299] as const;

/** Waterfalls off the hub island's edge, on the side away from the arrival. */
export const WATERFALLS: ReadonlyArray<{ bearing: number; width: number; height: number }> = [
  { bearing: 150, width: 18, height: 380 },
  { bearing: 196, width: 24, height: 400 },
  { bearing: 236, width: 16, height: 360 },
];

export interface HubQuality {
  embers: number;
}

/** Low-power tier for small screens (structure and lighting identical). */
export function hubQuality(width: number, height: number): HubQuality {
  return { embers: Math.min(width, height) < 600 ? 140 : 420 };
}
