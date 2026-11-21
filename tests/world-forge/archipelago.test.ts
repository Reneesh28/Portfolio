import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CLOUD_LAYERS, HORIZON_BEYOND, ISLANDS, REGIONS, WORLD_ROUTES, WORLDS_BEYOND_TERRITORIES } from '../../src/world-forge/data/worldGeography.ts';

const bearingOf = ([x, , z]: readonly number[]) => ((Math.atan2(x, z) * 180) / Math.PI + 360) % 360;
const flat = (a: readonly number[], b: readonly number[]) => Math.hypot(a[0] - b[0], a[2] - b[2]);

describe('archipelago geography (P2)', () => {
  it('keeps the seven regions in the locked order and names (DEC-011)', () => {
    assert.deepEqual(
      REGIONS.map((r) => [r.index, r.id, r.name]),
      [
        [0, 'void', 'THE VOID'],
        [1, 'origin-sanctum', 'THE ORIGIN SANCTUM'],
        [2, 'world-forge', 'THE WORLD FORGE'],
        [3, 'blueprint-archive', 'THE BLUEPRINT ARCHIVE'],
        [4, 'path-of-ascension', 'THE PATH OF ASCENSION'],
        [5, 'worlds-beyond', 'THE WORLDS BEYOND'],
        [6, 'horizon', 'THE HORIZON'],
      ],
    );
  });

  it('puts the World Forge at the hub and spirals the other regions clockwise from the Void', () => {
    assert.deepEqual(REGIONS.find((r) => r.id === 'world-forge')?.position, [0, 0, 0]);
    const ring = REGIONS.filter((r) => r.id !== 'world-forge').map((r) => bearingOf(r.position));
    for (let i = 1; i < ring.length; i++) assert.ok(ring[i] > ring[i - 1], `bearing ${ring[i]} after ${ring[i - 1]}`);
    const horizon = REGIONS.find((r) => r.id === 'horizon');
    assert.ok(horizon && REGIONS.every((r) => flat(r.position, [0, 0, 0]) <= flat(horizon.position, [0, 0, 0])), 'the Horizon is the farthest region');
  });

  it('keeps every island separate (open sky between them) and every top above the cloud sea', () => {
    const cloudTop = Math.max(...CLOUD_LAYERS);
    for (const island of ISLANDS) {
      assert.ok(island.position[1] - cloudTop >= 50, `${island.id} top clears the clouds`);
      assert.ok(island.depth >= island.radius * 1.5, `${island.id} has deep, spiky hanging rock (blueprint look)`);
    }
    for (let i = 0; i < ISLANDS.length; i++) {
      for (let j = i + 1; j < ISLANDS.length; j++) {
        const a = ISLANDS[i];
        const b = ISLANDS[j];
        assert.ok(flat(a.position, b.position) > a.radius + b.radius + 12, `${a.id} and ${b.id} are separate islands`);
      }
    }
  });

  it('gives the Worlds Beyond a Convergence and six territories, and the Path of Ascension a climb', () => {
    assert.equal(WORLDS_BEYOND_TERRITORIES.length, 6);
    assert.equal(ISLANDS.filter((i) => i.region === 'worlds-beyond').length, 7);
    const climb = ['pa-1', 'pa-2', 'pa-3', 'pa-summit'].map((id) => ISLANDS.find((i) => i.id === id)?.position[1] ?? NaN);
    for (let i = 1; i < climb.length; i++) assert.ok(climb[i] > climb[i - 1], 'each step is higher');
    assert.ok(HORIZON_BEYOND.length >= 3);
  });

  it('links the hub to every region with a golden spoke, and every route ends on an island', () => {
    const spokes = WORLD_ROUTES.filter((r) => r.kind === 'spoke').map((r) => r.id.replace('spoke-', ''));
    assert.deepEqual(new Set(spokes), new Set(REGIONS.filter((r) => r.id !== 'world-forge').map((r) => r.id)));
    const onIsland = (p: readonly number[]) => ISLANDS.some((i) => flat(p, i.position) <= i.radius && Math.abs(p[1] - i.position[1]) < 1);
    for (const route of WORLD_ROUTES) {
      assert.ok(onIsland(route.from) && onIsland(route.to), `${route.id} starts and ends on islands`);
    }
  });

  it('gives the hub the blueprint scale and the Void its own island far to the south', () => {
    const forge = ISLANDS.find((i) => i.id === 'forge');
    const voidIsland = ISLANDS.find((i) => i.id === 'void');
    assert.ok(forge && forge.radius * 2 >= 400 && forge.radius * 2 <= 440, 'hub island ≈ 400–440 m across (images: ≈ 400 m)');
    assert.ok(voidIsland && voidIsland.position[2] - voidIsland.radius > forge.radius + 300, 'open sky between the Void and the hub (the reveal)');
  });
});
