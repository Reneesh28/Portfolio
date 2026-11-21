import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PerspectiveCamera, Vector3 } from 'three';
import { computeMilestoneFocusPose, computeRegionPose } from '../../src/world-forge/camera/cameraTargets.ts';
import { ASCENSION_BUDGET, buildAscension, triangleCount } from '../../src/world-forge/regions/ascension/ascensionGeometry.ts';
import { MILESTONE_DISTANCE, PATH, PATH_ISLANDS, PATH_LENGTH, PATH_MAX_HEIGHT, PINNACLES, PLATFORM, WAYSTONES, waystoneCentre } from '../../src/world-forge/regions/ascension/ascensionLayout.ts';
import { MILESTONE_IDS, MILESTONES } from '../../src/world-forge/content/timeline.ts';
import { projectById } from '../../src/world-forge/content/projects.ts';
import { createExperienceStore } from '../../src/world-forge/experience/experienceStore.ts';

const built = buildAscension();
const project = (pose: { position: number[]; target: number[]; fov: number }, w: number, h: number, point: number[]) => {
  const camera = new PerspectiveCamera(pose.fov, w / h, 0.5, 9000);
  camera.position.fromArray(pose.position);
  camera.lookAt(new Vector3().fromArray(pose.target));
  camera.updateMatrixWorld();
  return new Vector3().fromArray(point).project(camera);
};
const SIZES = [
  [1440, 900],
  [1280, 720],
  [390, 844],
  [844, 390],
  [768, 1024],
  [360, 640],
];

describe('Path of Ascension geometry (M6.3)', () => {
  it('stays within the render budget (proposal §2.8)', () => {
    const tris = [built.stone, built.snow, built.lanterns, built.lights, built.beam].reduce((n, g) => n + triangleCount(g), 0);
    assert.ok(tris <= ASCENSION_BUDGET.triangles, `${tris} triangles`);
    // stone, snow, lanterns, crown lights, beam; less the removed placeholder accent.
    assert.ok(5 - 1 <= ASCENSION_BUDGET.drawCalls);
  });

  it('orders the lanterns along the path, each with its own range, and covers the whole climb', () => {
    let next = 0;
    let last = -1;
    for (const r of built.lanternRanges) {
      assert.equal(r.start, next);
      assert.ok(r.distance > last, 'in path order');
      last = r.distance;
      next += r.count;
    }
    assert.equal(built.lanterns.getAttribute('color').count, next);
    assert.ok(built.lanternRanges.length > 30 && last > PATH_LENGTH - 10, `${built.lanternRanges.length} lanterns up to ${last.toFixed(0)} of ${PATH_LENGTH.toFixed(0)} m`);
    for (const id of MILESTONE_IDS) assert.ok(built.lightRanges[id].count > 0);
  });

  it('places waystones and pinnacles on their islands, under the height limit; milestones climb in order', () => {
    const islandOf = (p: number[]) => PATH_ISLANDS.find((i) => Math.hypot(p[0] - i.position[0], p[2] - i.position[2]) < i.radius - 2);
    for (const w of WAYSTONES) {
      if (w.id === 'leadership') assert.deepEqual(w.position, PLATFORM.position, 'Leadership stands on the floating platform');
      else assert.ok(islandOf(w.position), `${w.id} on an island`);
      assert.ok(w.height <= PATH_MAX_HEIGHT);
    }
    for (const p of PINNACLES) assert.ok(islandOf(p.at) && p.height <= PATH_MAX_HEIGHT, 'pinnacle on an island');
    const order = MILESTONE_IDS.map((id) => MILESTONE_DISTANCE[id]);
    assert.deepEqual([...order].sort((a, b) => a - b), order, 'milestones in path order');
    const ys = WAYSTONES.map((w) => w.position[1]);
    assert.deepEqual([...ys].sort((a, b) => a - b), ys, 'and they rise');
    assert.ok(PATH.length >= 10);
  });
});

describe('Path of Ascension camera (M6.3)', () => {
  it('frames all four islands in its settled view at every size', () => {
    for (const [w, h] of SIZES) {
      const pose = computeRegionPose('path-of-ascension', w, h);
      for (const i of PATH_ISLANDS) {
        const v = project(pose, w, h, i.position);
        assert.ok(Math.abs(v.x) < 0.9 && Math.abs(v.y) < 0.9 && v.z < 1, `${w}x${h}: ${i.id} (${v.x.toFixed(2)}, ${v.y.toFixed(2)})`);
      }
    }
  });

  it('focuses each milestone: left of centre on wide screens, above the sheet on narrow ones', () => {
    for (const [w, h] of SIZES) {
      for (const id of MILESTONE_IDS) {
        const pose = computeMilestoneFocusPose(id, w, h);
        const v = project(pose, w, h, waystoneCentre(id));
        assert.ok(Math.abs(v.x) < 0.8 && Math.abs(v.y) < 0.85 && v.z < 1, `${w}x${h}: ${id} framed (${v.x.toFixed(2)}, ${v.y.toFixed(2)})`);
        if (w / h > 1.25) assert.ok(v.x < -0.05, `${w}x${h}: ${id} left of centre`);
        else assert.ok(v.y > 0.25, `${w}x${h}: ${id} above the sheet (${v.y.toFixed(2)})`);
        // The camera stays clear of every island (over open sky, on the hub side).
        for (const i of PATH_ISLANDS) {
          const d = Math.hypot(pose.position[0] - i.position[0], pose.position[2] - i.position[2]);
          assert.ok(d > i.radius || pose.position[1] > i.position[1] + 25, `${w}x${h}: ${id} focus clear of ${i.id}`);
        }
      }
    }
  });
});

describe('Path of Ascension timeline (M6.3, DEC-030)', () => {
  it('has the five approved milestones, in order, every one sourced from the CV', () => {
    assert.deepEqual(MILESTONES.map((m) => m.title), ['Foundations', 'University', 'Leadership', 'Professional', 'Building']);
    const began = MILESTONES.map((m) => m.began).filter((y): y is number => y !== null);
    assert.deepEqual([...began].sort((a, b) => a - b), began, 'dated milestones in order');
    for (const m of MILESTONES) assert.match(m.source, /resume\.pdf/);
    for (const m of MILESTONES) for (const g of m.groups) for (const id of g.works ?? []) assert.ok(projectById(id), id);
  });

  it('settles the conflicts by the CV and leaves out what only Classic has', () => {
    const text = JSON.stringify(MILESTONES);
    assert.ok(text.includes('Co-CEO') && !/\bCEO\b(?<!Co-CEO)/.test(text.replace(/Co-CEO/g, '')), 'Co-CEO, not CEO');
    assert.ok(text.includes('6.86') && !text.includes('6.91'));
    for (const absent of ['Vedanta', '99.6', 'freeCodeCamp', 'Algo Tutor', 'Aug 2023 – Present']) assert.ok(!text.includes(absent), absent);
  });
});

describe('Path of Ascension state (M6.3)', () => {
  it('opens only at the idle Path; navigation clears it', () => {
    const store = createExperienceStore('path-of-ascension');
    store.openAscension('university');
    assert.equal(store.getSnapshot().ascensionMilestone, 'university');
    store.openAscension('building');
    assert.equal(store.getSnapshot().ascensionMilestone, 'building');
    store.stepRegion(1);
    assert.equal(store.getSnapshot().ascensionMilestone, null);
    const sanctum = createExperienceStore('origin-sanctum');
    sanctum.openAscension('foundations');
    assert.equal(sanctum.getSnapshot().ascensionMilestone, null);
  });
});
