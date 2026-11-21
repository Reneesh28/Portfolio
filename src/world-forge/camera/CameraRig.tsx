import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Vector3, type PerspectiveCamera as ThreePerspectiveCamera } from 'three';
import { useExperienceStore } from '../experience/ExperienceContext';
import { JOURNEY_ROUTE } from '../experience/route';
import {
  approach,
  computeFragmentFocusPose,
  computeProjectFocusPose,
  type CameraPose,
  computeRegionPose,
  easeFocus,
  FOCUS_MOTION,
  focusGlideLift,
  routeSegmentArcs,
  routeSegmentLooks,
} from './cameraTargets';
import { INTRO, introRemaining } from './intro';
import { createJourneyPath, TRAVEL_ARC, type SampledPose } from './journeyPath';
import type { ExperienceSnapshot } from '../experience/experienceStore';
import type { FragmentId } from '../regions/sanctum/sanctumLayout';

const FRAGMENTS: readonly string[] = ['engineer', 'creator', 'explorer'];

/**
 * What the camera focuses on, if anything: a project's monument at the Forge (M5), or an
 * identity fragment at the Origin Sanctum (M6.1; the Sanctum's overview has no focus).
 */
function focusTarget(snap: ExperienceSnapshot, width: number, height: number): { id: string; pose: () => CameraPose | null } | null {
  if (snap.focusedProject) {
    const project = snap.focusedProject;
    return { id: `project:${project}`, pose: () => computeProjectFocusPose(project, width, height) };
  }
  if (snap.sanctumView && FRAGMENTS.includes(snap.sanctumView)) {
    const fragment = snap.sanctumView as FragmentId;
    return { id: `fragment:${fragment}`, pose: () => computeFragmentFocusPose(fragment, width, height) };
  }
  return null;
}

/**
 * The only camera writer in the World Forge.
 *
 * Each frame it advances journey time (the only caller of `store.advance`) and
 * places the camera at the pose derived from the journey position. Orientation
 * always comes from `lookAt` with +Y up, so there is never any roll. Under a
 * demand frameloop (reduced motion) it requests frames only while the journey moves.
 * On first load it also plays the Void intro (a short camera letdown); any journey
 * input skips it, and it never runs under reduced motion.
 */
export default function CameraRig() {
  const store = useExperienceStore();
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);
  const invalidate = useThree((state) => state.invalidate);

  const path = useMemo(
    () =>
      createJourneyPath(
        JOURNEY_ROUTE.map((region) => computeRegionPose(region.id, width, height)),
        routeSegmentArcs(JOURNEY_ROUTE, TRAVEL_ARC),
        routeSegmentLooks(JOURNEY_ROUTE),
      ),
    [width, height],
  );
  const pose = useMemo<SampledPose>(() => ({ position: new Vector3(), target: new Vector3(), fov: 50 }), []);
  const intro = useRef<{ start: number | null; skippedAt: number | null; done: boolean }>({ start: null, skippedAt: null, done: false });
  const offset = useMemo(() => new Vector3(), []);
  // Project focus (M5): `blend` eases between the journey pose and the focus pose; the focus
  // pose itself glides from `from` to `to` when the work (or the viewport) changes while focused.
  const focus = useRef({
    key: null as string | null,
    blend: 0,
    glide: 1,
    distance: 0,
    from: { position: new Vector3(), target: new Vector3(), fov: 45 },
    to: { position: new Vector3(), target: new Vector3(), fov: 45 },
    position: new Vector3(),
    target: new Vector3(),
    fov: 45,
  });

  useEffect(() => {
    store.setWakeHandler(() => invalidate());
    return () => store.setWakeHandler(null);
  }, [store, invalidate]);

  // A new viewport means new poses: render at least one frame with them.
  useEffect(() => invalidate(), [path, invalidate]);

  useFrame(({ clock }, delta) => {
    const camera = cameraRef.current;
    if (!camera) return;
    store.advance(delta);
    const journey = store.getJourney();
    path.sample(journey.position, pose);
    camera.position.copy(pose.position);

    // Void intro: only from a fresh Void start, never under reduced motion; journey input skips it.
    const state = intro.current;
    if (!state.done) {
      if (state.start === null) {
        if (store.getSnapshot().reducedMotion || journey.position !== 0 || journey.phase !== 'idle') state.done = true;
        else state.start = clock.elapsedTime;
      }
      if (state.start !== null) {
        const elapsed = clock.elapsedTime - state.start;
        if (state.skippedAt === null && (journey.position !== 0 || journey.phase !== 'idle')) state.skippedAt = elapsed;
        const k = introRemaining(elapsed, state.skippedAt);
        if (k <= 0) state.done = true;
        else {
          // Back along the view (horizontally) and up: the camera eases down into the opening.
          offset.set(pose.position.x - pose.target.x, 0, pose.position.z - pose.target.z).normalize();
          camera.position.addScaledVector(offset, INTRO.back * k);
          camera.position.y += INTRO.up * k;
        }
      }
    }
    // Focus (a monument or a fragment): ease toward it, and back on release. Reduced motion: short.
    const snap = store.getSnapshot();
    const f = focus.current;
    const target = focusTarget(snap, width, height);
    const key = target ? `${target.id}@${width}x${height}` : null;
    if (target && key !== f.key) {
      const goal = target.pose();
      if (goal) {
        // Already (partly) focused: glide on from where the focus pose is now. Otherwise start there.
        const gliding = f.key !== null && f.blend > 0;
        f.from.position.copy(gliding ? f.position : f.to.position.fromArray(goal.position));
        f.from.target.copy(gliding ? f.target : f.to.target.fromArray(goal.target));
        f.from.fov = gliding ? f.fov : goal.fov;
        f.to.position.fromArray(goal.position);
        f.to.target.fromArray(goal.target);
        f.to.fov = goal.fov;
        f.glide = gliding ? 0 : 1;
        f.distance = f.from.position.distanceTo(f.to.position);
        f.key = key;
      }
    }
    const short = snap.reducedMotion ? FOCUS_MOTION.reducedSeconds : 0;
    f.glide = Math.min(1, f.glide + delta / (short || FOCUS_MOTION.glideSeconds));
    const g = easeFocus(f.glide);
    f.position.lerpVectors(f.from.position, f.to.position, g);
    if (!snap.reducedMotion) f.position.y += focusGlideLift(f.glide, f.distance);
    f.target.lerpVectors(f.from.target, f.to.target, g);
    f.fov = f.from.fov + (f.to.fov - f.from.fov) * g;

    const wanted = target && f.key ? 1 : 0;
    const rate = 1 / (short || FOCUS_MOTION.openSeconds);
    f.blend = approach(f.blend, wanted, delta * rate);
    if (f.blend === 0 && !target) f.key = null;
    let fov = pose.fov;
    if (f.blend > 0) {
      const k = easeFocus(f.blend);
      camera.position.lerp(f.position, k);
      pose.target.lerp(f.target, k);
      fov = pose.fov + (f.fov - pose.fov) * k;
      if (f.blend < 1 || wanted < f.blend || f.glide < 1) invalidate();
    }
    camera.lookAt(pose.target);
    if (camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    if (journey.phase !== 'idle') invalidate();
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault near={0.5} far={9000} />;
}
