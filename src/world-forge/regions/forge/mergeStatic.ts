import { useEffect, useMemo } from 'react';
import { BufferGeometry, Euler, Matrix4, Quaternion, Vector3 } from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export type Vec3 = [number, number, number];

/** One static piece: a geometry and the transform that places it. */
export type Part = [BufferGeometry, Matrix4];

/** Transform from position, XYZ Euler rotation and scale (the same convention as InstancedSet). */
export function placement(position: Vec3, rotation: Vec3 = [0, 0, 0], scale: Vec3 = [1, 1, 1]): Matrix4 {
  return new Matrix4().compose(new Vector3(...position), new Quaternion().setFromEuler(new Euler(...rotation)), new Vector3(...scale));
}

/**
 * Bakes static pieces that share a material into one geometry (one draw call).
 * Inputs are left untouched (shared unit geometries stay intact); the stone
 * materials use flat shading, so merged normals need no special handling.
 */
export function mergeParts(parts: readonly Part[]): BufferGeometry {
  const prepared = parts.map(([geometry, matrix]) => {
    const copy = geometry.index ? geometry.toNonIndexed() : geometry.clone();
    // Keep only the attributes every primitive provides, so the merge always lines up.
    for (const name of Object.keys(copy.attributes)) {
      if (name !== 'position' && name !== 'normal' && name !== 'uv') copy.deleteAttribute(name);
    }
    return copy.applyMatrix4(matrix);
  });
  const merged = mergeGeometries(prepared, false);
  prepared.forEach((g) => g.dispose());
  if (!merged) throw new Error('Forge static merge failed: incompatible geometry attributes');
  return merged;
}

/** What a static builder returns: the pieces to bake, and any temporary source geometries to free. */
export interface StaticBuild {
  parts: Part[];
  temporary?: BufferGeometry[];
}

/**
 * Bakes a static builder into one geometry and disposes it on unmount. `build`
 * must be a stable (module-level) function of constant layout data.
 */
export function useMergedGeometry(build: () => StaticBuild): BufferGeometry {
  const geometry = useMemo(() => {
    const { parts, temporary = [] } = build();
    const merged = mergeParts(parts);
    temporary.forEach((g) => g.dispose());
    return merged;
  }, [build]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return geometry;
}
