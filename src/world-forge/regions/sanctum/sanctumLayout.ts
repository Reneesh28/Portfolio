/**
 * 01 — THE ORIGIN SANCTUM layout (M6.1 "The Quiet Court", DEC-026). Pure data and maths.
 *
 * Everything is placed in the Sanctum's local frame: the origin is the centre of the
 * emerald island's top surface, +Y is up, and local +Z points AWAY from the hub (where the
 * settled camera stands), so local −Z faces the World Forge. Local +X is the camera's
 * right. `toWorld` maps a local point into the world.
 *
 * Composition: grassy terraces step up to a circular stone court; a pillar ring surrounds a
 * still pool; three identity fragments float on platforms around the court (Engineer left,
 * Creator right, Explorer far and highest, toward the Forge); a broken halo hangs above;
 * two waterfalls pour off its hub-facing edge; moss mounds and small pines dot the open
 * ground. Nothing stands taller than ~30 m.
 */
import { createRandom } from '../../core/random';
import { ISLANDS, type Island, type Vec3 } from '../../data/worldGeography';
import { createIslandGeometry } from '../../look/islandGeometry';

export type FragmentId = 'engineer' | 'creator' | 'explorer';

const island: Island = (() => {
  const found = ISLANDS.find((i) => i.id === 'origin-sanctum');
  if (!found) throw new Error('Origin Sanctum island missing');
  return found;
})();

/** World position of the island's top centre (the local origin). */
export const SANCTUM_ANCHOR: Vec3 = island.position;
/** Rotation about +Y that turns local +Z outward, away from the hub. */
export const SANCTUM_YAW = Math.atan2(SANCTUM_ANCHOR[0], SANCTUM_ANCHOR[2]);

/** Grassy terraces stepping up to the court: radius and the height of each terrace's top. */
export const TERRACES = [
  { radius: 38, top: 1.4 },
  { radius: 27, top: 2.8 },
] as const;

/** The court floor (≈ 36 m across) on the upper terrace. */
export const COURT = { radius: 18, thickness: 0.6, top: 3.4 } as const;

/** The still pool at the court's centre. */
export const POOL = { radius: 5.6, rim: 0.45 } as const;

/** The weathered pillar ring: some broken short, a few carrying a lintel. */
export const PILLARS = {
  ring: 16.5,
  count: 12,
  radius: 1.15,
  height: 11,
  broken: [3, 8] as readonly number[],
  brokenHeight: 4.6,
  /** Pairs of neighbouring pillars that carry a lintel (both must be whole). */
  lintels: [
    [0, 1],
    [5, 6],
    [9, 10],
  ] as ReadonlyArray<readonly [number, number]>,
} as const;

export interface FragmentSite {
  id: FragmentId;
  /** Centre of the platform's top surface (local frame). */
  position: Vec3;
  /** Yaw of the form on the platform (radians), so it turns toward the visitor. */
  yaw: number;
}

export const PLATFORM = { radius: 6, thickness: 1.6, hang: 6 } as const;

/** The three identity fragments (master doc §6: Engineer, Creator, Explorer). */
export const FRAGMENTS: readonly FragmentSite[] = [
  { id: 'engineer', position: [-29, 10, -6], yaw: 0.35 },
  { id: 'creator', position: [29, 12, -6], yaw: -0.35 },
  { id: 'explorer', position: [0, 15, -36], yaw: 0 },
];

/** Height of each fragment's form above its platform top (for focus and picking). */
export const FORM_HEIGHT: Readonly<Record<FragmentId, number>> = { engineer: 8.4, creator: 8.8, explorer: 14.6 };

/** The broken halo above the court. */
/** It hangs high enough to stay clear of the settled view's sightline to the Explorer. */
export const HALO = { y: COURT.top + 22, radius: 6.8, tube: 0.55, arc: (220 * Math.PI) / 180, tilt: 0.42 } as const;

/**
 * Waterfalls off the hub-facing edge (local bearings in degrees from +Z), and their size. They read
 * from the Forge side and on the flight to the Forge; from the settled view the island itself hides
 * them (it sits between the camera and any edge in frame).
 */
export const WATERFALLS = [
  { bearing: 158, width: 7, height: 170 },
  { bearing: -162, width: 6, height: 150 },
] as const;

/** Verdant ground between the terraces and the rim: moss mounds and small pines (counts; seeded). */
export const GROUND = { mounds: 26, pines: 16, inner: TERRACES[0].radius + 3 } as const;

/** Total height budget: nothing stands taller than this above the island top (M6.1 proposal §2.1). */
export const SANCTUM_MAX_HEIGHT = 31;

/** Local point → world point. */
export function toWorld([x, y, z]: Vec3): Vec3 {
  const c = Math.cos(SANCTUM_YAW);
  const s = Math.sin(SANCTUM_YAW);
  return [SANCTUM_ANCHOR[0] + x * c + z * s, SANCTUM_ANCHOR[1] + y, SANCTUM_ANCHOR[2] - x * s + z * c];
}

/** Local direction → world direction (rotation only). */
export function toWorldDirection([x, y, z]: Vec3): Vec3 {
  const c = Math.cos(SANCTUM_YAW);
  const s = Math.sin(SANCTUM_YAW);
  return [x * c + z * s, y, -x * s + z * c];
}

export const fragmentSite = (id: FragmentId): FragmentSite => {
  const site = FRAGMENTS.find((f) => f.id === id);
  if (!site) throw new Error(`Unknown fragment ${id}`);
  return site;
};

/** World-space centre of a fragment's form (platform top plus half the form). */
export function fragmentCentre(id: FragmentId): Vec3 {
  const [x, y, z] = fragmentSite(id).position;
  return toWorld([x, y + FORM_HEIGHT[id] / 2, z]);
}

let rim: Array<[number, number]> | null = null;

/**
 * Radius of the island's top rim along a local bearing (degrees from local +Z), measured
 * from the island's own procedural geometry (the same seed the archipelago uses), taking
 * the nearest rim point within ±8° so anything placed inside it stays on the island.
 */
export function rimRadius(localBearing: number): number {
  if (!rim) {
    const { top, rock } = createIslandGeometry(island, createRandom(island.seed));
    const p = top.getAttribute('position');
    rim = [];
    for (let i = 0; i < p.count; i++) {
      // Top-rim vertices sit within ±0.9 m of y = 0; the next ring of the cliff is ~4.7 m lower.
      if (p.getY(i) < -2) continue;
      const r = Math.hypot(p.getX(i), p.getZ(i));
      if (r > island.radius * 0.5) rim.push([Math.atan2(p.getX(i), p.getZ(i)), r]);
    }
    top.dispose();
    rock.dispose();
  }
  // The island geometry is unrotated (world frame); a local bearing is offset by the yaw.
  const a = (localBearing * Math.PI) / 180 + SANCTUM_YAW;
  const window = (8 * Math.PI) / 180;
  let best = Infinity;
  for (const [angle, r] of rim) {
    const d = Math.abs(Math.atan2(Math.sin(angle - a), Math.cos(angle - a)));
    if (d <= window) best = Math.min(best, r);
  }
  return Number.isFinite(best) ? best : island.radius * 0.8;
}
