/**
 * Opening-shot composition for THE VOID.
 *
 * P4 portal realm (DEC-019). The camera looks down -Z. The portal ring stands on a
 * sight line from the camera, and the distant golden Forge sits further along that
 * same line: the whole city is framed inside the portal, whatever the viewport shape.
 *
 * Wide viewports: hero text on the left, portal on the right.
 * Narrow / portrait viewports: the camera pulls back, the portal is centred in the
 * upper frame and the text sits below it.
 * The 5/4 threshold matches the `max-aspect-ratio: 5/4` rule in WorldForge.css.
 *
 * All coordinates in this file are in the Void's LOCAL frame. `computeVoidPlacement`
 * maps that frame into the fixed world (Forge at the origin, Void due south).
 */
/** Eye height (P4): up on the platform steps, so the distant Forge sits inside the portal. */
export const CAMERA_HEIGHT = 6.4;
export const GATE_Z = -6;
/** The Forge's distance along the sight line (P4, DEC-019; ≈ 800 m; was −200 in M2, −420 in P3). */
export const FORGE_Z = -780;
/** The portal ring (blueprint: ≈ 24 m), standing at GATE_Z; its centre height above the island. */
export const PORTAL = { radius: 12, centreY: 16.5, tube: 1.6 } as const;
/** Top of the portal composition, with a little sky above it. */
const GATE_TOP = PORTAL.centreY + PORTAL.radius + 1.5;
/** Horizontal half-width to keep visible around the portal on narrow screens. */
const NARROW_HALF_WIDTH = PORTAL.radius + 3.5;
const WIDE_ASPECT = 5 / 4;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const toRad = (deg: number) => (deg * Math.PI) / 180;

export interface VoidLayout {
  /** Vertical field of view, degrees. */
  fov: number;
  /** Camera position; X is always 0 so the sight-line framing holds. */
  camera: [number, number, number];
  /** Camera pitch (rotation about X), radians. No roll, no yaw. */
  pitch: number;
  /** X of the portal centre (local frame). */
  gateX: number;
  wide: boolean;
  dustCount: number;
}

export function computeVoidLayout(width: number, height: number): VoidLayout {
  const aspect = width / Math.max(height, 1);
  const wide = aspect >= WIDE_ASPECT;

  const fov = wide ? 42 : clamp(48 + (0.9 - aspect) * 40, 48, 60);
  const tanHalf = Math.tan(toRad(fov / 2));

  // Wide: fixed distance. Narrow: back off until the portal fits, but no further than 52 m,
  // or the portal no longer covers the whole distant Forge.
  const distance = wide ? 46 : clamp(NARROW_HALF_WIDTH / (tanHalf * aspect), 40, 52);
  const cameraZ = GATE_Z + distance;

  // Place the top of the portal at a fixed share of the frame height.
  const halfHeight = distance * tanHalf;
  const topShare = wide ? 0.66 : 0.72;
  const centreY = GATE_TOP - topShare * halfHeight;
  const pitch = Math.atan((centreY - CAMERA_HEIGHT) / distance);

  // Wide: portal on the right, clear of the hero text column.
  const halfWidth = halfHeight * aspect;

  return {
    fov,
    camera: [0, CAMERA_HEIGHT, cameraZ],
    pitch,
    gateX: wide ? Math.min(13, halfWidth * 0.46) : 0,
    wide,
    dustCount: wide ? 320 : 150,
  };
}

/** X on the camera→portal sight line at depth `z`. */
export function sightLineX(layout: VoidLayout, z: number): number {
  const cameraZ = layout.camera[2];
  return layout.gateX * ((cameraZ - z) / (cameraZ - GATE_Z));
}

export interface VoidPlacement {
  /** Rotation about world Y applied to the whole Void rig. */
  yaw: number;
  /** Where the Forge sits in the Void's local frame (mapped to the world origin). */
  forgeLocal: [number, number, number];
}

/**
 * Places the Void rig in the fixed world: the local Forge point maps to the
 * world origin, and the rig is rotated so the gateway always lies due south (+Z).
 * Camera, gateway and Forge stay collinear, so the Forge remains framed in the gate.
 */
export function computeVoidPlacement(layout: VoidLayout): VoidPlacement {
  const forgeX = sightLineX(layout, FORGE_Z);
  const dx = layout.gateX - forgeX;
  const dz = GATE_Z - FORGE_Z;
  return { yaw: Math.atan2(-dx, dz), forgeLocal: [forgeX, 0, FORGE_Z] };
}

/**
 * Rig yaw of the approved reference shot (1440×900). World lighting and the Forge's
 * orientation are expressed in this frame, so the reference shot is unchanged.
 */
export const REFERENCE_YAW = computeVoidPlacement(computeVoidLayout(1440, 900)).yaw;
