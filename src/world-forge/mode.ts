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

/**
 * Development-only look-development view (`?lookdev` or `?lookdev=2`): the 0-based
 * view index, or null when not requested. Production builds never mount it.
 */
export function lookDevView(search: string = window.location.search): number | null {
  const params = new URLSearchParams(search);
  if (!params.has('lookdev')) return null;
  const n = Number(params.get('lookdev'));
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) - 1 : 0;
}
