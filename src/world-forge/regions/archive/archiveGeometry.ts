/**
 * The Blueprint Archive's geometry (M6.2 "The Drafting Hall"). Pure (no React), so the render
 * budget and placement are unit-tested. Everything is in the Archive's local frame.
 *
 * - stone: the drafting floor, the halls on the rim, and each structure's plinth (always solid);
 * - lines: every blueprint line (thin glowing geometry, readable at any size), with a `color`
 *   attribute. Each structure owns a contiguous vertex range (its drawing: rest / hover / built);
 *   the floor's etching and the halls' inlays own another;
 * - crystals: a crystal atop each structure (own range, flares when built) and the outcrops;
 * - solids: each structure's solid form, one geometry per structure, revealed from the base up
 *   when its category is chosen; `ghost` is all four merged, drawn as a faint fill at rest.
 */
import {
  BoxGeometry,
  BufferAttribute,
  CylinderGeometry,
  Matrix4,
  OctahedronGeometry,
  Quaternion,
  TetrahedronGeometry,
  TorusGeometry,
  Vector3,
  type BufferGeometry,
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mergeParts, placement, type Part, type Vec3 } from '../../core/mergeStatic';
import { createRandom } from '../../core/random';
import type { SkillCategoryId } from '../../content/skills';
import { FLOOR, HALLS, OUTCROPS, rimRadius, STRUCTURES } from './archiveLayout';

/** At most 8 extra draw calls (net of the removed P2 placeholder) and 25k triangles (proposal §2.8). */
export const ARCHIVE_BUDGET = { drawCalls: 8, triangles: 25000 } as const;

/** Line and crystal glow levels (multiples of the Archive's blue): drawing at rest, hovered, built; the floor. */
export const ARCHIVE_LEVEL = { rest: 0.75, hover: 1.5, built: 2.3, floor: 0.6, outcrop: 1.1 } as const;

export interface Range {
  start: number;
  count: number;
}

export interface ArchiveGeometry {
  stone: BufferGeometry;
  /** Carries a `color` attribute (black until the scene tints it). */
  lines: BufferGeometry;
  /** Carries a `color` attribute. */
  crystals: BufferGeometry;
  ghost: BufferGeometry;
  solids: Record<SkillCategoryId, BufferGeometry>;
  lineRanges: Record<SkillCategoryId, Range>;
  crystalRanges: Record<SkillCategoryId, Range>;
  floorLines: Range;
  outcrops: Range;
}

interface Shared {
  box: BufferGeometry;
  hex: BufferGeometry;
  silo: BufferGeometry;
  ring: BufferGeometry;
  line: BufferGeometry;
  halfRing: BufferGeometry;
  halfLine: BufferGeometry;
  gem: BufferGeometry;
  facet: BufferGeometry;
}

const UP = new Vector3(0, 1, 0);
const LINE = 0.09;

/** A thin glowing bar from `a` to `b`. */
function segment(g: Shared, a: Vec3, b: Vec3, t = LINE): Part {
  const from = new Vector3(...a);
  const dir = new Vector3(...b).sub(from);
  const length = dir.length();
  const q = new Quaternion().setFromUnitVectors(UP, dir.clone().normalize());
  const m = new Matrix4().compose(from.addScaledVector(dir, 0.5), q, new Vector3(t, length, t));
  return [g.box, m];
}

/** The twelve edges of a box (centre, size, yaw about Y). */
function boxLines(g: Shared, [cx, cy, cz]: Vec3, [w, h, d]: Vec3, yaw = 0): Part[] {
  const frame = placement([cx, cy, cz], [0, yaw, 0]);
  const corner = (sx: number, sy: number, sz: number): Vec3 => {
    const v = new Vector3((sx * w) / 2, (sy * h) / 2, (sz * d) / 2).applyMatrix4(frame);
    return [v.x, v.y, v.z];
  };
  const parts: Part[] = [];
  for (const sy of [-1, 1]) {
    parts.push(segment(g, corner(-1, sy, -1), corner(1, sy, -1)), segment(g, corner(1, sy, -1), corner(1, sy, 1)));
    parts.push(segment(g, corner(1, sy, 1), corner(-1, sy, 1)), segment(g, corner(-1, sy, 1), corner(-1, sy, -1)));
  }
  for (const [sx, sz] of [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ])
    parts.push(segment(g, corner(sx, -1, sz), corner(sx, 1, sz)));
  return parts;
}

/** A flat ring of light (radius `r`) at height `y`. */
const flatRing = (g: Shared, r: number, y: number, at: Vec3 = [0, 0, 0]): Part => [g.line, placement([at[0], y, at[2]], [Math.PI / 2, 0, 0], [r, r, 3])];

interface StructureParts {
  solid: Part[];
  lines: Part[];
  /** Crystal centre above the base, and its scale. */
  crystal: { y: number; scale: Vec3 };
}

/** AI & Intelligence: a spire of stacked, offset rings joined by struts (layers of a network). */
function aiSpire(g: Shared): StructureParts {
  const solid: Part[] = [[g.hex, placement([0, 15.5, 0], [0, 0, 0], [0.7, 31, 0.7])]];
  const lines: Part[] = [segment(g, [0, 0.8, 0], [0, 31, 0])];
  const rings = Array.from({ length: 6 }, (_, i) => ({ y: 5 + i * 4.8, r: 5 - i * 0.55, x: i % 2 ? 0.6 : -0.6 }));
  rings.forEach((ring) => {
    solid.push([g.ring, placement([ring.x, ring.y, 0], [Math.PI / 2, 0, 0], [ring.r, ring.r, 4])]);
    lines.push([g.line, placement([ring.x, ring.y, 0], [Math.PI / 2, 0, 0], [ring.r + 0.25, ring.r + 0.25, 4])]);
  });
  for (let i = 0; i < rings.length - 1; i++) {
    for (const a of [0.3, 2.4, 4.5]) {
      const lo = rings[i];
      const hi = rings[i + 1];
      const p: Vec3 = [lo.x + Math.sin(a) * lo.r, lo.y, Math.cos(a) * lo.r];
      const q: Vec3 = [hi.x + Math.sin(a + 0.5) * hi.r, hi.y, Math.cos(a + 0.5) * hi.r];
      solid.push(segment(g, p, q, 0.28));
      lines.push(segment(g, p, q));
    }
  }
  return { solid, lines, crystal: { y: 33.2, scale: [1.2, 2.6, 1.2] } };
}

/** Software Engineering: a stepped tower of interlocking blocks (modules composed into a system). */
function softwareTower(g: Shared): StructureParts {
  const blocks: Array<{ at: Vec3; size: Vec3; yaw: number }> = [
    { at: [0, 3, 0], size: [10, 5, 10], yaw: 0 },
    { at: [-1.3, 8, 0.4], size: [6.5, 5, 8.5], yaw: 0 },
    { at: [1.6, 8, -0.6], size: [7.5, 5, 5.5], yaw: 0 },
    { at: [0, 13, 0], size: [6, 5, 6], yaw: Math.PI / 4 },
    { at: [0.6, 18, -0.3], size: [4.6, 5, 5.6], yaw: 0.2 },
    { at: [0, 22.6, 0], size: [3.4, 4.2, 3.4], yaw: Math.PI / 4 },
  ];
  const solid: Part[] = blocks.map((b): Part => [g.box, placement(b.at, [0, b.yaw, 0], b.size)]);
  const lines: Part[] = blocks.flatMap((b) => boxLines(g, b.at, [b.size[0] + 0.15, b.size[1] + 0.15, b.size[2] + 0.15], b.yaw));
  return { solid, lines, crystal: { y: 27, scale: [1.1, 2.3, 1.1] } };
}

/** Data & Infrastructure: a cluster of silos linked by bridges and pipes (stores and their flows). */
function dataSilos(g: Shared): StructureParts {
  const silos: Array<{ x: number; z: number; r: number; h: number }> = [
    { x: -3.6, z: 1.2, r: 2.2, h: 15 },
    { x: 0.6, z: -1.4, r: 2.6, h: 20 },
    { x: 4.2, z: 1.6, r: 1.8, h: 12 },
  ];
  const solid: Part[] = [[g.box, placement([0.3, 0.5, 0], [0, 0, 0], [12, 1, 8])]];
  const lines: Part[] = [];
  for (const s of silos) {
    solid.push([g.silo, placement([s.x, 1 + s.h / 2, s.z], [0, 0, 0], [s.r, s.h, s.r])]);
    lines.push(flatRing(g, s.r + 0.15, 1.05, [s.x, 0, s.z]), flatRing(g, s.r + 0.15, 1 + s.h, [s.x, 0, s.z]));
    for (const a of [0.4, 2, 3.6, 5.2]) lines.push(segment(g, [s.x + Math.sin(a) * (s.r + 0.12), 1, s.z + Math.cos(a) * (s.r + 0.12)], [s.x + Math.sin(a) * (s.r + 0.12), 1 + s.h, s.z + Math.cos(a) * (s.r + 0.12)]));
  }
  // Bridges between neighbouring silos, and a pipe looping between the outer two.
  for (const [a, b, y] of [
    [0, 1, 10],
    [1, 2, 8],
    [0, 1, 13.5],
  ] as const) {
    const p: Vec3 = [silos[a].x, y, silos[a].z];
    const q: Vec3 = [silos[b].x, y, silos[b].z];
    solid.push(segment(g, p, q, 0.9));
    lines.push(segment(g, [p[0], y + 0.55, p[2]], [q[0], y + 0.55, q[2]]), segment(g, [p[0], y - 0.55, p[2]], [q[0], y - 0.55, q[2]]));
  }
  const pipe: Vec3[] = [
    [silos[0].x, 5, silos[0].z - 2.3],
    [0, 4, -4.4],
    [silos[2].x, 6, silos[2].z - 2],
  ];
  for (let i = 0; i < pipe.length - 1; i++) {
    solid.push(segment(g, pipe[i], pipe[i + 1], 0.45));
    lines.push(segment(g, pipe[i], pipe[i + 1]));
  }
  return { solid, lines, crystal: { y: 23, scale: [1, 2.1, 1] } };
}

/** Creative & Game Development: an open arch with pieces orbiting inside it (play, assembled). */
function gamesArch(g: Shared): StructureParts {
  const solid: Part[] = [
    [g.box, placement([-5, 7.5, 0], [0, 0, 0], [1.6, 14, 1.6])],
    [g.box, placement([5, 7.5, 0], [0, 0, 0], [1.6, 14, 1.6])],
    [g.halfRing, placement([0, 14.5, 0], [0, 0, 0], [5, 5, 5])],
    [g.box, placement([-1.6, 6.2, 0], [0.5, 0.6, 0.3], [1.4, 1.4, 1.4])],
    [g.gem, placement([1.9, 9.3, 0.3], [0, 0.4, 0], [1.1, 1.4, 1.1])],
    [g.facet, placement([0.2, 4.2, -0.2], [0.3, 1, 0], [1.1, 1.1, 1.1])],
    [g.box, placement([-0.6, 11.4, 0.2], [0.8, 0.2, 0.5], [0.9, 0.9, 0.9])],
  ];
  const lines: Part[] = [
    ...boxLines(g, [-5, 7.5, 0], [1.75, 14.1, 1.75]),
    ...boxLines(g, [5, 7.5, 0], [1.75, 14.1, 1.75]),
    [g.halfLine, placement([0, 14.5, 0.85], [0, 0, 0], [5.8, 5.8, 5])],
    [g.halfLine, placement([0, 14.5, 0.85], [0, 0, 0], [4.2, 4.2, 5])],
    // The orbit the pieces follow.
    [g.line, placement([0, 7.8, 0], [0, 0, 0.35], [3.6, 3.6, 3])],
  ];
  return { solid, lines, crystal: { y: 21.3, scale: [0.9, 1.8, 0.9] } };
}

const BUILDERS: Record<SkillCategoryId, (g: Shared) => StructureParts> = { ai: aiSpire, software: softwareTower, data: dataSilos, games: gamesArch };

/** Bakes the whole Archive (local frame). */
export function buildArchive(): ArchiveGeometry {
  const rand = createRandom(83);
  const g: Shared = {
    box: new BoxGeometry(1, 1, 1),
    hex: new CylinderGeometry(1, 1.06, 1, 6),
    silo: new CylinderGeometry(1, 1, 1, 12),
    ring: new TorusGeometry(1, 0.08, 4, 28),
    line: new TorusGeometry(1, 0.02, 3, 40),
    halfRing: new TorusGeometry(1, 0.17, 6, 18, Math.PI),
    halfLine: new TorusGeometry(1, 0.018, 3, 20, Math.PI),
    gem: new OctahedronGeometry(1, 0),
    facet: new TetrahedronGeometry(1, 0),
  };
  const disc = new CylinderGeometry(1, 1, 1, 36);
  const temporary: BufferGeometry[] = [...Object.values(g), disc];

  const stone: Part[] = [];
  const floorLines: Part[] = [];

  // The drafting floor and its step.
  stone.push([disc, placement([0, FLOOR.step.top / 2, 0], [0, 0, 0], [FLOOR.step.radius, FLOOR.step.top, FLOOR.step.radius])]);
  stone.push([disc, placement([0, FLOOR.top / 2, 0], [0, 0, 0], [FLOOR.radius, FLOOR.top, FLOOR.radius])]);
  // The blueprint etched into it: rings, a grid clipped to the disc, and each structure's outline.
  const etch = FLOOR.top + 0.03;
  // Rings with a fixed line width (a scaled unit ring would thicken with its radius).
  for (const r of [8, 16, FLOOR.radius - 1.5]) {
    const ring = new TorusGeometry(r, 0.07, 3, 64);
    temporary.push(ring);
    floorLines.push([ring, placement([0, etch, 0], [Math.PI / 2, 0, 0], [1, 1, 0.5])]);
  }
  const reach = FLOOR.radius - 2;
  for (let k = -20; k <= 20; k += 5) {
    const half = Math.sqrt(reach * reach - k * k);
    floorLines.push(segment(g, [k, etch, -half], [k, etch, half], 0.06), segment(g, [-half, etch, k], [half, etch, k], 0.06));
  }

  // Halls on the rim (open across the camera's side), each with a gabled roof and a lit inlay facing in.
  for (let i = 0; i < HALLS.count; i++) {
    const bearing = HALLS.from + ((HALLS.to - HALLS.from) * i) / (HALLS.count - 1);
    const a = (bearing * Math.PI) / 180;
    const r = Math.min(HALLS.radius, rimRadius(bearing) - HALLS.size[2] / 2 - 2);
    const frame = placement([Math.sin(a) * r, 0, Math.cos(a) * r], [0, a, 0]);
    const local = ([geo, m]: Part): Part => [geo, new Matrix4().multiplyMatrices(frame, m)];
    const [w, h, d] = HALLS.size;
    stone.push(local([g.box, placement([0, h / 2, 0], [0, 0, 0], [w, h, d])]));
    stone.push(local([g.box, placement([0, h, 0], [Math.PI / 4, 0, 0], [w + 0.6, d * 0.62, d * 0.62])]));
    for (const x of [-w / 2 - 0.6, w / 2 + 0.6]) stone.push(local([g.box, placement([x, h * 0.45, -0.4], [0, 0, 0], [1.2, h * 0.9, d + 0.8])]));
    floorLines.push(local(segment(g, [-w / 2 + 0.6, 1.6, -d / 2 - 0.05], [w / 2 - 0.6, 1.6, -d / 2 - 0.05], 0.12)));
  }

  // The four structures: plinths (stone), drawings (lines), solid forms, crystals.
  const solids = {} as Record<SkillCategoryId, BufferGeometry>;
  const lineGeometries: BufferGeometry[] = [];
  const crystalGeometries: BufferGeometry[] = [];
  const lineRanges = {} as Record<SkillCategoryId, Range>;
  const crystalRanges = {} as Record<SkillCategoryId, Range>;
  let lineStart = 0;
  let crystalStart = 0;
  const pushLines = (parts: Part[]): Range => {
    const merged = mergeParts(parts);
    const count = merged.getAttribute('position').count;
    lineGeometries.push(merged);
    const range = { start: lineStart, count };
    lineStart += count;
    return range;
  };
  const pushCrystals = (parts: Part[]): Range => {
    const merged = mergeParts(parts);
    const count = merged.getAttribute('position').count;
    crystalGeometries.push(merged);
    const range = { start: crystalStart, count };
    crystalStart += count;
    return range;
  };

  for (const site of STRUCTURES) {
    const [px, py, pz] = site.position;
    const frame = placement([px, py, pz]);
    const local = ([geo, m]: Part): Part => [geo, new Matrix4().multiplyMatrices(frame, m)];
    const span = site.half * 2 + 1.4;
    stone.push(local([g.box, placement([0, 0.4, 0], [0, 0, 0], [span, 0.8, span])]));
    const parts = BUILDERS[site.id](g);
    solids[site.id] = mergeParts(parts.solid.map(local));
    lineRanges[site.id] = pushLines([...parts.lines.map(local), ...boxLines(g, [px, py + 0.4, pz], [span + 0.2, 0.85, span + 0.2])]);
    crystalRanges[site.id] = pushCrystals([local([g.gem, placement([0, parts.crystal.y, 0], [0, 0.3, 0], parts.crystal.scale)])]);
  }
  const floorRange = pushLines(floorLines);

  // Blue crystal outcrops between the halls, on the rim ("Aether Cliffs").
  const outcropParts: Part[] = [];
  for (let i = 0; i < OUTCROPS.count; i++) {
    const bearing = HALLS.from + 12 + ((HALLS.to - HALLS.from - 24) * i) / (OUTCROPS.count - 1);
    const a = (bearing * Math.PI) / 180;
    const r = Math.min(OUTCROPS.radius, rimRadius(bearing) - 3);
    for (let k = 0; k < 3; k++) {
      const h = 3 + rand() * 4;
      outcropParts.push([g.gem, placement([Math.sin(a) * r + (rand() - 0.5) * 3, h * 0.5, Math.cos(a) * r + (rand() - 0.5) * 3], [(rand() - 0.5) * 0.5, rand() * 3, (rand() - 0.5) * 0.5], [0.8 + rand() * 0.5, h, 0.8 + rand() * 0.5])]);
    }
  }
  const outcrops = pushCrystals(outcropParts);

  const lines = mergeGeometries(lineGeometries, false);
  const crystals = mergeGeometries(crystalGeometries, false);
  lineGeometries.forEach((x) => x.dispose());
  crystalGeometries.forEach((x) => x.dispose());
  if (!lines || !crystals) throw new Error('Archive merge failed');
  lines.setAttribute('color', new BufferAttribute(new Float32Array(lineStart * 3), 3));
  crystals.setAttribute('color', new BufferAttribute(new Float32Array(crystalStart * 3), 3));
  const ghost = mergeGeometries(Object.values(solids), false);
  if (!ghost) throw new Error('Archive ghost merge failed');

  const result: ArchiveGeometry = {
    stone: mergeParts(stone),
    lines,
    crystals,
    ghost,
    solids,
    lineRanges,
    crystalRanges,
    floorLines: floorRange,
    outcrops,
  };
  new Set(temporary).forEach((geo) => geo.dispose());
  return result;
}

/** Triangles drawn by a geometry. */
export const triangleCount = (geometry: BufferGeometry): number => (geometry.index ? geometry.index.count : geometry.getAttribute('position').count) / 3;
