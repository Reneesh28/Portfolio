import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, type Mesh, type MeshBasicMaterial, type Points } from 'three';
import { createRandom, range } from '../../core/random';
import { voidBackdropOpacity } from '../../atmosphere/voidFade';
import { useExperienceStore } from '../../experience/ExperienceContext';
import Floating from './Floating';
import { BACKDROP_Z, backdropScale, CAMERA_HEIGHT, GATE_Z, sightLineX, type VoidLayout } from './layout';
import {
  createDustTexture,
  createHorizonGlowTexture,
  darkStoneMaterial,
  PALETTE,
  stoneMaterial,
  unitBox,
  unitRock,
  unitShard,
} from './materials';

interface VoidEnvironmentProps {
  layout: VoidLayout;
  animate: boolean;
}

type Vec3 = [number, number, number];

interface Placement {
  position: Vec3;
  rotation: Vec3;
  scale: Vec3;
}

/** Broken causeway on the camera→gate→Forge sight line: leads the eye through the opening. */
function buildCauseway(layout: VoidLayout): Placement[] {
  const rand = createRandom(11);
  const slabs: Placement[] = [];
  for (let z = layout.camera[2] - 5; z > -72; z -= 2.6) {
    if (z < GATE_Z + 3 && z > GATE_Z - 3) continue; // the plinth occupies this stretch
    if (rand() < 0.18) continue; // missing slabs: an ancient, broken path
    slabs.push({
      position: [sightLineX(layout, z) + range(rand, -0.25, 0.25), 0.1, z],
      rotation: [0, range(rand, -0.12, 0.12), 0],
      scale: [range(rand, 1.8, 2.4), range(rand, 0.18, 0.3), range(rand, 1.3, 1.8)],
    });
  }
  return slabs;
}

/** Large rock masses framing the shot left and right of the gateway. */
function buildFlankRocks(gateX: number): Placement[] {
  const rand = createRandom(23);
  const rocks: Placement[] = [];
  const sides: Array<[number, number]> = [
    [-1, 4],
    [1, 4],
  ];
  for (const [side, count] of sides) {
    for (let i = 0; i < count; i++) {
      const z = range(rand, -40, -90);
      const height = range(rand, 3, 9);
      rocks.push({
        position: [gateX + side * range(rand, 18, 40), height * 0.35, z],
        rotation: [range(rand, 0, 1), range(rand, 0, 6), range(rand, 0, 0.4)],
        scale: [range(rand, 3, 7), height, range(rand, 3, 6)],
      });
    }
  }
  return rocks;
}

/** Fragments suspended around the gateway: the world not yet assembled. */
function buildFragments(gateX: number): Array<Placement & { phase: number; speed: number }> {
  const rand = createRandom(53);
  return Array.from({ length: 7 }, () => {
    const size = range(rand, 0.18, 0.55);
    return {
      // Biased away from the left, where the hero text sits on wide screens.
      position: [gateX + range(rand, -5.5, 8), range(rand, 2.5, 11), GATE_Z + range(rand, -6, 3)] as Vec3,
      rotation: [range(rand, 0, 3), range(rand, 0, 3), range(rand, 0, 3)] as Vec3,
      scale: [size, size * range(rand, 0.6, 1.4), size] as Vec3,
      phase: range(rand, 0, Math.PI * 2),
      speed: range(rand, 0.2, 0.4),
    };
  });
}

function Dust({ count, centerX, animate }: { count: number; centerX: number; animate: boolean }) {
  const ref = useRef<Points>(null);
  const positions = useMemo(() => {
    const rand = createRandom(71);
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      data[i * 3] = range(rand, -26, 26);
      data[i * 3 + 1] = range(rand, 0.4, 14);
      data[i * 3 + 2] = range(rand, -46, 10);
    }
    return data;
  }, [count]);
  const sprite = useMemo(() => createDustTexture(), []);
  useEffect(() => () => sprite.dispose(), [sprite]);

  useFrame((_, delta) => {
    if (animate && ref.current) ref.current.rotation.y += delta * 0.006;
  });

  return (
    <points ref={ref} position={[centerX, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={sprite}
        color={PALETTE.dust}
        size={0.11}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

/**
 * Pale glow behind the Forge, far beyond the whole world. Scaled along camera rays
 * from its original depth, so the opening shot sees exactly the same glow.
 * It is a flat backdrop composed for the opening camera only: seen from anywhere
 * else its edges would show, so it fades out as the journey leaves the Void
 * (fully opaque at the Void stop — the approved opening is unchanged).
 */
function HorizonGlow({ layout }: { layout: VoidLayout }) {
  const store = useExperienceStore();
  const material = useRef<MeshBasicMaterial>(null);
  const mesh = useRef<Mesh>(null);
  const texture = useMemo(() => createHorizonGlowTexture(), []);
  useEffect(() => () => texture.dispose(), [texture]);
  const scale = backdropScale(layout);
  const y = CAMERA_HEIGHT + (70 - CAMERA_HEIGHT) * scale;

  useFrame(({ invalidate }) => {
    if (!material.current || !mesh.current) return;
    const opacity = voidBackdropOpacity(store.getJourney().position);
    if (opacity === material.current.opacity) return;
    material.current.opacity = opacity;
    mesh.current.visible = opacity > 0;
    // The journey may have moved after this frame's read: render once more to settle.
    invalidate();
  });

  return (
    <mesh ref={mesh} position={[sightLineX(layout, BACKDROP_Z), y, BACKDROP_Z]} renderOrder={-1}>
      <planeGeometry args={[1500 * scale, 640 * scale]} />
      <meshBasicMaterial ref={material} map={texture} transparent depthWrite={false} fog={false} toneMapped={false} />
    </mesh>
  );
}

/**
 * Void-local scenery around the gateway. The ground itself now belongs to the
 * world mainland (same surface height and material), and the distant ridges
 * became fixed world terrain.
 */
export default function VoidEnvironment({ layout, animate }: VoidEnvironmentProps) {
  const { gateX, dustCount } = layout;

  const causeway = useMemo(() => buildCauseway(layout), [layout]);
  const rocks = useMemo(() => buildFlankRocks(gateX), [gateX]);
  const fragments = useMemo(() => buildFragments(gateX), [gateX]);

  return (
    <group>
      <HorizonGlow layout={layout} />

      {causeway.map((slab, i) => (
        <mesh key={`slab-${i}`} geometry={unitBox} material={darkStoneMaterial} {...slab} />
      ))}

      {rocks.map((rock, i) => (
        <mesh key={`rock-${i}`} geometry={unitRock} material={darkStoneMaterial} {...rock} />
      ))}

      {fragments.map(({ position, rotation, scale, phase, speed }, i) => (
        <Floating key={`frag-${i}`} position={position} phase={phase} speed={speed} amplitude={0.25} animate={animate}>
          <mesh geometry={unitShard} material={stoneMaterial} rotation={rotation} scale={scale} />
        </Floating>
      ))}

      <Dust count={dustCount} centerX={gateX} animate={animate} />
    </group>
  );
}
