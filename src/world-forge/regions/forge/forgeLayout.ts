/**
 * 02 — THE WORLD FORGE: layout of the centrepiece ("The Crucible of Worlds", DEC-007).
 *
 * Pure data and math, no three.js objects. Everything is in the Forge's LOCAL frame:
 * origin at the world origin, rotated about +Y by `FORGE_YAW`, which is the orientation
 * the approved M2 opening shot sees. Keeping the approved envelope (tier radii and
 * heights, pillar placement, crown ring, sentinels, light column) keeps the Forge's
 * distant read from the Void.
 *
 * Bearings are in degrees, measured from +Z toward +X (seen from above), the same
 * convention as M3's `FORGE_WARD`. Local bearing = world bearing − FORGE_YAW.
 */
import { REFERENCE_YAW } from '../void/layout';

export type Vec2 = [number, number];
export type Vec3 = [number, number, number];

export const FORGE_YAW = REFERENCE_YAW;
export const FORGE_YAW_DEG = (FORGE_YAW * 180) / Math.PI;
const DEG = Math.PI / 180;

/** Point at `distance` along local `bearing` (degrees): [x, z]. */
export function polar(bearingDeg: number, distance: number): Vec2 {
  return [Math.sin(bearingDeg * DEG) * distance, Math.cos(bearingDeg * DEG) * distance];
}

/** Local point → world point (rotation about +Y by FORGE_YAW). */
export function toWorld([x, y, z]: Vec3): Vec3 {
  const c = Math.cos(FORGE_YAW);
  const s = Math.sin(FORGE_YAW);
  return [x * c + z * s, y, -x * s + z * c];
}

/** World point → local point. */
export function toLocal([x, y, z]: Vec3): Vec3 {
  const c = Math.cos(FORGE_YAW);
  const s = Math.sin(FORGE_YAW);
  return [x * c - z * s, y, x * s + z * c];
}

export const worldToLocalBearing = (worldDeg: number): number => worldDeg - FORGE_YAW_DEG;

/* ---------------------------------------------------------------- Foundation */

export interface Tier {
  name: 'T1' | 'T2' | 'T3';
  /** Vertex radius of the octagon at its base and top (CylinderGeometry radii). */
  bottomRadius: number;
  topRadius: number;
  bottom: number;
  top: number;
}

/** The three octagonal tiers, exactly the approved silhouette. */
export const TIERS: readonly Tier[] = [
  { name: 'T1', bottomRadius: 32, topRadius: 26, bottom: 0, top: 6 },
  { name: 'T2', bottomRadius: 20, topRadius: 17, bottom: 6, top: 11 },
  { name: 'T3', bottomRadius: 13.5, topRadius: 11, bottom: 11, top: 16 },
];

export const OCTAGON_SIDES = 8;
/** Face-centre distance of a regular octagon with the given vertex radius. */
export const apothem = (vertexRadius: number): number => vertexRadius * Math.cos(Math.PI / OCTAGON_SIDES);
/** CylinderGeometry puts octagon vertices at local bearings 0°, 45°…; faces are centred on 22.5° + k·45°. */
export const faceBearing = (k: number): number => 22.5 + k * 45;

/** Top of the core dais (T3). */
export const DAIS_TOP = TIERS[2].top;

/* ---------------------------------------------------------------- Core */

/** Three fractured pillars, leaning inward around the seam (approved placement). */
export const CORE = {
  /** Polar angles (radians) in the approved placeholder convention: x = cos a · r, z = sin a · r. */
  pillarAngles: [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3] as const,
  pillarRadius: 3.4,
  pillarCentreY: 31,
  pillarHeight: 34,
  pillarTopRadius: 0.7,
  pillarBottomRadius: 3,
  lean: 0.05,
  /** The molten seam between the pillars. */
  seamBottom: 16,
  seamTop: 42,
  /** The warm core light. */
  lightY: 27,
} as const;

/* ---------------------------------------------------------------- Crown */

export const CROWN = {
  y: 45,
  radius: 8.5,
  tube: 0.55,
  /** Tilt of the ring plane (approved): rotation about X of π/2 − 0.08. */
  tilt: Math.PI / 2 - 0.08,
  /** Segmented halo: deliberately unfinished. [start, length] of each segment, as fractions of the full turn. */
  segments: [
    [0.0, 0.1], [0.115, 0.085], [0.215, 0.12], [0.355, 0.075], [0.445, 0.11],
    [0.57, 0.095], [0.68, 0.115], [0.81, 0.07], [0.895, 0.09],
  ] as ReadonlyArray<Vec2>,
  filamentRadius: 8.05,
  filamentTube: 0.09,
} as const;

/** Light column rising from the core (approved, unchanged). */
export const BEAM = { y: 105, height: 120, topRadius: 0.5, bottomRadius: 1.4 } as const;

/* ---------------------------------------------------------------- Orbit */

/** Four sentinel towers standing on the terraces (approved placement). x = cos a · 15, z = sin a · 15. */
export const SENTINELS: ReadonlyArray<{ angle: number; height: number }> = [
  { angle: 0.5, height: 18 },
  { angle: 2.1, height: 14 },
  { angle: 3.6, height: 20 },
  { angle: 5.0, height: 15 },
];
export const SENTINEL_RADIUS = 15;
export const SENTINEL_BASE_Y = 11;

export interface OrbitFragment {
  /** Local bearing (degrees), distance from the axis, height. */
  bearing: number;
  distance: number;
  y: number;
  size: Vec3;
  tilt: Vec3;
}

/** At most five worked-stone fragments circling at crown height (DEC-007). */
export const ORBIT_FRAGMENTS: readonly OrbitFragment[] = [
  { bearing: 20, distance: 16, y: 44, size: [2.6, 1.6, 1.9], tilt: [0.3, 0.4, 0.15] },
  { bearing: 95, distance: 19, y: 50, size: [1.7, 2.4, 1.5], tilt: [0.1, 1.1, 0.35] },
  { bearing: 165, distance: 14.5, y: 39, size: [2.2, 1.3, 2.8], tilt: [0.45, 0.2, 0.1] },
  { bearing: 240, distance: 18, y: 47, size: [1.5, 1.5, 2.1], tilt: [0.2, 0.7, 0.5] },
  { bearing: 305, distance: 15.5, y: 52, size: [2.0, 1.2, 1.4], tilt: [0.6, 0.3, 0.2] },
];
/** Radians per second for the orbit (very slow; static under reduced motion). */
export const ORBIT_SPEED = 0.022;

/* ---------------------------------------------------------------- Terraces */

export interface StairFlight {
  /** Local bearing of the octagon face the flight climbs. */
  bearing: number;
  /** Distance from the axis (along the bearing) where the flight starts and ends. */
  from: number;
  to: number;
  bottom: number;
  top: number;
  width: number;
  steps: number;
}

const SOUTH_FACE = faceBearing(7); // local 337.5° → world ≈ −9.5°: the face toward the Void
const EAST_FACE = faceBearing(2); // local 112.5° → world ≈ 125.5°: the face toward the Archive avenue

/** Grand stair (south, three flights narrowing toward the core) and east stair (two flights). */
export const STAIRS: Readonly<Record<'south' | 'east', readonly StairFlight[]>> = {
  south: [
    { bearing: SOUTH_FACE, from: 31.5, to: apothem(TIERS[0].topRadius), bottom: 0, top: 6, width: 9, steps: 12 },
    { bearing: SOUTH_FACE, from: 21.2, to: apothem(TIERS[1].topRadius), bottom: 6, top: 11, width: 7, steps: 10 },
    { bearing: SOUTH_FACE, from: 15.2, to: apothem(TIERS[2].topRadius), bottom: 11, top: 16, width: 5.5, steps: 10 },
  ],
  east: [
    { bearing: EAST_FACE, from: 31, to: apothem(TIERS[0].topRadius), bottom: 0, top: 6, width: 6, steps: 12 },
    { bearing: EAST_FACE, from: 21, to: apothem(TIERS[1].topRadius), bottom: 6, top: 11, width: 5, steps: 10 },
  ],
};

export const ALL_FLIGHTS: readonly StairFlight[] = [...STAIRS.south, ...STAIRS.east];

export interface StepBox {
  /** Local centre and size [lateral, height, depth]; rotation about Y = bearing. */
  position: Vec3;
  size: Vec3;
  bearing: number;
}

/** Solid step blocks (each from the flight's base up to its tread): no floating slabs. */
export function flightSteps(flight: StairFlight): StepBox[] {
  const run = (flight.from - flight.to) / flight.steps;
  const rise = (flight.top - flight.bottom) / flight.steps;
  return Array.from({ length: flight.steps }, (_, i) => {
    const outer = flight.from - i * run;
    const mid = outer - run / 2;
    const top = flight.bottom + (i + 1) * rise;
    const [x, z] = polar(flight.bearing, mid);
    return {
      position: [x, (flight.bottom + top) / 2, z],
      size: [flight.width, top - flight.bottom, run],
      bearing: flight.bearing,
    };
  });
}

/** Walkable ring on top of T1 that carries the monument plinths (DEC-008). */
export const MONUMENT_RING = {
  radius: 21.9,
  y: TIERS[0].top,
  plinthSize: [2.4, 0.7, 2.4] as Vec3,
  /** World bearings of the 7 reserved sites, an arc facing the south/south-east arrival (M5 confirms the count). */
  worldBearings: [-40, 12, 27, 42, 57, 72, 87] as const,
} as const;

export interface PlinthSite {
  id: string;
  /** Local bearing (degrees) and centre. */
  bearing: number;
  position: Vec3;
}

export const PLINTH_SITES: readonly PlinthSite[] = MONUMENT_RING.worldBearings.map((world, i) => {
  const bearing = worldToLocalBearing(world);
  const [x, z] = polar(bearing, MONUMENT_RING.radius);
  return { id: `plinth-${i + 1}`, bearing, position: [x, MONUMENT_RING.y, z] };
});

/** M3 route ends the stairs connect to (world coordinates, from `WORLD_ROUTES`). */
export const ROUTE_ENDS = {
  sanctum: [38, 0, 31] as Vec3,
  archive: [46, 0, -14] as Vec3,
} as const;

/** Forecourt in front of the south stair: [lateral width, depth], centred at `distance` along the south face. */
export const FORECOURT = { distance: 36.5, width: 18, depth: 9, thickness: 0.16 } as const;

/* ---------------------------------------------------------------- Quality */

export interface ForgeQuality {
  fragments: number;
  embers: number;
}

/** Low-power tier for small screens (doc: mobile simplification). Structure and lighting are identical. */
export function forgeQuality(width: number, height: number): ForgeQuality {
  return Math.min(width, height) < 600 ? { fragments: 3, embers: 110 } : { fragments: ORBIT_FRAGMENTS.length, embers: 320 };
}
