import { renderShader } from "./shaders";
import { fluidState } from "./state";
import { settings } from "./settings";
import { uniforms } from "./uniforms";
import { DynamicBuffer } from "./buffer";

// Renders 3 (r, g, b) storage buffers to the canvas
export class RenderProgram {
  constructor() {
    const { device } = fluidState;

    const vertices = new Float32Array([
      -1, -1, 0, 1, -1, 1, 0, 1, 1, -1, 0, 1,
      1, -1, 0, 1, -1, 1, 0, 1, 1, 1, 0, 1
    ]);

    this.vertexBuffer = device.createBuffer({
      size: vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true
    });
    new Float32Array(this.vertexBuffer.getMappedRange()).set(vertices);
    this.vertexBuffer.unmap();

    const vertexBuffersDescriptors = [
      {
        attributes: [
          {
            shaderLocation: 0,
            offset: 0,
            format: "float32x4"
          }
        ],
        arrayStride: 16,
        stepMode: "vertex"
      }
    ];

    const shaderModule = device.createShaderModule({
      code: renderShader
    });

    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    // Ideally we should get this from fluidState or pass it in. 
    // fluidState.format should hold it.

    this.renderPipeline = device.createRenderPipeline({
      layout: "auto",
      vertex: {
        module: shaderModule,
        entryPoint: "vertex_main",
        buffers: vertexBuffersDescriptors
      },
      fragment: {
        module: shaderModule,
        entryPoint: "fragment_main",
        targets: [
          {
            format: fluidState.format || presentationFormat
          }
        ]
      },
      primitive: {
        topology: "triangle-list"
      }
    });

    // The r,g,b buffer containing the data to render
    this.buffer = new DynamicBuffer({
      dims: 3,
      w: settings.dye_w,
      h: settings.dye_h
    });

    // Uniforms
    const entries = [
      ...this.buffer.buffers,
      uniforms.grid.buffer,
      uniforms.uRenderIntensity.buffer
    ].map((b, i) => ({
      binding: i,
      resource: { buffer: b }
    }));

    this.renderBindGroup = device.createBindGroup({
      layout: this.renderPipeline.getBindGroupLayout(0),
      entries
    });

    this.renderPassDescriptor = {
      colorAttachments: [
        {
          clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
          loadOp: "clear",
          storeOp: "store"
        }
      ]
    };
  }

  // Dispatch a draw command to render on the canvas
  dispatch(commandEncoder) {
    const { context } = fluidState;

    this.renderPassDescriptor.colorAttachments[0].view = context
      .getCurrentTexture()
      .createView();

    const renderPassEncoder = commandEncoder.beginRenderPass(
      this.renderPassDescriptor
    );

    renderPassEncoder.setPipeline(this.renderPipeline);
    renderPassEncoder.setBindGroup(0, this.renderBindGroup);
    renderPassEncoder.setVertexBuffer(0, this.vertexBuffer);
    renderPassEncoder.draw(6);
    renderPassEncoder.end();
  }
}

