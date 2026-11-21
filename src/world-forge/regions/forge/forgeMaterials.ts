import { Color, MeshBasicMaterial } from 'three';

/**
 * Materials introduced by the World Forge centrepiece (M4). The stone family is
 * shared with the Void (`regions/void/materials`); these add the core's light.
 */

/** The crown's amber filament: fogged, so from the Void it is a faint line, not a second light source. */
export const crownFilamentMaterial = new MeshBasicMaterial({
  color: new Color('#d8a35c').multiplyScalar(1.25),
  toneMapped: false,
});
