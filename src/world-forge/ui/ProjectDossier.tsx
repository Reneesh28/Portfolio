import { useEffect, useId, useRef, type KeyboardEvent } from 'react';
import { builtProjects, isDisplayable, projectById, type Field } from '../content/projects';
import { useExperienceStore } from '../experience/ExperienceContext';
import { useDismissLayer } from './useDismissLayer';

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
 * Scroll travel is blocked while it is open; its own content scrolls.
 */
export default function ProjectDossier({ projectId, onRestoreFocus }: ProjectDossierProps) {
  const store = useExperienceStore();
  const project = projectById(projectId);
  const works = builtProjects();
  const index = works.findIndex((p) => p.id === projectId);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const close = () => {
    store.focusProject(null);
    onRestoreFocus();
  };
  useDismissLayer(true, close);
  useEffect(() => store.blockScroll(), [store]);
  useEffect(() => panelRef.current?.querySelector<HTMLElement>('h2')?.focus(), [projectId]);

  if (!project) return null;
  const switchTo = (offset: number) => {
    const next = works[(index + offset + works.length) % works.length];
    if (next && next.id !== projectId) store.focusProject(next.id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight' && works.length > 1) switchTo(1);
    if (event.key === 'ArrowLeft' && works.length > 1) switchTo(-1);
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

  const draft = import.meta.env.DEV && [project.overview, project.category, project.status, project.tech, project.links].some((f) => f.status === 'repo');
  const meta = [project.category, project.status].filter(isDisplayable).map((f) => f.value);
  const neighbour = (offset: number) => works[(index + offset + works.length) % works.length]?.name ?? '';

  return (
    <div className="wf-dossier" role="presentation">
      <div className="wf-dossier-scrim" aria-hidden="true" onPointerDown={close} />
      <div ref={panelRef} className="wf-dossier-panel" role="dialog" aria-modal="true" aria-labelledby={titleId} onKeyDown={onKeyDown}>
        <header className="wf-dossier-header">
          <span className="wf-dossier-count">
            {String(index + 1).padStart(2, '0')} / {String(works.length).padStart(2, '0')}
          </span>
          <button type="button" className="wf-dossier-close" onClick={close} aria-label="Close the project and return to the Forge">
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <div key={projectId} className="wf-dossier-body" data-wf-own-scroll="">
          <h2 id={titleId} className="wf-dossier-title" tabIndex={-1}>
            {project.name}
          </h2>
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
        </div>
        <footer className="wf-dossier-footer">
          <button type="button" onClick={() => switchTo(-1)} disabled={works.length < 2} aria-label={`Previous work: ${neighbour(-1)}`}>
            ‹ Previous
          </button>
          <button type="button" onClick={() => switchTo(1)} disabled={works.length < 2} aria-label={`Next work: ${neighbour(1)}`}>
            Next ›
          </button>
        </footer>
      </div>
    </div>
  );
}
