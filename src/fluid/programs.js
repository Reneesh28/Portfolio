import { fluidState } from "./state";
import { settings } from "./settings";
import { uniforms } from "./uniforms";
import * as shaders from "./shaders";

export const programs = {
  checker: null,
  updateDye: null,
  update: null,
  advect: null,
  boundary: null,
  divergence: null,
  boundaryDiv: null,
  pressure: null,
  boundaryPressure: null,
  gradientSubtract: null,
  advectDye: null,
  clearPressure: null,
  vorticity: null,
  vorticityConfinment: null,
};

// Creates a shader module, compute pipeline & bind group to use with the GPU
class Program {
  constructor({
    buffers = [], // Storage buffers
    uniforms: uniformList = [], // Uniform buffers
    shader, // WGSL Compute Shader as a string
    dispatchX, // Dispatch workers width
    dispatchY // Dispatch workers height
  }) {
    const { device } = fluidState;
    // Default dispatch to grid size if not specified
    this.dispatchX = dispatchX || settings.grid_w;
    this.dispatchY = dispatchY || settings.grid_h;

    this.computePipeline = device.createComputePipeline({
      layout: "auto",
      compute: {
        module: device.createShaderModule({ code: shader }),
        entryPoint: "main"
      }
    });

    const storageEntries = buffers.map((b) => b.buffers).flat();
    const uniformEntries = uniformList
      .filter((u) => u && u.buffer)
      .map((u) => u.buffer);

    const allEntries = [...storageEntries, ...uniformEntries].map(
      (buffer, i) => ({
        binding: i,
        resource: { buffer }
      })
    );

    this.bindGroup = device.createBindGroup({
      layout: this.computePipeline.getBindGroupLayout(0),
      entries: allEntries
    });
  }

  dispatch(passEncoder) {
    passEncoder.setPipeline(this.computePipeline);
    passEncoder.setBindGroup(0, this.bindGroup);
    passEncoder.dispatchWorkgroups(
      Math.ceil(this.dispatchX / 8),
      Math.ceil(this.dispatchY / 8)
    );
  }
}

class AdvectProgram extends Program {
  constructor({
    in_quantity,
    in_velocity,
    out_quantity,
    uniforms: uniformList,
    shader = shaders.advectShader,
    ...props
  }) {
    uniformList ??= [uniforms.grid];
    super({
      buffers: [in_quantity, in_velocity, out_quantity],
      uniforms: uniformList,
      shader,
      ...props
    });
  }
}

class DivergenceProgram extends Program {
  constructor({
    in_velocity,
    out_divergence,
    uniforms: uniformList,
    shader = shaders.divergenceShader
  }) {
    uniformList ??= [uniforms.grid];
    super({ buffers: [in_velocity, out_divergence], uniforms: uniformList, shader });
  }
}

class PressureProgram extends Program {
  constructor({
    in_pressure,
    in_divergence,
    out_pressure,
    uniforms: uniformList,
    shader = shaders.pressureShader
  }) {
    uniformList ??= [uniforms.grid];
    super({
      buffers: [in_pressure, in_divergence, out_pressure],
      uniforms: uniformList,
      shader
    });
  }
}

class GradientSubtractProgram extends Program {
  constructor({
    in_pressure,
    in_velocity,
    out_velocity,
    uniforms: uniformList,
    shader = shaders.gradientSubtractShader
  }) {
    uniformList ??= [uniforms.grid];
    super({
      buffers: [in_pressure, in_velocity, out_velocity],
      uniforms: uniformList,
      shader
    });
  }
}

class BoundaryProgram extends Program {
  constructor({
    in_quantity,
    out_quantity,
    uniforms: uniformList,
    shader = shaders.boundaryShader
  }) {
    uniformList ??= [uniforms.grid];
    super({ buffers: [in_quantity, out_quantity], uniforms: uniformList, shader });
  }
}

class UpdateProgram extends Program {
  constructor({
    in_quantity,
    out_quantity,
    uniforms: uniformList,
    shader = shaders.updateVelocityShader,
    ...props
  }) {
    uniformList ??= [uniforms.grid];
    super({ buffers: [in_quantity, out_quantity], uniforms: uniformList, shader, ...props });
  }
}

class VorticityProgram extends Program {
  constructor({
    in_velocity,
    out_vorticity,
    uniforms: uniformList,
    shader = shaders.vorticityShader,
    ...props
  }) {
    uniformList ??= [uniforms.grid];
    super({
      buffers: [in_velocity, out_vorticity],
      uniforms: uniformList,
      shader,
      ...props
    });
  }
}

class VorticityConfinmentProgram extends Program {
  constructor({
    in_velocity,
    in_vorticity,
    out_velocity,
    uniforms: uniformList,
    shader = shaders.vorticityConfinmentShader,
    ...props
  }) {
    uniformList ??= [uniforms.grid];
    super({
      buffers: [in_velocity, in_vorticity, out_velocity],
      uniforms: uniformList,
      shader,
      ...props
    });
  }
}

export function initPrograms(device) {
  // We assume buffers are initialized in state.js and available via fluidState
  const { velocity, dye, divergence, pressure, vorticity } = fluidState;

  // NOTE: fluidState buffers structure needs to match what these programs expect.
  // The reference uses "velocity" and "velocity0".
  // My buffer.js createPingPongBuffer returns { read, write }.
  // I should probably map these to what the programs expect.
  // Actually, I need to check how state.js initializes these.
  // If state.js uses createPingPongBuffer, it has .read and .write.
  // The reference swaps them manually or by passing them differently?
  // 
  // Reference initPrograms():
  // updateProgram = new UpdateProgram({ in_quantity: velocity, out_quantity: velocity0 ... })
  // 
  // So reference has TWO DynamicBuffers for velocity.
  // I should check state.js later to ensure it provides velocity and velocity0.
  // For now I will assume fluidState has the properties as needed, or I'll fix state.js next.
  // Assuming fluidState has velocity, velocity0, dye, dye0, etc. directly.

  programs.checker = new Program({
    buffers: [dye],
    shader: shaders.checkerboardShader,
    dispatchX: settings.dye_w,
    dispatchY: settings.dye_h,
    uniforms: [uniforms.grid, uniforms.time]
  });

  programs.updateDye = new UpdateProgram({
    in_quantity: dye,
    out_quantity: fluidState.dye0,
    uniforms: [
      uniforms.grid,
      uniforms.mouse,
      uniforms.dye_force,
      uniforms.dye_radius,
      uniforms.dye_diff,
      uniforms.time,
      uniforms.dt,
      uniforms.uSymmetry
    ],
    dispatchX: settings.dye_w,
    dispatchY: settings.dye_h,
    shader: shaders.updateDyeShader
  });

  programs.update = new UpdateProgram({
    in_quantity: velocity,
    out_quantity: fluidState.velocity0,
    uniforms: [
      uniforms.grid,
      uniforms.mouse,
      uniforms.vel_force,
      uniforms.vel_radius,
      uniforms.vel_diff,
      uniforms.dt,
      uniforms.time,
      uniforms.uSymmetry
    ]
  });

  programs.advect = new AdvectProgram({
    in_quantity: fluidState.velocity0,
    in_velocity: fluidState.velocity0,
    out_quantity: velocity,
    uniforms: [uniforms.grid, uniforms.dt]
  });

  programs.boundary = new BoundaryProgram({
    in_quantity: velocity,
    out_quantity: fluidState.velocity0,
    uniforms: [uniforms.grid, uniforms.containFluid]
  });

  programs.divergence = new DivergenceProgram({
    in_velocity: fluidState.velocity0,
    out_divergence: fluidState.divergence0
  });

  programs.boundaryDiv = new BoundaryProgram({
    in_quantity: fluidState.divergence0,
    out_quantity: divergence,
    shader: shaders.boundaryPressureShader // Using boundaryPressureShader for div boundary? Reference does this.
  });

  programs.pressure = new PressureProgram({
    in_pressure: pressure,
    in_divergence: divergence,
    out_pressure: fluidState.pressure0
  });

  programs.boundaryPressure = new BoundaryProgram({
    in_quantity: fluidState.pressure0,
    out_quantity: pressure,
    shader: shaders.boundaryPressureShader
  });

  programs.gradientSubtract = new GradientSubtractProgram({
    in_pressure: pressure,
    in_velocity: fluidState.velocity0,
    out_velocity: velocity
  });

  programs.advectDye = new AdvectProgram({
    in_quantity: fluidState.dye0,
    in_velocity: velocity,
    out_quantity: dye,
    uniforms: [uniforms.grid, uniforms.dt],
    dispatchX: settings.dye_w,
    dispatchY: settings.dye_h,
    shader: shaders.advectDyeShader
  });

  programs.clearPressure = new UpdateProgram({
    in_quantity: pressure,
    out_quantity: fluidState.pressure0,
    uniforms: [uniforms.grid, uniforms.viscosity],
    shader: shaders.clearPressureShader
  });

  programs.vorticity = new VorticityProgram({
    in_velocity: velocity,
    out_vorticity: vorticity
  });

  programs.vorticityConfinment = new VorticityConfinmentProgram({
    in_velocity: velocity,
    in_vorticity: vorticity,
    out_velocity: fluidState.velocity0,
    uniforms: [uniforms.grid, uniforms.dt, uniforms.uVorticity]
  });
}
