import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BackSide, Color, ShaderMaterial, type Group } from 'three';
import { createRandom } from '../core/random';
import { BLUEPRINT } from './palette';

const vertexShader = /* glsl */ `
  varying vec3 vDirection;
  void main() {
    vDirection = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 zenith;
  uniform vec3 upper;
  uniform vec3 horizon;
  uniform vec3 glow;
  uniform vec3 glowDirection;
  varying vec3 vDirection;
  void main() {
    vec3 dir = normalize(vDirection);
    float h = dir.y;
    vec3 color = mix(horizon, upper, smoothstep(0.0, 0.22, h));
    color = mix(color, zenith, smoothstep(0.18, 0.75, h));
    // Violet glow low on the horizon, strongest toward the glow direction (behind the hub).
    float toward = max(0.0, dot(normalize(vec3(dir.x, 0.0, dir.z)), glowDirection));
    float band = exp(-abs(h - 0.02) * 9.0);
    color += glow * band * (0.25 + 0.75 * pow(toward, 3.0)) * 0.55;
    // Below the horizon the sky sinks into the cloud sea's shadow.
    color = mix(color, horizon * 0.55, smoothstep(0.0, -0.25, h));
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

interface BlueprintSkyProps {
  /** Unit direction (x, z) the horizon glow faces. */
  glowDirection?: [number, number];
  radius?: number;
}

/** Indigo-to-violet sky dome with a horizon glow, stars and a pale moon, centred on the camera. */
export default function BlueprintSky({ glowDirection = [0, -1], radius = 4000 }: BlueprintSkyProps) {
  const group = useRef<Group>(null);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          zenith: { value: new Color(BLUEPRINT.sky.zenith) },
          upper: { value: new Color(BLUEPRINT.sky.upper) },
          horizon: { value: new Color(BLUEPRINT.sky.horizon) },
          glow: { value: new Color(BLUEPRINT.sky.glow) },
          glowDirection: { value: [glowDirection[0], 0, glowDirection[1]] },
        },
        vertexShader,
        fragmentShader,
        side: BackSide,
        depthWrite: false,
        fog: false,
        toneMapped: false,
      }),
    [glowDirection],
  );
  useEffect(() => () => material.dispose(), [material]);

  const stars = useMemo(() => {
    const rand = createRandom(907);
    const count = 900;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2;
      const y = 0.08 + rand() ** 0.7 * 0.92;
      const r = Math.sqrt(1 - y * y);
      const d = radius * 0.9;
      positions.set([Math.cos(a) * r * d, y * d, Math.sin(a) * r * d], i * 3);
    }
    return positions;
  }, [radius]);

  useFrame(({ camera }) => {
    group.current?.position.copy(camera.position);
  });

  const moonAt: [number, number, number] = [-radius * 0.62, radius * 0.42, -radius * 0.45];

  return (
    <group ref={group}>
      <mesh material={material} renderOrder={-10} frustumCulled={false}>
        <sphereGeometry args={[radius, 48, 24]} />
      </mesh>
      <points frustumCulled={false} renderOrder={-9}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#d9d2ff" size={2.2} sizeAttenuation={false} transparent opacity={0.75} depthWrite={false} fog={false} toneMapped={false} />
      </points>
      {/* Pale moon and its halo. */}
      <mesh position={moonAt} renderOrder={-8}>
        <sphereGeometry args={[radius * 0.018, 24, 12]} />
        <meshBasicMaterial color={BLUEPRINT.moon} fog={false} toneMapped={false} />
      </mesh>
      <mesh position={moonAt} renderOrder={-8}>
        <sphereGeometry args={[radius * 0.05, 24, 12]} />
        <meshBasicMaterial color={BLUEPRINT.sky.glow} transparent opacity={0.12} blending={AdditiveBlending} depthWrite={false} fog={false} toneMapped={false} />
      </mesh>
    </group>
  );
}
