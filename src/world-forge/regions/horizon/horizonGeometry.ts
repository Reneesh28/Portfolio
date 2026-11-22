/**
 * The Horizon's geometry (M8 "The Unfinished Gate"). Pure (no React), so the budget and
 * placement are unit-tested. Local frame (see `horizonLayout.ts`).
 *
 * - stone: the gate's posts and the built start of each side of its arch, the path to its
 *   threshold, and fallen blocks beside it;
 * - lines: thin lines of gold light (the threshold, the posts' inner faces, the path's edge);
 * - floating: the missing voussoirs and the keystone, hanging where they will go (they drift
 *   very slightly, and not at all under reduced motion), in softly glowing gold stone.
 */
import { BoxGeometry, Matrix4, TorusGeometry, type BufferGeometry } from 'three';
import { mergeParts, placement, type Part, type Vec3 } from '../../core/mergeStatic';
import { createRandom } from '../../core/random';
import { GATE, GATE_AT, GATE_YAW } from './horizonLayout';

/** At most 6 extra draw calls (net of the removed P2 placeholder) and 12k triangles (proposal §2). */
export const HORIZON_BUDGET = { drawCalls: 6, triangles: 12000 } as const;

export interface HorizonGeometry {
  stone: BufferGeometry;
  lines: BufferGeometry;
  floating: BufferGeometry;
}

export function buildHorizon(): HorizonGeometry {
  const rand = createRandom(71);
  const box = new BoxGeometry(1, 1, 1);
  const arc = new TorusGeometry(GATE.radius, GATE.tube, 6, 10, GATE.built);
  const temporary: BufferGeometry[] = [box, arc];
  const [gx, , gz] = GATE_AT;
  // The gate faces west (its opening along local Z), turned toward the settled view; its posts stand across X.
  const frame = placement([gx, 0, gz], [0, GATE_YAW, 0]);
  const g = ([geo, m]: Part): Part => [geo, new Matrix4().multiplyMatrices(frame, m)];
  const stone: Part[] = [];
  const lines: Part[] = [];
  const floating: Part[] = [];

  // Posts and their plinths.
  for (const x of [-GATE.half, GATE.half]) {
    stone.push(g([box, placement([x, 0.5, 0], [0, 0, 0], [GATE.post + 1.4, 1, GATE.post + 1.4])]));
    stone.push(g([box, placement([x, GATE.spring / 2 + 0.5, 0], [0, 0, 0], [GATE.post, GATE.spring, GATE.post])]));
    lines.push(g([box, placement([x - Math.sign(x) * (GATE.post / 2 + 0.02), GATE.spring * 0.5, 0], [0, 0, 0], [0.04, GATE.spring * 0.8, 0.14])]));
  }
  // The built start of each side of the arch (the arch springs at the posts' tops).
  stone.push(g([arc, placement([0, GATE.spring + 0.5, 0], [0, 0, 0])]));
  stone.push(g([arc, placement([0, GATE.spring + 0.5, 0], [0, 0, Math.PI - GATE.built])]));
  // The missing stones, hanging where they belong (a little out of place: not yet set).
  const missing = 5;
  for (let k = 0; k < missing; k++) {
    const t = (k + 0.5) / missing;
    const a = GATE.built + (Math.PI - 2 * GATE.built) * t;
    const lift = 0.8 + Math.sin(Math.PI * t) * 1.4;
    const keystone = k === Math.floor(missing / 2);
    const size: Vec3 = keystone ? [1.5, 2.2, 2] : [1.2, 1.6, 1.7];
    floating.push(
      g([
        box,
        placement(
          [Math.cos(a) * (GATE.radius + lift * 0.3), GATE.spring + 0.5 + Math.sin(a) * GATE.radius + lift, (rand() - 0.5) * 0.8],
          [(rand() - 0.5) * 0.3, (rand() - 0.5) * 0.4, a - Math.PI / 2 + (rand() - 0.5) * 0.3],
          size,
        ),
      ]),
    );
  }
  // The threshold, and the path of stones leading to it from the island's heart.
  lines.push(g([box, placement([0, 0.06, 0], [0, 0, 0], [GATE.half * 2 - GATE.post, 0.04, 0.16])]));
  const steps = 9;
  for (let k = 1; k <= steps; k++) {
    const z = k * 3.1;
    stone.push(g([box, placement([(rand() - 0.5) * 0.6, 0.15, z], [0, (rand() - 0.5) * 0.25, 0], [3.2, 0.3, 2.2])]));
    if (k % 2 === 0) lines.push(g([box, placement([1.75, 0.32, z], [0, 0, 0], [0.06, 0.04, 1.6])]));
  }
  // Fallen and unplaced blocks beside the gate: the work is still going on.
  for (const [x, z, s] of [
    [-10, 3, 1.6],
    [-12.5, -1.5, 1.2],
    [9.5, 4.5, 1.4],
    [11, 0.5, 1],
    [-8, 7, 0.9],
  ])
    stone.push(g([box, placement([x, s * 0.45, z], [rand() * 0.3, rand() * 3, rand() * 0.25], [s * 1.6, s * 0.9, s * 1.1])]));

  const result: HorizonGeometry = { stone: mergeParts(stone), lines: mergeParts(lines), floating: mergeParts(floating) };
  temporary.forEach((x) => x.dispose());
  return result;
}

/** Triangles drawn by a geometry. */
export const triangleCount = (geometry: BufferGeometry): number => (geometry.index ? geometry.index.count : geometry.getAttribute('position').count) / 3;
