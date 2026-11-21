/**
 * The Path of Ascension's geometry (M6.3 "The Lit Ascent"). Pure (no React), so the render
 * budget and placement are unit-tested. World coordinates.
 *
 * - stone: the path's slabs and stair spans, the floating platform, the five waystones, the
 *   lantern posts and the rock pinnacles;
 * - snow: the pinnacles' caps;
 * - lanterns: one glow per lantern, in path order, each a contiguous vertex range (`color`
 *   attribute), so the scene can light them from the foot of the path up to a milestone;
 * - lights: each waystone's crown light (own range: rest / hover / chosen);
 * - beam: the faint light rising from the summit beacon.
 */
import {
  BoxGeometry,
  BufferAttribute,
  ConeGeometry,
  CylinderGeometry,
  DodecahedronGeometry,
  Matrix4,
  OctahedronGeometry,
  Quaternion,
  TorusGeometry,
  Vector3,
  type BufferGeometry,
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mergeParts, placement, type Part, type Vec3 } from '../../core/mergeStatic';
import { createRandom } from '../../core/random';
import type { MilestoneId } from '../../content/timeline';
import { LANTERN_SPACING, PATH, PATH_DISTANCE, PINNACLES, PLATFORM, TOWARD_HUB, WAYSTONES } from './ascensionLayout';

/** At most 8 extra draw calls (net of the removed P2 placeholder) and 20k triangles (proposal §2.8). */
export const ASCENSION_BUDGET = { drawCalls: 8, triangles: 20000 } as const;

/** Glow levels (multiples of the Path's pale white-blue): lantern unlit / lit; crown at rest, hovered, chosen. */
export const ASCENSION_LEVEL = { lanternRest: 0.75, lanternLit: 2.1, crownRest: 0.9, crownHover: 1.7, crownChosen: 2.6 } as const;

export interface Range {
  start: number;
  count: number;
}

export interface AscensionGeometry {
  stone: BufferGeometry;
  snow: BufferGeometry;
  lanterns: BufferGeometry;
  lights: BufferGeometry;
  beam: BufferGeometry;
  /** Each lantern's distance along the path and its vertex range, in path order. */
  lanternRanges: Array<Range & { distance: number }>;
  lightRanges: Record<MilestoneId, Range>;
}

interface Shared {
  box: BufferGeometry;
  hex: BufferGeometry;
  gem: BufferGeometry;
  rock: BufferGeometry;
  arch: BufferGeometry;
  spire: BufferGeometry;
  peak: BufferGeometry;
}

const UP = new Vector3(0, 1, 0);

/** A box placed between two points (its length along a→b), `w` wide and `h` thick. */
function between(g: Shared, a: Vec3, b: Vec3, w: number, h: number): Part {
  const from = new Vector3(...a);
  const dir = new Vector3(...b).sub(from);
  const yaw = Math.atan2(dir.x, dir.z);
  return [g.box, new Matrix4().compose(from.addScaledVector(dir, 0.5), new Quaternion().setFromAxisAngle(UP, yaw), new Vector3(w, h, Math.hypot(dir.x, dir.z) || 0.01))];
}

interface Form {
  stone: Part[];
  /** Crown light: centre height and scale. */
  crown: { y: number; scale: Vec3 };
}

const FORMS: Record<MilestoneId, (g: Shared) => Form> = {
  // Foundations: a standing stone beside a cairn of stacked stones.
  foundations: (g) => ({
    stone: [
      [g.box, placement([0, 2.6, 0], [0, 0, 0.04], [1.3, 5.2, 0.8])],
      ...[1.5, 1.15, 0.85, 0.55].map((r, k): Part => [g.rock, placement([2.3, 0.6 + k * 1.05, 0.2], [k, k * 0.7, 0], [r * 1.2, r * 0.75, r])]),
    ],
    crown: { y: 6.2, scale: [0.55, 0.9, 0.55] },
  }),
  // University: an open arch.
  university: (g) => ({
    stone: [
      [g.box, placement([-3, 3.5, 0], [0, 0, 0], [1, 7, 1])],
      [g.box, placement([3, 3.5, 0], [0, 0, 0], [1, 7, 1])],
      [g.arch, placement([0, 7, 0], [0, 0, 0], [3, 3, 3])],
    ],
    crown: { y: 10.4, scale: [0.6, 1, 0.6] },
  }),
  // Leadership: twin pillars joined by a lantern beam.
  leadership: (g) => ({
    stone: [
      [g.box, placement([-2.6, 5, 0], [0, 0, 0], [1.2, 10, 1.2])],
      [g.box, placement([2.6, 5, 0], [0, 0, 0], [1.2, 10, 1.2])],
      [g.box, placement([0, 10.4, 0], [0, 0, 0], [7, 0.8, 1.1])],
    ],
    crown: { y: 9, scale: [0.6, 1, 0.6] },
  }),
  // Professional: a stepped stone frame, three open stages.
  professional: (g) => {
    const stone: Part[] = [];
    [6, 4.6, 3.2].forEach((w, k) => {
      const y0 = k * 4.6;
      for (const [sx, sz] of [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
      ])
        stone.push([g.box, placement([(sx * w) / 2, y0 + 2.3, (sz * w) / 2], [0, 0, 0], [0.55, 4.6, 0.55])]);
      stone.push([g.box, placement([0, y0 + 4.6, (-w) / 2], [0, 0, 0], [w + 0.55, 0.5, 0.55])], [g.box, placement([0, y0 + 4.6, w / 2], [0, 0, 0], [w + 0.55, 0.5, 0.55])]);
      stone.push([g.box, placement([(-w) / 2, y0 + 4.6, 0], [0, 0, 0], [0.55, 0.5, w + 0.55])], [g.box, placement([w / 2, y0 + 4.6, 0], [0, 0, 0], [0.55, 0.5, w + 0.55])]);
    });
    return { stone, crown: { y: 14.6, scale: [0.6, 1, 0.6] } };
  },
  // Building: the summit beacon, a tapered spire with the brightest light.
  building: (g) => ({
    stone: [
      [g.box, placement([0, 0.6, 0], [0, 0.4, 0], [5, 1.2, 5])],
      [g.spire, placement([0, 1.2 + 10.5, 0], [0, 0, 0], [1, 21, 1])],
    ],
    crown: { y: 23.8, scale: [1.2, 2.2, 1.2] },
  }),
};

/** Bakes the whole Path of Ascension (world coordinates). */
export function buildAscension(): AscensionGeometry {
  const rand = createRandom(47);
  const g: Shared = {
    box: new BoxGeometry(1, 1, 1),
    hex: new CylinderGeometry(1, 1.08, 1, 6),
    gem: new OctahedronGeometry(1, 0),
    rock: new DodecahedronGeometry(1, 0),
    arch: new TorusGeometry(1, 0.15, 6, 18, Math.PI),
    spire: new CylinderGeometry(0.55, 1.8, 1, 6),
    peak: new ConeGeometry(1, 1, 6),
  };
  const disc = new CylinderGeometry(1, 1, 1, 18);
  const temporary: BufferGeometry[] = [...Object.values(g), disc];
  const stone: Part[] = [];
  const snow: Part[] = [];

  // The path: slabs along each segment; over the gaps, floating stair steps.
  for (let k = 1; k < PATH.length; k++) {
    const a = PATH[k - 1].at;
    const b = PATH[k].at;
    const run = Math.hypot(b[0] - a[0], b[2] - a[2]);
    const stairs = PATH[k].stairs;
    const n = Math.max(2, Math.round(run / (stairs ? 2.6 : 3.1)));
    for (let s = 0; s < n; s++) {
      const t0 = s / n;
      const t1 = (s + 0.8) / n;
      const p = (t: number): Vec3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + (stairs ? 0 : 0.18), a[2] + (b[2] - a[2]) * t];
      // Each slab is level (a step), at the height where it starts.
      const from = p(t0);
      const to = p(t1);
      stone.push(between(g, from, [to[0], from[1], to[2]], stairs ? 3.4 : 3, stairs ? 0.6 : 0.3));
    }
  }

  // The floating platform between pa-2 and pa-3, and the rock hanging beneath it.
  const [px, py, pz] = PLATFORM.position;
  stone.push([disc, placement([px, py - PLATFORM.thickness / 2, pz], [0, 0.3, 0], [PLATFORM.radius, PLATFORM.thickness, PLATFORM.radius])]);
  stone.push([g.peak, placement([px, py - PLATFORM.thickness - 4, pz], [Math.PI, 0.5, 0], [PLATFORM.radius * 0.85, 8, PLATFORM.radius * 0.85])]);

  // Snow-capped pinnacles behind the path.
  for (const pin of PINNACLES) {
    const [x, y, z] = pin.at;
    const lean: Vec3 = [(rand() - 0.5) * 0.12, rand() * 3, (rand() - 0.5) * 0.12];
    stone.push([g.peak, placement([x, y + pin.height / 2 - 0.5, z], lean, [pin.radius, pin.height, pin.radius])]);
    // The cap: the top third, a touch wider so it covers the rock.
    snow.push([g.peak, placement([x, y + pin.height - 0.5 - pin.height * 0.17, z], lean, [pin.radius * 0.37, pin.height * 0.34, pin.radius * 0.37])]);
  }

  // Waystones, turned to face the hub (the camera's side), with their crown lights.
  const yaw = Math.atan2(TOWARD_HUB[0], TOWARD_HUB[1]);
  const lightGeometries: BufferGeometry[] = [];
  const lightRanges = {} as Record<MilestoneId, Range>;
  let lightStart = 0;
  for (const w of WAYSTONES) {
    const frame = placement(w.position, [0, yaw, 0]);
    const toWorld = ([geo, m]: Part): Part => [geo, new Matrix4().multiplyMatrices(frame, m)];
    const form = FORMS[w.id](g);
    stone.push(...form.stone.map(toWorld));
    const light = mergeParts([toWorld([g.gem, placement([0, form.crown.y, 0], [0, 0.3, 0], form.crown.scale)])]);
    const count = light.getAttribute('position').count;
    lightRanges[w.id] = { start: lightStart, count };
    lightStart += count;
    lightGeometries.push(light);
  }

  // Lanterns every few metres along the path, alternating sides; posts in stone, glows in their own mesh.
  const lanternGeometries: BufferGeometry[] = [];
  const lanternRanges: AscensionGeometry['lanternRanges'] = [];
  let lanternStart = 0;
  const total = PATH_DISTANCE[PATH_DISTANCE.length - 1];
  for (let d = 2, side = 1; d < total - 1; d += LANTERN_SPACING, side = -side) {
    let k = 1;
    while (k < PATH_DISTANCE.length - 1 && PATH_DISTANCE[k] < d) k++;
    const a = PATH[k - 1].at;
    const b = PATH[k].at;
    const t = (d - PATH_DISTANCE[k - 1]) / Math.max(1e-6, PATH_DISTANCE[k] - PATH_DISTANCE[k - 1]);
    const dir = new Vector3(b[0] - a[0], 0, b[2] - a[2]).normalize();
    const off: Vec3 = [-dir.z * 2.1 * side, 0, dir.x * 2.1 * side];
    const base: Vec3 = [a[0] + (b[0] - a[0]) * t + off[0], a[1] + (b[1] - a[1]) * t + (PATH[k].stairs ? 0.3 : 0.2), a[2] + (b[2] - a[2]) * t + off[2]];
    stone.push([g.box, placement([base[0], base[1] + 1.1, base[2]], [0, 0, 0], [0.22, 2.2, 0.22])]);
    const glow = mergeParts([[g.gem, placement([base[0], base[1] + 2.5, base[2]], [0, d, 0], [0.32, 0.45, 0.32])]]);
    const count = glow.getAttribute('position').count;
    lanternRanges.push({ start: lanternStart, count, distance: d });
    lanternStart += count;
    lanternGeometries.push(glow);
  }

  const lanterns = mergeGeometries(lanternGeometries, false);
  const lights = mergeGeometries(lightGeometries, false);
  lanternGeometries.forEach((x) => x.dispose());
  lightGeometries.forEach((x) => x.dispose());
  if (!lanterns || !lights) throw new Error('Path merge failed');
  lanterns.setAttribute('color', new BufferAttribute(new Float32Array(lanternStart * 3), 3));
  lights.setAttribute('color', new BufferAttribute(new Float32Array(lightStart * 3), 3));

  // The summit's beam of light.
  const summit = WAYSTONES[WAYSTONES.length - 1];
  const beamGeometry = new CylinderGeometry(0.12, 0.45, 46, 8, 1, true);
  const beam = mergeParts([[beamGeometry, placement([summit.position[0], summit.position[1] + 25 + 23, summit.position[2]])]]);
  beamGeometry.dispose();

  const result: AscensionGeometry = { stone: mergeParts(stone), snow: mergeParts(snow), lanterns, lights, beam, lanternRanges, lightRanges };
  new Set(temporary).forEach((geo) => geo.dispose());
  return result;
}

/** Triangles drawn by a geometry. */
export const triangleCount = (geometry: BufferGeometry): number => (geometry.index ? geometry.index.count : geometry.getAttribute('position').count) / 3;
