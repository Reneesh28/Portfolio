export const settings = {
  grid_size: 64,
  dye_size: 256,
  sim_speed: 5,
  contain_fluid: true,
  velocity_add_intensity: 0.28,
  velocity_add_radius: 0.001,
  velocity_diffusion: 1,
  dye_add_intensity: 0.8,
  dye_add_radius: 0.0035,
  dye_diffusion: 0.96204,
  viscosity: 0,
  vorticity: 0,
  pressure_iterations: 8,
  buffer_view: "dye",
  input_symmetry: "none",

  // Runtime values
  grid_w: 0,
  grid_h: 0,
  dye_w: 0,
  dye_h: 0,
  dx: 0,
  rdx: 0,
  dyeRdx: 0,
  time: 0,
  dt: 0,
  reset: null
};
