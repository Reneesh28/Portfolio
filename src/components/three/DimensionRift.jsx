import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, ChromaticAberration, Glitch, Noise, Vignette } from '@react-three/postprocessing';
import { GlitchMode } from 'postprocessing';
import * as THREE from 'three';

/**
 * DimensionRift
 * A lightweight Three.js canvas meant to sit BEHIND content (absolute, pointer-events-none).
 * Renders floating "comic panel shard" planes in dimension colors that drift, rotate
 * slowly, and parallax against the mouse — like fragments of other Earths bleeding
 * through a dimensional rift. Postprocessing adds chromatic split + occasional glitch.
 *
 * Usage:
 *   <div className="absolute inset-0 -z-10">
 *     <DimensionRift density={14} />
 *   </div>
 */

const DIMENSION_COLORS = ['#00E5FF', '#FF2DAA', '#FFB627', '#E0122A', '#287BFF', '#FF7A1A'];

function Shard({ position, rotation, scale, color, speed }) {
  const ref = useRef();
  const seed = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + seed;
    ref.current.rotation.x = rotation[0] + Math.sin(t * 0.4) * 0.15;
    ref.current.rotation.y = rotation[1] + Math.cos(t * 0.3) * 0.2;
    ref.current.position.y = position[1] + Math.sin(t) * 0.4;
    ref.current.position.x = position[0] + Math.cos(t * 0.6) * 0.25;
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1, 1.4]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.16}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function Shards({ density = 14 }) {
  const shards = useMemo(() => {
    return Array.from({ length: density }).map((_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4 - 2,
      ],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      scale: 0.4 + Math.random() * 1.1,
      color: DIMENSION_COLORS[i % DIMENSION_COLORS.length],
      speed: 0.15 + Math.random() * 0.35,
    }));
  }, [density]);

  return shards.map((s) => <Shard key={s.id} {...s} />);
}

function MouseParallaxRig({ strength = 0.6 }) {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame(() => {
    camera.position.x += (target.current.x - camera.position.x) * 0.04;
    camera.position.y += (target.current.y - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const handleMove = (e) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * strength;
      target.current.y = -(e.clientY / window.innerHeight - 0.5) * strength;
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [strength]);

  return null;
}

const DimensionRift = ({ density = 14, glitch = true, className = '' }) => {
  const reducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    // Static fallback: no canvas at all, respects accessibility setting.
    return null;
  }

  return (
    <div className={`pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      >
        <Suspense fallback={null}>
          <Shards density={density} />
          <MouseParallaxRig />
          <EffectComposer multisampling={0}>
            <ChromaticAberration offset={[0.003, 0.004]} radialModulation modulationOffset={0.4} />
            <Noise opacity={0.025} />
            {glitch && (
              <Glitch
                delay={[2.5, 6]}
                duration={[0.1, 0.25]}
                strength={[0.05, 0.15]}
                mode={GlitchMode.SPORADIC}
                active
                ratio={0.5}
              />
            )}
            <Vignette eskil={false} offset={0.3} darkness={0.7} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default DimensionRift;