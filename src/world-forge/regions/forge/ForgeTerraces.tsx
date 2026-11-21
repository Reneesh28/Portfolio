import { useMemo } from 'react';
import { Euler, Quaternion } from 'three';
import { createRandom } from '../../core/random';
import InstancedSet, { type InstancePlacement } from '../../world/InstancedSet';
import { darkStoneMaterial, stoneMaterial, unitBox } from '../void/materials';
import {
  ALL_FLIGHTS,
  connectionEnds,
  FORECOURT,
  flightSteps,
  MONUMENT_RING,
  parapetSegments,
  pavePath,
  PLINTH_SITES,
  polar,
  stairCheeks,
} from './forgeLayout';
import { forgeSeamMaterial } from './forgeMaterials';

const DEG = Math.PI / 180;

/** Yaw about Y then pitch about the turned X axis, expressed as the XYZ Euler that InstancedSet takes. */
function yawPitch(yaw: number, pitch: number): [number, number, number] {
  const q = new Quaternion().setFromEuler(new Euler(pitch, yaw, 0, 'YXZ'));
  const { x, y, z } = new Euler().setFromQuaternion(q, 'XYZ');
  return [x, y, z];
}

/**
 * Terraces: stair flights with cheek walls, the T1 parapet, the reserved monument
 * plinths, the forecourt, and paving that joins the M3 route ends to the stair feet.
 */
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

  const walls = useMemo<InstancePlacement[]>(
    () => [
      ...ALL_FLIGHTS.flatMap(stairCheeks).map((c) => ({ position: c.position, rotation: yawPitch(c.bearing * DEG, c.pitch), scale: c.size })),
      ...parapetSegments().map((w) => ({ position: w.position, rotation: [0, w.bearing * DEG, 0] as [number, number, number], scale: w.size })),
    ],
    [],
  );

  const plinths = useMemo(() => {
    const [w, h, d] = MONUMENT_RING.plinthSize;
    const bases: InstancePlacement[] = [];
    const tops: InstancePlacement[] = [];
    const inlays: InstancePlacement[] = [];
    for (const site of PLINTH_SITES) {
      const [x, y, z] = site.position;
      const rotation: [number, number, number] = [0, site.bearing * DEG, 0];
      bases.push({ position: [x, y + h * 0.3, z], rotation, scale: [w, h * 0.6, d] });
      tops.push({ position: [x, y + h * 0.8, z], rotation, scale: [w * 0.8, h * 0.4, d * 0.8] });
      // Amber inlay along the outward face of the base: the site waits for its monument (M5).
      const [ox, oz] = polar(site.bearing, d / 2 + 0.01);
      inlays.push({ position: [x + ox, y + h * 0.3, z + oz], rotation, scale: [w * 0.7, 0.07, 0.02] });
    }
    return { bases, tops, inlays };
  }, []);

  const paving = useMemo<InstancePlacement[]>(() => {
    const rand = createRandom(307);
    const { sanctum, archive } = connectionEnds();
    return [...pavePath(...sanctum, rand), ...pavePath(...archive, rand)].map((slab) => ({
      position: slab.position,
      rotation: [0, slab.yaw, 0],
      scale: slab.size,
    }));
  }, []);

  const [fx, fz] = polar(FORECOURT.bearing, FORECOURT.distance);

  return (
    <group>
      <InstancedSet geometry={unitBox} material={darkStoneMaterial} items={steps} />
      <InstancedSet geometry={unitBox} material={darkStoneMaterial} items={walls} />
      <InstancedSet geometry={unitBox} material={darkStoneMaterial} items={plinths.bases} />
      <InstancedSet geometry={unitBox} material={stoneMaterial} items={plinths.tops} />
      <InstancedSet geometry={unitBox} material={forgeSeamMaterial} items={plinths.inlays} />
      <InstancedSet geometry={unitBox} material={darkStoneMaterial} items={paving} />
      {/* Forecourt: a paved apron at the foot of the grand stair. */}
      <mesh
        geometry={unitBox}
        material={darkStoneMaterial}
        position={[fx, FORECOURT.thickness / 2, fz]}
        rotation={[0, FORECOURT.bearing * DEG, 0]}
        scale={[FORECOURT.width, FORECOURT.thickness, FORECOURT.depth]}
      />
    </group>
  );
}
