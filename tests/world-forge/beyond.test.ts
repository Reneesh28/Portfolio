import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PerspectiveCamera, Vector3 } from 'three';
import { computeRegionPose, computeTerritoryFocusPose } from '../../src/world-forge/camera/cameraTargets.ts';
import { BEYOND_BUDGET, buildBeyond, triangleCount } from '../../src/world-forge/regions/beyond/beyondGeometry.ts';
import { BEYOND_MAX_HEIGHT, CONVERGENCE, GATES, LANDMARKS, PLAZA } from '../../src/world-forge/regions/beyond/beyondLayout.ts';
import { hasContent, openTerritories, TERRITORIES, TERRITORY_IDS, territoryById } from '../../src/world-forge/content/interests.ts';
import { ISLANDS } from '../../src/world-forge/data/worldGeography.ts';
import { createExperienceStore } from '../../src/world-forge/experience/experienceStore.ts';

const built = buildBeyond();
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

describe('Worlds Beyond geometry (M7: the Convergence and The Guild)', () => {
  it('stays within the render budget, in two baked meshes', () => {
    const tris = triangleCount(built.stone) + triangleCount(built.lines);
    assert.ok(tris <= BEYOND_BUDGET.triangles, `${tris} triangles`);
    assert.ok(2 <= BEYOND_BUDGET.drawCalls);
  });

  it('gives every gate and monolith strip its own range, then The Guild', () => {
    let next = 0;
    for (const r of [...TERRITORY_IDS.map((id) => built.gateRanges[id]), ...TERRITORY_IDS.map((id) => built.stripRanges[id]), built.guildLights]) {
      assert.equal(r.start, next);
      assert.ok(r.count > 0);
      next += r.count;
    }
    assert.equal(built.lines.getAttribute('color').count, next);
  });

  it('stands six gates on the plaza edge, each facing its own territory; all compact', () => {
    assert.equal(GATES.length, 6);
    assert.equal(new Set(GATES.map((g) => g.island.id)).size, 6, 'one gate per territory island');
    for (const g of GATES) {
      const toIsland = Math.atan2(g.island.position[0] - CONVERGENCE.position[0], g.island.position[2] - CONVERGENCE.position[2]);
      assert.ok(Math.abs(Math.atan2(Math.sin(toIsland - g.yaw), Math.cos(toIsland - g.yaw))) < 1e-6, `${g.territory} faces its island`);
      assert.ok(Math.abs(Math.hypot(g.position[0] - CONVERGENCE.position[0], g.position[2] - CONVERGENCE.position[2]) - PLAZA.gateRadius) < 1e-6);
    }
    assert.ok(PLAZA.step < CONVERGENCE.radius - 6, 'the plaza fits the island');
    built.stone.computeBoundingBox();
    const box = built.stone.boundingBox;
    assert.ok(box && box.max.y - CONVERGENCE.position[1] <= BEYOND_MAX_HEIGHT, 'the monolith stays compact');
    const guild = ISLANDS.find((i) => i.id === 'wb-sunken');
    const l = LANDMARKS.guild;
    assert.ok(guild && l && Math.hypot(l.centre[0] - guild.position[0], l.centre[2] - guild.position[2]) + 10 < guild.radius, 'The Guild sits on its island');
  });
});

describe('Worlds Beyond camera (M7)', () => {
  it('frames the Convergence and all six territories at every size', () => {
    for (const [w, h] of SIZES) {
      const pose = computeRegionPose('worlds-beyond', w, h);
      for (const id of ['wb-convergence', ...GATES.map((g) => g.island.id)]) {
        const i = ISLANDS.find((x) => x.id === id);
        assert.ok(i);
        const v = project(pose, w, h, i.position);
        assert.ok(Math.abs(v.x) < 0.95 && Math.abs(v.y) < 0.95 && v.z < 1, `${w}x${h}: ${id} (${v.x.toFixed(2)}, ${v.y.toFixed(2)})`);
      }
    }
  });

  it('focuses The Guild: left of centre on wide screens, above the sheet on narrow ones; nothing for unbuilt territories', () => {
    for (const [w, h] of SIZES) {
      const pose = computeTerritoryFocusPose('guild', w, h);
      assert.ok(pose && LANDMARKS.guild);
      const v = project(pose, w, h, LANDMARKS.guild.centre);
      assert.ok(Math.abs(v.x) < 0.8 && Math.abs(v.y) < 0.85, `${w}x${h}: framed (${v.x.toFixed(2)}, ${v.y.toFixed(2)})`);
      if (w / h > 1.25) assert.ok(v.x < -0.05, `${w}x${h}: left of centre`);
      else assert.ok(v.y > 0.25, `${w}x${h}: above the sheet (${v.y.toFixed(2)})`);
    }
    assert.equal(computeTerritoryFocusPose('stories', 1440, 900), null);
  });
});

describe('Worlds Beyond content (M7, DEC-032)', () => {
  it('names the six interests; only built territories with content open', () => {
    assert.deepEqual(TERRITORIES.map((t) => t.title), ['Anime & Manga', 'Story-driven Games', 'Formula 1', 'Gaming & Content Creation', 'The Guild', 'The Training Grounds']);
    assert.deepEqual(openTerritories().map((t) => t.id), ['guild']);
    assert.equal(hasContent(territoryById('stories')), false, 'Story-driven Games has no text yet');
  });

  it("uses the owner's words and the CV, and nothing invented", () => {
    const text = JSON.stringify(TERRITORIES);
    for (const owner of ['One Piece', "It's not over until it's over", 'Max Verstappen', 'Void Ronin', 'void_ronin.exe', '50+ members', 'CosCon 2.0', 'Spooky Nights 2.0', 'A king never gives up.', 'Co-CEO'])
      assert.ok(text.includes(owner), owner);
    assert.ok(!/amarok/i.test(text), 'not Amarok (renamed)');
    assert.ok(!/\bCEO\b/.test(text.replace(/Co-CEO/g, '')), 'Co-CEO only');
    const guild = territoryById('guild');
    assert.deepEqual(guild.sections.map((s) => s.heading), ['Hall', 'Chronicle', 'Assembly', 'Stage']);
    for (const t of TERRITORIES) for (const l of t.links) assert.ok(l.href.startsWith('https://'));
  });
});

describe('Worlds Beyond state (M7)', () => {
  it('opens only at the idle Convergence; navigation clears it', () => {
    const store = createExperienceStore('worlds-beyond');
    store.openBeyond('guild');
    assert.equal(store.getSnapshot().beyondTerritory, 'guild');
    store.openBeyond(null);
    assert.equal(store.getSnapshot().beyondTerritory, null);
    store.openBeyond('guild');
    store.navigateTo('horizon');
    assert.equal(store.getSnapshot().beyondTerritory, null);
    const path = createExperienceStore('path-of-ascension');
    path.openBeyond('guild');
    assert.equal(path.getSnapshot().beyondTerritory, null);
  });
});
