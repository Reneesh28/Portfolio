import { darkStoneMaterial, stoneMaterial } from '../void/materials';
import { OCTAGON_SIDES, TIERS } from './forgeLayout';

/** Foundation: the three octagonal tiers of the approved silhouette. */
export default function ForgeFoundation() {
  return (
    <group>
      {TIERS.map((tier, i) => (
        <mesh key={tier.name} material={i === 2 ? stoneMaterial : darkStoneMaterial} position={[0, (tier.bottom + tier.top) / 2, 0]}>
          <cylinderGeometry args={[tier.topRadius, tier.bottomRadius, tier.top - tier.bottom, OCTAGON_SIDES]} />
        </mesh>
      ))}
    </group>
  );
}
