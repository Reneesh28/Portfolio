import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { useExperienceStore } from '../experience/ExperienceContext';
import { useDismissLayer } from './useDismissLayer';

interface FocusPanelProps {
  /** Identifies the current view: the body re-mounts (cross-fade, scroll to top) and the heading takes focus when it changes. */
  viewKey: string;
  /** Position label in the header, e.g. "05 / 08". */
  count: string;
  title: ReactNode;
  closeLabel: string;
  onClose: () => void;
  /** Previous / next (buttons and ← →). Omitted: no footer. */
  step?: { onStep: (offset: 1 | -1) => void; previousLabel: string; nextLabel: string; enabled: boolean };
  /** Extra class on the root (e.g. a region variant). */
  className?: string;
  children: ReactNode;
}

/**
 * The shared panel shell (M5 dossier, M6.1 Sanctum panel): a dimmed world behind a
 * labelled, modal dialog with a header (position and close), a body that scrolls on its
 * own (never driving the journey), and previous / next. Focus moves to the heading and is
 * trapped inside; Escape closes the topmost layer; scroll travel is blocked while open.
 * Its DOM and classes are the M5 dossier's, so both panels look and behave the same.
 */
export default function FocusPanel({ viewKey, count, title, closeLabel, onClose, step, className, children }: FocusPanelProps) {
  const store = useExperienceStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useDismissLayer(true, onClose);
  useEffect(() => store.blockScroll(), [store]);
  useEffect(() => panelRef.current?.querySelector<HTMLElement>('h2')?.focus(), [viewKey]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (step?.enabled && event.key === 'ArrowRight') step.onStep(1);
    if (step?.enabled && event.key === 'ArrowLeft') step.onStep(-1);
    if (event.key !== 'Tab') return;
    const focusable = [...(panelRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], h2') ?? [])];
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className={className ? `wf-dossier ${className}` : 'wf-dossier'} role="presentation">
      <div className="wf-dossier-scrim" aria-hidden="true" onPointerDown={onClose} />
      <div ref={panelRef} className="wf-dossier-panel" role="dialog" aria-modal="true" aria-labelledby={titleId} onKeyDown={onKeyDown}>
        <header className="wf-dossier-header">
          <span className="wf-dossier-count">{count}</span>
          <button type="button" className="wf-dossier-close" onClick={onClose} aria-label={closeLabel}>
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <div key={viewKey} className="wf-dossier-body" data-wf-own-scroll="">
          <h2 id={titleId} className="wf-dossier-title" tabIndex={-1}>
            {title}
          </h2>
          {children}
        </div>
        {step && (
          <footer className="wf-dossier-footer">
            <button type="button" onClick={() => step.onStep(-1)} disabled={!step.enabled} aria-label={step.previousLabel}>
              ‹ Previous
            </button>
            <button type="button" onClick={() => step.onStep(1)} disabled={!step.enabled} aria-label={step.nextLabel}>
              Next ›
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
