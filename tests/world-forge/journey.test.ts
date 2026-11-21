import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  createJourneyState,
  destinationStop,
  navigateJourney,
  scrollJourney,
  settleStop,
  stepJourney,
  type JourneyConfig,
  type JourneyState,
} from '../../src/world-forge/experience/journey.ts';

const config: JourneyConfig = {
  stopCount: 7,
  followRate: 3.2,
  maxScrollSpeed: 1.1,
  settleDelay: 0.32,
  settleThreshold: 0.15,
  navigationBase: 1.3,
  navigationPerStop: 0.35,
  navigationMax: 3,
};

/** Run the model at 60 fps until idle (or a time limit). */
function runUntilIdle(start: JourneyState, limit = 20): { state: JourneyState; seconds: number } {
  let state = start;
  let seconds = 0;
  while (state.phase !== 'idle' && seconds < limit) {
    state = stepJourney(state, 1 / 60, config);
    seconds += 1 / 60;
  }
  return { state, seconds };
}

describe('journey model', () => {
  it('starts idle at the requested stop', () => {
    const state = createJourneyState();
    assert.equal(state.position, 0);
    assert.equal(state.phase, 'idle');
  });

  it('scroll down advances and settles on the next stop', () => {
    const { state } = runUntilIdle(scrollJourney(createJourneyState(), 0.4, config));
    assert.equal(state.position, 1);
    assert.equal(state.phase, 'idle');
  });

  it('scroll up reverses', () => {
    const { state } = runUntilIdle(scrollJourney(createJourneyState(3), -0.4, config));
    assert.equal(state.position, 2);
  });

  it('a tiny scroll falls back to the stop it started from', () => {
    const { state } = runUntilIdle(scrollJourney(createJourneyState(2), 0.05, config));
    assert.equal(state.position, 2);
  });

  it('never leaves the route at either end', () => {
    assert.equal(runUntilIdle(scrollJourney(createJourneyState(0), -5, config)).state.position, 0);
    assert.equal(runUntilIdle(scrollJourney(createJourneyState(6), 5, config)).state.position, 6);
  });

  it('is deterministic for identical input', () => {
    const run = () => {
      let s = createJourneyState();
      for (let i = 0; i < 30; i++) {
        s = scrollJourney(s, 0.07, config);
        s = stepJourney(s, 1 / 60, config);
      }
      return runUntilIdle(s).state.position;
    };
    assert.equal(run(), run());
  });

  it('a large scroll burst compresses travel but respects the speed limit', () => {
    let state = scrollJourney(createJourneyState(), 4, config);
    let previous = state.position;
    for (let i = 0; i < 1200 && state.phase !== 'idle'; i++) {
      state = stepJourney(state, 1 / 60, config);
      assert.ok(Math.abs(state.position - previous) <= config.maxScrollSpeed / 60 + 1e-9);
      previous = state.position;
    }
    assert.equal(state.position, 4);
  });

  it('settles direction-biased and deterministically', () => {
    assert.equal(settleStop(1.2, 1, config), 2);
    assert.equal(settleStop(1.1, 1, config), 1);
    assert.equal(settleStop(1.8, -1, config), 1);
    assert.equal(settleStop(1.9, -1, config), 2);
    assert.equal(settleStop(1.4, 0, config), 1);
  });

  it('direct navigation reaches the exact stop and goes idle', () => {
    const { state, seconds } = runUntilIdle(navigateJourney(createJourneyState(), 6, config));
    assert.equal(state.position, 6);
    assert.equal(state.phase, 'idle');
    assert.ok(seconds <= config.navigationMax + 0.05, 'no prolonged movement');
  });

  it('direct navigation interrupts scroll and ignores scroll while running', () => {
    let state = scrollJourney(createJourneyState(), 0.8, config);
    state = stepJourney(state, 0.1, config);
    state = navigateJourney(state, 4, config);
    assert.equal(state.phase, 'navigating');
    assert.equal(scrollJourney(state, -3, config), state, 'scroll is ignored during navigation');
    assert.equal(runUntilIdle(state).state.position, 4);
  });

  it('a newer navigation replaces an older one from the current position (no stale overwrite)', () => {
    let state = navigateJourney(createJourneyState(), 6, config);
    for (let i = 0; i < 30; i++) state = stepJourney(state, 1 / 60, config);
    const mid = state.position;
    const firstId = state.navigation?.id;
    state = navigateJourney(state, 1, config);
    assert.notEqual(state.navigation?.id, firstId);
    assert.equal(state.navigation?.from, mid, 'reversal starts from where the camera is');
    assert.equal(destinationStop(state, config), 1);
    assert.equal(runUntilIdle(state).state.position, 1);
  });

  it('navigation motion is monotonic (no overshoot or shake)', () => {
    let state = navigateJourney(createJourneyState(), 3, config);
    let previous = state.position;
    while (state.phase !== 'idle') {
      state = stepJourney(state, 1 / 60, config);
      assert.ok(state.position >= previous - 1e-12);
      assert.ok(state.position <= 3 + 1e-12);
      previous = state.position;
    }
  });

  it('clamps huge or invalid time steps', () => {
    const start = navigateJourney(createJourneyState(), 6, config);
    assert.ok(stepJourney(start, 60, config).position < 1, 'a stalled tab does not teleport the camera');
    assert.equal(stepJourney(start, Number.NaN, config), start);
  });

  it('navigating to the current stop while idle is a no-op', () => {
    const state = createJourneyState(2);
    assert.equal(navigateJourney(state, 2, config), state);
  });
});
