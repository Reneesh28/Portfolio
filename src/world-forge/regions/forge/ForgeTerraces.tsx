import { useMemo } from 'react';
import { darkStoneMaterial, stoneMaterial, unitBox } from '../void/materials';
import InstancedSet, { type InstancePlacement } from '../../world/InstancedSet';
import { ALL_FLIGHTS, flightSteps, MONUMENT_RING, PLINTH_SITES } from './forgeLayout';

const DEG = Math.PI / 180;

/** Terraces: stair flights and the reserved monument plinth sites. */
export default function ForgeTerraces() {
  const steps = useMemo<InstancePlacement[]>(
    () =>
      ALL_FLIGHTS.flatMap(flightSteps).map((step) => ({
        position: step.position,
        rotation: [0, step.bearing * DEG, 0],
        scale: step.size,
      })),
    [],
  );

  const plinths = useMemo<InstancePlacement[]>(
    () =>
      PLINTH_SITES.map((site) => {
        const [w, h, d] = MONUMENT_RING.plinthSize;
        return { position: [site.position[0], site.position[1] + h / 2, site.position[2]], rotation: [0, site.bearing * DEG, 0], scale: [w, h, d] };
      }),
    [],
  );

  return (
    <group>
      <InstancedSet geometry={unitBox} material={darkStoneMaterial} items={steps} />
      <InstancedSet geometry={unitBox} material={stoneMaterial} items={plinths} />
    </group>
  );
}
