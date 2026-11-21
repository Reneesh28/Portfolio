import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ISLANDS, REGIONS, WORLD_ROUTES } from '../../src/world-forge/data/worldGeography.ts';
import {
  activationEnvelope,
  CITY,
  CITY_FLOOR,
  GATE,
  GATES,
  HALL,
  HALL_BEARINGS,
  HUB,
  hubQuality,
  PLINTH,
  PLINTH_SITES,
  PROJECTS_TERRACE,
  RINGS,
  TERRACES,
  WATERFALLS,
} from '../../src/world-forge/regions/forge/hubLayout.ts';

const flat = (a: readonly number[], b: readonly number[]) => Math.hypot(a[0] - b[0], a[2] - b[2]);
const angleDiff = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180);
const bearingOf = (p: readonly number[]) => (Math.atan2(p[0], p[2]) * 180) / Math.PI;

describe('World Forge hub (P3, blueprint specs)', () => {
  it('matches the images: ≈ 420 m island, 180 m main platform, ≈ 320 m core, 3 levels', () => {
    assert.equal(HUB.platformRadius * 2, 180);
    assert.ok(CITY_FLOOR + CITY.centralHeight >= 320 && CITY_FLOOR + CITY.centralHeight <= 360);
    assert.equal(TERRACES.length, 3, 'stepped platform up to the city floor');
    for (let i = 1; i < TERRACES.length; i++) {
      assert.ok(TERRACES[i].radius < TERRACES[i - 1].radius && TERRACES[i].bottom === TERRACES[i - 1].top);
    }
    assert.ok(CITY.radius < HUB.platformRadius, 'the city stands on the main platform');
    assert.ok(RINGS.every((r) => r.y > 60 && r.radius > CITY.radius), 'observation rings (level 3) circle the city');
  });

  it('has 7 gates: one facing each region along its golden spoke, plus the Projects gate', () => {
    assert.equal(GATES.length, 7);
    assert.deepEqual(new Set(GATES.map((g) => g.to)), new Set([...REGIONS.filter((r) => r.id !== 'world-forge').map((r) => r.id), 'projects']));
    for (const gate of GATES.filter((g) => g.to !== 'projects')) {
      const spoke = WORLD_ROUTES.find((r) => r.id === `spoke-${gate.to}`);
      assert.ok(spoke, `spoke for ${gate.to}`);
      assert.ok(flat(spoke.from, gate.position) < 1e-6, `${gate.to} spoke starts at its gate`);
    }
    for (const gate of GATES) assert.ok(Math.hypot(gate.position[0], gate.position[2]) + GATE.depth < HUB.islandRadius, `${gate.id} stands on the island`);
    for (let i = 0; i < GATES.length; i++) {
      for (let j = i + 1; j < GATES.length; j++) {
        assert.ok(flat(GATES[i].position, GATES[j].position) > GATE.opening + GATE.pillar * 2 + 10, `${GATES[i].id} and ${GATES[j].id} are apart`);
      }
    }
  });

  it('places archive halls between gates, clear of every gate line and of the Projects terrace', () => {
    for (const b of HALL_BEARINGS) {
      const halfAngle = ((HALL.length / 2 + 6) / HALL.distance) * (180 / Math.PI);
      for (const gate of GATES) assert.ok(angleDiff(b, gate.bearing) > halfAngle, `hall at ${b}° clear of ${gate.id}`);
      assert.ok(angleDiff(b, PROJECTS_TERRACE.bearing) > halfAngle + (PROJECTS_TERRACE.radius / PROJECTS_TERRACE.distance) * (180 / Math.PI));
    }
  });

  it('reserves 8 plinths on the Projects terrace (8 projects incl. Chronoshift), spaced and on the terrace', () => {
    assert.equal(PLINTH_SITES.length, 8);
    const centre = [Math.sin((PROJECTS_TERRACE.bearing * Math.PI) / 180) * PROJECTS_TERRACE.distance, 0, Math.cos((PROJECTS_TERRACE.bearing * Math.PI) / 180) * PROJECTS_TERRACE.distance];
    const corner = (PLINTH.size[0] / 2) * Math.SQRT2;
    for (const site of PLINTH_SITES) {
      assert.ok(flat(site.position, centre) + corner < PROJECTS_TERRACE.radius, `${site.id} on the terrace`);
      assert.equal(site.position[1], PROJECTS_TERRACE.height);
    }
    for (let i = 1; i < PLINTH_SITES.length; i++) assert.ok(flat(PLINTH_SITES[i].position, PLINTH_SITES[i - 1].position) > PLINTH.size[0] + 1.5);
    assert.ok(PROJECTS_TERRACE.distance - PROJECTS_TERRACE.radius > HUB.platformRadius, 'terrace outside the main platform');
    assert.ok(PROJECTS_TERRACE.distance + PROJECTS_TERRACE.radius < HUB.gateRadius - GATE.depth, 'terrace inside the gate ring');
  });

  it('keeps waterfalls on the far side from the arrival, at the island edge', () => {
    const voidBearing = bearingOf(REGIONS.find((r) => r.id === 'void')?.position ?? [0, 0, 1]);
    for (const w of WATERFALLS) assert.ok(angleDiff(w.bearing, voidBearing) > 90);
    assert.ok(ISLANDS.find((i) => i.id === 'forge')?.radius === HUB.islandRadius);
  });

  it('activates once on arrival and scales embers by device', () => {
    assert.equal(activationEnvelope(-1), 0);
    assert.ok(Math.abs(activationEnvelope(0.3) - 1) < 1e-9);
    assert.equal(activationEnvelope(1.2), 0);
    assert.equal(activationEnvelope(Number.NaN), 0);
    assert.ok(hubQuality(390, 844).embers < hubQuality(1440, 900).embers);
  });
});
