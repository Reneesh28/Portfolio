/**
 * Origin Sanctum content (M6.1; copy approved with the design, DEC-026).
 *
 * Every line records its source (doc 11: never invent facts) and shows only when
 * `isDisplayable` allows it, the same rule as the project dossiers. The copy is the
 * proposal's §2.5, assembled only from the master doc (owner-written), Classic's published
 * `profile.js` and the owner's CV. Three items the master doc asks for have no source and
 * are left out: the problem-solving approach, the creator and game-development ambitions,
 * and availability.
 */
import type { RegionId } from '../data/worldGeography';
import { builtProjects, PROJECTS, type Field } from './projects';

export type SanctumViewId = 'overview' | 'engineer' | 'creator' | 'explorer';

/** Panel order: the overview, then the three identity fragments (master doc §6). */
export const SANCTUM_VIEWS: readonly SanctumViewId[] = ['overview', 'engineer', 'creator', 'explorer'];

export const isSanctumView = (value: string | null): value is SanctumViewId => value !== null && (SANCTUM_VIEWS as readonly string[]).includes(value);

const MASTER = 'master doc §1 (owner-written)';
const CLASSIC = 'src/data/profile.js (published by Classic); approved for the Sanctum (DEC-026)';
const CV = 'public/resume.pdf (owner-confirmed, DEC-025)';
const DERIVED = 'derived from the project data (src/world-forge/content/projects.ts)';

const field = (value: string, source: string): Field<string> => ({ value, status: 'owner', source });

export interface SanctumEntry {
  /** Short label shown before the text (e.g. "Now"), if any. */
  label?: string;
  field: Field<string>;
}

export type SanctumAction = { kind: 'link'; label: string; href: string } | { kind: 'travel'; label: string; region: RegionId };

export interface SanctumViewContent {
  id: SanctumViewId;
  /** Panel heading. */
  title: string;
  /** Short name for buttons and the card ("About", "Engineer"…). */
  short: string;
  /** A line set apart as a quote, if any. */
  quote?: Field<string>;
  entries: SanctumEntry[];
  actions: SanctumAction[];
}

/** The identity shown on the Sanctum card and the overview. */
export const SANCTUM_IDENTITY = {
  name: field('Balam Reneesh', `${CV}; Classic profile.js`),
  identity: field('Engineer · Creator · World Builder', MASTER),
  role: field('AI Systems Engineer & Full-Stack Developer', CLASSIC),
  mission: field('Building systems that learn, remember, and respond.', CLASSIC),
} as const;

const NUMBER_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];

/** "Eight works stand in the World Forge, led by NeuroPlay Engine, AETHERION and NutriFit AI." From the project data. */
function worksLine(): string {
  const works = builtProjects();
  const count = NUMBER_WORDS[works.length] ?? String(works.length);
  // In the content's own order (NeuroPlay Engine, AETHERION, NutriFit AI).
  const featured = PROJECTS.filter((p) => p.featured && p.built).map((p) => p.name);
  const led = featured.length > 1 ? `${featured.slice(0, -1).join(', ')} and ${featured[featured.length - 1]}` : featured[0];
  return `${count} works stand in the World Forge${led ? `, led by ${led}` : ''}.`;
}

export const SANCTUM_CONTENT: Readonly<Record<SanctumViewId, SanctumViewContent>> = {
  overview: {
    id: 'overview',
    title: SANCTUM_IDENTITY.name.value,
    short: 'About',
    entries: [
      { label: 'Role', field: SANCTUM_IDENTITY.role },
      {
        field: field(
          'A Computer Science student and AI systems builder focused on turning complex ideas into practical products. I work across generative AI, machine learning and full-stack development, connecting intelligent backends with interfaces people can actually use.',
          `${CLASSIC}; biography paragraph 1 without its opening "I'm Reneesh Balam," (the name is the heading)`,
        ),
      },
    ],
    quote: SANCTUM_IDENTITY.mission,
    actions: [
      { kind: 'link', label: 'Resume', href: '/resume.pdf' },
      { kind: 'travel', label: 'Continue to the World Forge', region: 'world-forge' },
    ],
  },
  engineer: {
    id: 'engineer',
    title: 'The Engineer',
    short: 'Engineer',
    entries: [
      { label: 'Studying', field: field('B.Tech, Computer Science and Engineering, Lovely Professional University (Aug 2023 – present)', CV) },
      { label: 'Now', field: field('Machine Learning Intern, MacBease Connections (Nov 2025 – present)', CV) },
      { label: 'Now', field: field('Full Stack Developer, freelance (Jan 2026 – present)', CV) },
      { label: 'Works across', field: field('Generative AI, machine learning and React architecture, in C++, JavaScript and Python', `${CLASSIC} (specialization); ${CV} (languages)`) },
    ],
    actions: [],
  },
  creator: {
    id: 'creator',
    title: 'The Creator',
    short: 'Creator',
    entries: [{ field: field(worksLine(), DERIVED) }],
    actions: [{ kind: 'travel', label: 'See the works', region: 'world-forge' }],
  },
  explorer: {
    id: 'explorer',
    title: 'The Explorer',
    short: 'Explorer',
    quote: field("I build systems, create experiences, and explore ideas that haven't yet taken form.", `${MASTER} (hero statement)`),
    entries: [
      {
        field: field(
          "I'm most interested in systems that learn, remember and respond, whether that means building AI assistants, behavioural intelligence engines or real-time safety platforms.",
          `${CLASSIC}; biography paragraph 2`,
        ),
      },
    ],
    actions: [{ kind: 'travel', label: 'Continue to the Worlds Beyond', region: 'worlds-beyond' }],
  },
};
