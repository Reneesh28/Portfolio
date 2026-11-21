import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PerspectiveCamera, Vector3 } from 'three';
import { ARRIVAL_ARCS, computeRegionPose, routeSegmentArcs } from '../../src/world-forge/camera/cameraTargets.ts';
import { createJourneyPath, TRAVEL_ARC, type SampledPose } from '../../src/world-forge/camera/journeyPath.ts';
import { JOURNEY_ROUTE } from '../../src/world-forge/experience/route.ts';
import { ASCENSION_TERRACES, BLUEPRINT_ARCHIVE, HIGHLANDS } from '../../src/world-forge/data/worldGeography.ts';

const poses = JOURNEY_ROUTE.map((region) => computeRegionPose(region.id, 1440, 900));
// The same path the CameraRig builds (with the designed per-segment arrival arcs).
const path = createJourneyPath(poses, routeSegmentArcs(JOURNEY_ROUTE, TRAVEL_ARC));
const fresh = (): SampledPose => ({ position: new Vector3(), target: new Vector3(), fov: 0 });

describe('journey camera path', () => {
  it('returns each registered pose exactly at its stop', () => {
    poses.forEach((pose, stop) => {
      const sample = path.sample(stop, fresh());
      assert.deepEqual(sample.position.toArray(), pose.position);
      assert.deepEqual(sample.target.toArray(), pose.target);
      assert.equal(sample.fov, pose.fov);
    });
  });

  it('is continuous: small journey steps give small camera steps (no jumps)', () => {
    const step = 1 / 600;
    const previous = path.sample(0, fresh());
    const next = fresh();
    let largest = 0;
    for (let p = step; p <= poses.length - 1; p += step) {
      path.sample(p, next);
      largest = Math.max(largest, next.position.distanceTo(previous.position));
      previous.position.copy(next.position);
    }
    assert.ok(largest < 2, `largest camera step for 1/600 of a stop: ${largest.toFixed(3)} units`);
  });

  it('keeps the camera above the mainland surface along the whole route', () => {
    const sample = fresh();
    for (let p = 0; p <= poses.length - 1; p += 0.01) {
      path.sample(p, sample);
      assert.ok(sample.position.y >= 2, `camera at y=${sample.position.y.toFixed(2)} (journey ${p.toFixed(2)})`);
    }
  });

  it('clears the tall M3 landmark volumes along the whole route', () => {
    // Conservative cylinders [x, z, radius, top] around the tallest geography.
    const volumes: Array<[number, number, number, number, string]> = [
      ...HIGHLANDS.map(([x, z, h]): [number, number, number, number, string] => [x, z, 30, h * 1.35 + 4, 'highland']),
      ...ASCENSION_TERRACES.map((t): [number, number, number, number, string] => [t.center[0], t.center[1], t.radius * 1.4, t.top + 6, 'terrace']),
      [235, -78, 4, 56 + 22, 'summit beacon'],
      [0, 0, 34, 50, 'forge'],
      [0, 0, 24, 58, 'forge crown and orbit'],
      [110, 95, 16, 8 + 28, 'sanctum obelisk'],
      [170, -60, 8, BLUEPRINT_ARCHIVE.top + 42, 'archive frame'],
    ];
    const sample = fresh();
    for (let p = 0; p <= poses.length - 1; p += 0.005) {
      path.sample(p, sample);
      for (const [x, z, r, top, name] of volumes) {
        const inside = Math.hypot(sample.position.x - x, sample.position.z - z) < r && sample.position.y < top;
        assert.ok(!inside, `camera enters ${name} volume at journey ${p.toFixed(3)} (y=${sample.position.y.toFixed(1)})`);
      }
    }
  });

  it('dips the Sanctum → Forge arrival and rises into the settled view (the M4 reveal)', () => {
    const forge = JOURNEY_ROUTE.findIndex((r) => r.id === 'world-forge');
    assert.ok((ARRIVAL_ARCS['world-forge'] ?? 0) < 0);
    const straight = createJourneyPath(poses, routeSegmentArcs(JOURNEY_ROUTE, TRAVEL_ARC).map((a, i) => (i === forge - 1 ? 0 : a)));
    const mid = forge - 0.5;
    const dipped = path.sample(mid, fresh()).position.y;
    const level = straight.sample(mid, fresh()).position.y;
    assert.ok(dipped < level - 3, `camera dips ${(level - dipped).toFixed(1)} units mid-arrival`);
    // Rising into the stop: just before arrival the camera is still climbing, and lands exactly.
    const a = path.sample(forge - 0.06, fresh()).position.y;
    const b = path.sample(forge - 0.02, fresh()).position.y;
    assert.ok(b > a - 1e-6 || Math.abs(b - a) < 0.2);
    assert.deepEqual(path.sample(forge, fresh()).position.toArray(), poses[forge].position);
    // Other segments keep the default arc.
    assert.equal(routeSegmentArcs(JOURNEY_ROUTE, TRAVEL_ARC).filter((arc) => arc === TRAVEL_ARC).length, JOURNEY_ROUTE.length - 2);
  });

  it('frames the Forge left of centre with the right side clear for the dossier panel', () => {
    const forge = computeRegionPose('world-forge', 1440, 900);
    const camera = new PerspectiveCamera(forge.fov, 1440 / 900, 0.1, 1200);
    camera.position.fromArray(forge.position);
    camera.lookAt(new Vector3().fromArray(forge.target));
    camera.updateMatrixWorld();
    const ndc = (p: [number, number, number]) => new Vector3(...p).project(camera);
    const axisBottom = ndc([0, 0, 0]);
    const crown = ndc([0, 48, 0]);
    assert.ok(axisBottom.x < -0.1 && crown.x < -0.1, 'Forge axis sits left of centre');
    const share = (crown.y - axisBottom.y) / 2;
    assert.ok(share > 0.5 && share < 0.72, `Forge fills ${(share * 100).toFixed(0)}% of the frame height`);
    assert.ok(crown.y < 0.95 && axisBottom.y > -0.95, 'base and crown both in frame');
  });

  it('on narrow screens, centres the whole Forge and keeps every transition clear', () => {
    for (const [w, h] of [[390, 844], [360, 640], [820, 1180]]) {
      const narrowPoses = JOURNEY_ROUTE.map((region) => computeRegionPose(region.id, w, h));
      const forge = narrowPoses[JOURNEY_ROUTE.findIndex((r) => r.id === 'world-forge')];
      const camera = new PerspectiveCamera(forge.fov, w / h, 0.1, 1200);
      camera.position.fromArray(forge.position);
      camera.lookAt(new Vector3().fromArray(forge.target));
      camera.updateMatrixWorld();
      const ndc = (p: [number, number, number]) => new Vector3(...p).project(camera);
      for (const p of [[0, 0, 0], [0, 48, 0], [-22, 6, 0], [22, 6, 0], [0, 6, 22]] as Array<[number, number, number]>) {
        const v = ndc(p);
        assert.ok(Math.abs(v.x) < 1 && Math.abs(v.y) < 1, `${w}×${h}: Forge point ${p} in frame (${v.x.toFixed(2)}, ${v.y.toFixed(2)})`);
      }
      const narrowPath = createJourneyPath(narrowPoses, routeSegmentArcs(JOURNEY_ROUTE, TRAVEL_ARC));
      const sample = fresh();
      for (let p = 0; p <= narrowPoses.length - 1; p += 0.01) {
        narrowPath.sample(p, sample);
        assert.ok(sample.position.y >= 2, `${w}×${h}: camera above ground at ${p.toFixed(2)}`);
        const r = Math.hypot(sample.position.x, sample.position.z);
        assert.ok(!(r < 34 && sample.position.y < 50) && !(r < 24 && sample.position.y < 58), `${w}×${h}: clear of the Forge at ${p.toFixed(2)}`);
      }
    }
  });

  it('clamps out-of-range and invalid positions to the route ends', () => {
    assert.deepEqual(path.sample(-3, fresh()).position.toArray(), poses[0].position);
    assert.deepEqual(path.sample(99, fresh()).position.toArray(), poses[poses.length - 1].position);
    assert.deepEqual(path.sample(Number.NaN, fresh()).position.toArray(), poses[0].position);
  });
});
