import { useEffect, useMemo } from 'react';
import { CylinderGeometry, type Matrix4, type BufferGeometry } from 'three';
import { darkStoneMaterial, forgeBeamMaterial, stoneMaterial, unitBox, unitShard } from '../void/materials';
import { BEAM, CORE, CRUCIBLE, pillarRadiusAt, PILLAR_BANDS, SEAM } from './forgeLayout';
import { forgeSeamCoreMaterial, SEAM_COOL, SEAM_HOT } from './forgeMaterials';
import { placement, useMergedGeometry, type Part, type StaticBuild } from './mergeStatic';
import { createGradientCylinder } from './seamGeometry';

/** Each pillar's frame: approved placement, inward lean. */
const pillarFrame = (angle: number): Matrix4 =>
  placement(
    [Math.cos(angle) * CORE.pillarRadius, CORE.pillarCentreY, Math.sin(angle) * CORE.pillarRadius],
    [Math.sin(angle) * CORE.lean, angle, -Math.cos(angle) * CORE.lean],
  );
const inPillar = (angle: number, local: Matrix4): Matrix4 => pillarFrame(angle).multiply(local);

// Foot block, in the pillar's frame: its top sits only 0.5 above the dais, so the seam's
// glowing foot stays visible from the Void.
const FOOT_HEIGHT = 2;
const FOOT_Y = CRUCIBLE.daisTop + 0.5 - FOOT_HEIGHT / 2 - CORE.pillarCentreY;

/** Pillar shafts and their broken top shards (split off the shaft, so they read as fractured). */
function buildPillarStone(): StaticBuild {
  const shaft = new CylinderGeometry(CORE.pillarTopRadius, CORE.pillarBottomRadius, CORE.pillarHeight, 4);
  const parts: Part[] = [];
  for (const angle of CORE.pillarAngles) {
    parts.push([shaft, pillarFrame(angle)]);
    parts.push([unitShard, inPillar(angle, placement([0.25, CORE.pillarHeight / 2 + 0.5, 0.1], [0.2, 0.6, 0.32], [0.75, 1.7, 0.6]))]);
  }
  return { parts, temporary: [shaft] };
}

/** Bracing bands, foot blocks and the crucible basin the seam rises from. */
function buildPillarDark(): StaticBuild {
  const parts: Part[] = [];
  const temporary: BufferGeometry[] = [];
  for (const y of PILLAR_BANDS) {
    const r = pillarRadiusAt(y) + 0.2;
    const band = new CylinderGeometry(r - 0.02, r + 0.02, 0.8, 4);
    temporary.push(band);
    for (const angle of CORE.pillarAngles) parts.push([band, inPillar(angle, placement([0, y, 0]))]);
  }
  for (const angle of CORE.pillarAngles) {
    parts.push([unitBox, inPillar(angle, placement([0, FOOT_Y, 0], [0, Math.PI / 4, 0], [4.9, FOOT_HEIGHT, 4.9]))]);
  }
  const crucible = new CylinderGeometry(CRUCIBLE.topRadius, CRUCIBLE.bottomRadius, CRUCIBLE.height, 8);
  temporary.push(crucible);
  parts.push([crucible, placement([0, CRUCIBLE.daisTop + CRUCIBLE.height / 2, 0])]);
  return { parts, temporary };
}

/**
 * Core: three leaning fractured pillars around the molten seam, the crucible at
 * its foot, and the light column above. Stone is baked per material (2 draws).
 */
export default function ForgeCore() {
  const stone = useMergedGeometry(buildPillarStone);
  const dark = useMergedGeometry(buildPillarDark);
  const seam = useMemo(
    () => createGradientCylinder(SEAM.coreTop, SEAM.coreBottom, CORE.seamTop - CORE.seamBottom, 10, SEAM_HOT, SEAM_COOL, false, SEAM.coreCurve),
    [],
  );
  useEffect(() => () => seam.dispose(), [seam]);

  return (
    <group>
      <mesh geometry={stone} material={stoneMaterial} />
      <mesh geometry={dark} material={darkStoneMaterial} />
      {/* The molten seam: white-hot at the crucible, cooling to amber toward the crown. */}
      <mesh geometry={seam} material={forgeSeamCoreMaterial} position={[0, (CORE.seamBottom + CORE.seamTop) / 2, 0]} />
      <mesh material={forgeBeamMaterial} position={[0, BEAM.y, 0]}>
        <cylinderGeometry args={[BEAM.topRadius, BEAM.bottomRadius, BEAM.height, 12, 1, true]} />
      </mesh>
    </group>
  );
}
