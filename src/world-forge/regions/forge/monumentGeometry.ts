/**
 * The Forged Works' geometry (M5; baked for the M5.8 render budget).
 *
 * Every monument is a shared stele plus its own emblem (M5 proposal §2.1). All eight are
 * baked into two geometries for the whole terrace: one stone mesh and one edge mesh, so
 * the monuments cost two draw calls together. Each monument owns a contiguous vertex range
 * of the edge mesh, whose vertex colours carry its rest / hover / selected glow.
 * Pure (no React), so the budget is unit-tested.
 */
import {
  BoxGeometry,
  BufferAttribute,
  ConeGeometry,
  CylinderGeometry,
  IcosahedronGeometry,
  Matrix4,
  OctahedronGeometry,
  TorusGeometry,
  type BufferGeometry,
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mergeParts, placement, type Part } from '../../core/mergeStatic';
import type { EmblemKind, Project } from '../../content/projects';
import { PLINTH, PLINTH_SITES } from './hubLayout';

/** The shared stele every monument stands on (M5 "Forged Works": one family, seven distinct works). */
export const STELE = { width: 2.6, height: 5.2, depth: 1.3, cap: 0.4 } as const;
export const EMBLEM_BASE = STELE.height + STELE.cap;

interface EmblemGeometry {
  stone: Part[];
  /** Thin edges that warm when the monument is hovered, focused or selected. */
  edges: Part[];
  /** Height of the emblem's top above the plinth (for the light thread). */
  top: number;
  temporary: BufferGeometry[];
}

/** NutriFit AI: a spiralling column of stacked discs (daily growth). */
function spiralDiscs(): EmblemGeometry {
  const disc = new CylinderGeometry(1, 1, 1, 24, 1);
  const edge = new TorusGeometry(1, 0.035, 4, 48);
  const stone: Part[] = [];
  const edges: Part[] = [];
  let y = EMBLEM_BASE + 0.35;
  for (let i = 0; i < 7; i++) {
    const r = 1.15 - i * 0.07;
    const x = Math.cos(i * 0.9) * 0.28;
    const z = Math.sin(i * 0.9) * 0.28;
    stone.push([disc, placement([x, y, z], [0, i * 0.5, 0], [r, 0.32, r])]);
    edges.push([edge, placement([x, y + 0.17, z], [Math.PI / 2, 0, 0], [r, r, 1])]);
    y += 0.54;
  }
  return { stone, edges, top: y, temporary: [disc, edge] };
}

/** NeuroPlay Engine: two interlocking rings (a twin). */
function twinRings(): EmblemGeometry {
  const ring = new TorusGeometry(1.05, 0.18, 8, 40);
  const edge = new TorusGeometry(0.86, 0.04, 4, 40);
  const y = EMBLEM_BASE + 1.45;
  return {
    stone: [
      [ring, placement([-0.42, y, 0], [0, 0, 0])],
      [ring, placement([0.42, y, 0], [0, Math.PI / 2, 0])],
    ],
    edges: [
      [edge, placement([-0.42, y, 0], [0, 0, 0])],
      [edge, placement([0.42, y, 0], [0, Math.PI / 2, 0])],
    ],
    top: y + 1.25,
    temporary: [ring, edge],
  };
}

/** AETHERION: a rising stepped shard (markets and momentum). */
function risingShard(): EmblemGeometry {
  const box = new BoxGeometry(1, 1, 1);
  const tip = new OctahedronGeometry(1, 0);
  const stone: Part[] = [];
  const edges: Part[] = [];
  let y = EMBLEM_BASE + 0.35;
  for (let i = 0; i < 4; i++) {
    const w = 1.5 - i * 0.28;
    const x = -0.45 + i * 0.3;
    stone.push([box, placement([x, y, 0], [0, 0, 0.12], [w, 0.7, w * 0.7])]);
    edges.push([box, placement([x, y + 0.36, w * 0.35 + 0.01], [0, 0, 0.12], [w * 0.9, 0.05, 0.02])]);
    y += 0.72;
  }
  stone.push([tip, placement([0.75, y + 0.35, 0], [0, 0.4, 0.15], [0.35, 1.0, 0.35])]);
  return { stone, edges, top: y + 1.3, temporary: [box, tip] };
}

/** FinLit AI: a balanced arch over a keystone (clarity and balance). */
function balancedArch(): EmblemGeometry {
  const arch = new TorusGeometry(1.1, 0.22, 8, 28, Math.PI);
  const edge = new TorusGeometry(0.86, 0.04, 4, 28, Math.PI);
  const box = new BoxGeometry(1, 1, 1);
  const y = EMBLEM_BASE + 0.15;
  return {
    stone: [
      [arch, placement([0, y, 0], [0, 0, 0])],
      [box, placement([0, y + 0.4, 0], [0, 0, 0], [0.75, 0.8, 0.7])],
      [box, placement([0, y + 1.42, 0], [0, 0, 0], [0.5, 0.5, 0.5])],
    ],
    edges: [[edge, placement([0, y, 0], [0, 0, 0])]],
    top: y + 1.7,
    temporary: [arch, edge, box],
  };
}

/** PARAS System: an open lens ring around a still core (watchfulness). */
function lensRing(): EmblemGeometry {
  const ring = new TorusGeometry(1.15, 0.2, 8, 44);
  const edge = new TorusGeometry(0.93, 0.04, 4, 44);
  const core = new OctahedronGeometry(0.42, 0);
  const y = EMBLEM_BASE + 1.45;
  return {
    stone: [
      [ring, placement([0, y, 0], [0, 0, 0])],
      [core, placement([0, y, 0], [0, 0.6, 0])],
    ],
    edges: [[edge, placement([0, y, 0], [0, 0, 0])]],
    top: y + 1.35,
    temporary: [ring, edge, core],
  };
}

/** Game Stats Dashboard: a faceted, die-like polyhedron (play and chance). */
function facetedDie(): EmblemGeometry {
  const die = new IcosahedronGeometry(1, 0);
  const edge = new TorusGeometry(1.0, 0.04, 4, 40);
  const y = EMBLEM_BASE + 1.25;
  return {
    stone: [[die, placement([0, y, 0], [0.35, 0.6, 0.2])]],
    edges: [[edge, placement([0, y, 0], [Math.PI / 2, 0, 0])]],
    top: y + 1.05,
    temporary: [die, edge],
  };
}

/** SPAE: three ascending columns (performance over time; no data implied). */
function ascendingColumns(): EmblemGeometry {
  const column = new CylinderGeometry(0.3, 0.34, 1, 10);
  const cap = new TorusGeometry(0.33, 0.04, 4, 24);
  const stone: Part[] = [];
  const edges: Part[] = [];
  [1.3, 2.1, 2.9].forEach((h, i) => {
    const x = -0.78 + i * 0.78;
    stone.push([column, placement([x, EMBLEM_BASE + h / 2, 0], [0, 0, 0], [1, h, 1])]);
    edges.push([cap, placement([x, EMBLEM_BASE + h + 0.02, 0], [Math.PI / 2, 0, 0])]);
  });
  return { stone, edges, top: EMBLEM_BASE + 3.0, temporary: [column, cap] };
}

/** Chronoshift: an hourglass (time). */
function hourglass(): EmblemGeometry {
  const cone = new ConeGeometry(0.85, 1.3, 16);
  const disc = new CylinderGeometry(1.0, 1.0, 0.16, 20);
  const post = new CylinderGeometry(0.07, 0.07, 1, 6);
  const waist = new TorusGeometry(0.16, 0.04, 4, 16);
  const glow = new OctahedronGeometry(0.12, 0);
  const y = EMBLEM_BASE + 0.1;
  const stone: Part[] = [
    [disc, placement([0, y + 0.08, 0])],
    [cone, placement([0, y + 0.8, 0], [Math.PI, 0, 0])],
    [cone, placement([0, y + 2.1, 0])],
    [disc, placement([0, y + 2.85, 0])],
  ];
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    stone.push([post, placement([Math.cos(a) * 0.9, y + 1.46, Math.sin(a) * 0.9], [0, 0, 0], [1, 2.75, 1])]);
  }
  return {
    stone,
    edges: [
      [waist, placement([0, y + 1.45, 0], [Math.PI / 2, 0, 0])],
      [glow, placement([0, y + 1.45, 0])],
    ],
    top: y + 2.95,
    temporary: [cone, disc, post, waist, glow],
  };
}

/** Emblem registry: one builder per emblem (M5 proposal §2.1). */
const EMBLEMS: Record<EmblemKind, () => EmblemGeometry> = {
  'twin-rings': twinRings,
  'rising-shard': risingShard,
  'spiral-discs': spiralDiscs,
  'balanced-arch': balancedArch,
  'lens-ring': lensRing,
  'faceted-die': facetedDie,
  'ascending-columns': ascendingColumns,
  hourglass,
};


/** Proposal §2.5 budget for all monuments together. */
export const MONUMENT_BUDGET = { drawCalls: 8, triangles: 15000 } as const;

/** Edge glow levels (multiples of the gold accent): at rest, hovered, selected. */
export const EDGE_LEVEL = { rest: 0.9, hover: 1.9, selected: 2.6 } as const;

export interface TerraceMonument {
  id: string;
  /** World-space base of the stele (on the plinth top) and its yaw in radians. */
  base: [number, number, number];
  yaw: number;
  /** Emblem top above the base. */
  top: number;
  /** This monument's vertices in the edge mesh. */
  edges: { start: number; count: number };
}

export interface Terrace {
  stone: BufferGeometry;
  /** Carries a `color` attribute (black until the scene tints it). */
  edges: BufferGeometry;
  monuments: TerraceMonument[];
}

/** One monument in its own frame: stele on the plinth top, front facing local +Z. */
function monumentParts(project: Project) {
  const box = new BoxGeometry(1, 1, 1);
  const stone: Part[] = [
    [box, placement([0, STELE.height / 2, 0], [0, 0, 0], [STELE.width, STELE.height, STELE.depth])],
    [box, placement([0, STELE.height + STELE.cap / 2, 0], [0, 0, 0], [STELE.width + 0.4, STELE.cap, STELE.depth + 0.3])],
  ];
  // Amber inlay across the stele's front foot (facing the visitor, local +Z).
  const edges: Part[] = [[box, placement([0, 0.45, STELE.depth / 2 + 0.01], [0, 0, 0], [STELE.width * 0.7, 0.09, 0.02])]];
  const emblem = EMBLEMS[project.emblem]();
  return { stone: [...stone, ...emblem.stone], edges: [...edges, ...emblem.edges], top: emblem.top, temporary: [box, ...emblem.temporary] };
}

/** Bakes the given works (in plinth order) into the terrace's two geometries. */
export function buildTerrace(projects: readonly Project[]): Terrace {
  const stoneParts: Part[] = [];
  const edgeGeometries: BufferGeometry[] = [];
  const monuments: TerraceMonument[] = [];
  const temporary: BufferGeometry[] = [];
  let start = 0;
  for (const project of projects) {
    const site = PLINTH_SITES[project.plinth];
    const base: [number, number, number] = [site.position[0], site.position[1] + PLINTH.size[1], site.position[2]];
    const yaw = (site.facing * Math.PI) / 180;
    const world = placement(base, [0, yaw, 0]);
    const parts = monumentParts(project);
    const toWorld = ([g, m]: Part): Part => [g, new Matrix4().multiplyMatrices(world, m)];
    stoneParts.push(...parts.stone.map(toWorld));
    const edges = mergeParts(parts.edges.map(toWorld));
    const count = edges.getAttribute('position').count;
    edgeGeometries.push(edges);
    monuments.push({ id: project.id, base, yaw, top: parts.top, edges: { start, count } });
    start += count;
    temporary.push(...parts.temporary);
  }
  const stone = mergeParts(stoneParts);
  const edges = mergeGeometries(edgeGeometries, false);
  edgeGeometries.forEach((g) => g.dispose());
  new Set(temporary).forEach((g) => g.dispose());
  if (!edges) throw new Error('Monument edge merge failed');
  edges.setAttribute('color', new BufferAttribute(new Float32Array(start * 3), 3));
  return { stone, edges, monuments };
}

/** Triangles drawn by a geometry. */
export const triangleCount = (g: BufferGeometry): number => (g.index ? g.index.count : g.getAttribute('position').count) / 3;
