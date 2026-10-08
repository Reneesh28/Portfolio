import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Generate procedural high-res manga cover textures using HTML5 Canvas
function createMangaCoverTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1440;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background: Aged tactile manga paper with subtle tint
  ctx.fillStyle = '#F4EFE6';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Halftone screentone dot pattern on top
  ctx.fillStyle = 'rgba(20, 20, 25, 0.04)';
  const dotSpacing = 8;
  for (let x = 0; x < canvas.width; x += dotSpacing) {
    for (let y = 0; y < canvas.height; y += dotSpacing) {
      if ((x + y) % (dotSpacing * 2) === 0) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Top header banner: Manga Tankobon Volume Badge
  ctx.fillStyle = '#111116';
  ctx.fillRect(40, 40, canvas.width - 80, 50);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 22px "Noto Sans JP", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('SHONEN JUMP COMICS // SPECIAL EDITION', 60, 74);

  ctx.fillStyle = '#111116';
  ctx.fillRect(canvas.width - 160, 40, 120, 50);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 22px "Dela Gothic One", sans-serif';
  ctx.fillText('第壱巻', canvas.width - 145, 75);

  // Manga decorative frame borders
  ctx.strokeStyle = '#111116';
  ctx.lineWidth = 6;
  ctx.strokeRect(40, 110, canvas.width - 80, canvas.height - 380);

  ctx.lineWidth = 2;
  ctx.strokeRect(48, 118, canvas.width - 96, canvas.height - 396);

  // Screentone manga art panel in center
  ctx.fillStyle = '#EAE3D2';
  ctx.fillRect(54, 124, canvas.width - 108, canvas.height - 408);

  // Speed lines radiating in panel
  ctx.strokeStyle = 'rgba(17, 17, 22, 0.12)';
  ctx.lineWidth = 1.5;
  const cx = canvas.width / 2;
  const cy = 460;
  for (let angle = 0; angle < Math.PI * 2; angle += 0.08) {
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * 120, cy + Math.sin(angle) * 120);
    ctx.lineTo(cx + Math.cos(angle) * 500, cy + Math.sin(angle) * 500);
    ctx.stroke();
  }

  // Author Emblem / Hanko Seal (Pure black ink stamp: 憧)
  const sealSize = 110;
  const sealX = canvas.width - 190;
  const sealY = 160;

  ctx.fillStyle = '#111116';
  ctx.fillRect(sealX, sealY, sealSize, sealSize);
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.strokeRect(sealX + 6, sealY + 6, sealSize - 12, sealSize - 12);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 68px "Yuji Boku", "Yuji Syuku", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('憧', sealX + sealSize / 2, sealY + sealSize / 2 + 4);

  // Main Japanese Vertical Calligraphy: 憧れ (Akogare)
  ctx.fillStyle = '#111116';
  ctx.font = '900 130px "Yuji Boku", "Yuji Syuku", serif';
  ctx.textAlign = 'center';
  ctx.fillText('憧', 210, 320);
  ctx.fillText('れ', 210, 470);

  // Supporting Identity: 一匹狼 (Ippiki Ōkami)
  ctx.fillStyle = '#111116';
  ctx.font = '900 84px "Dela Gothic One", "RocknRoll One", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('一匹狼', 340, 310);

  // Latin bridge representation: IPPIKI ŌKAMI
  ctx.fillStyle = '#111116';
  ctx.font = '900 32px "Dela Gothic One", "Noto Sans JP", sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('IPPIKI ŌKAMI', 345, 370);

  // Author & Specialty subtitle in English
  ctx.fillStyle = '#555560';
  ctx.font = '700 22px "Noto Sans JP", sans-serif';
  ctx.fillText('IRISHNG · AI SYSTEMS & FULL-STACK', 345, 430);

  // Ink wash splatter accents
  ctx.fillStyle = '#111116';
  ctx.beginPath();
  ctx.arc(cx, 650, 4, 0, Math.PI * 2);
  ctx.arc(cx + 40, 680, 2, 0, Math.PI * 2);
  ctx.arc(cx - 50, 630, 3, 0, Math.PI * 2);
  ctx.fill();

  // Tankobon Obi (帯 - Belly Band) at bottom
  const obiY = canvas.height - 240;
  ctx.fillStyle = '#111116';
  ctx.fillRect(0, obiY, canvas.width, 240);

  // Obi White Stripe
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, obiY, canvas.width, 4);

  ctx.fillStyle = '#F4EFE6';
  ctx.font = '900 44px "Dela Gothic One", "RocknRoll One", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('【PORTFOLIO】IRISHNG', canvas.width / 2, obiY + 70);

  ctx.font = '700 22px "Noto Sans JP", sans-serif';
  ctx.fillStyle = 'rgba(244, 239, 230, 0.85)';
  ctx.fillText('AI SYSTEMS · FULL STACK · INTERACTIVE ART', canvas.width / 2, obiY + 120);

  ctx.font = '900 32px "Dela Gothic One", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('憧れ · IPPIKI ŌKAMI', canvas.width / 2, obiY + 180);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Generate Manga Book Spine Texture
function createMangaSpineTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 1440;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#F4EFE6';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Top Jump Logo box
  ctx.fillStyle = '#111116';
  ctx.fillRect(20, 30, canvas.width - 40, 80);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 32px "Dela Gothic One", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('JUMP', canvas.width / 2, 80);

  // Volume 1 badge
  ctx.fillStyle = '#111116';
  ctx.beginPath();
  ctx.arc(canvas.width / 2, 180, 45, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 42px "Dela Gothic One", sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('1', canvas.width / 2, 182);

  // Vertical spine title: 憧れ
  ctx.fillStyle = '#111116';
  ctx.font = '900 80px "Yuji Boku", serif';
  ctx.fillText('憧', canvas.width / 2, 340);
  ctx.fillText('れ', canvas.width / 2, 450);

  // Subtitle vertical: 一匹狼
  ctx.font = '900 48px "Dela Gothic One", sans-serif';
  ctx.fillText('一', canvas.width / 2, 600);
  ctx.fillText('匹', canvas.width / 2, 670);
  ctx.fillText('狼', canvas.width / 2, 740);

  // Author vertical: IRISHNG
  ctx.fillStyle = '#33333E';
  ctx.font = '700 24px "Dela Gothic One", sans-serif';
  ctx.fillText('IRISHNG', canvas.width / 2, 920);

  // Bottom Obi wrap
  const obiY = canvas.height - 240;
  ctx.fillStyle = '#111116';
  ctx.fillRect(0, obiY, canvas.width, 240);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, obiY, canvas.width, 4);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 32px "Dela Gothic One", sans-serif';
  ctx.fillText('初版', canvas.width / 2, obiY + 120);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Generate Manga Book Inner Pages / Spread Texture
function createMangaInnerSpreadTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1440;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Newsprint / Manga book page tone
  ctx.fillStyle = '#EDE6D6';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Gutter shadow in center fold
  const grad = ctx.createLinearGradient(canvas.width / 2 - 60, 0, canvas.width / 2 + 60, 0);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.5, 'rgba(0,0,0,0.3)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(canvas.width / 2 - 60, 0, 120, canvas.height);

  // Left Page: Manga Panel Composition
  ctx.strokeStyle = '#111116';
  ctx.lineWidth = 5;

  // Panel 1 (Top Left)
  ctx.strokeRect(40, 40, canvas.width / 2 - 80, 280);
  ctx.fillStyle = '#111116';
  ctx.font = '900 38px "Dela Gothic One", sans-serif';
  ctx.fillText('第壱話「孤高の起動」', 65, 110);
  ctx.font = '600 20px "Noto Sans JP", sans-serif';
  ctx.fillText('ACT 01 // IPPIKI ŌKAMI AWAKENING', 65, 150);

  // Panel 2 (Bottom Left Diagonal Cut)
  ctx.beginPath();
  ctx.moveTo(40, 350);
  ctx.lineTo(canvas.width / 2 - 40, 380);
  ctx.lineTo(canvas.width / 2 - 40, canvas.height - 50);
  ctx.lineTo(40, canvas.height - 50);
  ctx.closePath();
  ctx.stroke();

  // Screentone speed lines in bottom left panel
  ctx.strokeStyle = 'rgba(17,17,22,0.2)';
  ctx.lineWidth = 2;
  for (let x = 60; x < canvas.width / 2 - 50; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x, 400);
    ctx.lineTo(x - 30, canvas.height - 60);
    ctx.stroke();
  }

  // Right Page: Dynamic Hero Splash Panel
  ctx.strokeStyle = '#111116';
  ctx.lineWidth = 6;
  ctx.strokeRect(canvas.width / 2 + 40, 40, canvas.width / 2 - 80, canvas.height - 90);

  // Halftone gradient on right page
  ctx.fillStyle = 'rgba(17,17,22,0.06)';
  for (let x = canvas.width / 2 + 50; x < canvas.width - 50; x += 10) {
    for (let y = 50; y < canvas.height - 50; y += 10) {
      if ((x + y) % 20 === 0) {
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Manga SFX Sound Effect Typography on Right Page: ドォォン!!
  ctx.fillStyle = '#111116';
  ctx.font = '900 110px "Dela Gothic One", "Reggae One", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ドォォン!!', canvas.width * 0.75, 480);

  ctx.fillStyle = '#111116';
  ctx.font = '900 42px "Dela Gothic One", "Noto Sans JP", sans-serif';
  ctx.fillText('憧れ · IPPIKI ŌKAMI', canvas.width * 0.75, 570);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Generate Paper Page Edges Texture (realistic book block)
function createPagesEdgeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#E8E1D0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Fine paper layer lines
  ctx.strokeStyle = 'rgba(60, 50, 40, 0.18)';
  ctx.lineWidth = 1;
  for (let y = 0; y < canvas.height; y += 2) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 1);
  return texture;
}

function MangaBookModel({ progress = 0, bookRotation = [0, 0, 0] }) {
  const groupRef = useRef(null);
  const coverHingeRef = useRef(null);
  const innerSpreadRef = useRef(null);

  // Dimensions (B6 Tankobon ratio)
  const bookWidth = 2.8;
  const bookHeight = 4.0;
  const bookThickness = 0.42;

  // Textures
  const coverTexture = useMemo(() => createMangaCoverTexture(), []);
  const spineTexture = useMemo(() => createMangaSpineTexture(), []);
  const spreadTexture = useMemo(() => createMangaInnerSpreadTexture(), []);
  const edgeTexture = useMemo(() => createPagesEdgeTexture(), []);

  // Cleanup textures on unmount
  useEffect(() => {
    return () => {
      coverTexture.dispose();
      spineTexture.dispose();
      spreadTexture.dispose();
      edgeTexture.dispose();
    };
  }, [coverTexture, spineTexture, spreadTexture, edgeTexture]);

  useFrame(() => {
    if (coverHingeRef.current) {
      // Progress controls cover open angle: 0 = closed, 1 = fully open (160 deg)
      const openAngle = -progress * Math.PI * 0.92;
      coverHingeRef.current.rotation.y = openAngle;
    }
    if (innerSpreadRef.current) {
      innerSpreadRef.current.material.opacity = THREE.MathUtils.clamp((progress - 0.15) * 2.5, 0, 1);
    }
  });

  return (
    <group ref={groupRef} rotation={bookRotation}>
      {/* --- MAIN BOOK BLOCK (Pages + Spine + Back Cover) --- */}
      <group position={[0, 0, 0]}>
        {/* Paper Block (Book body) */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[bookWidth, bookHeight, bookThickness]} />
          {/* Material array for [right, left(spine), top, bottom, front, back] */}
          <meshStandardMaterial attach="material-0" map={edgeTexture} roughness={0.9} />
          <meshStandardMaterial attach="material-1" map={spineTexture} roughness={0.6} />
          <meshStandardMaterial attach="material-2" map={edgeTexture} roughness={0.9} />
          <meshStandardMaterial attach="material-3" map={edgeTexture} roughness={0.9} />
          <meshStandardMaterial attach="material-4" color="#F4EFE6" roughness={0.7} />
          <meshStandardMaterial attach="material-5" color="#111116" roughness={0.7} />
        </mesh>

        {/* Inner Manga Page Spread (revealed under cover) */}
        <mesh
          ref={innerSpreadRef}
          position={[0, 0, bookThickness / 2 + 0.005]}
        >
          <planeGeometry args={[bookWidth * 0.96, bookHeight * 0.96]} />
          <meshStandardMaterial
            map={spreadTexture}
            roughness={0.85}
            transparent
            opacity={0}
          />
        </mesh>
      </group>

      {/* --- FRONT COVER HINGE (Rotates on spine left edge: x = -bookWidth / 2) --- */}
      <group
        ref={coverHingeRef}
        position={[-bookWidth / 2, 0, bookThickness / 2 + 0.008]}
      >
        <mesh position={[bookWidth / 2, 0, 0]}>
          <boxGeometry args={[bookWidth, bookHeight, 0.012]} />
          <meshStandardMaterial attach="material-0" color="#111116" />
          <meshStandardMaterial attach="material-1" color="#111116" />
          <meshStandardMaterial attach="material-2" color="#111116" />
          <meshStandardMaterial attach="material-3" color="#111116" />
          {/* Front of cover */}
          <meshStandardMaterial attach="material-4" map={coverTexture} roughness={0.55} />
          {/* Inside of front cover */}
          <meshStandardMaterial attach="material-5" color="#EDE6D6" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

export default function MangaBook3D({
  openProgress = 0,
  bookRotation = [0.2, -0.3, 0.05],
  cameraPosition = [0, 0, 7.2],
  scale = 1
}) {
  return (
    <div className="manga-book-canvas-container" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <Canvas
        camera={{ position: cameraPosition, fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        {/* Soft studio manga lighting */}
        <ambientLight intensity={1.4} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} castShadow={false} />
        <directionalLight position={[-5, -4, 3]} intensity={0.6} color="#EAE3D2" />
        <pointLight position={[0, 0, 4]} intensity={0.8} color="#FFFBF0" />

        <group scale={scale}>
          <MangaBookModel progress={openProgress} bookRotation={bookRotation} />
        </group>
      </Canvas>
    </div>
  );
}
