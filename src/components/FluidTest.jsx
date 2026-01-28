import { useEffect, useRef } from "react";
import { initEngine } from "../fluid/engine";

export default function FluidTest() {
  const canvasRef = useRef(null);

  useEffect(() => {
    async function start() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const success = await initEngine(canvas);
      if (!success) {
        console.error("Failed to initialize fluid engine");
      }
    }

    start();

    // Cleanup is handled loosely by browser context loss if component unmounts,
    // but ideally engine.js should expose a cleanup method. 
    // For now the reference code didn't provide one, so we just let it be.
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full bg-black"
    />
  );
}
