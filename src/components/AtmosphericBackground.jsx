import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, memo } from "react";
import * as THREE from "three";
import { PerspectiveCamera, Float } from "@react-three/drei";

const LEAF_COUNT = 40;

const FallingLeaf = ({ index }) => {
  const meshRef = useRef();

  // Random starting position and rotation
  const { position, rotation, speed, amplitude } = useMemo(() => ({
    position: [
      (Math.random() - 0.5) * 30,
      Math.random() * 20,
      (Math.random() - 0.5) * 10
    ],
    rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
    speed: Math.random() * 0.02 + 0.01,
    amplitude: Math.random() * 2 + 1
  }), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Falling logic
    meshRef.current.position.y -= speed;
    meshRef.current.position.x += Math.sin(time + index) * 0.01;

    // Rotation drift
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.005;

    // Reset when out of view
    if (meshRef.current.position.y < -10) {
      meshRef.current.position.y = 15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={0.15}>
        <planeGeometry args={[1, 1.2]} />
        <meshBasicMaterial
          color="#C5A059"
          side={THREE.DoubleSide}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
};

const AtmosphericBackground = memo(() => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 10], fov: 45 }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#C5A059" />

        {Array.from({ length: LEAF_COUNT }).map((_, i) => (
          <FallingLeaf key={i} index={i} />
        ))}

        <fog attach="fog" args={["#0D0D0D", 5, 25]} />
      </Canvas>
    </div>
  );
});

export default AtmosphericBackground;
