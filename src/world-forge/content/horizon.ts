/**
 * The Horizon's content and the contact details (M8; DEC-034).
 *
 * - The closing text is locked and exact (master doc §1, doc 06).
 * - The ambitions are the master doc's six themes, as written: no source has more (doc 11).
 * - Contact: GitHub and email from the CV (Classic agrees); LinkedIn as the CV's own link target
 *   (Classic agrees); the résumé is the CV itself. No phone number (private; not in the master
 *   doc's contact list). The links were tested on 2026-11-22 (DEC-034).
 */

/** THE GREATEST CREATION IS STILL AHEAD. Every world begins with an idea. This one is only getting started. */
export const CLOSING = {
  headline: 'THE GREATEST CREATION IS STILL AHEAD.',
  lines: ['Every world begins with an idea.', 'This one is only getting started.'],
  source: 'master doc §1 and doc 06 (locked, exact)',
} as const;

/** The master doc's six ambition themes for the Horizon, as written. */
export const AMBITIONS = {
  items: ['AI/ML engineering ambitions', 'Original games', 'Original IP and universes', 'Indie development', 'Content creation', 'Meaningful experiences'],
  source: 'master doc §6 Region 06 (owner-written; shown as written, DEC-034)',
} as const;

export interface ContactLink {
  id: 'email' | 'github' | 'linkedin' | 'resume';
  label: string;
  /** What the visitor sees (the address itself, for email). */
  text: string;
  href: string;
  /** Opens in a new tab (everything but email). */
  external: boolean;
}

export const CONTACT: readonly ContactLink[] = [
  { id: 'email', label: 'Email', text: 'reneesh3508925@gmail.com', href: 'mailto:reneesh3508925@gmail.com', external: false },
  { id: 'github', label: 'GitHub', text: 'github.com/Reneesh28', href: 'https://github.com/Reneesh28', external: true },
  { id: 'linkedin', label: 'LinkedIn', text: 'linkedin.com/in/balam-reneesh', href: 'https://www.linkedin.com/in/balam-reneesh', external: true },
  { id: 'resume', label: 'Resume', text: 'Resume (PDF)', href: '/resume.pdf', external: true },
];

export const CONTACT_SOURCE = 'CV (public/resume.pdf, DEC-025; LinkedIn per its link target) and Classic agree; tested 2026-11-22 (DEC-034)';
