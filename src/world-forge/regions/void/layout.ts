/**
 * Opening-shot composition for THE VOID.
 *
 * The camera looks down -Z. The gateway sits on a sight line from the camera,
 * and the distant Forge sits further along that same line — so the Forge is
 * always framed inside the gateway opening, whatever the viewport shape.
 *
 * Wide viewports: hero text on the left, gateway on the right third.
 * Narrow / portrait viewports: the camera pulls back, the gateway is centred
 * in the upper frame and the text sits below it.
 * The 5/4 threshold matches the `max-aspect-ratio: 5/4` rule in WorldForge.css.
 *
 * All coordinates in this file are in the Void's LOCAL frame. `computeVoidPlacement`
 * maps that frame into the fixed world (Forge at the origin, Void due south).
 */
export const CAMERA_HEIGHT = 2.2;
export const GATE_Z = -6;
export const FORGE_Z = -200;
/** The horizon glow sits far beyond the whole world (it used to be at -330, inside the new geography). */
export const BACKDROP_Z = -1080;
/** Original backdrop depth: the glow is scaled so its on-screen size and position are unchanged. */
const ORIGINAL_BACKDROP_Z = -330;

/** Top of the gateway composition, including the floating keystone. */
const GATE_TOP = 12.4;
/** Horizontal half-width to keep visible around the gateway on narrow screens. */
const NARROW_HALF_WIDTH = 7.4;
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
  /** World X of the gateway centre. */
  gateX: number;
  wide: boolean;
  dustCount: number;
}

export function computeVoidLayout(width: number, height: number): VoidLayout {
  const aspect = width / Math.max(height, 1);
  const wide = aspect >= WIDE_ASPECT;

  const fov = wide ? 42 : clamp(48 + (0.9 - aspect) * 40, 48, 60);
  const tanHalf = Math.tan(toRad(fov / 2));

  // Wide: fixed distance. Narrow: back off until the gateway fits with margin.
  const distance = wide ? 27 : clamp(NARROW_HALF_WIDTH / (tanHalf * aspect), 20, 32);
  const cameraZ = GATE_Z + distance;

  // Place the top of the gateway at a fixed share of the frame height.
  const halfHeight = distance * tanHalf;
  const topShare = wide ? 0.5 : 0.72;
  const centreY = GATE_TOP - topShare * halfHeight;
  const pitch = Math.atan((centreY - CAMERA_HEIGHT) / distance);

  // Wide: gateway centred on roughly the right third, clear of the hero text column.
  const halfWidth = halfHeight * aspect;

  return {
    fov,
    camera: [0, CAMERA_HEIGHT, cameraZ],
    pitch,
    gateX: wide ? Math.min(9, halfWidth * 0.38) : 0,
    wide,
    dustCount: wide ? 320 : 150,
  };
}

/** X on the camera→gateway sight line at depth `z`. */
export function sightLineX(layout: VoidLayout, z: number): number {
  const cameraZ = layout.camera[2];
  return layout.gateX * ((cameraZ - z) / (cameraZ - GATE_Z));
}

/**
 * Scale factor that moves the horizon glow from its original depth to BACKDROP_Z
 * along camera rays, so it looks exactly the same from the opening camera.
 */
export function backdropScale(layout: VoidLayout): number {
  const cameraZ = layout.camera[2];
  return (cameraZ - BACKDROP_Z) / (cameraZ - ORIGINAL_BACKDROP_Z);
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
