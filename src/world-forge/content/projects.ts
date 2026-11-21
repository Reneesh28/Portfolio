/**
 * World Forge project content (M5.2, DEC-012/013/015/021).
 *
 * Every field records where it came from and how far it is confirmed (doc 11:
 * never invent facts). The dossier shows a field only when `isDisplayable` allows
 * it: owner-confirmed text, or the repository text the Classic portfolio already
 * publishes. Conflicts, unconfirmed CV figures and missing content are never shown.
 * There are no pictures (DEC-015).
 */
export type FieldStatus =
  /** Confirmed by the owner. */
  | 'owner'
  /** Repository text already published by the Classic portfolio (DRAFT until the owner confirms). */
  | 'repo'
  /** Only in the owner's CV, unconfirmed (e.g. figures): not shown. */
  | 'cv'
  /** Repository and CV disagree: not shown until the owner decides. */
  | 'conflict'
  /** No content anywhere. */
  | 'missing';

export interface Field<T> {
  value: T;
  status: FieldStatus;
  source: string;
}

export type EmblemKind = 'twin-rings' | 'rising-shard' | 'spiral-discs' | 'balanced-arch' | 'lens-ring' | 'faceted-die' | 'ascending-columns' | 'hourglass';

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  id: string;
  name: string;
  /** Which of the 8 Projects-terrace plinths it stands on (0–7, left to right seen from the Projects gate). */
  plinth: number;
  featured: boolean;
  emblem: EmblemKind;
  /** Whether its monument stands on the terrace (all 8 since M5.5, DEC-022). */
  built: boolean;
  category: Field<string>;
  status: Field<string>;
  overview: Field<string>;
  tech: Field<string[]>;
  links: Field<ProjectLink[]>;
}

const repo = <T,>(value: T): Field<T> => ({ value, status: 'repo', source: 'src/data/projects.js (also shown by Classic)' });
const missing = <T,>(value: T): Field<T> => ({ value, status: 'missing', source: 'none' });
const conflict = <T,>(value: T, note: string): Field<T> => ({ value, status: 'conflict', source: note });

export const PROJECTS: readonly Project[] = [
  {
    id: 'neuroplay',
    name: 'NeuroPlay Engine',
    plinth: 4,
    featured: true,
    emblem: 'twin-rings',
    built: true,
    category: repo('Generative AI'),
    status: conflict('In Development', 'repo says "In Development"; CV says Jan–May 2026'),
    overview: conflict('', 'repo (generative AI engine) and CV (digital-twin gameplay platform) disagree'),
    tech: conflict([], 'repo and CV list different stacks'),
    links: repo([
      { label: 'GitHub', href: 'https://github.com/Reneesh28/NeuroPlay' },
      { label: 'Live demo', href: 'https://neuroplay.vercel.app' },
    ]),
  },
  {
    id: 'aetherion',
    name: 'AETHERION',
    plinth: 2,
    featured: true,
    emblem: 'rising-shard',
    built: true,
    category: repo('Full Stack'),
    status: repo('Prototype'),
    overview: repo('AETHERION is an AI-powered trading intelligence engine that reads the market in real time and adapts strategies instantly.'),
    tech: conflict(['React', 'Tailwind', 'Django', 'FastAPI', 'MongoDB', 'Flask', 'MySQL'], 'CV lists more (ML, Kafka, Redis, Docker, WebSockets)'),
    links: repo([
      { label: 'GitHub (frontend)', href: 'https://github.com/Reneesh28/AETHERION_FRONTEND' },
      { label: 'GitHub (backend)', href: 'https://github.com/Reneesh28/AETHERION_BACKEND' },
    ]),
  },
  {
    id: 'nutrifit',
    name: 'NutriFit AI',
    plinth: 3,
    featured: true,
    emblem: 'spiral-discs',
    built: true,
    category: repo('Generative AI'),
    status: repo('Source Available'),
    overview: repo(
      'An AI-powered assistant that delivers personalized fitness and nutrition recommendations using health data. Built with multi-turn conversational memory and Retrieval-Augmented Generation (RAG).',
    ),
    tech: repo(['Python', 'LangChain', 'FAISS', 'Streamlit', 'FastAPI', 'Sentence Transformers', 'Groq API']),
    links: repo([{ label: 'GitHub', href: 'https://github.com/Reneesh28/Nutrifit-AI' }]),
  },
  {
    id: 'finlit',
    name: 'FinLit AI',
    plinth: 5,
    featured: false,
    emblem: 'balanced-arch',
    built: true,
    category: repo('Machine Learning'),
    status: repo('In Development'),
    overview: repo('An AI-driven financial literacy and advisory platform leveraging LLMs to simplify complex economic principles into personalized advice.'),
    tech: repo(['Python', 'Pandas', 'LLMs', 'FastAPI']),
    links: repo([{ label: 'GitHub', href: 'https://github.com/Reneesh28/FinLit-AI' }]),
  },
  {
    id: 'paras',
    name: 'PARAS System',
    plinth: 1,
    featured: false,
    emblem: 'lens-ring',
    built: true,
    category: repo('Machine Learning'),
    status: repo('Prototype'),
    overview: repo('A real-time safety and behavioral intelligence platform that processes live video feeds using computer vision to detect anomalies.'),
    tech: repo(['Python', 'Computer Vision', 'Real-Time Processing']),
    links: repo([{ label: 'GitHub', href: 'https://github.com/Reneesh28/PARAS' }]),
  },
  {
    id: 'game-stats',
    name: 'Game Stats Dashboard & Recommender',
    plinth: 6,
    featured: false,
    emblem: 'faceted-die',
    built: true,
    category: repo('Data'),
    status: repo('Source Available'),
    overview: repo('An interactive Streamlit dashboard that analyzes gameplay data from Excel files and generates personalized game recommendations using LLMs.'),
    tech: repo(['Python', 'Streamlit', 'Pandas', 'NumPy', 'Groq API', 'Matplotlib', 'Plotly']),
    links: repo([{ label: 'GitHub', href: 'https://github.com/Reneesh28/Game_Stats_Dashboard_Recommendation-System' }]),
  },
  {
    id: 'spae',
    name: 'Sales Performance Analytics Engine (SPAE)',
    plinth: 0,
    featured: false,
    emblem: 'ascending-columns',
    built: true,
    category: repo('Data'),
    status: repo('Source Available'),
    overview: repo(
      'An advanced Machine Learning-powered statistics dashboard designed to analyze sales performance, uncover trends, and generate predictive insights using large-scale datasets.',
    ),
    tech: repo(['Python', 'Machine Learning', 'Data Analytics', 'Statistics', 'Dashboarding']),
    links: repo([{ label: 'GitHub', href: 'https://github.com/Reneesh28/Project_ML' }]),
  },
  {
    id: 'chronoshift',
    name: 'Chronoshift',
    plinth: 7,
    featured: false,
    emblem: 'hourglass',
    built: true,
    category: missing(''),
    status: missing(''),
    overview: missing(''),
    tech: missing([]),
    links: missing([]),
  },
];

/** Whether a field may appear in a dossier (doc 11; DEC-021). */
export function isDisplayable<T>(field: Field<T>): boolean {
  const hasValue = Array.isArray(field.value) ? field.value.length > 0 : Boolean(field.value);
  return hasValue && (field.status === 'owner' || field.status === 'repo');
}

/** The projects whose monuments stand on the terrace, in plinth order (left to right). */
export const builtProjects = (): Project[] => PROJECTS.filter((p) => p.built).sort((a, b) => a.plinth - b.plinth);

export const projectById = (id: string): Project | undefined => PROJECTS.find((p) => p.id === id);
