/**
 * THE WORLD FORGE — world geography (P2 archipelago, DEC-010/011/016).
 *
 * A floating archipelago above a sea of violet cloud, laid out hub and spokes as in
 * the owner's blueprint images. THE WORLD FORGE island is the hub at the origin; the
 * other regions are islands around it in the locked order, spiralling clockwise from
 * the Void (south). Golden routes run from the hub to every island.
 *
 * World frame: +Y up; bearings in degrees from +Z (south, toward the Void) clockwise
 * toward +X (east). Units are metres. Island tops are the walkable surfaces; all
 * island tops sit well above the cloud sea.
 *
 * This file is the single source of truth for the 3D world and the World Map (P5).
 * Geography only: no camera settings live here.
 */
export type Vec2 = [number, number]; // [x, z]
export type Vec3 = [number, number, number];

export type RegionId =
  | 'void'
  | 'origin-sanctum'
  | 'world-forge'
  | 'blueprint-archive'
  | 'path-of-ascension'
  | 'worlds-beyond'
  | 'horizon';

export interface RegionGeography {
  id: RegionId;
  index: number;
  name: string;
  role: string;
  /** Anchor point: centre of the region's main island, at its top surface. */
  position: Vec3;
  /** Approximate radius of everything the region occupies (camera framing, map markers). */
  footprint: number;
  /** Blueprint biome accent (plan §3). */
  accent: string;
}

/** Point at `distance` along world `bearing` (degrees) at height `y`. */
export function atBearing(bearing: number, distance: number, y = 0): Vec3 {
  const a = (bearing * Math.PI) / 180;
  return [Math.sin(a) * distance, y, Math.cos(a) * distance];
}

export interface Island {
  id: string;
  region: RegionId;
  /** Centre of the island's top surface. */
  position: Vec3;
  radius: number;
  thickness: number;
  depth: number;
  irregularity: number;
  jagged: number;
  shards: number;
  /** Top-surface colour (biome). */
  top: string;
  seed: number;
}

/**
 * The World Forge hub at the blueprint scale (images: total ≈ 400 m, main platform
 * ≈ 180 m, core ≈ 320 m, 3 levels, 7 gates). Island top is y = 0.
 */
export const HUB = {
  islandRadius: 210,
  platformRadius: 90,
  coreHeight: 320,
  /** Gates stand on this ring, near the island's rim. */
  gateRadius: 182,
  /** The 7th gate opens onto the Projects terrace (DEC-018). */
  projectsBearing: 330,
} as const;

const OS = atBearing(48, 470, 25);
const BA = atBearing(98, 520, 10);
const PA_SUMMIT = atBearing(162, 600, 95);
const WB = atBearing(212, 640, 30);
const HZ = atBearing(268, 880, 62);

/** The seven regions, in the locked order (DEC-011). */
export const REGIONS: readonly RegionGeography[] = [
  { id: 'void', index: 0, name: 'THE VOID', role: 'Entry & identity', position: [0, 0, 800], footprint: 74, accent: '#a46bff' },
  { id: 'origin-sanctum', index: 1, name: 'THE ORIGIN SANCTUM', role: 'About', position: OS, footprint: 70, accent: '#3fd08a' },
  { id: 'world-forge', index: 2, name: 'THE WORLD FORGE', role: 'Projects', position: [0, 0, 0], footprint: 210, accent: '#ffc861' },
  { id: 'blueprint-archive', index: 3, name: 'THE BLUEPRINT ARCHIVE', role: 'Skills', position: BA, footprint: 72, accent: '#4fb4ff' },
  { id: 'path-of-ascension', index: 4, name: 'THE PATH OF ASCENSION', role: 'Experience & education', position: PA_SUMMIT, footprint: 120, accent: '#dfe9ff' },
  { id: 'worlds-beyond', index: 5, name: 'THE WORLDS BEYOND', role: 'Interests', position: WB, footprint: 170, accent: '#b06bff' },
  { id: 'horizon', index: 6, name: 'THE HORIZON', role: 'Ambitions & contact', position: HZ, footprint: 60, accent: '#f2d38a' },
];

/** The six Worlds Beyond territories around the Convergence (biomes from the images; final six follow the M7 audit). */
export const WORLDS_BEYOND_TERRITORIES: ReadonlyArray<{ id: string; bearing: number; distance: number; y: number; radius: number; top: string; accent: string }> = [
  { id: 'wb-ember', bearing: 20, distance: 135, y: 12, radius: 26, top: '#4a2420', accent: '#ff5a3c' },
  { id: 'wb-temporal', bearing: 80, distance: 140, y: 45, radius: 24, top: '#33244f', accent: '#b06bff' },
  { id: 'wb-sunken', bearing: 140, distance: 130, y: 5, radius: 28, top: '#1f3f3c', accent: '#3fc9b0' },
  { id: 'wb-dunes', bearing: 200, distance: 140, y: 30, radius: 25, top: '#4d3f28', accent: '#e3b35a' },
  { id: 'wb-steel', bearing: 260, distance: 135, y: 55, radius: 22, top: '#383d47', accent: '#9aa7b8' },
  { id: 'wb-shadow', bearing: 320, distance: 140, y: 20, radius: 24, top: '#241f42', accent: '#5d4bd6' },
];

const offset = ([x, y, z]: Vec3, [dx, dy, dz]: Vec3): Vec3 => [x + dx, y + dy, z + dz];

/** Every island in the world. */
export const ISLANDS: readonly Island[] = [
  // Hub: the World Forge island at the blueprint scale (≈ 420 m across, P3).
  { id: 'forge', region: 'world-forge', position: [0, 0, 0], radius: HUB.islandRadius, thickness: 34, depth: 320, irregularity: 0.08, jagged: 0.85, shards: 18, top: '#34324a', seed: 11 },
  // The Void: the portal realm's island (P4), carrying the arrival platform, the portal and the opening camera.
  { id: 'void', region: 'void', position: [0, 0, 795], radius: 74, thickness: 18, depth: 130, irregularity: 0.16, jagged: 0.95, shards: 11, top: '#2a2440', seed: 3 },
  { id: 'origin-sanctum', region: 'origin-sanctum', position: OS, radius: 70, thickness: 14, depth: 120, irregularity: 0.22, jagged: 0.85, shards: 9, top: '#1f5c40', seed: 23 },
  { id: 'blueprint-archive', region: 'blueprint-archive', position: BA, radius: 72, thickness: 16, depth: 120, irregularity: 0.14, jagged: 0.8, shards: 9, top: '#25385a', seed: 31 },
  // The Path of Ascension: four islands climbing to the summit.
  { id: 'pa-1', region: 'path-of-ascension', position: atBearing(132, 480, 15), radius: 34, thickness: 10, depth: 60, irregularity: 0.25, jagged: 0.9, shards: 4, top: '#6f7a90', seed: 41 },
  { id: 'pa-2', region: 'path-of-ascension', position: atBearing(142, 520, 38), radius: 32, thickness: 10, depth: 58, irregularity: 0.25, jagged: 0.9, shards: 4, top: '#7d889e', seed: 42 },
  { id: 'pa-3', region: 'path-of-ascension', position: atBearing(152, 560, 64), radius: 30, thickness: 10, depth: 56, irregularity: 0.25, jagged: 0.9, shards: 4, top: '#8c97ad', seed: 43 },
  { id: 'pa-summit', region: 'path-of-ascension', position: PA_SUMMIT, radius: 40, thickness: 12, depth: 80, irregularity: 0.22, jagged: 0.95, shards: 6, top: '#9aa6bd', seed: 44 },
  // The Worlds Beyond: the Convergence and six territories.
  { id: 'wb-convergence', region: 'worlds-beyond', position: WB, radius: 48, thickness: 12, depth: 90, irregularity: 0.15, jagged: 0.85, shards: 7, top: '#2e2550', seed: 51 },
  ...WORLDS_BEYOND_TERRITORIES.map((t, i): Island => {
    const [dx, , dz] = atBearing(t.bearing, t.distance);
    return { id: t.id, region: 'worlds-beyond', position: offset(WB, [dx, t.y - WB[1], dz]), radius: t.radius, thickness: 8, depth: t.radius * 1.9, irregularity: 0.28, jagged: 1, shards: 4, top: t.top, seed: 60 + i };
  }),
  // The Horizon: the farthest island, facing open sky.
  { id: 'horizon', region: 'horizon', position: HZ, radius: 55, thickness: 14, depth: 100, irregularity: 0.2, jagged: 0.9, shards: 7, top: '#4d4560', seed: 71 },
];

/** Fragments drifting out beyond the Horizon's edge: the world continues. */
export const HORIZON_BEYOND: readonly Vec3[] = [atBearing(271, 980, 50), atBearing(274, 1060, 36), atBearing(277, 1140, 22), atBearing(280, 1230, 6)];

export type RouteKind = 'spoke' | 'link';

export interface WorldRoute {
  id: string;
  kind: RouteKind;
  from: Vec3;
  to: Vec3;
  /** Height of the route's arc at its middle (m). */
  lift: number;
}

const islandById = (id: string): Island => {
  const island = ISLANDS.find((i) => i.id === id);
  if (!island) throw new Error(`Unknown island ${id}`);
  return island;
};

/** Point on an island's rim facing a target point (just inside the edge, on the top surface). */
export function rimToward(island: Island, target: Vec3, inset = 6): Vec3 {
  const [x, y, z] = island.position;
  const a = Math.atan2(target[0] - x, target[2] - z);
  return [x + Math.sin(a) * (island.radius - inset), y + 0.4, z + Math.cos(a) * (island.radius - inset)];
}

/** Hub gate for a region: on the gate ring, facing the region's island (DEC-018). */
export function gateToward(target: Vec3): { bearing: number; position: Vec3 } {
  const bearing = (Math.atan2(target[0], target[2]) * 180) / Math.PI;
  return { bearing, position: atBearing(bearing, HUB.gateRadius, 0.4) };
}

function spoke(regionIsland: string, region: RegionId): WorldRoute {
  const island = islandById(regionIsland);
  const from = gateToward(island.position).position;
  const to = rimToward(island, [0, 0, 0]);
  const length = Math.hypot(to[0] - from[0], to[2] - from[2]);
  return { id: `spoke-${region}`, kind: 'spoke', from, to, lift: Math.min(60, length * 0.08) };
}

function link(a: string, b: string): WorldRoute {
  const ia = islandById(a);
  const ib = islandById(b);
  const from = rimToward(ia, ib.position, 4);
  const to = rimToward(ib, ia.position, 4);
  return { id: `link-${a}-${b}`, kind: 'link', from, to, lift: Math.hypot(to[0] - from[0], to[2] - from[2]) * 0.1 };
}

/** Golden routes: a spoke from the hub to every region, plus links within multi-island regions. */
export const WORLD_ROUTES: readonly WorldRoute[] = [
  spoke('void', 'void'),
  spoke('origin-sanctum', 'origin-sanctum'),
  spoke('blueprint-archive', 'blueprint-archive'),
  spoke('pa-1', 'path-of-ascension'),
  spoke('wb-convergence', 'worlds-beyond'),
  spoke('horizon', 'horizon'),
  link('pa-1', 'pa-2'),
  link('pa-2', 'pa-3'),
  link('pa-3', 'pa-summit'),
  ...WORLDS_BEYOND_TERRITORIES.map((t) => link('wb-convergence', t.id)),
];

/** Cloud-sea layers (heights of the three sheets) — island undersides dip into them, tops stay clear. */
export const CLOUD_LAYERS = [-150, -95, -55] as const;
