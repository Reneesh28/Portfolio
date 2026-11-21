import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { VOID_FADE_STOPS, voidBackdropOpacity } from '../../src/world-forge/atmosphere/voidFade.ts';

describe('Void backdrop to world sky handover', () => {
  it('keeps the approved opening: the glow is fully opaque (and the sky invisible) at the Void stop', () => {
    assert.equal(voidBackdropOpacity(0), 1);
    assert.equal(1 - voidBackdropOpacity(0), 0);
  });

  it('hands over completely within the fade distance and stays handed over', () => {
    assert.equal(voidBackdropOpacity(VOID_FADE_STOPS), 0);
    for (const p of [1, 2.5, 6]) assert.equal(voidBackdropOpacity(p), 0);
  });

  it('eases monotonically, and the glow and sky always sum to one', () => {
    let previous = 1;
    for (let p = 0; p <= VOID_FADE_STOPS; p += 0.01) {
      const glow = voidBackdropOpacity(p);
      assert.ok(glow <= previous + 1e-12);
      assert.ok(Math.abs(glow + (1 - glow) - 1) < 1e-12);
      previous = glow;
    }
    assert.equal(voidBackdropOpacity(-1), 1);
  });
});
