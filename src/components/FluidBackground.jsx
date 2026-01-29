import { useEffect, useRef, useState } from "react";
import { initEngine } from "../fluid/engine";

export default function FluidBackground() {
  const canvasRef = useRef(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    async function start() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      try {
        const success = await initEngine(canvas);
        if (!success) {
          console.warn("Fluid engine failed to initialize (WebGPU likely unsupported).");
          setIsSupported(false);
        }
      } catch (e) {
        console.error("Fluid engine error:", e);
        setIsSupported(false);
      }
    }

    start();
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 w-full h-full bg-black -z-10 ${!isSupported ? "hidden" : ""}`}
      />
      {!isSupported && (
        <div className="fixed inset-0 w-full h-full -z-20 bg-gradient-to-br from-neutral-900 via-black to-neutral-900" />
      )}
    </>
  );
}
