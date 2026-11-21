/**
 * Blueprint Archive skills (M6.2; design and list approved, DEC-028).
 *
 * The owner's skills are the CV's plus the owner's tech-stack image (DEC-028). There are no
 * percentages, levels or logos (master doc §6, M6B): each skill is either **in use** (with the
 * works, roles or training behind it) or **exploring**. Evidence names works by id; a unit
 * test checks every named work exists and mentions the technology, so the Archive can't
 * drift from the dossiers.
 */

export type SkillCategoryId = 'ai' | 'software' | 'data' | 'games';
export type SkillTier = 'in-use' | 'exploring';
/** Roles, training and credentials shown beside a skill (the CV and the image are sources, not shown). */
export type EvidenceLabel = 'Freelance' | 'Internship' | 'Certificate';

export interface Skill {
  name: string;
  tier: SkillTier;
  /** Works (project ids) that use it: each opens that work's dossier in the World Forge. */
  works: readonly string[];
  labels: readonly EvidenceLabel[];
  /** Words, one of which each named work's text must contain (checked by the tests). */
  match: readonly string[];
  source: string;
}

export interface SkillCategory {
  id: SkillCategoryId;
  title: string;
  /** Button name on the Archive card. */
  short: string;
  skills: readonly Skill[];
}

const CV = 'CV (public/resume.pdf, DEC-025)';
const IMAGE = "owner's tech-stack image (DEC-028)";
const WORKS = 'the works (content/projects.ts)';

const skill = (name: string, works: string[], match: string[], labels: EvidenceLabel[], source: string, tier: SkillTier = 'in-use'): Skill => ({ name, tier, works, labels, match, source });

export const SKILL_CATEGORIES: readonly SkillCategory[] = [
  {
    id: 'ai',
    title: 'AI & Intelligence',
    short: 'AI',
    skills: [
      skill('Machine learning', ['aetherion', 'neuroplay', 'spae'], ['machine learning', 'ml-based'], ['Internship'], `${CV}; ${WORKS}`),
      skill('LLM applications', ['nutrifit', 'finlit', 'game-stats'], ['llm', 'groq'], [], WORKS),
      skill('Retrieval-augmented generation (RAG)', ['nutrifit'], ['retrieval-augmented', 'rag'], [], WORKS),
      skill('Embeddings and vector search', ['neuroplay', 'nutrifit'], ['embedding', 'faiss', 'sentence transformers'], [], `${CV}; ${WORKS}`),
      skill('AI agents (LangGraph)', ['neuroplay'], ['langgraph'], [], CV),
      skill('LangChain', ['nutrifit'], ['langchain'], [], `${CV}; ${WORKS}`),
      skill('Clustering (HDBSCAN)', ['neuroplay'], ['hdbscan'], [], CV),
      skill('Scikit-learn', [], [], [], `${CV}; ${IMAGE}`),
      skill('Computer vision', ['paras'], ['computer vision'], [], WORKS),
    ],
  },
  {
    id: 'software',
    title: 'Software Engineering',
    short: 'Software',
    skills: [
      skill('Python', ['neuroplay', 'aetherion', 'nutrifit', 'finlit', 'paras', 'game-stats', 'spae'], ['python'], [], `${CV}; ${IMAGE}; ${WORKS}`),
      skill('JavaScript', [], [], [], `${CV}; ${IMAGE}`),
      skill('C++', [], [], [], `${CV}; ${IMAGE}`),
      skill('C', [], [], [], IMAGE),
      skill('React', ['aetherion'], ['react'], ['Internship'], `${CV}; ${IMAGE}`),
      skill('Next.js', [], [], ['Freelance'], CV),
      skill('Node.js and Express', ['neuroplay'], ['mern'], ['Internship'], `${CV}; ${IMAGE}`),
      skill('FastAPI', ['neuroplay', 'aetherion', 'nutrifit', 'finlit'], ['fastapi'], [], `${CV}; ${IMAGE}; ${WORKS}`),
      skill('Django and Django REST Framework', ['aetherion'], ['django'], ['Freelance'], `${CV}; ${IMAGE}`),
      skill('Flask', ['aetherion'], ['flask'], [], `${CV}; ${IMAGE}`),
      skill('WebSockets', ['aetherion'], ['websocket'], [], CV),
      skill('Streamlit', ['nutrifit', 'game-stats'], ['streamlit'], [], `${CV}; ${IMAGE}; ${WORKS}`),
      skill('HTML and CSS', [], [], [], `${CV}; ${IMAGE}`),
      skill('Tailwind CSS and Bootstrap', [], [], [], `${CV}; ${IMAGE}`),
    ],
  },
  {
    id: 'data',
    title: 'Data & Infrastructure',
    short: 'Data',
    skills: [
      skill('MongoDB', ['aetherion'], ['mongodb'], [], `${CV}; ${IMAGE}`),
      skill('MySQL', ['aetherion'], ['mysql'], [], `${CV}; ${IMAGE}`),
      skill('FAISS', ['neuroplay', 'nutrifit'], ['faiss'], [], `${CV}; ${WORKS}`),
      skill('Redis', ['aetherion'], ['redis'], ['Freelance'], CV),
      skill('Kafka', ['aetherion'], ['kafka'], [], CV),
      skill('Task queues (Celery, BullMQ)', ['neuroplay'], ['bullmq'], ['Freelance'], CV),
      skill('Docker', ['aetherion'], ['docker'], [], CV),
      skill('AWS (EC2, RDS, S3)', [], [], ['Freelance', 'Certificate'], `${CV} (freelance; AWS Certified Cloud Practitioner, Apr 2026)`),
      skill('Git and GitHub', [], [], ['Freelance'], `${CV}; ${IMAGE}`),
      skill('Netlify', [], [], [], IMAGE),
      skill('Pandas and NumPy', ['finlit', 'game-stats'], ['pandas'], [], `${CV}; ${IMAGE}; ${WORKS}`),
      skill('Matplotlib, Plotly and Chart.js', ['game-stats'], ['matplotlib', 'plotly'], [], `${CV}; ${IMAGE}; ${WORKS}`),
    ],
  },
  {
    id: 'games',
    title: 'Creative & Game Development',
    short: 'Games',
    skills: [
      skill('Gameplay data and analysis', ['neuroplay', 'game-stats'], ['gameplay'], [], `${CV}; ${WORKS}`),
      skill('Design (Canva)', [], [], [], IMAGE),
      skill('Three.js and WebGL', [], [], [], `${IMAGE}; Classic skills.js ("Exploring"); no work uses it`, 'exploring'),
    ],
  },
];

export const SKILL_CATEGORY_IDS: readonly SkillCategoryId[] = SKILL_CATEGORIES.map((c) => c.id);

export const isSkillCategory = (value: string | null): value is SkillCategoryId => value !== null && (SKILL_CATEGORY_IDS as readonly string[]).includes(value);

export const skillCategory = (id: SkillCategoryId): SkillCategory => {
  const category = SKILL_CATEGORIES.find((c) => c.id === id);
  if (!category) throw new Error(`Unknown skill category ${id}`);
  return category;
};
