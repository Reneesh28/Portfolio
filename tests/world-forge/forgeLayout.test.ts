import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_FLIGHTS,
  apothem,
  FORGE_YAW,
  FORGE_YAW_DEG,
  flightSteps,
  forgeQuality,
  MONUMENT_RING,
  ORBIT_FRAGMENTS,
  PLINTH_SITES,
  polar,
  STAIRS,
  TIERS,
  toLocal,
  toWorld,
  type Vec3,
} from '../../src/world-forge/regions/forge/forgeLayout.ts';
import { REFERENCE_YAW } from '../../src/world-forge/regions/void/layout.ts';
import { FORGE_WARD } from '../../src/world-forge/data/worldGeography.ts';

const DEG = Math.PI / 180;
/** Largest projection of a local [x, z] point onto the octagon's face normals (≤ apothem ⇔ inside). */
const octagonExtent = (x: number, z: number) =>
  Math.max(...Array.from({ length: 8 }, (_, k) => {
    const b = (22.5 + k * 45) * DEG;
    return x * Math.sin(b) + z * Math.cos(b);
  }));
const worldBearingOf = (localBearing: number) => localBearing + FORGE_YAW_DEG;
const wrap = (deg: number) => ((((deg + 180) % 360) + 360) % 360) - 180;

describe('forge layout', () => {
  it('keeps the approved orientation and converts frames both ways', () => {
    assert.equal(FORGE_YAW, REFERENCE_YAW);
    const p: Vec3 = [12.5, 3, -40];
    const back = toLocal(toWorld(p));
    p.forEach((v, i) => assert.ok(Math.abs(v - back[i]) < 1e-9));
    // Local bearing b maps to world bearing b + yaw.
    const [lx, lz] = polar(30, 10);
    const w = toWorld([lx, 0, lz]);
    assert.ok(Math.abs(Math.atan2(w[0], w[2]) / DEG - worldBearingOf(30)) < 1e-9);
  });

  it('keeps the approved silhouette envelope for the tiers', () => {
    assert.deepEqual(TIERS.map((t) => [t.bottomRadius, t.topRadius, t.bottom, t.top]), [
      [32, 26, 0, 6],
      [20, 17, 6, 11],
      [13.5, 11, 11, 16],
    ]);
  });

  it('turns the grand stair toward the Void and the east stair toward the Archive avenue', () => {
    // The Void lies due south of the Forge (world bearing 0°).
    assert.ok(Math.abs(wrap(worldBearingOf(STAIRS.south[0].bearing))) < 15);
    // The forge-archive route starts at world [46, 0, -14].
    const archive = Math.atan2(46, -14) / DEG;
    assert.ok(Math.abs(wrap(worldBearingOf(STAIRS.east[0].bearing) - archive)) < 25);
  });

  it('builds every flight from a walkable surface up to the next tier top, with solid even steps', () => {
    const tops = new Set([0, ...TIERS.map((t) => t.top)]);
    for (const flight of ALL_FLIGHTS) {
      assert.ok(tops.has(flight.bottom) && tops.has(flight.top), 'flight joins walkable levels');
      const tier = TIERS.find((t) => t.top === flight.top);
      assert.ok(tier);
      assert.ok(flight.from > apothem(tier.bottomRadius), 'flight starts outside the tier wall');
      assert.ok(Math.abs(flight.to - apothem(tier.topRadius)) < 1e-9, 'flight ends at the tier top edge');
      const steps = flightSteps(flight);
      assert.equal(steps.length, flight.steps);
      steps.forEach((step, i) => {
        const top = step.position[1] + step.size[1] / 2;
        const bottom = step.position[1] - step.size[1] / 2;
        assert.ok(Math.abs(bottom - flight.bottom) < 1e-9, 'each step block stands on the flight base (no floating slabs)');
        assert.ok(Math.abs(top - (flight.bottom + ((i + 1) * (flight.top - flight.bottom)) / flight.steps)) < 1e-9);
      });
      const rise = (flight.top - flight.bottom) / flight.steps;
      const run = (flight.from - flight.to) / flight.steps;
      assert.ok(rise <= 0.55 && run >= 0.4, `comfortable monumental steps (rise ${rise.toFixed(2)}, run ${run.toFixed(2)})`);
    }
  });

  it('reserves 7 plinth sites on the T1 ring, clear of the stairs, the T2 wall and each other', () => {
    assert.equal(PLINTH_SITES.length, 7);
    const half = MONUMENT_RING.plinthSize[0] / 2;
    const corner = half * Math.SQRT2;
    for (const site of PLINTH_SITES) {
      const [x, y, z] = site.position;
      assert.equal(y, TIERS[0].top);
      assert.ok(octagonExtent(x, z) + corner < apothem(TIERS[0].topRadius), `${site.id} stays on the T1 top`);
      assert.ok(Math.hypot(x, z) - corner > TIERS[1].bottomRadius, `${site.id} clears the T2 wall`);
      for (const flight of ALL_FLIGHTS) {
        const along = x * Math.sin(flight.bearing * DEG) + z * Math.cos(flight.bearing * DEG);
        const lateral = Math.abs(x * Math.cos(flight.bearing * DEG) - z * Math.sin(flight.bearing * DEG));
        if (along < 0) continue;
        assert.ok(lateral > flight.width / 2 + corner + 0.5, `${site.id} clears the ${flight.bearing}° stair`);
      }
    }
    for (let i = 0; i < PLINTH_SITES.length; i++) {
      for (let j = i + 1; j < PLINTH_SITES.length; j++) {
        const [ax, , az] = PLINTH_SITES[i].position;
        const [bx, , bz] = PLINTH_SITES[j].position;
        assert.ok(Math.hypot(ax - bx, az - bz) > 2 * corner + 1, 'plinths keep a walkable gap');
      }
    }
  });

  it('keeps the whole centrepiece inside the Forge ward', () => {
    for (const step of ALL_FLIGHTS.flatMap(flightSteps)) {
      assert.ok(Math.hypot(step.position[0], step.position[2]) + step.size[0] < FORGE_WARD.radius);
    }
  });

  it('limits the orbit to five fragments at crown height, and three on the low-power tier', () => {
    assert.ok(ORBIT_FRAGMENTS.length <= 5);
    for (const f of ORBIT_FRAGMENTS) {
      assert.ok(f.distance >= 14 && f.distance <= 20 && f.y >= 38 && f.y <= 52);
    }
    assert.deepEqual(forgeQuality(1440, 900), { fragments: 5, embers: 320 });
    assert.equal(forgeQuality(390, 844).fragments, 3);
  });
});
