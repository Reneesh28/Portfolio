import { useMemo } from 'react';
import { createRandom, range } from '../core/random';
import {
  ASCENSION_TERRACES,
  BLUEPRINT_ARCHIVE,
  FORGE_WARD,
  HORIZON,
  ORIGIN_SANCTUM,
  REGIONS,
  type RegionId,
  type Vec3,
} from '../data/worldGeography';
import { darkStoneMaterial, emberMaterial, groundMaterial, stoneMaterial, unitBox, unitMesa, unitShard } from '../regions/void/materials';
import InstancedSet, { type InstancePlacement } from './InstancedSet';
import Plateau from './Plateau';

const regionAnchor = (id: RegionId): Vec3 => {
  const region = REGIONS.find((r) => r.id === id);
  if (!region) throw new Error(`Unknown region ${id}`);
  return region.position;
};

const DEG = Math.PI / 180;

/* ---------------------------------------------------------------------------
 * 01 — ORIGIN SANCTUM: a quiet raised terrace, a ring colonnade, a single obelisk.
 * ------------------------------------------------------------------------- */
function OriginSanctum() {
  const [cx, , cz] = regionAnchor('origin-sanctum');
  const top = ORIGIN_SANCTUM.top;

  const colonnade = useMemo<InstancePlacement[]>(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return { position: [cx + Math.sin(a) * 13, top + 4.5, cz + Math.cos(a) * 13], rotation: [0, a, 0], scale: [1.3, 9, 1.3] };
      }),
    [cx, cz, top],
  );

  return (
    <group>
      <Plateau outline={ORIGIN_SANCTUM.outline} top={top} bottom={-2} topMaterial={groundMaterial} sideMaterial={darkStoneMaterial} />
      <InstancedSet geometry={unitBox} material={stoneMaterial} items={colonnade} />
      <mesh material={darkStoneMaterial} position={[cx, top + 0.5, cz]}>
        <cylinderGeometry args={[4.5, 5, 1, 8]} />
      </mesh>
      <mesh material={stoneMaterial} position={[cx, top + 1 + 13, cz]}>
        <cylinderGeometry args={[0.5, 2.1, 26, 4]} />
      </mesh>
    </group>
  );
}

/* ---------------------------------------------------------------------------
 * 02 — FORGE WARD: a broken ring wall around the Forge, open toward the Void.
 * (The Forge itself is `regions/forge/ForgeRegion`, M4.)
 * ------------------------------------------------------------------------- */
function ForgeWard() {
  const walls = useMemo<InstancePlacement[]>(() => {
    const rand = createRandom(131);
    const isOpen = (bearing: number) => FORGE_WARD.openings.some(([from, to]) => bearing >= from && bearing <= to);
    const items: InstancePlacement[] = [];
    for (let bearing = 66; bearing <= 294; bearing += 12) {
      if (isOpen(bearing) || rand() < 0.2) continue;
      const height = range(rand, 4, 7.5);
      const b = bearing * DEG;
      items.push({
        position: [Math.sin(b) * FORGE_WARD.radius, height / 2, Math.cos(b) * FORGE_WARD.radius],
        rotation: [0, b, 0],
        scale: [range(rand, 8.5, 10.5), height, 2.6],
      });
    }
    return items;
  }, []);

  return <InstancedSet geometry={unitBox} material={darkStoneMaterial} items={walls} />;
}

/* ---------------------------------------------------------------------------
 * 03 — BLUEPRINT ARCHIVE: an ordered, orthogonal skyline and open construction frames.
 * ------------------------------------------------------------------------- */
function BlueprintArchive() {
  const top = BLUEPRINT_ARCHIVE.top;

  const towers = useMemo<InstancePlacement[]>(() => {
    const rand = createRandom(149);
    const items: InstancePlacement[] = [];
    for (let x = 136; x <= 178; x += 7) {
      for (let z = -62; z <= -30; z += 8) {
        if (rand() < 0.5) continue;
        // Taller toward the north side: the skyline steps up away from the Forge.
        const height = range(rand, 6, 14) + (-30 - z) * 0.45;
        items.push({ position: [x, top + height / 2, z], scale: [4.6, height, 5.4] });
      }
    }
    return items;
  }, [top]);

  const frames = useMemo<InstancePlacement[]>(() => {
    const items: InstancePlacement[] = [];
    const frame = (cx: number, cz: number, height: number, half: number) => {
      for (const [dx, dz] of [[-half, -half], [half, -half], [half, half], [-half, half]]) {
        items.push({ position: [cx + dx, top + height / 2, cz + dz], scale: [0.6, height, 0.6] });
      }
      for (let level = 10; level <= height; level += 10) {
        const y = top + level;
        items.push({ position: [cx, y, cz - half], scale: [half * 2, 0.5, 0.5] });
        items.push({ position: [cx, y, cz + half], scale: [half * 2, 0.5, 0.5] });
        items.push({ position: [cx - half, y, cz], scale: [0.5, 0.5, half * 2] });
        items.push({ position: [cx + half, y, cz], scale: [0.5, 0.5, half * 2] });
      }
    };
    frame(170, -60, 40, 4.5);
    frame(140, -32, 20, 3.5);
    return items;
  }, [top]);

  return (
    <group>
      <Plateau outline={BLUEPRINT_ARCHIVE.outline} top={top} bottom={-2} topMaterial={groundMaterial} sideMaterial={darkStoneMaterial} />
      <InstancedSet geometry={unitBox} material={stoneMaterial} items={towers} />
      <InstancedSet geometry={unitBox} material={darkStoneMaterial} items={frames} />
    </group>
  );
}

/* ---------------------------------------------------------------------------
 * 04 — PATH OF ASCENSION: terraces climbing to a summit at the cliff edge,
 * one milestone stone per terrace, a slender beacon at the top.
 * ------------------------------------------------------------------------- */
function PathOfAscension() {
  // Overlapping tapered mesas: each terrace's flat top sits at its elevation, and
  // the wider bases merge into one stepped massif climbing toward the cliffs.
  const mesas = useMemo<InstancePlacement[]>(() => {
    const rand = createRandom(211);
    return ASCENSION_TERRACES.map((t) => {
      const height = t.top + 4;
      return {
        position: [t.center[0], t.top - height / 2, t.center[1]],
        rotation: [0, range(rand, 0, Math.PI * 2), 0],
        scale: [t.radius * range(rand, 0.9, 1.15), height, t.radius * range(rand, 0.9, 1.15)],
      };
    });
  }, []);

  const milestones = useMemo<InstancePlacement[]>(
    () =>
      ASCENSION_TERRACES.map((t, i) => {
        const height = 5 + i * 0.8;
        return { position: [t.center[0] + 5, t.top + height / 2, t.center[1] + 7], rotation: [0, i * 0.35, 0], scale: [1.6, height, 1] };
      }),
    [],
  );

  const summit = ASCENSION_TERRACES[ASCENSION_TERRACES.length - 1];

  return (
    <group>
      <InstancedSet geometry={unitMesa} material={darkStoneMaterial} items={mesas} />
      <InstancedSet geometry={unitBox} material={stoneMaterial} items={milestones} />
      <mesh material={stoneMaterial} position={[summit.center[0], summit.top + 10, summit.center[1]]}>
        <cylinderGeometry args={[0.45, 1.3, 20, 4]} />
      </mesh>
      <mesh geometry={unitBox} material={emberMaterial} position={[summit.center[0], summit.top + 20.4, summit.center[1]]} scale={0.45} />
    </group>
  );
}

/* ---------------------------------------------------------------------------
 * 06 — THE HORIZON: the unfinished northern tip. A half-built arch, a ledge that
 * reaches out over the abyss, and fragments drifting on beyond the edge.
 * ------------------------------------------------------------------------- */
function Horizon() {
  const [hx, , hz] = HORIZON.anchor;

  const blocks = useMemo<InstancePlacement[]>(() => {
    const rand = createRandom(173);
    return Array.from({ length: 7 }, () => {
      const s = range(rand, 1, 2.4);
      return {
        position: [hx + range(rand, -16, 14), s / 2, hz + range(rand, 2, 16)],
        rotation: [0, range(rand, 0, 3), 0],
        scale: [s * range(rand, 1, 2), s, s],
      };
    });
  }, [hx, hz]);

  const beyond = useMemo<InstancePlacement[]>(
    () => [
      // The ledge's unfinished bridge, ending in mid-air…
      { position: [hx + 2, -0.6, hz - 49], scale: [4, 1, 3] },
      { position: [hx + 3, -1, hz - 58], scale: [3.6, 1, 2.8] },
      { position: [hx + 5, -1.6, hz - 70], scale: [3, 1, 2.4] },
    ],
    [hx, hz],
  );

  const drift = useMemo<InstancePlacement[]>(
    () => HORIZON.beyond.map((position, i) => ({ position, rotation: [i, i * 0.7, 0], scale: [6 - i * 1.2, 5 - i, 6 - i * 1.2] as Vec3 })),
    [],
  );

  return (
    <group>
      {/* Unfinished arch: one complete pillar, one broken, a lintel only half-placed */}
      <mesh geometry={unitBox} material={stoneMaterial} position={[hx - 6, 6, hz - 5]} scale={[1.6, 12, 1.8]} />
      <mesh geometry={unitBox} material={stoneMaterial} position={[hx + 6, 3.25, hz - 5]} scale={[1.6, 6.5, 1.8]} />
      <mesh geometry={unitBox} material={darkStoneMaterial} position={[hx - 3.5, 12.6, hz - 5]} rotation={[0, 0, -0.06]} scale={[7, 1.2, 2]} />
      {/* Ledge cantilevered past the cliff edge, facing the horizon light */}
      <mesh geometry={unitBox} material={darkStoneMaterial} position={[hx + 2, -0.7, hz - 27]} scale={[10, 1.4, 34]} />
      <InstancedSet geometry={unitBox} material={darkStoneMaterial} items={blocks} />
      <InstancedSet geometry={unitBox} material={darkStoneMaterial} items={beyond} />
      <InstancedSet geometry={unitShard} material={darkStoneMaterial} items={drift} />
    </group>
  );
}

export default function RegionBlockouts() {
  return (
    <group>
      <OriginSanctum />
      <ForgeWard />
      <BlueprintArchive />
      <PathOfAscension />
      <Horizon />
    </group>
  );
}
