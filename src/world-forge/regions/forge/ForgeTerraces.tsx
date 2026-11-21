import { Euler, Quaternion } from 'three';
import { createRandom } from '../../core/random';
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
import { placement, useMergedGeometry, type Part, type StaticBuild } from './mergeStatic';

const DEG = Math.PI / 180;

/** Yaw about Y, then pitch about the turned X axis, as the XYZ Euler that `placement` takes. */
function yawPitch(yaw: number, pitch: number): [number, number, number] {
  const turn = new Quaternion().setFromEuler(new Euler(pitch, yaw, 0, 'YXZ'));
  const { x, y, z } = new Euler().setFromQuaternion(turn, 'XYZ');
  return [x, y, z];
}

const box = (position: [number, number, number], rotation: [number, number, number], scale: [number, number, number]): Part => [
  unitBox,
  placement(position, rotation, scale),
];

/** Steps, stair cheeks, the T1 parapet, plinth bases, route paving and the forecourt: one dark-stone draw. */
function buildDark(): StaticBuild {
  const parts: Part[] = [];
  for (const step of ALL_FLIGHTS.flatMap(flightSteps)) parts.push(box(step.position, [0, step.bearing * DEG, 0], step.size));
  for (const cheek of ALL_FLIGHTS.flatMap(stairCheeks)) parts.push(box(cheek.position, yawPitch(cheek.bearing * DEG, cheek.pitch), cheek.size));
  for (const wall of parapetSegments()) parts.push(box(wall.position, [0, wall.bearing * DEG, 0], wall.size));
  const [w, h, d] = MONUMENT_RING.plinthSize;
  for (const site of PLINTH_SITES) {
    const [x, y, z] = site.position;
    parts.push(box([x, y + h * 0.3, z], [0, site.bearing * DEG, 0], [w, h * 0.6, d]));
  }
  const rand = createRandom(307);
  const { sanctum, archive } = connectionEnds();
  for (const slab of [...pavePath(...sanctum, rand), ...pavePath(...archive, rand)]) parts.push(box(slab.position, [0, slab.yaw, 0], slab.size));
  const [fx, fz] = polar(FORECOURT.bearing, FORECOURT.distance);
  parts.push(box([fx, FORECOURT.thickness / 2, fz], [0, FORECOURT.bearing * DEG, 0], [FORECOURT.width, FORECOURT.thickness, FORECOURT.depth]));
  return { parts };
}

/** Lighter plinth tops: the sites wait for their monuments (M5). */
function buildPlinthTops(): StaticBuild {
  const [w, h, d] = MONUMENT_RING.plinthSize;
  return {
    parts: PLINTH_SITES.map((site) => {
      const [x, y, z] = site.position;
      return box([x, y + h * 0.8, z], [0, site.bearing * DEG, 0], [w * 0.8, h * 0.4, d * 0.8]);
    }),
  };
}

/** Amber inlays along each plinth's outward face. */
function buildInlays(): StaticBuild {
  const [w, h, d] = MONUMENT_RING.plinthSize;
  return {
    parts: PLINTH_SITES.map((site) => {
      const [x, y, z] = site.position;
      const [ox, oz] = polar(site.bearing, d / 2 + 0.01);
      return box([x + ox, y + h * 0.3, z + oz], [0, site.bearing * DEG, 0], [w * 0.7, 0.07, 0.02]);
    }),
  };
}

/**
 * Terraces: stair flights with cheek walls, the T1 parapet, the reserved monument
 * plinths, the forecourt, and paving that joins the M3 route ends to the stair feet.
 * Static, baked per material (3 draws).
 */
export default function ForgeTerraces() {
  const dark = useMergedGeometry(buildDark);
  const tops = useMergedGeometry(buildPlinthTops);
  const inlays = useMergedGeometry(buildInlays);
  return (
    <group>
      <mesh geometry={dark} material={darkStoneMaterial} />
      <mesh geometry={tops} material={stoneMaterial} />
      <mesh geometry={inlays} material={forgeSeamMaterial} />
    </group>
  );
}
