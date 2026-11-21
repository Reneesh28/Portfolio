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
 * - The World Forge hub (P3) has its own provisional framing, sized to the spire city.
 * - All other poses are PROVISIONAL island framings computed from the P2
 *   archipelago geography (`islandFraming`). Final framings belong to P5 and each
 *   region's own milestone.
 */
import { REGIONS, type RegionId, type Vec3 } from '../data/worldGeography';
import { computeVoidLayout, computeVoidPlacement } from '../regions/void/layout';
import type { SegmentLook } from './journeyPath';
import { PLINTH, PLINTH_SITES } from '../regions/forge/hubLayout';
import { projectById } from '../content/projects';

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
  status: 'provisional' | 'M4' | 'P5';
  narrow?: NarrowFraming;
}

/**
 * Island framing (P5 final, DEC-020): a three-quarter view from the hub side, scaled
 * to the region's footprint, so the island, its landmark and the open archipelago
 * behind it all read. Narrow screens pull back and up with a fixed horizontal coverage.
 */
function islandFraming(id: RegionId, lean = 0): RegionFraming {
  const region = REGIONS.find((r) => r.id === id);
  if (!region) throw new Error(`Unknown region ${id}`);
  const [cx, , cz] = region.position;
  const r = region.footprint;
  const toHub = Math.atan2(-cx, -cz);
  const a = toHub + (28 * Math.PI) / 180;
  const distance = r * 1.9 + 45;
  const height = r * 0.55 + 22;
  // `lean` pulls the aim toward the hub and down (the Path of Ascension frames its climb, not just the summit).
  const aim: Vec3 = [Math.sin(toHub) * r * lean, r * 0.12 + 8 - lean * 60, Math.cos(toHub) * r * lean];
  return {
    offset: [Math.sin(a) * distance, height, Math.cos(a) * distance],
    aim,
    fov: 50,
    status: 'P5',
    narrow: {
      offset: [Math.sin(a) * distance * 1.3, height * 1.3, Math.cos(a) * distance * 1.3],
      aim,
      horizontalFov: 40,
      minFov: 50,
    },
  };
}

/** Framings for every stop after the Void (route order). */
export const REGION_FRAMINGS: Readonly<Record<Exclude<RegionId, 'void'>, RegionFraming>> = {
  'origin-sanctum': islandFraming('origin-sanctum'),
  // The golden spire-city hub from outside the Projects gate (bearing ≈ 345°): the city sits left of
  // centre and the right ≈ 40% stays clear for the M5 dossier. Narrow screens: centred, pulled back.
  'world-forge': {
    offset: [-145, 175, 541],
    aim: [106, 150, 28],
    fov: 50,
    status: 'P5',
    narrow: { offset: [-186, 210, 695], aim: [0, 150, 0], horizontalFov: 44, minFov: 50 },
  },
  'blueprint-archive': islandFraming('blueprint-archive'),
  'path-of-ascension': islandFraming('path-of-ascension', 0.4),
  'worlds-beyond': islandFraming('worlds-beyond'),
  horizon: islandFraming('horizon'),
};

/**
 * Designed journey moves (P5, DEC-020), keyed by the region a segment ARRIVES at.
 * - Origin Sanctum, the reveal: leaving the Void, the camera rises high over the portal
 *   and looks toward the hub mid-flight, so the archipelago and the golden Forge appear below.
 * - Blueprint Archive, the overview: leaving the Forge, the camera climbs higher still and
 *   looks back over the hub before diving to the Archive.
 * Arcs are shares of the segment's horizontal length; other segments use `TRAVEL_ARC`.
 */
export const ARRIVAL_ARCS: Readonly<Partial<Record<RegionId, number>>> = {
  'origin-sanctum': 0.32,
  'blueprint-archive': 0.42,
};

export const ARRIVAL_LOOKS: Readonly<Partial<Record<RegionId, SegmentLook>>> = {
  'origin-sanctum': { point: [0, 120, 0], strength: 0.75 },
  'blueprint-archive': { point: [0, 60, 0], strength: 0.8 },
};

/** Per-segment look-at biases for a route (segment i runs from stop i to stop i + 1). */
export function routeSegmentLooks(route: readonly { id: RegionId }[]): Array<SegmentLook | null> {
  return route.slice(1).map((region) => ARRIVAL_LOOKS[region.id] ?? null);
}

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

/**
 * Focus view of a project monument (M5): from in front of its plinth (outward, toward
 * the Projects gate), a little above it. Wide screens put the monument left of centre
 * (the dossier takes the right side); narrow screens centre it above the dossier sheet.
 */
export function computeProjectFocusPose(projectId: string, width: number, height: number): CameraPose | null {
  const project = projectById(projectId);
  const site = project ? PLINTH_SITES[project.plinth] : undefined;
  if (!site) return null;
  const narrow = width / Math.max(height, 1) < NARROW_ASPECT;
  const a = (site.facing * Math.PI) / 180;
  const out = [Math.sin(a), Math.cos(a)];
  // The camera's right when it faces the monument (looking along −out): forward × up.
  const right = [Math.cos(a), -Math.sin(a)];
  const [px, py, pz] = site.position;
  const top = py + PLINTH.size[1];
  // Narrow: aim below the monument, so it sits in the upper part, above the dossier sheet.
  // Wide: far enough back that the work reads whole, with the Forge's city rising behind it.
  const back = narrow ? 30 : 34;
  const shift = narrow ? 0 : 7.5;
  return {
    position: [px + out[0] * back, top + (narrow ? 10 : 9), pz + out[1] * back],
    target: [px + right[0] * shift, top + (narrow ? -4.8 : 5), pz + right[1] * shift],
    fov: narrow ? 55 : 40,
  };
}

/**
 * Project focus motion (M5.6). Opening eases from the journey pose to the work; switching
 * works glides from the current focus pose to the next one, lifted slightly mid-way so the
 * camera arcs over the terrace instead of cutting across it. Reduced motion: short moves.
 */
export const FOCUS_MOTION = {
  openSeconds: 1.1,
  glideSeconds: 0.9,
  reducedSeconds: 0.3,
  /** Mid-glide lift as a share of the distance travelled, capped. */
  liftShare: 0.12,
  maxLift: 6,
} as const;

/** Moves `value` toward `goal` by at most `step`, never overshooting (and staying put once there). */
export const approach = (value: number, goal: number, step: number): number =>
  value < goal ? Math.min(goal, value + step) : Math.max(goal, value - step);

/** Smoothstep easing used by every focus move. */
export const easeFocus = (t: number): number => t * t * (3 - 2 * t);

/** Height added to the camera at glide progress `t` for a glide of `distance` world units. */
export const focusGlideLift = (t: number, distance: number): number =>
  Math.min(FOCUS_MOTION.maxLift, distance * FOCUS_MOTION.liftShare) * Math.sin(Math.PI * t);
