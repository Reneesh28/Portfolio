import { useEffect, useRef } from "react";

export default function FluidBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Global mouse tracking
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = 1 - e.clientY / window.innerHeight;

      if (!window.mouseInfos) return;

      if (!window.mouseInfos.current) {
        window.mouseInfos.current = [x, y];
        window.mouseInfos.last = [x, y];
      } else {
        window.mouseInfos.current[0] = x;
        window.mouseInfos.current[1] = y;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", (e) => {
      const t = e.touches[0];
      handleMouseMove({ clientX: t.clientX, clientY: t.clientY });
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="fluid-webgpu"
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
    />
  );
}
