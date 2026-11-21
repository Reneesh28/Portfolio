import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Color, type BufferAttribute, type PointLight, type Points } from 'three';
import { createRandom } from '../../core/random';
import { useExperienceStore } from '../../experience/ExperienceContext';
import { createDustTexture } from '../void/materials';
import { ACTIVATION, activationEnvelope, CORE, EMBERS, SEAM } from './forgeLayout';
import { forgeSeamGlowMaterial, SEAM_GLOW } from './forgeMaterials';
import { createGradientCylinder } from './seamGeometry';

interface ForgeAtmosphereProps {
  embers: number;
  /** False under reduced motion: no pulse, no embers. */
  animate: boolean;
}

const EMBER_COLOR = new Color('#ffb15c');

/** Faint embers rising through the seam and fading out below the crown. `boost` speeds them during activation. */
function Embers({ count, boost }: { count: number; boost: { current: number } }) {
  const ref = useRef<Points>(null);
  const sprite = useMemo(() => createDustTexture(), []);
  useEffect(() => () => sprite.dispose(), [sprite]);

  const { positions, colors, speeds } = useMemo(() => {
    const rand = createRandom(401);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * EMBERS.radius;
      positions.set([Math.cos(a) * r, EMBERS.bottom + rand() * (EMBERS.top - EMBERS.bottom), Math.sin(a) * r], i * 3);
      speeds[i] = EMBERS.minSpeed + rand() * (EMBERS.maxSpeed - EMBERS.minSpeed);
    }
    return { positions, colors, speeds };
  }, [count]);

  useFrame((_, delta) => {
    const points = ref.current;
    if (!points) return;
    const step = Math.min(delta, 0.1) * (1 + boost.current * ACTIVATION.emberBoost);
    const span = EMBERS.top - EMBERS.bottom;
    // Simulation state lives in the geometry's own buffers (written in place each frame).
    const position = points.geometry.getAttribute('position') as BufferAttribute;
    const color = points.geometry.getAttribute('color') as BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = position.getY(i) + speeds[i] * step;
      if (y > EMBERS.top) y -= span;
      position.setY(i, y);
      // Fade in just above the crucible, fade out below the crown.
      const t = (y - EMBERS.bottom) / span;
      const fade = Math.min(1, t / 0.12) * Math.min(1, (1 - t) / 0.35);
      color.setXYZ(i, EMBER_COLOR.r * fade, EMBER_COLOR.g * fade, EMBER_COLOR.b * fade);
    }
    position.needsUpdate = true;
    color.needsUpdate = true;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={sprite}
        vertexColors
        size={EMBERS.size}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

/**
 * Atmosphere: the warm core light (the only warm light in the world, with a short
 * reach), the seam's soft glow, and the embers. The glow breathes slowly, and swells
 * once when the journey arrives at the Forge (activation; never blocks input).
 */
export default function ForgeAtmosphere({ embers, animate }: ForgeAtmosphereProps) {
  const light = useRef<PointLight>(null);
  const glow = useMemo(
    () =>
      createGradientCylinder(SEAM.glowTop, SEAM.glowBottom, CORE.seamTop - CORE.seamBottom, 16, SEAM_GLOW, new Color(0, 0, 0), true),
    [],
  );
  useEffect(() => () => glow.dispose(), [glow]);

  const store = useExperienceStore();
  // Activation: when the journey settles on the Forge, the seam swells once (skipped under reduced motion).
  const arrival = useRef<{ atForge: boolean; start: number }>({ atForge: false, start: -Infinity });
  const boost = useRef(0);

  useFrame(({ clock }) => {
    const now = clock.elapsedTime;
    const { currentRegion, phase } = store.getSnapshot();
    const atForge = currentRegion === 'world-forge' && phase === 'idle';
    if (atForge && !arrival.current.atForge && animate) arrival.current.start = now;
    arrival.current.atForge = atForge;
    boost.current = animate ? activationEnvelope(now - arrival.current.start) : 0;

    const breath = animate ? Math.sin((now / SEAM.pulsePeriod) * Math.PI * 2) : 0;
    forgeSeamGlowMaterial.opacity = SEAM.glowOpacity + breath * SEAM.pulseDepth + boost.current * ACTIVATION.glowBoost;
    if (light.current) light.current.intensity = SEAM.light.intensity * (1 + breath * 0.08 + boost.current * ACTIVATION.lightBoost);
  });

  return (
    <group>
      <pointLight
        ref={light}
        position={[0, CORE.lightY, 0]}
        color={SEAM.light.color}
        intensity={SEAM.light.intensity}
        distance={SEAM.light.distance}
        decay={SEAM.light.decay}
      />
      <mesh geometry={glow} material={forgeSeamGlowMaterial} position={[0, (CORE.seamBottom + CORE.seamTop) / 2, 0]} renderOrder={1} />
      {animate && embers > 0 && <Embers count={embers} boost={boost} />}
    </group>
  );
}
