import { useEffect, useMemo } from 'react';
import { BoxGeometry, Color, ConeGeometry, CylinderGeometry, MeshBasicMaterial, MeshStandardMaterial, OctahedronGeometry, TorusGeometry, type BufferGeometry } from 'three';
import { createRandom } from '../core/random';
import { ISLANDS, REGIONS, WORLDS_BEYOND_TERRITORIES, type Vec3 } from '../data/worldGeography';
import { mergeParts, placement, type Part } from '../core/mergeStatic';

/**
 * P2 landmark blockouts: one simple, recognisable silhouette per region so each
 * island reads from a distance. These are placeholders; each region's real design
 * belongs to its own milestone (M6–M8). The Origin Sanctum's was replaced in M6.1, the
 * Blueprint Archive's in M6.2, the Path of Ascension's in M6.3. Stone is baked into one draw; glowing
 * accents are baked per colour.
 */
const islandTop = (id: string): Vec3 => {
  const island = ISLANDS.find((i) => i.id === id);
  if (!island) throw new Error(`Unknown island ${id}`);
  return island.position;
};
const accentOf = (id: string) => REGIONS.find((r) => r.id === id)?.accent ?? '#ffffff';
const at = ([x, y, z]: Vec3, dx: number, dy: number, dz: number): Vec3 => [x + dx, y + dy, z + dz];

interface Built {
  stone: Part[];
  accents: Map<string, Part[]>;
  temporary: BufferGeometry[];
}

function build(): Built {
  const rand = createRandom(97);
  const box = new BoxGeometry(1, 1, 1);
  const pillar = new CylinderGeometry(1, 1.1, 1, 6);
  const cone = new ConeGeometry(1, 1, 6);
  const peak = new ConeGeometry(1, 1, 5);
  const gem = new OctahedronGeometry(1, 0);
  const arch = new TorusGeometry(1, 0.12, 6, 18, Math.PI);
  const stone: Part[] = [];
  const accents = new Map<string, Part[]>();
  const accent = (color: string, part: Part) => accents.set(color, [...(accents.get(color) ?? []), part]);

  // 01 Origin Sanctum: built by its own region since M6.1 (`regions/sanctum`).

  // 03 Blueprint Archive: built by its own region since M6.2 (`regions/archive`). Its old skyline
  // drew from the shared random sequence; consume the same draws so the later blockouts stay as approved.
  for (let gx = -3; gx <= 3; gx++) {
    for (let gz = -3; gz <= 3; gz++) {
      if (Math.hypot(gx, gz) > 3.3 || rand() < 0.35) continue;
      rand();
    }
  }

  // 04 Path of Ascension: built by its own region since M6.3 (`regions/ascension`). Its old peaks
  // drew from the shared random sequence; consume the same draws so the later blockouts stay as approved.
  for (let k = 0; k < 3; k++) rand();

  // 05 Worlds Beyond: the Convergence's standing stones and monolith; one landmark per territory.
  const wb = islandTop('wb-convergence');
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    stone.push([box, placement(at(wb, Math.sin(a) * 20, 5, Math.cos(a) * 20), [0, a, 0], [3, 10, 1.6])]);
  }
  stone.push([box, placement(at(wb, 0, 11, 0), [0, 0.4, 0], [5, 22, 3])]);
  accent(accentOf('worlds-beyond'), [gem, placement(at(wb, 0, 26, 0), [0, 0.2, 0], [2.6, 4, 2.6])]);
  for (const t of WORLDS_BEYOND_TERRITORIES) {
    const p = islandTop(t.id);
    switch (t.id) {
      case 'wb-ember':
        stone.push([cone, placement(at(p, 0, 10, 0), [0, 0, 0], [8, 20, 8])]);
        accent(t.accent, [gem, placement(at(p, 0, 22, 0), [0, 0, 0], [2, 3, 2])]);
        break;
      case 'wb-temporal':
        stone.push([cone, placement(at(p, 0, 12, 0), [Math.PI, 0, 0], [5, 8, 5])]);
        stone.push([cone, placement(at(p, 0, 4, 0), [0, 0, 0], [5, 8, 5])]);
        accent(t.accent, [gem, placement(at(p, 0, 8, 0), [0, 0, 0], [1.4, 1.4, 1.4])]);
        break;
      case 'wb-sunken':
        stone.push([arch, placement(at(p, 0, 0, 0), [0, 0.6, 0], [12, 12, 12])]);
        accent(t.accent, [gem, placement(at(p, 0, 6, 0), [0, 0, 0], [1.8, 2.6, 1.8])]);
        break;
      case 'wb-dunes':
        stone.push([peak, placement(at(p, 0, 7, 0), [0, 0.3, 0], [12, 14, 12])]);
        accent(t.accent, [gem, placement(at(p, 0, 16, 0), [0, 0, 0], [1.6, 2.4, 1.6])]);
        break;
      case 'wb-steel':
        stone.push([box, placement(at(p, 0, 12, 0), [0, 0.5, 0], [6, 24, 6])]);
        accent(t.accent, [box, placement(at(p, 3.05, 14, 0), [0, 0.5, 0], [0.2, 12, 1.2])]);
        break;
      default:
        stone.push([pillar, placement(at(p, 0, 9, 0), [0, 0, 0], [2.2, 18, 2.2])]);
        accent(t.accent, [gem, placement(at(p, 0, 21, 0), [0, 0, 0], [2, 3, 2])]);
    }
  }

  // 06 Horizon: an unfinished gate at the edge of the world, facing the open sky.
  const hz = islandTop('horizon');
  stone.push([box, placement(at(hz, -3, 11, -9), [0, 0, 0], [3, 22, 3])]);
  stone.push([box, placement(at(hz, -3, 11, 9), [0, 0, 0], [3, 22, 3])]);
  stone.push([box, placement(at(hz, -3, 23.5, 4), [0.08, 0, 0], [3.4, 3, 13])]);
  accent(accentOf('horizon'), [box, placement(at(hz, -3, 22, -9), [0, 0, 0], [0.6, 0.6, 0.6])]);
  accent(accentOf('horizon'), [gem, placement(at(hz, -3, 12, 0), [0, 0, 0], [1.6, 3, 1.6])]);

  return { stone, accents, temporary: [box, pillar, cone, peak, gem, arch] };
}

export default function RegionLandmarks() {
  const baked = useMemo(() => {
    const { stone, accents, temporary } = build();
    const result = {
      stone: mergeParts(stone),
      accents: [...accents.entries()].map(([color, parts]) => ({ color, geometry: mergeParts(parts) })),
    };
    temporary.forEach((g) => g.dispose());
    return result;
  }, []);
  useEffect(
    () => () => {
      baked.stone.dispose();
      baked.accents.forEach((a) => a.geometry.dispose());
    },
    [baked],
  );
  const materials = useMemo(
    () => ({
      stone: new MeshStandardMaterial({ color: '#4a4760', roughness: 0.9, metalness: 0.08, flatShading: true }),
      accents: new Map(baked.accents.map((a) => [a.color, new MeshBasicMaterial({ color: new Color(a.color).multiplyScalar(1.8), toneMapped: false })])),
    }),
    [baked],
  );
  useEffect(
    () => () => {
      materials.stone.dispose();
      materials.accents.forEach((m) => m.dispose());
    },
    [materials],
  );

  return (
    <group>
      <mesh geometry={baked.stone} material={materials.stone} />
      {baked.accents.map((a) => (
        <mesh key={a.color} geometry={a.geometry} material={materials.accents.get(a.color)} />
      ))}
    </group>
  );
}
