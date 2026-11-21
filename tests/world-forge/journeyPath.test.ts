import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Vector3 } from 'three';
import { computeRegionPose } from '../../src/world-forge/camera/cameraTargets.ts';
import { createJourneyPath, type SampledPose } from '../../src/world-forge/camera/journeyPath.ts';
import { JOURNEY_ROUTE } from '../../src/world-forge/experience/route.ts';
import { ASCENSION_TERRACES, BLUEPRINT_ARCHIVE, HIGHLANDS } from '../../src/world-forge/data/worldGeography.ts';

const poses = JOURNEY_ROUTE.map((region) => computeRegionPose(region.id, 1440, 900));
const path = createJourneyPath(poses);
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

  it('clamps out-of-range and invalid positions to the route ends', () => {
    assert.deepEqual(path.sample(-3, fresh()).position.toArray(), poses[0].position);
    assert.deepEqual(path.sample(99, fresh()).position.toArray(), poses[poses.length - 1].position);
    assert.deepEqual(path.sample(Number.NaN, fresh()).position.toArray(), poses[0].position);
  });
});
