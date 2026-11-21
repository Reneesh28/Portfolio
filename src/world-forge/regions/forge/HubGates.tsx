import { useEffect, useMemo } from 'react';
import { BoxGeometry, Color, ConeGeometry, MeshBasicMaterial, MeshStandardMaterial, OctahedronGeometry, RingGeometry, TorusGeometry } from 'three';
import { atBearing } from '../../data/worldGeography';
import { mergeParts, placement, type Part } from '../../core/mergeStatic';
import { BLUEPRINT } from '../../look/palette';
import { GATE, GATES, HALL, HALL_BEARINGS, HUB } from './hubLayout';

const DEG = Math.PI / 180;

/**
 * The hub's outer ring: seven gates (six to the regions, one to the Projects terrace),
 * archive halls between them, and golden inlays (radial lines from the platform to
 * each gate, a ring at the gate line). Stone, gold and per-gate accents are baked.
 */
export default function HubGates() {
  const baked = useMemo(() => {
    const box = new BoxGeometry(1, 1, 1);
    const arch = new TorusGeometry(1, 0.16, 6, 20, Math.PI);
    const gem = new OctahedronGeometry(1, 0);
    const roof = new ConeGeometry(1, 1, 4, 1);
    const ring = new RingGeometry(HUB.gateRadius - 1.2, HUB.gateRadius + 1.2, 128);
    const platformRing = new RingGeometry(HUB.platformRadius + 2, HUB.platformRadius + 4, 96);
    const stone: Part[] = [];
    const gold: Part[] = [];
    const accents = new Map<string, Part[]>();

    for (const gate of GATES) {
      const yaw = gate.bearing * DEG;
      const [gx, , gz] = gate.position;
      const half = GATE.opening / 2 + GATE.pillar / 2;
      // Sideways (tangent) direction at the gate.
      const tx = Math.cos(yaw);
      const tz = -Math.sin(yaw);
      for (const side of [-1, 1]) {
        stone.push([box, placement([gx + tx * half * side, GATE.height / 2, gz + tz * half * side], [0, yaw, 0], [GATE.pillar, GATE.height, GATE.depth])]);
        // Glowing inner edge of each pillar.
        gold.push([box, placement([gx + tx * (GATE.opening / 2 + 0.3) * side, GATE.height * 0.42, gz + tz * (GATE.opening / 2 + 0.3) * side], [0, yaw, 0], [0.5, GATE.height * 0.7, 1.2])]);
      }
      // Lintel and arch.
      stone.push([box, placement([gx, GATE.height + 3, gz], [0, yaw, 0], [GATE.opening + GATE.pillar * 2 + 4, 6, GATE.depth + 1])]);
      stone.push([arch, placement([gx, GATE.height - 1, gz], [0, yaw, 0], [GATE.opening / 2, GATE.opening / 2.4, GATE.opening / 2])]);
      // Keystone crystal in the colour of the region the gate leads to.
      accents.set(gate.accent, [...(accents.get(gate.accent) ?? []), [gem, placement([gx, GATE.height + 10, gz], [0, yaw, 0], [2.6, 4, 2.6])] as Part]);
      // Radial golden inlay from the platform to the gate.
      const length = HUB.gateRadius - HUB.platformRadius - 10;
      const mid = atBearing(gate.bearing, HUB.platformRadius + 5 + length / 2, 0.15);
      gold.push([box, placement(mid, [0, yaw, 0], [1.4, 0.3, length])]);
    }

    for (const bearing of HALL_BEARINGS) {
      const yaw = bearing * DEG;
      const [x, , z] = atBearing(bearing, HALL.distance);
      // Hall body (long side tangent to the ring) and a pitched roof; lit slits along its outward face.
      stone.push([box, placement([x, HALL.height / 2, z], [0, yaw, 0], [HALL.length, HALL.height, HALL.depth])]);
      stone.push([roof, placement([x, HALL.height + 4, z], [0, yaw + Math.PI / 4, 0], [HALL.length * 0.72, 8, HALL.depth * 0.72])]);
      for (let i = -2; i <= 2; i++) {
        const [ox, , oz] = [Math.cos(yaw) * i * 8, 0, -Math.sin(yaw) * i * 8];
        const [fx, , fz] = atBearing(bearing, HALL.depth / 2 + 0.05);
        gold.push([box, placement([x + ox + fx, HALL.height * 0.45, z + oz + fz], [0, yaw, 0], [1.2, HALL.height * 0.5, 0.2])]);
      }
    }

    gold.push([ring, placement([0, 0.2, 0], [-Math.PI / 2, 0, 0])]);
    gold.push([platformRing, placement([0, 0.2, 0], [-Math.PI / 2, 0, 0])]);
    const result = {
      stone: mergeParts(stone),
      gold: mergeParts(gold),
      accents: [...accents.entries()].map(([color, parts]) => ({ color, geometry: mergeParts(parts) })),
    };
    [box, arch, gem, roof, ring, platformRing].forEach((g) => g.dispose());
    return result;
  }, []);
  useEffect(
    () => () => {
      baked.stone.dispose();
      baked.gold.dispose();
      baked.accents.forEach((a) => a.geometry.dispose());
    },
    [baked],
  );

  const materials = useMemo(
    () => ({
      stone: new MeshStandardMaterial({ color: '#2f2c45', roughness: 0.85, metalness: 0.2, flatShading: true }),
      gold: new MeshBasicMaterial({ color: new Color(BLUEPRINT.gold.accent).multiplyScalar(1.9), toneMapped: false }),
      accents: new Map(baked.accents.map((a) => [a.color, new MeshBasicMaterial({ color: new Color(a.color).multiplyScalar(1.9), toneMapped: false })])),
    }),
    [baked],
  );
  useEffect(
    () => () => {
      materials.stone.dispose();
      materials.gold.dispose();
      materials.accents.forEach((m) => m.dispose());
    },
    [materials],
  );

  return (
    <group>
      <mesh geometry={baked.stone} material={materials.stone} />
      <mesh geometry={baked.gold} material={materials.gold} />
      {baked.accents.map((a) => (
        <mesh key={a.color} geometry={a.geometry} material={materials.accents.get(a.color)} />
      ))}
    </group>
  );
}
