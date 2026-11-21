import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  createScrollInterpreter,
  GESTURE_GAP_MS,
  MAX_EVENT_STOPS,
  PIXELS_PER_STOP,
  keyboardStep,
  wheelDeltaPixels,
} from '../../src/world-forge/input/scrollInput.ts';
import { createExperienceStore } from '../../src/world-forge/experience/experienceStore.ts';

describe('scroll interpretation', () => {
  it('normalises wheel delta modes to pixels', () => {
    assert.equal(wheelDeltaPixels(100, 0, 900), 100);
    assert.equal(wheelDeltaPixels(3, 1, 900), 48);
    assert.equal(wheelDeltaPixels(1, 2, 900), 900);
    assert.equal(wheelDeltaPixels(Number.NaN, 0, 900), 0);
  });

  it('full motion: down advances, up reverses, proportionally', () => {
    const interpreter = createScrollInterpreter(false);
    assert.deepEqual(interpreter.input(100, PIXELS_PER_STOP, 0), { type: 'scroll', stops: 100 / PIXELS_PER_STOP });
    assert.deepEqual(interpreter.input(-100, PIXELS_PER_STOP, 10), { type: 'scroll', stops: -100 / PIXELS_PER_STOP });
  });

  it('caps a single huge event', () => {
    const request = createScrollInterpreter(false).input(100000, PIXELS_PER_STOP, 0);
    assert.deepEqual(request, { type: 'scroll', stops: MAX_EVENT_STOPS });
  });

  it('ignores zero and invalid input', () => {
    const interpreter = createScrollInterpreter(false);
    assert.equal(interpreter.input(0, PIXELS_PER_STOP, 0), null);
    assert.equal(interpreter.input(Number.POSITIVE_INFINITY, PIXELS_PER_STOP, 0), null);
  });

  it('one mouse-wheel notch moves the journey to the next region (settles forward)', () => {
    const store = createExperienceStore();
    const request = createScrollInterpreter(false).input(100, PIXELS_PER_STOP, 0);
    assert.ok(request?.type === 'scroll');
    store.scroll(request.stops);
    for (let i = 0; i < 600 && store.getJourney().phase !== 'idle'; i++) store.advance(1 / 60);
    assert.equal(store.getSnapshot().currentRegion, 'origin-sanctum');
  });

  it('many small trackpad deltas behave like one equivalent wheel scroll', () => {
    const store = createExperienceStore();
    const interpreter = createScrollInterpreter(false);
    for (let i = 0; i < 60; i++) {
      const request = interpreter.input(10, PIXELS_PER_STOP, i * 16);
      if (request?.type === 'scroll') store.scroll(request.stops);
      store.advance(1 / 60);
    }
    for (let i = 0; i < 600 && store.getJourney().phase !== 'idle'; i++) store.advance(1 / 60);
    assert.equal(store.getSnapshot().currentRegion, 'origin-sanctum', '600 px of trackpad = one region');
  });

  it('reduced motion: one gesture = one step, however long the gesture', () => {
    const interpreter = createScrollInterpreter(true);
    const requests = Array.from({ length: 40 }, (_, i) => interpreter.input(30, PIXELS_PER_STOP, i * 16)).filter(Boolean);
    assert.deepEqual(requests, [{ type: 'step', direction: 1 }]);
  });

  it('reduced motion: a new gesture after a pause steps again; reversing steps back', () => {
    const interpreter = createScrollInterpreter(true);
    assert.deepEqual(interpreter.input(100, PIXELS_PER_STOP, 0), { type: 'step', direction: 1 });
    assert.equal(interpreter.input(100, PIXELS_PER_STOP, 50), null);
    assert.deepEqual(interpreter.input(100, PIXELS_PER_STOP, 50 + GESTURE_GAP_MS + 1), { type: 'step', direction: 1 });
    assert.deepEqual(interpreter.input(-100, PIXELS_PER_STOP, 400), { type: 'step', direction: -1 });
  });

  it('reduced motion: tiny nudges below the threshold do nothing', () => {
    assert.equal(createScrollInterpreter(true).input(20, PIXELS_PER_STOP, 0), null);
  });
});

describe('keyboard journey travel', () => {
  const base = { shiftKey: false, modified: false, inTextEntry: false, onControl: false };

  it('PageDown / ArrowDown / Space advance; PageUp / ArrowUp / Shift+Space go back', () => {
    assert.equal(keyboardStep({ ...base, key: 'PageDown' }), 1);
    assert.equal(keyboardStep({ ...base, key: 'ArrowDown' }), 1);
    assert.equal(keyboardStep({ ...base, key: ' ' }), 1);
    assert.equal(keyboardStep({ ...base, key: 'PageUp' }), -1);
    assert.equal(keyboardStep({ ...base, key: 'ArrowUp' }), -1);
    assert.equal(keyboardStep({ ...base, key: ' ', shiftKey: true }), -1);
  });

  it('never steals Space from a focused button or link', () => {
    assert.equal(keyboardStep({ ...base, key: ' ', onControl: true }), null);
    assert.equal(keyboardStep({ ...base, key: 'PageDown', onControl: true }), 1);
  });

  it('ignores shortcuts, text entry and unrelated keys', () => {
    assert.equal(keyboardStep({ ...base, key: 'ArrowDown', modified: true }), null);
    assert.equal(keyboardStep({ ...base, key: 'ArrowDown', inTextEntry: true }), null);
    assert.equal(keyboardStep({ ...base, key: 'Home' }), null);
    assert.equal(keyboardStep({ ...base, key: 'Enter' }), null);
    assert.equal(keyboardStep({ ...base, key: 'Tab' }), null);
  });
});
