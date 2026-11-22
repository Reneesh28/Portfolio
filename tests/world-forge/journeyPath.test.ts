import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PerspectiveCamera, Vector3 } from 'three';
import { ARRIVAL_ARCS, computeRegionPose, routeSegmentArcs, routeSegmentLooks } from '../../src/world-forge/camera/cameraTargets.ts';
import { createJourneyPath, TRAVEL_ARC, type SampledPose } from '../../src/world-forge/camera/journeyPath.ts';
import { JOURNEY_ROUTE } from '../../src/world-forge/experience/route.ts';
import { CLOUD_LAYERS, ISLANDS } from '../../src/world-forge/data/worldGeography.ts';

const poses = JOURNEY_ROUTE.map((region) => computeRegionPose(region.id, 1440, 900));
// The same path the CameraRig builds (with the designed per-segment arrival arcs).
const path = createJourneyPath(poses, routeSegmentArcs(JOURNEY_ROUTE, TRAVEL_ARC), routeSegmentLooks(JOURNEY_ROUTE));
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

  it('is continuous: small journey steps give small camera steps (no jumps, scaled to the world)', () => {
    const step = 1 / 600;
    const previous = path.sample(0, fresh());
    const next = fresh();
    let largest = 0;
    for (let p = step; p <= poses.length - 1; p += step) {
      path.sample(p, next);
      largest = Math.max(largest, next.position.distanceTo(previous.position));
      previous.position.copy(next.position);
    }
    // Scaled to the world: a jump is a step far larger than the longest segment divided evenly.
    const longest = Math.max(...poses.slice(1).map((pose, i) => Math.hypot(...pose.position.map((v, k) => v - poses[i].position[k]))));
    const limit = Math.max(2, (longest * 2.5) / 600);
    assert.ok(largest < limit, `largest camera step for 1/600 of a stop: ${largest.toFixed(3)} units (limit ${limit.toFixed(2)})`);
  });

  it('keeps the camera above the cloud sea along the whole route', () => {
    const cloudTop = Math.max(...CLOUD_LAYERS);
    const sample = fresh();
    for (let p = 0; p <= poses.length - 1; p += 0.01) {
      path.sample(p, sample);
      assert.ok(sample.position.y >= cloudTop + 25, `camera at y=${sample.position.y.toFixed(2)} (journey ${p.toFixed(2)})`);
    }
  });

  it('never passes through an island, its landmark or the Forge along the whole route', () => {
    // Solid rock: each island from the tip of its hanging rock up to just above its surface
    // (the camera may fly over an island, never through it).
    const volumes = ISLANDS.map((island) => {
      const [x, y, z] = island.position;
      return { name: island.id, x, z, r: island.radius * 1.02, bottom: y - island.thickness - island.depth, top: y + 3 };
    });
    // Landmarks standing on the islands (P2 blockouts; the M6.1 Sanctum, M6.2 Archive, M6.3 Path, M7 Convergence and Guild), generous radii and heights.
    const landmark: Record<string, [number, number]> = {
      'origin-sanctum': [44, 34], 'blueprint-archive': [62, 42], 'pa-1': [32, 22], 'pa-2': [30, 24], 'pa-3': [28, 26],
      'pa-summit': [36, 30], 'wb-convergence': [26, 20], 'wb-sunken': [16, 14], 'wb-ember': [16, 16], 'wb-steel': [24, 12], 'wb-temporal': [10, 23], 'wb-dunes': [16, 9], horizon: [56, 26],
    };
    for (const island of ISLANDS) {
      const l = landmark[island.id] ?? (island.id.startsWith('wb-') ? [12, 26] : null);
      if (!l) continue;
      const [x, y, z] = island.position;
      volumes.push({ name: `${island.id} landmark`, x, z, r: l[0], bottom: y, top: y + l[1] });
    }
    volumes.push({ name: 'spire city', x: 0, z: 0, r: 94, bottom: 0, top: 350 }, { name: 'observation rings', x: 0, z: 0, r: 170, bottom: 85, top: 160 });
    const sample = fresh();
    for (let p = 0; p <= poses.length - 1; p += 0.005) {
      path.sample(p, sample);
      for (const v of volumes) {
        if (v.name === 'void' && p < 0.5) continue; // the opening camera stands on the Void island
        const inside = Math.hypot(sample.position.x - v.x, sample.position.z - v.z) < v.r && sample.position.y < v.top && sample.position.y > v.bottom;
        assert.ok(!inside, `camera enters ${v.name} at journey ${p.toFixed(3)} (y=${sample.position.y.toFixed(1)})`);
      }
    }
  });

  it('rises high over the portal for the reveal, and higher still for the overview after the Forge (P5)', () => {
    const at = (id: string) => JOURNEY_ROUTE.findIndex((r) => r.id === id);
    const plain = createJourneyPath(poses);
    const sanctum = at('origin-sanctum');
    const archive = at('blueprint-archive');
    const reveal = path.sample(sanctum - 0.5, fresh());
    const overview = path.sample(archive - 0.5, fresh());
    assert.ok(reveal.position.y > 150, `reveal climbs to ${reveal.position.y.toFixed(0)} m`);
    assert.ok(overview.position.y > 220, `overview climbs to ${overview.position.y.toFixed(0)} m`);
    assert.ok(reveal.position.y > plain.sample(sanctum - 0.5, fresh()).position.y + 60);
    // Mid-overview the view turns toward the hub (look-at pulled toward the world centre).
    const flatTo = (v: Vector3) => Math.hypot(v.x, v.z);
    assert.ok(flatTo(overview.target) < flatTo(plain.sample(archive - 0.5, fresh()).target) - 50, 'overview looks back over the hub');
    // Every stop is still exact, and other segments keep the default arc.
    poses.forEach((pose, stop) => assert.deepEqual(path.sample(stop, fresh()).position.toArray(), pose.position));
    assert.deepEqual(Object.keys(ARRIVAL_ARCS).sort(), ['blueprint-archive', 'origin-sanctum']);
    assert.equal(routeSegmentArcs(JOURNEY_ROUTE, TRAVEL_ARC).filter((a) => a === TRAVEL_ARC).length, JOURNEY_ROUTE.length - 3);
  });

  it('frames the whole hub left of centre, with the right side clear for the M5 dossier', () => {
    const forge = computeRegionPose('world-forge', 1440, 900);
    const camera = new PerspectiveCamera(forge.fov, 1440 / 900, 0.1, 9000);
    camera.position.fromArray(forge.position);
    camera.lookAt(new Vector3().fromArray(forge.target));
    camera.updateMatrixWorld();
    const ndc = (p: [number, number, number]) => new Vector3(...p).project(camera);
    for (const p of [[0, 0, 0], [0, 345, 0], [-90, 6, 0], [90, 6, 0], [0, 6, -90]] as Array<[number, number, number]>) {
      const v = ndc(p);
      assert.ok(Math.abs(v.x) < 1 && Math.abs(v.y) < 1, `hub point ${p} in frame (${v.x.toFixed(2)}, ${v.y.toFixed(2)})`);
    }
    // The spire city (radius ≈ 90) stays in the left ~60% of the frame.
    for (const p of [[90, 6, 0], [-90, 6, 0], [0, 6, 90], [0, 6, -90], [0, 345, 0]] as Array<[number, number, number]>) {
      assert.ok(ndc(p).x < 0.2, `city point ${p} left of the dossier space (x ${ndc(p).x.toFixed(2)})`);
    }
  });

  it('frames every island on desktop and on narrow screens', () => {
    for (const [w, h] of [[1440, 900], [390, 844], [820, 1180]]) {
      for (const region of JOURNEY_ROUTE.filter((r) => r.id !== 'void' && r.id !== 'world-forge')) {
        const pose = computeRegionPose(region.id, w, h);
        const camera = new PerspectiveCamera(pose.fov, w / h, 0.1, 9000);
        camera.position.fromArray(pose.position);
        camera.lookAt(new Vector3().fromArray(pose.target));
        camera.updateMatrixWorld();
        const v = new Vector3(...region.position).project(camera);
        assert.ok(Math.abs(v.x) < 0.8 && Math.abs(v.y) < 0.85 && v.z < 1, `${w}×${h}: ${region.id} centre in frame (${v.x.toFixed(2)}, ${v.y.toFixed(2)})`);
      }
    }
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
      for (const p of [[0, 0, 0], [0, 345, 0], [-90, 6, 0], [90, 6, 0], [0, 6, 90]] as Array<[number, number, number]>) {
        const v = ndc(p);
        assert.ok(Math.abs(v.x) < 1 && Math.abs(v.y) < 1, `${w}×${h}: Forge point ${p} in frame (${v.x.toFixed(2)}, ${v.y.toFixed(2)})`);
      }
      const narrowPath = createJourneyPath(narrowPoses, routeSegmentArcs(JOURNEY_ROUTE, TRAVEL_ARC), routeSegmentLooks(JOURNEY_ROUTE));
      const sample = fresh();
      for (let p = 0; p <= narrowPoses.length - 1; p += 0.01) {
        narrowPath.sample(p, sample);
        assert.ok(sample.position.y >= Math.max(...CLOUD_LAYERS) + 25, `${w}×${h}: camera above the clouds at ${p.toFixed(2)}`);
        const r = Math.hypot(sample.position.x, sample.position.z);
        assert.ok(!(r < 94 && sample.position.y < 350), `${w}×${h}: clear of the spire city at ${p.toFixed(2)}`);
      }
    }
  });

  it('clamps out-of-range and invalid positions to the route ends', () => {
    assert.deepEqual(path.sample(-3, fresh()).position.toArray(), poses[0].position);
    assert.deepEqual(path.sample(99, fresh()).position.toArray(), poses[poses.length - 1].position);
    assert.deepEqual(path.sample(Number.NaN, fresh()).position.toArray(), poses[0].position);
  });
});
