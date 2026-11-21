import { useMemo } from 'react';
import { createRandom } from '../../core/random';
import InstancedSet, { type InstancePlacement } from '../../world/InstancedSet';
import { darkStoneMaterial, stoneMaterial, unitBox, unitRock } from '../void/materials';
import { buttresses, CORNICE, OCTAGON_SIDES, polar, rubbleSkirt, TIER_SEAMS, TIERS } from './forgeLayout';
import { forgeMidStoneMaterial, forgeSeamMaterial } from './forgeMaterials';

const DEG = Math.PI / 180;

/** Foundation: three octagonal cut-stone tiers with cornices and amber seams, stepped buttresses and a rubble skirt. */
export default function ForgeFoundation() {
  const buttressItems = useMemo<InstancePlacement[]>(
    () =>
      buttresses().map((b) => {
        const [x, z] = polar(b.bearing, b.distance);
        return { position: [x, b.y, z], rotation: [0, b.bearing * DEG, 0], scale: b.size };
      }),
    [],
  );
  const rubble = useMemo<InstancePlacement[]>(() => rubbleSkirt(createRandom(211)), []);

  return (
    <group>
      {TIERS.map((tier, i) => (
        <group key={tier.name}>
          <mesh material={[darkStoneMaterial, forgeMidStoneMaterial, stoneMaterial][i]} position={[0, (tier.bottom + tier.top) / 2, 0]}>
            <cylinderGeometry args={[tier.topRadius, tier.bottomRadius, tier.top - tier.bottom, OCTAGON_SIDES]} />
          </mesh>
          {/* Cornice: the lighter cut-stone lip that defines each tier edge. It caps the tier
              (a hair above its top face, so the two surfaces never fight for depth). */}
          <mesh material={stoneMaterial} position={[0, tier.top - CORNICE.height / 2 + CORNICE.lift, 0]}>
            <cylinderGeometry
              args={[tier.topRadius + CORNICE.overhang, tier.topRadius + CORNICE.overhang, CORNICE.height, OCTAGON_SIDES]}
            />
          </mesh>
        </group>
      ))}
      {/* Amber seams where each tier meets the one above: the core's light carried into the stone. */}
      {TIER_SEAMS.map((seam) => (
        <mesh key={seam.y} material={forgeSeamMaterial} position={[0, seam.y, 0]}>
          <cylinderGeometry args={[seam.radius - 0.02, seam.radius, seam.height, OCTAGON_SIDES, 1, true]} />
        </mesh>
      ))}
      <InstancedSet geometry={unitBox} material={darkStoneMaterial} items={buttressItems} />
      <InstancedSet geometry={unitRock} material={darkStoneMaterial} items={rubble} />
    </group>
  );
}
