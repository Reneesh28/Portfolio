import { fluidState } from "./state"; // Need access to device from fluidState

/**
 * GPU buffer helpers
 */

// Creates and manage multi-dimensional buffers by creating a buffer for each dimension
export class DynamicBuffer {
  constructor({
    dims = 1, // Number of dimensions
    w, // Buffer width
    h  // Buffer height
  } = {}) {
    const { device, grid } = fluidState;
    w = w || grid.width;
    h = h || grid.height;

    this.dims = dims;
    this.bufferSize = w * h * 4;
    this.w = w;
    this.h = h;
    this.buffers = new Array(dims).fill().map((_) =>
      device.createBuffer({
        size: this.bufferSize,
        usage:
          GPUBufferUsage.STORAGE |
          GPUBufferUsage.COPY_SRC |
          GPUBufferUsage.COPY_DST
      })
    );
  }

  // Copy each buffer to another DynamicBuffer's buffers.
  // If the dimensions don't match, the last non-empty dimension will be copied instead
  copyTo(buffer, commandEncoder) {
    for (let i = 0; i < Math.max(this.dims, buffer.dims); i++) {
      commandEncoder.copyBufferToBuffer(
        this.buffers[Math.min(i, this.buffers.length - 1)],
        0,
        buffer.buffers[Math.min(i, buffer.buffers.length - 1)],
        0,
        this.bufferSize
      );
    }
  }

  // Reset all the buffers
  clear(queue) {
    for (let i = 0; i < this.dims; i++) {
      queue.writeBuffer(this.buffers[i], 0, new Float32Array(this.w * this.h));
    }
  }
}

export function createPingPongBuffer(device, width, height, dims = 1) {
  // Note: The reference doesn't strictly use ping-pong objects with read/write properties in the same way,
  // but relies on swapping program inputs/outputs.
  // However, keeping the ping-pong structure might be useful or I should adapt to the reference.
  // The reference initBuffers():
  // velocity = new DynamicBuffer({ dims: 2 });
  // velocity0 = new DynamicBuffer({ dims: 2 });
  // So it uses two separate DynamicBuffer instances.

  // I will keep this helper but make it return two DynamicBuffers if that helps, 
  // or just use DynamicBuffer directly in engine.js init.

  return {
    read: new DynamicBuffer({ dims, w: width, h: height }), // device is accessed via fluidState singleton in my adaptation
    write: new DynamicBuffer({ dims, w: width, h: height })
  };
}
