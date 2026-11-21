import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PerspectiveCamera, Vector3 } from 'three';
import { computeRegionPose } from '../../src/world-forge/camera/cameraTargets.ts';
import { ARCHIVE_BUDGET, buildArchive, triangleCount } from '../../src/world-forge/regions/archive/archiveGeometry.ts';
import { ARCHIVE_MAX_HEIGHT, FLOOR, HALLS, rimRadius, structureCentre, STRUCTURES, toWorld } from '../../src/world-forge/regions/archive/archiveLayout.ts';
import { SKILL_CATEGORIES, SKILL_CATEGORY_IDS } from '../../src/world-forge/content/skills.ts';
import { PROJECTS, projectById } from '../../src/world-forge/content/projects.ts';
import { createExperienceStore } from '../../src/world-forge/experience/experienceStore.ts';
import { JOURNEY_CONFIG } from '../../src/world-forge/experience/experienceStore.ts';

const built = buildArchive();
const project = (pose: { position: number[]; target: number[]; fov: number }, w: number, h: number, point: number[]) => {
  const camera = new PerspectiveCamera(pose.fov, w / h, 0.5, 9000);
  camera.position.fromArray(pose.position);
  camera.lookAt(new Vector3().fromArray(pose.target));
  camera.updateMatrixWorld();
  return new Vector3().fromArray(point).project(camera);
};

describe('Blueprint Archive geometry (M6.2)', () => {
  it('stays within the render budget (proposal §2.8)', () => {
    const all = [built.stone, built.lines, built.crystals, built.ghost, ...Object.values(built.solids)];
    const tris = all.reduce((n, g) => n + triangleCount(g), 0);
    assert.ok(tris <= ARCHIVE_BUDGET.triangles, `${tris} triangles`);
    // Always: stone, lines, crystals, ghost. While built: one solid (two during a switch). Less the removed placeholder accent.
    assert.ok(4 + 2 - 1 <= ARCHIVE_BUDGET.drawCalls);
  });

  it('gives each structure, then the floor, contiguous line ranges; each structure a crystal range', () => {
    let next = 0;
    for (const r of [...SKILL_CATEGORY_IDS.map((id) => built.lineRanges[id]), built.floorLines]) {
      assert.equal(r.start, next);
      assert.ok(r.count > 0);
      next += r.count;
    }
    assert.equal(built.lines.getAttribute('color').count, next);
    next = 0;
    for (const r of [...SKILL_CATEGORY_IDS.map((id) => built.crystalRanges[id]), built.outcrops]) {
      assert.equal(r.start, next);
      next += r.count;
    }
    assert.equal(built.crystals.getAttribute('color').count, next);
  });

  it('keeps everything on the island and under the height limit', () => {
    for (const g of [built.stone, built.lines, built.crystals, ...Object.values(built.solids)]) {
      g.computeBoundingBox();
      assert.ok(g.boundingBox && g.boundingBox.max.y <= ARCHIVE_MAX_HEIGHT, `reaches ${g.boundingBox?.max.y.toFixed(1)} m`);
      g.computeBoundingSphere();
    }
    for (let b = -180; b < 180; b += 10) assert.ok(rimRadius(b) > FLOOR.step.radius + 4, `rim at ${b}°`);
    built.stone.computeBoundingBox();
    const box = built.stone.boundingBox;
    assert.ok(box && Math.max(-box.min.x, box.max.x, -box.min.z, box.max.z) < HALLS.radius + 12, 'halls inside the rim');
    for (const s of STRUCTURES) assert.ok(Math.hypot(s.position[0], s.position[2]) + s.half < FLOOR.radius, `${s.id} on the floor`);
  });
});

describe('Blueprint Archive camera (M6.2)', () => {
  it('frames all four structures; left of centre on wide screens, upper part on narrow ones', () => {
    for (const [w, h] of [
      [1440, 900],
      [1280, 720],
      [390, 844],
      [844, 390],
      [768, 1024],
    ]) {
      const pose = computeRegionPose('blueprint-archive', w, h);
      const xs: number[] = [];
      for (const s of STRUCTURES) {
        const top = project(pose, w, h, toWorld([s.position[0], s.position[1] + s.height, s.position[2]]));
        const base = project(pose, w, h, toWorld([s.position[0], s.position[1], s.position[2]]));
        assert.ok(Math.abs(top.x) < 0.95 && top.y < 0.95 && base.y > -0.95, `${w}x${h}: ${s.id} whole in frame`);
        xs.push(project(pose, w, h, structureCentre(s.id)).x);
        if (w / h < 1.25) assert.ok(base.y > -0.1, `${w}x${h}: ${s.id} above the sheet (${base.y.toFixed(2)})`);
      }
      if (w / h > 1.25) assert.ok((xs[0] + xs[xs.length - 1]) / 2 < -0.05, `${w}x${h}: the arc sits left of centre`);
      // Wide screens with room for the side panel (≥ 1100 px): every structure clears it (it starts ≈ 60% across).
      if (w / h > 1.25 && w >= 1100)
        for (const s of STRUCTURES) {
          const edge = project(pose, w, h, toWorld([s.position[0] + s.half + 1, s.position[1] + s.height * 0.5, s.position[2]]));
          assert.ok(edge.x < 0.12, `${w}x${h}: ${s.id} clears the panel (${edge.x.toFixed(2)})`);
        }
    }
  });
});

describe('Blueprint Archive skills (M6.2, DEC-028)', () => {
  const text = (id: string) => {
    const p = projectById(id);
    assert.ok(p, `work ${id} exists`);
    return [p.name, p.overview.value, ...p.tech.value, ...p.approach.value, ...p.architecture.value].join(' ').toLowerCase();
  };

  it("has the master doc's four categories, every skill sourced, in use or exploring", () => {
    assert.deepEqual(SKILL_CATEGORIES.map((c) => c.title), ['AI & Intelligence', 'Software Engineering', 'Data & Infrastructure', 'Creative & Game Development']);
    for (const c of SKILL_CATEGORIES)
      for (const s of c.skills) {
        assert.ok(s.tier === 'in-use' || s.tier === 'exploring');
        assert.ok(s.source.length > 5, `${s.name} names its source`);
        assert.equal(Object.keys(s).some((k) => /level|percent|rating|score/i.test(k)), false, 'no ratings');
      }
  });

  it('names only works that exist and really use the skill', () => {
    for (const c of SKILL_CATEGORIES)
      for (const s of c.skills)
        for (const id of s.works) assert.ok(s.match.some((m) => text(id).includes(m)), `${s.name}: ${id} mentions one of ${s.match.join(', ')}`);
  });

  it('keeps out what neither the CV nor the owner image lists, and keeps what they do', () => {
    const names = SKILL_CATEGORIES.flatMap((c) => c.skills.map((s) => s.name.toLowerCase())).join(' | ');
    for (const absent of ['typescript', 'fine-tun', 'pytorch', 'hugging face', 'gitlab', 'postman', 'render', 'seaborn']) assert.ok(!names.includes(absent), absent);
    for (const present of ['python', 'c++', 'netlify', 'chart.js', 'canva', 'three.js', 'fastapi', 'langgraph', 'aws']) assert.ok(names.includes(present), present);
    assert.ok(PROJECTS.length === 8);
  });
});

describe('Blueprint Archive panel state and the work hand-off (M6.2)', () => {
  it('opens only at the idle Archive; navigation clears it', () => {
    const store = createExperienceStore('blueprint-archive');
    store.openArchive('data');
    assert.equal(store.getSnapshot().archiveCategory, 'data');
    store.navigateTo('horizon');
    assert.equal(store.getSnapshot().archiveCategory, null);
    const forge = createExperienceStore('world-forge');
    forge.openArchive('ai');
    assert.equal(forge.getSnapshot().archiveCategory, null);
  });

  it('a work button travels to the Forge and opens the dossier on arrival', () => {
    const store = createExperienceStore('blueprint-archive');
    store.openArchive('software');
    store.visitWork('aetherion');
    let s = store.getSnapshot();
    assert.equal(s.archiveCategory, null, 'the panel closes');
    assert.equal(s.destinationRegion, 'world-forge');
    assert.equal(s.focusedProject, null, 'not before arriving');
    for (let t = 0; t < 20 && store.getJourney().phase !== 'idle'; t += 0.05) store.advance(0.05);
    s = store.getSnapshot();
    assert.equal(s.currentRegion, 'world-forge');
    assert.equal(s.focusedProject, 'aetherion', 'its dossier opens on arrival');
    assert.ok(JOURNEY_CONFIG.navigationMax > 0);
  });

  it('other navigation during the trip cancels the hand-off', () => {
    const store = createExperienceStore('blueprint-archive');
    store.visitWork('nutrifit');
    store.advance(0.1);
    store.navigateTo('horizon');
    for (let t = 0; t < 20 && store.getJourney().phase !== 'idle'; t += 0.05) store.advance(0.05);
    assert.equal(store.getSnapshot().currentRegion, 'horizon');
    assert.equal(store.getSnapshot().focusedProject, null);
  });
});
