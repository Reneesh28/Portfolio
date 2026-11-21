/**
 * 03 — THE BLUEPRINT ARCHIVE layout (M6.2 "The Drafting Hall", DEC-028). Pure data and maths.
 *
 * Local frame: the origin is the centre of the blue island's top surface, +Y is up, and local
 * +Z points TOWARD the hub (where the settled camera stands, P5's three-quarter view from the
 * hub side), so local −Z faces the open archipelago beyond. Local +X is the camera's right.
 *
 * Composition: a circular drafting floor etched with a blueprint; four category structures in
 * a shallow arc across its back half, facing the camera (left to right: AI & Intelligence,
 * Software Engineering, Data & Infrastructure, Creative & Game Development); a ring of low
 * archive halls and blue crystal outcrops on the rim, open on the camera's side.
 */
import { createRandom } from '../../core/random';
import { ISLANDS, type Island, type Vec3 } from '../../data/worldGeography';
import { createIslandGeometry } from '../../look/islandGeometry';
import type { SkillCategoryId } from '../../content/skills';

const island: Island = (() => {
  const found = ISLANDS.find((i) => i.id === 'blueprint-archive');
  if (!found) throw new Error('Blueprint Archive island missing');
  return found;
})();

export const ARCHIVE_ANCHOR: Vec3 = island.position;
/** Rotation about +Y that turns local +Z toward the hub. */
export const ARCHIVE_YAW = Math.atan2(-ARCHIVE_ANCHOR[0], -ARCHIVE_ANCHOR[2]);
export const ARCHIVE_ISLAND_RADIUS = island.radius;

/** The drafting floor (≈ 52 m across) and the low step around it. */
export const FLOOR = { radius: 26, top: 0.7, step: { radius: 30, top: 0.35 } } as const;

export interface StructureSite {
  id: SkillCategoryId;
  /** Centre of the structure's base on the floor (local frame). */
  position: Vec3;
  /** Height of the structure (base to the top of its crystal). */
  height: number;
  /** Footprint half-width (for picking and the etched outline). */
  half: number;
}

/** The four category structures, in category order, left to right across the floor's back half. */
export const STRUCTURES: readonly StructureSite[] = [
  { id: 'ai', position: [-20, FLOOR.top, -4], height: 36, half: 5 },
  { id: 'software', position: [-7, FLOOR.top, -13], height: 30, half: 5.5 },
  { id: 'data', position: [7, FLOOR.top, -13], height: 24, half: 6 },
  { id: 'games', position: [20, FLOOR.top, -4], height: 22, half: 5.5 },
];

/** Archive halls on the rim: local bearings (degrees from +Z), open across the camera's side. */
export const HALLS = { radius: 50, from: 62, to: 298, count: 9, size: [13, 6, 7] as Vec3 } as const;

/** Blue crystal outcrops between the halls ("Aether Cliffs"). */
export const OUTCROPS = { count: 7, radius: 58 } as const;

/** Nothing stands taller than this above the island top (the Forge stays dominant). */
export const ARCHIVE_MAX_HEIGHT = 40;

export function toWorld([x, y, z]: Vec3): Vec3 {
  const c = Math.cos(ARCHIVE_YAW);
  const s = Math.sin(ARCHIVE_YAW);
  return [ARCHIVE_ANCHOR[0] + x * c + z * s, ARCHIVE_ANCHOR[1] + y, ARCHIVE_ANCHOR[2] - x * s + z * c];
}

export function toWorldDirection([x, y, z]: Vec3): Vec3 {
  const c = Math.cos(ARCHIVE_YAW);
  const s = Math.sin(ARCHIVE_YAW);
  return [x * c + z * s, y, -x * s + z * c];
}

export const structureSite = (id: SkillCategoryId): StructureSite => {
  const site = STRUCTURES.find((s) => s.id === id);
  if (!site) throw new Error(`Unknown structure ${id}`);
  return site;
};

/** World-space middle of a structure (for picking checks and the probes). */
export function structureCentre(id: SkillCategoryId): Vec3 {
  const { position, height } = structureSite(id);
  return toWorld([position[0], position[1] + height * 0.45, position[2]]);
}

let rim: Array<[number, number]> | null = null;

/**
 * Radius of the island's top rim along a local bearing (degrees from local +Z), measured from
 * the island's own procedural geometry (the archipelago's seed), taking the nearest rim point
 * within ±8°, so anything placed inside it stays on the island.
 */
export function rimRadius(localBearing: number): number {
  if (!rim) {
    const { top, rock } = createIslandGeometry(island, createRandom(island.seed));
    const p = top.getAttribute('position');
    rim = [];
    for (let i = 0; i < p.count; i++) {
      // Top-rim vertices sit within about a metre of y = 0; the next ring of the cliff is metres lower.
      if (p.getY(i) < -2) continue;
      const r = Math.hypot(p.getX(i), p.getZ(i));
      if (r > island.radius * 0.5) rim.push([Math.atan2(p.getX(i), p.getZ(i)), r]);
    }
    top.dispose();
    rock.dispose();
  }
  const a = (localBearing * Math.PI) / 180 + ARCHIVE_YAW;
  const window = (8 * Math.PI) / 180;
  let best = Infinity;
  for (const [angle, r] of rim) {
    const d = Math.abs(Math.atan2(Math.sin(angle - a), Math.cos(angle - a)));
    if (d <= window) best = Math.min(best, r);
  }
  return Number.isFinite(best) ? best : island.radius * 0.8;
}
