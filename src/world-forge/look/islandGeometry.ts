import { BufferGeometry, ConeGeometry, CylinderGeometry, Matrix4 } from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * Procedural floating-island geometry (blueprint look): a rugged rocky slab on top,
 * and a jagged inverted cone of rock hanging beneath it, with stalactite shards.
 * Displacement depends only on position (never on vertex order), so the duplicated
 * seam vertices of the cylinder and cone stay welded: no cracks.
 */
export interface IslandShape {
  /** Top radius (m) and slab thickness. */
  radius: number;
  thickness: number;
  /** Depth of the rock hanging below the slab. */
  depth: number;
  /** Outline irregularity (0–0.4) and rock jaggedness (0–1). */
  irregularity: number;
  jagged: number;
  shards: number;
}

/** Deterministic hash noise in [-0.5, 0.5] from an angle and a height. */
function hash(angle: number, y: number, salt: number): number {
  const a = Math.round(angle * 1000) / 1000;
  const v = Math.sin(a * 12.9898 + Math.round(y * 100) * 0.78233 + salt * 3.17) * 43758.5453;
  return v - Math.floor(v) - 0.5;
}

/** Smooth outline wobble around the island: a few low-frequency sine terms with seeded phases. */
function outline(rand: () => number, irregularity: number): (angle: number) => number {
  const terms = Array.from({ length: 4 }, (_, i) => ({ k: i + 2, phase: rand() * Math.PI * 2, amp: (irregularity * (0.5 + rand() * 0.5)) / (i + 1) }));
  return (a) => 1 + terms.reduce((sum, t) => sum + Math.sin(a * t.k + t.phase) * t.amp, 0);
}

export function createIslandGeometry(shape: IslandShape, rand: () => number): { top: BufferGeometry; rock: BufferGeometry } {
  const wobble = outline(rand, shape.irregularity);
  const salt = rand() * 100;
  const segments = 36;

  // Top slab: outline wobble plus rugged cliff faces on the sides; the top surface stays walkable.
  const top = new CylinderGeometry(shape.radius, shape.radius * 0.9, shape.thickness, segments, 3);
  const tp = top.getAttribute('position');
  for (let i = 0; i < tp.count; i++) {
    const x = tp.getX(i);
    const z = tp.getZ(i);
    const y = tp.getY(i);
    const r = Math.hypot(x, z);
    if (r < 1e-6) continue;
    const a = Math.atan2(x, z);
    const isTopRim = y > shape.thickness / 2 - 1e-6;
    const cliff = isTopRim ? 0 : hash(a, y, salt) * 0.14 * shape.jagged;
    const f = wobble(a) * (1 + cliff);
    tp.setXYZ(i, x * f, y + (isTopRim ? hash(a, 0, salt + 1) * shape.thickness * 0.12 : 0), z * f);
  }
  top.translate(0, -shape.thickness / 2, 0);

  // Hanging rock: outline-matched at the top, increasingly jagged toward the tip.
  const cone = new ConeGeometry(shape.radius * 0.9, shape.depth, segments, 9);
  cone.applyMatrix4(new Matrix4().makeRotationX(Math.PI));
  cone.translate(0, -shape.thickness - shape.depth / 2, 0);
  const cp = cone.getAttribute('position');
  for (let i = 0; i < cp.count; i++) {
    const x = cp.getX(i);
    const z = cp.getZ(i);
    const y = cp.getY(i);
    const r = Math.hypot(x, z);
    if (r < 1e-6) continue; // the tip stays welded
    const a = Math.atan2(x, z);
    const t = Math.min(1, Math.max(0, (-shape.thickness - y) / shape.depth)); // 0 at the slab, 1 at the tip
    const f = wobble(a) * (1 + hash(a, y, salt + 2) * shape.jagged * (0.25 + 0.9 * t));
    cp.setXYZ(i, x * f, y + hash(a, y, salt + 3) * shape.jagged * shape.depth * 0.05 * t, z * f);
  }

  // Stalactite shards under the cone.
  const parts: BufferGeometry[] = [cone.toNonIndexed()];
  for (let s = 0; s < shape.shards; s++) {
    const a = rand() * Math.PI * 2;
    const d = Math.sqrt(rand()) * shape.radius * 0.6;
    const len = shape.depth * (0.3 + rand() * 0.5);
    const shard = new ConeGeometry(shape.radius * (0.07 + rand() * 0.12), len, 5, 1);
    shard.applyMatrix4(new Matrix4().makeRotationX(Math.PI));
    shard.applyMatrix4(new Matrix4().makeRotationY(rand() * Math.PI));
    const hang = -shape.thickness - shape.depth * (0.3 + (1 - d / shape.radius) * 0.45);
    shard.translate(Math.sin(a) * d, hang - len / 2, Math.cos(a) * d);
    parts.push(shard.toNonIndexed());
    shard.dispose();
  }
  const rock = mergeGeometries(
    parts.map((g) => {
      g.deleteAttribute('uv');
      return g;
    }),
  );
  parts.forEach((g) => g.dispose());
  cone.dispose();
  top.computeVertexNormals();
  rock.computeVertexNormals();
  return { top, rock };
}
