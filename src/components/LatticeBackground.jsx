import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, memo } from "react";
import * as THREE from "three";
import { Stars, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from "@react-three/postprocessing";

/* ---------- ARCHITECTURAL GRID LAYER ---------- */
const GridLattice = memo(({ isDecrypted }) => {
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
});

/* ---------- GPU-ACCELERATED DATA STREAKS ---------- */
const DataStreaks = memo(({ count = 200, isDecrypted }) => {
  const meshRef = useRef();
  const materialRef = useRef();

  // Create attributes once
  const { offsets, axes, speeds, scales, flickers } = useMemo(() => {
    const offsets = new Float32Array(count * 3);
    const axes = new Float32Array(count);
    const speeds = new Float32Array(count);
    const scales = new Float32Array(count);
    const flickers = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      offsets[i * 3] = (Math.random() - 0.5) * 16;
      offsets[i * 3 + 1] = (Math.random() - 0.5) * 16;
      offsets[i * 3 + 2] = (Math.random() - 0.5) * 16;
      
      axes[i] = Math.floor(Math.random() * 3);
      speeds[i] = (Math.random() * 0.03 + 0.015) * (Math.random() > 0.5 ? 1 : -1);
      scales[i] = Math.random() * 1.5 + 0.5;
      flickers[i] = Math.random() * Math.PI;
    }
    return { offsets, axes, speeds, scales, flickers };
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uSpeedMult: { value: 1.2 },
    uColor: { value: new THREE.Color("#00E5FF") }
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.uPointer.value.lerp(state.pointer, 0.1);
      materialRef.current.uniforms.uSpeedMult.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uSpeedMult.value, 
        isDecrypted ? 5.0 : 1.2, 
        0.05
      );
    }
  });

  const vertexShader = `
    uniform float uTime;
    uniform vec2 uPointer;
    uniform float uSpeedMult;
    
    attribute vec3 aOffset;
    attribute float aAxis;
    attribute float aSpeed;
    attribute float aScale;
    attribute float aFlicker;

    varying float vFlicker;

    void main() {
      vec3 pos = aOffset;
      float move = aSpeed * uSpeedMult * uTime;
      
      // Infinite Loop movement
      if (aAxis < 0.5) {
        pos.x = mod(pos.x + move + 8.0, 16.0) - 8.0;
      } else if (aAxis < 1.5) {
        pos.y = mod(pos.y + move + 8.0, 16.0) - 8.0;
      } else {
        pos.z = mod(pos.z + move + 8.0, 16.0) - 8.0;
      }

      // Interaction
      float dist = distance(uPointer, pos.xy / 8.0);
      float force = max(0.0, 1.0 - dist * 1.5) * 0.5;
      pos.xy += (pos.xy + 0.5) * force * 0.2;

      // Scaling
      vec3 s = vec3(0.05);
      if (aAxis < 0.5) s.x = aScale * 3.0;
      else if (aAxis < 1.5) s.y = aScale * 3.0;
      else s.z = aScale * 3.0;

      float f = 1.0 + sin(uTime * 10.0 + aFlicker) * 0.3;
      s *= f;
      vFlicker = f;

      vec4 mvPosition = modelViewMatrix * vec4(pos + position * s, 1.0);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform vec3 uColor;
    varying float vFlicker;
    void main() {
      gl_FragColor = vec4(uColor, 0.8 * vFlicker);
    }
  `;

  return (
    <instancedMesh args={[null, null, count]}>
      <boxGeometry args={[1, 1, 1]}>
        <instancedBufferAttribute attach="attributes-aOffset" args={[offsets, 3]} />
        <instancedBufferAttribute attach="attributes-aAxis" args={[axes, 1]} />
        <instancedBufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
        <instancedBufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <instancedBufferAttribute attach="attributes-aFlicker" args={[flickers, 1]} />
      </boxGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
});

/* ---------- INTERACTIVE SCENE CONTAINER ---------- */
const SceneContainer = memo(({ isDecrypted }) => {
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
      <DataStreaks isDecrypted={isDecrypted} count={isDecrypted ? 350 : 150} />
      
      <mesh scale={16}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial wireframe color="#00BFA5" transparent opacity={0.03} />
      </mesh>
    </group>
  );
});

const LatticeBackground = memo(({ isDecrypted }) => {
  return (
    <div className="w-full h-full">
      <Canvas
        gl={{ antialias: false, stencil: false, depth: true, alpha: true, powerPreference: "high-performance" }}
        dpr={1} // Static DPR for performance consistency
      >
        <color attach="background" args={["#030303"]} />
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
        
        <fogExp2 attach="fog" args={["#030303", 0.08]} />
        
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#00E5FF" />
        
        <Stars 
          radius={120} 
          depth={60} 
          count={isDecrypted ? 8000 : 3000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={isDecrypted ? 2 : 0.8} 
        />
        
        <SceneContainer isDecrypted={isDecrypted} />

        <EffectComposer disableNormalPass multisampling={0}>
            <Bloom 
                intensity={isDecrypted ? 2.0 : 1.0} 
                luminanceThreshold={0.2} 
                luminanceSmoothing={0.9} 
                mipmapBlur 
            />
            <Noise opacity={0.04} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            {isDecrypted && <ChromaticAberration offset={[0.0015, 0.0015]} />}
        </EffectComposer>
      </Canvas>
    </div>
  );
});

export default LatticeBackground;

