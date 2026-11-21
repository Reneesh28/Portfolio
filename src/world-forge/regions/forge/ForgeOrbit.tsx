import { darkStoneMaterial } from '../void/materials';
import { SENTINEL_BASE_Y, SENTINEL_RADIUS, SENTINELS } from './forgeLayout';

/** Orbit: the sentinel towers standing around the core. */
export default function ForgeOrbit() {
  return (
    <group>
      {SENTINELS.map(({ angle, height }) => (
        <mesh
          key={angle}
          material={darkStoneMaterial}
          position={[Math.cos(angle) * SENTINEL_RADIUS, SENTINEL_BASE_Y + height / 2, Math.sin(angle) * SENTINEL_RADIUS]}
        >
          <cylinderGeometry args={[0.4, 2.2, height, 4]} />
        </mesh>
      ))}
    </group>
  );
}
