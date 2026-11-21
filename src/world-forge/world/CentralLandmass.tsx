import { useMemo } from 'react';
import { createRandom, range } from '../core/random';
import { HIGHLANDS, MAINLAND, MAINLAND_HILLS, type Vec2 } from '../data/worldGeography';
import { darkStoneMaterial, groundMaterial, unitRock } from '../regions/void/materials';
import InstancedSet, { type InstancePlacement } from './InstancedSet';
import Plateau from './Plateau';

/** Outline shrunk toward its centroid. */
function scaleOutline(outline: readonly Vec2[], scale: number): Vec2[] {
  const cx = outline.reduce((sum, [x]) => sum + x, 0) / outline.length;
  const cz = outline.reduce((sum, [, z]) => sum + z, 0) / outline.length;
  return outline.map(([x, z]) => [cx + (x - cx) * scale, cz + (z - cz) * scale]);
}

/**
 * The mainland: a single organic landmass whose flat top (y = 0) is the ground of
 * the Void plain and the central world. Sheer cliffs drop from its edge, and its
 * underside narrows in steps as it descends into the abyss.
 * Hills give the plain height variation; highland rocks rise behind the Ascension.
 */
export default function CentralLandmass() {
  const underside = useMemo(
    () =>
      MAINLAND.underside.map(([scale, bottom], i) => ({
        outline: scaleOutline(MAINLAND.outline, scale),
        top: i === 0 ? -MAINLAND.depth : MAINLAND.underside[i - 1][1],
        bottom,
      })),
    [],
  );

  const hills = useMemo<InstancePlacement[]>(
    () =>
      MAINLAND_HILLS.map(([x, z, sx, h, sz, yaw]) => ({
        position: [x, 0, z],
        rotation: [0, yaw, 0],
        scale: [sx, h, sz],
      })),
    [],
  );

  const highlands = useMemo<InstancePlacement[]>(() => {
    const rand = createRandom(97);
    return HIGHLANDS.map(([x, z, h]) => ({
      position: [x, h * 0.3, z],
      rotation: [range(rand, -0.2, 0.2), range(rand, 0, 6), range(rand, -0.15, 0.15)],
      scale: [range(rand, 18, 28), h, range(rand, 16, 24)],
    }));
  }, []);

  return (
    <group>
      <Plateau outline={MAINLAND.outline} top={0} bottom={-MAINLAND.depth} topMaterial={groundMaterial} sideMaterial={darkStoneMaterial} />
      {underside.map((layer, i) => (
        <Plateau key={i} outline={layer.outline} top={layer.top} bottom={layer.bottom} topMaterial={darkStoneMaterial} sideMaterial={darkStoneMaterial} />
      ))}
      <InstancedSet geometry={unitRock} material={darkStoneMaterial} items={hills} />
      <InstancedSet geometry={unitRock} material={darkStoneMaterial} items={highlands} />
    </group>
  );
}
