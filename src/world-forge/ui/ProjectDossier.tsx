import { builtProjects, isDisplayable, projectById, type Field } from '../content/projects';
import { useExperienceStore } from '../experience/ExperienceContext';
import FocusPanel from './FocusPanel';

/** A master-doc detail field (approach, architecture): one point as a paragraph, several as a list. */
function Points({ title, field }: { title: string; field: Field<string[]> }) {
  if (!isDisplayable(field)) return null;
  return (
    <section>
      <h3>{title}</h3>
      {field.value.length === 1 ? (
        <p>{field.value[0]}</p>
      ) : (
        <ul className="wf-dossier-points">
          {field.value.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

interface ProjectDossierProps {
  projectId: string;
  /** Returns focus to whatever opened the dossier, once it closes. */
  onRestoreFocus: () => void;
}

/**
 * Project dossier (M5, master doc §M5): a near-fullscreen, text-only panel (no
 * pictures, DEC-015) beside the focused monument. It shows only displayable fields
 * (doc 11; DEC-021), with previous/next to switch works without returning to the world,
 * and links that open in a new tab. Escape or Close restores the composition and focus.
 * Scroll travel is blocked while it is open; its own content scrolls. The panel shell
 * (dialog, focus, Escape, previous / next) is the shared `FocusPanel`.
 */
export default function ProjectDossier({ projectId, onRestoreFocus }: ProjectDossierProps) {
  const store = useExperienceStore();
  const project = projectById(projectId);
  const works = builtProjects();
  const index = works.findIndex((p) => p.id === projectId);

  const close = () => {
    store.focusProject(null);
    onRestoreFocus();
  };
  if (!project) return null;
  const switchTo = (offset: number) => {
    const next = works[(index + offset + works.length) % works.length];
    if (next && next.id !== projectId) store.focusProject(next.id);
  };

  const draft = import.meta.env.DEV && [project.overview, project.category, project.status, project.tech, project.links].some((f) => f.status === 'repo');
  const meta = [project.category, project.status].filter(isDisplayable).map((f) => f.value);
  const neighbour = (offset: number) => works[(index + offset + works.length) % works.length]?.name ?? '';

  return (
    <FocusPanel
      viewKey={projectId}
      count={`${String(index + 1).padStart(2, '0')} / ${String(works.length).padStart(2, '0')}`}
      title={project.name}
      closeLabel="Close the project and return to the Forge"
      onClose={close}
      step={{ onStep: switchTo, previousLabel: `Previous work: ${neighbour(-1)}`, nextLabel: `Next work: ${neighbour(1)}`, enabled: works.length > 1 }}
    >
      {meta.length > 0 && <p className="wf-dossier-meta">{meta.join(' · ')}</p>}
      {draft && <p className="wf-dossier-draft">DRAFT — repository text awaiting owner confirmation (development builds only)</p>}
      {isDisplayable(project.overview) ? (
        <section>
          <h3>Overview</h3>
          <p>{project.overview.value}</p>
        </section>
      ) : (
        // No confirmed description yet (doc 11: nothing invented): say so plainly.
        <p className="wf-dossier-pending">Details to follow.</p>
      )}
      <Points title="Approach" field={project.approach} />
      <Points title="Architecture" field={project.architecture} />
      {isDisplayable(project.tech) && (
        <section>
          <h3>Tech stack</h3>
          <ul className="wf-dossier-tech">
            {project.tech.value.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
      )}
      {isDisplayable(project.links) && (
        <section>
          <h3>Links</h3>
          <ul className="wf-dossier-links">
            {project.links.value.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                  <span className="wf-sr-only"> (opens in a new tab)</span>
                  <span aria-hidden="true"> ↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </FocusPanel>
  );
}
