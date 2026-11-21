import { useMemo } from 'react';
import { createRandom, range } from '../core/random';
import {
  ASCENSION_TERRACES,
  CONVERGENCE,
  FLOATING_TERRITORIES,
  WORLD_ROUTES,
  type RouteStyle,
  type Vec3,
  type WorldRoute,
} from '../data/worldGeography';
import { darkStoneMaterial, stoneMaterial, unitBox } from '../regions/void/materials';
import InstancedSet, { type InstancePlacement } from './InstancedSet';

interface StyleSpec {
  spacing: number;
  /** Slab size before jitter: [width, thickness, length]. */
  size: Vec3;
  skip: number;
}

const STYLES: Record<RouteStyle, StyleSpec> = {
  route: { spacing: 2.6, size: [2.3, 0.3, 1.7], skip: 0.12 },
  bridge: { spacing: 3, size: [3.6, 0.7, 2.8], skip: 0.04 },
  stones: { spacing: 9, size: [2.6, 1.2, 2.4], skip: 0 },
};

/** Samples a polyline by arc length and lays one slab per step, oriented along the route. */
function layRoute(route: WorldRoute, seed: number, spacingOverride?: number): InstancePlacement[] {
  const style = STYLES[route.style];
  const spacing = spacingOverride ?? style.spacing;
  const rand = createRandom(seed);
  const items: InstancePlacement[] = [];

  for (let s = 0; s < route.points.length - 1; s++) {
    const [ax, ay, az] = route.points[s];
    const [bx, by, bz] = route.points[s + 1];
    const length = Math.hypot(bx - ax, bz - az);
    const yaw = Math.atan2(bx - ax, bz - az);
    const steps = Math.max(1, Math.round(length / spacing));
    for (let i = s === 0 ? 0 : 1; i <= steps; i++) {
      const t = i / steps;
      // Bridges break every few spans — an ancient crossing, not a walkway.
      const brokenSpan = route.style === 'bridge' && (items.length + i) % 11 >= 9;
      if (brokenSpan || rand() < style.skip) continue;
      const [w, h, l] = style.size;
      const stone = route.style === 'stones';
      items.push({
        position: [ax + (bx - ax) * t, ay + (by - ay) * t + (stone ? 0 : h / 2 - 0.05), az + (bz - az) * t],
        rotation: [0, stone ? range(rand, 0, Math.PI) : yaw + range(rand, -0.06, 0.06), 0],
        scale: [w * range(rand, 0.85, 1.15), h * (stone ? range(rand, 0.8, 1.6) : 1), l * range(rand, 0.85, 1.15)],
      });
    }
  }
  return items;
}

/** Stairs climbing between consecutive Ascension terraces, edge to edge. */
function ascensionStairs(): WorldRoute[] {
  return ASCENSION_TERRACES.slice(0, -1).map((from, i) => {
    const to = ASCENSION_TERRACES[i + 1];
    const dx = to.center[0] - from.center[0];
    const dz = to.center[1] - from.center[1];
    const d = Math.hypot(dx, dz);
    const ux = dx / d;
    const uz = dz / d;
    return {
      id: `ascension-${i}`,
      style: 'route',
      points: [
        [from.center[0] + ux * from.radius * 0.55, from.top, from.center[1] + uz * from.radius * 0.55],
        [to.center[0] - ux * to.radius * 0.55, to.top, to.center[1] - uz * to.radius * 0.55],
      ],
    };
  });
}

/** Stepping stones from the Convergence out to each floating territory. */
function territoryLinks(): WorldRoute[] {
  const [cx, cy, cz] = CONVERGENCE.position;
  return FLOATING_TERRITORIES.map((t) => {
    const [tx, ty, tz] = t.position;
    const dx = tx - cx;
    const dz = tz - cz;
    const d = Math.hypot(dx, dz);
    const start = CONVERGENCE.radius + 4;
    const end = d - t.radius * 0.9;
    return {
      id: `link-${t.id}`,
      style: 'stones',
      points: [
        [cx + (dx / d) * start, cy - 2, cz + (dz / d) * start],
        [cx + (dx / d) * end, ty - 2, cz + (dz / d) * end],
      ],
    };
  });
}

export default function WorldPaths() {
  const { slabs, bridge, stones } = useMemo(() => {
    const slabs: InstancePlacement[] = [];
    const bridge: InstancePlacement[] = [];
    const stones: InstancePlacement[] = [];
    const all = [...WORLD_ROUTES, ...ascensionStairs(), ...territoryLinks()];
    all.forEach((route, i) => {
      const placed = layRoute(route, 300 + i, route.id.startsWith('ascension') ? 1.8 : undefined);
      (route.style === 'bridge' ? bridge : route.style === 'stones' ? stones : slabs).push(...placed);
    });
    return { slabs, bridge, stones };
  }, []);

  return (
    <group>
      <InstancedSet geometry={unitBox} material={stoneMaterial} items={slabs} />
      <InstancedSet geometry={unitBox} material={stoneMaterial} items={bridge} />
      <InstancedSet geometry={unitBox} material={darkStoneMaterial} items={stones} />
    </group>
  );
}
