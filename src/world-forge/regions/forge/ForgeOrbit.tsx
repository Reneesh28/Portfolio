import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CylinderGeometry, type Group, type BufferGeometry } from 'three';
import { darkStoneMaterial, stoneMaterial, unitBox } from '../void/materials';
import { ORBIT_FRAGMENTS, ORBIT_SPEED, polar, SENTINEL_BASE_Y, SENTINEL_RADIUS, SENTINELS } from './forgeLayout';
import { mergeParts, placement, useMergedGeometry, type Part, type StaticBuild } from './mergeStatic';

const DEG = Math.PI / 180;

interface ForgeOrbitProps {
  /** How many of the orbit fragments to show (low-power tier shows fewer). */
  fragments: number;
  /** False under reduced motion: the fragments hold still. */
  animate: boolean;
}

const sentinelAt = (angle: number) => [Math.cos(angle) * SENTINEL_RADIUS, SENTINEL_BASE_Y, Math.sin(angle) * SENTINEL_RADIUS] as const;

/** Sentinel shafts: one dark-stone draw. */
function buildSentinelShafts(): StaticBuild {
  const parts: Part[] = [];
  const temporary: BufferGeometry[] = [];
  for (const { angle, height } of SENTINELS) {
    const shaft = new CylinderGeometry(0.4, 2.2, height, 4);
    temporary.push(shaft);
    const [x, y, z] = sentinelAt(angle);
    parts.push([shaft, placement([x, y + height / 2, z])]);
  }
  return { parts, temporary };
}

/** Sentinel base blocks (deepened into the T2 slope) and capstones: one stone draw. */
function buildSentinelStone(): StaticBuild {
  const cap = new CylinderGeometry(0, 0.5, 1.1, 4);
  const parts: Part[] = [];
  for (const { angle, height } of SENTINELS) {
    const [x, y, z] = sentinelAt(angle);
    parts.push([unitBox, placement([x, y - 0.2, z], [0, Math.PI / 4, 0], [3.1, 2.6, 3.1])]);
    parts.push([cap, placement([x, y + height + 0.55, z])]);
  }
  return { parts, temporary: [cap] };
}

/**
 * Orbit: four obelisk sentinels, and a few worked-stone fragments circling the
 * crown very slowly (DEC-007: at most five, one material and one cut-block language).
 */
export default function ForgeOrbit({ fragments, animate }: ForgeOrbitProps) {
  const ring = useRef<Group>(null);
  const shafts = useMergedGeometry(buildSentinelShafts);
  const stone = useMergedGeometry(buildSentinelStone);
  // The fragments are one geometry turning with the ring (one draw, rebuilt only if the tier changes).
  const orbit = useMemo(
    () =>
      mergeParts(
        ORBIT_FRAGMENTS.slice(0, fragments).map((f): Part => {
          const [x, z] = polar(f.bearing, f.distance);
          return [unitBox, placement([x, f.y, z], [f.tilt[0], f.tilt[1] + f.bearing * DEG, f.tilt[2]], f.size)];
        }),
      ),
    [fragments],
  );
  useEffect(() => () => orbit.dispose(), [orbit]);

  useFrame((_, delta) => {
    if (animate && ring.current) ring.current.rotation.y += Math.min(delta, 0.1) * ORBIT_SPEED;
  });

  return (
    <group>
      <mesh geometry={shafts} material={darkStoneMaterial} />
      <mesh geometry={stone} material={stoneMaterial} />
      <group ref={ring}>
        <mesh geometry={orbit} material={stoneMaterial} />
      </group>
    </group>
  );
}
