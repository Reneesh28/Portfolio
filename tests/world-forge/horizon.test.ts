import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PerspectiveCamera, Vector3 } from 'three';
import { computeRegionPose } from '../../src/world-forge/camera/cameraTargets.ts';
import { buildHorizon, HORIZON_BUDGET, triangleCount } from '../../src/world-forge/regions/horizon/horizonGeometry.ts';
import { GATE, GATE_AT, gateCentre, HORIZON_MAX_HEIGHT, rimRadius } from '../../src/world-forge/regions/horizon/horizonLayout.ts';
import { AMBITIONS, CLOSING, CONTACT } from '../../src/world-forge/content/horizon.ts';
import { createExperienceStore } from '../../src/world-forge/experience/experienceStore.ts';

const built = buildHorizon();
const project = (pose: { position: number[]; target: number[]; fov: number }, w: number, h: number, point: number[]) => {
  const camera = new PerspectiveCamera(pose.fov, w / h, 0.5, 9000);
  camera.position.fromArray(pose.position);
  camera.lookAt(new Vector3().fromArray(pose.target));
  camera.updateMatrixWorld();
  return new Vector3().fromArray(point).project(camera);
};

describe('Horizon geometry (M8 "The Unfinished Gate")', () => {
  it('stays within the render budget and the height limit', () => {
    const tris = [built.stone, built.lines, built.floating].reduce((n, g) => n + triangleCount(g), 0);
    assert.ok(tris <= HORIZON_BUDGET.triangles, `${tris} triangles`);
    assert.ok(3 - 2 <= HORIZON_BUDGET.drawCalls);
    for (const g of [built.stone, built.lines, built.floating]) {
      g.computeBoundingBox();
      assert.ok(g.boundingBox && g.boundingBox.max.y <= HORIZON_MAX_HEIGHT, `reaches ${g.boundingBox?.max.y.toFixed(1)} m`);
    }
  });

  it('stands the gate on the west edge, inside the rim; its arch is unfinished (stones hang in the gap)', () => {
    assert.ok(-GATE_AT[2] + GATE.post < rimRadius(180), 'the gate stands on the island');
    assert.ok(GATE.built < Math.PI / 2, 'each side of the arch stops short of the crown');
    built.floating.computeBoundingBox();
    const box = built.floating.boundingBox;
    assert.ok(box && box.min.y > GATE.spring && box.max.x < GATE.half && box.min.x > -GATE.half, 'the hanging stones fill the gap, above the posts');
  });
});

describe('Horizon camera (M8)', () => {
  it('on wide screens frames the unfinished gate on the left and the distant Forge on the right', () => {
    for (const [w, h] of [
      [1440, 900],
      [1280, 720],
      [844, 390],
    ]) {
      const pose = computeRegionPose('horizon', w, h);
      const gate = project(pose, w, h, gateCentre());
      const forge = project(pose, w, h, [0, 200, 0]);
      assert.ok(Math.abs(gate.x) < 0.9 && Math.abs(gate.y) < 0.9 && gate.z < 1, `${w}x${h}: gate (${gate.x.toFixed(2)}, ${gate.y.toFixed(2)})`);
      assert.ok(Math.abs(forge.x) < 0.95 && Math.abs(forge.y) < 0.95 && forge.z < 1, `${w}x${h}: Forge (${forge.x.toFixed(2)}, ${forge.y.toFixed(2)})`);
      assert.ok(gate.x < forge.x, 'the gate left of the Forge');
      assert.ok(gate.y < 0.1, `${w}x${h}: the scene sits low, leaving the sky for the closing words`);
    }
  });

  it('on narrow screens frames the gate, low in the frame', () => {
    for (const [w, h] of [
      [390, 844],
      [768, 1024],
      [360, 640],
    ]) {
      const pose = computeRegionPose('horizon', w, h);
      const gate = project(pose, w, h, gateCentre());
      assert.ok(Math.abs(gate.x) < 0.6 && gate.y < 0.1 && gate.y > -0.9 && gate.z < 1, `${w}x${h}: gate (${gate.x.toFixed(2)}, ${gate.y.toFixed(2)})`);
    }
  });
});

describe('Horizon content and contact (M8, DEC-034)', () => {
  it('keeps the closing words exactly', () => {
    assert.equal(CLOSING.headline, 'THE GREATEST CREATION IS STILL AHEAD.');
    assert.deepEqual([...CLOSING.lines], ['Every world begins with an idea.', 'This one is only getting started.']);
  });

  it("shows the master doc's six ambitions as written, and the verified contact details only", () => {
    assert.deepEqual([...AMBITIONS.items], ['AI/ML engineering ambitions', 'Original games', 'Original IP and universes', 'Indie development', 'Content creation', 'Meaningful experiences']);
    assert.deepEqual(CONTACT.map((c) => c.id), ['email', 'github', 'linkedin', 'resume']);
    const text = JSON.stringify(CONTACT);
    assert.ok(text.includes('reneesh3508925@gmail.com') && text.includes('github.com/Reneesh28') && text.includes('linkedin.com/in/balam-reneesh'));
    assert.ok(!/\+91|7569/.test(text), 'no phone number');
    for (const c of CONTACT) if (c.external) assert.ok(c.href.startsWith('https://') || c.href.startsWith('/'));
  });
});

describe('Horizon and contact state (M8)', () => {
  it('opens the ambitions only at the idle Horizon; contact opens anywhere; navigation closes both', () => {
    const store = createExperienceStore('horizon');
    store.openHorizon('ambitions');
    assert.equal(store.getSnapshot().horizonView, 'ambitions');
    store.navigateTo('void');
    assert.equal(store.getSnapshot().horizonView, null);
    const forge = createExperienceStore('world-forge');
    forge.openHorizon('ambitions');
    assert.equal(forge.getSnapshot().horizonView, null, 'refused away from the Horizon');
    forge.openContact(true);
    assert.equal(forge.getSnapshot().contactOpen, true, 'contact from anywhere');
    forge.stepRegion(1);
    assert.equal(forge.getSnapshot().contactOpen, false, 'navigation closes it');
  });
});
