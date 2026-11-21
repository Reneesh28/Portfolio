import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { AdditiveBlending, BoxGeometry, BufferAttribute, Color, MeshBasicMaterial, MeshStandardMaterial, type Mesh } from 'three';
import { isMilestone, type MilestoneId } from '../../content/timeline';
import { useExperienceSnapshot, useExperienceStore } from '../../experience/ExperienceContext';
import { BLUEPRINT } from '../../look/palette';
import { approach } from '../../camera/cameraTargets';
import { ASCENSION_LEVEL, buildAscension, type Range } from './ascensionGeometry';
import { MILESTONE_DISTANCE, TOWARD_HUB, WAYSTONES } from './ascensionLayout';

const PALE = BLUEPRINT.region.pathOfAscension;
/** Metres per second the lit front climbs (or falls back) along the path. */
const FRONT_SPEED = 160;

/**
 * 04 — THE PATH OF ASCENSION (M6.3 "The Lit Ascent", DEC-030). A pale stone path climbs the
 * four snow-capped islands over floating stair spans; five waystones mark the milestones.
 * Choosing one (here, or from the timeline selector) draws the camera to it and lights the
 * path's lanterns from the foot of the climb up to it: progress you can see.
 *
 * Rendering: stone, snow, lanterns, crown lights and the summit's beam are baked (5 draws).
 * Picking uses invisible boxes around the waystones.
 */
export default function AscensionRegion({ animate }: { animate: boolean }) {
  const store = useExperienceStore();
  const { ascensionMilestone, currentRegion, phase } = useExperienceSnapshot();
  const invalidate = useThree((state) => state.invalidate);
  const built = useMemo(() => buildAscension(), []);
  useEffect(
    () => () => {
      for (const g of [built.stone, built.snow, built.lanterns, built.lights, built.beam]) g.dispose();
    },
    [built],
  );
  const resources = useMemo(
    () => ({
      stone: new MeshStandardMaterial({ color: '#a6aec4', roughness: 0.92, metalness: 0.03, flatShading: true, emissive: new Color('#2c3146'), emissiveIntensity: 0.9 }),
      snow: new MeshStandardMaterial({ color: '#f1f5ff', roughness: 0.8, metalness: 0, flatShading: true, emissive: new Color('#6f7ba3'), emissiveIntensity: 0.6 }),
      glow: new MeshBasicMaterial({ vertexColors: true, toneMapped: false }),
      beam: new MeshBasicMaterial({ color: new Color(PALE).multiplyScalar(0.9), transparent: true, opacity: 0.08, blending: AdditiveBlending, depthWrite: false, toneMapped: false }),
      hit: new MeshBasicMaterial({ visible: false }),
      hitBox: new BoxGeometry(1, 1, 1),
    }),
    [],
  );
  useEffect(
    () => () => {
      resources.stone.dispose();
      resources.snow.dispose();
      resources.glow.dispose();
      resources.beam.dispose();
      resources.hit.dispose();
      resources.hitBox.dispose();
    },
    [resources],
  );
  useEffect(() => () => void (document.body.style.cursor = ''), []);

  const [hovered, setHovered] = useState<MilestoneId | null>(null);
  const interactive = currentRegion === 'path-of-ascension' && phase === 'idle';
  const chosen = isMilestone(ascensionMilestone) ? ascensionMilestone : null;
  const lit = interactive && ascensionMilestone === null ? hovered : null;
  useEffect(() => invalidate(), [lit, ascensionMilestone, invalidate]);

  const lanternsRef = useRef<Mesh>(null);
  const lightsRef = useRef<Mesh>(null);
  const front = useRef(0);
  const applied = useRef<Record<string, number>>({});
  const tint = useMemo(() => new Color(), []);

  useFrame(({ clock }, delta) => {
    const goal = chosen ? MILESTONE_DISTANCE[chosen] + 1 : 0;
    front.current = animate ? approach(front.current, goal, delta * FRONT_SPEED) : goal;
    if (front.current !== goal) invalidate();

    const paint = (mesh: Mesh | null, key: string, range: Range, level: number) => {
      if (!mesh) return false;
      if (applied.current[key] !== undefined && Math.abs(applied.current[key] - level) < 1e-3) return false;
      applied.current[key] = level;
      const attr = mesh.geometry.getAttribute('color') as BufferAttribute;
      tint.set(PALE).multiplyScalar(level);
      for (let v = range.start; v < range.start + range.count; v++) attr.setXYZ(v, tint.r, tint.g, tint.b);
      return true;
    };
    let lanternsDirty = false;
    built.lanternRanges.forEach((r, k) => {
      const level = r.distance <= front.current ? ASCENSION_LEVEL.lanternLit : ASCENSION_LEVEL.lanternRest;
      lanternsDirty = paint(lanternsRef.current, `l${k}`, r, level) || lanternsDirty;
    });
    let lightsDirty = false;
    for (const w of WAYSTONES) {
      const pulse = animate && chosen === w.id ? 1 + Math.sin(clock.elapsedTime * 2.2) * 0.08 : 1;
      const level = (chosen === w.id ? ASCENSION_LEVEL.crownChosen : lit === w.id ? ASCENSION_LEVEL.crownHover : ASCENSION_LEVEL.crownRest) * pulse;
      lightsDirty = paint(lightsRef.current, w.id, built.lightRanges[w.id], level) || lightsDirty;
    }
    if (lanternsDirty && lanternsRef.current) (lanternsRef.current.geometry.getAttribute('color') as BufferAttribute).needsUpdate = true;
    if (lightsDirty && lightsRef.current) (lightsRef.current.geometry.getAttribute('color') as BufferAttribute).needsUpdate = true;
  });

  const choose = (id: MilestoneId) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!interactive) return;
    document.body.style.cursor = '';
    store.openAscension(id);
  };
  const yaw = Math.atan2(TOWARD_HUB[0], TOWARD_HUB[1]);

  return (
    <group>
      <mesh geometry={built.stone} material={resources.stone} />
      <mesh geometry={built.snow} material={resources.snow} />
      <mesh ref={lanternsRef} geometry={built.lanterns} material={resources.glow} />
      <mesh ref={lightsRef} geometry={built.lights} material={resources.glow} />
      <mesh geometry={built.beam} material={resources.beam} renderOrder={6} />
      {WAYSTONES.map((w) => (
        <mesh
          key={w.id}
          geometry={resources.hitBox}
          material={resources.hit}
          position={[w.position[0], w.position[1] + w.height / 2, w.position[2]]}
          rotation={[0, yaw, 0]}
          scale={[9, w.height + 1, 6]}
          onClick={choose(w.id)}
          onPointerOver={(e) => {
            e.stopPropagation();
            if (!interactive) return;
            setHovered(w.id);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered((h) => (h === w.id ? null : h));
            document.body.style.cursor = '';
          }}
        />
      ))}
    </group>
  );
}
