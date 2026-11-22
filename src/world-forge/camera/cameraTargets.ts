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
import { fragmentCentre, toWorldDirection, type FragmentId } from '../regions/sanctum/sanctumLayout';
import { toWorldDirection as archiveDirection } from '../regions/archive/archiveLayout';
import { CLIMB_CENTRE, CLIMB_DIRECTION, TOWARD_HUB, waystone } from '../regions/ascension/ascensionLayout';
import type { MilestoneId } from '../content/timeline';
import { CONVERGENCE, LANDMARKS } from '../regions/beyond/beyondLayout';
import type { TerritoryId } from '../content/interests';
import { HORIZON_YAW } from '../regions/horizon/horizonLayout';

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
  status: 'provisional' | 'M4' | 'P5' | 'M6' | 'M7';
  narrow?: NarrowFraming;
}

/**
 * The Origin Sanctum (M6.1, DEC-026): from the island's outer side, looking back across the
 * court toward the hub, so the Forge stands on the horizon. Wide screens keep the court left of
 * centre (the panel takes the right side); narrow screens centre it, pulled back and up.
 * Given in the Sanctum's local frame (+Z away from the hub, +X the camera's right).
 */
export const SANCTUM_VIEW = {
  wide: { camera: [10, 32, 86] as Vec3, aim: [17, 8, -20] as Vec3, fov: 50 },
  narrow: { camera: [0, 42, 112] as Vec3, aim: [0, 0, -12] as Vec3, horizontalFov: 40, minFov: 50 },
} as const;

const sanctumFraming: RegionFraming = {
  offset: toWorldDirection(SANCTUM_VIEW.wide.camera),
  aim: toWorldDirection(SANCTUM_VIEW.wide.aim),
  fov: SANCTUM_VIEW.wide.fov,
  status: 'M6',
  narrow: {
    offset: toWorldDirection(SANCTUM_VIEW.narrow.camera),
    aim: toWorldDirection(SANCTUM_VIEW.narrow.aim),
    horizontalFov: SANCTUM_VIEW.narrow.horizontalFov,
    minFov: SANCTUM_VIEW.narrow.minFov,
  },
};

/**
 * The Blueprint Archive (M6.2, DEC-028): P5's three-quarter view from the hub side, sized to the
 * Drafting Hall. Wide screens keep the four structures in an arc left of centre (the panel takes
 * the right side); narrow screens centre them, pulled back and up. Selecting a category never
 * moves the camera (master doc §8). Given in the Archive's local frame (+Z toward the hub).
 */
export const ARCHIVE_VIEW = {
  wide: { camera: [8, 28, 78] as Vec3, aim: [21, 14, -12] as Vec3, fov: 50 },
  narrow: { camera: [0, 46, 100] as Vec3, aim: [0, -9, -10] as Vec3, horizontalFov: 40, minFov: 50 },
} as const;

const archiveFraming: RegionFraming = {
  offset: archiveDirection(ARCHIVE_VIEW.wide.camera),
  aim: archiveDirection(ARCHIVE_VIEW.wide.aim),
  fov: ARCHIVE_VIEW.wide.fov,
  status: 'M6',
  narrow: {
    offset: archiveDirection(ARCHIVE_VIEW.narrow.camera),
    aim: archiveDirection(ARCHIVE_VIEW.narrow.aim),
    horizontalFov: ARCHIVE_VIEW.narrow.horizontalFov,
    minFov: ARCHIVE_VIEW.narrow.minFov,
  },
};

/**
 * The Path of Ascension (M6.3, DEC-030): from the hub side, turned down the climb, so all four
 * islands and the five waystones read as an ascent, the summit rising to the left and behind.
 * Portrait screens turn further, looking up the climb almost end-on, so the islands stack upward
 * instead of spreading sideways (and the camera stays well clear of the hub). It is centred:
 * choosing a milestone always moves the camera to that milestone (master doc §6).
 */
export const ASCENSION_VIEW = {
  /**
   * `turn`: radians the view turns from square-on toward the foot of the climb.
   * `aimAlong`: metres the aim sits down the climb from its centre (the near foot needs more of the frame).
   */
  wide: { turn: 0.6, distance: 255, height: 62, aimHeight: 6, aimAlong: -34, fov: 50 },
  narrow: { turn: 1.15, distance: 330, height: 150, aimHeight: 0, aimAlong: 0, horizontalFov: 60, minFov: 50 },
} as const;

const ascensionFraming: RegionFraming = (() => {
  const anchor = REGIONS.find((r) => r.id === 'path-of-ascension')?.position ?? [0, 0, 0];
  const rel = ({ turn, distance, height, aimHeight, aimAlong }: { turn: number; distance: number; height: number; aimHeight: number; aimAlong: number }) => {
    const hx = TOWARD_HUB[0] * Math.cos(turn) - CLIMB_DIRECTION[0] * Math.sin(turn);
    const hz = TOWARD_HUB[1] * Math.cos(turn) - CLIMB_DIRECTION[1] * Math.sin(turn);
    return {
      offset: [CLIMB_CENTRE[0] + hx * distance - anchor[0], CLIMB_CENTRE[1] + height - anchor[1], CLIMB_CENTRE[2] + hz * distance - anchor[2]] as Vec3,
      aim: [
        CLIMB_CENTRE[0] + CLIMB_DIRECTION[0] * aimAlong - anchor[0],
        CLIMB_CENTRE[1] + aimHeight - anchor[1],
        CLIMB_CENTRE[2] + CLIMB_DIRECTION[1] * aimAlong - anchor[2],
      ] as Vec3,
    };
  };
  const wide = rel(ASCENSION_VIEW.wide);
  const narrow = rel(ASCENSION_VIEW.narrow);
  return {
    ...wide,
    fov: ASCENSION_VIEW.wide.fov,
    status: 'M6',
    narrow: { ...narrow, horizontalFov: ASCENSION_VIEW.narrow.horizontalFov, minFov: ASCENSION_VIEW.narrow.minFov },
  };
})();

/**
 * The Worlds Beyond (M7, DEC-032): above and behind the Convergence from the hub side, so the
 * six gates on the plaza and the territories floating around it all read. Choosing a territory
 * always moves the camera to it, so the settled view is centred.
 */
export const BEYOND_VIEW = {
  wide: { distance: 255, height: 105, aimHeight: 4, fov: 50 },
  narrow: { distance: 430, height: 190, aimHeight: -20, horizontalFov: 64, minFov: 50 },
  /** Radians the view turns off the line to the hub (as P5's island framing). */
  turn: (28 * Math.PI) / 180,
} as const;

const beyondFraming: RegionFraming = (() => {
  const anchor = REGIONS.find((r) => r.id === 'worlds-beyond')?.position ?? [0, 0, 0];
  const [cx, cy, cz] = CONVERGENCE.position;
  const a = Math.atan2(-cx, -cz) + BEYOND_VIEW.turn;
  const at = (d: number, h: number, aim: number) => ({
    offset: [cx + Math.sin(a) * d - anchor[0], cy + h - anchor[1], cz + Math.cos(a) * d - anchor[2]] as Vec3,
    aim: [cx - anchor[0], cy + aim - anchor[1], cz - anchor[2]] as Vec3,
  });
  const wide = at(BEYOND_VIEW.wide.distance, BEYOND_VIEW.wide.height, BEYOND_VIEW.wide.aimHeight);
  const narrow = at(BEYOND_VIEW.narrow.distance, BEYOND_VIEW.narrow.height, BEYOND_VIEW.narrow.aimHeight);
  return {
    ...wide,
    fov: BEYOND_VIEW.wide.fov,
    status: 'M7',
    narrow: { ...narrow, horizontalFov: BEYOND_VIEW.narrow.horizontalFov, minFov: BEYOND_VIEW.narrow.minFov },
  };
})();

/**
 * The Horizon (M8, DEC-034): from the island's south-west, so the unfinished gate stands on the
 * left against the bright western sky and the Forge glows far off on the right; the scene sits low,
 * leaving the sky for the closing words. Narrow screens face the gate and the island. In the Horizon's local
 * frame (+Z toward the hub, +X north).
 */
export const HORIZON_VIEW = {
  wide: { camera: [-150, 30, -90] as Vec3, aim: [-50, 16, 21] as Vec3, fov: 50 },
  narrow: { camera: [-125, 38, -27] as Vec3, aim: [0, 15, -27] as Vec3, horizontalFov: 50, minFov: 50 },
} as const;

const horizonDirection = ([x, y, z]: Vec3): Vec3 => {
  const c = Math.cos(HORIZON_YAW);
  const s = Math.sin(HORIZON_YAW);
  return [x * c + z * s, y, -x * s + z * c];
};

const horizonFraming: RegionFraming = {
  offset: horizonDirection(HORIZON_VIEW.wide.camera),
  aim: horizonDirection(HORIZON_VIEW.wide.aim),
  fov: HORIZON_VIEW.wide.fov,
  status: 'M7',
  narrow: {
    offset: horizonDirection(HORIZON_VIEW.narrow.camera),
    aim: horizonDirection(HORIZON_VIEW.narrow.aim),
    horizontalFov: HORIZON_VIEW.narrow.horizontalFov,
    minFov: HORIZON_VIEW.narrow.minFov,
  },
};

/** Framings for every stop after the Void (route order). */
export const REGION_FRAMINGS: Readonly<Record<Exclude<RegionId, 'void'>, RegionFraming>> = {
  'origin-sanctum': sanctumFraming,
  // The golden spire-city hub from outside the Projects gate (bearing ≈ 345°): the city sits left of
  // centre and the right ≈ 40% stays clear for the M5 dossier. Narrow screens: centred, pulled back.
  'world-forge': {
    offset: [-145, 175, 541],
    aim: [106, 150, 28],
    fov: 50,
    status: 'P5',
    narrow: { offset: [-186, 210, 695], aim: [0, 150, 0], horizontalFov: 44, minFov: 50 },
  },
  'blueprint-archive': archiveFraming,
  'path-of-ascension': ascensionFraming,
  'worlds-beyond': beyondFraming,
  horizon: horizonFraming,
};

/**
 * Designed journey moves (P5, DEC-020), keyed by the region a segment ARRIVES at.
 * - Origin Sanctum, the reveal: leaving the Void, the camera rises high over the portal
 *   and looks toward the hub mid-flight, so the archipelago and the golden Forge appear below.
 * - World Forge (M6.1): leaving the Sanctum, the view holds on the Forge's core.
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
  // M6.1: leaving the Sanctum from its outer side, the Forge stays ahead the whole way.
  'world-forge': { point: [0, 150, 0], strength: 0.9 },
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

/** How far the camera moves toward a focused fragment ("minimal focus", master §8; proposal §2.3). */
/** Narrow screens aim below the fragment by a share of the distance, so it sits in the top third, above the sheet. */
export const FRAGMENT_FOCUS = { approach: 0.2, wideFov: 36, narrowFovScale: 0.82, wideShift: 7, narrowDropShare: 0.22 } as const;

/**
 * Focus view of an Origin Sanctum fragment (M6.1): the settled view, moved a fifth of the way
 * toward the fragment and narrowed onto it. Wide screens put the fragment left of centre (the
 * panel takes the right side); narrow screens put it in the upper part, above the sheet.
 */
export function computeFragmentFocusPose(id: FragmentId, width: number, height: number): CameraPose {
  const settled = computeRegionPose('origin-sanctum', width, height);
  const centre = fragmentCentre(id);
  const narrow = width / Math.max(height, 1) < NARROW_ASPECT;
  const [sx, sy, sz] = settled.position;
  const position: Vec3 = [sx + (centre[0] - sx) * FRAGMENT_FOCUS.approach, sy + (centre[1] - sy) * FRAGMENT_FOCUS.approach, sz + (centre[2] - sz) * FRAGMENT_FOCUS.approach];
  const dx = centre[0] - position[0];
  const dz = centre[2] - position[2];
  const flat = Math.hypot(dx, dz) || 1;
  // The camera's right when facing the fragment: forward × up.
  const right: Vec3 = [-dz / flat, 0, dx / flat];
  const reach = Math.hypot(centre[0] - position[0], centre[1] - position[1], centre[2] - position[2]);
  const target: Vec3 = narrow
    ? [centre[0], centre[1] - reach * FRAGMENT_FOCUS.narrowDropShare, centre[2]]
    : [centre[0] + right[0] * FRAGMENT_FOCUS.wideShift, centre[1], centre[2] + right[2] * FRAGMENT_FOCUS.wideShift];
  return { position, target, fov: narrow ? settled.fov * FRAGMENT_FOCUS.narrowFovScale : FRAGMENT_FOCUS.wideFov };
}

/** Milestone focus (M6.3): a three-quarter view of the waystone from beside the path, on the hub side. */
export const MILESTONE_FOCUS = { turn: 0.35, base: 30, perHeight: 1.2, wideFov: 42, narrowFov: 56, wideShift: 0.2, narrowDrop: 0.3 } as const;

/**
 * Focus view of a Path of Ascension milestone (M6.3): from the hub side of the path, turned a
 * little down the climb, so the waystone and the path rising beyond it both read. Wide screens
 * put the waystone left of centre (the panel takes the right side); narrow screens put it in
 * the upper part, above the sheet.
 */
export function computeMilestoneFocusPose(id: MilestoneId, width: number, height: number): CameraPose {
  const w = waystone(id);
  const narrow = width / Math.max(height, 1) < NARROW_ASPECT;
  const [hx, hz] = TOWARD_HUB;
  const [dx, dz] = CLIMB_DIRECTION;
  const c = Math.cos(MILESTONE_FOCUS.turn);
  const s = Math.sin(MILESTONE_FOCUS.turn);
  const vx = hx * c - dx * s;
  const vz = hz * c - dz * s;
  const reach = (MILESTONE_FOCUS.base + w.height * MILESTONE_FOCUS.perHeight) * (narrow ? 1.35 : 1);
  const [px, py, pz] = w.position;
  const position: Vec3 = [px + vx * reach, py + 8 + w.height * 0.6, pz + vz * reach];
  // The camera's right when facing the waystone (looking along −v): forward × up.
  const right: Vec3 = [vz, 0, -vx];
  const mid = py + w.height * 0.55;
  const target: Vec3 = narrow
    ? [px, mid - reach * MILESTONE_FOCUS.narrowDrop, pz]
    : [px + right[0] * reach * MILESTONE_FOCUS.wideShift, mid, pz + right[2] * reach * MILESTONE_FOCUS.wideShift];
  return { position, target, fov: narrow ? MILESTONE_FOCUS.narrowFov : MILESTONE_FOCUS.wideFov };
}

/** Territory focus (M7): from the Convergence side, a little above, on the territory's landmark. */
export const TERRITORY_FOCUS = { reach: 2.6, lift: 0.9, turn: 0.3, wideFov: 44, narrowFov: 58, wideShift: 0.22, narrowDrop: 0.32 } as const;

/**
 * Focus view of a Worlds Beyond territory (M7): looking out from the Convergence side at the
 * territory's landmark. Wide screens put it left of centre (the panel takes the right side);
 * narrow screens put it in the upper part, above the sheet. Null for territories not yet built.
 */
export function computeTerritoryFocusPose(id: TerritoryId, width: number, height: number): CameraPose | null {
  const landmark = LANDMARKS[id];
  if (!landmark) return null;
  const narrow = width / Math.max(height, 1) < NARROW_ASPECT;
  const [lx, ly, lz] = landmark.centre;
  const [cx, , cz] = CONVERGENCE.position;
  const a = Math.atan2(cx - lx, cz - lz) + TERRITORY_FOCUS.turn;
  const reach = landmark.radius * TERRITORY_FOCUS.reach * (narrow ? 1.35 : 1);
  const position: Vec3 = [lx + Math.sin(a) * reach, ly + landmark.height * TERRITORY_FOCUS.lift + reach * 0.25, lz + Math.cos(a) * reach];
  // The camera's right when facing the landmark: forward x up, with forward = -(sin a, cos a).
  const right: Vec3 = [Math.cos(a), 0, -Math.sin(a)];
  const target: Vec3 = narrow
    ? [lx, ly - reach * TERRITORY_FOCUS.narrowDrop, lz]
    : [lx + right[0] * reach * TERRITORY_FOCUS.wideShift, ly, lz + right[2] * reach * TERRITORY_FOCUS.wideShift];
  return { position, target, fov: narrow ? TERRITORY_FOCUS.narrowFov : TERRITORY_FOCUS.wideFov };
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
