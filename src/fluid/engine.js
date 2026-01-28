import { settings } from "./settings";
import { fluidState } from "./state";
import { createPingPongBuffer, DynamicBuffer } from "./buffer";
import { initUniforms, uniforms } from "./uniforms";
import { initPrograms, programs } from "./programs";
import { stepSimulation } from "./simulation";
import { RenderProgram } from "./renderer";

/**
 * Public engine initializer
 */
export async function initEngine(canvas) {
  if (!navigator.gpu) {
    console.error("WebGPU not supported");
    return false;
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    console.error("No WebGPU adapter found");
    return false;
  }

  const device = await adapter.requestDevice();
  const context = canvas.getContext("webgpu");
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

  context.configure({
    device,
    format: presentationFormat,
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
    alphaMode: "premultiplied",
  });

  fluidState.device = device;
  fluidState.context = context;
  fluidState.format = presentationFormat;

  // Init buffer sizes
  initSizes(device);

  // Init buffers, uniforms and programs
  initBuffers(device);
  initUniforms(device);
  initPrograms(device);

  fluidState.renderer = new RenderProgram(); // Uses fluidState internally

  // Define reset function in settings as per reference
  settings.reset = () => {
    const q = device.queue;
    fluidState.velocity.read.clear(q);
    fluidState.velocity.write.clear(q);
    fluidState.dye.read.clear(q);
    fluidState.dye.write.clear(q);
    fluidState.pressure.read.clear(q);
    fluidState.pressure.write.clear(q);
    settings.time = 0;
  };

  // Event listeners
  setupInputHandlers(canvas);

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => refreshSizes(device), 150);
  });

  fluidState.initialized = true;
  requestAnimationFrame(loop);

  return true;
}

let lastFrame = performance.now();

function loop() {
  requestAnimationFrame(loop);
  if (!fluidState.initialized) return;

  const { device } = fluidState;
  const now = performance.now();
  settings.dt = Math.min(1 / 60, (now - lastFrame) / 1000) * settings.sim_speed;
  settings.time += settings.dt;
  lastFrame = now;

  // Update uniforms
  Object.values(uniforms).forEach((u) => {
    if (u && u.update) u.update(device.queue);
  });

  // Compute fluid
  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginComputePass();
  stepSimulation(passEncoder);
  passEncoder.end();

  // Copy steps (Ping-Pong)
  // Reference: velocity0.copyTo(velocity, commandEncoder);
  // My simulation.js uses programs that output to fluidState.velocity0, etc.
  // Wait, reference simulation loop:
  // dispatchComputePipeline(passEncoder); // runs all compute shaders
  // velocity0.copyTo(velocity, commandEncoder);
  // pressure0.copyTo(pressure, commandEncoder);
  // dye.copyTo(renderProgram.buffer, commandEncoder);

  fluidState.velocity0.copyTo(fluidState.velocity, commandEncoder);
  fluidState.pressure0.copyTo(fluidState.pressure, commandEncoder);

  // Copy dye to renderer buffer
  // Reference: dye.copyTo(renderProgram.buffer, commandEncoder);
  // In reference dye is the field being updated by simulation.
  // In my state.js, I have fluidState.dye (DynamicBuffer, likely ping-pong pair if copied from reference? No, reference uses DynamicBuffer directly).
  // In my initBuffers below I will set it up matching reference.

  fluidState.dye.copyTo(fluidState.renderer.buffer, commandEncoder);

  // Draw fluid
  fluidState.renderer.dispatch(commandEncoder);

  // Send commands to the GPU
  const gpuCommands = commandEncoder.finish();
  device.queue.submit([gpuCommands]);
}

function initSizes(device) {
  const dpr = window.devicePixelRatio || 1;
  const aspectRatio = window.innerWidth / window.innerHeight;
  const maxBufferSize = device.limits.maxStorageBufferBindingSize;
  const maxCanvasSize = device.limits.maxTextureDimension2D;

  const getPreferredDimensions = (baseSize) => {
    let w, h;
    const scaledBaseSize = baseSize * dpr;

    if (aspectRatio > 1) {
      h = scaledBaseSize;
      w = Math.floor(h * aspectRatio);
    } else {
      w = scaledBaseSize;
      h = Math.floor(w / aspectRatio);
    }
    return getValidDimensions(w, h);
  };

  const getValidDimensions = (w, h) => {
    let downRatio = 1;
    if (w * h * 4 >= maxBufferSize)
      downRatio = Math.sqrt(maxBufferSize / (w * h * 4));
    if (w > maxCanvasSize) downRatio = maxCanvasSize / w;
    else if (h > maxCanvasSize) downRatio = maxCanvasSize / h;

    return {
      w: Math.floor(w * downRatio),
      h: Math.floor(h * downRatio)
    };
  };

  let gridSize = getPreferredDimensions(settings.grid_size);
  settings.grid_w = gridSize.w;
  settings.grid_h = gridSize.h;

  let dyeSize = getPreferredDimensions(settings.dye_size);
  settings.dye_w = dyeSize.w;
  settings.dye_h = dyeSize.h;

  settings.rdx = settings.grid_size * 4;
  settings.dyeRdx = settings.dye_size * 4;
  settings.dx = 1 / settings.rdx;

  const canvas = fluidState.context.canvas;
  canvas.width = settings.dye_w;
  canvas.height = settings.dye_h;
}

function initBuffers(device) {
  // Reference initBuffers()
  // velocity = new DynamicBuffer({ dims: 2 });
  // velocity0 = new DynamicBuffer({ dims: 2 });
  // dye = new DynamicBuffer({ dims: 3, w: settings.dye_w, h: settings.dye_h });
  // dye0 = new DynamicBuffer({ dims: 3, w: settings.dye_w, h: settings.dye_h });
  // ...

  fluidState.velocity = new DynamicBuffer({ dims: 2, w: settings.grid_w, h: settings.grid_h });
  fluidState.velocity0 = new DynamicBuffer({ dims: 2, w: settings.grid_w, h: settings.grid_h });

  fluidState.dye = new DynamicBuffer({ dims: 3, w: settings.dye_w, h: settings.dye_h });
  fluidState.dye0 = new DynamicBuffer({ dims: 3, w: settings.dye_w, h: settings.dye_h });

  fluidState.divergence = new DynamicBuffer({ w: settings.grid_w, h: settings.grid_h });
  fluidState.divergence0 = new DynamicBuffer({ w: settings.grid_w, h: settings.grid_h });

  fluidState.pressure = new DynamicBuffer({ w: settings.grid_w, h: settings.grid_h });
  fluidState.pressure0 = new DynamicBuffer({ w: settings.grid_w, h: settings.grid_h });

  fluidState.vorticity = new DynamicBuffer({ w: settings.grid_w, h: settings.grid_h });
}

function refreshSizes(device) {
  initSizes(device);
  initBuffers(device);
  initUniforms(device);
  initPrograms(device);
  fluidState.renderer = new RenderProgram();

  // Update grid uniform immediately
  uniforms.grid.update(device.queue, [
    settings.grid_w,
    settings.grid_h,
    settings.dye_w,
    settings.dye_h,
    settings.dx,
    settings.rdx,
    settings.dyeRdx
  ]);
}

function setupInputHandlers(canvas) {
  const mouseInfos = {
    current: null,
    last: null,
    velocity: null
  };

  const handlePointerMove = (e) => {
    const pointer = e.touches ? e.touches[0] : e;
    const rect = canvas.getBoundingClientRect();

    if (!mouseInfos.current) mouseInfos.current = [];
    mouseInfos.current[0] = (pointer.clientX - rect.left) / rect.width;
    mouseInfos.current[1] = 1 - (pointer.clientY - rect.top) / rect.height; // Invert Y

    // Update mouse uniform
    if (mouseInfos.current) {
      let dx = mouseInfos.last ? mouseInfos.current[0] - mouseInfos.last[0] : 0;
      let dy = mouseInfos.last ? mouseInfos.current[1] - mouseInfos.last[1] : 0;

      const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      if (isMobile) {
        dx *= 0.2;
        dy *= 0.2;
      }

      mouseInfos.velocity = [dx, dy];

      // Direct update to uniform if initialized
      if (uniforms.mouse) {
        uniforms.mouse.update(fluidState.device.queue, [
          ...mouseInfos.current,
          ...mouseInfos.velocity
        ]);
      }

      mouseInfos.last = [...mouseInfos.current];
    }
  };

  canvas.addEventListener("mousemove", handlePointerMove);
  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    handlePointerMove(e);
  });
  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    handlePointerMove(e);
    mouseInfos.last = [...mouseInfos.current];
  });
}
