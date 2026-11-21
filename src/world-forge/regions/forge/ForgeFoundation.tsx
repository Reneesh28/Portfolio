import { CylinderGeometry, type BufferGeometry } from 'three';
import { createRandom } from '../../core/random';
import { darkStoneMaterial, stoneMaterial, unitBox, unitRock } from '../void/materials';
import { buttresses, CORNICE, OCTAGON_SIDES, polar, rubbleSkirt, TIER_SEAMS, TIERS, type Tier } from './forgeLayout';
import { forgeMidStoneMaterial, forgeSeamMaterial } from './forgeMaterials';
import { placement, useMergedGeometry, type Part, type StaticBuild } from './mergeStatic';

const DEG = Math.PI / 180;

const tierBody = (tier: Tier) => new CylinderGeometry(tier.topRadius, tier.bottomRadius, tier.top - tier.bottom, OCTAGON_SIDES);
const tierAt = (tier: Tier) => placement([0, (tier.bottom + tier.top) / 2, 0]);

/** Base tier, stepped buttresses and the rubble skirt: one dark-stone draw. */
function buildDark(): StaticBuild {
  const t1 = tierBody(TIERS[0]);
  const parts: Part[] = [[t1, tierAt(TIERS[0])]];
  for (const b of buttresses()) {
    const [x, z] = polar(b.bearing, b.distance);
    parts.push([unitBox, placement([x, b.y, z], [0, b.bearing * DEG, 0], b.size)]);
  }
  for (const r of rubbleSkirt(createRandom(211))) parts.push([unitRock, placement(r.position, r.rotation, r.scale)]);
  return { parts, temporary: [t1] };
}

function buildMid(): StaticBuild {
  const t2 = tierBody(TIERS[1]);
  return { parts: [[t2, tierAt(TIERS[1])]], temporary: [t2] };
}

/** The dais and the cut-stone cornices capping every tier (a hair above each tier top, so faces never fight). */
function buildStone(): StaticBuild {
  const t3 = tierBody(TIERS[2]);
  const parts: Part[] = [[t3, tierAt(TIERS[2])]];
  const temporary = [t3];
  for (const tier of TIERS) {
    const r = tier.topRadius + CORNICE.overhang;
    const cornice = new CylinderGeometry(r, r, CORNICE.height, OCTAGON_SIDES);
    temporary.push(cornice);
    parts.push([cornice, placement([0, tier.top - CORNICE.height / 2 + CORNICE.lift, 0])]);
  }
  return { parts, temporary };
}

/** Amber seams where each tier meets the one above. */
function buildSeams(): StaticBuild {
  const parts: Part[] = [];
  const temporary: BufferGeometry[] = [];
  for (const seam of TIER_SEAMS) {
    const ring = new CylinderGeometry(seam.radius - 0.02, seam.radius, seam.height, OCTAGON_SIDES, 1, true);
    temporary.push(ring);
    parts.push([ring, placement([0, seam.y, 0])]);
  }
  return { parts, temporary };
}

/**
 * Foundation: three octagonal cut-stone tiers with cornices and amber seams,
 * stepped buttresses and a rubble skirt. Static, baked per material (4 draws).
 */
export default function ForgeFoundation() {
  const dark = useMergedGeometry(buildDark);
  const mid = useMergedGeometry(buildMid);
  const stone = useMergedGeometry(buildStone);
  const seams = useMergedGeometry(buildSeams);
  return (
    <group>
      <mesh geometry={dark} material={darkStoneMaterial} />
      <mesh geometry={mid} material={forgeMidStoneMaterial} />
      <mesh geometry={stone} material={stoneMaterial} />
      <mesh geometry={seams} material={forgeSeamMaterial} />
    </group>
  );
}
