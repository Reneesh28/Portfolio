import { useRef } from 'react';
import { isTerritory, openTerritories, territoryById, type TerritoryId } from '../content/interests';
import { useExperienceSnapshot, useExperienceStore } from '../experience/ExperienceContext';
import FocusPanel from './FocusPanel';

/**
 * The Worlds Beyond's screen-space UI (M7, DEC-032). When the camera has settled at the
 * Convergence, a card lists the territories that can be visited (built, with the owner's
 * content). Choosing one flies the camera to it and opens its panel; "Return to the
 * Convergence" (or ✕, Escape) brings the camera back. Optional by design: scrolling goes on
 * to the Horizon at any time. No collectibles, completion marks or mini-games.
 */
export default function BeyondPanel() {
  const store = useExperienceStore();
  const { currentRegion, phase, beyondTerritory } = useExperienceSnapshot();
  const opener = useRef<TerritoryId | null>(null);
  const atConvergence = currentRegion === 'worlds-beyond' && phase === 'idle';
  const territories = openTerritories();

  const focusLater = (selector: string) =>
    requestAnimationFrame(() => (document.querySelector<HTMLElement>(selector) ?? document.querySelector<HTMLElement>('.wf-nav-toggle'))?.focus());

  const open = (id: TerritoryId) => {
    opener.current = id;
    store.openBeyond(id);
  };
  const back = () => {
    const id = opener.current;
    opener.current = null;
    store.openBeyond(null);
    focusLater(id ? `.wf-beyond-card button[data-territory="${id}"]` : '.wf-nav-toggle');
  };

  const chosen = isTerritory(beyondTerritory) ? beyondTerritory : null;
  return (
    <>
      {atConvergence && !beyondTerritory && territories.length > 0 && (
        <section className="wf-beyond-card" aria-label="The Worlds Beyond: interests">
          <p className="wf-beyond-title">The Worlds Beyond</p>
          <p className="wf-beyond-subtitle">The Convergence · choose a world</p>
          <ul className="wf-beyond-worlds">
            {territories.map((t) => (
              <li key={t.id}>
                <button type="button" data-territory={t.id} aria-label={t.title} onClick={() => open(t.id)}>
                  {t.title}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
      {chosen && <TerritoryView id={chosen} onBack={back} />}
    </>
  );
}

function TerritoryView({ id, onBack }: { id: TerritoryId; onBack: () => void }) {
  const store = useExperienceStore();
  const t = territoryById(id);
  const ids = openTerritories().map((x) => x.id);
  const index = Math.max(0, ids.indexOf(id));
  const at = (offset: number) => ids[(index + offset + ids.length) % ids.length];

  return (
    <FocusPanel
      className="wf-dossier--beyond"
      viewKey={id}
      count={`${String(index + 1).padStart(2, '0')} / ${String(ids.length).padStart(2, '0')}`}
      title={t.title}
      closeLabel="Return to the Convergence"
      onClose={onBack}
      step={{
        onStep: (offset) => store.openBeyond(at(offset)),
        previousLabel: `Previous: ${territoryById(at(-1)).title}`,
        nextLabel: `Next: ${territoryById(at(1)).title}`,
        enabled: ids.length > 1,
      }}
    >
      <p className="wf-dossier-meta">The Worlds Beyond</p>
      {t.quote && <blockquote className="wf-sanctum-quote wf-beyond-quote">{t.quote}</blockquote>}
      {t.sections.map((s, k) => (
        <section key={k}>
          {s.heading && <h3>{s.heading}</h3>}
          {s.lines.length === 1 ? (
            <p>{s.lines[0]}</p>
          ) : (
            <ul className="wf-path-lines">
              {s.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
      {t.links.length > 0 && (
        <ul className="wf-dossier-links">
          {t.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noreferrer">
                {link.label}
                <span className="wf-sr-only"> (opens in a new tab)</span>
                <span aria-hidden="true"> ↗</span>
              </a>
            </li>
          ))}
        </ul>
      )}
      <ul className="wf-dossier-links wf-beyond-actions">
        <li>
          <button type="button" onClick={onBack}>
            <span aria-hidden="true">←</span> Return to the Convergence
          </button>
        </li>
      </ul>
    </FocusPanel>
  );
}
