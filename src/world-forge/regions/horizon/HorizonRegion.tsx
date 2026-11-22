import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, MeshBasicMaterial, MeshStandardMaterial, type Group } from 'three';
import { BLUEPRINT } from '../../look/palette';
import { buildHorizon } from './horizonGeometry';
import { HORIZON_ANCHOR, HORIZON_YAW } from './horizonLayout';

const GOLD = BLUEPRINT.region.horizon;

/**
 * 06 — THE HORIZON (M8 "The Unfinished Gate", DEC-034). The farthest island faces the
 * brightest part of the sky. On its edge stands a great gate that isn't finished: its arch stops
 * short, and its last stones hang in the air, waiting to be set. The Forge glows far behind.
 * A quiet ending: the hanging stones drift very slightly (not at all under reduced motion).
 *
 * Rendering: stone, gold lines and the hanging stones (3 draws).
 */
export default function HorizonRegion({ animate }: { animate: boolean }) {
  const built = useMemo(() => buildHorizon(), []);
  useEffect(
    () => () => {
      built.stone.dispose();
      built.lines.dispose();
      built.floating.dispose();
    },
    [built],
  );
  const materials = useMemo(
    () => ({
      stone: new MeshStandardMaterial({ color: '#c9bfa6', roughness: 0.88, metalness: 0.05, flatShading: true, emissive: new Color('#3d3424'), emissiveIntensity: 0.8 }),
      lines: new MeshBasicMaterial({ color: new Color(GOLD).multiplyScalar(1.6), toneMapped: false }),
      floating: new MeshStandardMaterial({ color: '#e6d6ad', roughness: 0.7, metalness: 0.1, flatShading: true, emissive: new Color(GOLD), emissiveIntensity: 0.35 }),
    }),
    [],
  );
  useEffect(
    () => () => {
      materials.stone.dispose();
      materials.lines.dispose();
      materials.floating.dispose();
    },
    [materials],
  );

  const floatingRef = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!animate || !floatingRef.current) return;
    floatingRef.current.position.y = Math.sin(clock.elapsedTime * 0.4) * 0.25;
  });

  return (
    <group position={HORIZON_ANCHOR} rotation={[0, HORIZON_YAW, 0]}>
      <mesh geometry={built.stone} material={materials.stone} />
      <mesh geometry={built.lines} material={materials.lines} />
      <group ref={floatingRef}>
        <mesh geometry={built.floating} material={materials.floating} />
      </group>
    </group>
  );
}
