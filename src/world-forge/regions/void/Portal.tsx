import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Color, DoubleSide, MeshBasicMaterial, MeshStandardMaterial, ShaderMaterial, TorusGeometry, type Mesh, type PointLight } from 'three';
import { mergeParts, placement, type Part } from '../../core/mergeStatic';
import { BLUEPRINT } from '../../look/palette';
import { PORTAL } from './layout';

/** Seconds the portal takes to ignite on arrival (with the intro camera letdown). */
const IGNITION_SECONDS = 3.2;

const filmVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// A faint swirling energy film. The centre stays clear, so the distant Forge shows through the portal.
const filmFragment = /* glsl */ `
  uniform float time;
  uniform float strength;
  uniform vec3 color;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);
    float a = atan(p.y, p.x);
    float swirl = noise(vec2(a * 3.0 + r * 6.0 - time * 0.6, r * 4.0 - time * 0.3));
    float rim = smoothstep(0.55, 1.0, r) * (1.0 - smoothstep(0.97, 1.0, r));
    float alpha = rim * (0.25 + swirl * 0.75) * strength * 0.55;
    gl_FragColor = vec4(color * alpha, alpha);
  }
`;

/**
 * The portal (blueprint Void "Portal Ring"): a segmented stone ring around a
 * glowing violet ring, a faint swirling energy film and a violet light. It
 * ignites over the intro; under reduced motion it is simply lit and still.
 */
export default function Portal({ position, animate }: { position: [number, number, number]; animate: boolean }) {
  const film = useRef<Mesh>(null);
  const glow = useRef<Mesh>(null);
  const light = useRef<PointLight>(null);
  const born = useRef<number | null>(null);

  const stone = useMemo(() => {
    // Irregular rock segments: varied thickness, depth and gaps, so the ring reads as ancient stone, not a cog.
    const parts: Part[] = [];
    const segments = 22;
    const temporary: TorusGeometry[] = [];
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < segments; i++) {
      const arc = (Math.PI * 2) / segments;
      const tube = PORTAL.tube * (0.7 + rand() * 0.6);
      const g = new TorusGeometry(PORTAL.radius + PORTAL.tube * 0.6 + (rand() - 0.5) * 0.6, tube, 4, 3, arc * (0.78 + rand() * 0.16));
      temporary.push(g);
      parts.push([g, placement([0, 0, (rand() - 0.5) * 0.8], [rand() * 0.08, rand() * 0.08, i * arc + arc * 0.05], [1, 1, 1 + rand() * 0.7])]);
    }
    const merged = mergeParts(parts);
    temporary.forEach((g) => g.dispose());
    return merged;
  }, []);
  useEffect(() => () => stone.dispose(), [stone]);

  const materials = useMemo(
    () => ({
      stone: new MeshStandardMaterial({ color: '#1c182b', roughness: 0.95, metalness: 0.05, flatShading: true, emissive: new Color(BLUEPRINT.portal), emissiveIntensity: 0.05 }),
      // Drawn over the stone's inner edge (the ring's rock overlaps it in depth).
      glow: new MeshBasicMaterial({ color: new Color(BLUEPRINT.portal).multiplyScalar(2.2), toneMapped: false, transparent: true, depthTest: false }),
      film: new ShaderMaterial({
        uniforms: { time: { value: 0 }, strength: { value: 1 }, color: { value: new Color(BLUEPRINT.portal).multiplyScalar(1.4) } },
        vertexShader: filmVertex,
        fragmentShader: filmFragment,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        side: DoubleSide,
        fog: false,
      }),
    }),
    [],
  );
  useEffect(() => () => Object.values(materials).forEach((m) => m.dispose()), [materials]);

  useFrame(({ clock }) => {
    if (born.current === null) born.current = clock.elapsedTime;
    const t = animate ? Math.min(1, (clock.elapsedTime - born.current) / IGNITION_SECONDS) : 1;
    const ignite = t * t * (3 - 2 * t);
    const pulse = animate ? 1 + Math.sin(clock.elapsedTime * 1.3) * 0.06 : 1;
    const filmMaterial = film.current?.material as ShaderMaterial | undefined;
    if (filmMaterial) {
      filmMaterial.uniforms.strength.value = ignite * pulse;
      if (animate) filmMaterial.uniforms.time.value = clock.elapsedTime;
    }
    const glowMaterial = glow.current?.material as MeshBasicMaterial | undefined;
    if (glowMaterial) glowMaterial.opacity = 0.15 + 0.85 * ignite;
    if (light.current) light.current.intensity = 700 * ignite * pulse;
  });

  return (
    <group position={position}>
      <group position={[0, PORTAL.centreY, 0]}>
        <mesh geometry={stone} material={materials.stone} />
        <mesh ref={glow} material={materials.glow} renderOrder={3}>
          <torusGeometry args={[PORTAL.radius - 0.2, 0.42, 8, 96]} />
        </mesh>
        <mesh ref={film} material={materials.film} renderOrder={4}>
          <circleGeometry args={[PORTAL.radius - 0.3, 64]} />
        </mesh>
      </group>
      <pointLight ref={light} color={BLUEPRINT.portal} intensity={0} distance={90} decay={2} position={[0, 4, 10]} />
    </group>
  );
}
