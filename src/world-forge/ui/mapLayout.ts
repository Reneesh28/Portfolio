/**
 * World Map layout (P5, DEC-020): projects the archipelago geography onto a flat,
 * north-up map. The same data drives the 3D world, so the map can't drift from it.
 * Pure: positions are shares (0–1) of the map's width and height.
 */
import { HORIZON_BEYOND, ISLANDS, REGIONS, WORLD_ROUTES, type RegionId, type Vec3 } from '../data/worldGeography';

/** Regions lower than this (share of the map height) show their label above the island on phones, so their tap target stays on the map. */
export const MAP_LABEL_FLIP = 0.8;

export interface MapPoint {
  x: number;
  y: number;
}

export interface MapIsland extends MapPoint {
  id: string;
  region: RegionId;
  /** Radius as a share of the map width. */
  r: number;
  accent: string;
}

export interface MapRegion extends MapPoint {
  id: RegionId;
  index: number;
  name: string;
  role: string;
}

export interface MapLayout {
  /** Map aspect (width / height) the shares are computed for. */
  aspect: number;
  islands: MapIsland[];
  routes: Array<{ id: string; from: MapPoint; to: MapPoint }>;
  regions: MapRegion[];
}

/**
 * North-up projection: world +X (east) → right, world −Z (north) → up. The world's
 * bounds (islands plus the Horizon's drifting fragments) are fitted with padding,
 * keeping true proportions.
 */
export function computeMapLayout(aspect = 1.6, padding = 0.08): MapLayout {
  const xs = [...ISLANDS.flatMap((i) => [i.position[0] - i.radius, i.position[0] + i.radius]), ...HORIZON_BEYOND.map((p) => p[0])];
  const zs = [...ISLANDS.flatMap((i) => [i.position[2] - i.radius, i.position[2] + i.radius]), ...HORIZON_BEYOND.map((p) => p[2])];
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minZ = Math.min(...zs);
  const maxZ = Math.max(...zs);
  const spanX = maxX - minX;
  const spanZ = maxZ - minZ;
  // One scale for both axes (true proportions), fitted inside the padded map. `scale` is in
  // width-shares per metre; the same metre is `aspect` times larger as a share of the height.
  const scale = Math.min((1 - 2 * padding) / spanX, (1 - 2 * padding) / (spanZ * aspect));
  const offsetX = (1 - spanX * scale) / 2;
  const offsetY = (1 - spanZ * scale * aspect) / 2;
  const project = ([x, , z]: Vec3 | readonly number[]): MapPoint => ({
    x: offsetX + (x - minX) * scale,
    y: offsetY + (z - minZ) * scale * aspect,
  });

  const accentOf = (id: RegionId) => REGIONS.find((r) => r.id === id)?.accent ?? '#ffffff';
  return {
    aspect,
    islands: ISLANDS.map((i) => ({ id: i.id, region: i.region, r: i.radius * scale, accent: accentOf(i.region), ...project(i.position) })),
    routes: WORLD_ROUTES.map((route) => ({ id: route.id, from: project(route.from), to: project(route.to) })),
    regions: REGIONS.map((r) => ({ id: r.id, index: r.index, name: r.name, role: r.role, ...project(r.position) })),
  };
}
