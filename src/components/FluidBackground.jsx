import { useEffect, useRef } from "react";
import { initEngine } from "../fluid/engine";

export default function FluidBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    async function start() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      await initEngine(canvas);
    }

    start();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full bg-black -z-10"
    />
  );
}
