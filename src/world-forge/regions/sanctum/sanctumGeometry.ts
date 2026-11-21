/**
 * The Origin Sanctum's geometry (M6.1 "The Quiet Court"). Pure (no React), so the render
 * budget and placement are unit-tested.
 *
 * Everything is in the Sanctum's local frame (see `sanctumLayout.ts`) and baked per material:
 * - stone: terraces, court, pool rim, pillars, lintels, platforms, stepping stones,
 *   suspended blocks, and the fragments' stone forms;
 * - moss: the terraces' grassy caps;
 * - edges: every emerald line of light, with a `color` attribute. Each fragment owns a
 *   contiguous vertex range (its rest / hover / selected glow); the court's inlays own another;
 * - pool: the still water;
 * - halo and pointer: separate, because they move (the halo drifts, the Explorer's pointer turns).
 */
import {
  BoxGeometry,
  BufferAttribute,
  CircleGeometry,
  ConeGeometry,
  CylinderGeometry,
  IcosahedronGeometry,
  Matrix4,
  OctahedronGeometry,
  TetrahedronGeometry,
  TorusGeometry,
  type BufferGeometry,
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mergeParts, placement, type Part, type Vec3 } from '../../core/mergeStatic';
import { createRandom } from '../../core/random';
import { COURT, FRAGMENTS, GROUND, HALO, PILLARS, PLATFORM, POOL, rimRadius, TERRACES, type FragmentId } from './sanctumLayout';

/** At most 8 extra draw calls (net of the removed P2 placeholder) and 20k triangles (proposal §2.9). */
export const SANCTUM_BUDGET = { drawCalls: 8, triangles: 20000 } as const;

/** Edge glow levels, as multiples of the Sanctum's emerald: at rest, hovered, selected; the court's inlays. */
export const SANCTUM_EDGE_LEVEL = { rest: 0.85, hover: 1.8, selected: 2.5, court: 1.1 } as const;

/** Where the Explorer's turning pointer pivots (local frame), and the height of its mast. */
export const MAST = { height: 10, pointerAt: 9.4 } as const;

export interface EdgeRange {
  start: number;
  count: number;
}

export interface SanctumGeometry {
  stone: BufferGeometry;
  moss: BufferGeometry;
  /** Carries a `color` attribute (black until the scene tints it). */
  edges: BufferGeometry;
  pool: BufferGeometry;
  halo: BufferGeometry;
  /** In the pointer's own frame: pivot at the origin, arm along +X. */
  pointer: BufferGeometry;
  /** Local position of the pointer's pivot. */
  pointerPivot: Vec3;
  fragmentEdges: Record<FragmentId, EdgeRange>;
  courtEdges: EdgeRange;
}

const unit = {
  box: () => new BoxGeometry(1, 1, 1),
  hex: () => new CylinderGeometry(1, 1.08, 1, 6),
  disc: (segments: number) => new CylinderGeometry(1, 1, 1, segments),
};

interface FormParts {
  stone: Part[];
  edges: Part[];
}

/** The Engineer: three nested rings around a cube core, like a gyroscope (order, systems). */
function engineer(g: Shared): FormParts {
  const centre = 5;
  const stone: Part[] = [
    [g.hex, placement([0, 0.8, 0], [0, 0, 0], [0.7, 1.6, 0.7])],
    [g.box, placement([0, centre, 0], [Math.PI / 4, 0, Math.PI / 4], [1.9, 1.9, 1.9])],
  ];
  const edges: Part[] = [];
  const orientations: Vec3[] = [
    [0, 0, 0],
    [0, Math.PI / 2, 0],
    [Math.PI / 2, 0, 0.5],
  ];
  orientations.forEach((rotation, i) => {
    const r = 3.2 - i * 0.35;
    stone.push([g.ring, placement([0, centre, 0], rotation, [r, r, r])]);
    edges.push([g.line, placement([0, centre, 0], rotation, [r * 0.93, r * 0.93, r])]);
  });
  edges.push([g.gem, placement([0, centre, 0], [0, 0.3, 0], [0.55, 0.55, 0.55])]);
  return { stone, edges };
}

/** The Creator: an open arch with a crystal shard half-assembled inside it (something taking form). */
function creator(g: Shared): FormParts {
  const stone: Part[] = [
    [g.box, placement([-2.7, 3, 0], [0, 0, 0], [1, 6, 1])],
    [g.box, placement([2.7, 3, 0], [0, 0, 0], [1, 6, 1])],
    [g.arch, placement([0, 6, 0], [0, 0, 0], [2.7, 2.7, 2.7])],
  ];
  const edges: Part[] = [
    [g.archLine, placement([0, 6, 0.55], [0, 0, 0], [2.7, 2.7, 2.7])],
    // The crystal itself is light: it glows with the fragment.
    [g.gem, placement([0, 4.3, 0], [0, 0.4, 0], [0.95, 2.1, 0.95])],
  ];
  // Facets still finding their place around the shard.
  [
    [1.7, 3.2, 0.4, 0.5],
    [-1.6, 5.4, -0.3, 0.42],
    [1.2, 6.3, -0.5, 0.36],
    [-1.4, 2.6, 0.5, 0.32],
  ].forEach(([x, y, z, s], i) => stone.push([g.facet, placement([x, y, z], [i, i * 2, 0], [s, s, s])]));
  return { stone, edges };
}

/** The Explorer: a tall lantern mast; its pointer (separate, turning) reaches outward. */
function explorer(g: Shared): FormParts {
  const top = MAST.height + 1.2;
  const stone: Part[] = [
    [g.box, placement([0, 0.6, 0], [0, 0.4, 0], [2.4, 1.2, 2.4])],
    [g.hex, placement([0, 1.2 + MAST.height / 2, 0], [0, 0, 0], [0.8, MAST.height, 0.8])],
    // The lantern: four slim posts and a pyramid cap.
    ...[
      [0.85, 0.85],
      [-0.85, 0.85],
      [0.85, -0.85],
      [-0.85, -0.85],
    ].map(([x, z]): Part => [g.box, placement([x * 1.4, top + 1.4, z * 1.4], [0, 0, 0], [0.3, 2.8, 0.3])]),
    [g.box, placement([0, top, 0], [0, 0, 0], [3, 0.35, 3])],
    [g.cap, placement([0, top + 3.4, 0], [0, Math.PI / 4, 0], [2.3, 1.6, 2.3])],
  ];
  const edges: Part[] = [[g.gem, placement([0, top + 1.4, 0], [0, 0.2, 0], [0.95, 1.2, 0.95])]];
  return { stone, edges };
}

interface Shared {
  box: BufferGeometry;
  hex: BufferGeometry;
  ring: BufferGeometry;
  line: BufferGeometry;
  gem: BufferGeometry;
  arch: BufferGeometry;
  archLine: BufferGeometry;
  facet: BufferGeometry;
  cap: BufferGeometry;
}

const FORMS: Record<FragmentId, (g: Shared) => FormParts> = { engineer, creator, explorer };

const angleTo = (x: number, z: number) => Math.atan2(x, z);

/** Bakes the whole Sanctum (local frame). */
export function buildSanctum(): SanctumGeometry {
  const rand = createRandom(61);
  const g: Shared = {
    box: unit.box(),
    hex: unit.hex(),
    ring: new TorusGeometry(1, 0.07, 6, 40),
    line: new TorusGeometry(1, 0.022, 4, 48),
    gem: new OctahedronGeometry(1, 0),
    arch: new TorusGeometry(1, 0.19, 6, 20, Math.PI),
    archLine: new TorusGeometry(1, 0.03, 4, 24, Math.PI),
    facet: new TetrahedronGeometry(1, 0),
    cap: new ConeGeometry(1, 1, 4),
  };
  const terrace = unit.disc(22);
  const court = unit.disc(28);
  const platform = unit.disc(12);
  const hang = new ConeGeometry(1, 1, 7);
  const inlay = new TorusGeometry(1, 0.012, 4, 64);
  const poolRim = new TorusGeometry(1, 0.08, 6, 40);
  const temporary: BufferGeometry[] = [...Object.values(g), terrace, court, platform, hang, inlay, poolRim];

  const stone: Part[] = [];
  const moss: Part[] = [];

  // Terraces: stone sides with grassy caps, stepping up to the court.
  let base = 0;
  for (const t of TERRACES) {
    const h = t.top - base;
    stone.push([terrace, placement([0, base + h / 2, 0], [0, 0, 0], [t.radius, h, t.radius])]);
    moss.push([terrace, placement([0, t.top + 0.06, 0], [0, 0.07, 0], [t.radius - 0.5, 0.12, t.radius - 0.5])]);
    base = t.top;
  }

  // Verdant ground: moss mounds and small pines between the terraces and the island's rim.
  const mound = new IcosahedronGeometry(1, 0);
  const pine = new ConeGeometry(1, 1, 6);
  temporary.push(mound, pine);
  const groundSpot = () => {
    const a = rand() * Math.PI * 2;
    const rim = rimRadius((a * 180) / Math.PI) - 5;
    const d = GROUND.inner + rand() * Math.max(1, rim - GROUND.inner);
    return [Math.sin(a) * d, Math.cos(a) * d] as const;
  };
  for (let i = 0; i < GROUND.mounds; i++) {
    const [x, z] = groundSpot();
    const s = 1.4 + rand() * 2.4;
    moss.push([mound, placement([x, 0.2, z], [rand(), rand() * 3, rand()], [s * 1.3, s * 0.55, s])]);
  }
  for (let i = 0; i < GROUND.pines; i++) {
    const [x, z] = groundSpot();
    const h = 4 + rand() * 4;
    moss.push([pine, placement([x, h / 2, z], [0, rand() * 3, 0], [h * 0.32, h, h * 0.32])]);
  }

  // The court floor, the pool's rim.
  stone.push([court, placement([0, COURT.top - COURT.thickness / 2 + 0.08, 0], [0, 0, 0], [COURT.radius, COURT.thickness, COURT.radius])]);
  const rimR = POOL.radius + POOL.rim;
  stone.push([poolRim, placement([0, COURT.top + 0.12, 0], [Math.PI / 2, 0, 0], [rimR, rimR, POOL.rim * 9])]);

  // The pillar ring: plinth, shaft, capital; two broken short; three lintels.
  const pillarAt = (i: number) => (i / PILLARS.count) * Math.PI * 2 + Math.PI / PILLARS.count;
  for (let i = 0; i < PILLARS.count; i++) {
    const a = pillarAt(i);
    const x = Math.sin(a) * PILLARS.ring;
    const z = Math.cos(a) * PILLARS.ring;
    const broken = PILLARS.broken.includes(i);
    const h = broken ? PILLARS.brokenHeight + rand() * 1.2 : PILLARS.height;
    stone.push([g.box, placement([x, COURT.top + 0.3, z], [0, a, 0], [2.7, 0.6, 2.7])]);
    stone.push([g.hex, placement([x, COURT.top + 0.6 + h / 2, z], [broken ? 0.06 : 0, a, broken ? -0.05 : 0], [PILLARS.radius, h, PILLARS.radius])]);
    if (!broken) stone.push([g.box, placement([x, COURT.top + 0.6 + h + 0.25, z], [0, a, 0], [2.9, 0.5, 2.9])]);
    else stone.push([g.box, placement([x + 2.2, COURT.top + 0.5, z + 1.4], [0.2, a, 1.35], [PILLARS.radius * 1.6, 2.4, PILLARS.radius * 1.6])]);
  }
  const chord = 2 * PILLARS.ring * Math.sin(Math.PI / PILLARS.count);
  for (const [i] of PILLARS.lintels) {
    const a = pillarAt(i) + Math.PI / PILLARS.count;
    const r = PILLARS.ring * Math.cos(Math.PI / PILLARS.count);
    stone.push([g.box, placement([Math.sin(a) * r, COURT.top + 0.6 + PILLARS.height + 0.9, Math.cos(a) * r], [0, a, 0], [chord + 2.4, 0.8, 1.7])]);
  }

  // Suspended architecture: broken blocks hanging in the air around the court.
  for (let i = 0; i < 6; i++) {
    const a = rand() * Math.PI * 2;
    const d = 21 + rand() * 9;
    const s = 0.8 + rand() * 1.3;
    stone.push([g.box, placement([Math.sin(a) * d, COURT.top + 7 + rand() * 8, Math.cos(a) * d], [rand(), rand() * 3, rand()], [s * 1.6, s, s])]);
  }

  // Edges: one contiguous range per fragment, then the court's.
  const edgeGeometries: BufferGeometry[] = [];
  const fragmentEdges = {} as Record<FragmentId, EdgeRange>;
  let start = 0;
  const pushEdges = (parts: Part[]): EdgeRange => {
    const merged = mergeParts(parts);
    const count = merged.getAttribute('position').count;
    edgeGeometries.push(merged);
    const range = { start, count };
    start += count;
    return range;
  };

  for (const site of FRAGMENTS) {
    const [px, py, pz] = site.position;
    // Platform and the rock hanging beneath it.
    stone.push([platform, placement([px, py - PLATFORM.thickness / 2, pz], [0, rand(), 0], [PLATFORM.radius, PLATFORM.thickness, PLATFORM.radius])]);
    stone.push([hang, placement([px, py - PLATFORM.thickness - PLATFORM.hang / 2, pz], [Math.PI, rand(), 0], [PLATFORM.radius * 0.85, PLATFORM.hang, PLATFORM.radius * 0.85])]);
    // Floating stepping stones from the court's rim up to the platform's edge.
    const a = angleTo(px, pz);
    const from: Vec3 = [Math.sin(a) * (COURT.radius + 1.2), COURT.top - 0.2, Math.cos(a) * (COURT.radius + 1.2)];
    const flat = Math.hypot(px, pz) - PLATFORM.radius - 1.2;
    const to: Vec3 = [Math.sin(a) * flat, py - 0.25, Math.cos(a) * flat];
    const rise = to[1] - from[1];
    const run = Math.hypot(to[0] - from[0], to[2] - from[2]);
    const steps = Math.max(3, Math.ceil(Math.max(run / 3.2, rise / 2.2)));
    for (let k = 1; k <= steps; k++) {
      const t = k / (steps + 1);
      stone.push([g.box, placement([from[0] + (to[0] - from[0]) * t, from[1] + rise * t, from[2] + (to[2] - from[2]) * t], [0, a + rand() * 0.6, 0], [2.6, 0.5, 2.2])]);
    }
    // The form, turned toward the visitor, standing on the platform.
    const world = placement([px, py, pz], [0, site.yaw, 0]);
    const toPlatform = ([geo, m]: Part): Part => [geo, new Matrix4().multiplyMatrices(world, m)];
    const form = FORMS[site.id](g);
    stone.push(...form.stone.map(toPlatform));
    fragmentEdges[site.id] = pushEdges([
      ...form.edges.map(toPlatform),
      [inlay, placement([px, py + 0.03, pz], [Math.PI / 2, 0, 0], [PLATFORM.radius - 0.25, PLATFORM.radius - 0.25, 4])],
    ]);
  }

  // The court's lines of light: the pool's rim and an inlaid ring in the floor.
  const courtEdges = pushEdges([
    [inlay, placement([0, COURT.top + 0.1, 0], [Math.PI / 2, 0, 0], [POOL.radius + 0.06, POOL.radius + 0.06, 6])],
    [inlay, placement([0, COURT.top + 0.1, 0], [Math.PI / 2, 0, 0], [12, 12, 4])],
  ]);

  const edges = mergeGeometries(edgeGeometries, false);
  edgeGeometries.forEach((e) => e.dispose());
  if (!edges) throw new Error('Sanctum edge merge failed');
  edges.setAttribute('color', new BufferAttribute(new Float32Array(start * 3), 3));

  // The pool's still water.
  const water = new CircleGeometry(POOL.radius, 36);
  water.rotateX(-Math.PI / 2);
  water.translate(0, COURT.top + 0.06, 0);

  // The broken halo (drifts as one piece).
  const haloArc = new TorusGeometry(HALO.radius, HALO.tube, 6, 36, HALO.arc);
  const halo = mergeParts([[haloArc, placement([0, 0, 0], [Math.PI / 2 - HALO.tilt, 0, 0.6])]]);
  haloArc.dispose();

  // The Explorer's pointer, in its pivot frame: a slim arm reaching out along +X with a tip.
  const pointer = mergeParts([
    [g.box, placement([2.6, 0, 0], [0, 0, 0], [8.2, 0.32, 0.32])],
    [g.box, placement([-1.6, 0, 0], [0, 0, 0], [0.9, 0.5, 0.5])],
    [g.gem, placement([6.9, 0, 0], [0, 0, Math.PI / 2], [0.42, 0.9, 0.42])],
  ]);
  const explorerSite = FRAGMENTS.find((f) => f.id === 'explorer');
  const pointerPivot: Vec3 = explorerSite ? [explorerSite.position[0], explorerSite.position[1] + MAST.pointerAt, explorerSite.position[2]] : [0, 0, 0];

  const result: SanctumGeometry = {
    stone: mergeParts(stone),
    moss: mergeParts(moss),
    edges,
    pool: water,
    halo,
    pointer,
    pointerPivot,
    fragmentEdges,
    courtEdges,
  };
  new Set(temporary).forEach((geo) => geo.dispose());
  return result;
}

/** Triangles drawn by a geometry. */
export const triangleCount = (geometry: BufferGeometry): number => (geometry.index ? geometry.index.count : geometry.getAttribute('position').count) / 3;
