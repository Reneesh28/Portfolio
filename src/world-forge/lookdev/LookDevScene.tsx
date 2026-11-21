import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { CatmullRomCurve3, Color, MeshBasicMaterial, Vector3 } from 'three';
import { createRandom } from '../core/random';
import BlueprintSky from '../look/BlueprintSky';
import Bloom from '../look/Bloom';
import CloudSea from '../look/CloudSea';
import FloatingIsland from '../look/FloatingIsland';
import type { IslandShape } from '../look/islandGeometry';
import { BLUEPRINT } from '../look/palette';
import SpireCluster from '../look/SpireCluster';
import Waterfall from '../look/Waterfall';

/** Inspection views for the owner's P1 review (dev only; not the production camera). */
export const LOOKDEV_VIEWS = [
  { name: 'Establishing', position: [-900, 240, 1250], target: [-80, 70, 40], fov: 40 },
  { name: 'Forge hub', position: [340, 150, 450], target: [0, 150, 0], fov: 50 },
  { name: 'Island edge', position: [230, 60, 300], target: [50, -40, 55], fov: 55 },
] as const;

const HUB: IslandShape = { radius: 95, thickness: 20, depth: 170, irregularity: 0.18, jagged: 0.9, shards: 14 };
const SANCTUM: IslandShape = { radius: 52, thickness: 12, depth: 105, irregularity: 0.25, jagged: 0.9, shards: 6 };
const SANCTUM_AT: [number, number, number] = [-430, 15, 260];
const HUB_AT: [number, number, number] = [0, 45, 0];

function polar(bearingDeg: number, r: number): [number, number] {
  const a = (bearingDeg * Math.PI) / 180;
  return [Math.sin(a) * r, Math.cos(a) * r];
}

/** Places the dev inspection camera at a view, with a very slow drift so the light reads. */
function ViewCamera({ view, animate }: { view: number; animate: boolean }) {
  const v = LOOKDEV_VIEWS[view];
  useFrame(({ clock, camera }) => {
    const drift = animate ? Math.sin(clock.elapsedTime * 0.08) * 0.04 : 0;
    const [px, py, pz] = v.position;
    const [tx, ty, tz] = v.target;
    const c = Math.cos(drift);
    const s = Math.sin(drift);
    const dx = px - tx;
    const dz = pz - tz;
    camera.position.set(tx + dx * c - dz * s, py, tz + dx * s + dz * c);
    camera.lookAt(tx, ty, tz);
    if ('fov' in camera && camera.fov !== v.fov) {
      camera.fov = v.fov;
      camera.updateProjectionMatrix();
    }
  });
  return null;
}

/** A glowing golden route arcing between two islands (blueprint routes). */
function GoldenRoute({ from, to, lift }: { from: [number, number, number]; to: [number, number, number]; lift: number }) {
  const curve = useMemo(() => {
    const a = new Vector3(...from);
    const b = new Vector3(...to);
    const mid = a.clone().lerp(b, 0.5).add(new Vector3(0, lift, 0));
    return new CatmullRomCurve3([a, mid, b]);
  }, [from, to, lift]);
  const material = useMemo(() => new MeshBasicMaterial({ color: new Color(BLUEPRINT.gold.accent).multiplyScalar(1.6), toneMapped: false }), []);
  useEffect(() => () => material.dispose(), [material]);
  return (
    <mesh material={material}>
      <tubeGeometry args={[curve, 64, 0.9, 6, false]} />
    </mesh>
  );
}

/** Two rings of jagged, mist-softened mountain ranges far beyond the islands. */
function DistantMountains() {
  const peaks = useMemo(() => {
    const rand = createRandom(53);
    const items: Array<{ position: [number, number, number]; scale: [number, number, number]; rot: number; color: string }> = [];
    const ranges = [
      { r: 2300, count: 70, h: [180, 420], w: [90, 200], color: '#33266e' },
      { r: 3100, count: 90, h: [260, 640], w: [120, 260], color: '#4b3794' },
    ];
    for (const range of ranges) {
      for (let i = 0; i < range.count; i++) {
        const a = (i / range.count) * Math.PI * 2 + rand() * 0.05;
        const r = range.r + (rand() - 0.5) * 300;
        const h = range.h[0] + rand() ** 1.6 * (range.h[1] - range.h[0]);
        const w = range.w[0] + rand() * (range.w[1] - range.w[0]);
        items.push({ position: [Math.sin(a) * r, -150 + h / 2, Math.cos(a) * r], scale: [w, h, w * (0.6 + rand() * 0.6)], rot: rand() * Math.PI, color: range.color });
      }
    }
    return items;
  }, []);
  return (
    <group>
      {peaks.map((p, i) => (
        <mesh key={i} position={p.position} rotation={[0, p.rot, 0]} scale={p.scale}>
          <coneGeometry args={[1, 1, 4, 1]} />
          <meshStandardMaterial color={p.color} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

/** Small drifting rock fragments around the islands. */
function Fragments({ animate }: { animate: boolean }) {
  const rocks = useMemo(() => {
    const rand = createRandom(71);
    return Array.from({ length: 9 }, (_, i) => {
      const [x, z] = polar(rand() * 360, 150 + rand() * 260);
      return { key: i, position: [x, -10 + rand() * 120, z] as [number, number, number], shape: { radius: 5 + rand() * 9, thickness: 2.5, depth: 10 + rand() * 18, irregularity: 0.3, jagged: 1, shards: 1 } };
    });
  }, []);
  void animate;
  return (
    <group>
      {rocks.map((r) => (
        <FloatingIsland key={r.key} position={r.position} shape={r.shape} seed={300 + r.key} />
      ))}
    </group>
  );
}

/**
 * P1 look development (DEC-016): the blueprint look in one small scene. It contains
 * the sky, the violet cloud sea, a hub island carrying the golden spire-city
 * silhouette, an emerald region island (Origin Sanctum's proposed look), a golden
 * route, waterfalls, fragments and distant mountains. Development only.
 */
export default function LookDevScene({ view, animate, bloom }: { view: number; animate: boolean; bloom: boolean }) {
  const [wx, wz] = polar(40, 90);
  const [sx, sz] = polar(200, 48);

  return (
    <>
      <fogExp2 attach="fog" args={[BLUEPRINT.fog, 0.00026]} />
      {/* Sky light above, violet bounce from the cloud sea below (lights the rock undersides). */}
      <hemisphereLight args={['#6a55c8', '#4a3290', 0.85]} />
      <directionalLight position={[-800, 900, -1200]} intensity={1.7} color="#b9acff" />
      <directionalLight position={[600, 300, 800]} intensity={0.35} color="#7d6bd8" />

      <BlueprintSky glowDirection={[0.35, -0.94]} />
      <DistantMountains />
      <CloudSea animate={animate} />

      <FloatingIsland position={HUB_AT} shape={HUB} seed={11} topColor={BLUEPRINT.stone.mid}>
        <SpireCluster radius={70} height={210} seed={17} animate={animate} />
      </FloatingIsland>
      <Waterfall position={[wx, HUB_AT[1] - 6, wz]} rotationY={(40 * Math.PI) / 180} width={14} height={330} animate={animate} />

      <FloatingIsland position={SANCTUM_AT} shape={SANCTUM} seed={23} topColor="#1f5c40">
        <mesh position={[0, 7, 0]}>
          <cylinderGeometry args={[2.2, 3.2, 14, 6]} />
          <meshStandardMaterial color={BLUEPRINT.stone.light} flatShading />
        </mesh>
        <mesh position={[0, 15, 0]}>
          <octahedronGeometry args={[2.2, 0]} />
          <meshBasicMaterial color={new Color(BLUEPRINT.region.originSanctum).multiplyScalar(1.8)} toneMapped={false} />
        </mesh>
      </FloatingIsland>
      <Waterfall position={[SANCTUM_AT[0] + sx, SANCTUM_AT[1] - 4, SANCTUM_AT[2] + sz]} rotationY={(200 * Math.PI) / 180} width={8} height={200} animate={animate} />

      <GoldenRoute from={[SANCTUM_AT[0] + 40, SANCTUM_AT[1] + 1, SANCTUM_AT[2] - 30]} to={[-70, HUB_AT[1] + 1, 55]} lift={40} />
      <Fragments animate={animate} />

      <ViewCamera view={view} animate={animate} />
      {bloom && <Bloom />}
    </>
  );
}
