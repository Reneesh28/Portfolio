export const fluidState = {
  device: null,
  context: null,
  format: null,

  grid: { width: 0, height: 0 },
  dye: { width: 0, height: 0 },

  // Buffers
  velocity: null,  // DynamicBuffer
  velocity0: null, // DynamicBuffer
  dyeField: null,  // DynamicBuffer (renaming to 'dye' to match reference? programs.js expects 'dye')
  // Wait, programs.js uses fluidState.dye. The original code used 'dye'. 
  // I should rename 'dyeField' to 'dye' to be consistent with reference and programs.js
  dye: null,
  dye0: null,

  divergence: null,
  divergence0: null,

  pressure: null,
  pressure0: null,

  vorticity: null,

  renderer: null,

  initialized: false,
};
