import { forgeCoreMaterial, stoneMaterial } from '../void/materials';
import { CROWN } from './forgeLayout';

/** Crown: the ring above the pillars, catching the core's light. */
export default function ForgeCrown() {
  return (
    <group position={[0, CROWN.y, 0]} rotation={[CROWN.tilt, 0, 0]}>
      <mesh material={stoneMaterial}>
        <torusGeometry args={[CROWN.radius, CROWN.tube, 6, 32]} />
      </mesh>
      <mesh material={forgeCoreMaterial}>
        <torusGeometry args={[CROWN.radius, CROWN.filamentTube, 4, 48]} />
      </mesh>
    </group>
  );
}
