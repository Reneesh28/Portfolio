import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { BoxGeometry, BufferAttribute, Color, MeshBasicMaterial, MeshStandardMaterial, Plane, Vector3, type Mesh } from 'three';
import { isSkillCategory, SKILL_CATEGORY_IDS, type SkillCategoryId } from '../../content/skills';
import { useExperienceSnapshot, useExperienceStore } from '../../experience/ExperienceContext';
import { BLUEPRINT } from '../../look/palette';
import { approach } from '../../camera/cameraTargets';
import { ARCHIVE_LEVEL, buildArchive, type Range } from './archiveGeometry';
import { ARCHIVE_ANCHOR, ARCHIVE_YAW, STRUCTURES } from './archiveLayout';

const BLUE = BLUEPRINT.region.blueprintArchive;
const LINE_TINT = '#bfe3ff';
/** Seconds for a structure to rise through its drawing (0 under reduced motion: it appears built). */
const BUILD_SECONDS = 0.8;

/**
 * 03 — THE BLUEPRINT ARCHIVE (M6.2 "The Drafting Hall", DEC-028). The blue archive island
 * keeps the world's plans: four category structures stand on an etched drafting floor as
 * luminous blueprint drawings. Choosing a category (here, or from the Archive card) *builds*
 * its structure: solid stone rises through its lines from the base up, its lines brighten and
 * its crystal flares. The camera never moves between categories (master doc §8).
 *
 * Rendering: stone, lines, crystals and a faint fill are baked (4 draws); a structure's solid
 * form is drawn only while it is (or is becoming) built. Picking uses invisible boxes.
 */
export default function ArchiveRegion({ animate }: { animate: boolean }) {
  const store = useExperienceStore();
  const { archiveCategory, currentRegion, phase } = useExperienceSnapshot();
  const invalidate = useThree((state) => state.invalidate);
  const built = useMemo(() => buildArchive(), []);
  useEffect(
    () => () => {
      for (const g of [built.stone, built.lines, built.crystals, built.ghost, ...Object.values(built.solids)]) g.dispose();
    },
    [built],
  );
  const resources = useMemo(() => {
    // Each solid clips everything above its plane's height: the structure rises as the plane does.
    const solid = () =>
      new MeshStandardMaterial({
        color: '#8ea4d6',
        roughness: 0.6,
        metalness: 0.2,
        flatShading: true,
        emissive: new Color(BLUE),
        emissiveIntensity: 0.22,
        clippingPlanes: [new Plane(new Vector3(0, -1, 0), 0)],
      });
    return {
      stone: new MeshStandardMaterial({ color: '#53648f', roughness: 0.9, metalness: 0.05, flatShading: true, emissive: new Color('#1e2a4a'), emissiveIntensity: 0.9 }),
      lines: new MeshBasicMaterial({ vertexColors: true, toneMapped: false }),
      crystals: new MeshBasicMaterial({ vertexColors: true, toneMapped: false }),
      ghost: new MeshBasicMaterial({ color: new Color(BLUE), transparent: true, opacity: 0.07, depthWrite: false }),
      solids: Object.fromEntries(SKILL_CATEGORY_IDS.map((id) => [id, solid()])) as Record<SkillCategoryId, MeshStandardMaterial>,
      hit: new MeshBasicMaterial({ visible: false }),
      hitBox: new BoxGeometry(1, 1, 1),
    };
  }, []);
  useEffect(
    () => () => {
      resources.stone.dispose();
      resources.lines.dispose();
      resources.crystals.dispose();
      resources.ghost.dispose();
      Object.values(resources.solids).forEach((m) => m.dispose());
      resources.hit.dispose();
      resources.hitBox.dispose();
    },
    [resources],
  );
  useEffect(() => () => void (document.body.style.cursor = ''), []);

  const [hovered, setHovered] = useState<SkillCategoryId | null>(null);
  const interactive = currentRegion === 'blueprint-archive' && phase === 'idle';
  const selected = isSkillCategory(archiveCategory) ? archiveCategory : null;
  const lit = interactive && archiveCategory === null ? hovered : null;
  useEffect(() => invalidate(), [lit, archiveCategory, invalidate]);

  const linesRef = useRef<Mesh>(null);
  const crystalsRef = useRef<Mesh>(null);
  const solidRefs = useRef<Partial<Record<SkillCategoryId, Mesh | null>>>({});
  const progress = useRef<Record<SkillCategoryId, number>>({ ai: 0, software: 0, data: 0, games: 0 });
  const applied = useRef<Record<string, number>>({});
  const tint = useMemo(() => new Color(), []);

  useFrame(({ clock }, delta) => {
    let moving = false;
    for (const site of STRUCTURES) {
      const p = progress.current;
      const goal = selected === site.id ? 1 : 0;
      p[site.id] = animate ? approach(p[site.id], goal, delta / BUILD_SECONDS) : goal;
      if (p[site.id] !== goal) moving = true;
      const mesh = solidRefs.current[site.id];
      if (!mesh) continue;
      const plane = (mesh.material as MeshStandardMaterial).clippingPlanes?.[0];
      if (plane) plane.constant = ARCHIVE_ANCHOR[1] + site.position[1] + p[site.id] * (site.height + 1);
      mesh.visible = p[site.id] > 0.001;
    }
    if (moving) invalidate();

    const paint = (mesh: Mesh | null, key: string, range: Range, color: string, level: number) => {
      if (!mesh) return false;
      const attr = mesh.geometry.getAttribute('color') as BufferAttribute;
      if (applied.current[key] !== undefined && Math.abs(applied.current[key] - level) < 1e-3) return false;
      applied.current[key] = level;
      tint.set(color).multiplyScalar(level);
      for (let v = range.start; v < range.start + range.count; v++) attr.setXYZ(v, tint.r, tint.g, tint.b);
      return true;
    };
    let linesDirty = false;
    let crystalsDirty = false;
    for (const site of STRUCTURES) {
      const b = progress.current[site.id];
      const pulse = animate && selected === site.id ? 1 + Math.sin(clock.elapsedTime * 2.2) * 0.08 : 1;
      const base = lit === site.id ? ARCHIVE_LEVEL.hover : ARCHIVE_LEVEL.rest;
      const level = (base + (ARCHIVE_LEVEL.built - base) * b) * pulse;
      linesDirty = paint(linesRef.current, `l-${site.id}`, built.lineRanges[site.id], LINE_TINT, level) || linesDirty;
      crystalsDirty = paint(crystalsRef.current, `c-${site.id}`, built.crystalRanges[site.id], BLUE, level * 1.2) || crystalsDirty;
    }
    linesDirty = paint(linesRef.current, 'floor', built.floorLines, LINE_TINT, ARCHIVE_LEVEL.floor) || linesDirty;
    crystalsDirty = paint(crystalsRef.current, 'outcrops', built.outcrops, BLUE, ARCHIVE_LEVEL.outcrop) || crystalsDirty;
    if (linesDirty && linesRef.current) (linesRef.current.geometry.getAttribute('color') as BufferAttribute).needsUpdate = true;
    if (crystalsDirty && crystalsRef.current) (crystalsRef.current.geometry.getAttribute('color') as BufferAttribute).needsUpdate = true;
  });

  const choose = (id: SkillCategoryId) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!interactive) return;
    document.body.style.cursor = '';
    store.openArchive(id);
  };

  return (
    <group position={ARCHIVE_ANCHOR} rotation={[0, ARCHIVE_YAW, 0]}>
      <mesh geometry={built.stone} material={resources.stone} />
      <mesh ref={linesRef} geometry={built.lines} material={resources.lines} />
      <mesh ref={crystalsRef} geometry={built.crystals} material={resources.crystals} />
      <mesh geometry={built.ghost} material={resources.ghost} renderOrder={2} />
      {STRUCTURES.map((site) => (
        <mesh
          key={site.id}
          ref={(m) => {
            solidRefs.current[site.id] = m;
          }}
          visible={false}
          geometry={built.solids[site.id]}
          material={resources.solids[site.id]}
        />
      ))}
      {STRUCTURES.map((site) => (
        <mesh
          key={`hit-${site.id}`}
          geometry={resources.hitBox}
          material={resources.hit}
          position={[site.position[0], site.position[1] + site.height / 2, site.position[2]]}
          scale={[site.half * 2 + 2, site.height + 1, site.half * 2 + 2]}
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
