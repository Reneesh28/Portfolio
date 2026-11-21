/**
 * Path of Ascension timeline (M6.3; design and content approved, DEC-030).
 *
 * Verified facts only (master doc §6, M6C; doc 11). Every line comes from the owner's CV
 * (`public/resume.pdf`, the owner-confirmed source, DEC-025), close to verbatim and with its
 * figures. The CV settles two conflicts with Classic: AniCos Co-CEO (not "CEO") and CGPA 6.86
 * (not 6.91). Left out because only Classic has them (DEC-030): secondary school, the
 * freeCodeCamp certificate, the AniCos dates and the Algo Tutor training.
 */

export type MilestoneId = 'foundations' | 'university' | 'leadership' | 'professional' | 'building';

export interface MilestoneGroup {
  /** A heading for the group (a role and its dates), if any. */
  heading?: string;
  lines: readonly string[];
  /** Works (project ids) shown as buttons that open their dossiers in the World Forge. */
  works?: readonly string[];
}

export interface Milestone {
  id: MilestoneId;
  title: string;
  /** Shown beside the title and on the timeline selector. */
  years: string;
  /** Year it began (for ordering checks); null when the source gives no date. */
  began: number | null;
  place?: string;
  groups: readonly MilestoneGroup[];
  source: string;
}

const CV = 'CV (public/resume.pdf, DEC-025)';

/** The five milestones, in the order things began, up the climb (DEC-030). */
export const MILESTONES: readonly Milestone[] = [
  {
    id: 'foundations',
    title: 'Foundations',
    years: '2021 – 2023',
    began: 2021,
    place: 'FIITJEE Junior College, Hyderabad, Telangana',
    groups: [{ lines: ['Intermediate · Jun 2021 – Mar 2023', 'Percentage: 83.5%'] }],
    source: CV,
  },
  {
    id: 'university',
    title: 'University',
    years: '2023 – present',
    began: 2023,
    place: 'Lovely Professional University, Phagwara, Punjab',
    groups: [
      { lines: ['Bachelor of Technology, Computer Science and Engineering · Aug 2023 – present', 'CGPA: 6.86'] },
      { heading: 'Certificates', lines: ['The Bits and Bytes of Computer Networking · Sep 2024', 'Fundamentals of Network Communication, Coursera · Oct 2024'] },
      { heading: 'Along the way', lines: ['HackerRank: 5 stars in various programming languages'] },
    ],
    source: CV,
  },
  {
    id: 'leadership',
    title: 'Leadership',
    years: 'Over two years',
    began: null,
    place: 'AniCos Student Organization',
    groups: [{ lines: ['Advanced from Volunteer to Board Member to Co-CEO, showcasing leadership growth over two years.'] }],
    source: CV,
  },
  {
    id: 'professional',
    title: 'Professional',
    years: '2025 – present',
    began: 2025,
    groups: [
      {
        heading: 'Machine Learning Intern · MacBease Connections Private Limited · Nov 2025 – present',
        lines: [
          'Designing and deploying a centralized admin dashboard (React + Node.js), improving data visibility and decision-making efficiency by ~35%.',
          'Implementing data visualization pipelines and user management systems, reducing manual data processing efforts by ~40%.',
          'Optimizing application performance through testing and backend tuning, reducing load times by ~25% and improving system reliability.',
        ],
      },
      {
        heading: 'Full Stack Developer · Freelance · Jan 2026 – present',
        lines: [
          'Architecting a hybrid B2B + B2C marketplace platform with role-based access, product catalog and checkout systems, supporting 1000+ projected users and scalable transactions.',
          'Engineering credit-based ledger accounting and order lifecycle pipelines, ensuring 100% transactional consistency and reliable financial tracking.',
          'Optimizing backend performance using Redis caching, Celery workers and AWS (EC2, RDS, S3), improving API response times by 40–60% under load.',
        ],
      },
      { heading: 'Certificate', lines: ['AWS Certified Cloud Practitioner (CLF-C02) · Apr 2026'] },
    ],
    source: CV,
  },
  {
    id: 'building',
    title: 'Building',
    years: '2026',
    began: 2026,
    groups: [{ lines: ['AETHERION · Jan 2026 – present', 'NeuroPlay Engine · Jan – May 2026'], works: ['aetherion', 'neuroplay'] }],
    source: CV,
  },
];

export const MILESTONE_IDS: readonly MilestoneId[] = MILESTONES.map((m) => m.id);

export const isMilestone = (value: string | null): value is MilestoneId => value !== null && (MILESTONE_IDS as readonly string[]).includes(value);

export const milestoneById = (id: MilestoneId): Milestone => {
  const m = MILESTONES.find((x) => x.id === id);
  if (!m) throw new Error(`Unknown milestone ${id}`);
  return m;
};
