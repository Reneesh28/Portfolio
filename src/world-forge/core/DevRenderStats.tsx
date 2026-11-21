import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

/**
 * Development only: publishes the previous frame's renderer counters on
 * `window.__worldForge.render` (and the camera pose on `.camera`), so automation can
 * check performance budgets and camera motion.
 * Mounted behind `import.meta.env.DEV`, so production builds drop it.
 */
export default function DevRenderStats() {
  useFrame(({ gl, camera, size }) => {
    const handle = window.__worldForge;
    if (!handle) return;
    // Post-processing renders several passes per frame: accumulate them, read last frame's total, then reset.
    gl.info.autoReset = false;
    const { render, memory, programs } = gl.info;
    handle.render = {
      calls: render.calls,
      triangles: render.triangles,
      points: render.points,
      geometries: memory.geometries,
      textures: memory.textures,
      programs: programs?.length ?? 0,
    };
    gl.info.reset();
    handle.camera = {
      position: camera.position.toArray(),
      fov: (camera as { fov?: number }).fov ?? 0,
      // World point → CSS pixels in the canvas (for picking checks).
      toScreen: (point) => {
        const p = new Vector3().fromArray(point).project(camera);
        return [((p.x + 1) / 2) * size.width, ((1 - p.y) / 2) * size.height, p.z];
      },
    };
  });
  return null;
}
