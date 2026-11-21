import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PerspectiveCamera, Vector3 } from 'three';
import { computeVoidPose } from '../../src/world-forge/camera/cameraTargets.ts';
import { INTRO, introRemaining } from '../../src/world-forge/camera/intro.ts';
import { ISLANDS } from '../../src/world-forge/data/worldGeography.ts';
import { computeVoidLayout, computeVoidPlacement, GATE_Z, PORTAL } from '../../src/world-forge/regions/void/layout.ts';

const VIEWPORTS: Array<[number, number]> = [
  [1440, 900], [1920, 1080], [1280, 720], [3440, 1440], [820, 1180], [390, 844], [360, 640],
];

/** World position of a point given in the Void rig's local frame (rig: yaw, then local Forge point → origin). */
function rigToWorld(width: number, height: number, [lx, ly, lz]: [number, number, number]): Vector3 {
  const { yaw, forgeLocal } = computeVoidPlacement(computeVoidLayout(width, height));
  const x = lx - forgeLocal[0];
  const z = lz - forgeLocal[2];
  return new Vector3(x * Math.cos(yaw) + z * Math.sin(yaw), ly, -x * Math.sin(yaw) + z * Math.cos(yaw));
}

function openingCamera(width: number, height: number): PerspectiveCamera {
  const pose = computeVoidPose(width, height);
  const camera = new PerspectiveCamera(pose.fov, width / height, 0.5, 9000);
  camera.position.fromArray(pose.position);
  camera.lookAt(new Vector3().fromArray(pose.target));
  camera.updateMatrixWorld();
  return camera;
}

describe('the Void portal realm (P4)', () => {
  it('stands the opening camera and the portal on the Void island at every viewport', () => {
    const island = ISLANDS.find((i) => i.id === 'void');
    assert.ok(island);
    for (const [w, h] of VIEWPORTS) {
      const cam = new Vector3().fromArray(computeVoidPose(w, h).position);
      const portal = rigToWorld(w, h, [computeVoidLayout(w, h).gateX, 0, GATE_Z]);
      const flat = (v: Vector3) => Math.hypot(v.x - island.position[0], v.z - island.position[2]);
      assert.ok(flat(cam) < island.radius - 4, `${w}×${h}: camera on the island (${flat(cam).toFixed(1)} m from centre)`);
      assert.ok(flat(portal) + 30 < island.radius + 4, `${w}×${h}: portal and its 60 m platform on the island`);
    }
  });

  it('keeps the whole portal in frame, and on wide screens clear of the hero text column', () => {
    for (const [w, h] of VIEWPORTS) {
      const layout = computeVoidLayout(w, h);
      const camera = openingCamera(w, h);
      const outer = PORTAL.radius + PORTAL.tube;
      for (const [dx, dy] of [[0, outer], [0, -outer], [outer, 0], [-outer, 0]]) {
        const p = rigToWorld(w, h, [layout.gateX + dx, PORTAL.centreY + dy, GATE_Z]).project(camera);
        assert.ok(Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1, `${w}×${h}: portal edge in frame (${p.x.toFixed(2)}, ${p.y.toFixed(2)})`);
        if (layout.wide && dx < 0) assert.ok(p.x > -0.12, `${w}×${h}: portal clear of the text column (left edge at ${p.x.toFixed(2)})`);
      }
    }
  });

  it('frames the whole golden Forge inside the portal from the opening camera (exact: rays cross the portal plane inside the ring)', () => {
    for (const [w, h] of VIEWPORTS) {
      const layout = computeVoidLayout(w, h);
      const { yaw, forgeLocal } = computeVoidPlacement(layout);
      // World → rig-local (inverse of rigToWorld).
      const toLocal = ([x, y, z]: [number, number, number]): [number, number, number] => {
        const lx = x * Math.cos(yaw) - z * Math.sin(yaw);
        const lz = x * Math.sin(yaw) + z * Math.cos(yaw);
        return [lx + forgeLocal[0], y, lz + forgeLocal[2]];
      };
      const [cx, cy, cz] = layout.camera;
      // Forge base, spire top, the outer observation ring's edges, and the hub island's rim.
      for (const p of [[0, 0, 0], [0, 342, 0], [166, 95, 0], [-166, 95, 0], [0, 95, 166]] as Array<[number, number, number]>) {
        const [px, py, pz] = toLocal(p);
        const t = (cz - GATE_Z) / (cz - pz);
        const hx = cx + (px - cx) * t;
        const hy = cy + (py - cy) * t;
        const d = Math.hypot(hx - layout.gateX, hy - PORTAL.centreY);
        assert.ok(d < PORTAL.radius - 0.4, `${w}×${h}: Forge point ${p} seen through the portal (${(d / PORTAL.radius).toFixed(2)} of its radius)`);
      }
    }
  });

  it('plays a short intro (≤ 4 s) that any input skips quickly', () => {
    assert.ok(INTRO.seconds <= 4);
    assert.equal(introRemaining(0, null), 1);
    assert.equal(introRemaining(INTRO.seconds, null), 0);
    let previous = 1;
    for (let t = 0; t <= INTRO.seconds; t += 0.1) {
      const k = introRemaining(t, null);
      assert.ok(k <= previous + 1e-12 && k >= 0);
      previous = k;
    }
    const skipped = 1.0;
    assert.ok(introRemaining(skipped + INTRO.skipFade, skipped) === 0, 'skip finishes within the fade');
    assert.ok(introRemaining(skipped + 0.1, skipped) < introRemaining(skipped, skipped));
    assert.equal(introRemaining(Number.NaN, null), 1);
  });
});
