/**
 * World Forge project content (M5.2, DEC-012/013/015/021).
 *
 * Every field records where it came from and how far it is confirmed (doc 11:
 * never invent facts). The dossier shows a field only when `isDisplayable` allows
 * it: owner-confirmed text, or the repository text the Classic portfolio already
 * publishes. Conflicts and missing content are never shown. The owner named the CV
 * as the source of truth (DEC-025), so CV text, figures included, counts as
 * owner-confirmed. There are no pictures (DEC-015).
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
  /** Master-doc dossier fields; each entry is one point, shown only when filled. */
  approach: Field<string[]>;
  architecture: Field<string[]>;
  links: Field<ProjectLink[]>;
}

const repo = <T,>(value: T): Field<T> => ({ value, status: 'repo', source: 'src/data/projects.js (also shown by Classic)' });
/** The owner's CV, which the owner confirmed as the source of truth ("Everything is in CV", DEC-025). */
const cv = <T,>(value: T): Field<T> => ({ value, status: 'owner', source: 'public/resume.pdf (owner-confirmed, DEC-025)' });
const missing = <T,>(value: T): Field<T> => ({ value, status: 'missing', source: 'none' });

export const PROJECTS: readonly Project[] = [
  {
    id: 'neuroplay',
    name: 'NeuroPlay Engine',
    plinth: 4,
    featured: true,
    emblem: 'twin-rings',
    built: true,
    category: repo('Generative AI'),
    status: cv('Jan – May 2026'),
    overview: cv(
      'A multi-domain Digital Twin intelligence platform for behavioral gameplay analysis, with 200+ execution tasks spanning AI, ML, backend, memory and deployment systems.',
    ),
    tech: cv(['Python', 'FastAPI', 'MERN', 'LangGraph', 'FAISS', 'Machine Learning']),
    approach: cv([
      'An ML + GenAI intelligence stack using 8D behavioral embeddings, HDBSCAN clustering, LangGraph agents and ~28,000 gameplay samples for adaptive simulations and AI-driven coaching insights.',
    ]),
    architecture: cv([
      'An async distributed architecture with 5-stage execution pipelines, BullMQ workers, FastAPI orchestration and domain-isolated FAISS retrieval systems, enabling deterministic and fault-tolerant AI processing workflows.',
    ]),
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
    tech: cv(['Python', 'Machine Learning', 'FastAPI', 'Django', 'Flask', 'React', 'Kafka', 'Redis', 'MongoDB', 'MySQL', 'Docker', 'WebSockets']),
    approach: cv([
      'ML-based market regime detection, improving strategy adaptability and prediction accuracy by ~30%.',
      'Quantitative analytics modules (risk analysis, liquidity stress, anomaly detection), enabling data-driven trading decisions at scale.',
    ]),
    architecture: cv(['A microservices architecture with real-time data ingestion and WebSocket streaming, achieving low latency (<200 ms) for live market data.']),
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
    approach: missing([]),
    architecture: missing([]),
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
    approach: missing([]),
    architecture: missing([]),
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
    approach: missing([]),
    architecture: missing([]),
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
    approach: missing([]),
    architecture: missing([]),
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
    approach: missing([]),
    architecture: missing([]),
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
    approach: missing([]),
    architecture: missing([]),
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
