import { BufferAttribute, Color, CylinderGeometry } from 'three';

/**
 * A cylinder whose vertex colours run from `bottom` (at its foot) to `top` (at its
 * crown), for the unlit seam and its additive glow. `curve` shapes the ramp.
 */
export function createGradientCylinder(
  radiusTop: number,
  radiusBottom: number,
  height: number,
  segments: number,
  bottom: Color,
  top: Color,
  openEnded = false,
  /** Ramp exponent: above 1 keeps the bottom colour over more of the height. */
  curve = 1,
): CylinderGeometry {
  const geometry = new CylinderGeometry(radiusTop, radiusBottom, height, segments, 6, openEnded);
  const position = geometry.getAttribute('position');
  const colors = new Float32Array(position.count * 3);
  const c = new Color();
  for (let i = 0; i < position.count; i++) {
    const t = position.getY(i) / height + 0.5;
    c.copy(bottom).lerp(top, t ** curve);
    colors.set([c.r, c.g, c.b], i * 3);
  }
  geometry.setAttribute('color', new BufferAttribute(colors, 3));
  return geometry;
}
