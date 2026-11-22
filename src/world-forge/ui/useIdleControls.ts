import { useEffect, useState, type RefObject } from 'react';

/** Seconds of inactivity before the controls fade: desktop, and touch screens (conservative, master doc §9). */
export const IDLE_SECONDS = { pointer: 5, touch: 10 } as const;

/** Anything open that keeps the controls visible (master doc §9: never fade while a panel or menu is open). */
const OPEN_LAYERS = '.wf-dossier, .wf-map, .wf-nav[data-open]';

/**
 * Controls fade after inactivity (master doc §9, DEC-034). Returns true once the visitor has
 * been inactive for a while. It never turns true while:
 * - keyboard navigation is active (any key resets it, and focus inside the experience holds it);
 * - a panel or menu is open (dossier, map, region menu);
 * - an element is focused;
 * - an interaction is underway (`busy`: the journey moving, or anything else the caller marks).
 * Any pointer, touch, wheel or key input brings the controls back at once. Touch screens wait
 * twice as long.
 */
export function useIdleControls(root: RefObject<HTMLElement | null>, busy: boolean): boolean {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const coarse = typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
    const wait = (coarse ? IDLE_SECONDS.touch : IDLE_SECONDS.pointer) * 1000;
    let timer = 0;

    const held = () => {
      if (busy) return true;
      if (element.querySelector(OPEN_LAYERS)) return true;
      const active = document.activeElement;
      return !!active && active !== document.body && element.contains(active);
    };
    const arm = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(function check() {
        if (held()) {
          timer = window.setTimeout(check, wait);
          return;
        }
        setIdle(true);
      }, wait);
    };
    const wake = () => {
      setIdle(false);
      arm();
    };

    const events: Array<keyof DocumentEventMap> = ['pointermove', 'pointerdown', 'wheel', 'keydown', 'touchstart', 'focusin'];
    events.forEach((name) => document.addEventListener(name, wake, { passive: true }));
    arm();
    return () => {
      window.clearTimeout(timer);
      events.forEach((name) => document.removeEventListener(name, wake));
    };
  }, [root, busy]);

  // While anything is underway the controls stay visible.
  return idle && !busy;
}
