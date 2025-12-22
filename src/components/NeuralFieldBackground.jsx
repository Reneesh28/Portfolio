import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/* ---------- Neural Nodes ---------- */
function NeuralNodes() {
  const group = useRef();

  const nodes = useMemo(() => {
    return Array.from({ length: 140 }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 7
      ),
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    group.current.children.forEach((mesh, i) => {
      // subtle breathing motion
      mesh.position.y += Math.sin(t * 0.6 + nodes[i].phase) * 0.0008;
      mesh.scale.setScalar(1 + Math.sin(t + nodes[i].phase) * 0.02);
    });
  });

  return (
    <group ref={group}>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position}>
          <sphereGeometry args={[0.028, 16, 16]} />
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.15}
            transmission={0.9}
            thickness={0.4}
            transparent
            opacity={0.6}
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
    return Array.from({ length: 90 }, () => {
      const start = new THREE.Vector3(
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 7
      );
      const end = start.clone().add(
        new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        )
      );
      return new THREE.CatmullRomCurve3([start, end]);
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // slow vector-field rotation
    group.current.rotation.y = t * 0.04;
    group.current.rotation.x = Math.sin(t * 0.15) * 0.05;
  });

  return (
    <group ref={group}>
      {curves.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 32, 0.01, 8, false]} />
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.25}
            transmission={0.95}
            thickness={0.5}
            transparent
            opacity={0.25}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Main Background ---------- */
export default function NeuralFieldBackground() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7], fov: 60 }}
      gl={{ antialias: true }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 6, 5]} intensity={0.6} />
      <directionalLight position={[-5, -4, -5]} intensity={0.25} />

      <NeuralNodes />
      <NeuralConnections />
    </Canvas>
  );
}
