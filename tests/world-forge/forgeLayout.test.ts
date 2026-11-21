import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_FLIGHTS,
  apothem,
  buttresses,
  CORE,
  connectionEnds,
  parapetSegments,
  pavePath,
  ROUTE_ENDS,
  stairCheeks,
  CROWN,
  CRUCIBLE,
  pillarRadiusAt,
  rubbleSkirt,
  FORGE_YAW,
  FORGE_YAW_DEG,
  flightSteps,
  forgeQuality,
  MONUMENT_RING,
  ORBIT_FRAGMENTS,
  SENTINELS,
  SENTINEL_BASE_Y,
  PLINTH_SITES,
  polar,
  STAIRS,
  TIERS,
  toLocal,
  toWorld,
  type Vec3,
} from '../../src/world-forge/regions/forge/forgeLayout.ts';
import { REFERENCE_YAW } from '../../src/world-forge/regions/void/layout.ts';
import { createRandom } from '../../src/world-forge/core/random.ts';
import { FORGE_WARD, WORLD_ROUTES } from '../../src/world-forge/data/worldGeography.ts';

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

  it('keeps buttresses and rubble clear of every stair flight', () => {
    const clearOf = (x: number, z: number, margin: number) =>
      ALL_FLIGHTS.every((flight) => {
        const along = x * Math.sin(flight.bearing * DEG) + z * Math.cos(flight.bearing * DEG);
        const lateral = Math.abs(x * Math.cos(flight.bearing * DEG) - z * Math.sin(flight.bearing * DEG));
        return along < 0 || lateral > flight.width / 2 + margin;
      });
    for (const b of buttresses()) {
      const [x, z] = polar(b.bearing, b.distance);
      assert.ok(clearOf(x, z, b.size[0] / 2 + 0.5), `buttress at ${b.bearing}°`);
    }
    for (const r of rubbleSkirt(createRandom(211))) {
      assert.ok(clearOf(r.position[0], r.position[2], 1.6), 'rubble keeps off the stairs');
    }
  });

  it('seats the core coherently: crucible wider than the seam, inside the pillar ring, pillars taper upward', () => {
    assert.ok(CRUCIBLE.topRadius > 1.5 && CRUCIBLE.bottomRadius < CORE.pillarRadius);
    assert.ok(CRUCIBLE.daisTop === TIERS[2].top);
    assert.ok(pillarRadiusAt(-CORE.pillarHeight / 2) === CORE.pillarBottomRadius);
    assert.ok(Math.abs(pillarRadiusAt(CORE.pillarHeight / 2) - CORE.pillarTopRadius) < 1e-9);
  });

  it('leaves deliberate gaps in the crown but keeps stone above every pillar strut', () => {
    const segs = [...CROWN.segments].sort((a, b) => a[0] - b[0]);
    for (let i = 0; i < segs.length; i++) {
      const [start, length] = segs[i];
      const next = segs[(i + 1) % segs.length][0] + (i === segs.length - 1 ? 1 : 0);
      const gap = next - (start + length);
      assert.ok(gap >= 0.015 && gap <= 0.04, `gap after segment ${i}: ${gap.toFixed(3)}`);
    }
    for (const angle of CORE.pillarAngles) {
      const f = angle / (2 * Math.PI);
      const covered = segs.some(([start, length]) => {
        const rel = ((f - start) % 1 + 1) % 1;
        return rel > 0.02 && rel < length - 0.02;
      });
      assert.ok(covered, `pillar at ${f.toFixed(3)} turn has a segment to carry`);
    }
  });

  it('joins the existing M3 route ends exactly, without touching the route data', () => {
    const sanctumRoute = WORLD_ROUTES.find((r) => r.id === 'sanctum-forge');
    const archiveRoute = WORLD_ROUTES.find((r) => r.id === 'forge-archive');
    assert.deepEqual(sanctumRoute?.points.at(-1), ROUTE_ENDS.sanctum);
    assert.deepEqual(archiveRoute?.points[0], ROUTE_ENDS.archive);
    const { sanctum, archive } = connectionEnds();
    const near = (a: [number, number], world: Vec3) => {
      const [x, , z] = toLocal(world);
      return Math.hypot(a[0] - x, a[1] - z) < 1e-9;
    };
    assert.ok(near(sanctum[0], ROUTE_ENDS.sanctum));
    assert.ok(near(archive[1], ROUTE_ENDS.archive));
    // Paving keeps off the foundation: every slab stays outside the T1 base (with the rubble skirt).
    for (const [from, to] of [sanctum, archive]) {
      for (const slab of pavePath(from, to, createRandom(1))) {
        assert.ok(octagonExtent(slab.position[0], slab.position[2]) > apothem(TIERS[0].bottomRadius) + 1.5, 'slab clear of T1');
      }
    }
  });

  it('opens the parapet where each stair arrives, and keeps cheeks clear of the plinths', () => {
    for (const flight of ALL_FLIGHTS.filter((f) => f.top === TIERS[0].top)) {
      for (const wall of parapetSegments()) {
        if (Math.abs(wall.bearing - flight.bearing) > 1e-6) continue;
        const [x, , z] = wall.position;
        const lateral = Math.abs(x * Math.cos(flight.bearing * DEG) - z * Math.sin(flight.bearing * DEG));
        assert.ok(lateral - wall.size[0] / 2 > flight.width / 2 + 0.9, 'parapet leaves the stair (and its cheeks) open');
      }
    }
    const corner = (MONUMENT_RING.plinthSize[0] / 2) * Math.SQRT2;
    for (const cheek of ALL_FLIGHTS.flatMap(stairCheeks)) {
      for (const site of PLINTH_SITES) {
        const d = Math.hypot(cheek.position[0] - site.position[0], cheek.position[2] - site.position[2]);
        assert.ok(d > corner + 0.45 || Math.abs(cheek.position[1] - site.position[1]) > 3, 'cheek clear of plinth');
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
    for (const f of ORBIT_FRAGMENTS) {
      const reach = Math.hypot(...f.size) / 2;
      assert.ok(f.distance - reach > CROWN.radius + CROWN.tube + 1, 'fragment clears the crown');
      const sentinelTop = SENTINEL_BASE_Y + Math.max(...SENTINELS.map((t) => t.height)) + 1.1;
      assert.ok(f.y - reach > sentinelTop + 1, 'fragment orbits above the sentinels');
    }
    assert.deepEqual(forgeQuality(1440, 900), { fragments: 5, embers: 320 });
    assert.equal(forgeQuality(390, 844).fragments, 3);
  });
});
