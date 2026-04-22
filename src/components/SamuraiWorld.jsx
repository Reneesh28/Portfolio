import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, memo, Suspense } from "react";
import * as THREE from "three";
import { PerspectiveCamera, useTexture, Float } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";

/* ═══════════════════════════════════════════════════
   🏯 ATMOSPHERIC MOUNTAINS (Far Background)
   ═══════════════════════════════════════════════════ */
const InkMountains = () => {
  const [mountains, torii] = useTexture([
    "/assets/sumie_mountains.png",
    "/assets/torii_gate.png"
  ]);

  const groupRef = useRef();

  useFrame((state) => {
    const scrollY = window.scrollY;
    const progress = scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
    // Subtle parallax
    groupRef.current.position.y = -2 + progress * 2;
    groupRef.current.position.z = -15 + progress * 5;
  });

  return (
    <group ref={groupRef}>
      {/* Far Mountains */}
      <mesh position={[0, 4, -10]} scale={[60, 30, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={mountains} transparent opacity={0.4} />
      </mesh>

      {/* Torii Gate Silhouette */}
      <mesh position={[8, -2, -5]} scale={[10, 10, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={torii} transparent opacity={0.6} />
      </mesh>
    </group>
  );
};

/* ═══════════════════════════════════════════════════
   ☁️ VOID MIST (Mid Ground)
   ═══════════════════════════════════════════════════ */
const MistLayer = ({ position, speed, opacity, scale = [40, 10, 1] }) => {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.position.x = position[0] + Math.sin(t * speed) * 2;
    meshRef.current.position.y = position[1] + Math.cos(t * speed * 0.5) * 0.5;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <planeGeometry />
      <meshBasicMaterial
        color="#A8A29E"
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
};

/* ═══════════════════════════════════════════════════
   🌸 PETALS & ASH (Foreground)
   ═══════════════════════════════════════════════════ */
const Particles = memo(({ count = 200, color = "#F9A8D4", size = 0.1 }) => {
  const meshRef = useRef();

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = -Math.random() * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return { positions: pos, velocities: vel };
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    const attr = meshRef.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      attr.array[i3] += velocities[i3];
      attr.array[i3 + 1] += velocities[i3 + 1];
      attr.array[i3 + 2] += velocities[i3 + 2];

      if (attr.array[i3 + 1] < -12) attr.array[i3 + 1] = 12;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
});

/* ═══════════════════════════════════════════════════
   🎥 JOURNEY CAMERA (Scroll-Synced)
   ═══════════════════════════════════════════════════ */
const WorldCamera = () => {
  const { camera, pointer } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 10));

  useFrame(() => {
    const scrollY = window.scrollY;
    const progress = scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);

    // Smooth camera path
    targetPos.current.z = 12 - progress * 6;
    targetPos.current.y = -progress * 4;
    targetPos.current.x = pointer.x * 0.5; // Slight mouse lag

    camera.position.lerp(targetPos.current, 0.05);

    // Look at a point further down the journey
    const lookTarget = new THREE.Vector3(0, -progress * 4 - 2, -20);
    camera.lookAt(lookTarget);
  });

  return <PerspectiveCamera makeDefault fov={45} />;
};

import { useNarrative } from "../context/NarrativeContext";
import { useSamuraiTheme, themes } from "../context/ThemeContext";

/* ═══════════════════════════════════════════════════
   🌌 MAIN WORLD COMPONENT
   ═══════════════════════════════════════════════════ */
export default function SamuraiWorld() {
  const { activeChapter } = useNarrative();
  const { currentTheme } = useSamuraiTheme();
  const index = activeChapter?.index || 0;

  // Theme-based colors
  const themeConfig = {
    [themes.DAY]: { bg: "#F2F2EB", fog: "#F2F2EB", particle: "#F472B6" },
    [themes.NIGHT]: { bg: "#0C0A09", fog: "#0C0A09", particle: "#F9A8D4" },
    [themes.WAR]: { bg: "#0C0A09", fog: "#1A0B05", particle: "#EF4444" },
    [themes.ZEN]: { bg: "#121212", fog: "#121212", particle: "#A8A29E" },
  };

  const { bg, fog, particle } = themeConfig[currentTheme] || themeConfig[themes.NIGHT];

  // Narrative-based intensities
  const fogDensity = 0.04 + index * 0.01;
  const bloomIntensity = currentTheme === themes.WAR ? 1.5 : 0.8 + index * 0.1;

  return (
    <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none transition-colors duration-[1500ms]">
      <Canvas
        gl={{ antialias: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <color attach="background" args={[bg]} />
        <fogExp2 attach="fog" args={[fog, fogDensity]} />
        
        <WorldCamera />
        
        <Suspense fallback={null}>
          <InkMountains />
          <MistLayer position={[0, -2, -5]} speed={0.2} opacity={currentTheme === themes.DAY ? 0.3 : 0.08 + index * 0.01} />
          <MistLayer position={[10, -1, -8]} speed={0.15} opacity={0.05} scale={[50, 15, 1]} />
          
          {/* Zen Particles (Sakura) */}
          <Particles count={currentTheme === themes.DAY ? 400 : 300 - index * 30} color={particle} size={0.08} />
          {/* Intensity Particles (Embers) */}
          <Particles count={currentTheme === themes.WAR ? 500 : 100 + index * 50} color={currentTheme === themes.WAR ? "#EF4444" : "#D97706"} size={0.05} />
        </Suspense>

        <EffectComposer disableNormalPass multisampling={0}>
          <Bloom luminanceThreshold={0.4} intensity={bloomIntensity} mipmapBlur />
          <Noise opacity={currentTheme === themes.ZEN ? 0.05 : 0.03} />
          <Vignette eskil={false} offset={0.1} darkness={1.1 + index * 0.05} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
