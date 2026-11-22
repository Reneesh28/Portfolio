import { AMBITIONS, CLOSING } from '../content/horizon';
import { useExperienceSnapshot, useExperienceStore } from '../experience/ExperienceContext';
import FocusPanel from './FocusPanel';

/**
 * The Horizon's closing composition (M8, DEC-034). When the camera has settled at the end of
 * the journey, the locked closing words appear, large and quiet, with three choices beneath:
 * the ambitions, "Get in touch" (the contact panel) and "Return to the Void" (start again).
 * No ending animation beyond a short fade (master doc M8: calm ending).
 */
export default function HorizonPanel() {
  const store = useExperienceStore();
  const { currentRegion, phase, horizonView, contactOpen } = useExperienceSnapshot();
  const atHorizon = currentRegion === 'horizon' && phase === 'idle';

  const focusLater = (selector: string) =>
    requestAnimationFrame(() => (document.querySelector<HTMLElement>(selector) ?? document.querySelector<HTMLElement>('.wf-nav-toggle'))?.focus());

  const closeAmbitions = () => {
    store.openHorizon(null);
    focusLater('.wf-closing button[data-action="ambitions"]');
  };

  return (
    <>
      {atHorizon && !horizonView && !contactOpen && (
        <section className="wf-closing" aria-labelledby="wf-closing-title">
          <h2 id="wf-closing-title" className="wf-closing-title">
            {CLOSING.headline}
          </h2>
          {CLOSING.lines.map((line) => (
            <p key={line} className="wf-closing-line">
              {line}
            </p>
          ))}
          <ul className="wf-closing-actions">
            <li>
              <button type="button" data-action="ambitions" onClick={() => store.openHorizon('ambitions')}>
                Ambitions
              </button>
            </li>
            <li>
              <button type="button" data-action="contact" className="wf-closing-primary" onClick={() => store.openContact(true)}>
                Get in touch
              </button>
            </li>
            <li>
              <button type="button" data-action="restart" onClick={() => store.navigateTo('void')}>
                Return to the Void
              </button>
            </li>
          </ul>
        </section>
      )}
      {horizonView === 'ambitions' && (
        <FocusPanel className="wf-dossier--horizon" viewKey="ambitions" count="The Horizon" title="Ambitions" closeLabel="Close and return to the Horizon" onClose={closeAmbitions}>
          <p className="wf-dossier-meta">The Horizon</p>
          <ul className="wf-path-lines">
            {AMBITIONS.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <ul className="wf-dossier-links wf-closing-panel-actions">
            <li>
              <button
                type="button"
                onClick={() => {
                  store.openHorizon(null);
                  store.openContact(true);
                }}
              >
                Get in touch
              </button>
            </li>
          </ul>
        </FocusPanel>
      )}
    </>
  );
}
