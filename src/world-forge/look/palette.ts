/**
 * THE WORLD FORGE — blueprint palette (P1 look development, DEC-010).
 *
 * Sampled by eye from the owner's three blueprint images: an indigo-to-violet
 * sky over a sea of purple cloud, dark slate islands, the Forge's gold as the
 * brightest light in the world, and one accent per region (DEC-016 mapping).
 * Every later phase takes its colours from here.
 */
export const BLUEPRINT = {
  sky: {
    zenith: '#07061a',
    upper: '#160f3a',
    horizon: '#4a2a86',
    glow: '#8d5fd6',
  },
  cloud: {
    shadow: '#24164a',
    body: '#5b3f9a',
    light: '#b9a2f0',
  },
  fog: '#2a1d52',
  mountain: '#1a1440',
  stone: {
    dark: '#1d1d2e',
    mid: '#34324a',
    light: '#57536e',
  },
  gold: {
    core: '#ffd27a',
    hot: '#fff1c9',
    accent: '#e8a546',
    deep: '#b8701f',
  },
  moon: '#c8c2ff',
  portal: '#a46bff',
  water: '#9fd7ff',
  /** Region accents (blueprint biomes mapped onto the locked regions, plan §3). */
  region: {
    void: '#a46bff',
    originSanctum: '#3fd08a',
    worldForge: '#ffc861',
    blueprintArchive: '#4fb4ff',
    pathOfAscension: '#dfe9ff',
    worldsBeyond: ['#ff5a3c', '#b06bff', '#3fc9b0', '#e3b35a', '#9aa7b8', '#5d4bd6'],
    horizon: '#f2d38a',
  },
} as const;
