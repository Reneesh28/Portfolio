import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BufferAttribute, Color, CylinderGeometry, MeshBasicMaterial, type Group, type Mesh, type PointLight, type Points } from 'three';
import { createRandom } from '../../core/random';
import { createDustTexture } from '../void/materials';
import { useExperienceStore } from '../../experience/ExperienceContext';
import { BLUEPRINT } from '../../look/palette';
import { ACTIVATION, activationEnvelope, CITY_FLOOR, CORE, FOCUS_SUBDUE, RINGS } from './hubLayout';

/** Cylinder with vertex colours fading from `bottom` to black at the top (for additive glows). */
function fadingCylinder(radiusTop: number, radiusBottom: number, height: number, bottom: Color): CylinderGeometry {
  const g = new CylinderGeometry(radiusTop, radiusBottom, height, 24, 6, true);
  const pos = g.getAttribute('position');
  const colors = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const k = 1 - (pos.getY(i) / height + 0.5);
    colors.set([bottom.r * k, bottom.g * k, bottom.b * k], i * 3);
  }
  g.setAttribute('color', new BufferAttribute(colors, 3));
  return g;
}

const EMBERS = { radius: 24, bottom: CITY_FLOOR + 2, top: 260, minSpeed: 6, maxSpeed: 14, size: 1.6 } as const;
const EMBER_COLOR = new Color(BLUEPRINT.gold.core);

function Embers({ count, boost }: { count: number; boost: { current: number } }) {
  const ref = useRef<Points>(null);
  const sprite = useMemo(() => createDustTexture(), []);
  useEffect(() => () => sprite.dispose(), [sprite]);
  const { positions, colors, speeds } = useMemo(() => {
    const rand = createRandom(401);
    const p = new Float32Array(count * 3);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * EMBERS.radius;
      p.set([Math.cos(a) * r, EMBERS.bottom + rand() * (EMBERS.top - EMBERS.bottom), Math.sin(a) * r], i * 3);
      s[i] = EMBERS.minSpeed + rand() * (EMBERS.maxSpeed - EMBERS.minSpeed);
    }
    return { positions: p, colors: new Float32Array(count * 3), speeds: s };
  }, [count]);

  useFrame((_, delta) => {
    const points = ref.current;
    if (!points) return;
    const step = Math.min(delta, 0.1) * (1 + boost.current * ACTIVATION.emberBoost);
    const span = EMBERS.top - EMBERS.bottom;
    const position = points.geometry.getAttribute('position') as BufferAttribute;
    const color = points.geometry.getAttribute('color') as BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = position.getY(i) + speeds[i] * step;
      if (y > EMBERS.top) y -= span;
      position.setY(i, y);
      const t = (y - EMBERS.bottom) / span;
      const fade = Math.min(1, t / 0.1) * Math.min(1, (1 - t) / 0.4);
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
      <pointsMaterial map={sprite} vertexColors size={EMBERS.size} sizeAttenuation transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
    </points>
  );
}

/**
 * The Forge Core (blueprint "The Forge Core — energy source"): a white-gold beam
 * rising from the central spire far into the sky, a golden energy glow around the
 * spire's base, the observation rings (level 3), rising embers and the warm core
 * light. The glow breathes slowly and swells once when the journey arrives at the
 * Forge. Under reduced motion everything is still.
 */
export default function ForgeCore({ embers, animate }: { embers: number; animate: boolean }) {
  const store = useExperienceStore();
  const rings = useRef<Group>(null);
  const baseGlow = useRef<Mesh>(null);
  const light = useRef<PointLight>(null);
  const arrival = useRef({ atForge: false, start: -Infinity });
  const boost = useRef(0);
  const beamGlow = useRef<Mesh>(null);
  // 0 = full glow, 1 = subdued while a work is focused (M5.6).
  const quiet = useRef(0);

  const geometry = useMemo(
    () => ({ base: fadingCylinder(CORE.baseGlow.radius * 0.55, CORE.baseGlow.radius, CORE.baseGlow.height, new Color(BLUEPRINT.gold.accent)) }),
    [],
  );
  useEffect(() => () => geometry.base.dispose(), [geometry]);
  const materials = useMemo(
    () => ({
      beamCore: new MeshBasicMaterial({ color: new Color(BLUEPRINT.gold.hot).multiplyScalar(1.6), transparent: true, opacity: 0.85, blending: AdditiveBlending, depthWrite: false, toneMapped: false }),
      beamGlow: new MeshBasicMaterial({ color: new Color(BLUEPRINT.gold.accent), transparent: true, opacity: 0.16, blending: AdditiveBlending, depthWrite: false, toneMapped: false }),
      base: new MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.35, blending: AdditiveBlending, depthWrite: false, toneMapped: false }),
      ring: new MeshBasicMaterial({ color: new Color(BLUEPRINT.gold.accent).multiplyScalar(2), toneMapped: false }),
    }),
    [],
  );
  useEffect(() => () => Object.values(materials).forEach((m) => m.dispose()), [materials]);

  useFrame(({ clock }, delta) => {
    const now = clock.elapsedTime;
    const { currentRegion, phase, focusedProject } = store.getSnapshot();
    const atForge = currentRegion === 'world-forge' && phase === 'idle';
    if (atForge && !arrival.current.atForge && animate) arrival.current.start = now;
    arrival.current.atForge = atForge;
    boost.current = animate ? activationEnvelope(now - arrival.current.start) : 0;
    const breath = animate ? Math.sin((now / 6) * Math.PI * 2) : 0;
    const wantQuiet = focusedProject ? 1 : 0;
    const step = animate ? Math.min(delta, 0.1) / FOCUS_SUBDUE.seconds : 1;
    quiet.current += Math.max(-step, Math.min(step, wantQuiet - quiet.current));
    const subdue = 1 - (1 - FOCUS_SUBDUE.glow) * quiet.current;
    const glow = baseGlow.current?.material as MeshBasicMaterial | undefined;
    if (glow) glow.opacity = (0.35 + breath * 0.06 + boost.current * ACTIVATION.glowBoost) * subdue;
    const haze = beamGlow.current?.material as MeshBasicMaterial | undefined;
    if (haze) haze.opacity = 0.16 * subdue;
    if (light.current) light.current.intensity = CORE.light.intensity * (1 + breath * 0.06 + boost.current * ACTIVATION.lightBoost);
    if (animate && rings.current) rings.current.rotation.y += Math.min(delta, 0.1) * 0.02;
  });

  return (
    <group>
      <mesh material={materials.beamCore} position={[0, CORE.beamBottom + CORE.beamHeight / 2, 0]} renderOrder={5}>
        <cylinderGeometry args={[CORE.beamRadius, CORE.beamRadius * 1.3, CORE.beamHeight, 16, 1, true]} />
      </mesh>
      <mesh ref={beamGlow} material={materials.beamGlow} position={[0, CORE.beamBottom + CORE.beamHeight / 2, 0]} renderOrder={5}>
        <cylinderGeometry args={[CORE.glowRadius, CORE.glowRadius * 1.6, CORE.beamHeight, 24, 1, true]} />
      </mesh>
      <mesh ref={baseGlow} geometry={geometry.base} material={materials.base} position={[0, CORE.baseGlow.bottom + CORE.baseGlow.height / 2, 0]} renderOrder={5} />
      <group ref={rings}>
        {RINGS.map((ring) => (
          <mesh key={ring.y} material={materials.ring} position={[0, ring.y, 0]} rotation={[Math.PI / 2 + ring.tilt, ring.yaw, 0]}>
            <torusGeometry args={[ring.radius, ring.tube, 6, 160]} />
          </mesh>
        ))}
      </group>
      <pointLight ref={light} color={BLUEPRINT.gold.core} intensity={CORE.light.intensity} distance={CORE.light.distance} decay={2} position={[0, CORE.light.y, 0]} />
      {animate && embers > 0 && <Embers count={embers} boost={boost} />}
    </group>
  );
}
