import { CatmullRomCurve3, Vector3 } from 'three';
import type { CameraPose } from './cameraTargets';

/** Camera pose sampled along the journey (mutable, reused every frame). */
export interface SampledPose {
  position: Vector3;
  target: Vector3;
  fov: number;
}

export interface JourneyPath {
  readonly stopCount: number;
  /** Writes the camera pose at journey `position` (in stops) into `out`. */
  sample(position: number, out: SampledPose): SampledPose;
}

const smoothstep = (t: number) => t * t * (3 - 2 * t);

/**
 * Travel arc: between two stops the camera rises by this share of the segment's
 * horizontal length (sin² profile — zero lift and zero vertical speed at stops),
 * so long crossings clear terrain and stop poses stay exact.
 */
export const TRAVEL_ARC = 0.13;

/**
 * Smooth camera path through the stop poses. Positions and look-at points follow
 * centripetal Catmull-Rom curves (no cusps or loops, continuous through stops),
 * so travel never jerks when scroll carries the camera past a region. A travel
 * arc lifts the camera between stops (or, per segment via `segmentArcs`, dips it
 * for a designed arrival). At an exact stop the registered pose is returned unchanged.
 */
export function createJourneyPath(poses: readonly CameraPose[], segmentArcs?: readonly number[]): JourneyPath {
  if (poses.length === 0) throw new Error('A journey path needs at least one pose');
  const last = poses.length - 1;
  const toVectors = (pick: (pose: CameraPose) => readonly number[]) =>
    poses.map((pose) => new Vector3().fromArray(pick(pose) as number[]));

  const positions = toVectors((pose) => pose.position);
  const targets = toVectors((pose) => pose.target);
  const positionCurve = last > 0 ? new CatmullRomCurve3(positions, false, 'centripetal') : null;
  const targetCurve = last > 0 ? new CatmullRomCurve3(targets, false, 'centripetal') : null;
  const arcHeights = positions
    .slice(1)
    .map((to, i) => Math.hypot(to.x - positions[i].x, to.z - positions[i].z) * (segmentArcs?.[i] ?? TRAVEL_ARC));

  return {
    stopCount: poses.length,
    sample(position, out) {
      const p = Math.min(last, Math.max(0, Number.isFinite(position) ? position : 0));
      const stop = Math.round(p);
      if (!positionCurve || !targetCurve || Math.abs(p - stop) < 1e-6) {
        out.position.copy(positions[stop]);
        out.target.copy(targets[stop]);
        out.fov = poses[stop].fov;
        return out;
      }
      const u = p / last;
      positionCurve.getPoint(u, out.position);
      targetCurve.getPoint(u, out.target);
      const from = Math.floor(p);
      const f = p - from;
      const lift = arcHeights[from] * Math.sin(Math.PI * f) ** 2;
      out.position.y += lift;
      // The look-at point rises less, so the camera tips gently down over the crossing.
      out.target.y += lift * 0.5;
      out.fov = poses[from].fov + (poses[from + 1].fov - poses[from].fov) * smoothstep(f);
      return out;
    },
  };
}
