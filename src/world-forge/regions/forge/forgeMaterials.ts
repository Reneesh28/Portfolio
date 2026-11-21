import { AdditiveBlending, Color, MeshBasicMaterial, MeshStandardMaterial } from 'three';

/**
 * Materials introduced by the World Forge centrepiece (M4). The stone family is
 * shared with the Void (`regions/void/materials`); these add the core's light.
 */

/** The crown's amber filament: fogged, so from the Void it is a faint line, not a second light source. */
export const crownFilamentMaterial = new MeshBasicMaterial({
  color: new Color('#d8a35c').multiplyScalar(1.25),
  toneMapped: false,
});

/** Amber seams where the tiers meet, and plinth inlays: light from the core, carried into the stone. */
export const forgeSeamMaterial = new MeshBasicMaterial({
  color: new Color('#d8a35c').multiplyScalar(1.15),
  toneMapped: false,
});

/** Middle tier stone: between the dark base and the lighter dais, so the tiers read as separate cuts. */
export const forgeMidStoneMaterial = new MeshStandardMaterial({
  color: '#434a56',
  roughness: 0.95,
  metalness: 0.05,
  flatShading: true,
});

/** The molten seam: unlit, vertex-coloured (white-hot at the crucible, amber toward the crown), never fogged. */
export const forgeSeamCoreMaterial = new MeshBasicMaterial({
  vertexColors: true,
  toneMapped: false,
  fog: false,
});

/** Soft additive glow around the seam. Opacity is driven by the core's pulse and activation. */
export const forgeSeamGlowMaterial = new MeshBasicMaterial({
  vertexColors: true,
  transparent: true,
  opacity: 0.22,
  blending: AdditiveBlending,
  depthWrite: false,
  toneMapped: false,
  fog: false,
});

/** Colour ramp of the seam from its foot (t = 0) to its top (t = 1). */
export const SEAM_HOT = new Color('#ffe7bf').multiplyScalar(1.7);
/** Cools toward the gateway slit's amber (as rendered), not a dull orange. */
export const SEAM_COOL = new Color('#ffcf8a').multiplyScalar(1.25);
export const SEAM_GLOW = new Color('#ffae5c');
