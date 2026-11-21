/**
 * THE WORLD FORGE — camera target registry.
 *
 * One explicit pose (position, look-at point, vertical field of view) per journey
 * stop, in world coordinates. The camera controller interpolates between these;
 * nothing else positions the camera.
 *
 * - THE VOID pose is computed from the approved M2 opening layout
 *   (`computeVoidLayout` + `computeVoidPlacement`), so the opening shot is exactly
 *   the one the static Void camera produced, at every viewport size.
 * - All other poses are PROVISIONAL functional framings, expressed relative to the
 *   M3 region anchors. They exist so the world can be traversed and inspected in
 *   M1; final framing belongs to each region's approved design (M4–M8) and the
 *   owner-approved route (decision log: "Exact scroll-camera route").
 */
import { REGIONS, type RegionId, type Vec3 } from '../data/worldGeography';
import { computeVoidLayout, computeVoidPlacement } from '../regions/void/layout';

export interface CameraPose {
  position: Vec3;
  /** World point the camera looks at (camera up is always +Y: no roll). */
  target: Vec3;
  /** Vertical field of view, degrees. */
  fov: number;
}

/**
 * Narrow-screen variant of a framing (aspect below `NARROW_ASPECT`): its own camera
 * placement, and a vertical field of view derived from a fixed horizontal coverage,
 * so the landmark's full width holds at any portrait ratio.
 */
interface NarrowFraming {
  offset: Vec3;
  aim: Vec3;
  /** Horizontal field of view to keep, degrees. */
  horizontalFov: number;
  /** Lower bound for the vertical field of view, degrees. */
  minFov: number;
}

/** Below this aspect a framing's `narrow` variant applies (matches the Void layout and CSS threshold, 5/4). */
export const NARROW_ASPECT = 5 / 4;

interface RegionFraming {
  /** Camera position relative to the region anchor. */
  offset: Vec3;
  /** Look-at point relative to the region anchor. */
  aim: Vec3;
  /** Vertical field of view at the reference aspect (16:10). */
  fov: number;
  /** `provisional` (M1 functional framing) or the milestone whose approved design set it. */
  status: 'provisional' | 'M4';
  narrow?: NarrowFraming;
}

/** Provisional framings for every stop after the Void (route order). */
export const REGION_FRAMINGS: Readonly<Record<Exclude<RegionId, 'void'>, RegionFraming>> = {
  // Arriving from the Void approach: the terrace, colonnade and obelisk from the south-west.
  'origin-sanctum': { offset: [-48, 18, 63], aim: [0, 6, 0], fov: 50, status: 'provisional' },
  // M4 settled view (DEC-007): three-quarter from the south-south-east (bearing ≈ 25°) at
  // about terrace height. The Forge sits left of centre and fills ≈ 60% of the frame
  // height; the monument ring is in the lower foreground and the right side stays
  // clear for the M5 dossier panel.
  // Narrow screens: centred, pulled back and higher, so the whole silhouette fits (M4.8).
  'world-forge': {
    offset: [33.8, 18, 72.5],
    aim: [12.7, 22, -5.9],
    fov: 50,
    status: 'M4',
    narrow: { offset: [38.9, 26, 83.4], aim: [0, 21, 0], horizontalFov: 33, minFov: 50 },
  },
  // The archive skyline from the Forge avenue.
  'blueprint-archive': { offset: [-51, 28, 67], aim: [2, 8, -1], fov: 50, status: 'provisional' },
  // The terrace spiral and summit seen from high above the north-west shoulder.
  'path-of-ascension': { offset: [-115, 54, -72], aim: [-20, -26, -32], fov: 50, status: 'provisional' },
  // The Convergence and its territories from the summit bridge side.
  'worlds-beyond': { offset: [-92, 50, 62], aim: [15, 2, 0], fov: 52, status: 'provisional' },
  // The unfinished tip and its ledge, looking out toward the horizon light.
  horizon: { offset: [13, 16, 55], aim: [-3, 7, -45], fov: 50, status: 'provisional' },
};

/**
 * Travel-arc overrides for the segment ARRIVING at a region (share of the segment's
 * horizontal length; negative dips). Every other segment uses the default `TRAVEL_ARC`.
 * - World Forge: the camera comes in low along the Sanctum avenue, then rises into
 *   the settled view, so the crown climbs through the frame (the M4 reveal).
 */
export const ARRIVAL_ARCS: Readonly<Partial<Record<RegionId, number>>> = {
  'world-forge': -0.08,
};

/** Per-segment travel arcs for a route (segment i runs from stop i to stop i + 1). */
export function routeSegmentArcs(route: readonly { id: RegionId }[], fallback: number): number[] {
  return route.slice(1).map((region) => ARRIVAL_ARCS[region.id] ?? fallback);
}

const REFERENCE_ASPECT = 16 / 10;
const MAX_FOV = 72;
const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

/**
 * Keeps a framing's horizontal coverage on narrower screens by widening the
 * vertical field of view (capped), so landmarks don't fall out of portrait frames.
 */
export function responsiveFov(fov: number, aspect: number): number {
  if (aspect >= REFERENCE_ASPECT) return fov;
  const horizontal = Math.atan(Math.tan(toRad(fov / 2)) * REFERENCE_ASPECT);
  return Math.min(MAX_FOV, toDeg(2 * Math.atan(Math.tan(horizontal) / aspect)));
}

/**
 * The approved Void opening camera, expressed in world space.
 * It reproduces the static rig camera (local position + pitch, inside the Void
 * group rotated by `yaw` and offset so the local Forge point sits at the origin).
 */
export function computeVoidPose(width: number, height: number): CameraPose {
  const layout = computeVoidLayout(width, height);
  const { yaw, forgeLocal } = computeVoidPlacement(layout);
  const [cx, cy, cz] = layout.camera;
  const lx = cx - forgeLocal[0];
  const lz = cz - forgeLocal[2];
  const cos = Math.cos(yaw);
  const sin = Math.sin(yaw);
  const position: Vec3 = [lx * cos + lz * sin, cy - forgeLocal[1], -lx * sin + lz * cos];

  // Local view direction (0, sin p, -cos p), rotated about Y by yaw.
  const pitchCos = Math.cos(layout.pitch);
  const direction: Vec3 = [-pitchCos * sin, Math.sin(layout.pitch), -pitchCos * cos];
  // Aim at the Forge's distance, so interpolated look-at points stay near the world centre.
  const reach = Math.hypot(position[0], position[2]);
  const target: Vec3 = [position[0] + direction[0] * reach, position[1] + direction[1] * reach, position[2] + direction[2] * reach];

  return { position, target, fov: layout.fov };
}

const anchorOf = (id: RegionId): Vec3 => {
  const region = REGIONS.find((r) => r.id === id);
  if (!region) throw new Error(`Unknown region ${id}`);
  return region.position;
};

const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

/** World pose of a region's camera target for the given viewport. */
export function computeRegionPose(id: RegionId, width: number, height: number): CameraPose {
  if (id === 'void') return computeVoidPose(width, height);
  const anchor = anchorOf(id);
  const framing = REGION_FRAMINGS[id];
  const aspect = width / Math.max(height, 1);
  const narrow = aspect < NARROW_ASPECT ? framing.narrow : undefined;
  if (narrow) {
    const vertical = toDeg(2 * Math.atan(Math.tan(toRad(narrow.horizontalFov / 2)) / aspect));
    return {
      position: add(anchor, narrow.offset),
      target: add(anchor, narrow.aim),
      fov: Math.min(MAX_FOV, Math.max(narrow.minFov, vertical)),
    };
  }
  return {
    position: add(anchor, framing.offset),
    target: add(anchor, framing.aim),
    fov: responsiveFov(framing.fov, aspect),
  };
}
