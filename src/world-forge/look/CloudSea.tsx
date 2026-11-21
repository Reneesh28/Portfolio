import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, DoubleSide, ShaderMaterial, type Mesh } from 'three';
import { BLUEPRINT } from './palette';

const vertexShader = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

// Value-noise fbm: soft, billowing cloud tops lit from above, fading out with distance.
const fragmentShader = /* glsl */ `
  uniform float time;
  uniform float scale;
  uniform float opacity;
  uniform float fadeStart;
  uniform float fadeEnd;
  uniform vec3 shadowColor;
  uniform vec3 bodyColor;
  uniform vec3 lightColor;
  uniform vec3 horizonColor;
  uniform vec2 drift;
  varying vec3 vWorld;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 17.0; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 p = vWorld.xz * scale + drift * time;
    float n = fbm(p);
    float billow = smoothstep(0.32, 0.78, n);
    vec3 color = mix(shadowColor, bodyColor, smoothstep(0.25, 0.6, n));
    color = mix(color, lightColor, pow(billow, 2.2) * 0.85);
    float dist = length(vWorld.xz - cameraPosition.xz);
    float far = smoothstep(fadeStart, fadeEnd, dist);
    // Far away the clouds melt into the violet horizon.
    color = mix(color, horizonColor, far * 0.85);
    float alpha = opacity * smoothstep(0.18, 0.5, n) * (1.0 - far * 0.35);
    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`;

interface CloudLayer {
  y: number;
  scale: number;
  opacity: number;
  drift: [number, number];
}

const LAYERS: readonly CloudLayer[] = [
  { y: -150, scale: 0.0016, opacity: 1, drift: [0.004, 0.002] },
  { y: -95, scale: 0.0026, opacity: 0.85, drift: [-0.006, 0.003] },
  { y: -55, scale: 0.0042, opacity: 0.55, drift: [0.008, -0.004] },
];

interface CloudSeaProps {
  /** False under reduced motion: the clouds hold still. */
  animate: boolean;
  size?: number;
  /** How many of the sheets to draw (quality tier); the lowest, densest sheets first. */
  layers?: number;
}

/**
 * The sea of violet cloud the islands float above (blueprint images): three
 * layered, slowly drifting noise sheets that melt into the horizon with distance.
 */
export default function CloudSea({ animate, size = 9000, layers = LAYERS.length }: CloudSeaProps) {
  const materials = useMemo(
    () =>
      LAYERS.map(
        (layer) =>
          new ShaderMaterial({
            uniforms: {
              time: { value: 0 },
              scale: { value: layer.scale },
              opacity: { value: layer.opacity },
              fadeStart: { value: 600 },
              fadeEnd: { value: 3800 },
              shadowColor: { value: new Color(BLUEPRINT.cloud.shadow) },
              bodyColor: { value: new Color(BLUEPRINT.cloud.body) },
              lightColor: { value: new Color(BLUEPRINT.cloud.light) },
              horizonColor: { value: new Color(BLUEPRINT.sky.horizon) },
              drift: { value: layer.drift },
            },
            vertexShader,
            fragmentShader,
            transparent: true,
            depthWrite: false,
            side: DoubleSide,
            fog: false,
          }),
      ),
    [],
  );
  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);

  const meshes = useRef<Array<Mesh | null>>([]);
  useFrame(({ clock }) => {
    if (!animate) return;
    const t = clock.elapsedTime * 60;
    for (const mesh of meshes.current) if (mesh) (mesh.material as ShaderMaterial).uniforms.time.value = t;
  });

  return (
    <group>
      {LAYERS.slice(0, layers).map((layer, i) => (
        <mesh
          key={layer.y}
          ref={(node) => {
            meshes.current[i] = node;
          }}
          material={materials[i]} position={[0, layer.y, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={2 + i}>
          <planeGeometry args={[size, size, 1, 1]} />
        </mesh>
      ))}
    </group>
  );
}
