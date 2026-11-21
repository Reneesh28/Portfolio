import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BackSide, Color, ShaderMaterial, type Mesh } from 'three';
import { useExperienceStore } from '../experience/ExperienceContext';
import { PALETTE } from '../regions/void/materials';
import { voidBackdropOpacity } from './voidFade';

/** Sky colours (sRGB): zenith matches the scene background; a faint cold band sits on the horizon. */
export const SKY = {
  zenith: PALETTE.sky,
  horizon: '#131b26',
  nadir: '#06080c',
  /** Extra brightness of the horizon band toward the north (−Z), where the Horizon region lies. */
  northBoost: 0.55,
  radius: 1000,
} as const;

const vertexShader = /* glsl */ `
  varying vec3 vDirection;
  void main() {
    vDirection = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 zenith;
  uniform vec3 horizon;
  uniform vec3 nadir;
  uniform float northBoost;
  uniform float opacity;
  varying vec3 vDirection;
  void main() {
    vec3 dir = normalize(vDirection);
    float north = max(0.0, -dir.z);
    vec3 band = horizon * (1.0 + northBoost * north * north);
    vec3 color = dir.y >= 0.0
      ? mix(band, zenith, smoothstep(0.0, 0.32, dir.y))
      : mix(band, nadir, smoothstep(0.0, 0.12, -dir.y));
    gl_FragColor = vec4(color, opacity);
    #include <colorspace_fragment>
  }
`;

/**
 * World sky (DEC-002 resolved in M4.6): a quiet gradient dome around the camera for
 * every view after the Void. It fades in exactly as the Void's horizon glow fades out
 * (`voidBackdropOpacity`), so at the Void stop it is invisible and the approved
 * opening is untouched.
 */
export default function WorldSky() {
  const store = useExperienceStore();
  const mesh = useRef<Mesh>(null);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          zenith: { value: new Color(SKY.zenith) },
          horizon: { value: new Color(SKY.horizon) },
          nadir: { value: new Color(SKY.nadir) },
          northBoost: { value: SKY.northBoost },
          opacity: { value: 0 },
        },
        vertexShader,
        fragmentShader,
        side: BackSide,
        transparent: true,
        depthWrite: false,
        fog: false,
        toneMapped: false,
      }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ camera, invalidate }) => {
    const sky = mesh.current;
    if (!sky) return;
    sky.position.copy(camera.position);
    const uniform = (sky.material as ShaderMaterial).uniforms.opacity;
    const opacity = 1 - voidBackdropOpacity(store.getJourney().position);
    if (opacity === uniform.value) return;
    uniform.value = opacity;
    sky.visible = opacity > 0;
    invalidate();
  });

  return (
    <mesh ref={mesh} material={material} renderOrder={-2} visible={false} frustumCulled={false}>
      <sphereGeometry args={[SKY.radius, 32, 16]} />
    </mesh>
  );
}
