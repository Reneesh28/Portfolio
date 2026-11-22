/**
 * 05 — THE WORLDS BEYOND layout (M7, DEC-032). Pure data and maths, world coordinates.
 *
 * The Convergence: a round plaza on the central island, ringed by six stone gates. Each gate
 * stands on the plaza's edge facing its territory's island, and a compass monolith stands at
 * the centre. The territories float around it on their P2 islands; each is built in its own
 * stage (DEC-032: the Convergence, then The Guild, then the owner's review, then the rest).
 *
 * The Guild (AniCos): a courtyard facing the Convergence, with the master doc's four
 * sub-landmarks: the Hall (overview), the Chronicle (a carved wall: the journey), the Assembly
 * (a ring of seats: leadership) and the Stage (events).
 */
import { ISLANDS, type Island, type Vec3 } from '../../data/worldGeography';
import { TERRITORIES, type TerritoryId } from '../../content/interests';

const islandById = (id: string): Island => {
  const found = ISLANDS.find((i) => i.id === id);
  if (!found) throw new Error(`Island ${id} missing`);
  return found;
};

export const CONVERGENCE: Island = islandById('wb-convergence');
export const PLAZA = { radius: 19, step: 23, top: 0.6, gateRadius: 21 } as const;
export const MONOLITH = { radius: 2.2, height: 16 } as const;
export const GATE = { half: 2.6, height: 7, post: 1.1 } as const;

/** Nothing in the Worlds Beyond stands taller than this above its island top (compact, master doc). */
export const BEYOND_MAX_HEIGHT = 25;

export interface GateSite {
  territory: TerritoryId;
  /** Gate centre on the plaza edge (world), and its yaw (faces outward, toward the territory). */
  position: Vec3;
  yaw: number;
  island: Island;
}

/** One gate per territory, on the plaza's edge, facing that territory's island. */
export const GATES: readonly GateSite[] = TERRITORIES.map((t) => {
  const island = islandById(t.island);
  const [cx, cy, cz] = CONVERGENCE.position;
  const yaw = Math.atan2(island.position[0] - cx, island.position[2] - cz);
  return {
    territory: t.id,
    position: [cx + Math.sin(yaw) * PLAZA.gateRadius, cy + PLAZA.top, cz + Math.cos(yaw) * PLAZA.gateRadius],
    yaw,
    island,
  };
});

export const gateOf = (id: TerritoryId): GateSite => {
  const g = GATES.find((x) => x.territory === id);
  if (!g) throw new Error(`Unknown territory ${id}`);
  return g;
};

/** A territory's local frame: origin on its island top, +Z facing the Convergence. */
export function territoryFrame(id: TerritoryId): { origin: Vec3; yaw: number } {
  const island = gateOf(id).island;
  const [cx, , cz] = CONVERGENCE.position;
  return { origin: island.position, yaw: Math.atan2(cx - island.position[0], cz - island.position[2]) };
}

/** Local → world, in a territory's frame. */
export function territoryToWorld(id: TerritoryId, [x, y, z]: Vec3): Vec3 {
  const { origin, yaw } = territoryFrame(id);
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return [origin[0] + x * c + z * s, origin[1] + y, origin[2] - x * s + z * c];
}

/** The Guild's courtyard (local, in its territory frame). */
export const GUILD = {
  court: 18,
  hall: { at: [0, 0, -8] as Vec3, size: [14, 7, 7] as Vec3 },
  chronicle: { at: [-8.5, 0, 0.5] as Vec3, size: [1, 4.2, 12] as Vec3 },
  assembly: { at: [0, 0, 1.5] as Vec3, radius: 3.6, seats: 8 },
  stage: { at: [7, 0, 1] as Vec3, size: [5.5, 1, 6] as Vec3 },
} as const;

/** Each territory's landmark in its own frame: centre, height and radius (camera focus and picking). */
export const TERRITORY_LANDMARK: Readonly<Record<TerritoryId, { centre: Vec3; height: number; radius: number }>> = {
  anime: { centre: [0, 9, -2], height: 14, radius: 13 },
  stories: { centre: [-1, 6, -4], height: 15, radius: 12 },
  f1: { centre: [3, 5, -3], height: 12, radius: 19 },
  creator: { centre: [0, 10, -2], height: 20, radius: 9 },
  guild: { centre: [0, 3.5, -2], height: 10, radius: 12 },
  training: { centre: [-2, 3.5, -2], height: 8, radius: 10 },
};

/** Where each built territory's landmark is (world), for the camera focus and picking. */
export const LANDMARKS: Readonly<Partial<Record<TerritoryId, { centre: Vec3; height: number; radius: number }>>> = Object.fromEntries(
  TERRITORIES.filter((t) => t.built).map((t) => {
    const l = TERRITORY_LANDMARK[t.id];
    return [t.id, { ...l, centre: territoryToWorld(t.id, l.centre) }];
  }),
);
