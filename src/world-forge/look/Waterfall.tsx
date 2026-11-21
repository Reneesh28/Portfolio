import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Color, DoubleSide, ShaderMaterial, type Mesh } from 'three';
import { BLUEPRINT } from './palette';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float time;
  uniform vec3 water;
  uniform vec3 mist;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 15731.743); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  void main() {
    // Falling streaks: stretched noise scrolling downward.
    float streak = noise(vec2(vUv.x * 26.0, vUv.y * 2.5 + time * 1.6));
    streak = smoothstep(0.35, 0.95, streak);
    float edge = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x);
    // Fades and widens into mist as it falls into the clouds.
    float fall = 1.0 - vUv.y;
    float alpha = edge * (0.25 + streak * 0.75) * (1.0 - smoothstep(0.55, 1.0, fall));
    vec3 color = mix(water, mist, fall);
    gl_FragColor = vec4(color * alpha, alpha);
  }
`;

interface WaterfallProps {
  position: [number, number, number];
  rotationY: number;
  width: number;
  height: number;
  animate: boolean;
}

/** A ribbon of falling water from an island's edge into the cloud sea. */
export default function Waterfall({ position, rotationY, width, height, animate }: WaterfallProps) {
  const mesh = useRef<Mesh>(null);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { time: { value: 0 }, water: { value: new Color(BLUEPRINT.water) }, mist: { value: new Color(BLUEPRINT.cloud.light) } },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        side: DoubleSide,
        fog: false,
      }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ clock }) => {
    if (!animate || !mesh.current) return;
    (mesh.current.material as ShaderMaterial).uniforms.time.value = clock.elapsedTime;
  });

  return (
    <mesh ref={mesh} material={material} position={[position[0], position[1] - height / 2, position[2]]} rotation={[0, rotationY, 0]} renderOrder={6}>
      <planeGeometry args={[width, height, 1, 1]} />
    </mesh>
  );
}
