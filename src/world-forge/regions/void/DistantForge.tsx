import { darkStoneMaterial, forgeBeamMaterial, forgeCoreMaterial, stoneMaterial } from './materials';

interface DistantForgeProps {
  position: [number, number, number];
  /** Orientation about Y (keeps the approved opening-shot view of the silhouette). */
  rotationY?: number;
}

const CORE_PILLARS = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
const FLANK_TOWERS: Array<{ angle: number; height: number }> = [
  { angle: 0.5, height: 18 },
  { angle: 2.1, height: 14 },
  { angle: 3.6, height: 20 },
  { angle: 5.0, height: 15 },
];

/**
 * Placeholder silhouette of the World Forge, seen from far away: a terraced
 * foundation, three fractured pillars around a burning core, a crown ring,
 * and flanking towers. Detailed construction belongs to M4.
 */
export default function DistantForge({ position, rotationY = 0 }: DistantForgeProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Terraced foundation */}
      <mesh material={darkStoneMaterial} position={[0, 3, 0]}>
        <cylinderGeometry args={[26, 32, 6, 8]} />
      </mesh>
      <mesh material={darkStoneMaterial} position={[0, 8.5, 0]}>
        <cylinderGeometry args={[17, 20, 5, 8]} />
      </mesh>
      <mesh material={stoneMaterial} position={[0, 13.5, 0]}>
        <cylinderGeometry args={[11, 13.5, 5, 8]} />
      </mesh>

      {/* Fractured core: three leaning pillars around a vertical shaft of light */}
      {CORE_PILLARS.map((angle) => (
        <mesh
          key={angle}
          material={stoneMaterial}
          position={[Math.cos(angle) * 3.4, 31, Math.sin(angle) * 3.4]}
          rotation={[Math.sin(angle) * 0.05, angle, -Math.cos(angle) * 0.05]}
        >
          <cylinderGeometry args={[0.7, 3, 34, 4]} />
        </mesh>
      ))}
      <mesh material={forgeCoreMaterial} position={[0, 29, 0]}>
        <cylinderGeometry args={[1.1, 1.5, 26, 8]} />
      </mesh>

      {/* Crown ring */}
      <mesh material={stoneMaterial} position={[0, 45, 0]} rotation={[Math.PI / 2 - 0.08, 0, 0]}>
        <torusGeometry args={[8.5, 0.55, 6, 32]} />
      </mesh>
      <mesh material={forgeCoreMaterial} position={[0, 45, 0]} rotation={[Math.PI / 2 - 0.08, 0, 0]}>
        <torusGeometry args={[8.5, 0.09, 4, 48]} />
      </mesh>

      {/* Flanking towers on the terraces */}
      {FLANK_TOWERS.map(({ angle, height }) => (
        <mesh key={angle} material={darkStoneMaterial} position={[Math.cos(angle) * 15, 11 + height / 2, Math.sin(angle) * 15]}>
          <cylinderGeometry args={[0.4, 2.2, height, 4]} />
        </mesh>
      ))}

      {/* Faint column of light rising from the core */}
      <mesh material={forgeBeamMaterial} position={[0, 105, 0]}>
        <cylinderGeometry args={[0.5, 1.4, 120, 12, 1, true]} />
      </mesh>
    </group>
  );
}
