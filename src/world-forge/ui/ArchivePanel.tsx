import { useRef } from 'react';
import { projectById } from '../content/projects';
import { isSkillCategory, SKILL_CATEGORIES, SKILL_CATEGORY_IDS, skillCategory, type Skill, type SkillCategoryId } from '../content/skills';
import { useExperienceSnapshot, useExperienceStore } from '../experience/ExperienceContext';
import FocusPanel from './FocusPanel';

/** A work's short name for an evidence button: its acronym if it has one ("SPAE"), else its name. */
const workLabel = (name: string) => name.match(/\(([^)]+)\)\s*$/)?.[1] ?? name;

/**
 * The Blueprint Archive's screen-space UI (M6.2, DEC-028). When the camera has settled at
 * the Archive, a card offers the four skill categories. Choosing one builds its structure in
 * the world and opens the panel on it: the skills **in use**, each with the works, roles or
 * training behind it, and the skills being **explored**. A work's button travels to the World
 * Forge and opens its dossier there (master doc §8: "Related project opens dossier").
 * No percentages, levels or logos.
 */
export default function ArchivePanel() {
  const store = useExperienceStore();
  const { currentRegion, phase, archiveCategory } = useExperienceSnapshot();
  const opener = useRef<SkillCategoryId | null>(null);
  const atArchive = currentRegion === 'blueprint-archive' && phase === 'idle';

  const focusLater = (selector: string) =>
    requestAnimationFrame(() => (document.querySelector<HTMLElement>(selector) ?? document.querySelector<HTMLElement>('.wf-nav-toggle'))?.focus());

  const open = (id: SkillCategoryId) => {
    opener.current = id;
    store.openArchive(id);
  };
  const close = () => {
    const id = opener.current;
    opener.current = null;
    store.openArchive(null);
    focusLater(id ? `.wf-archive-card button[data-category="${id}"]` : '.wf-nav-toggle');
  };
  const visit = (projectId: string) => {
    opener.current = null;
    store.visitWork(projectId);
  };

  const category = isSkillCategory(archiveCategory) ? archiveCategory : null;
  return (
    <>
      {atArchive && !archiveCategory && (
        <section className="wf-archive-card" aria-label="The Blueprint Archive: skills">
          <p className="wf-archive-title">The Blueprint Archive</p>
          <p className="wf-archive-subtitle">Skills · what they were used in</p>
          <ul className="wf-archive-categories">
            {SKILL_CATEGORIES.map((c) => (
              <li key={c.id}>
                <button type="button" data-category={c.id} aria-label={c.title} onClick={() => open(c.id)}>
                  {c.short}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
      {category && <CategoryView id={category} onClose={close} onVisit={visit} />}
    </>
  );
}

function SkillRow({ skill, onVisit }: { skill: Skill; onVisit: (projectId: string) => void }) {
  const works = skill.works.map((id) => projectById(id)).filter((p) => p !== undefined);
  return (
    <li className="wf-skill">
      <span className="wf-skill-name">{skill.name}</span>
      {(works.length > 0 || skill.labels.length > 0) && (
        <span className="wf-skill-evidence">
          {works.map((p) => (
            <button key={p.id} type="button" className="wf-skill-work" data-work={p.id} onClick={() => onVisit(p.id)} aria-label={`${p.name}: open it in the World Forge`}>
              {workLabel(p.name)}
            </button>
          ))}
          {skill.labels.map((label) => (
            <span key={label} className="wf-skill-label">
              {label}
            </span>
          ))}
        </span>
      )}
    </li>
  );
}

function CategoryView({ id, onClose, onVisit }: { id: SkillCategoryId; onClose: () => void; onVisit: (projectId: string) => void }) {
  const store = useExperienceStore();
  const category = skillCategory(id);
  const index = SKILL_CATEGORY_IDS.indexOf(id);
  const at = (offset: number) => SKILL_CATEGORY_IDS[(index + offset + SKILL_CATEGORY_IDS.length) % SKILL_CATEGORY_IDS.length];
  const inUse = category.skills.filter((s) => s.tier === 'in-use');
  const exploring = category.skills.filter((s) => s.tier === 'exploring');

  return (
    <FocusPanel
      className="wf-dossier--archive"
      viewKey={id}
      count={`${String(index + 1).padStart(2, '0')} / ${String(SKILL_CATEGORY_IDS.length).padStart(2, '0')}`}
      title={category.title}
      closeLabel="Close and return to the Archive"
      onClose={onClose}
      step={{
        onStep: (offset) => store.openArchive(at(offset)),
        previousLabel: `Previous: ${skillCategory(at(-1)).title}`,
        nextLabel: `Next: ${skillCategory(at(1)).title}`,
        enabled: true,
      }}
    >
      <p className="wf-dossier-meta">The Blueprint Archive</p>
      <section>
        <h3>In use</h3>
        <ul className="wf-skills">
          {inUse.map((s) => (
            <SkillRow key={s.name} skill={s} onVisit={onVisit} />
          ))}
        </ul>
      </section>
      {exploring.length > 0 && (
        <section>
          <h3>Exploring</h3>
          <ul className="wf-skills wf-skills--exploring">
            {exploring.map((s) => (
              <SkillRow key={s.name} skill={s} onVisit={onVisit} />
            ))}
          </ul>
        </section>
      )}
      <p className="wf-archive-note">Works open in the World Forge.</p>
    </FocusPanel>
  );
}
