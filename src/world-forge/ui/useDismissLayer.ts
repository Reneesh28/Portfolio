import { useEffect, useLayoutEffect, useRef } from 'react';

/**
 * Stack of open dismissible layers (menus, panels). Escape always closes only the
 * topmost one, wherever focus is. One shared document listener, added while any
 * layer is open and removed when the last closes.
 */
const layers: Array<{ dismiss: () => void }> = [];

function onKeyDown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || layers.length === 0 || event.defaultPrevented) return;
  event.preventDefault();
  layers[layers.length - 1].dismiss();
}

/** Registers a dismissible layer while `open` is true. */
export function useDismissLayer(open: boolean, onDismiss: () => void): void {
  const latest = useRef(onDismiss);
  useLayoutEffect(() => {
    latest.current = onDismiss;
  });

  useEffect(() => {
    if (!open) return;
    const layer = { dismiss: () => latest.current() };
    layers.push(layer);
    if (layers.length === 1) document.addEventListener('keydown', onKeyDown);
    return () => {
      const index = layers.indexOf(layer);
      if (index >= 0) layers.splice(index, 1);
      if (layers.length === 0) document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);
}
