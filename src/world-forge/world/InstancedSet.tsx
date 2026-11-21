import { useLayoutEffect, useRef } from 'react';
import { Euler, Matrix4, Quaternion, Vector3, type BufferGeometry, type InstancedMesh, type Material } from 'three';
import type { Vec3 } from '../data/worldGeography';

export interface InstancePlacement {
  position: Vec3;
  rotation?: Vec3;
  scale: Vec3;
}

interface InstancedSetProps {
  geometry: BufferGeometry;
  material: Material;
  items: readonly InstancePlacement[];
}

/** Many copies of one mesh in a single draw call. Matrices are written once per change. */
export default function InstancedSet({ geometry, material, items }: InstancedSetProps) {
  const ref = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const matrix = new Matrix4();
    const quaternion = new Quaternion();
    const euler = new Euler();
    const position = new Vector3();
    const scale = new Vector3();
    items.forEach((item, i) => {
      euler.set(...(item.rotation ?? [0, 0, 0]));
      quaternion.setFromEuler(euler);
      matrix.compose(position.set(...item.position), quaternion, scale.set(...item.scale));
      mesh.setMatrixAt(i, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [items]);

  if (items.length === 0) return null;
  // `key` forces a new mesh when the instance count changes (InstancedMesh capacity is fixed).
  return <instancedMesh key={items.length} ref={ref} args={[geometry, material, items.length]} />;
}
