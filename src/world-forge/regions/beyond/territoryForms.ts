/**
 * The Worlds Beyond territories' forms (M7; DEC-032, DEC-033). Pure. Each builder works in its
 * territory's own frame (origin on the island top, +Z facing the Convergence) and returns its
 * stone, its lights, and optionally an ordered `sequence` of light groups the scene animates
 * (the Formula 1 streak running along the track, the broadcast tower's rings pulsing outward).
 *
 * One family (The Guild set the standard, DEC-033): the shared stone, lit edges in the
 * territory's own colour, one landmark per island, compact (under ~25 m). No character art,
 * logos or team marks: abstract forms only (master doc).
 */
import { Matrix4, Quaternion, Vector3, type BufferGeometry } from 'three';
import { placement, type Part, type Vec3 } from '../../core/mergeStatic';
import type { TerritoryId } from '../../content/interests';
import { GUILD } from './beyondLayout';

export interface Shared {
  box: BufferGeometry;
  disc: BufferGeometry;
  heptagon: BufferGeometry;
  hex: BufferGeometry;
  ring: BufferGeometry;
  gem: BufferGeometry;
  rock: BufferGeometry;
}

export interface TerritoryForm {
  stone: Part[];
  lights: Part[];
  sequence?: Part[][];
}

const UP = new Vector3(0, 1, 0);

/** A box between two points: `w` wide (sideways), `t` thick, its length along a→b. */
function bar(g: Shared, a: Vec3, b: Vec3, w: number, t: number): Part {
  const from = new Vector3(...a);
  const dir = new Vector3(...b).sub(from);
  const length = dir.length();
  const q = new Quaternion().setFromUnitVectors(UP, dir.clone().normalize());
  return [g.box, new Matrix4().compose(from.addScaledVector(dir, 0.5), q, new Vector3(w, length, t))];
}

/** The Guild (AniCos): a courtyard with the Hall, the Chronicle wall, the Assembly's seats and the Stage. */
function guild(g: Shared): TerritoryForm {
  const stone: Part[] = [];
  const lights: Part[] = [];
  stone.push([g.box, placement([0, 0.2, 0], [0, 0, 0], [GUILD.court, 0.4, GUILD.court])]);
  lights.push([g.box, placement([0, 0.42, GUILD.court / 2 - 0.4], [0, 0, 0], [GUILD.court - 1, 0.03, 0.1])]);
  const [hx, , hz] = GUILD.hall.at;
  const [hw, hh, hd] = GUILD.hall.size;
  stone.push([g.box, placement([hx, hh / 2, hz], [0, 0, 0], [hw, hh, hd])]);
  stone.push([g.box, placement([hx, hh, hz], [Math.PI / 4, 0, 0], [hw + 0.6, hd * 0.62, hd * 0.62])]);
  lights.push([g.box, placement([hx, 1.6, hz + hd / 2 + 0.02], [0, 0, 0], [2, 3.2, 0.05])]);
  for (const x of [-4.5, 4.5]) lights.push([g.box, placement([hx + x, 3.6, hz + hd / 2 + 0.02], [0, 0, 0], [1.2, 1.4, 0.05])]);
  const [wx, , wz] = GUILD.chronicle.at;
  const [ww, wh, wd] = GUILD.chronicle.size;
  stone.push([g.box, placement([wx, wh / 2, wz], [0, 0, 0], [ww, wh, wd])]);
  for (const y of [1.1, 2.1, 3.1]) lights.push([g.box, placement([wx + ww / 2 + 0.02, y, wz], [0, 0, 0], [0.05, 0.12, wd - 1.2])]);
  const [ax, , az] = GUILD.assembly.at;
  stone.push([g.disc, placement([ax, 0.75, az], [0, 0, 0], [1.3, 0.7, 1.3])]);
  for (let k = 0; k < GUILD.assembly.seats; k++) {
    const a = (k / GUILD.assembly.seats) * Math.PI * 2;
    stone.push([g.box, placement([ax + Math.sin(a) * GUILD.assembly.radius, 0.8, az + Math.cos(a) * GUILD.assembly.radius], [0, a, 0], [1.4, 0.8, 0.9])]);
  }
  lights.push([g.ring, placement([ax, 0.43, az], [Math.PI / 2, 0, 0], [GUILD.assembly.radius + 1.2, GUILD.assembly.radius + 1.2, 6])]);
  const [sx, , sz] = GUILD.stage.at;
  const [sw, sh, sd] = GUILD.stage.size;
  const back = sz - sd / 2 + 0.4;
  stone.push([g.box, placement([sx, 0.4 + sh / 2, sz], [0, 0, 0], [sw, sh, sd])]);
  stone.push([g.box, placement([sx - sw / 2 + 0.4, 0.4 + sh + 2.6, back], [0, 0, 0], [0.6, 5.2, 0.6])]);
  stone.push([g.box, placement([sx + sw / 2 - 0.4, 0.4 + sh + 2.6, back], [0, 0, 0], [0.6, 5.2, 0.6])]);
  stone.push([g.box, placement([sx, 0.4 + sh + 5.4, back], [0, 0, 0], [sw, 0.6, 0.6])]);
  lights.push([g.box, placement([sx, 0.4 + sh + 5.0, back + 0.32], [0, 0, 0], [sw - 1.4, 0.1, 0.05])]);
  lights.push([g.box, placement([sx, 0.4 + sh + 0.02, sz + sd / 2 - 0.3], [0, 0, 0], [sw - 0.6, 0.03, 0.1])]);
  for (const [x, z] of [
    [-8, 8],
    [8, 8],
    [-8, -3],
    [8, -3],
  ]) {
    stone.push([g.box, placement([x, 1.2, z], [0, 0, 0], [0.25, 2.4, 0.25])]);
    lights.push([g.gem, placement([x, 2.7, z], [0, 0.4, 0], [0.32, 0.45, 0.32])]);
  }
  return { stone, lights };
}

/** Anime & Manga: a wind-swept crag with a lone gate of dark stone, banners of crimson light streaming from it. */
function anime(g: Shared): TerritoryForm {
  const stone: Part[] = [];
  const lights: Part[] = [];
  const top = 5;
  // The crag: a rugged raised rock, with broken stones around its foot.
  stone.push([g.heptagon, placement([0, top / 2, -3], [0, 0.3, 0], [8, top, 7.5])]);
  for (const [x, y, z, s] of [
    [-7.5, 1.4, -1, 2.6],
    [6.8, 1.1, -5, 2.2],
    [-4, 1, 4, 1.8],
    [5, 0.9, 3.5, 1.5],
    [1, 1.5, -10, 2.8],
  ])
    stone.push([g.rock, placement([x, y, z], [x, z, 0], [s * 1.2, s * 0.8, s])]);
  // The gate: two leaning posts, a tie beam, a strut, and the long top beam with upturned ends.
  const gz = -1.5;
  for (const x of [-3, 3]) stone.push([g.hex, placement([x, top + 4, gz], [0, 0, x > 0 ? 0.035 : -0.035], [0.45, 8, 0.45])]);
  stone.push([g.box, placement([0, top + 6.3, gz], [0, 0, 0], [7.8, 0.5, 0.5])]);
  stone.push([g.box, placement([0, top + 7.1, gz], [0, 0, 0], [0.45, 1.2, 0.45])]);
  stone.push([g.box, placement([0, top + 7.9, gz], [0, 0, 0], [8.6, 0.6, 0.85])]);
  for (const s of [-1, 1]) stone.push([g.box, placement([s * 4.9, top + 8.1, gz], [0, 0, s * 0.28], [1.5, 0.45, 0.85])]);
  // Light along the underside of the top beam, and banners streaming on the wind.
  lights.push([g.box, placement([0, top + 7.55, gz + 0.45], [0, 0, 0], [8, 0.08, 0.05])]);
  for (const s of [-1, 1]) {
    // Each banner falls away on the wind in two lengths, drooping as it goes.
    lights.push(bar(g, [s * 4.6, top + 7.7, gz], [s * 7.6, top + 5.4, gz - 1.6], 0.42, 0.05));
    lights.push(bar(g, [s * 7.6, top + 5.4, gz - 1.6], [s * 10.2, top + 2.4, gz - 2.8], 0.34, 0.05));
    lights.push(bar(g, [s * 4.3, top + 6.6, gz], [s * 6.8, top + 4.2, gz - 1.2], 0.36, 0.05));
    lights.push(bar(g, [s * 6.8, top + 4.2, gz - 1.2], [s * 8.8, top + 1.4, gz - 2.1], 0.28, 0.05));
  }
  return { stone, lights };
}

/** Formula 1: a banked ribbon of track arcing toward the island's edge on slim pylons, a streak of light running along it. */
function f1(g: Shared): TerritoryForm {
  const stone: Part[] = [];
  const lights: Part[] = [];
  const sequence: Part[][] = [];
  stone.push([g.disc, placement([0, 0.4, -2], [0, 0, 0], [9, 0.8, 9])]);
  const centre: Vec3 = [3, 0, -3];
  const radius = 14;
  const steps = 30;
  const from = (-150 * Math.PI) / 180;
  const to = (110 * Math.PI) / 180;
  const at = (t: number): Vec3 => {
    const a = from + (to - from) * t;
    return [centre[0] + Math.sin(a) * radius, 3 + 6 * Math.sin(Math.PI * t * 0.85), centre[2] + Math.cos(a) * radius];
  };
  for (let k = 0; k < steps; k++) {
    const p = at(k / steps);
    const q = at((k + 1) / steps);
    const a = from + ((to - from) * (k + 0.5)) / steps;
    const mid: Vec3 = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2];
    const length = Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]);
    const pitch = Math.atan2(q[1] - p[1], Math.hypot(q[0] - p[0], q[2] - p[2]));
    // Each segment follows the curve (yaw), the climb (pitch), and is banked toward the curve's centre.
    const yaw = a + Math.PI / 2;
    const m = placement(mid, [0, 0, 0]);
    const rot = new Matrix4().makeRotationY(yaw).multiply(new Matrix4().makeRotationX(-pitch)).multiply(new Matrix4().makeRotationZ(0.32));
    const seg = new Matrix4().multiplyMatrices(m, rot);
    const local = (offset: Vec3, size: Vec3): Part => [g.box, new Matrix4().multiplyMatrices(seg, placement(offset, [0, 0, 0], size))];
    stone.push(local([0, 0, 0], [4.4, 0.45, length + 0.05]));
    lights.push(local([-2.15, 0.26, 0], [0.12, 0.06, length]), local([2.15, 0.26, 0], [0.12, 0.06, length]));
    sequence.push([local([0, 0.25, 0], [0.5, 0.05, length * 0.9])]);
    if (k % 6 === 3) stone.push(bar(g, [mid[0], 0, mid[2]], [mid[0], mid[1] - 0.3, mid[2]], 0.5, 0.5));
  }
  return { stone, lights, sequence };
}

/** Gaming & Content Creation: an abstract broadcast tower, floating screens as glowing frames, signal rings pulsing out. */
function creator(g: Shared): TerritoryForm {
  const stone: Part[] = [];
  const lights: Part[] = [];
  const sequence: Part[][] = [];
  const mz = -2;
  stone.push([g.hex, placement([0, 0.6, mz], [0, 0, 0], [4, 1.2, 4])]);
  stone.push([g.hex, placement([0, 1.2 + 9, mz], [0, 0, 0], [0.6, 18, 0.6])]);
  // Floating screens around the mast: dark panels framed in light (no video).
  for (const [deg, y, w, h] of [
    [25, 5, 5, 3],
    [150, 8.5, 4.4, 2.6],
    [255, 12, 5.2, 3],
    [345, 15.2, 3.8, 2.3],
  ]) {
    const a = (deg * Math.PI) / 180;
    const c: Vec3 = [Math.sin(a) * 3.6, y, mz + Math.cos(a) * 3.6];
    const frame = placement(c, [-0.08, a, 0]);
    const local = (offset: Vec3, size: Vec3): Part => [g.box, new Matrix4().multiplyMatrices(frame, placement(offset, [0, 0, 0], size))];
    stone.push(local([0, 0, 0], [w, h, 0.12]));
    lights.push(local([0, h / 2, 0.08], [w + 0.2, 0.1, 0.05]), local([0, -h / 2, 0.08], [w + 0.2, 0.1, 0.05]));
    lights.push(local([w / 2, 0, 0.08], [0.1, h, 0.05]), local([-w / 2, 0, 0.08], [0.1, h, 0.05]));
  }
  lights.push([g.gem, placement([0, 20.4, mz], [0, 0.4, 0], [0.7, 1.1, 0.7])]);
  // Signal rings at the top, lit in turn so they pulse outward.
  for (const r of [1.8, 3.2, 4.8]) sequence.push([[g.ring, placement([0, 19.2, mz], [Math.PI / 2, 0, 0], [r, r, 6])]]);
  return { stone, lights, sequence };
}

/** The Training Grounds: a secluded, rugged plateau in natural light; a stair cut into the rock, weathered training stones. */
function training(g: Shared): TerritoryForm {
  const stone: Part[] = [];
  const lights: Part[] = [];
  // The rock mass, and the stair cut up to its top.
  stone.push([g.box, placement([-5, 3.3, -7], [0, 0.12, 0], [8.5, 6.6, 7])]);
  for (let k = 0; k < 8; k++) {
    const h = 0.8 * (k + 1);
    const z = 2.4 - k * 0.85;
    stone.push([g.box, placement([-5, h / 2, z], [0, 0.12, 0], [2.4, h, 0.9])]);
    lights.push([g.box, placement([-5 + Math.sin(0.12) * (z + 0.45), h + 0.02, z + 0.45 * Math.cos(0.12)], [0, 0.12, 0], [2.2, 0.03, 0.05])]);
  }
  // Weathered training stones.
  for (const [x, z, h] of [
    [4, -2, 3.6],
    [6.6, 1, 2.3],
    [3, 3, 1.5],
  ])
    stone.push([g.box, placement([x, h / 2, z], [0.04, x, -0.03], [1.1, h, 0.9])]);
  stone.push([g.box, placement([6, 0.35, -5.5], [0, 0.4, 0], [3, 0.7, 2])]);
  stone.push([g.rock, placement([6, 1.3, -5.5], [0.5, 0.2, 0], [0.9, 0.7, 0.9])]);
  // Rugged rocks around the plateau.
  for (const [x, z, s] of [
    [-11, 3, 2.6],
    [10, -9, 3],
    [-2, -13, 2.2],
    [12, 4, 1.8],
    [-9, -12, 2.4],
    [1, 9, 1.6],
  ])
    stone.push([g.rock, placement([x, s * 0.4, z], [x, z, 0], [s * 1.3, s * 0.8, s])]);
  return { stone, lights };
}

/**
 * Story-driven Games: a misty, half-ruined keep, one lit window, and a path of lanterns that ends at
 * a closed door (environmental storytelling). Built as an environment; it opens no panel until the
 * owner sends its text (DEC-034).
 */
function stories(g: Shared): TerritoryForm {
  const stone: Part[] = [];
  const lights: Part[] = [];
  // The keep: a tall tower with a broken crown, and a low hall whose far wall has fallen.
  stone.push([g.box, placement([-3, 6.5, -6], [0, 0.2, 0], [6, 13, 6])]);
  for (const [x, z, h] of [
    [-5.2, -8.2, 2.2],
    [-0.8, -8.4, 1.2],
    [-5.4, -3.8, 1.6],
  ])
    stone.push([g.box, placement([x, 13 + h / 2, z], [0, 0.2, 0], [1.4, h, 1.4])]);
  stone.push([g.box, placement([3, 2.5, -5], [0, 0.2, 0], [7, 5, 0.9])]);
  stone.push([g.box, placement([6.4, 1.6, -2.5], [0, 0.2, 0.08], [0.9, 3.2, 4.6])]);
  stone.push([g.rock, placement([5.5, 0.6, 1.5], [0.4, 1, 0], [1.6, 0.9, 1.2])]);
  stone.push([g.rock, placement([7.5, 0.5, -0.5], [1, 0.3, 0], [1.2, 0.7, 1])]);
  // One lit window high in the tower; the closed door at its foot, outlined in light.
  const face = -3 + 3.02;
  lights.push([g.box, placement([-2.6, 9.5, face], [0, 0.2, 0], [0.9, 1.5, 0.05])]);
  stone.push([g.box, placement([-3.4, 1.7, face - 0.02], [0, 0.2, 0], [2, 3.4, 0.2])]);
  lights.push([g.box, placement([-3.4, 3.45, face + 0.06], [0, 0.2, 0], [2.2, 0.08, 0.05])]);
  for (const x of [-4.45, -2.35]) lights.push([g.box, placement([x, 1.7, face + 0.06], [0, 0.2, 0], [0.08, 3.4, 0.05])]);
  // A path of lanterns leading to the door.
  for (const [x, z] of [
    [-1.5, 9],
    [-2.6, 6],
    [-1.6, 3.6],
    [-2.8, 1.6],
  ]) {
    stone.push([g.box, placement([x, 0.9, z], [0, 0, 0], [0.2, 1.8, 0.2])]);
    lights.push([g.gem, placement([x, 2, z], [0, 0.4, 0], [0.26, 0.36, 0.26])]);
  }
  return { stone, lights };
}

export const TERRITORY_FORMS: Readonly<Record<TerritoryId, (g: Shared) => TerritoryForm>> = { anime, stories, f1, creator, guild, training };
