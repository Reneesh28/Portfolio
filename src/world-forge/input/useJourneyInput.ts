import { useEffect, useState, type RefObject } from 'react';
import type { ExperienceStore } from '../experience/experienceStore';
import {
  createScrollInterpreter,
  keyboardStep,
  PIXELS_PER_STOP,
  TOUCH_PIXELS_PER_STOP,
  wheelDeltaPixels,
  type JourneyRequest,
} from './scrollInput';

/** Elements that scroll their own content (e.g. panels) mark themselves with this attribute. */
export const OWN_SCROLL_ATTRIBUTE = 'data-wf-own-scroll';

const ownsScroll = (target: EventTarget | null) =>
  target instanceof Element && target.closest(`[${OWN_SCROLL_ATTRIBUTE}]`) !== null;

const TEXT_ENTRY = 'input, textarea, select, [contenteditable=""], [contenteditable="true"]';
const CONTROL = 'button, a[href], summary, [role="button"], [role="link"]';

/**
 * Wheel, trackpad, touch and keyboard → journey progress. One set of listeners on the World
 * Forge root (no duplicate scroll listeners). Listeners are passive: the page has
 * no document scroll to take over, so nothing is cancelled and nothing is trapped;
 * pinch-zoom (ctrl+wheel / two fingers) is left to the browser. Keyboard travel
 * listens on the document (focus may be on the body) and yields to anything that
 * already handled the key, to text entry and to modifier shortcuts.
 */
export function useJourneyInput(root: RefObject<HTMLElement | null>, store: ExperienceStore, reducedMotion: boolean): void {
  const [interpreter] = useState(() => createScrollInterpreter(reducedMotion));

  useEffect(() => interpreter.setReducedMotion(reducedMotion), [interpreter, reducedMotion]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const apply = (request: JourneyRequest) => {
      // Scroll-originated input (including reduced-motion steps) yields to open panels/menus.
      if (store.isScrollBlocked()) return;
      if (request?.type === 'scroll') store.scroll(request.stops);
      else if (request?.type === 'step') store.stepRegion(request.direction);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || ownsScroll(event.target)) return;
      const pixels = wheelDeltaPixels(event.deltaY, event.deltaMode, window.innerHeight);
      apply(interpreter.input(pixels, PIXELS_PER_STOP, event.timeStamp));
    };

    let touchY: number | null = null;
    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches.length === 1 && !ownsScroll(event.target) ? event.touches[0].clientY : null;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (touchY === null || event.touches.length !== 1) {
        touchY = null;
        return;
      }
      const y = event.touches[0].clientY;
      // Finger moving up = forward, like scrolling down.
      apply(interpreter.input(touchY - y, TOUCH_PIXELS_PER_STOP, event.timeStamp));
      touchY = y;
    };
    const onTouchEnd = () => {
      touchY = null;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || store.isScrollBlocked()) return;
      const target = event.target instanceof Element ? event.target : null;
      const direction = keyboardStep({
        key: event.key,
        shiftKey: event.shiftKey,
        modified: event.ctrlKey || event.altKey || event.metaKey,
        inTextEntry: target?.closest(TEXT_ENTRY) != null,
        onControl: target?.closest(CONTROL) != null,
      });
      if (direction === null) return;
      // The document has no scroll of its own; claim the key so the browser doesn't try.
      event.preventDefault();
      store.stepRegion(direction);
    };

    const passive = { passive: true } as const;
    document.addEventListener('keydown', onKeyDown);
    element.addEventListener('wheel', onWheel, passive);
    element.addEventListener('touchstart', onTouchStart, passive);
    element.addEventListener('touchmove', onTouchMove, passive);
    element.addEventListener('touchend', onTouchEnd, passive);
    element.addEventListener('touchcancel', onTouchEnd, passive);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      element.removeEventListener('wheel', onWheel);
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
      element.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [root, store, interpreter]);
}
