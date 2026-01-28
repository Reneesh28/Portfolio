import { fluidState } from "./state";
import { settings } from "./settings";

// Manage uniform buffers relative to the compute shaders
export class Uniform {
  constructor(name, { size, value } = {}) {
    const { device } = fluidState;
    this.name = name;
    this.size = size ?? (value && typeof value === "object" ? value.length : 1);
    this.needsUpdate = false;

    if (this.size === 1) {
      if (settings[name] == null) {
        settings[name] = value ?? 0;
        this.alwaysUpdate = true;
      }
    }

    if (this.size === 1 || value != null) {
      this.buffer = device.createBuffer({
        mappedAtCreation: true,
        size: this.size * 4,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      });

      const arrayBuffer = this.buffer.getMappedRange();
      const sourceValue = value ?? [settings[this.name]];
      const sourceArray =
        typeof sourceValue === "number"
          ? [sourceValue]
          : Array.isArray(sourceValue)
            ? sourceValue
            : [0]; // Default to [0] if value is invalid
      new Float32Array(arrayBuffer).set(new Float32Array(sourceArray));
      this.buffer.unmap();
    } else {
      this.buffer = device.createBuffer({
        size: this.size * 4,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      });
    }
  }

  setValue(value) {
    settings[this.name] = value;
    this.needsUpdate = true;
  }

  update(queue, value) {
    if (this.needsUpdate || this.alwaysUpdate || value != null) {
      if (typeof this.needsUpdate !== "boolean") value = this.needsUpdate;
      queue.writeBuffer(
        this.buffer,
        0,
        new Float32Array(value ?? [parseFloat(settings[this.name])]),
        0,
        this.size
      );
      this.needsUpdate = false;
    }
  }
}
