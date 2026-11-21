import { useMemo } from 'react';
import {
  CONVERGENCE,
  FLOATING_TERRITORIES,
  WORLDS_BEYOND_ZONES,
  type FloatingTerritory,
  type Vec3,
} from '../data/worldGeography';
import { darkStoneMaterial, groundMaterial, stoneMaterial, unitBox } from '../regions/void/materials';
import InstancedSet, { type InstancePlacement } from './InstancedSet';
import { organicOutline } from './outline';
import Plateau from './Plateau';

interface IslandProps {
  position: Vec3;
  radius: number;
  depth: number;
  seed: number;
  stretch?: [number, number];
  tilt?: [number, number];
  yaw?: number;
}

/**
 * A floating landmass: a flat organic cap over a rocky, tapering underside.
 * Built at the local origin, then placed, stretched and tilted as a group.
 */
function Island({ position, radius, depth, seed, stretch = [1, 1], tilt = [0, 0], yaw = 0 }: IslandProps) {
  const outline = useMemo(() => organicOutline([0, 0], radius, seed, 9, 0.16), [radius, seed]);
  return (
    <group position={position} rotation={[tilt[0], yaw, tilt[1]]} scale={[stretch[0], 1, stretch[1]]}>
      <Plateau outline={outline} top={0} bottom={-3} topMaterial={groundMaterial} sideMaterial={darkStoneMaterial} />
      {/* Main underside cone and two offset secondary masses for an irregular silhouette */}
      <mesh material={darkStoneMaterial} position={[0, -3 - depth / 2, 0]}>
        <cylinderGeometry args={[radius * 0.82, radius * 0.1, depth, 7]} />
      </mesh>
      <mesh material={darkStoneMaterial} position={[radius * 0.35, -3 - depth * 0.3, radius * 0.2]} rotation={[0.1, 1, 0.08]}>
        <cylinderGeometry args={[radius * 0.42, radius * 0.06, depth * 0.6, 6]} />
      </mesh>
      <mesh material={darkStoneMaterial} position={[-radius * 0.3, -3 - depth * 0.22, -radius * 0.32]} rotation={[-0.08, 2, 0]}>
        <cylinderGeometry args={[radius * 0.36, radius * 0.05, depth * 0.45, 5]} />
      </mesh>
    </group>
  );
}

/** Six standing stones on the Convergence, each facing the territory of its future zone. */
function useZoneMarkers(): InstancePlacement[] {
  return useMemo(() => {
    const [cx, cy, cz] = CONVERGENCE.position;
    return WORLDS_BEYOND_ZONES.map((zone, i) => {
      const territory = FLOATING_TERRITORIES.find((t) => t.id === zone.territory) as FloatingTerritory;
      const bearing = Math.atan2(territory.position[0] - cx, territory.position[2] - cz);
      // Zones sharing a territory sit side by side, a few degrees apart.
      const siblings = WORLDS_BEYOND_ZONES.filter((z) => z.territory === zone.territory);
      const spread = siblings.length > 1 ? (siblings.indexOf(zone) - 0.5) * 0.32 : 0;
      const a = bearing + spread;
      const height = 7 + (i % 2) * 1.5;
      return {
        position: [cx + Math.sin(a) * 15, cy + height / 2, cz + Math.cos(a) * 15],
        rotation: [0, a, 0],
        scale: [2.2, height, 1.1],
      };
    });
  }, []);
}

/**
 * 05 — THE WORLDS BEYOND: disconnected territories floating over the abyss
 * north-west of the mainland, gathered around the Convergence hub.
 * The six future zones are reserved on four territories (see WORLDS_BEYOND_ZONES).
 */
export default function FloatingTerritories() {
  const markers = useZoneMarkers();
  const [cx, cy, cz] = CONVERGENCE.position;

  return (
    <group>
      {/* The Convergence hub */}
      <Island position={CONVERGENCE.position} radius={CONVERGENCE.radius} depth={30} seed={401} />
      <mesh material={darkStoneMaterial} position={[cx, cy + 0.6, cz]}>
        <cylinderGeometry args={[8, 9, 1.2, 12]} />
      </mesh>
      <mesh geometry={unitBox} material={stoneMaterial} position={[cx, cy + 6, cz]} scale={[1.6, 10, 1.6]} />
      <InstancedSet geometry={unitBox} material={stoneMaterial} items={markers} />

      {FLOATING_TERRITORIES.map((t, i) => (
        <Island key={t.id} position={t.position} radius={t.radius} depth={t.depth} seed={420 + i} stretch={t.stretch} tilt={t.tilt} yaw={t.yaw} />
      ))}
    </group>
  );
}
