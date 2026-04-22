import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, memo } from "react";
import * as THREE from "three";
import { PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";

/* ---------- CHERRY BLOSSOM PARTICLES ---------- */
const SakuraParticles = memo(({ count = 300, isRevealed }) => {
  const meshRef = useRef();
  const materialRef = useRef();

  const { positions, velocities, rotations, scales } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const rotations = new Float32Array(count);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spread across a wide area
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20 + 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      // Gentle drift velocities
      velocities[i * 3] = (Math.random() - 0.3) * 0.01;     // slight rightward drift
      velocities[i * 3 + 1] = -(Math.random() * 0.008 + 0.003); // fall down
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;

      rotations[i] = Math.random() * Math.PI * 2;
      scales[i] = Math.random() * 0.08 + 0.03;
    }
    return { positions, velocities, rotations, scales };
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const posArray = meshRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Apply velocity + gentle wind sway
      posArray[i3] += velocities[i3] + Math.sin(time * 0.3 + i) * 0.002;
      posArray[i3 + 1] += velocities[i3 + 1];
      posArray[i3 + 2] += velocities[i3 + 2] + Math.cos(time * 0.2 + i) * 0.001;

      // Reset petal when it falls below view
      if (posArray[i3 + 1] < -12) {
        posArray[i3] = (Math.random() - 0.5) * 30;
        posArray[i3 + 1] = 12 + Math.random() * 5;
        posArray[i3 + 2] = (Math.random() - 0.5) * 20;
      }
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;

    // Fade in opacity when revealed
    if (materialRef.current) {
      const target = isRevealed ? 0.7 : 0.35;
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, target, 0.03);
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.12}
        color="#F9A8D4"
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
});

/* ---------- ASH / EMBER PARTICLES ---------- */
const EmberParticles = memo(({ count = 120, isRevealed }) => {
  const meshRef = useRef();
  const materialRef = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 24;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const posArray = meshRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Slow upward drift like rising embers
      posArray[i3] += Math.sin(time * 0.5 + i * 0.7) * 0.003;
      posArray[i3 + 1] += 0.005 + Math.sin(time + i) * 0.002;
      posArray[i3 + 2] += Math.cos(time * 0.3 + i * 0.5) * 0.002;

      // Reset when too high
      if (posArray[i3 + 1] > 12) {
        posArray[i3 + 1] = -10;
        posArray[i3] = (Math.random() - 0.5) * 24;
      }
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;

    if (materialRef.current) {
      const target = isRevealed ? 0.5 : 0.2;
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, target, 0.03);
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.06}
        color="#D97706"
        transparent
        opacity={0.2}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
});

/* ---------- FOG / MIST PLANE ---------- */
const FogPlane = memo(({ isRevealed }) => {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    // Gentle undulating motion
    meshRef.current.position.y = Math.sin(time * 0.15) * 0.5 - 2;
    meshRef.current.rotation.z = Math.sin(time * 0.08) * 0.02;

    if (materialRef.current) {
      const target = isRevealed ? 0.12 : 0.06;
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, target, 0.02);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -2, -3]} rotation={[-0.2, 0, 0]}>
      <planeGeometry args={[40, 12]} />
      <meshBasicMaterial
        ref={materialRef}
        color="#A8A29E"
        transparent
        opacity={0.06}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
});

/* ---------- INTERACTIVE SCENE CONTAINER ---------- */
const SceneContainer = memo(({ isRevealed }) => {
  const group = useRef();

  useFrame(({ pointer, clock }) => {
    const t = clock.getElapsedTime();

    // Very gentle, contemplative rotation
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      pointer.y * 0.05 + Math.sin(t * 0.1) * 0.02,
      0.02
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      -pointer.x * 0.05 + t * 0.02,
      0.02
    );
  });

  return (
    <group ref={group}>
      <SakuraParticles isRevealed={isRevealed} count={isRevealed ? 400 : 200} />
      <EmberParticles isRevealed={isRevealed} count={isRevealed ? 150 : 80} />
      <FogPlane isRevealed={isRevealed} />
    </group>
  );
});

const LatticeBackground = memo(({ isDecrypted }) => {
  return (
    <div className="w-full h-full">
      <Canvas
        gl={{ antialias: false, stencil: false, depth: true, alpha: true, powerPreference: "high-performance" }}
        dpr={1}
      >
        <color attach="background" args={["#0C0A09"]} />
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />

        <fogExp2 attach="fog" args={["#0C0A09", 0.04]} />

        <ambientLight intensity={0.3} />
        {/* Warm lantern-like lights */}
        <pointLight position={[8, 6, 5]} intensity={1.5} color="#D97706" distance={30} decay={2} />
        <pointLight position={[-6, -3, 4]} intensity={0.8} color="#C2410C" distance={20} decay={2} />

        <SceneContainer isRevealed={isDecrypted} />

        <EffectComposer disableNormalPass multisampling={0}>
          <Bloom
            intensity={isDecrypted ? 1.2 : 0.6}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <Noise opacity={0.035} />
          <Vignette eskil={false} offset={0.1} darkness={1.2} />
        </EffectComposer>
      </Canvas>
    </div>
  );
});

export default LatticeBackground;
