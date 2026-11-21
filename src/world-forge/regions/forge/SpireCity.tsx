import { useEffect, useMemo } from 'react';
import { BoxGeometry, Color, ConeGeometry, CylinderGeometry, MeshBasicMaterial, MeshStandardMaterial } from 'three';
import { createRandom } from '../../core/random';
import { mergeParts, placement, type Part } from '../../core/mergeStatic';
import { BLUEPRINT } from '../../look/palette';
import { CITY, TERRACES } from './hubLayout';

interface Ring {
  /** Share of the city radius, tower count, terrace the towers stand on, height and width ranges (shares). */
  r: number;
  count: number;
  terrace: number;
  height: [number, number];
  width: [number, number];
}

/** Cathedral profile: tallest toward the centre, falling away in rings (P1 approved language, hub scale). */
const RINGS: readonly Ring[] = [
  { r: 0.14, count: 6, terrace: 2, height: [0.52, 0.68], width: [0.06, 0.075] },
  { r: 0.26, count: 9, terrace: 2, height: [0.38, 0.52], width: [0.05, 0.065] },
  { r: 0.4, count: 13, terrace: 2, height: [0.26, 0.4], width: [0.045, 0.058] },
  { r: 0.56, count: 18, terrace: 1, height: [0.16, 0.28], width: [0.04, 0.052] },
  { r: 0.72, count: 24, terrace: 1, height: [0.1, 0.18], width: [0.036, 0.046] },
  { r: 0.88, count: 30, terrace: 0, height: [0.05, 0.11], width: [0.03, 0.04] },
];

/**
 * The golden spire city: stepped terraces, rings of hexagonal towers with tall roofs
 * rising to the central spire (the world axis), lit window strips, gold tips on the
 * tallest towers, and low halls filling the terraces. Baked per material (3 draws).
 */
export default function SpireCity() {
  const geometry = useMemo(() => {
    const rand = createRandom(17);
    const body = new CylinderGeometry(0.92, 1, 1, 6, 1);
    const roof = new ConeGeometry(1, 1, 6, 1);
    const block = new BoxGeometry(1, 1, 1);
    const terrace = new CylinderGeometry(1, 1.03, 1, 16, 1);
    const pane = new BoxGeometry(1, 1, 1);
    const stone: Part[] = [];
    const base: Part[] = [];
    const gold: Part[] = [];
    const H = CITY.centralHeight;
    const R = CITY.radius;

    TERRACES.forEach((t, i) => base.push([terrace, placement([0, (t.bottom + t.top) / 2, 0], [0, i * 0.2, 0], [t.radius, t.top - t.bottom, t.radius])]));

    const tower = (x: number, z: number, groundY: number, h: number, w: number) => {
      const bodyH = h * 0.62;
      const roofH = h * 0.38;
      const yaw = rand() * Math.PI;
      stone.push([body, placement([x, groundY + bodyH / 2, z], [0, yaw, 0], [w, bodyH, w])]);
      stone.push([roof, placement([x, groundY + bodyH + roofH / 2, z], [0, yaw, 0], [w * 1.12, roofH, w * 1.12])]);
      const strips = h > H * 0.3 ? 3 : h > H * 0.15 ? 2 : 1;
      for (let s = 0; s < strips; s++) {
        const a = yaw + (s / strips) * Math.PI * 2;
        const sh = bodyH * (0.35 + rand() * 0.3);
        const sy = groundY + bodyH * (0.2 + rand() * 0.25) + sh / 2;
        gold.push([pane, placement([x + Math.sin(a) * w * 0.93, sy, z + Math.cos(a) * w * 0.93], [0, a, 0], [w * 0.16, sh, w * 0.05])]);
      }
      if (h > H * 0.4) gold.push([roof, placement([x, groundY + h + w * 0.5, z], [0, 0, 0], [w * 0.18, w * 1.4, w * 0.18])]);
    };

    // The central spire: the world axis (≈ 320 m).
    tower(0, 0, TERRACES[2].top, H, R * 0.16);
    for (const ring of RINGS) {
      for (let i = 0; i < ring.count; i++) {
        if (rand() < 0.07) continue;
        const a = (i / ring.count) * Math.PI * 2 + rand() * 0.18;
        const d = R * ring.r * (0.93 + rand() * 0.14);
        const h = H * (ring.height[0] + rand() * (ring.height[1] - ring.height[0]));
        const w = R * (ring.width[0] + rand() * (ring.width[1] - ring.width[0]));
        tower(Math.sin(a) * d, Math.cos(a) * d, TERRACES[ring.terrace].top, h, w);
      }
    }
    // Low halls filling the terraces: the city's mass.
    for (let i = 0; i < 70; i++) {
      const a = rand() * Math.PI * 2;
      const d = R * (0.45 + rand() * 0.52);
      const terraceTop = d > TERRACES[1].radius ? TERRACES[0].top : d > TERRACES[2].radius ? TERRACES[1].top : TERRACES[2].top;
      const w = R * (0.05 + rand() * 0.07);
      const h = H * (0.025 + rand() * 0.04);
      stone.push([block, placement([Math.sin(a) * d, terraceTop + h / 2, Math.cos(a) * d], [0, a, 0], [w, h, w * (0.6 + rand())])]);
    }

    const merged = { stone: mergeParts(stone), base: mergeParts(base), gold: mergeParts(gold) };
    [body, roof, block, terrace, pane].forEach((g) => g.dispose());
    return merged;
  }, []);
  useEffect(() => () => Object.values(geometry).forEach((g) => g.dispose()), [geometry]);

  const materials = useMemo(
    () => ({
      stone: new MeshStandardMaterial({ color: '#2a2740', roughness: 0.8, metalness: 0.25, flatShading: true, emissive: new Color(BLUEPRINT.gold.deep), emissiveIntensity: 0.05 }),
      base: new MeshStandardMaterial({ color: BLUEPRINT.stone.mid, roughness: 0.9, metalness: 0.1, flatShading: true }),
      gold: new MeshBasicMaterial({ color: new Color(BLUEPRINT.gold.core).multiplyScalar(2.4), toneMapped: false }),
    }),
    [],
  );
  useEffect(() => () => Object.values(materials).forEach((m) => m.dispose()), [materials]);

  return (
    <group>
      <mesh geometry={geometry.base} material={materials.base} />
      <mesh geometry={geometry.stone} material={materials.stone} />
      <mesh geometry={geometry.gold} material={materials.gold} />
    </group>
  );
}
