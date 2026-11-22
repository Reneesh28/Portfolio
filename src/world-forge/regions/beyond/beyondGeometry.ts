/**
 * The Worlds Beyond geometry (M7: the Convergence and the built territories). Pure (no React),
 * so the render budget and placement are unit-tested. World coordinates.
 *
 * Everything static is baked into two meshes:
 * - stone: the plaza, the gates, the monolith, and every built territory's forms;
 * - lines: every line of light, with a `color` attribute. Each gate owns a range (lit in its
 *   territory's colour: brighter when that territory is open, brightest when chosen); each
 *   monolith strip owns one; each built territory owns its lights' range, plus an ordered
 *   sequence of ranges the scene animates (the F1 streak, the broadcast rings).
 */
import { BoxGeometry, BufferAttribute, CylinderGeometry, DodecahedronGeometry, Matrix4, OctahedronGeometry, TorusGeometry, type BufferGeometry } from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mergeParts, placement, type Part } from '../../core/mergeStatic';
import { TERRITORIES, type TerritoryId } from '../../content/interests';
import { CONVERGENCE, GATE, GATES, MONOLITH, PLAZA, territoryFrame } from './beyondLayout';
import { TERRITORY_FORMS, type Shared } from './territoryForms';

/** At most 8 extra draw calls (net of the removed P2 placeholders) and 25k triangles. */
export const BEYOND_BUDGET = { drawCalls: 8, triangles: 25000 } as const;

/** Glow levels: a closed territory's gate, an open one's, a chosen one's; the monolith; a territory's lights. */
export const BEYOND_LEVEL = { closed: 0.45, open: 1.3, chosen: 2.4, monolith: 1.1, territory: 1.5 } as const;

export interface Range {
  start: number;
  count: number;
}

export type BuiltTerritory = TerritoryId;

export interface BeyondGeometry {
  stone: BufferGeometry;
  lines: BufferGeometry;
  gateRanges: Record<TerritoryId, Range>;
  /** The monolith's strip per territory (same colour as its gate). */
  stripRanges: Record<TerritoryId, Range>;
  /** Each built territory's lights. */
  territoryLights: Partial<Record<BuiltTerritory, Range>>;
  /** Each built territory's animated sequence (in order), if any. */
  sequences: Partial<Record<BuiltTerritory, Range[]>>;
}

export function buildBeyond(): BeyondGeometry {
  const half = new TorusGeometry(1, 0.2, 6, 16, Math.PI);
  const halfLine = new TorusGeometry(1, 0.06, 3, 16, Math.PI);
  const g: Shared = {
    box: new BoxGeometry(1, 1, 1),
    disc: new CylinderGeometry(1, 1, 1, 36),
    heptagon: new CylinderGeometry(0.85, 1, 1, 7),
    hex: new CylinderGeometry(1, 1.12, 1, 6),
    ring: new TorusGeometry(1, 0.012, 3, 48),
    gem: new OctahedronGeometry(1, 0),
    rock: new DodecahedronGeometry(1, 0),
  };
  const temporary: BufferGeometry[] = [...Object.values(g), half, halfLine];
  const stone: Part[] = [];
  const lineGeometries: BufferGeometry[] = [];
  let start = 0;
  const pushLines = (parts: Part[]): Range => {
    const merged = mergeParts(parts);
    const count = merged.getAttribute('position').count;
    lineGeometries.push(merged);
    const range = { start, count };
    start += count;
    return range;
  };

  // The Convergence plaza and its compass monolith.
  const [cx, cy, cz] = CONVERGENCE.position;
  stone.push([g.disc, placement([cx, cy + PLAZA.top / 4, cz], [0, 0, 0], [PLAZA.step, PLAZA.top / 2, PLAZA.step])]);
  stone.push([g.disc, placement([cx, cy + PLAZA.top / 2, cz], [0, 0, 0], [PLAZA.radius, PLAZA.top, PLAZA.radius])]);
  stone.push([g.hex, placement([cx, cy + PLAZA.top + MONOLITH.height / 2, cz], [0, 0, 0], [MONOLITH.radius, MONOLITH.height, MONOLITH.radius])]);

  // Gates, each facing its territory (posts across the bearing, the opening facing out toward it).
  const gateRanges = {} as Record<TerritoryId, Range>;
  for (const gate of GATES) {
    const frame = placement(gate.position, [0, gate.yaw, 0]);
    const local = ([geo, m]: Part): Part => [geo, new Matrix4().multiplyMatrices(frame, m)];
    stone.push(local([g.box, placement([-GATE.half, GATE.height / 2, 0], [0, 0, 0], [GATE.post, GATE.height, GATE.post])]));
    stone.push(local([g.box, placement([GATE.half, GATE.height / 2, 0], [0, 0, 0], [GATE.post, GATE.height, GATE.post])]));
    stone.push(local([half, placement([0, GATE.height, 0], [0, 0, 0], [GATE.half, GATE.half, GATE.half])]));
    gateRanges[gate.territory] = pushLines([
      local([halfLine, placement([0, GATE.height, 0.65], [0, 0, 0], [GATE.half - 0.5, GATE.half - 0.5, 4])]),
      local([g.box, placement([0, 0.05, 0], [0, 0, 0], [GATE.half * 2, 0.04, 0.12])]),
      // A keystone light above the arch: the gate's colour reads from across the archipelago.
      local([g.gem, placement([0, GATE.height + GATE.half + 0.9, 0], [0, 0.4, 0], [0.55, 0.85, 0.55])]),
    ]);
  }
  const stripRanges = {} as Record<TerritoryId, Range>;
  for (const gate of GATES) {
    const r = MONOLITH.radius * 1.02;
    stripRanges[gate.territory] = pushLines([[g.box, placement([cx + Math.sin(gate.yaw) * r, cy + PLAZA.top + MONOLITH.height * 0.5, cz + Math.cos(gate.yaw) * r], [0, gate.yaw, 0], [0.18, MONOLITH.height * 0.86, 0.05])]]);
  }

  // Every built territory, in its own frame facing the Convergence.
  const territoryLights: BeyondGeometry['territoryLights'] = {};
  const sequences: BeyondGeometry['sequences'] = {};
  for (const t of TERRITORIES) {
    if (!t.built) continue;
    const id = t.id;
    const { origin, yaw } = territoryFrame(id);
    const frame = placement(origin, [0, yaw, 0]);
    const toWorld = ([geo, m]: Part): Part => [geo, new Matrix4().multiplyMatrices(frame, m)];
    const form = TERRITORY_FORMS[id](g);
    stone.push(...form.stone.map(toWorld));
    territoryLights[id] = pushLines(form.lights.map(toWorld));
    if (form.sequence) sequences[id] = form.sequence.map((group) => pushLines(group.map(toWorld)));
  }

  const lines = mergeGeometries(lineGeometries, false);
  lineGeometries.forEach((x) => x.dispose());
  if (!lines) throw new Error('Beyond merge failed');
  lines.setAttribute('color', new BufferAttribute(new Float32Array(start * 3), 3));
  const result: BeyondGeometry = { stone: mergeParts(stone), lines, gateRanges, stripRanges, territoryLights, sequences };
  temporary.forEach((x) => x.dispose());
  return result;
}

/** Triangles drawn by a geometry. */
export const triangleCount = (geometry: BufferGeometry): number => (geometry.index ? geometry.index.count : geometry.getAttribute('position').count) / 3;
