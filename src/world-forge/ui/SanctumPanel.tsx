import { useRef } from 'react';
import { isDisplayable } from '../content/projects';
import { isSanctumView, SANCTUM_CONTENT, SANCTUM_IDENTITY, SANCTUM_VIEWS, type SanctumAction, type SanctumViewId } from '../content/sanctum';
import { useExperienceSnapshot, useExperienceStore } from '../experience/ExperienceContext';
import FocusPanel from './FocusPanel';

/**
 * The Origin Sanctum's screen-space UI (M6.1, DEC-026). When the camera has settled at the
 * Sanctum, a small card shows who this is, with **About** (the overview, reachable without
 * visiting any fragment) and the three identity fragments. Choosing one opens the Sanctum
 * panel on that view; a fragment also brightens and draws the camera a little toward it.
 * Everything works by keyboard and touch; clicking the fragments in 3D is optional.
 */
export default function SanctumPanel() {
  const store = useExperienceStore();
  const { currentRegion, phase, sanctumView } = useExperienceSnapshot();
  // Which card button opened the panel (the card re-renders, so remember the view, not the element).
  const opener = useRef<SanctumViewId | null>(null);
  const atSanctum = currentRegion === 'origin-sanctum' && phase === 'idle';

  const focusLater = (selector: string, fallback = '.wf-nav-toggle') =>
    requestAnimationFrame(() => (document.querySelector<HTMLElement>(selector) ?? document.querySelector<HTMLElement>(fallback))?.focus());

  const open = (view: SanctumViewId) => {
    opener.current = view;
    store.openSanctum(view);
  };
  const close = () => {
    const view = opener.current;
    opener.current = null;
    store.openSanctum(null);
    // Back to the card button that opened it; if a fragment was clicked in 3D, the region toggle.
    focusLater(view ? `.wf-sanctum-card button[data-view="${view}"]` : '.wf-nav-toggle');
  };
  const travel = (action: Extract<SanctumAction, { kind: 'travel' }>) => {
    opener.current = null;
    store.navigateTo(action.region);
    focusLater('.wf-nav-toggle');
  };

  const view = isSanctumView(sanctumView) ? sanctumView : null;
  return (
    <>
      {atSanctum && !sanctumView && (
        <section className="wf-sanctum-card" aria-label="The Origin Sanctum">
          <p className="wf-sanctum-name">{SANCTUM_IDENTITY.name.value}</p>
          <p className="wf-sanctum-identity">{SANCTUM_IDENTITY.identity.value}</p>
          <p className="wf-sanctum-mission">{SANCTUM_IDENTITY.mission.value}</p>
          <ul className="wf-sanctum-views">
            {SANCTUM_VIEWS.map((id) => (
              <li key={id}>
                <button type="button" data-view={id} className={id === 'overview' ? 'wf-sanctum-about' : undefined} onClick={() => open(id)}>
                  {SANCTUM_CONTENT[id].short}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
      {view && <SanctumView view={view} onClose={close} onTravel={travel} />}
    </>
  );
}

function SanctumView({ view, onClose, onTravel }: { view: SanctumViewId; onClose: () => void; onTravel: (action: Extract<SanctumAction, { kind: 'travel' }>) => void }) {
  const store = useExperienceStore();
  const content = SANCTUM_CONTENT[view];
  const index = SANCTUM_VIEWS.indexOf(view);
  const at = (offset: number) => SANCTUM_VIEWS[(index + offset + SANCTUM_VIEWS.length) % SANCTUM_VIEWS.length];
  const entries = content.entries.filter((e) => isDisplayable(e.field));

  return (
    <FocusPanel
      className="wf-dossier--sanctum"
      viewKey={view}
      count={`${String(index + 1).padStart(2, '0')} / ${String(SANCTUM_VIEWS.length).padStart(2, '0')}`}
      title={content.title}
      closeLabel="Close and return to the Sanctum"
      onClose={onClose}
      step={{
        onStep: (offset) => store.openSanctum(at(offset)),
        previousLabel: `Previous: ${SANCTUM_CONTENT[at(-1)].title}`,
        nextLabel: `Next: ${SANCTUM_CONTENT[at(1)].title}`,
        enabled: true,
      }}
    >
      {view === 'overview' && <p className="wf-dossier-meta">{SANCTUM_IDENTITY.identity.value}</p>}
      {view !== 'overview' && <p className="wf-dossier-meta">The Origin Sanctum</p>}
      {content.quote && isDisplayable(content.quote) && view === 'explorer' && <blockquote className="wf-sanctum-quote">{content.quote.value}</blockquote>}
      {entries.map((e, i) => (
        <p key={i} className="wf-sanctum-entry">
          {e.label && <span className="wf-sanctum-label">{e.label}</span>}
          {e.field.value}
        </p>
      ))}
      {content.quote && isDisplayable(content.quote) && view !== 'explorer' && <blockquote className="wf-sanctum-quote">{content.quote.value}</blockquote>}
      {content.actions.length > 0 && (
        <ul className="wf-dossier-links wf-sanctum-actions">
          {content.actions.map((action) => (
            <li key={action.label}>
              {action.kind === 'link' ? (
                <a href={action.href} target="_blank" rel="noreferrer">
                  {action.label}
                  <span className="wf-sr-only"> (opens in a new tab)</span>
                  <span aria-hidden="true"> ↗</span>
                </a>
              ) : (
                <button type="button" onClick={() => onTravel(action)}>
                  {action.label} <span aria-hidden="true">→</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </FocusPanel>
  );
}
