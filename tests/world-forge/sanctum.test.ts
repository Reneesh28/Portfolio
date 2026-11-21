import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PerspectiveCamera, Vector3 } from 'three';
import { computeFragmentFocusPose, computeRegionPose, FRAGMENT_FOCUS } from '../../src/world-forge/camera/cameraTargets.ts';
import { buildSanctum, SANCTUM_BUDGET, triangleCount } from '../../src/world-forge/regions/sanctum/sanctumGeometry.ts';
import {
  COURT,
  fragmentCentre,
  FRAGMENTS,
  PLATFORM,
  rimRadius,
  SANCTUM_ANCHOR,
  SANCTUM_MAX_HEIGHT,
  TERRACES,
  toWorld,
  WATERFALLS,
} from '../../src/world-forge/regions/sanctum/sanctumLayout.ts';
import { createExperienceStore } from '../../src/world-forge/experience/experienceStore.ts';

const built = buildSanctum();
const project = (pose: { position: number[]; target: number[]; fov: number }, w: number, h: number, point: number[]) => {
  const camera = new PerspectiveCamera(pose.fov, w / h, 0.5, 9000);
  camera.position.fromArray(pose.position);
  camera.lookAt(new Vector3().fromArray(pose.target));
  camera.updateMatrixWorld();
  return new Vector3().fromArray(point).project(camera);
};

describe('Origin Sanctum geometry (M6.1)', () => {
  it('stays within the render budget (proposal §2.9)', () => {
    const tris = [built.stone, built.moss, built.edges, built.pool, built.halo, built.pointer].reduce((n, g) => n + triangleCount(g), 0);
    assert.ok(tris <= SANCTUM_BUDGET.triangles, `${tris} triangles`);
    // Baked meshes: stone, moss, edges, pool; moving: halo, pointer; plus motes and two waterfalls.
    const draws = 4 + 2 + 1 + WATERFALLS.length;
    assert.ok(draws - 1 <= SANCTUM_BUDGET.drawCalls, `${draws} draws, less the removed placeholder`);
  });

  it('gives each fragment, then the court, its own contiguous edge range', () => {
    const ranges = [...FRAGMENTS.map((f) => built.fragmentEdges[f.id]), built.courtEdges];
    let next = 0;
    for (const r of ranges) {
      assert.equal(r.start, next);
      assert.ok(r.count > 0);
      next += r.count;
    }
    assert.equal(built.edges.getAttribute('color').count, next);
  });

  it('keeps everything on the island and under the height limit', () => {
    built.stone.computeBoundingBox();
    const box = built.stone.boundingBox;
    assert.ok(box && box.max.y <= SANCTUM_MAX_HEIGHT, `stone reaches ${box?.max.y.toFixed(1)} m`);
    assert.ok(box && box.min.y >= -PLATFORM.hang - 2, 'nothing hangs far below');
    // The terraces and court sit inside the island's rim all the way round.
    for (let b = -180; b < 180; b += 10) assert.ok(rimRadius(b) > TERRACES[0].radius + 2, `rim at ${b}° is ${rimRadius(b).toFixed(1)} m`);
    assert.ok(COURT.radius < TERRACES[1].radius);
    for (const w of WATERFALLS) assert.ok(rimRadius(w.bearing) > 40, 'waterfalls pour from the edge');
  });
});

describe('Origin Sanctum camera (M6.1, DEC-026)', () => {
  it('looks back across the court toward the Forge, which stays in frame', () => {
    for (const [w, h] of [
      [1440, 900],
      [390, 844],
      [844, 390],
      [768, 1024],
    ]) {
      const pose = computeRegionPose('origin-sanctum', w, h);
      const toHub = Math.hypot(pose.target[0], pose.target[2]) < Math.hypot(pose.position[0], pose.position[2]);
      assert.ok(toHub, `${w}x${h}: the camera faces the hub`);
      const court = project(pose, w, h, toWorld([0, COURT.top, 0]));
      assert.ok(Math.abs(court.x) < 0.9 && Math.abs(court.y) < 0.9 && court.z < 1, `${w}x${h}: court in frame`);
      const forge = project(pose, w, h, [0, 120, 0]);
      assert.ok(Math.abs(forge.x) < 1 && Math.abs(forge.y) < 1 && forge.z < 1, `${w}x${h}: the Forge's city is in frame (${forge.x.toFixed(2)}, ${forge.y.toFixed(2)})`);
      for (const f of FRAGMENTS) {
        const p = project(pose, w, h, fragmentCentre(f.id));
        assert.ok(Math.abs(p.x) < 0.95 && Math.abs(p.y) < 0.95, `${w}x${h}: ${f.id} in frame`);
      }
      if (w / h > 1.25) assert.ok(court.x < -0.05, `${w}x${h}: the court sits left of centre (panel on the right)`);
    }
  });

  it('focuses a fragment with a short move toward it, keeping it in frame', () => {
    for (const [w, h] of [
      [1440, 900],
      [390, 844],
    ]) {
      const settled = computeRegionPose('origin-sanctum', w, h);
      for (const f of FRAGMENTS) {
        const pose = computeFragmentFocusPose(f.id, w, h);
        const c = fragmentCentre(f.id);
        const before = Math.hypot(settled.position[0] - c[0], settled.position[1] - c[1], settled.position[2] - c[2]);
        const after = Math.hypot(pose.position[0] - c[0], pose.position[1] - c[1], pose.position[2] - c[2]);
        assert.ok(Math.abs(after / before - (1 - FRAGMENT_FOCUS.approach)) < 1e-6, 'a fifth of the way closer');
        const p = project(pose, w, h, c);
        assert.ok(Math.abs(p.x) < 0.8 && Math.abs(p.y) < 0.8, `${w}x${h}: ${f.id} framed`);
        if (w > h) assert.ok(p.x < 0, `${f.id} left of centre on wide screens`);
        // The sheet covers the lower ~52%: the fragment must sit in the top third.
        else assert.ok(p.y > 0.33, `${f.id} in the top third on narrow screens (${p.y.toFixed(2)})`);
      }
    }
  });

  it('keeps the camera clear of the Sanctum at its stop', () => {
    const pose = computeRegionPose('origin-sanctum', 1440, 900);
    const flat = Math.hypot(pose.position[0] - SANCTUM_ANCHOR[0], pose.position[2] - SANCTUM_ANCHOR[2]);
    assert.ok(flat > 60 || pose.position[1] > SANCTUM_ANCHOR[1] + SANCTUM_MAX_HEIGHT, 'outside the court and fragments');
  });
});

describe('Origin Sanctum panel state (M6.1)', () => {
  it('opens only at the Sanctum while idle, and direct navigation closes it', () => {
    const store = createExperienceStore('origin-sanctum');
    store.openSanctum('engineer');
    assert.equal(store.getSnapshot().sanctumView, 'engineer');
    store.openSanctum('overview');
    assert.equal(store.getSnapshot().sanctumView, 'overview');
    store.navigateTo('world-forge');
    assert.equal(store.getSnapshot().sanctumView, null, 'navigation outranks the panel');
    store.openSanctum('creator');
    assert.equal(store.getSnapshot().sanctumView, null, 'refused away from the Sanctum / mid-travel');
    const forge = createExperienceStore('world-forge');
    forge.openSanctum('overview');
    assert.equal(forge.getSnapshot().sanctumView, null, 'refused at the Forge');
  });
});

describe('Origin Sanctum content (M6.1, doc 11)', async () => {
  const { SANCTUM_CONTENT, SANCTUM_IDENTITY, SANCTUM_VIEWS } = await import('../../src/world-forge/content/sanctum.ts');
  const { isDisplayable, builtProjects } = await import('../../src/world-forge/content/projects.ts');

  it('has the overview and the three fragments, in order', () => {
    assert.deepEqual([...SANCTUM_VIEWS], ['overview', 'engineer', 'creator', 'explorer']);
    assert.deepEqual(SANCTUM_VIEWS.map((v) => SANCTUM_CONTENT[v].title), ['Balam Reneesh', 'The Engineer', 'The Creator', 'The Explorer']);
  });

  it('shows only sourced, approved lines', () => {
    const fields = [
      ...Object.values(SANCTUM_IDENTITY),
      ...SANCTUM_VIEWS.flatMap((v) => [...SANCTUM_CONTENT[v].entries.map((e) => e.field), ...(SANCTUM_CONTENT[v].quote ? [SANCTUM_CONTENT[v].quote] : [])]),
    ];
    for (const f of fields) {
      assert.ok(isDisplayable(f), f.value);
      assert.ok(f.source.length > 10, `"${f.value}" names its source`);
    }
  });

  it('leaves out what no source has (DEC-026) and keeps contact details for the Horizon', () => {
    const text = JSON.stringify(SANCTUM_CONTENT).toLowerCase();
    for (const absent of ['problem-solving', 'game-development', 'seeking roles', 'availability', '@', '+91', 'cgpa']) assert.ok(!text.includes(absent), absent);
  });

  it('counts and names the works from the project data', () => {
    const line = SANCTUM_CONTENT.creator.entries[0].field.value;
    assert.equal(builtProjects().length, 8);
    assert.equal(line, 'Eight works stand in the World Forge, led by NeuroPlay Engine, AETHERION and NutriFit AI.');
  });
});
