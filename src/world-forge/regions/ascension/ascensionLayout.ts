/**
 * 04 — THE PATH OF ASCENSION layout (M6.3 "The Lit Ascent", DEC-030). Pure data and maths,
 * in world coordinates (the Path spans four islands).
 *
 * A pale stone path climbs the four P2 islands (pa-1 → pa-2 → pa-3 → summit). Floating stair
 * spans carry it over each gap, beside the golden links, and a small floating platform midway
 * between pa-2 and pa-3 holds the third milestone. Five waystones mark the milestones; lanterns
 * line the whole path in order, so "lit up to a milestone" is a distance along it. Snow-capped
 * pinnacles stand on each island's far side (away from the hub, behind the path).
 */
import { ISLANDS, type Island, type Vec3 } from '../../data/worldGeography';
import type { MilestoneId } from '../../content/timeline';

const islandById = (id: string): Island => {
  const found = ISLANDS.find((i) => i.id === id);
  if (!found) throw new Error(`Island ${id} missing`);
  return found;
};

export const PATH_ISLANDS: readonly Island[] = ['pa-1', 'pa-2', 'pa-3', 'pa-summit'].map(islandById);

const norm2 = ([x, z]: [number, number]): [number, number] => {
  const l = Math.hypot(x, z) || 1;
  return [x / l, z / l];
};

/** Centre of the climb (mean of the four island tops). */
export const CLIMB_CENTRE: Vec3 = PATH_ISLANDS.reduce<Vec3>((c, i) => [c[0] + i.position[0] / 4, c[1] + i.position[1] / 4, c[2] + i.position[2] / 4], [0, 0, 0]);

/** Horizontal direction of the climb (pa-1 toward the summit). */
export const CLIMB_DIRECTION = norm2([PATH_ISLANDS[3].position[0] - PATH_ISLANDS[0].position[0], PATH_ISLANDS[3].position[2] - PATH_ISLANDS[0].position[2]]);

/** Horizontal direction across the climb, toward the hub (the camera's side). */
export const TOWARD_HUB: [number, number] = (() => {
  const [dx, dz] = CLIMB_DIRECTION;
  const a: [number, number] = [-dz, dx];
  const hub = norm2([-CLIMB_CENTRE[0], -CLIMB_CENTRE[2]]);
  return a[0] * hub[0] + a[1] * hub[1] > 0 ? a : [dz, -dx];
})();

const along = (p: Vec3, [dx, dz]: [number, number], d: number, dy = 0): Vec3 => [p[0] + dx * d, p[1] + dy, p[2] + dz * d];

/** Point on an island's rim toward a target, pulled `inset` inside the edge (on the top surface). */
function rimPoint(island: Island, target: Vec3, inset: number): Vec3 {
  const [dx, dz] = norm2([target[0] - island.position[0], target[2] - island.position[2]]);
  return [island.position[0] + dx * (island.radius - inset), island.position[1], island.position[2] + dz * (island.radius - inset)];
}

/** How far the path runs beside the golden links, toward the camera, so it never sits on them. */
const SIDE = 7;

export interface WaystoneSite {
  id: MilestoneId;
  /** Base of the waystone (world). */
  position: Vec3;
  /** Height of the waystone to the top of its crown light. */
  height: number;
}

/** The floating platform midway between pa-2 and pa-3 (the third milestone). */
export const PLATFORM = (() => {
  const a = rimPoint(PATH_ISLANDS[1], PATH_ISLANDS[2].position, 2);
  const b = rimPoint(PATH_ISLANDS[2], PATH_ISLANDS[1].position, 2);
  const mid: Vec3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 2, (a[2] + b[2]) / 2];
  return { position: along(mid, TOWARD_HUB, SIDE + 3), radius: 8, thickness: 2 };
})();

const onIsland = (i: number): Vec3 => along(PATH_ISLANDS[i].position, TOWARD_HUB, 6);

/** The five waystones, in climb order (DEC-030). */
export const WAYSTONES: readonly WaystoneSite[] = [
  { id: 'foundations', position: onIsland(0), height: 7 },
  { id: 'university', position: onIsland(1), height: 11 },
  { id: 'leadership', position: PLATFORM.position, height: 12 },
  { id: 'professional', position: onIsland(2), height: 15 },
  { id: 'building', position: onIsland(3), height: 26 },
];

export const waystone = (id: MilestoneId): WaystoneSite => {
  const w = WAYSTONES.find((x) => x.id === id);
  if (!w) throw new Error(`Unknown milestone ${id}`);
  return w;
};

/** World-space middle of a waystone (focus and picking checks). */
export function waystoneCentre(id: MilestoneId): Vec3 {
  const w = waystone(id);
  return [w.position[0], w.position[1] + w.height * 0.5, w.position[2]];
}

/**
 * The path's control points, in order from the foot of pa-1 to the summit waystone: on each
 * island it runs from where it arrives, past the waystone, to where it leaves; between islands
 * it is a stair span (marked `stairs`), through the platform between pa-2 and pa-3.
 */
export interface PathPoint {
  at: Vec3;
  /** The segment ending here is a floating stair span (not ground). */
  stairs: boolean;
}

export const PATH: readonly PathPoint[] = (() => {
  const pts: PathPoint[] = [];
  const i = PATH_ISLANDS;
  const side = (p: Vec3) => along(p, TOWARD_HUB, SIDE);
  // Foot of the path: pa-1's rim facing away from the climb.
  pts.push({ at: side(rimPoint(i[0], along(i[0].position, CLIMB_DIRECTION, -50), 6)), stairs: false });
  pts.push({ at: WAYSTONES[0].position, stairs: false });
  pts.push({ at: side(rimPoint(i[0], i[1].position, 3)), stairs: false });
  pts.push({ at: side(rimPoint(i[1], i[0].position, 3)), stairs: true });
  pts.push({ at: WAYSTONES[1].position, stairs: false });
  pts.push({ at: side(rimPoint(i[1], i[2].position, 3)), stairs: false });
  pts.push({ at: PLATFORM.position, stairs: true });
  pts.push({ at: side(rimPoint(i[2], i[1].position, 3)), stairs: true });
  pts.push({ at: WAYSTONES[3].position, stairs: false });
  pts.push({ at: side(rimPoint(i[2], i[3].position, 3)), stairs: false });
  pts.push({ at: side(rimPoint(i[3], i[2].position, 3)), stairs: true });
  pts.push({ at: WAYSTONES[4].position, stairs: false });
  return pts;
})();

/** Distance along the path to each control point. */
export const PATH_DISTANCE: readonly number[] = PATH.reduce<number[]>((acc, p, k) => {
  if (k === 0) return [0];
  const q = PATH[k - 1].at;
  acc.push(acc[k - 1] + Math.hypot(p.at[0] - q[0], p.at[1] - q[1], p.at[2] - q[2]));
  return acc;
}, []);

/** Distance along the path at which each milestone's waystone stands. */
export const MILESTONE_DISTANCE: Readonly<Record<MilestoneId, number>> = (() => {
  const index: Record<MilestoneId, number> = { foundations: 1, university: 4, leadership: 6, professional: 8, building: 11 };
  return Object.fromEntries(Object.entries(index).map(([id, k]) => [id, PATH_DISTANCE[k]])) as Record<MilestoneId, number>;
})();

export const PATH_LENGTH = PATH_DISTANCE[PATH_DISTANCE.length - 1];

/** Lantern spacing along the path (m). */
export const LANTERN_SPACING = 7;

/** Snow-capped pinnacles behind the path on each island (away from the hub). */
export const PINNACLES: ReadonlyArray<{ at: Vec3; height: number; radius: number }> = PATH_ISLANDS.flatMap((island, k) => {
  const back = along(island.position, TOWARD_HUB, -island.radius * 0.45);
  const h = 13 + k * 3;
  return [
    { at: along(back, CLIMB_DIRECTION, -island.radius * 0.25), height: h, radius: 5.5 },
    { at: along(back, CLIMB_DIRECTION, island.radius * 0.3), height: h * 0.72, radius: 4.2 },
  ];
});

/** Nothing on the Path stands taller than this above its own island top. */
export const PATH_MAX_HEIGHT = 30;

