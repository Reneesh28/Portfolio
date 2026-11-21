import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BoxGeometry, Color, ConeGeometry, CylinderGeometry, MeshBasicMaterial, MeshStandardMaterial, RingGeometry, type Points } from 'three';
import { createRandom, range } from '../../core/random';
import { mergeParts, placement, type Part } from '../../core/mergeStatic';
import { BLUEPRINT } from '../../look/palette';
import Floating from './Floating';
import { GATE_Z, PORTAL, type VoidLayout } from './layout';
import { createDustTexture } from './materials';

interface VoidEnvironmentProps {
  layout: VoidLayout;
  animate: boolean;
}

type Vec3 = [number, number, number];

/** The arrival platform (blueprint ≈ 60 m): a two-tier stone dais under the portal, steps toward the visitor, a violet rune ring. */
const PLATFORM = { radius: 30, upper: 21, lowerH: 1.2, upperH: 0.8 } as const;

function buildStatic(gateX: number) {
  const rand = createRandom(29);
  const disc = new CylinderGeometry(1, 1.03, 1, 40, 1);
  const box = new BoxGeometry(1, 1, 1);
  const spire = new ConeGeometry(1, 1, 5, 1);
  const column = new CylinderGeometry(1, 1.08, 1, 7, 1);
  const rune = new RingGeometry(PLATFORM.upper - 3.2, PLATFORM.upper - 2.4, 96);
  const runeInner = new RingGeometry(PORTAL.radius * 0.55, PORTAL.radius * 0.6, 64);
  const stone: Part[] = [];
  const runes: Part[] = [];

  stone.push([disc, placement([gateX, PLATFORM.lowerH / 2, GATE_Z], [0, 0, 0], [PLATFORM.radius, PLATFORM.lowerH, PLATFORM.radius])]);
  stone.push([disc, placement([gateX, PLATFORM.lowerH + PLATFORM.upperH / 2, GATE_Z], [0, 0.2, 0], [PLATFORM.upper, PLATFORM.upperH, PLATFORM.upper])]);
  const top = PLATFORM.lowerH + PLATFORM.upperH + 0.03;
  runes.push([rune, placement([gateX, top, GATE_Z], [-Math.PI / 2, 0, 0])]);
  runes.push([runeInner, placement([gateX, top, GATE_Z], [-Math.PI / 2, 0, 0])]);
  // Portal footing: two stone blocks the ring stands in.
  for (const side of [-1, 1]) stone.push([box, placement([gateX + side * PORTAL.radius * 0.55, top + 1.6, GATE_Z], [0, 0, 0], [5, 3.2, 4.5])]);
  // Steps from the visitor's side up onto the dais.
  for (let i = 0; i < 3; i++) {
    const z = GATE_Z + PLATFORM.radius + 1.2 - i * 1.4;
    stone.push([box, placement([gateX * 0.4, 0.2 + i * 0.35, z + 1.5], [0, 0, 0], [14 - i * 1.5, 0.4 + i * 0.7, 1.6])]);
  }

  // Standing ruin spires behind and beside the portal (dark jagged silhouettes, taller on the portal side).
  for (let i = 0; i < 16; i++) {
    const side = i % 2 === 0 ? 1 : -1;
    const x = gateX + side * range(rand, 30, 66) + (side < 0 ? -8 : 0);
    const z = GATE_Z - range(rand, 6, 62);
    const h = side > 0 ? range(rand, 18, 46) : range(rand, 10, 26);
    const w = range(rand, 3, 7);
    stone.push([spire, placement([x, h / 2 - 1, z], [range(rand, -0.12, 0.12), rand() * 3, range(rand, -0.12, 0.12)], [w, h, w * range(rand, 0.6, 1)])]);
  }
  // Broken columns on the platform's rim.
  for (let i = 0; i < 7; i++) {
    const a = Math.PI * (0.15 + (i / 6) * 0.7) + (i % 2 ? 0.1 : -0.1);
    const x = gateX + Math.cos(a) * (PLATFORM.radius - 3) * (i < 3 ? 1 : -1);
    const z = GATE_Z - Math.sin(a) * (PLATFORM.radius - 3);
    const h = range(rand, 4, 13);
    stone.push([column, placement([x, PLATFORM.lowerH + h / 2, z], [0, rand() * 3, 0], [1.4, h, 1.4])]);
  }

  const result = { stone: mergeParts(stone), runes: mergeParts(runes) };
  [disc, box, spire, column, rune, runeInner].forEach((g) => g.dispose());
  return result;
}

/** Ruins drifting around the portal: broken column drums and blocks, kept out of the portal's opening. */
function buildFloating(gateX: number) {
  const rand = createRandom(53);
  return Array.from({ length: 11 }, (_, i) => {
    // Most drift on the portal's far side; the few on the text side stay low (never over the hero text).
    const side = i % 3 === 0 ? -1 : 1;
    const x = gateX + side * range(rand, PORTAL.radius + 5, PORTAL.radius + 26);
    const y = side < 0 ? range(rand, 1.5, 7) : range(rand, 6, 34);
    const size = range(rand, 0.9, 2.6);
    return {
      key: i,
      position: [x, y, GATE_Z + range(rand, -14, 8)] as Vec3,
      rotation: [range(rand, 0, 3), range(rand, 0, 3), range(rand, 0, 3)] as Vec3,
      scale: [size, size * range(rand, 0.8, 2.2), size] as Vec3,
      column: rand() < 0.5,
      phase: range(rand, 0, Math.PI * 2),
      speed: range(rand, 0.18, 0.36),
    };
  });
}

function Dust({ count, centerX, animate }: { count: number; centerX: number; animate: boolean }) {
  const ref = useRef<Points>(null);
  const positions = useMemo(() => {
    const rand = createRandom(71);
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      data[i * 3] = range(rand, -40, 40);
      data[i * 3 + 1] = range(rand, 0.4, 30);
      data[i * 3 + 2] = range(rand, -50, 30);
    }
    return data;
  }, [count]);
  const sprite = useMemo(() => createDustTexture(), []);
  useEffect(() => () => sprite.dispose(), [sprite]);
  useFrame((_, delta) => {
    if (animate && ref.current) ref.current.rotation.y += delta * 0.006;
  });
  return (
    <points ref={ref} position={[centerX, 0, GATE_Z]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial map={sprite} color="#cbb8ff" size={0.22} sizeAttenuation transparent opacity={0.5} depthWrite={false} blending={AdditiveBlending} />
    </points>
  );
}

/**
 * Void-local scenery (P4 portal realm): the arrival platform with its violet rune
 * ring and steps, standing ruin spires, broken columns, ruins drifting around the
 * portal, and violet dust. The ground is the Void island; the sky is the world's.
 */
export default function VoidEnvironment({ layout, animate }: VoidEnvironmentProps) {
  const { gateX, dustCount } = layout;
  const baked = useMemo(() => buildStatic(gateX), [gateX]);
  useEffect(() => () => Object.values(baked).forEach((g) => g.dispose()), [baked]);
  const floating = useMemo(() => buildFloating(gateX), [gateX]);

  const materials = useMemo(
    () => ({
      stone: new MeshStandardMaterial({ color: '#2b2640', roughness: 0.92, metalness: 0.06, flatShading: true }),
      runes: new MeshBasicMaterial({ color: new Color(BLUEPRINT.portal).multiplyScalar(1.6), toneMapped: false }),
      drift: new MeshStandardMaterial({ color: '#3a3454', roughness: 0.9, metalness: 0.05, flatShading: true }),
    }),
    [],
  );
  useEffect(() => () => Object.values(materials).forEach((m) => m.dispose()), [materials]);
  const geometries = useMemo(() => ({ box: new BoxGeometry(1, 1, 1), drum: new CylinderGeometry(1, 1, 1, 7) }), []);
  useEffect(() => () => Object.values(geometries).forEach((g) => g.dispose()), [geometries]);

  return (
    <group>
      <mesh geometry={baked.stone} material={materials.stone} />
      <mesh geometry={baked.runes} material={materials.runes} />
      {floating.map(({ key, position, rotation, scale, column, phase, speed }) => (
        <Floating key={key} position={position} phase={phase} speed={speed} amplitude={0.5} animate={animate}>
          <mesh geometry={column ? geometries.drum : geometries.box} material={materials.drift} rotation={rotation} scale={scale} />
        </Floating>
      ))}
      <Dust count={dustCount} centerX={gateX} animate={animate} />
    </group>
  );
}
