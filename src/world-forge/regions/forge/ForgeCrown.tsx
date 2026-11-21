import { useMemo } from 'react';
import { Euler, Quaternion, Vector3 } from 'three';
import InstancedSet, { type InstancePlacement } from '../../world/InstancedSet';
import { darkStoneMaterial, stoneMaterial, unitBox, unitShard } from '../void/materials';
import { CORE, CROWN } from './forgeLayout';
import { crownFilamentMaterial } from './forgeMaterials';

const TURN = Math.PI * 2;

/** World position of a point on the crown ring at in-ring angle `angle` (radians). */
function ringPoint(angle: number, radius: number = CROWN.radius): Vector3 {
  return new Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0)
    .applyEuler(new Euler(CROWN.tilt, 0, 0))
    .add(new Vector3(0, CROWN.y, 0));
}

/** World position of a pillar's top (same transform as the pillar group in ForgeCore). */
function pillarTop(angle: number): Vector3 {
  return new Vector3(0, CORE.pillarHeight / 2 - 0.4, 0)
    .applyEuler(new Euler(Math.sin(angle) * CORE.lean, angle, -Math.cos(angle) * CORE.lean))
    .add(new Vector3(Math.cos(angle) * CORE.pillarRadius, CORE.pillarCentreY, Math.sin(angle) * CORE.pillarRadius));
}

/**
 * Crown: a segmented stone halo carried on the three pillar tips, with a thin amber
 * filament running through the gaps. Static (DEC-007): it is unfinished, not spinning.
 */
export default function ForgeCrown() {
  // Broken stone at both ends of every segment.
  const ends = useMemo<InstancePlacement[]>(
    () =>
      CROWN.segments.flatMap(([start, length], i) =>
        [start, start + length].map((fraction, j) => {
          const angle = fraction * TURN;
          return {
            position: [Math.cos(angle) * CROWN.radius, Math.sin(angle) * CROWN.radius, 0],
            rotation: [i * 0.7 + j, angle, i * 0.4],
            scale: [0.62, 0.62, 0.7],
          };
        }),
      ),
    [],
  );

  // Struts from each pillar top out to the halo.
  const struts = useMemo<InstancePlacement[]>(
    () =>
      CORE.pillarAngles.map((angle) => {
        const from = pillarTop(angle);
        const to = ringPoint(angle, CROWN.radius - CROWN.tube * 0.6);
        const mid = from.clone().add(to).multiplyScalar(0.5);
        const dir = to.clone().sub(from);
        const length = dir.length();
        // The box's long axis (local Z) points from the pillar top to the ring.
        const turn = new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), dir.normalize());
        const { x, y, z } = new Euler().setFromQuaternion(turn, 'XYZ');
        return { position: mid.toArray(), rotation: [x, y, z], scale: [0.55, 0.45, length] };
      }),
    [],
  );

  return (
    <group>
      <group position={[0, CROWN.y, 0]} rotation={[CROWN.tilt, 0, 0]}>
        {CROWN.segments.map(([start, length]) => (
          <mesh key={start} material={stoneMaterial} rotation={[0, 0, start * TURN]}>
            <torusGeometry args={[CROWN.radius, CROWN.tube, 6, Math.max(3, Math.round(length * 48)), length * TURN]} />
          </mesh>
        ))}
        <InstancedSet geometry={unitShard} material={stoneMaterial} items={ends} />
        <mesh material={crownFilamentMaterial}>
          <torusGeometry args={[CROWN.filamentRadius, CROWN.filamentTube, 4, 64]} />
        </mesh>
      </group>
      <InstancedSet geometry={unitBox} material={darkStoneMaterial} items={struts} />
    </group>
  );
}
