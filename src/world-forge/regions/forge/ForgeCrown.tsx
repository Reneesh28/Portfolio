import { Euler, Matrix4, Quaternion, TorusGeometry, Vector3, type BufferGeometry } from 'three';
import { darkStoneMaterial, stoneMaterial, unitBox, unitShard } from '../void/materials';
import { CORE, CROWN } from './forgeLayout';
import { crownFilamentMaterial } from './forgeMaterials';
import { placement, useMergedGeometry, type Part, type StaticBuild } from './mergeStatic';

const TURN = Math.PI * 2;
/** The crown ring's frame: approved height and tilt. */
const CROWN_FRAME = placement([0, CROWN.y, 0], [CROWN.tilt, 0, 0]);

/** World position of a point on the crown ring at in-ring angle `angle` (radians). */
function ringPoint(angle: number, radius: number = CROWN.radius): Vector3 {
  return new Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0).applyMatrix4(CROWN_FRAME);
}

/** World position of a pillar's top (same transform as the pillar frame in ForgeCore). */
function pillarTop(angle: number): Vector3 {
  return new Vector3(0, CORE.pillarHeight / 2 - 0.4, 0)
    .applyEuler(new Euler(Math.sin(angle) * CORE.lean, angle, -Math.cos(angle) * CORE.lean))
    .add(new Vector3(Math.cos(angle) * CORE.pillarRadius, CORE.pillarCentreY, Math.sin(angle) * CORE.pillarRadius));
}

/** Halo segments with broken shard ends: one stone draw. */
function buildHalo(): StaticBuild {
  const parts: Part[] = [];
  const temporary: BufferGeometry[] = [];
  CROWN.segments.forEach(([start, length], i) => {
    const arc = new TorusGeometry(CROWN.radius, CROWN.tube, 6, Math.max(3, Math.round(length * 48)), length * TURN);
    temporary.push(arc);
    parts.push([arc, CROWN_FRAME.clone().multiply(placement([0, 0, 0], [0, 0, start * TURN]))]);
    [start, start + length].forEach((fraction, j) => {
      const angle = fraction * TURN;
      const end = placement([Math.cos(angle) * CROWN.radius, Math.sin(angle) * CROWN.radius, 0], [i * 0.7 + j, angle, i * 0.4], [0.62, 0.62, 0.7]);
      parts.push([unitShard, CROWN_FRAME.clone().multiply(end)]);
    });
  });
  return { parts, temporary };
}

/** Struts from each pillar top out to the halo: one dark-stone draw. */
function buildStruts(): StaticBuild {
  const parts: Part[] = CORE.pillarAngles.map((angle): Part => {
    const from = pillarTop(angle);
    const to = ringPoint(angle, CROWN.radius - CROWN.tube * 0.6);
    const dir = to.clone().sub(from);
    const length = dir.length();
    // The box's long axis (local Z) points from the pillar top to the ring.
    const turn = new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), dir.normalize());
    const mid = from.clone().add(to).multiplyScalar(0.5);
    return [unitBox, new Matrix4().compose(mid, turn, new Vector3(0.55, 0.45, length))];
  });
  return { parts };
}

/**
 * Crown: a segmented stone halo carried on the three pillar tips, with a thin amber
 * filament running through the gaps. Static (DEC-007): it is unfinished, not spinning.
 */
export default function ForgeCrown() {
  const halo = useMergedGeometry(buildHalo);
  const struts = useMergedGeometry(buildStruts);
  return (
    <group>
      <mesh geometry={halo} material={stoneMaterial} />
      <mesh geometry={struts} material={darkStoneMaterial} />
      <mesh material={crownFilamentMaterial} position={[0, CROWN.y, 0]} rotation={[CROWN.tilt, 0, 0]}>
        <torusGeometry args={[CROWN.filamentRadius, CROWN.filamentTube, 4, 64]} />
      </mesh>
    </group>
  );
}
