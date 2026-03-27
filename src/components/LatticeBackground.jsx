import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Float, Stars, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from "@react-three/postprocessing";

/* ---------- ARCHITECTURAL GRID LAYER ---------- */
function GridLattice({ isDecrypted }) {
  const meshRef = useRef();
  const divisions = 14;
  const size = 16;
  
  const lines = useMemo(() => {
    const step = size / divisions;
    const linePoints = [];
    for (let i = -divisions / 2; i <= divisions / 2; i++) {
        const coord = i * step;
        linePoints.push(new THREE.Vector3(-size/2, coord, coord), new THREE.Vector3(size/2, coord, coord));
        linePoints.push(new THREE.Vector3(coord, -size/2, coord), new THREE.Vector3(coord, size/2, coord));
        linePoints.push(new THREE.Vector3(coord, coord, -size/2), new THREE.Vector3(coord, coord, size/2));
    }
    return linePoints;
  }, [divisions, size]);

  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      const targetOpacity = isDecrypted ? 0.6 : 0.25;
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, 0.05);
      
      const targetColor = isDecrypted ? new THREE.Color("#00E5FF") : new THREE.Color("#00BFA5");
      materialRef.current.color.lerp(targetColor, 0.05);
      
      // Breathing effect
      const s = 1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.01;
      meshRef.current.scale.set(s, s, s);
    }
  });

  return (
    <lineSegments ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={lines.length}
          array={new Float32Array(lines.flatMap(v => [v.x, v.y, v.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial ref={materialRef} transparent opacity={0.2} color="#00BFA5" blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

/* ---------- KINETIC STREAK DATA LAYER ---------- */
function DataStreaks({ count = 250, isDecrypted }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const trails = useMemo(() => {
    return Array.from({ length: count }, () => ({
      axis: Math.floor(Math.random() * 3),
      pos: new THREE.Vector3((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 16, (Math.random() - 0.5) * 16),
      speed: (Math.random() * 0.03 + 0.015) * (Math.random() > 0.5 ? 1 : -1),
      scale: Math.random() * 1.5 + 0.5,
      flicker: Math.random() * Math.PI
    }));
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speedMult = isDecrypted ? 5 : 1.2;

    trails.forEach((trail, i) => {
      const move = trail.speed * speedMult;
      if (trail.axis === 0) {
        trail.pos.x += move;
        if (Math.abs(trail.pos.x) > 8) trail.pos.x = -8 * Math.sign(move);
      } else if (trail.axis === 1) {
        trail.pos.y += move;
        if (Math.abs(trail.pos.y) > 8) trail.pos.y = -8 * Math.sign(move);
      } else {
        trail.pos.z += move;
        if (Math.abs(trail.pos.z) > 8) trail.pos.z = -8 * Math.sign(move);
      }

      // Interaction distortion
      const dist = state.pointer.distanceTo(new THREE.Vector2(trail.pos.x / 8, trail.pos.y / 8));
      const force = Math.max(0, 1 - dist * 1.5) * 0.8;
      
      dummy.position.copy(trail.pos);
      dummy.position.lerp(new THREE.Vector3(trail.pos.x + 0.5, trail.pos.y + 0.5, trail.pos.z), force * 0.3);
      
      // Streak stretching look
      const flickerVal = 1 + Math.sin(t * 10 + trail.flicker) * 0.3;
      dummy.scale.set(
        trail.axis === 0 ? trail.scale * 3 : 0.05,
        trail.axis === 1 ? trail.scale * 3 : 0.05,
        trail.axis === 2 ? trail.scale * 3 : 0.05
      ).multiplyScalar(flickerVal);
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[1, 1, 1]} /> 
      <meshBasicMaterial color="#00E5FF" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  );
}

/* ---------- INTERACTIVE SCENE CONTAINER ---------- */
function SceneContainer({ isDecrypted }) {
  const group = useRef();

  useFrame(({ pointer, clock }) => {
    const t = clock.getElapsedTime();
    const rotationSpeed = isDecrypted ? 0.4 : 0.08;

    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      pointer.y * 0.2 + Math.sin(t * 0.15) * 0.03,
      0.04
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      -pointer.x * 0.2 + t * rotationSpeed,
      0.04
    );
  });

  return (
    <group ref={group}>
      <GridLattice isDecrypted={isDecrypted} />
      <DataStreaks isDecrypted={isDecrypted} count={isDecrypted ? 400 : 200} />
      
      <mesh scale={16}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial wireframe color="#00BFA5" transparent opacity={0.03} />
      </mesh>
    </group>
  );
}

export default function LatticeBackground({ isDecrypted }) {
  return (
    <div className="w-full h-full">
      <Canvas
        gl={{ antialias: false, stencil: false, depth: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={["#030303"]} />
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
        
        <fogExp2 attach="fog" args={["#030303", 0.08]} />
        
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#00E5FF" />
        
        <Stars 
          radius={120} 
          depth={60} 
          count={isDecrypted ? 10000 : 4000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={isDecrypted ? 3 : 0.8} 
        />
        
        <SceneContainer isDecrypted={isDecrypted} />

        {/* Cinematic Post-Processing */}
        <EffectComposer disableNormalPass multisampling={0}>
            <Bloom 
                intensity={isDecrypted ? 2.5 : 1.2} 
                luminanceThreshold={0.1} 
                luminanceSmoothing={0.9} 
                mipmapBlur 
            />
            <Noise opacity={0.05} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            {isDecrypted && <ChromaticAberration offset={[0.002, 0.002]} />}
        </EffectComposer>
      </Canvas>
    </div>
  );
}
