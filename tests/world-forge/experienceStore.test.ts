import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createExperienceStore, JOURNEY_CONFIG, type ExperienceStore } from '../../src/world-forge/experience/experienceStore.ts';
import { JOURNEY_ROUTE } from '../../src/world-forge/experience/route.ts';

function settle(store: ExperienceStore): number {
  let seconds = 0;
  while (store.getJourney().phase !== 'idle' && seconds < 20) {
    store.advance(1 / 60);
    seconds += 1 / 60;
  }
  return seconds;
}

describe('experience store', () => {
  it('route follows the locked region order', () => {
    assert.deepEqual(
      JOURNEY_ROUTE.map((r) => r.id),
      ['void', 'origin-sanctum', 'world-forge', 'blueprint-archive', 'path-of-ascension', 'worlds-beyond', 'horizon'],
    );
    assert.equal(JOURNEY_CONFIG.stopCount, 7);
  });

  it('starts at the Void', () => {
    assert.deepEqual(createExperienceStore().getSnapshot(), {
      currentRegion: 'void',
      destinationRegion: 'void',
      phase: 'idle',
      reducedMotion: false,
    });
  });

  it('tracks current region and destination during navigation', () => {
    const store = createExperienceStore();
    store.navigateTo('blueprint-archive');
    assert.equal(store.getSnapshot().destinationRegion, 'blueprint-archive');
    assert.equal(store.getSnapshot().phase, 'navigating');
    settle(store);
    assert.equal(store.getSnapshot().currentRegion, 'blueprint-archive');
    assert.equal(store.getSnapshot().phase, 'idle');
  });

  it('snapshot is referentially stable and only notifies on discrete changes', () => {
    const store = createExperienceStore();
    let notifications = 0;
    store.subscribe(() => notifications++);
    const before = store.getSnapshot();
    store.advance(1 / 60);
    assert.equal(store.getSnapshot(), before, 'idle advance does not churn the snapshot');
    store.navigateTo('origin-sanctum');
    const during = notifications;
    store.advance(1 / 60);
    store.advance(1 / 60);
    assert.equal(notifications, during, 'per-frame motion does not notify');
    settle(store);
    assert.ok(notifications > during);
  });

  it('stepRegion chains from the destination, not the camera position', () => {
    const store = createExperienceStore();
    store.stepRegion(1);
    store.stepRegion(1);
    assert.equal(store.getSnapshot().destinationRegion, 'world-forge');
    store.stepRegion(-1);
    store.stepRegion(-1);
    store.stepRegion(-1);
    assert.equal(store.getSnapshot().destinationRegion, 'void', 'clamped at the start');
  });

  it('wakes the renderer when motion starts', () => {
    const store = createExperienceStore();
    let wakes = 0;
    store.setWakeHandler(() => wakes++);
    store.scroll(0.3);
    assert.ok(wakes > 0);
    store.setWakeHandler(null);
  });

  it('reduced motion shortens transitions', () => {
    const store = createExperienceStore();
    store.setReducedMotion(true);
    assert.equal(store.getSnapshot().reducedMotion, true);
    store.navigateTo('horizon');
    const seconds = settle(store);
    assert.ok(seconds <= 0.4, `reduced-motion travel took ${seconds.toFixed(2)}s`);
    assert.equal(store.getSnapshot().currentRegion, 'horizon');
  });
});

describe('input arbitration', () => {
  it('an open panel blocks scroll but not direct navigation', () => {
    const store = createExperienceStore();
    const release = store.blockScroll();
    assert.equal(store.isScrollBlocked(), true);
    store.scroll(0.8);
    assert.equal(store.getJourney().phase, 'idle', 'scroll ignored while blocked');
    store.navigateTo('world-forge');
    assert.equal(store.getSnapshot().destinationRegion, 'world-forge', 'direct navigation outranks the panel');
    release();
    assert.equal(store.isScrollBlocked(), false);
  });

  it('blocks stack across layers and double release is harmless', () => {
    const store = createExperienceStore();
    const a = store.blockScroll();
    const b = store.blockScroll();
    a();
    a();
    assert.equal(store.isScrollBlocked(), true, 'second layer still blocks');
    b();
    assert.equal(store.isScrollBlocked(), false);
    store.scroll(0.4);
    assert.equal(store.getJourney().phase, 'scrolling');
  });

  it('an in-flight scroll settles to a stop when a panel opens (camera stabilises)', () => {
    const store = createExperienceStore();
    store.scroll(0.3);
    store.advance(1 / 60);
    store.blockScroll();
    store.scroll(3);
    settle(store);
    assert.equal(store.getSnapshot().currentRegion, 'origin-sanctum');
    assert.equal(store.getJourney().phase, 'idle');
  });
});
