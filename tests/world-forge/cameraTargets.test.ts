import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Group, PerspectiveCamera, Vector3 } from 'three';
import { computeRegionPose, computeVoidPose, responsiveFov } from '../../src/world-forge/camera/cameraTargets.ts';
import { JOURNEY_ROUTE } from '../../src/world-forge/experience/route.ts';
import { computeVoidLayout, computeVoidPlacement } from '../../src/world-forge/regions/void/layout.ts';

const VIEWPORTS: Array<[number, number]> = [
  [1440, 900],
  [1920, 1080],
  [1280, 720],
  [820, 1180],
  [390, 844],
  [360, 640],
  [3440, 1440],
];

/** The approved M2/M3 static rig, rebuilt exactly as VoidRegion composed it. */
function rigCamera(width: number, height: number): PerspectiveCamera {
  const layout = computeVoidLayout(width, height);
  const placement = computeVoidPlacement(layout);
  const outer = new Group();
  outer.rotation.set(0, placement.yaw, 0);
  const inner = new Group();
  inner.position.set(-placement.forgeLocal[0], 0, -placement.forgeLocal[2]);
  const camera = new PerspectiveCamera(layout.fov, width / height, 0.1, 1200);
  camera.position.set(...layout.camera);
  camera.rotation.set(layout.pitch, 0, 0);
  outer.add(inner);
  inner.add(camera);
  outer.updateMatrixWorld(true);
  return camera;
}

/** A camera placed the way the controller places it: position + lookAt, up = +Y. */
function poseCamera(width: number, height: number): PerspectiveCamera {
  const pose = computeVoidPose(width, height);
  const camera = new PerspectiveCamera(pose.fov, width / height, 0.1, 1200);
  camera.position.set(...pose.position);
  camera.lookAt(...pose.target);
  camera.updateMatrixWorld(true);
  return camera;
}

describe('camera target registry', () => {
  for (const [width, height] of VIEWPORTS) {
    it(`Void pose reproduces the approved rig camera at ${width}×${height}`, () => {
      const rig = rigCamera(width, height);
      const pose = poseCamera(width, height);
      const rigPos = rig.getWorldPosition(new Vector3());
      const posePos = pose.getWorldPosition(new Vector3());
      assert.ok(rigPos.distanceTo(posePos) < 1e-9, `position Δ ${rigPos.distanceTo(posePos)}`);
      // Full orientation (forward, up, right) must match: same framing, no roll.
      const rigQ = rig.getWorldQuaternion(rig.quaternion.clone());
      const poseQ = pose.getWorldQuaternion(pose.quaternion.clone());
      assert.ok(Math.abs(Math.abs(rigQ.dot(poseQ)) - 1) < 1e-12, `orientation Δ ${1 - Math.abs(rigQ.dot(poseQ))}`);
      assert.equal(computeVoidPose(width, height).fov, rig.fov);
    });
  }

  it('defines a valid pose for every stop on the route', () => {
    for (const region of JOURNEY_ROUTE) {
      for (const [width, height] of VIEWPORTS) {
        const pose = computeRegionPose(region.id, width, height);
        for (const v of [...pose.position, ...pose.target, pose.fov]) assert.ok(Number.isFinite(v), `${region.id} has a non-finite value`);
        assert.ok(pose.fov > 20 && pose.fov <= 72, `${region.id} fov ${pose.fov}`);
        const dx = pose.target[0] - pose.position[0];
        const dy = pose.target[1] - pose.position[1];
        const dz = pose.target[2] - pose.position[2];
        const horizontal = Math.hypot(dx, dz);
        assert.ok(horizontal > 1, `${region.id} must not look straight up/down`);
        assert.ok(Math.abs(Math.atan2(dy, horizontal)) < Math.PI / 3, `${region.id} pitch within ±60°`);
      }
    }
  });

  it('region cameras sit above their region ground', () => {
    for (const region of JOURNEY_ROUTE) {
      const pose = computeRegionPose(region.id, 1440, 900);
      assert.ok(pose.position[1] > region.position[1] + 2, `${region.id} camera is above its anchor`);
    }
  });

  it('responsive field of view widens only for narrower screens, capped', () => {
    assert.equal(responsiveFov(50, 16 / 9), 50);
    assert.ok(responsiveFov(50, 1) > 50);
    assert.ok(responsiveFov(50, 390 / 844) <= 72);
  });
});
