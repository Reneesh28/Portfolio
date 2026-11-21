import React, { useState, useEffect } from 'react';
import { Linkedin, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';
import gsap from 'gsap';

const controlClass = "w-10 h-10 bg-surface text-text border border-border rounded-md flex items-center justify-center hover:bg-surface-raised transition-colors";

const GlobalControls = () => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [motionReduced, setMotionReduced] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Example of toggling a class on body to respect reduced motion if animations check it
  useEffect(() => {
    if (motionReduced) {
      document.body.classList.add('reduce-motion');
      gsap.globalTimeline.timeScale(999); // Instantly finish non-scrub animations
    } else {
      document.body.classList.remove('reduce-motion');
      gsap.globalTimeline.timeScale(1);
    }
  }, [motionReduced]);

  return (
    <div className="fixed bottom-4 right-4 z-[999] flex flex-col gap-2 pointer-events-auto">
      <a
        href="https://www.linkedin.com/in/balam-reneesh"
        target="_blank"
        rel="noreferrer"
        className={controlClass}
        aria-label="LinkedIn Profile"
      >
        <Linkedin size={18} />
      </a>

      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className={controlClass}
        aria-label={soundEnabled ? "Mute UI Sounds" : "Enable UI Sounds"}
        title={soundEnabled ? "Mute UI Sounds" : "Enable UI Sounds"}
      >
        {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>

      <button
        onClick={() => setMotionReduced(!motionReduced)}
        className={controlClass}
        aria-label={motionReduced ? "Enable Animations" : "Reduce Motion"}
        title={motionReduced ? "Enable Animations" : "Reduce Motion"}
      >
        {motionReduced ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

export default GlobalControls;
