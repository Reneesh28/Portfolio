/**
 * Worlds Beyond interests (M7; concepts and content approved, DEC-032).
 *
 * The six interests are the owner's (master doc §6); what each territory says is the owner's
 * own words (DEC-032) or the CV (DEC-025). Nothing is invented (doc 11). Text only: no
 * character art, logos or team marks (master doc). A territory opens a panel only once it is
 * built and has content; Story-driven Games has no text yet, so it stays closed.
 */

export type TerritoryId = 'anime' | 'stories' | 'f1' | 'creator' | 'guild' | 'training';

export interface TerritorySection {
  /** The sub-landmark or heading this section belongs to. */
  heading?: string;
  lines: readonly string[];
}

export interface Territory {
  id: TerritoryId;
  title: string;
  /** Short name for the Convergence card. */
  short: string;
  /** The P2 island it stands on. */
  island: string;
  /** Built in the world yet (M7 builds them in stages, DEC-032). */
  built: boolean;
  /** Set apart as a quote, if any. */
  quote?: string;
  sections: readonly TerritorySection[];
  links: ReadonlyArray<{ label: string; href: string }>;
  source: string;
}

const OWNER = 'owner, DEC-032 (2026-11-22)';

/** The six territories, in the order the master doc lists them. */
export const TERRITORIES: readonly Territory[] = [
  {
    id: 'anime',
    title: 'Anime & Manga',
    short: 'Anime',
    island: 'wb-ember',
    built: false,
    sections: [{ lines: ['One Piece'] }],
    links: [],
    source: OWNER,
  },
  {
    id: 'stories',
    title: 'Story-driven Games',
    short: 'Stories',
    island: 'wb-shadow',
    built: false,
    sections: [],
    links: [],
    source: 'none yet (the owner has not supplied text)',
  },
  {
    id: 'f1',
    title: 'Formula 1',
    short: 'F1',
    island: 'wb-steel',
    built: false,
    quote: "It's not over until it's over.",
    sections: [{ lines: ['The Max Verstappen mentality.'] }],
    links: [],
    source: OWNER,
  },
  {
    id: 'creator',
    title: 'Gaming & Content Creation',
    short: 'Creator',
    island: 'wb-temporal',
    built: false,
    sections: [{ lines: ['Void Ronin'] }],
    links: [{ label: 'void_ronin.exe on Instagram', href: 'https://www.instagram.com/void_ronin.exe/' }],
    source: OWNER,
  },
  {
    id: 'guild',
    title: 'The Guild',
    short: 'Guild',
    island: 'wb-sunken',
    built: true,
    sections: [
      { heading: 'Hall', lines: ['AniCos Student Organization'] },
      { heading: 'Chronicle', lines: ['Volunteer → Board Member → Co-CEO, over two years.'] },
      { heading: 'Assembly', lines: ['Leading 50+ members.'] },
      { heading: 'Stage', lines: ['CosCon 2.0', 'Spooky Nights 2.0'] },
    ],
    links: [],
    source: `${OWNER} (members, events); CV (public/resume.pdf, DEC-025) for the progression`,
  },
  {
    id: 'training',
    title: 'The Training Grounds',
    short: 'Training',
    island: 'wb-dunes',
    built: false,
    quote: 'A king never wavers. A king never bends. A king never relies on others. A king never gives up.',
    sections: [],
    links: [],
    source: OWNER,
  },
];

export const TERRITORY_IDS: readonly TerritoryId[] = TERRITORIES.map((t) => t.id);

export const isTerritory = (value: string | null): value is TerritoryId => value !== null && (TERRITORY_IDS as readonly string[]).includes(value);

export const territoryById = (id: TerritoryId): Territory => {
  const t = TERRITORIES.find((x) => x.id === id);
  if (!t) throw new Error(`Unknown territory ${id}`);
  return t;
};

/** Has something to show: built, with a quote, a section or a link. */
export const hasContent = (t: Territory): boolean => Boolean(t.quote) || t.sections.length > 0 || t.links.length > 0;

/** Territories a visitor can open now: built and with content. */
export const openTerritories = (): Territory[] => TERRITORIES.filter((t) => t.built && hasContent(t));
