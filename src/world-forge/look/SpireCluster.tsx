import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BoxGeometry, Color, ConeGeometry, CylinderGeometry, MeshBasicMaterial, MeshStandardMaterial, type Group } from 'three';
import { createRandom } from '../core/random';
import { mergeParts, placement, type Part } from '../core/mergeStatic';
import { BLUEPRINT } from './palette';

interface SpireClusterProps {
  /** Radius of the city footprint and height of the central tower (m). */
  radius: number;
  height: number;
  seed: number;
  animate: boolean;
}

/**
 * The golden spire city (blueprint "World Forge — central hub"): a cathedral-like
 * mass of towers on stepped terraces, rising to a massive central tower. It has
 * lit windows, gold spire tips on the tallest towers, the Forge Core beam and
 * tilted golden halo rings. Static parts are baked per material (a few draws).
 */
export default function SpireCluster({ radius, height, seed, animate }: SpireClusterProps) {
  const rings = useRef<Group>(null);

  const geometry = useMemo(() => {
    const rand = createRandom(seed);
    const body = new CylinderGeometry(0.92, 1, 1, 6, 1);
    const roof = new ConeGeometry(1, 1, 6, 1);
    const block = new BoxGeometry(1, 1, 1);
    const terrace = new CylinderGeometry(1, 1.04, 1, 12, 1);
    const pane = new BoxGeometry(1, 1, 1);
    const stone: Part[] = [];
    const base: Part[] = [];
    const gold: Part[] = [];

    // Stepped terraces the city stands on.
    base.push([terrace, placement([0, 2, 0], [0, 0, 0], [radius * 1.08, 4, radius * 1.08])]);
    base.push([terrace, placement([0, 6.5, 0], [0, 0.26, 0], [radius * 0.78, 5, radius * 0.78])]);
    base.push([terrace, placement([0, 11.5, 0], [0, 0, 0], [radius * 0.46, 5, radius * 0.46])]);

    /** A tower: hexagonal body, tall roof spire, lit window strips, and a gold tip on the tall ones. */
    const tower = (x: number, z: number, groundY: number, h: number, w: number) => {
      const bodyH = h * 0.62;
      const roofH = h * 0.38;
      const yaw = rand() * Math.PI;
      stone.push([body, placement([x, groundY + bodyH / 2, z], [0, yaw, 0], [w, bodyH, w])]);
      stone.push([roof, placement([x, groundY + bodyH + roofH / 2, z], [0, yaw, 0], [w * 1.12, roofH, w * 1.12])]);
      const strips = h > height * 0.3 ? 3 : h > height * 0.15 ? 2 : 1;
      for (let s = 0; s < strips; s++) {
        const a = yaw + (s / strips) * Math.PI * 2;
        const sh = bodyH * (0.35 + rand() * 0.3);
        const sy = groundY + bodyH * (0.2 + rand() * 0.25) + sh / 2;
        gold.push([pane, placement([x + Math.sin(a) * w * 0.93, sy, z + Math.cos(a) * w * 0.93], [0, a, 0], [w * 0.16, sh, w * 0.05])]);
      }
      if (h > height * 0.45) gold.push([roof, placement([x, groundY + h + w * 0.5, z], [0, 0, 0], [w * 0.18, w * 1.4, w * 0.18])]);
    };

    // The central tower: the world axis.
    tower(0, 0, 14, height, radius * 0.15);
    // Rings of towers, tallest toward the centre (a cathedral profile).
    const rings = [
      { r: 0.24, count: 6, ground: 14, scale: [0.55, 0.72], width: [0.075, 0.095] },
      { r: 0.42, count: 10, ground: 9, scale: [0.32, 0.5], width: [0.06, 0.08] },
      { r: 0.66, count: 16, ground: 4, scale: [0.18, 0.32], width: [0.05, 0.07] },
      { r: 0.92, count: 22, ground: 0, scale: [0.08, 0.18], width: [0.045, 0.06] },
    ];
    for (const ring of rings) {
      for (let i = 0; i < ring.count; i++) {
        if (rand() < 0.08) continue;
        const a = (i / ring.count) * Math.PI * 2 + rand() * 0.2;
        const d = radius * ring.r * (0.92 + rand() * 0.16);
        const h = height * (ring.scale[0] + rand() * (ring.scale[1] - ring.scale[0]));
        const w = radius * (ring.width[0] + rand() * (ring.width[1] - ring.width[0]));
        tower(Math.sin(a) * d, Math.cos(a) * d, ring.ground, h, w);
      }
    }
    // Low halls filling the outer terrace: the city's mass.
    for (let i = 0; i < 40; i++) {
      const a = rand() * Math.PI * 2;
      const d = radius * (0.5 + rand() * 0.48);
      const w = radius * (0.06 + rand() * 0.08);
      const h = height * (0.03 + rand() * 0.05);
      stone.push([block, placement([Math.sin(a) * d, (d > radius * 0.75 ? 4 : 9) + h / 2, Math.cos(a) * d], [0, a, 0], [w, h, w * (0.6 + rand())])]);
    }

    const merged = { stone: mergeParts(stone), base: mergeParts(base), gold: mergeParts(gold) };
    [body, roof, block, terrace, pane].forEach((g) => g.dispose());
    return merged;
  }, [radius, height, seed]);
  useEffect(() => () => Object.values(geometry).forEach((g) => g.dispose()), [geometry]);

  const materials = useMemo(
    () => ({
      stone: new MeshStandardMaterial({ color: '#2a2740', roughness: 0.8, metalness: 0.25, flatShading: true, emissive: new Color(BLUEPRINT.gold.deep), emissiveIntensity: 0.05 }),
      base: new MeshStandardMaterial({ color: BLUEPRINT.stone.mid, roughness: 0.9, metalness: 0.1, flatShading: true }),
      gold: new MeshBasicMaterial({ color: new Color(BLUEPRINT.gold.core).multiplyScalar(2.4), toneMapped: false }),
      beamCore: new MeshBasicMaterial({ color: new Color(BLUEPRINT.gold.hot).multiplyScalar(1.6), transparent: true, opacity: 0.85, blending: AdditiveBlending, depthWrite: false, toneMapped: false }),
      beamGlow: new MeshBasicMaterial({ color: new Color(BLUEPRINT.gold.accent), transparent: true, opacity: 0.18, blending: AdditiveBlending, depthWrite: false, toneMapped: false }),
      halo: new MeshBasicMaterial({ color: new Color(BLUEPRINT.gold.accent).multiplyScalar(2), toneMapped: false }),
    }),
    [],
  );
  useEffect(() => () => Object.values(materials).forEach((m) => m.dispose()), [materials]);

  useFrame((_, delta) => {
    if (animate && rings.current) rings.current.rotation.y += Math.min(delta, 0.1) * 0.03;
  });

  const top = 14 + height;
  return (
    <group>
      <mesh geometry={geometry.base} material={materials.base} />
      <mesh geometry={geometry.stone} material={materials.stone} />
      <mesh geometry={geometry.gold} material={materials.gold} />
      {/* The Forge Core beam: a white-gold core inside a wide golden glow, rising far above the city. */}
      <mesh material={materials.beamCore} position={[0, top + height * 1.5, 0]} renderOrder={5}>
        <cylinderGeometry args={[radius * 0.03, radius * 0.05, height * 3, 16, 1, true]} />
      </mesh>
      <mesh material={materials.beamGlow} position={[0, top + height * 1.5, 0]} renderOrder={5}>
        <cylinderGeometry args={[radius * 0.1, radius * 0.18, height * 3, 24, 1, true]} />
      </mesh>
      {/* Golden halo rings (observation rings), slightly tilted, turning very slowly. */}
      <group ref={rings}>
        <mesh material={materials.halo} position={[0, height * 0.62, 0]} rotation={[Math.PI / 2 - 0.12, 0, 0]}>
          <torusGeometry args={[radius * 0.95, radius * 0.01, 6, 128]} />
        </mesh>
        <mesh material={materials.halo} position={[0, height * 0.38, 0]} rotation={[Math.PI / 2 + 0.08, 0.3, 0]}>
          <torusGeometry args={[radius * 1.3, radius * 0.007, 6, 128]} />
        </mesh>
      </group>
      {/* Golden ring inlaid in the outer terrace. */}
      <mesh material={materials.halo} position={[0, 4.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 1.0, radius * 1.03, 96]} />
      </mesh>
      <pointLight color={BLUEPRINT.gold.core} intensity={height * height * 0.9} distance={height * 3} decay={2} position={[0, height * 0.45, 0]} />
    </group>
  );
}
