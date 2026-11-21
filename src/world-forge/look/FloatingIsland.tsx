import { useEffect, useMemo, type ReactNode } from 'react';
import { MeshStandardMaterial } from 'three';
import { createRandom } from '../core/random';
import { createIslandGeometry, type IslandShape } from './islandGeometry';
import { BLUEPRINT } from './palette';

interface FloatingIslandProps {
  position: [number, number, number];
  shape: IslandShape;
  seed: number;
  /** Colour of the island's top surface (region tint). */
  topColor?: string;
  rotationY?: number;
  children?: ReactNode;
}

/** A floating island: rocky slab plus hanging rock. Children sit on the top surface (y = 0 locally). */
export default function FloatingIsland({ position, shape, seed, topColor = BLUEPRINT.stone.mid, rotationY = 0, children }: FloatingIslandProps) {
  const { top, rock } = useMemo(() => createIslandGeometry(shape, createRandom(seed)), [shape, seed]);
  useEffect(
    () => () => {
      top.dispose();
      rock.dispose();
    },
    [top, rock],
  );
  const topMaterial = useMemo(() => new MeshStandardMaterial({ color: topColor, roughness: 0.95, metalness: 0.04, flatShading: true }), [topColor]);
  const rockMaterial = useMemo(() => new MeshStandardMaterial({ color: '#2b2840', roughness: 1, metalness: 0.02, flatShading: true }), []);
  useEffect(
    () => () => {
      topMaterial.dispose();
      rockMaterial.dispose();
    },
    [topMaterial, rockMaterial],
  );

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh geometry={top} material={topMaterial} />
      <mesh geometry={rock} material={rockMaterial} />
      {children}
    </group>
  );
}
