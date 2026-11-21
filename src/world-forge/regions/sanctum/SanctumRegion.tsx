import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PointsMaterial,
  type Group,
  type Mesh,
  type Points,
} from 'three';
import { useExperienceSnapshot, useExperienceStore } from '../../experience/ExperienceContext';
import Waterfall from '../../look/Waterfall';
import { BLUEPRINT } from '../../look/palette';
import { buildSanctum, SANCTUM_EDGE_LEVEL } from './sanctumGeometry';
import { COURT, FORM_HEIGHT, FRAGMENTS, HALO, PLATFORM, POOL, rimRadius, SANCTUM_ANCHOR, SANCTUM_YAW, WATERFALLS, type FragmentId } from './sanctumLayout';

const EMERALD = BLUEPRINT.region.originSanctum;
const isFragment = (view: string | null): view is FragmentId => view === 'engineer' || view === 'creator' || view === 'explorer';

/** Faint emerald motes rising from the pool ("subtle energy"). Off on the low tier and under reduced motion. */
function Motes({ count }: { count: number }) {
  const ref = useRef<Points>(null);
  const { geometry, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = Array.from({ length: count }, (_, i) => ({ a: (i * 2.399) % (Math.PI * 2), r: 0.6 + ((i * 0.618) % 1) * (POOL.radius - 1), phase: (i * 0.377) % 1, speed: 0.06 + ((i * 0.13) % 1) * 0.05 }));
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    return { geometry, seeds };
  }, [count]);
  const material = useMemo(
    () => new PointsMaterial({ color: new Color(EMERALD).multiplyScalar(1.6), size: 0.32, transparent: true, opacity: 0.75, blending: AdditiveBlending, depthWrite: false, toneMapped: false }),
    [],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);
  useFrame(({ clock }) => {
    const points = ref.current;
    if (!points) return;
    const p = geometry.getAttribute('position') as BufferAttribute;
    const t = clock.elapsedTime;
    seeds.forEach((s, i) => {
      const k = (s.phase + t * s.speed) % 1;
      p.setXYZ(i, Math.sin(s.a + k * 1.5) * s.r * (1 - k * 0.4), COURT.top + 0.3 + k * 14, Math.cos(s.a + k * 1.5) * s.r * (1 - k * 0.4));
    });
    p.needsUpdate = true;
  });
  return <points ref={ref} geometry={geometry} material={material} frustumCulled={false} />;
}

interface SanctumRegionProps {
  /** False under reduced motion: no drift, motes or turning pointer. */
  animate: boolean;
  /** Mote count (quality tier); 0 draws none. */
  motes: number;
}

/**
 * 01 — THE ORIGIN SANCTUM (M6.1 "The Quiet Court", DEC-026): an open-air sanctum on the
 * emerald island. A pillar ring surrounds a still pool; three identity fragments (Engineer,
 * Creator, Explorer) float on platforms around the court; a broken halo hangs above; two
 * waterfalls pour off the back edges, and the Forge stands on the horizon behind.
 *
 * Choosing a fragment (here, or from the Sanctum card) opens the Sanctum panel on it and
 * brightens its emerald lines. Rendering: stone, moss, edges and pool are baked (4 draws);
 * the halo and the pointer move (2); motes (1) and two waterfalls (2) complete it. Picking
 * uses invisible boxes, which also give touch generous targets.
 */
export default function SanctumRegion({ animate, motes }: SanctumRegionProps) {
  const store = useExperienceStore();
  const { sanctumView, currentRegion, phase } = useExperienceSnapshot();
  const invalidate = useThree((state) => state.invalidate);
  const built = useMemo(() => buildSanctum(), []);
  useEffect(
    () => () => {
      for (const g of [built.stone, built.moss, built.edges, built.pool, built.halo, built.pointer]) g.dispose();
    },
    [built],
  );
  const resources = useMemo(
    () => ({
      // Pale weathered stone, lifted a little so it reads against the Forge's gold behind it.
      stone: new MeshStandardMaterial({ color: '#b7b2ca', roughness: 0.9, metalness: 0.03, flatShading: true, emissive: new Color('#3a3652'), emissiveIntensity: 0.9 }),
      moss: new MeshStandardMaterial({ color: '#45a764', roughness: 1, metalness: 0, flatShading: true, emissive: new Color('#0f2e1b'), emissiveIntensity: 1 }),
      edges: new MeshBasicMaterial({ vertexColors: true, toneMapped: false }),
      pool: new MeshStandardMaterial({ color: '#0b1f22', roughness: 0.08, metalness: 0.6, emissive: new Color(EMERALD), emissiveIntensity: 0.08 }),
      hit: new MeshBasicMaterial({ visible: false }),
      hitBox: new BoxGeometry(1, 1, 1),
    }),
    [],
  );
  useEffect(
    () => () => {
      resources.stone.dispose();
      resources.moss.dispose();
      resources.edges.dispose();
      resources.pool.dispose();
      resources.hit.dispose();
      resources.hitBox.dispose();
    },
    [resources],
  );
  useEffect(() => () => void (document.body.style.cursor = ''), []);

  const [hovered, setHovered] = useState<FragmentId | null>(null);
  const interactive = currentRegion === 'origin-sanctum' && phase === 'idle';
  const selected = isFragment(sanctumView) ? sanctumView : null;
  // Hover only reads while a fragment can be chosen (not under the open panel, not in travel).
  const lit = interactive && sanctumView === null ? hovered : null;
  useEffect(() => invalidate(), [lit, sanctumView, invalidate]);

  const edgesRef = useRef<Mesh>(null);
  const haloRef = useRef<Group>(null);
  const pointerRef = useRef<Group>(null);
  const applied = useRef<Record<string, number>>({});
  const tint = useMemo(() => new Color(), []);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (animate && haloRef.current) {
      haloRef.current.rotation.y = t * 0.04;
      haloRef.current.position.y = HALO.y + Math.sin(t * 0.35) * 0.5;
    }
    if (animate && pointerRef.current) pointerRef.current.rotation.y = 0.6 + Math.sin(t * 0.12) * 1.1;
    const mesh = edgesRef.current;
    if (!mesh) return;
    const color = mesh.geometry.getAttribute('color') as BufferAttribute;
    let dirty = false;
    const paint = (key: string, range: { start: number; count: number }, level: number) => {
      if (applied.current[key] !== undefined && Math.abs(applied.current[key] - level) < 1e-3) return;
      applied.current[key] = level;
      tint.set(EMERALD).multiplyScalar(level);
      for (let v = range.start; v < range.start + range.count; v++) color.setXYZ(v, tint.r, tint.g, tint.b);
      dirty = true;
    };
    for (const site of FRAGMENTS) {
      const shimmer = animate && selected === site.id ? 1 + Math.sin(t * 2.2) * 0.1 : 1;
      const level = selected === site.id ? SANCTUM_EDGE_LEVEL.selected * shimmer : lit === site.id ? SANCTUM_EDGE_LEVEL.hover : SANCTUM_EDGE_LEVEL.rest;
      paint(site.id, built.fragmentEdges[site.id], level);
    }
    paint('court', built.courtEdges, SANCTUM_EDGE_LEVEL.court);
    if (dirty) color.needsUpdate = true;
  });

  const choose = (id: FragmentId) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!interactive) return;
    document.body.style.cursor = '';
    store.openSanctum(id);
  };

  const waterfalls = useMemo(
    () =>
      WATERFALLS.map((w) => {
        // Just outside the lip: inside it, the island's 14 m cliff and bulging rock would hide the water.
        const r = rimRadius(w.bearing) + 1;
        const a = (w.bearing * Math.PI) / 180;
        return { ...w, position: [Math.sin(a) * r, -0.5, Math.cos(a) * r] as [number, number, number], rotationY: a };
      }),
    [],
  );

  return (
    <group position={SANCTUM_ANCHOR} rotation={[0, SANCTUM_YAW, 0]}>
      <mesh geometry={built.stone} material={resources.stone} />
      <mesh geometry={built.moss} material={resources.moss} />
      <mesh ref={edgesRef} geometry={built.edges} material={resources.edges} />
      <mesh geometry={built.pool} material={resources.pool} />
      <group ref={haloRef} position={[0, HALO.y, 0]}>
        <mesh geometry={built.halo} material={resources.stone} />
      </group>
      <group ref={pointerRef} position={built.pointerPivot} rotation={[0, 0.6, 0]}>
        <mesh geometry={built.pointer} material={resources.stone} />
      </group>
      {animate && motes > 0 && <Motes count={motes} />}
      {waterfalls.map((w) => (
        <Waterfall key={w.bearing} position={w.position} rotationY={w.rotationY} width={w.width} height={w.height} animate={animate} />
      ))}
      {FRAGMENTS.map((site) => (
        <mesh
          key={site.id}
          geometry={resources.hitBox}
          material={resources.hit}
          position={[site.position[0], site.position[1] + (FORM_HEIGHT[site.id] - PLATFORM.thickness) / 2, site.position[2]]}
          scale={[PLATFORM.radius * 2 + 1, FORM_HEIGHT[site.id] + PLATFORM.thickness + 1, PLATFORM.radius * 2 + 1]}
          onClick={choose(site.id)}
          onPointerOver={(e) => {
            e.stopPropagation();
            if (!interactive) return;
            setHovered(site.id);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered((h) => (h === site.id ? null : h));
            document.body.style.cursor = '';
          }}
        />
      ))}
    </group>
  );
}
