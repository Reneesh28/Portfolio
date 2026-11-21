export type ExperienceMode = 'classic' | 'world';

/**
 * Resolves which experience to mount.
 * World Forge is the default in every environment;
 * the Classic portfolio is mounted only with an explicit `?mode=classic`.
 */
export function resolveMode(search: string = window.location.search): ExperienceMode {
  return new URLSearchParams(search).get('mode') === 'classic' ? 'classic' : 'world';
}

/** Current URL with `mode=classic` set — the link to the Classic portfolio. */
export function classicHref(href: string = window.location.href): string {
  const url = new URL(href);
  url.searchParams.set('mode', 'classic');
  return `${url.pathname}${url.search}${url.hash}`;
}
