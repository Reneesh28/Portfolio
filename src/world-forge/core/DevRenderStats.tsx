import { useFrame } from '@react-three/fiber';

/**
 * Development only: publishes the previous frame's renderer counters on
 * `window.__worldForge.render`, so automation can check performance budgets.
 * Mounted behind `import.meta.env.DEV`, so production builds drop it.
 */
export default function DevRenderStats() {
  useFrame(({ gl }) => {
    const handle = window.__worldForge;
    if (!handle) return;
    const { render, memory, programs } = gl.info;
    handle.render = {
      calls: render.calls,
      triangles: render.triangles,
      points: render.points,
      geometries: memory.geometries,
      textures: memory.textures,
      programs: programs?.length ?? 0,
    };
  });
  return null;
}
