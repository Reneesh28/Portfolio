import { useRef } from 'react';
import { projectById } from '../content/projects';
import { isMilestone, MILESTONE_IDS, MILESTONES, milestoneById, type MilestoneId } from '../content/timeline';
import { useExperienceSnapshot, useExperienceStore } from '../experience/ExperienceContext';
import FocusPanel from './FocusPanel';

/**
 * The Path of Ascension's screen-space UI (M6.3, DEC-030). When the camera has settled at the
 * Path, a card offers the direct timeline selector: the five milestones in order, each with its
 * years (master doc §8: "direct timeline selector"; M6C: no compulsory traversal). Choosing one
 * draws the camera to its waystone, lights the path up to it and opens the timeline panel.
 * Verified facts only, from the CV. Works open their dossiers in the World Forge.
 */
export default function AscensionPanel() {
  const store = useExperienceStore();
  const { currentRegion, phase, ascensionMilestone } = useExperienceSnapshot();
  const opener = useRef<MilestoneId | null>(null);
  const atPath = currentRegion === 'path-of-ascension' && phase === 'idle';

  const focusLater = (selector: string) =>
    requestAnimationFrame(() => (document.querySelector<HTMLElement>(selector) ?? document.querySelector<HTMLElement>('.wf-nav-toggle'))?.focus());

  const open = (id: MilestoneId) => {
    opener.current = id;
    store.openAscension(id);
  };
  const close = () => {
    const id = opener.current;
    opener.current = null;
    store.openAscension(null);
    focusLater(id ? `.wf-path-card button[data-milestone="${id}"]` : '.wf-nav-toggle');
  };
  const visit = (projectId: string) => {
    opener.current = null;
    store.visitWork(projectId);
  };
  const onward = () => {
    opener.current = null;
    store.navigateTo('worlds-beyond');
    focusLater('.wf-nav-toggle');
  };

  const milestone = isMilestone(ascensionMilestone) ? ascensionMilestone : null;
  return (
    <>
      {atPath && !ascensionMilestone && (
        <section className="wf-path-card" aria-label="The Path of Ascension: timeline">
          <p className="wf-path-title">The Path of Ascension</p>
          <ol className="wf-path-timeline">
            {MILESTONES.map((m) => (
              <li key={m.id}>
                <button type="button" data-milestone={m.id} onClick={() => open(m.id)} aria-label={`${m.title}, ${m.years}`}>
                  <span className="wf-path-stop">{m.title}</span>
                  <span className="wf-path-years" aria-hidden="true">
                    {m.years}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </section>
      )}
      {milestone && <MilestoneView id={milestone} onClose={close} onVisit={visit} onOnward={onward} />}
    </>
  );
}

function MilestoneView({ id, onClose, onVisit, onOnward }: { id: MilestoneId; onClose: () => void; onVisit: (projectId: string) => void; onOnward: () => void }) {
  const store = useExperienceStore();
  const m = milestoneById(id);
  const index = MILESTONE_IDS.indexOf(id);
  const at = (offset: number) => MILESTONE_IDS[(index + offset + MILESTONE_IDS.length) % MILESTONE_IDS.length];
  const last = index === MILESTONE_IDS.length - 1;

  return (
    <FocusPanel
      className="wf-dossier--path"
      viewKey={id}
      count={`${String(index + 1).padStart(2, '0')} / ${String(MILESTONE_IDS.length).padStart(2, '0')}`}
      title={m.title}
      closeLabel="Close and return to the Path"
      onClose={onClose}
      step={{
        onStep: (offset) => store.openAscension(at(offset)),
        previousLabel: `Previous: ${milestoneById(at(-1)).title}`,
        nextLabel: `Next: ${milestoneById(at(1)).title}`,
        enabled: true,
      }}
    >
      <p className="wf-dossier-meta">{m.years}</p>
      {m.place && <p className="wf-path-place">{m.place}</p>}
      {m.groups.map((g, k) => (
        <section key={k}>
          {g.heading && <h3>{g.heading}</h3>}
          {g.lines.length === 1 && !g.works ? (
            <p>{g.lines[0]}</p>
          ) : (
            <ul className="wf-path-lines">
              {g.lines.map((line, j) => {
                const work = g.works?.[j] ? projectById(g.works[j]) : undefined;
                return (
                  <li key={line}>
                    {line}
                    {work && (
                      <button type="button" className="wf-skill-work wf-path-work" data-work={work.id} onClick={() => onVisit(work.id)} aria-label={`${work.name}: open it in the World Forge`}>
                        Open in the Forge
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      ))}
      {last && (
        <ul className="wf-dossier-links wf-path-actions">
          <li>
            <button type="button" onClick={onOnward}>
              Continue to the Worlds Beyond <span aria-hidden="true">→</span>
            </button>
          </li>
        </ul>
      )}
    </FocusPanel>
  );
}
