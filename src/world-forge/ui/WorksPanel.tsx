import { useRef } from 'react';
import { builtProjects } from '../content/projects';
import { useExperienceSnapshot, useExperienceStore } from '../experience/ExperienceContext';
import ProjectDossier from './ProjectDossier';

/**
 * The Works index and the dossier (M5). At the World Forge stop, a compact list of the
 * works on the Projects terrace appears above the bottom navigation: the keyboard and
 * touch equivalent of clicking a monument (3D picking is never required). Choosing a
 * work focuses its monument and opens its dossier.
 */
export default function WorksPanel() {
  const store = useExperienceStore();
  const { currentRegion, phase, focusedProject } = useExperienceSnapshot();
  // Which work's button opened the dossier (the index re-renders, so remember the project, not the element).
  const opener = useRef<string | null>(null);
  const works = builtProjects();
  const atForge = currentRegion === 'world-forge' && phase === 'idle';

  // Back to the work's button once the index re-renders; if a monument was clicked in 3D, the region toggle.
  const restoreFocus = () => {
    const id = opener.current;
    opener.current = null;
    requestAnimationFrame(() => {
      const button = id ? document.querySelector<HTMLElement>(`.wf-works button[data-project="${id}"]`) : null;
      (button ?? document.querySelector<HTMLElement>('.wf-nav-toggle'))?.focus();
    });
  };

  const open = (id: string) => {
    opener.current = id;
    store.focusProject(id);
  };

  return (
    <>
      {atForge && !focusedProject && works.length > 0 && (
        <nav className="wf-works" aria-label="Works on the Projects terrace">
          <span className="wf-works-label" aria-hidden="true">
            WORKS
          </span>
          {/* Its own horizontal scroll on narrow screens (never drives the journey). */}
          <ul data-wf-own-scroll="">
            {works.map((p) => (
              <li key={p.id}>
                <button type="button" data-project={p.id} onClick={() => open(p.id)}>
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
      {focusedProject && <ProjectDossier projectId={focusedProject} onRestoreFocus={restoreFocus} />}
    </>
  );
}
