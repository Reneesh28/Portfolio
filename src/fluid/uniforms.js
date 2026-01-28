import { settings } from "./settings";
import { fluidState } from "./state";
import { Uniform } from "./uniform";

export const uniforms = {
  time: null,
  dt: null,
  grid: null,
  mouse: null,
  // Simulation params
  uSimSpeed: null,
  vel_force: null,
  vel_radius: null,
  vel_diff: null,
  dye_force: null,
  dye_radius: null,
  dye_diff: null,
  viscosity: null,
  uVorticity: null,
  containFluid: null,
  uSymmetry: null,
  uRenderIntensity: null
};

export function initUniforms(device) {
  uniforms.time = new Uniform("time");
  uniforms.dt = new Uniform("dt");
  uniforms.mouse = new Uniform("mouseInfos", { size: 4 });
  uniforms.grid = new Uniform("gridSize", {
    size: 7,
    value: [
      settings.grid_w,
      settings.grid_h,
      settings.dye_w,
      settings.dye_h,
      settings.dx,
      settings.rdx,
      settings.dyeRdx
    ]
  });

  uniforms.uSimSpeed = new Uniform("sim_speed", { value: settings.sim_speed });
  uniforms.vel_force = new Uniform("velocity_add_intensity", {
    value: settings.velocity_add_intensity
  });
  uniforms.vel_radius = new Uniform("velocity_add_radius", {
    value: settings.velocity_add_radius
  });
  uniforms.vel_diff = new Uniform("velocity_diffusion", {
    value: settings.velocity_diffusion
  });
  uniforms.dye_force = new Uniform("dye_add_intensity", {
    value: settings.dye_add_intensity
  });
  uniforms.dye_radius = new Uniform("dye_add_radius", {
    value: settings.dye_add_radius
  });
  uniforms.dye_diff = new Uniform("dye_diffusion", {
    value: settings.dye_diffusion
  });
  uniforms.viscosity = new Uniform("viscosity", {
    value: settings.viscosity
  });
  uniforms.uVorticity = new Uniform("vorticity", {
    value: settings.vorticity
  });
  uniforms.containFluid = new Uniform("contain_fluid", {
    value: settings.contain_fluid
  });
  uniforms.uSymmetry = new Uniform("mouse_type", { value: 0 }); // Hardcoded 0 as per reference init
  uniforms.uRenderIntensity = new Uniform("render_intensity_multiplier", { value: 1 });
}
