import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { forcedTier, GOVERNOR, initialTier, PRESETS, shouldStepDown, stepDown } from '../../src/world-forge/core/quality.ts';
import { REGIONS } from '../../src/world-forge/data/worldGeography.ts';
import { computeMapLayout } from '../../src/world-forge/ui/mapLayout.ts';

describe('quality presets (P5)', () => {
  it('orders the tiers by cost: pixel ratio, glow, clouds, embers', () => {
    assert.ok(PRESETS.high.dpr[1] > PRESETS.medium.dpr[1] && PRESETS.medium.dpr[1] > PRESETS.low.dpr[1]);
    assert.ok(PRESETS.high.bloom && PRESETS.medium.bloom && !PRESETS.low.bloom);
    assert.ok(PRESETS.low.cloudLayers <= PRESETS.medium.cloudLayers && PRESETS.medium.cloudLayers <= PRESETS.high.cloudLayers);
    assert.ok(PRESETS.low.embers < PRESETS.medium.embers && PRESETS.medium.embers < PRESETS.high.embers);
  });

  it('starts from device hints: weak devices low, phones and mid devices medium, others high', () => {
    assert.equal(initialTier({ minSide: 1000, memory: 2, cores: 8, coarse: false }), 'low');
    assert.equal(initialTier({ minSide: 1000, memory: 8, cores: 2, coarse: false }), 'low');
    assert.equal(initialTier({ minSide: 390, memory: 8, cores: 8, coarse: true }), 'medium');
    assert.equal(initialTier({ minSide: 1000, memory: 4, coarse: false }), 'medium');
    assert.equal(initialTier({ minSide: 900, memory: 16, cores: 12, coarse: false }), 'high');
    assert.equal(initialTier({ minSide: 900, coarse: false }), 'high', 'unknown hints default to high (the governor steps down)');
  });

  it('locks a tier from ?quality=, and steps down at most to low', () => {
    assert.equal(forcedTier('?quality=low'), 'low');
    assert.equal(forcedTier('?mode=world&quality=high'), 'high');
    assert.equal(forcedTier('?quality=ultra'), null);
    assert.equal(forcedTier(''), null);
    assert.equal(stepDown('high'), 'medium');
    assert.equal(stepDown('medium'), 'low');
    assert.equal(stepDown('low'), 'low');
  });

  it('steps down only on a sustained slow median, never on a few spikes', () => {
    const smooth = Array.from({ length: 60 }, () => 16.7);
    const spiky = [...smooth.slice(0, 50), ...Array.from({ length: 10 }, () => 120)];
    const slow = Array.from({ length: 60 }, () => 33);
    assert.equal(shouldStepDown(smooth), false);
    assert.equal(shouldStepDown(spiky), false);
    assert.equal(shouldStepDown(slow), true);
    assert.equal(shouldStepDown(slow.slice(0, 10)), false, 'too few frames to judge');
    assert.ok(GOVERNOR.maxSteps <= 2);
  });
});

describe('World Map layout (P5)', () => {
  for (const aspect of [1.25, 0.8]) {
    it(`places every island, route and region inside the map (aspect ${aspect}), north up`, () => {
      const map = computeMapLayout(aspect);
      for (const p of [...map.islands, ...map.regions, ...map.routes.flatMap((r) => [r.from, r.to])]) {
        assert.ok(p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1, `point (${p.x.toFixed(3)}, ${p.y.toFixed(3)}) inside`);
      }
      const at = (id: string) => map.regions.find((r) => r.id === id);
      // The Void lies due south of the hub (lower on the map); the Horizon is west (left).
      assert.ok((at('void')?.y ?? 0) > (at('world-forge')?.y ?? 1));
      assert.ok((at('horizon')?.x ?? 1) < (at('world-forge')?.x ?? 0));
      assert.equal(map.regions.length, REGIONS.length);
    });
  }

  it('keeps true proportions: equal world distances look equal across and down the map', () => {
    const aspect = 1.25;
    const map = computeMapLayout(aspect);
    const forge = map.islands.find((i) => i.id === 'forge');
    const sanctum = map.islands.find((i) => i.id === 'origin-sanctum');
    assert.ok(forge && sanctum);
    // The Sanctum is ≈ 470 m from the hub (radius 210): the map must keep that ratio, measured in width units.
    const mapDistance = Math.hypot(sanctum.x - forge.x, (sanctum.y - forge.y) / aspect);
    assert.ok(Math.abs(mapDistance / forge.r - 470 / 210) < 0.02, `proportions kept (${(mapDistance / forge.r).toFixed(3)})`);
  });
});
