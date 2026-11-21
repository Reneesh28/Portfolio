import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PerspectiveCamera, Vector3 } from 'three';
import { approach, computeProjectFocusPose, easeFocus, FOCUS_MOTION, focusGlideLift } from '../../src/world-forge/camera/cameraTargets.ts';
import { builtProjects, isDisplayable, PROJECTS, projectById } from '../../src/world-forge/content/projects.ts';
import { PLINTH, PLINTH_SITES, PROJECTS_TERRACE } from '../../src/world-forge/regions/forge/hubLayout.ts';
import { buildTerrace } from '../../src/world-forge/regions/forge/monumentGeometry.ts';

describe('project content (M5, doc 11 rules)', () => {
  it('has 8 projects, one per Projects-terrace plinth, featured works in the centre', () => {
    assert.equal(PROJECTS.length, 8);
    assert.deepEqual([...PROJECTS.map((p) => p.plinth)].sort(), [0, 1, 2, 3, 4, 5, 6, 7]);
    for (const p of PROJECTS.filter((x) => x.featured)) assert.ok(p.plinth >= 2 && p.plinth <= 4, `${p.id} on a central plinth`);
    assert.ok(projectById('chronoshift'), 'Chronoshift is included (DEC-013)');
  });

  it('never shows conflicting, unconfirmed or missing content', () => {
    const neuro = projectById('neuroplay');
    assert.ok(neuro);
    assert.equal(isDisplayable(neuro.overview), false, 'NeuroPlay description conflicts with the CV');
    assert.equal(isDisplayable(neuro.tech), false);
    assert.equal(isDisplayable(neuro.status), false);
    const aetherion = projectById('aetherion');
    assert.equal(aetherion && isDisplayable(aetherion.tech), false, 'AETHERION tech list awaits the owner');
    const chrono = projectById('chronoshift');
    assert.ok(chrono && [chrono.category, chrono.status, chrono.overview, chrono.tech, chrono.links].every((f) => !isDisplayable(f)), 'nothing invented for Chronoshift');
    for (const p of PROJECTS) {
      for (const f of [p.category, p.status, p.overview, p.tech, p.links]) {
        if (isDisplayable(f)) assert.ok(f.status === 'owner' || f.status === 'repo', `${p.id}: only owner or published repo text`);
      }
    }
  });

  it('uses no pictures (DEC-015) and only secure external links', () => {
    for (const p of PROJECTS) {
      assert.equal('image' in p, false, `${p.id} has no picture`);
      for (const link of p.links.value) assert.ok(link.href.startsWith('https://'), `${p.id}: ${link.href}`);
    }
  });

  it('stands all 8 monuments on the terrace in plinth order (M5.5)', () => {
    assert.deepEqual(builtProjects().map((p) => p.plinth), [0, 1, 2, 3, 4, 5, 6, 7]);
  });
});

describe('project focus view (M5)', () => {
  const view = (id: string, w: number, h: number) => {
    const pose = computeProjectFocusPose(id, w, h);
    assert.ok(pose);
    const camera = new PerspectiveCamera(pose.fov, w / h, 0.1, 9000);
    camera.position.fromArray(pose.position);
    camera.lookAt(new Vector3().fromArray(pose.target));
    camera.updateMatrixWorld();
    return { pose, camera };
  };

  for (const project of PROJECTS) it(`frames ${project.name} left of centre on wide screens (dossier on the right) and centred on narrow ones`, () => {
    const [x, y, z] = PLINTH_SITES[project.plinth].position;
    const base = new Vector3(x, y + PLINTH.size[1], z);
    const top = new Vector3(x, y + PLINTH.size[1] + 10, z);
    const wide = view(project.id, 1440, 900);
    const b = base.clone().project(wide.camera);
    const t = top.clone().project(wide.camera);
    assert.ok(b.x < -0.05 && t.x < -0.05 && b.x > -0.9, `wide: monument left of centre (x ${b.x.toFixed(2)})`);
    assert.ok(Math.abs(b.y) < 1 && Math.abs(t.y) < 1, 'wide: base and emblem top in frame');
    const narrow = view(project.id, 390, 844);
    const nb = base.clone().project(narrow.camera);
    const nt = top.clone().project(narrow.camera);
    assert.ok(Math.abs(nb.x) < 0.2 && nt.y < 1 && nb.y > -1, `narrow: centred and in frame (x ${nb.x.toFixed(2)})`);
    // The narrow view keeps the monument in the upper part, above the dossier sheet (bottom 58%).
    assert.ok(nb.y > -0.2, `narrow: monument base above the sheet (y ${nb.y.toFixed(2)})`);
  });

  it('places the focus camera above the terrace and clear of the plinths', () => {
    for (const { id } of PROJECTS) {
      const { pose } = view(id, 1440, 900);
      assert.ok(pose.position[1] > PROJECTS_TERRACE.height + PLINTH.size[1] + 3);
      for (const site of PLINTH_SITES) {
        assert.ok(Math.hypot(pose.position[0] - site.position[0], pose.position[2] - site.position[2]) > 4, 'camera not inside a monument');
      }
    }
    assert.equal(computeProjectFocusPose('unknown', 1440, 900), null);
  });
});

describe('switching works (M5.6 glide)', () => {
  const works = builtProjects();
  // Each monument as a vertical segment from the plinth top to just above its emblem (its baked height).
  const monuments = buildTerrace(works).monuments.map((m) => ({ x: m.base[0], z: m.base[2], bottom: m.base[1], top: m.base[1] + m.top + 0.5 }));
  const clearance = (p: Vector3) =>
    Math.min(
      ...monuments.map((m) => {
        const dy = p.y < m.bottom ? m.bottom - p.y : p.y > m.top ? p.y - m.top : 0;
        return Math.hypot(p.x - m.x, p.z - m.z, dy);
      }),
    );

  it('holds the focus blend steady once focused (no frame-to-frame flicker)', () => {
    let blend = 0;
    const seen: number[] = [];
    for (let frame = 0; frame < 120; frame++) seen.push((blend = approach(blend, 1, 0.25 / FOCUS_MOTION.openSeconds)));
    assert.equal(blend, 1);
    assert.ok(seen.slice(seen.indexOf(1)).every((b) => b === 1), 'stays at 1 after arriving');
    assert.equal(approach(0, 0, 0.3), 0);
    assert.equal(approach(0.75, 0, 0.25), 0.5);
  });

  it('lifts the camera only mid-glide, by a capped amount', () => {
    assert.equal(focusGlideLift(0, 50), 0);
    assert.ok(Math.abs(focusGlideLift(1, 50)) < 1e-9);
    assert.equal(focusGlideLift(0.5, 1000), FOCUS_MOTION.maxLift);
    assert.ok(focusGlideLift(0.5, 10) < FOCUS_MOTION.maxLift);
  });

  for (const [w, h] of [[1440, 900], [390, 844]]) {
    it(`glides between every pair of neighbouring works without passing through a monument (${w}×${h})`, () => {
      works.forEach((work, i) => {
        const next = works[(i + 1) % works.length];
        const a = computeProjectFocusPose(work.id, w, h);
        const b = computeProjectFocusPose(next.id, w, h);
        assert.ok(a && b);
        const from = new Vector3().fromArray(a.position);
        const to = new Vector3().fromArray(b.position);
        const distance = from.distanceTo(to);
        for (let s = 0; s <= 40; s++) {
          const t = s / 40;
          const p = new Vector3().lerpVectors(from, to, easeFocus(t));
          p.y += focusGlideLift(t, distance);
          assert.ok(clearance(p) > 4, `${work.id} → ${next.id} at t=${t.toFixed(2)}: clearance ${clearance(p).toFixed(1)}`);
        }
      });
    });
  }
});
