/**
 * THE WORLD FORGE — world geography (M3 blockout).
 *
 * World frame: the Forge sits at the origin; +Y is up. THE VOID lies due
 * "south" along +Z (≈199 units from the Forge) and looks north toward it.
 * The narrative journey spirals clockwise around the Forge:
 *
 *   VOID (S) → ORIGIN SANCTUM (SE) → WORLD FORGE (centre) → BLUEPRINT ARCHIVE (NE)
 *   → PATH OF ASCENSION (spiralling up to the east cliffs) → WORLDS BEYOND (floating
 *   in the eastern abyss) → HORIZON (northern tip, facing the horizon light)
 *
 * Opening-shot protection: from the Void camera (≈[0, 2.2, 226]) the view spans
 * roughly 60° left to 23.5° right of the Forge on the widest screens. Distant
 * objects don't vanish in fog — they turn into dark silhouettes against the
 * horizon glow — so everything tall sits east of that cone, or directly behind
 * the Forge (the Horizon), where the Forge itself hides it. The west stays an
 * open, dormant plain with low hills, matching the approved horizon.
 *
 * Geography only: no camera settings live here.
 */
export type Vec2 = [number, number]; // [x, z]
export type Vec3 = [number, number, number];

export type RegionId =
  | 'void'
  | 'origin-sanctum'
  | 'world-forge'
  | 'blueprint-archive'
  | 'path-of-ascension'
  | 'worlds-beyond'
  | 'horizon';

export interface RegionGeography {
  id: RegionId;
  index: number;
  name: string;
  role: string;
  /** Anchor point: centre of the region's main platform, at its ground elevation. */
  position: Vec3;
  landmass: 'mainland' | 'floating';
  /** Approximate footprint radius, for future camera targets and map markers. */
  footprint: number;
}

export const REGIONS: readonly RegionGeography[] = [
  { id: 'void', index: 0, name: 'THE VOID', role: 'Entry & identity', position: [0, 0, 199], landmass: 'mainland', footprint: 40 },
  { id: 'origin-sanctum', index: 1, name: 'THE ORIGIN SANCTUM', role: 'About', position: [110, 8, 95], landmass: 'mainland', footprint: 30 },
  { id: 'world-forge', index: 2, name: 'THE WORLD FORGE', role: 'Projects', position: [0, 0, 0], landmass: 'mainland', footprint: 60 },
  { id: 'blueprint-archive', index: 3, name: 'THE BLUEPRINT ARCHIVE', role: 'Skills', position: [155, 4, -45], landmass: 'mainland', footprint: 34 },
  { id: 'path-of-ascension', index: 4, name: 'THE PATH OF ASCENSION', role: 'Experience & education', position: [235, 56, -78], landmass: 'mainland', footprint: 60 },
  { id: 'worlds-beyond', index: 5, name: 'THE WORLDS BEYOND', role: 'Interests', position: [410, 36, -150], landmass: 'floating', footprint: 130 },
  { id: 'horizon', index: 6, name: 'THE HORIZON', role: 'Ambitions & contact', position: [25, 0, -345], landmass: 'mainland', footprint: 24 },
];

/**
 * The mainland: one organic landmass (top surface at y = 0) carrying the Void
 * plain, the Forge and the central regions. Its east coast drops into the abyss
 * where the Worlds Beyond float; a narrow northern peninsula reaches toward the Horizon.
 */
export const MAINLAND = {
  /** Sheer cliff band below the surface. */
  depth: 40,
  /** The underside narrows in steps as it descends into the abyss: [outline scale, bottom y]. */
  underside: [
    [0.82, -110],
    [0.56, -190],
    [0.26, -250],
  ] as Vec2[],
  outline: [
    [-380, 120], [-330, 300], [-170, 410], [0, 430], [160, 405], [310, 320],
    [370, 170], [345, 40], [300, -50], [290, -120], [270, -190], [215, -230],
    [150, -235], [95, -255], [70, -310], [45, -360], [10, -370], [-15, -330],
    [-25, -265], [-90, -245], [-170, -220], [-250, -175], [-310, -110], [-355, -20],
  ] as Vec2[],
} as const;

/**
 * Low, half-buried ridges and hills on the mainland plain. The western group sits
 * on the opening shot's horizon (replacing the old Void-local ridges); the rest
 * give the plain height variation elsewhere. [x, z, sizeX, height, sizeZ, yaw]
 */
export const MAINLAND_HILLS: ReadonlyArray<[number, number, number, number, number, number]> = [
  [-85, -30, 50, 12, 26, 0.6],
  [-140, 40, 60, 15, 30, 2.1],
  [-205, 5, 70, 18, 32, 4.0],
  [-125, -70, 45, 10, 22, 1.3],
  [-70, 60, 40, 9, 20, 5.2],
  [65, -75, 36, 9, 20, 0.4],
  [240, 60, 70, 20, 34, 1.7],
  [-180, -150, 70, 16, 30, 2.8],
  [-262, 200, 80, 20, 36, 0.9],
  [205, 252, 60, 14, 30, 2.6],
  [-300, 120, 60, 18, 30, 4.4],
];

/** Highland rocks behind the Ascension, on the north-east shoulder. [x, z, height] */
export const HIGHLANDS: ReadonlyArray<Vec3> = [
  [205, -200, 36], [237, -192, 30], [190, -214, 26], [282, -88, 22],
];

/** Origin Sanctum: a quiet raised terrace east of the Void approach. */
export const ORIGIN_SANCTUM = {
  top: 8,
  outline: [
    [84, 99], [92, 75], [114, 67], [134, 77], [140, 97], [132, 117], [112, 123], [94, 117],
  ] as Vec2[],
} as const;

/** Blueprint Archive: a rectilinear platform north-east of the Forge. */
export const BLUEPRINT_ARCHIVE = {
  top: 4,
  outline: [
    [125, -67], [183, -70], [187, -27], [151, -21], [127, -25],
  ] as Vec2[],
} as const;

/** Forge ward: broken ring wall around the Forge, open toward the Void and the avenues. */
export const FORGE_WARD = {
  radius: 58,
  /** Bearing ranges (degrees from +Z, clockwise seen from above) left open. */
  openings: [
    [-62, 62], // south — toward the Void approach and the Sanctum avenue
    [94, 116], // east — Blueprint Archive avenue
  ] as Vec2[],
} as const;

/** Path of Ascension: terraces spiralling up from the Archive to a summit on the east cliffs. */
export const ASCENSION_TERRACES: ReadonlyArray<{ center: Vec2; top: number; radius: number }> = [
  { center: [150, -95], top: 6, radius: 19 },
  { center: [178, -118], top: 13, radius: 18 },
  { center: [208, -138], top: 21, radius: 18 },
  { center: [238, -158], top: 29, radius: 17 },
  { center: [262, -136], top: 37, radius: 16 },
  { center: [252, -104], top: 46, radius: 16 },
  { center: [235, -78], top: 56, radius: 20 },
];

/** The Horizon: the unfinished northern tip, directly behind the Forge as seen from the Void. */
export const HORIZON = {
  anchor: [25, 0, -345] as Vec3,
  /** Fragments drifting out beyond the edge: the world continues. */
  beyond: [
    [40, -6, -430], [58, -10, -505], [70, -16, -590], [92, -22, -690],
  ] as Vec3[],
} as const;

/** Worlds Beyond: the Convergence hub and the floating territories around it. */
export const CONVERGENCE = {
  position: [410, 36, -150] as Vec3,
  radius: 24,
};

export interface FloatingTerritory {
  id: string;
  position: Vec3;
  radius: number;
  /** Depth of the rocky underside. */
  depth: number;
  stretch: Vec2;
  tilt: Vec2;
  yaw: number;
}

export const FLOATING_TERRITORIES: readonly FloatingTerritory[] = [
  { id: 'territory-north', position: [470, 55, -240], radius: 30, depth: 34, stretch: [1.25, 0.9], tilt: [0.05, -0.04], yaw: 0.4 },
  { id: 'territory-east', position: [510, 18, -110], radius: 22, depth: 22, stretch: [1.5, 0.7], tilt: [-0.03, 0.05], yaw: -0.5 },
  { id: 'territory-south', position: [425, 22, -35], radius: 26, depth: 28, stretch: [1, 1.2], tilt: [0.04, 0.03], yaw: 1.1 },
  { id: 'territory-high', position: [355, 74, -250], radius: 15, depth: 24, stretch: [1, 1], tilt: [-0.05, -0.03], yaw: 0.2 },
];

/** The six future Worlds Beyond zones and the territory reserved for each. */
export const WORLDS_BEYOND_ZONES: ReadonlyArray<{ id: string; name: string; territory: string }> = [
  { id: 'anime-manga', name: 'Anime & Manga', territory: 'territory-north' },
  { id: 'story-games', name: 'Story Games', territory: 'territory-north' },
  { id: 'formula-1', name: 'Formula 1', territory: 'territory-east' },
  { id: 'amarok', name: 'Gaming & Content Creation — AMAROK', territory: 'territory-south' },
  { id: 'guild', name: 'The Guild — AniCos', territory: 'territory-south' },
  { id: 'training-grounds', name: 'Training Grounds', territory: 'territory-high' },
];

export type RouteStyle = 'route' | 'bridge' | 'stones';

export interface WorldRoute {
  id: string;
  style: RouteStyle;
  /** Control points; y is interpolated along the route (stairs and ramps). */
  points: Vec3[];
}

/** Geographical connections between regions (no navigation behaviour). */
export const WORLD_ROUTES: readonly WorldRoute[] = [
  { id: 'void-sanctum', style: 'route', points: [[0, 0, 140], [30, 0, 128], [60, 0, 117], [80, 0, 109], [88, 4, 104], [95, 8, 100]] },
  { id: 'sanctum-forge', style: 'route', points: [[96, 8, 78], [86, 4, 70], [74, 0, 57], [55, 0, 42], [38, 0, 31]] },
  { id: 'forge-archive', style: 'route', points: [[46, 0, -14], [78, 0, -25], [108, 0, -35], [127, 4, -42]] },
  { id: 'archive-ascension', style: 'route', points: [[155, 4, -68], [153, 2, -74], [151, 6, -80]] },
  {
    id: 'summit-convergence',
    style: 'bridge',
    points: [[255, 56, -84], [300, 52, -100], [340, 46, -118], [370, 40, -132], [387, 37, -141]],
  },
  {
    // Descends below the mainland's edge line before crossing behind the Forge,
    // so it stays out of the opening shot.
    id: 'convergence-horizon',
    style: 'stones',
    points: [[395, 32, -175], [335, 18, -245], [262, 6, -292], [190, -1, -325], [110, -1.5, -345], [55, -1, -358]],
  },
];
