import { useEffect, useMemo } from 'react';
import { CatmullRomCurve3, Color, Matrix4, MeshBasicMaterial, TubeGeometry, Vector3 } from 'three';
import { HORIZON_BEYOND, ISLANDS, WORLD_ROUTES } from '../data/worldGeography';
import FloatingIsland from '../look/FloatingIsland';
import { BLUEPRINT } from '../look/palette';
import { mergeParts, type Part } from '../core/mergeStatic';
import RegionLandmarks from './RegionLandmarks';

/** Golden routes (blueprint): every spoke and link baked into one glowing draw. */
function GoldenRoutes() {
  const geometry = useMemo(() => {
    const tubes = WORLD_ROUTES.map((route) => {
      const a = new Vector3(...route.from);
      const b = new Vector3(...route.to);
      const mid = a.clone().lerp(b, 0.5).add(new Vector3(0, route.lift, 0));
      return new TubeGeometry(new CatmullRomCurve3([a, mid, b]), 48, route.kind === 'spoke' ? 0.45 : 0.3, 6, false);
    });
    const merged = mergeParts(tubes.map((g): Part => [g, new Matrix4()]));
    tubes.forEach((t) => t.dispose());
    return merged;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const material = useMemo(() => new MeshBasicMaterial({ color: new Color(BLUEPRINT.gold.accent).multiplyScalar(1.6), toneMapped: false }), []);
  useEffect(() => () => material.dispose(), [material]);
  return <mesh geometry={geometry} material={material} />;
}

/**
 * The archipelago (P2): every island from the geography, the regions' landmark
 * blockouts, the golden routes and the fragments drifting beyond the Horizon.
 */
export default function Archipelago() {
  return (
    <group>
      {ISLANDS.map((island) => (
        <FloatingIsland key={island.id} position={island.position} shape={island} seed={island.seed} topColor={island.top} />
      ))}
      {HORIZON_BEYOND.map((position, i) => (
        <FloatingIsland
          key={`beyond-${i}`}
          position={position}
          shape={{ radius: 12 - i * 2, thickness: 4, depth: 26 - i * 4, irregularity: 0.3, jagged: 1, shards: 2 }}
          seed={80 + i}
          topColor="#4d4560"
        />
      ))}
      <GoldenRoutes />
      <RegionLandmarks />
    </group>
  );
}
