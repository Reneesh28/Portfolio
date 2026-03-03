import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Float, Stars, Environment } from "@react-three/drei";

function NeuralNodes() {
  const group = useRef();

  const nodes = useMemo(() => {
    return Array.from({ length: 150 }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      ),
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    group.current.children.forEach((mesh, i) => {
      // Breathing motion
      mesh.position.y += Math.sin(t * 1 + nodes[i].phase) * 0.002;
      mesh.scale.setScalar(1 + Math.sin(t * 1.5 + nodes[i].phase) * 0.1);
    });
  });

  return (
    <group ref={group}>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshPhysicalMaterial
            color="#88ccff"
            emissive="#224488"
            emissiveIntensity={0.5}
            roughness={0.1}
            metalness={0.8}
            transmission={0.5}
            thickness={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Neural Connections ---------- */
function NeuralConnections() {
  const group = useRef();

  const curves = useMemo(() => {
    return Array.from({ length: 100 }, () => {
      const start = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      );
      const end = start.clone().add(
        new THREE.Vector3(
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3
        )
      );
      return new THREE.CatmullRomCurve3([start, end]);
    });
  }, []);

  return (
    <group ref={group}>
      {curves.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 64, 0.015, 8, false]} />
          <meshBasicMaterial
            color="#4488ff"
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Interactive Scene Container ---------- */
function SceneContainer() {
  const group = useRef();

  useFrame(({ pointer, clock }) => {
    // Gentle rotation based on mouse
    const t = clock.getElapsedTime();

    // Smooth Look-at / Parallax
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      pointer.y * 0.2 + Math.sin(t * 0.1) * 0.05,
      0.05
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      pointer.x * 0.2 + t * 0.05, // continuous slow spin + mouse influence
      0.05
    );
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <NeuralNodes />
        <NeuralConnections />
      </Float>
    </group>
  );
}

/* ---------- Main Background ---------- */
export default function NeuralFieldBackground() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#000000"]} />

      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#4488ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#cc00ff" />

      {/* Stars for depth */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <SceneContainer />

      {/* Post-processing could go here, but keeping it simple for perf */}
    </Canvas>
  );
}
