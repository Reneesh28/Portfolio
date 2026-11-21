import { forgeBeamMaterial, forgeCoreMaterial, stoneMaterial } from '../void/materials';
import { BEAM, CORE } from './forgeLayout';

/** Core: three leaning fractured pillars around the molten seam, and the light column above. */
export default function ForgeCore() {
  return (
    <group>
      {CORE.pillarAngles.map((angle) => (
        <mesh
          key={angle}
          material={stoneMaterial}
          position={[Math.cos(angle) * CORE.pillarRadius, CORE.pillarCentreY, Math.sin(angle) * CORE.pillarRadius]}
          rotation={[Math.sin(angle) * CORE.lean, angle, -Math.cos(angle) * CORE.lean]}
        >
          <cylinderGeometry args={[CORE.pillarTopRadius, CORE.pillarBottomRadius, CORE.pillarHeight, 4]} />
        </mesh>
      ))}
      <mesh material={forgeCoreMaterial} position={[0, (CORE.seamBottom + CORE.seamTop) / 2, 0]}>
        <cylinderGeometry args={[1.1, 1.5, CORE.seamTop - CORE.seamBottom, 8]} />
      </mesh>
      <mesh material={forgeBeamMaterial} position={[0, BEAM.y, 0]}>
        <cylinderGeometry args={[BEAM.topRadius, BEAM.bottomRadius, BEAM.height, 12, 1, true]} />
      </mesh>
    </group>
  );
}
