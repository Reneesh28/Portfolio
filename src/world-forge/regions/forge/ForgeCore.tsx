import { darkStoneMaterial, forgeBeamMaterial, forgeCoreMaterial, stoneMaterial, unitBox, unitShard } from '../void/materials';
import { BEAM, CORE, CRUCIBLE, pillarRadiusAt, PILLAR_BANDS } from './forgeLayout';

/** One fractured pillar: tapered shaft, bracing bands, a broken crown shard and a foot block on the dais. */
function Pillar({ angle }: { angle: number }) {
  const half = CORE.pillarHeight / 2;
  // Foot block, in the pillar's frame: its top sits only 0.5 above the dais, so the seam's
  // glowing foot stays visible from the Void.
  const footHeight = 2;
  const footY = CRUCIBLE.daisTop + 0.5 - footHeight / 2 - CORE.pillarCentreY;
  return (
    <group
      position={[Math.cos(angle) * CORE.pillarRadius, CORE.pillarCentreY, Math.sin(angle) * CORE.pillarRadius]}
      rotation={[Math.sin(angle) * CORE.lean, angle, -Math.cos(angle) * CORE.lean]}
    >
      <mesh material={stoneMaterial}>
        <cylinderGeometry args={[CORE.pillarTopRadius, CORE.pillarBottomRadius, CORE.pillarHeight, 4]} />
      </mesh>
      {PILLAR_BANDS.map((y) => {
        const r = pillarRadiusAt(y) + 0.2;
        return (
          <mesh key={y} material={darkStoneMaterial} position={[0, y, 0]}>
            <cylinderGeometry args={[r - 0.02, r + 0.02, 0.8, 4]} />
          </mesh>
        );
      })}
      {/* Broken top: a split shard leaning off the shaft, so the pillar reads as fractured, not pointed. */}
      <mesh geometry={unitShard} material={stoneMaterial} position={[0.25, half + 0.5, 0.1]} rotation={[0.2, 0.6, 0.32]} scale={[0.75, 1.7, 0.6]} />
      <mesh geometry={unitBox} material={darkStoneMaterial} position={[0, footY, 0]} rotation={[0, Math.PI / 4, 0]} scale={[4.9, footHeight, 4.9]} />
    </group>
  );
}

/** Core: three leaning fractured pillars around the molten seam, the crucible at its foot, and the light column above. */
export default function ForgeCore() {
  return (
    <group>
      {CORE.pillarAngles.map((angle) => (
        <Pillar key={angle} angle={angle} />
      ))}
      {/* The crucible: a low octagonal basin the seam rises from. */}
      <mesh material={darkStoneMaterial} position={[0, CRUCIBLE.daisTop + CRUCIBLE.height / 2, 0]}>
        <cylinderGeometry args={[CRUCIBLE.topRadius, CRUCIBLE.bottomRadius, CRUCIBLE.height, 8]} />
      </mesh>
      <mesh material={forgeCoreMaterial} position={[0, (CORE.seamBottom + CORE.seamTop) / 2, 0]}>
        <cylinderGeometry args={[1.1, 1.5, CORE.seamTop - CORE.seamBottom, 8]} />
      </mesh>
      <mesh material={forgeBeamMaterial} position={[0, BEAM.y, 0]}>
        <cylinderGeometry args={[BEAM.topRadius, BEAM.bottomRadius, BEAM.height, 12, 1, true]} />
      </mesh>
    </group>
  );
}
