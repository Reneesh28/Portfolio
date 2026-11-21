import { useEffect, useMemo } from 'react';
import { ExtrudeGeometry, Shape, Vector2, type Material } from 'three';
import type { Vec2 } from '../data/worldGeography';

interface PlateauProps {
  /** Footprint in world [x, z]. */
  outline: readonly Vec2[];
  /** Height of the flat top surface. */
  top: number;
  /** Height of the base (below ground for terrain, below the top for islands). */
  bottom: number;
  topMaterial: Material;
  sideMaterial: Material;
}

/**
 * A flat-topped landform extruded from a footprint polygon: flat top, vertical
 * cliff sides. Used for the mainland, region terraces and island caps.
 */
export default function Plateau({ outline, top, bottom, topMaterial, sideMaterial }: PlateauProps) {
  const geometry = useMemo(() => {
    // Shape lives in the XY plane; rotating -90° about X maps shape Y to world -Z,
    // so world z is stored as -y here, and the extrusion depth becomes height.
    const shape = new Shape(outline.map(([x, z]) => new Vector2(x, -z)));
    const g = new ExtrudeGeometry(shape, { depth: top - bottom, bevelEnabled: false, curveSegments: 1 });
    g.rotateX(-Math.PI / 2);
    return g;
  }, [outline, top, bottom]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  // ExtrudeGeometry groups: 0 = caps (top/bottom), 1 = sides.
  return <mesh geometry={geometry} material={[topMaterial, sideMaterial]} position={[0, bottom, 0]} />;
}
