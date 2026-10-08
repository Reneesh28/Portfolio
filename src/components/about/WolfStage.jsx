import React, { useRef, useMemo, useEffect, useState, Suspense, lazy } from 'react';
import * as THREE from 'three';

// =========================================================
// WOLF 3D MODEL CONFIGURATION
// To swap in a real 3D model, set this constant to the GLB URL:
// e.g. import wolfModelUrl from '../../assets/models/wolf.glb';
// const WOLF_GLB_URL = wolfModelUrl;
// =========================================================
const WOLF_GLB_URL = null;

// Three-step toon gradient map generator (Daylight / Dusk / Night)
function createToonGradient(stepCount = 3) {
  const canvas = document.createElement('canvas');
  canvas.width = stepCount;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, stepCount, 0);
  gradient.addColorStop(0, '#222228');
  gradient.addColorStop(0.5, '#888894');
  gradient.addColorStop(1, '#FFFFFF');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, stepCount, 1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  return texture;
}

// =========================================================
// PROCEDURAL TOON WOLF HEAD (Primitive Placeholder)
// =========================================================
function ProceduralWolfHead({ isHovered = false }) {
  const groupRef = useRef(null);
  const gradientMap = useMemo(() => createToonGradient(3), []);

  // Toon Base Material
  const toonMaterial = useMemo(
    () =>
      new THREE.MeshToonMaterial({
        color: new THREE.Color('#D8D3C8'),
        gradientMap: gradientMap,
        roughness: 0.8,
      }),
    [gradientMap]
  );

  // Inverted Hull Outline Material (Ink Line)
  const outlineMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#111116'),
        side: THREE.BackSide,
      }),
    []
  );

  // Vermilion Emissive Eye Material
  const eyeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D7331F'),
        emissive: new THREE.Color('#D7331F'),
        emissiveIntensity: 1.8,
        roughness: 0.2,
      }),
    []
  );

  // Idle breath & head sway
  useEffect(() => {
    let animationFrame;
    let time = 0;
    const animate = () => {
      time += 0.02;
      if (groupRef.current) {
        groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.08 + (isHovered ? 0.15 : 0);
        groupRef.current.rotation.x = Math.cos(time * 0.4) * 0.04 - 0.05;
        groupRef.current.position.y = Math.sin(time * 0.8) * 0.03;
      }
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [isHovered]);

  // Clean up textures and materials on unmount
  useEffect(() => {
    return () => {
      gradientMap.dispose();
      toonMaterial.dispose();
      outlineMaterial.dispose();
      eyeMaterial.dispose();
    };
  }, [gradientMap, toonMaterial, outlineMaterial, eyeMaterial]);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. Snout / Muzzle */}
      <group position={[0, -0.1, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh material={toonMaterial}>
          <coneGeometry args={[0.55, 1.4, 6]} />
        </mesh>
        <mesh material={outlineMaterial} scale={1.06}>
          <coneGeometry args={[0.55, 1.4, 6]} />
        </mesh>
      </group>

      {/* 2. Main Cranium / Brow Head */}
      <group position={[0, 0.35, 0]}>
        <mesh material={toonMaterial}>
          <boxGeometry args={[1.3, 1.0, 1.2]} />
        </mesh>
        <mesh material={outlineMaterial} scale={1.06}>
          <boxGeometry args={[1.3, 1.0, 1.2]} />
        </mesh>
      </group>

      {/* 3. Left & Right Ears */}
      <group position={[-0.55, 1.15, -0.1]} rotation={[-0.1, 0, 0.3]}>
        <mesh material={toonMaterial}>
          <coneGeometry args={[0.3, 1.0, 4]} />
        </mesh>
        <mesh material={outlineMaterial} scale={1.06}>
          <coneGeometry args={[0.3, 1.0, 4]} />
        </mesh>
      </group>
      <group position={[0.55, 1.15, -0.1]} rotation={[-0.1, 0, -0.3]}>
        <mesh material={toonMaterial}>
          <coneGeometry args={[0.3, 1.0, 4]} />
        </mesh>
        <mesh material={outlineMaterial} scale={1.06}>
          <coneGeometry args={[0.3, 1.0, 4]} />
        </mesh>
      </group>

      {/* 4. Left & Right Eyes (Vermilion Emissive) */}
      <mesh position={[-0.38, 0.35, 0.65]} material={eyeMaterial}>
        <sphereGeometry args={[0.1, 16, 16]} />
      </mesh>
      <mesh position={[0.38, 0.35, 0.65]} material={eyeMaterial}>
        <sphereGeometry args={[0.1, 16, 16]} />
      </mesh>
    </group>
  );
}

// Lighting Setup that follows hour (06-16 daylight, 20 dusk, 25 night)
function WolfLighting({ hour = 12.0 }) {
  const lighting = useMemo(() => {
    if (hour <= 16) {
      // Daylight: Key bright from upper left, ambient 0.6
      return {
        ambient: 0.65,
        ambientColor: '#F4EFE6',
        keyPos: [-4, 5, 4],
        keyIntensity: 1.4,
        keyColor: '#FFFFFF',
        rimPos: [3, 2, -3],
        rimIntensity: 0.3,
        rimColor: '#D8D3C8',
      };
    } else if (hour <= 21) {
      // Dusk: Warm gray, lower key
      return {
        ambient: 0.45,
        ambientColor: '#D8D0C0',
        keyPos: [-3, 3, 3],
        keyIntensity: 0.9,
        keyColor: '#E8DFD0',
        rimPos: [4, 3, -2],
        rimIntensity: 0.6,
        rimColor: '#A0988C',
      };
    } else {
      // Night (Act 4 / 25:00): Cool, dim, rim light from upper right
      return {
        ambient: 0.25,
        ambientColor: '#30303E',
        keyPos: [-2, 2, 2],
        keyIntensity: 0.4,
        keyColor: '#888894',
        rimPos: [5, 4, -3],
        rimIntensity: 1.6,
        rimColor: '#F4EFE6',
      };
    }
  }, [hour]);

  return (
    <>
      <ambientLight color={lighting.ambientColor} intensity={lighting.ambient} />
      <directionalLight
        position={lighting.keyPos}
        intensity={lighting.keyIntensity}
        color={lighting.keyColor}
      />
      <directionalLight
        position={lighting.rimPos}
        intensity={lighting.rimIntensity}
        color={lighting.rimColor}
      />
    </>
  );
}

// Dynamic R3F Canvas loader (lazy)
const R3FCanvas = lazy(async () => {
  const { Canvas } = await import('@react-three/fiber');
  return {
    default: function LazyCanvasWrapper({ hour, isHovered }) {
      return (
        <Canvas
          dpr={[1, 1.5]}
          frameloop="demand"
          camera={{ position: [0, 0.4, 3.8], fov: 36 }}
          gl={{ antialias: true, alpha: true }}
          style={{ width: '100%', height: '100%' }}
        >
          <WolfLighting hour={hour} />
          <ProceduralWolfHead hour={hour} isHovered={isHovered} />
        </Canvas>
      );
    },
  };
});

// =========================================================
// 2.5D PARALLAX SVG FALLBACK COMPONENT
// =========================================================
function Wolf2DFallback({ hour = 12.0 }) {
  const containerRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setOffset({ x: nx * 16, y: ny * 16 });
  };

  const isNight = hour > 21;
  const isDusk = hour > 16 && hour <= 21;

  const bgTone = isNight ? '#0A0A0E' : isDusk ? '#2A2A35' : '#111116';
  const furTone = isNight ? '#3A3A4A' : isDusk ? '#555562' : '#888894';

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="about-wolf-2d-fallback"
      aria-label="Kokuro Lone Wolf 2.5D Manga Silhouette"
    >
      <svg
        viewBox="0 0 300 300"
        className="about-wolf-svg"
        aria-hidden="true"
      >
        {/* Layer 1: Background Silhouette & Ears */}
        <g
          style={{
            transform: `translate(${offset.x * 0.4}px, ${offset.y * 0.4}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          {/* Left Ear */}
          <polygon points="90,140 70,40 130,90" fill={bgTone} stroke="#111116" strokeWidth="3" />
          {/* Right Ear */}
          <polygon points="210,140 230,40 170,90" fill={bgTone} stroke="#111116" strokeWidth="3" />
          {/* Crown & Mane */}
          <path
            d="M 60 180 Q 70 120 150 100 Q 230 120 240 180 Q 200 240 150 250 Q 100 240 60 180 Z"
            fill={bgTone}
            stroke="#111116"
            strokeWidth="4"
          />
        </g>

        {/* Layer 2: Midface & Snout Contour */}
        <g
          style={{
            transform: `translate(${offset.x * 0.8}px, ${offset.y * 0.8}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          <path
            d="M 100 130 L 150 85 L 200 130 L 175 210 L 150 235 L 125 210 Z"
            fill={furTone}
            stroke="#111116"
            strokeWidth="3"
          />
          {/* Muzzle Ridge */}
          <polygon points="140,140 160,140 155,225 145,225" fill={bgTone} />
          <polygon points="135,220 165,220 150,238" fill="#111116" />
        </g>

        {/* Layer 3: Vermilion Glowing Eyes */}
        <g
          style={{
            transform: `translate(${offset.x * 1.2}px, ${offset.y * 1.2}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          {/* Left Eye */}
          <polygon points="112,145 136,155 120,162" fill="#D7331F" />
          <circle cx="126" cy="153" r="1.5" fill="#FFFFFF" />
          {/* Right Eye */}
          <polygon points="188,145 164,155 180,162" fill="#D7331F" />
          <circle cx="174" cy="153" r="1.5" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
}

// =========================================================
// MAIN WOLF STAGE COMPONENT (With lazy mounting and detection)
// =========================================================
export default function WolfStage({
  hour = 12.0,
  isHovered = false,
  className = '',
}) {
  const [shouldRender3D] = useState(() => {
    if (typeof window === 'undefined') return false;

    const params = new URLSearchParams(window.location.search);
    const wolfOverride = params.get('wolf');

    if (wolfOverride === '2d') return false;
    if (wolfOverride === '3d') return true;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileWidth = window.innerWidth < 768;
    const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    const lowMem = navigator.deviceMemory && navigator.deviceMemory <= 4;

    // Check WebGL availability
    let hasWebGL = false;
    try {
      const canvas = document.createElement('canvas');
      hasWebGL = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch {
      hasWebGL = false;
    }

    return !prefersReducedMotion && !isMobileWidth && !lowCores && !lowMem && hasWebGL;
  });

  const [isInView, setIsInView] = useState(false);
  const stageRef = useRef(null);

  // IntersectionObserver to lazy-load within 400px of viewport
  useEffect(() => {
    if (!stageRef.current || typeof IntersectionObserver === 'undefined') {
      const timer = setTimeout(() => setIsInView(true), 0);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      { rootMargin: '400px' }
    );

    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={stageRef}
      className={`about-wolf-stage-root ${className}`}
      aria-label="Kokurō Lone Wolf Character Stage"
    >
      {/* Halftone Texture Overlay Layer */}
      <div className="about-wolf-screentone-overlay" aria-hidden="true" />

      {/* Canvas or 2.5D Fallback */}
      {shouldRender3D && isInView ? (
        <Suspense fallback={<Wolf2DFallback hour={hour} />}>
          <R3FCanvas hour={hour} isHovered={isHovered} />
        </Suspense>
      ) : (
        <Wolf2DFallback hour={hour} />
      )}
    </div>
  );
}
