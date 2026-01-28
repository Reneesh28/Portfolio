export const timeState = {
  last: performance.now(),
  time: 0,
  dt: 0,
};

export function updateTime() {
  const now = performance.now();
  timeState.dt = Math.min(0.033, (now - timeState.last) / 1000);
  timeState.time += timeState.dt;
  timeState.last = now;
}
