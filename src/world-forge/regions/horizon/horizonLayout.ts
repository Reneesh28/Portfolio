/**
 * 06 — THE HORIZON layout (M8 "The Unfinished Gate", DEC-034). Pure data and maths.
 *
 * Local frame: the origin is the centre of the Horizon island's top surface, +Y up, local +Z
 * toward the hub (east, the world behind), local −Z toward the bright western horizon. Local +X
 * points north. On the west edge stands a great gate that isn't finished: two posts and the
 * start of each side of its arch; the missing stones and the keystone hang in place, waiting to
 * be set. A path of stones leads to its threshold; fallen blocks lie beside it.
 */
import { createRandom } from '../../core/random';
import { ISLANDS, type Island, type Vec3 } from '../../data/worldGeography';
import { createIslandGeometry } from '../../look/islandGeometry';

const island: Island = (() => {
  const found = ISLANDS.find((i) => i.id === 'horizon');
  if (!found) throw new Error('Horizon island missing');
  return found;
})();

export const HORIZON_ANCHOR: Vec3 = island.position;
/** Rotation about +Y that turns local +Z toward the hub. */
export const HORIZON_YAW = Math.atan2(-HORIZON_ANCHOR[0], -HORIZON_ANCHOR[2]);

/** The gate: posts `half` either side of the centre, the arch springing at `spring`. */
export const GATE = { half: 7, post: 1.8, spring: 17, radius: 7, tube: 1, built: (52 * Math.PI) / 180 } as const;

/** The gate turns this far (radians) from facing due west, so the settled view sees its arch in three-quarter view. */
export const GATE_YAW = 0.95;

/** Nothing on the Horizon stands taller than this (a quiet ending). */
export const HORIZON_MAX_HEIGHT = 30;

export function toWorld([x, y, z]: Vec3): Vec3 {
  const c = Math.cos(HORIZON_YAW);
  const s = Math.sin(HORIZON_YAW);
  return [HORIZON_ANCHOR[0] + x * c + z * s, HORIZON_ANCHOR[1] + y, HORIZON_ANCHOR[2] - x * s + z * c];
}

let rim: Array<[number, number]> | null = null;

/** Radius of the island's top rim along a local bearing (degrees from local +Z), as in the other regions. */
export function rimRadius(localBearing: number): number {
  if (!rim) {
    const { top, rock } = createIslandGeometry(island, createRandom(island.seed));
    const p = top.getAttribute('position');
    rim = [];
    for (let i = 0; i < p.count; i++) {
      if (p.getY(i) < -2) continue;
      const r = Math.hypot(p.getX(i), p.getZ(i));
      if (r > island.radius * 0.5) rim.push([Math.atan2(p.getX(i), p.getZ(i)), r]);
    }
    top.dispose();
    rock.dispose();
  }
  const a = (localBearing * Math.PI) / 180 + HORIZON_YAW;
  const window = (8 * Math.PI) / 180;
  let best = Infinity;
  for (const [angle, r] of rim) {
    const d = Math.abs(Math.atan2(Math.sin(angle - a), Math.cos(angle - a)));
    if (d <= window) best = Math.min(best, r);
  }
  return Number.isFinite(best) ? best : island.radius * 0.8;
}

/** The gate's centre on the west edge (local), a few metres inside the rim. */
export const GATE_AT: Vec3 = [0, 0, -(rimRadius(180) - 9)];

/** World-space middle of the gate (camera framing and checks). */
export const gateCentre = (): Vec3 => toWorld([GATE_AT[0], GATE.spring * 0.7, GATE_AT[2]]);
