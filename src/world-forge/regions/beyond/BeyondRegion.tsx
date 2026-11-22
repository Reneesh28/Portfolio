import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { BoxGeometry, BufferAttribute, Color, MeshBasicMaterial, MeshStandardMaterial, type Mesh } from 'three';
import { isTerritory, openTerritories, TERRITORIES, type TerritoryId } from '../../content/interests';
import { WORLDS_BEYOND_TERRITORIES } from '../../data/worldGeography';
import { useExperienceSnapshot, useExperienceStore } from '../../experience/ExperienceContext';
import { BEYOND_LEVEL, buildBeyond, type Range } from './beyondGeometry';
import { GATE, GATES, LANDMARKS } from './beyondLayout';

const WARM = '#ffc27a';
/** Each territory's colour: its island's biome accent. */
const colourOf = (id: TerritoryId): string => {
  const island = TERRITORIES.find((t) => t.id === id)?.island;
  return WORLDS_BEYOND_TERRITORIES.find((t) => t.id === island)?.accent ?? '#ffffff';
};

/**
 * 05 — THE WORLDS BEYOND (M7, DEC-032): the Convergence and, so far, The Guild.
 *
 * The Convergence is a round plaza of six stone gates, each facing its territory and lit in
 * its colour, around a compass monolith whose six strips point at the gates. A territory that
 * can be opened (built, with content) has a brighter gate; choosing it (here or from the card)
 * draws the camera to its landmark and opens its panel. The Guild (AniCos) is a courtyard with
 * the Hall, the Chronicle wall, the Assembly's ring of seats and the Stage.
 *
 * Rendering: everything static is baked into a stone mesh and a lines mesh (2 draws).
 */
export default function BeyondRegion() {
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
    paint('guild', built.guildLights, WARM, chosen === 'guild' ? BEYOND_LEVEL.guild * 1.3 : BEYOND_LEVEL.guild);
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
