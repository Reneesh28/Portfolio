import { useEffect, useMemo } from 'react';
import { BoxGeometry, Color, CylinderGeometry, MeshBasicMaterial, MeshStandardMaterial, RingGeometry } from 'three';
import { atBearing } from '../../data/worldGeography';
import { mergeParts, placement, type Part } from '../../core/mergeStatic';
import { BLUEPRINT } from '../../look/palette';
import { PLINTH, PLINTH_SITES, PROJECTS_TERRACE } from './hubLayout';

const DEG = Math.PI / 180;

/**
 * The Projects terrace inside the Projects gate: a raised round terrace with 8 empty
 * plinths waiting for the M5 monuments (no pictures, DEC-015), golden inlays, and a
 * golden path back to the main platform.
 */
export default function ProjectsTerrace() {
  const baked = useMemo(() => {
    const disc = new CylinderGeometry(1, 1.04, 1, 32, 1);
    const box = new BoxGeometry(1, 1, 1);
    const rim = new RingGeometry(PROJECTS_TERRACE.radius - 1.5, PROJECTS_TERRACE.radius - 0.6, 64);
    const centre = atBearing(PROJECTS_TERRACE.bearing, PROJECTS_TERRACE.distance);
    const stone: Part[] = [];
    const light: Part[] = [];
    const gold: Part[] = [];
    stone.push([disc, placement([centre[0], PROJECTS_TERRACE.height / 2, centre[2]], [0, 0, 0], [PROJECTS_TERRACE.radius, PROJECTS_TERRACE.height, PROJECTS_TERRACE.radius])]);
    gold.push([rim, placement([centre[0], PROJECTS_TERRACE.height + 0.06, centre[2]], [-Math.PI / 2, 0, 0])]);
    const [w, h, d] = PLINTH.size;
    for (const site of PLINTH_SITES) {
      const [x, y, z] = site.position;
      const yaw = site.facing * DEG;
      stone.push([box, placement([x, y + h * 0.3, z], [0, yaw, 0], [w, h * 0.6, d])]);
      light.push([box, placement([x, y + h * 0.8, z], [0, yaw, 0], [w * 0.8, h * 0.4, d * 0.8])]);
      const [ox, , oz] = atBearing(site.facing, d / 2 + 0.02);
      gold.push([box, placement([x + ox, y + h * 0.3, z + oz], [0, yaw, 0], [w * 0.7, 0.12, 0.04])]);
    }
    // Golden path from the terrace to the main platform's edge.
    const inner = PROJECTS_TERRACE.distance - PROJECTS_TERRACE.radius;
    const pathLength = inner - 92;
    const mid = atBearing(PROJECTS_TERRACE.bearing, 92 + pathLength / 2, 0.16);
    gold.push([box, placement(mid, [0, PROJECTS_TERRACE.bearing * DEG, 0], [1.4, 0.3, pathLength])]);

    const result = { stone: mergeParts(stone), light: mergeParts(light), gold: mergeParts(gold) };
    [disc, box, rim].forEach((g) => g.dispose());
    return result;
  }, []);
  useEffect(() => () => Object.values(baked).forEach((g) => g.dispose()), [baked]);

  const materials = useMemo(
    () => ({
      stone: new MeshStandardMaterial({ color: '#2f2c45', roughness: 0.85, metalness: 0.15, flatShading: true }),
      light: new MeshStandardMaterial({ color: BLUEPRINT.stone.light, roughness: 0.8, metalness: 0.15, flatShading: true }),
      gold: new MeshBasicMaterial({ color: new Color(BLUEPRINT.gold.accent).multiplyScalar(1.9), toneMapped: false }),
    }),
    [],
  );
  useEffect(() => () => Object.values(materials).forEach((m) => m.dispose()), [materials]);

  return (
    <group>
      <mesh geometry={baked.stone} material={materials.stone} />
      <mesh geometry={baked.light} material={materials.light} />
      <mesh geometry={baked.gold} material={materials.gold} />
    </group>
  );
}
