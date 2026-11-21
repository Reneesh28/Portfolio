import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { darkStoneMaterial, stoneMaterial, unitBox } from '../void/materials';
import { ORBIT_FRAGMENTS, ORBIT_SPEED, polar, SENTINEL_BASE_Y, SENTINEL_RADIUS, SENTINELS } from './forgeLayout';

const DEG = Math.PI / 180;

interface ForgeOrbitProps {
  /** How many of the orbit fragments to show (low-power tier shows fewer). */
  fragments: number;
  /** False under reduced motion: the fragments hold still. */
  animate: boolean;
}

/** Four obelisk sentinels standing on the terraces: tapered shaft, base block, capstone. */
function Sentinels() {
  return (
    <group>
      {SENTINELS.map(({ angle, height }) => {
        const x = Math.cos(angle) * SENTINEL_RADIUS;
        const z = Math.sin(angle) * SENTINEL_RADIUS;
        return (
          <group key={angle} position={[x, SENTINEL_BASE_Y, z]}>
            <mesh material={darkStoneMaterial} position={[0, height / 2, 0]}>
              <cylinderGeometry args={[0.4, 2.2, height, 4]} />
            </mesh>
            <mesh geometry={unitBox} material={stoneMaterial} position={[0, -0.2, 0]} rotation={[0, Math.PI / 4, 0]} scale={[3.1, 2.6, 3.1]} />
            <mesh material={stoneMaterial} position={[0, height + 0.55, 0]}>
              <cylinderGeometry args={[0, 0.5, 1.1, 4]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/**
 * Orbit: the sentinels, and a few worked-stone fragments circling the crown very
 * slowly (DEC-007: at most five, one material and one cut-block language).
 */
export default function ForgeOrbit({ fragments, animate }: ForgeOrbitProps) {
  const ring = useRef<Group>(null);
  const pieces = useRef<Array<Group | null>>([]);
  const shown = useMemo(() => ORBIT_FRAGMENTS.slice(0, fragments), [fragments]);

  useFrame((_, delta) => {
    if (!animate || !ring.current) return;
    const step = Math.min(delta, 0.1);
    ring.current.rotation.y += step * ORBIT_SPEED;
    pieces.current.forEach((piece, i) => {
      if (!piece) return;
      piece.rotation.x += step * (0.03 + i * 0.008);
      piece.rotation.y += step * (0.05 - i * 0.006);
    });
  });

  return (
    <group>
      <Sentinels />
      <group ref={ring}>
        {shown.map((f, i) => {
          const [x, z] = polar(f.bearing, f.distance);
          return (
            <group
              key={f.bearing}
              ref={(node) => {
                pieces.current[i] = node;
              }}
              position={[x, f.y, z]}
              rotation={[f.tilt[0], f.tilt[1] + f.bearing * DEG, f.tilt[2]]}
            >
              <mesh geometry={unitBox} material={stoneMaterial} scale={f.size} />
            </group>
          );
        })}
      </group>
    </group>
  );
}
