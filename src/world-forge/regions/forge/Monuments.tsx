import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { AdditiveBlending, BoxGeometry, Color, MeshBasicMaterial, MeshStandardMaterial, type BufferAttribute, type Mesh } from 'three';
import { builtProjects } from '../../content/projects';
import { useExperienceSnapshot, useExperienceStore } from '../../experience/ExperienceContext';
import { BLUEPRINT } from '../../look/palette';
import { CORE } from './hubLayout';
import { buildTerrace, EDGE_LEVEL, STELE, type TerraceMonument } from './monumentGeometry';

/** The thread of the Forge's light from a selected emblem's top to the Forge Core (drawn only while lit). */
function LightThread({ monument, selected, animate }: { monument: TerraceMonument; selected: boolean; animate: boolean }) {
  const ref = useRef<Mesh>(null);
  const material = useMemo(
    () =>
      new MeshBasicMaterial({ color: new Color(BLUEPRINT.gold.core).multiplyScalar(1.6), transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false, toneMapped: false }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);
  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const thread = mesh.material as MeshBasicMaterial;
    thread.opacity += ((selected ? 0.55 : 0) - thread.opacity) * (animate ? 0.08 : 1);
    if (!selected && thread.opacity < 0.002) thread.opacity = 0;
    mesh.visible = thread.opacity > 0;
  });
  const [bx, by, bz] = monument.base;
  const from: [number, number, number] = [bx, by + monument.top, bz];
  const dx = -from[0];
  const dy = CORE.light.y - from[1];
  const dz = -from[2];
  const flat = Math.hypot(dx, dz);
  return (
    <group position={from} rotation={[0, Math.atan2(dx, dz), 0]}>
      <mesh ref={ref} visible={false} material={material} rotation={[Math.atan2(flat, dy), 0, 0]} position={[0, dy / 2, flat / 2]} renderOrder={6}>
        <cylinderGeometry args={[0.12, 0.12, Math.hypot(dx, dy, dz), 6, 1, true]} />
      </mesh>
    </group>
  );
}

/**
 * The Forged Works (M5): one monument per project on the Projects terrace's plinths.
 * Click or tap a monument (or use the Works index) to focus it and open its dossier.
 *
 * Rendering (M5.8): all stone in one mesh and all glowing edges in another (vertex colours
 * carry each monument's state), so the eight monuments cost two draw calls, plus one for
 * the light thread while a work is selected. Picking uses invisible per-monument boxes,
 * which also give touch a generous target.
 */
export default function Monuments({ animate }: { animate: boolean }) {
  const store = useExperienceStore();
  const { focusedProject, currentRegion, phase } = useExperienceSnapshot();
  const invalidate = useThree((state) => state.invalidate);
  const projects = useMemo(() => builtProjects(), []);
  const terrace = useMemo(() => buildTerrace(projects), [projects]);
  useEffect(
    () => () => {
      terrace.stone.dispose();
      terrace.edges.dispose();
    },
    [terrace],
  );
  const resources = useMemo(
    () => ({
      stone: new MeshStandardMaterial({ color: '#3a3552', roughness: 0.85, metalness: 0.15, flatShading: true }),
      edges: new MeshBasicMaterial({ vertexColors: true, toneMapped: false }),
      // Never drawn (no draw call), but still hit by the raycaster for picking.
      hit: new MeshBasicMaterial({ visible: false }),
      hitBox: new BoxGeometry(1, 1, 1),
    }),
    [],
  );
  useEffect(
    () => () => {
      resources.stone.dispose();
      resources.edges.dispose();
      resources.hit.dispose();
      resources.hitBox.dispose();
    },
    [resources],
  );
  useEffect(() => () => void (document.body.style.cursor = ''), []);

  const [hovered, setHovered] = useState<string | null>(null);
  const interactive = currentRegion === 'world-forge' && phase === 'idle';
  // Hover only reads while a work can be chosen (not under an open dossier or in travel).
  const lit = interactive && focusedProject === null ? hovered : null;
  // Under a demand frameloop (reduced motion), a state change needs a frame to show.
  useEffect(() => invalidate(), [lit, focusedProject, invalidate]);

  const edgesRef = useRef<Mesh>(null);
  const applied = useRef<number[]>([]);
  const tint = useMemo(() => new Color(), []);
  useFrame(({ clock }) => {
    const mesh = edgesRef.current;
    if (!mesh) return;
    const color = mesh.geometry.getAttribute('color') as BufferAttribute;
    let dirty = false;
    terrace.monuments.forEach((m, i) => {
      const selected = focusedProject === m.id;
      const shimmer = animate && selected ? 1 + Math.sin(clock.elapsedTime * 2.2) * 0.12 : 1;
      const level = selected ? EDGE_LEVEL.selected * shimmer : lit === m.id ? EDGE_LEVEL.hover : EDGE_LEVEL.rest;
      if (applied.current[i] !== undefined && Math.abs(level - applied.current[i]) < 1e-3) return;
      applied.current[i] = level;
      tint.set(BLUEPRINT.gold.accent).multiplyScalar(level);
      for (let v = m.edges.start; v < m.edges.start + m.edges.count; v++) color.setXYZ(v, tint.r, tint.g, tint.b);
      dirty = true;
    });
    if (dirty) color.needsUpdate = true;
  });

  const choose = (id: string) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!interactive) return;
    document.body.style.cursor = '';
    store.focusProject(id);
  };

  return (
    <group>
      <mesh geometry={terrace.stone} material={resources.stone} />
      <mesh ref={edgesRef} geometry={terrace.edges} material={resources.edges} />
      {terrace.monuments.map((m) => (
        <group key={m.id}>
          <mesh
            geometry={resources.hitBox}
            material={resources.hit}
            position={[m.base[0], m.base[1] + m.top / 2, m.base[2]]}
            rotation={[0, m.yaw, 0]}
            scale={[STELE.width + 0.6, m.top, STELE.depth + 0.6]}
            onClick={choose(m.id)}
            onPointerOver={(e) => {
              e.stopPropagation();
              if (!interactive) return;
              setHovered(m.id);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setHovered((h) => (h === m.id ? null : h));
              document.body.style.cursor = '';
            }}
          />
          <LightThread monument={m} selected={focusedProject === m.id} animate={animate} />
        </group>
      ))}
    </group>
  );
}
