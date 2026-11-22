/**
 * The Worlds Beyond geometry (M7: the Convergence and The Guild). Pure (no React), so the
 * render budget and placement are unit-tested. World coordinates.
 *
 * Everything static is baked into two meshes:
 * - stone: the plaza, the gates, the monolith, and The Guild's courtyard, hall, Chronicle
 *   wall, Assembly seats and Stage;
 * - lines: every line of light, with a `color` attribute. Each gate owns a range (lit in its
 *   territory's colour: brighter when that territory is open, brightest when chosen); the
 *   monolith's six strips and The Guild's warm lights own the rest.
 */
import { BoxGeometry, BufferAttribute, CylinderGeometry, Matrix4, OctahedronGeometry, TorusGeometry, type BufferGeometry } from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mergeParts, placement, type Part } from '../../core/mergeStatic';
import type { TerritoryId } from '../../content/interests';
import { CONVERGENCE, GATE, GATES, GUILD, MONOLITH, PLAZA, territoryFrame } from './beyondLayout';

/** At most 8 extra draw calls (net of the removed P2 placeholders) and 15k triangles. */
export const BEYOND_BUDGET = { drawCalls: 8, triangles: 15000 } as const;

/** Glow levels: a closed territory's gate, an open one's, a chosen one's; the monolith; The Guild's warm lights. */
export const BEYOND_LEVEL = { closed: 0.45, open: 1.3, chosen: 2.4, monolith: 1.1, guild: 1.6 } as const;

export interface Range {
  start: number;
  count: number;
}

export interface BeyondGeometry {
  stone: BufferGeometry;
  lines: BufferGeometry;
  gateRanges: Record<TerritoryId, Range>;
  /** The monolith's strip per territory (same colour as its gate). */
  stripRanges: Record<TerritoryId, Range>;
  guildLights: Range;
}

export function buildBeyond(): BeyondGeometry {
  const box = new BoxGeometry(1, 1, 1);
  const disc = new CylinderGeometry(1, 1, 1, 36);
  const hex = new CylinderGeometry(1, 1.12, 1, 6);
  const half = new TorusGeometry(1, 0.2, 6, 16, Math.PI);
  const halfLine = new TorusGeometry(1, 0.06, 3, 16, Math.PI);
  const ring = new TorusGeometry(1, 0.012, 3, 48);
  const gem = new OctahedronGeometry(1, 0);
  const temporary = [box, disc, hex, half, halfLine, ring, gem];
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

  // The Convergence plaza.
  const [cx, cy, cz] = CONVERGENCE.position;
  stone.push([disc, placement([cx, cy + PLAZA.top / 4, cz], [0, 0, 0], [PLAZA.step, PLAZA.top / 2, PLAZA.step])]);
  stone.push([disc, placement([cx, cy + PLAZA.top / 2, cz], [0, 0, 0], [PLAZA.radius, PLAZA.top, PLAZA.radius])]);
  // The compass monolith.
  stone.push([hex, placement([cx, cy + PLAZA.top + MONOLITH.height / 2, cz], [0, 0, 0], [MONOLITH.radius, MONOLITH.height, MONOLITH.radius])]);

  // Gates, each facing its territory; a lit arch line per gate, and a strip on the monolith pointing at it.
  const gateRanges = {} as Record<TerritoryId, Range>;
  for (const g of GATES) {
    // Posts across the bearing, the opening facing out toward the territory.
    const frame = placement(g.position, [0, g.yaw, 0]);
    const local = ([geo, m]: Part): Part => [geo, new Matrix4().multiplyMatrices(frame, m)];
    stone.push(local([box, placement([-GATE.half, GATE.height / 2, 0], [0, 0, 0], [GATE.post, GATE.height, GATE.post])]));
    stone.push(local([box, placement([GATE.half, GATE.height / 2, 0], [0, 0, 0], [GATE.post, GATE.height, GATE.post])]));
    stone.push(local([half, placement([0, GATE.height, 0], [0, 0, 0], [GATE.half, GATE.half, GATE.half])]));
    gateRanges[g.territory] = pushLines([
      local([halfLine, placement([0, GATE.height, 0.65], [0, 0, 0], [GATE.half - 0.5, GATE.half - 0.5, 4])]),
      local([box, placement([0, 0.05, 0], [0, 0, 0], [GATE.half * 2, 0.04, 0.12])]),
      // A keystone light above the arch: the gate's colour reads from across the archipelago.
      local([gem, placement([0, GATE.height + GATE.half + 0.9, 0], [0, 0.4, 0], [0.55, 0.85, 0.55])]),
    ]);
  }
  const stripRanges = {} as Record<TerritoryId, Range>;
  for (const g of GATES) {
    const r = MONOLITH.radius * 1.02;
    stripRanges[g.territory] = pushLines([[box, placement([cx + Math.sin(g.yaw) * r, cy + PLAZA.top + MONOLITH.height * 0.5, cz + Math.cos(g.yaw) * r], [0, g.yaw, 0], [0.18, MONOLITH.height * 0.86, 0.05])]]);
  }

  // The Guild: a courtyard facing the Convergence.
  const gf = territoryFrame('guild');
  const guildFrame = placement(gf.origin, [0, gf.yaw, 0]);
  const g = ([geo, m]: Part): Part => [geo, new Matrix4().multiplyMatrices(guildFrame, m)];
  const guildLines: Part[] = [];
  // Courtyard floor and its border inlay.
  stone.push(g([box, placement([0, 0.2, 0], [0, 0, 0], [GUILD.court, 0.4, GUILD.court])]));
  guildLines.push(g([box, placement([0, 0.42, GUILD.court / 2 - 0.4], [0, 0, 0], [GUILD.court - 1, 0.03, 0.1])]));
  // Hall: body, gabled roof, a warm doorway facing the courtyard.
  const [hx, , hz] = GUILD.hall.at;
  const [hw, hh, hd] = GUILD.hall.size;
  stone.push(g([box, placement([hx, hh / 2, hz], [0, 0, 0], [hw, hh, hd])]));
  stone.push(g([box, placement([hx, hh, hz], [Math.PI / 4, 0, 0], [hw + 0.6, hd * 0.62, hd * 0.62])]));
  guildLines.push(g([box, placement([hx, 1.6, hz + hd / 2 + 0.02], [0, 0, 0], [2, 3.2, 0.05])]));
  for (const x of [-4.5, 4.5]) guildLines.push(g([box, placement([hx + x, 3.6, hz + hd / 2 + 0.02], [0, 0, 0], [1.2, 1.4, 0.05])]));
  // Chronicle: a long wall with three carved bands of light (the journey).
  const [wx, , wz] = GUILD.chronicle.at;
  const [ww, wh, wd] = GUILD.chronicle.size;
  stone.push(g([box, placement([wx, wh / 2, wz], [0, 0, 0], [ww, wh, wd])]));
  for (const y of [1.1, 2.1, 3.1]) guildLines.push(g([box, placement([wx + ww / 2 + 0.02, y, wz], [0, 0, 0], [0.05, 0.12, wd - 1.2])]));
  // Assembly: a ring of seats around a low round stone.
  const [ax, , az] = GUILD.assembly.at;
  stone.push(g([disc, placement([ax, 0.75, az], [0, 0, 0], [1.3, 0.7, 1.3])]));
  for (let k = 0; k < GUILD.assembly.seats; k++) {
    const a = (k / GUILD.assembly.seats) * Math.PI * 2;
    stone.push(g([box, placement([ax + Math.sin(a) * GUILD.assembly.radius, 0.8, az + Math.cos(a) * GUILD.assembly.radius], [0, a, 0], [1.4, 0.8, 0.9])]));
  }
  guildLines.push(g([ring, placement([ax, 0.43, az], [Math.PI / 2, 0, 0], [GUILD.assembly.radius + 1.2, GUILD.assembly.radius + 1.2, 6])]));
  // Stage: a raised platform with a frame behind it.
  const [sx, , sz] = GUILD.stage.at;
  const [sw, sh, sd] = GUILD.stage.size;
  stone.push(g([box, placement([sx, 0.4 + sh / 2, sz], [0, 0, 0], [sw, sh, sd])]));
  for (const z of [-sd / 2 + 0.4]) {
    stone.push(g([box, placement([sx - sw / 2 + 0.4, 0.4 + sh + 2.6, sz + z], [0, 0, 0], [0.6, 5.2, 0.6])]));
    stone.push(g([box, placement([sx + sw / 2 - 0.4, 0.4 + sh + 2.6, sz + z], [0, 0, 0], [0.6, 5.2, 0.6])]));
    stone.push(g([box, placement([sx, 0.4 + sh + 5.4, sz + z], [0, 0, 0], [sw, 0.6, 0.6])]));
    guildLines.push(g([box, placement([sx, 0.4 + sh + 5.0, sz + z + 0.32], [0, 0, 0], [sw - 1.4, 0.1, 0.05])]));
  }
  guildLines.push(g([box, placement([sx, 0.4 + sh + 0.02, sz + sd / 2 - 0.3], [0, 0, 0], [sw - 0.6, 0.03, 0.1])]));
  // Four warm lanterns at the courtyard's corners.
  for (const [x, z] of [
    [-8, 8],
    [8, 8],
    [-8, -3],
    [8, -3],
  ]) {
    stone.push(g([box, placement([x, 1.2, z], [0, 0, 0], [0.25, 2.4, 0.25])]));
    guildLines.push(g([gem, placement([x, 2.7, z], [0, 0.4, 0], [0.32, 0.45, 0.32])]));
  }
  const guildLights = pushLines(guildLines);

  const lines = mergeGeometries(lineGeometries, false);
  lineGeometries.forEach((x) => x.dispose());
  if (!lines) throw new Error('Beyond merge failed');
  lines.setAttribute('color', new BufferAttribute(new Float32Array(start * 3), 3));
  const result: BeyondGeometry = { stone: mergeParts(stone), lines, gateRanges, stripRanges, guildLights };
  temporary.forEach((x) => x.dispose());
  return result;
}

/** Triangles drawn by a geometry. */
export const triangleCount = (geometry: BufferGeometry): number => (geometry.index ? geometry.index.count : geometry.getAttribute('position').count) / 3;

