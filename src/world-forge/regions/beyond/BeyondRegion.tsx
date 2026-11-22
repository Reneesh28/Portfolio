import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { BoxGeometry, BufferAttribute, Color, MeshBasicMaterial, MeshStandardMaterial, type Mesh } from 'three';
import { isTerritory, openTerritories, TERRITORIES, type TerritoryId } from '../../content/interests';
import { WORLDS_BEYOND_TERRITORIES } from '../../data/worldGeography';
import { useExperienceSnapshot, useExperienceStore } from '../../experience/ExperienceContext';
import { BEYOND_LEVEL, buildBeyond, type BuiltTerritory, type Range } from './beyondGeometry';
import { GATE, GATES, LANDMARKS } from './beyondLayout';

/** Each built territory's own light (DEC-033: one family, each in its colour). */
const LIGHT: Readonly<Record<BuiltTerritory, string>> = {
  anime: '#ff5a3c',
  // Story-driven Games: one warm window and the lantern path, against the indigo mist.
  stories: '#ffd9a0',
  // Formula 1: steel track edges; the streak running along it is white (STREAK).
  f1: '#7f8ea8',
  creator: '#b06bff',
  guild: '#ffc27a',
  training: '#fff1d6',
};
/** Seconds for the F1 streak to run the length of the track; the broadcast rings' pulse period. */
const STREAK_SECONDS = 4.5;
const STREAK = '#f2f7ff';
const PULSE_SECONDS = 2.4;
/** Each territory's colour: its island's biome accent. */
const colourOf = (id: TerritoryId): string => {
  const island = TERRITORIES.find((t) => t.id === id)?.island;
  return WORLDS_BEYOND_TERRITORIES.find((t) => t.id === island)?.accent ?? '#ffffff';
};

/**
 * 05 — THE WORLDS BEYOND (M7, DEC-032, DEC-033): the Convergence and the territories built so far.
 *
 * The Convergence is a round plaza of six stone gates, each facing its territory and lit in
 * its colour, around a compass monolith whose six strips point at the gates. A territory that
 * can be opened (built, with content) has a brighter gate; choosing it (here or from the card)
 * draws the camera to its landmark and opens its panel. Each territory has one landmark in its
 * own colour: Anime & Manga's gate on a crag, Formula 1's banked track (a streak of light runs
 * along it), the broadcast tower (its rings pulse outward), The Guild's courtyard, and the
 * Training Grounds' cut stair.
 *
 * Rendering: everything static is baked into a stone mesh and a lines mesh (2 draws).
 */
export default function BeyondRegion({ animate }: { animate: boolean }) {
  const store = useExperienceStore();
  const { beyondTerritory, currentRegion, phase } = useExperienceSnapshot();
  const invalidate = useThree((state) => state.invalidate);
  const built = useMemo(() => buildBeyond(), []);
  useEffect(
    () => () => {
      built.stone.dispose();
      built.lines.dispose();
    },
    [built],
  );
  const resources = useMemo(
    () => ({
      stone: new MeshStandardMaterial({ color: '#8f88a8', roughness: 0.9, metalness: 0.04, flatShading: true, emissive: new Color('#2a2440'), emissiveIntensity: 0.9 }),
      lines: new MeshBasicMaterial({ vertexColors: true, toneMapped: false }),
      hit: new MeshBasicMaterial({ visible: false }),
      hitBox: new BoxGeometry(1, 1, 1),
    }),
    [],
  );
  useEffect(
    () => () => {
      resources.stone.dispose();
      resources.lines.dispose();
      resources.hit.dispose();
      resources.hitBox.dispose();
    },
    [resources],
  );
  useEffect(() => () => void (document.body.style.cursor = ''), []);

  const open = useMemo(() => new Set(openTerritories().map((t) => t.id)), []);
  const [hovered, setHovered] = useState<TerritoryId | null>(null);
  const interactive = currentRegion === 'worlds-beyond' && phase === 'idle';
  const chosen = isTerritory(beyondTerritory) ? beyondTerritory : null;
  const lit = interactive && beyondTerritory === null ? hovered : null;
  useEffect(() => invalidate(), [lit, beyondTerritory, invalidate]);

  const linesRef = useRef<Mesh>(null);
  const applied = useRef<Record<string, number>>({});
  const tint = useMemo(() => new Color(), []);
  useFrame(({ clock }) => {
    const mesh = linesRef.current;
    if (!mesh) return;
    const attr = mesh.geometry.getAttribute('color') as BufferAttribute;
    let dirty = false;
    const paint = (key: string, range: Range, colour: string, level: number) => {
      if (applied.current[key] !== undefined && Math.abs(applied.current[key] - level) < 1e-3) return;
      applied.current[key] = level;
      tint.set(colour).multiplyScalar(level);
      for (let v = range.start; v < range.start + range.count; v++) attr.setXYZ(v, tint.r, tint.g, tint.b);
      dirty = true;
    };
    for (const g of GATES) {
      const id = g.territory;
      const pulse = chosen === id ? 1 + Math.sin(clock.elapsedTime * 2.2) * 0.08 : 1;
      const level = chosen === id ? BEYOND_LEVEL.chosen * pulse : !open.has(id) ? BEYOND_LEVEL.closed : lit === id ? BEYOND_LEVEL.chosen : BEYOND_LEVEL.open;
      paint(`g-${id}`, built.gateRanges[id], colourOf(id), level);
      paint(`s-${id}`, built.stripRanges[id], colourOf(id), open.has(id) ? BEYOND_LEVEL.monolith : BEYOND_LEVEL.closed);
    }
    for (const [id, range] of Object.entries(built.territoryLights) as Array<[BuiltTerritory, Range]>) {
      paint(`t-${id}`, range, LIGHT[id], chosen === id ? BEYOND_LEVEL.territory * 1.3 : BEYOND_LEVEL.territory);
    }
    // The F1 streak runs the track; the broadcast rings pulse outward. Still under reduced motion.
    const t = clock.elapsedTime;
    const streak = built.sequences.f1;
    if (streak) {
      const head = animate ? ((t / STREAK_SECONDS) % 1) * streak.length : -1;
      streak.forEach((range, k) => {
        const d = head < 0 ? 99 : (head - k + streak.length) % streak.length;
        const level = head < 0 ? BEYOND_LEVEL.territory : d < 4 ? 2.6 - d * 0.5 : 0.35;
        paint(`f1-${k}`, range, STREAK, level);
      });
    }
    const rings = built.sequences.creator;
    if (rings) {
      const phase = animate ? ((t / PULSE_SECONDS) % 1) * rings.length : -1;
      rings.forEach((range, k) => {
        const d = Math.abs(phase - k - 0.5);
        const level = phase < 0 ? BEYOND_LEVEL.territory : d < 0.5 ? 2.4 : 0.5;
        paint(`ring-${k}`, range, LIGHT.creator, level);
      });
    }
    if (dirty) attr.needsUpdate = true;
  });

  const choose = (id: TerritoryId) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!interactive) return;
    document.body.style.cursor = '';
    store.openBeyond(id);
  };
  const hover = (id: TerritoryId) => ({
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (!interactive) return;
      setHovered(id);
      document.body.style.cursor = 'pointer';
    },
    onPointerOut: () => {
      setHovered((h) => (h === id ? null : h));
      document.body.style.cursor = '';
    },
  });

  return (
    <group>
      <mesh geometry={built.stone} material={resources.stone} />
      <mesh ref={linesRef} geometry={built.lines} material={resources.lines} />
      {GATES.filter((g) => open.has(g.territory)).map((g) => (
        <mesh
          key={`gate-${g.territory}`}
          geometry={resources.hitBox}
          material={resources.hit}
          position={[g.position[0], g.position[1] + GATE.height / 2, g.position[2]]}
          rotation={[0, g.yaw, 0]}
          scale={[GATE.half * 2 + 2, GATE.height + 3, 3]}
          onClick={choose(g.territory)}
          {...hover(g.territory)}
        />
      ))}
      {[...open].map((id) => {
        const l = LANDMARKS[id];
        if (!l) return null;
        return (
          <mesh
            key={`land-${id}`}
            geometry={resources.hitBox}
            material={resources.hit}
            position={l.centre}
            scale={[l.radius * 2, l.height, l.radius * 2]}
            onClick={choose(id)}
            {...hover(id)}
          />
        );
      })}
    </group>
  );
}
