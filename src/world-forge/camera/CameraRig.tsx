import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Vector3, type PerspectiveCamera as ThreePerspectiveCamera } from 'three';
import { useExperienceStore } from '../experience/ExperienceContext';
import { JOURNEY_ROUTE } from '../experience/route';
import { computeRegionPose } from './cameraTargets';
import { createJourneyPath, type SampledPose } from './journeyPath';

/**
 * The only camera writer in the World Forge.
 *
 * Each frame it advances journey time (the only caller of `store.advance`) and
 * places the camera at the pose derived from the journey position. Orientation
 * always comes from `lookAt` with +Y up, so there is never any roll. Under a
 * demand frameloop (reduced motion) it requests frames only while the journey moves.
 */
export default function CameraRig() {
  const store = useExperienceStore();
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);
  const invalidate = useThree((state) => state.invalidate);

  const path = useMemo(
    () => createJourneyPath(JOURNEY_ROUTE.map((region) => computeRegionPose(region.id, width, height))),
    [width, height],
  );
  const pose = useMemo<SampledPose>(() => ({ position: new Vector3(), target: new Vector3(), fov: 50 }), []);

  useEffect(() => {
    store.setWakeHandler(() => invalidate());
    return () => store.setWakeHandler(null);
  }, [store, invalidate]);

  // A new viewport means new poses: render at least one frame with them.
  useEffect(() => invalidate(), [path, invalidate]);

  useFrame((_, delta) => {
    const camera = cameraRef.current;
    if (!camera) return;
    store.advance(delta);
    const journey = store.getJourney();
    path.sample(journey.position, pose);
    camera.position.copy(pose.position);
    camera.lookAt(pose.target);
    if (camera.fov !== pose.fov) {
      camera.fov = pose.fov;
      camera.updateProjectionMatrix();
    }
    if (journey.phase !== 'idle') invalidate();
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault near={0.1} far={1200} />;
}
