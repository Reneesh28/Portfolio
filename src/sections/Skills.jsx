import { useState, useEffect, useMemo, useRef } from "react";
import skills from "../data/skills";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiCode, FiLayers, FiDatabase, FiCpu, FiGlobe } from "react-icons/fi";
import FloatingSkillsBackground from "../components/FloatingSkillsBackground";

gsap.registerPlugin(ScrollTrigger);

// Categorize skills for orbits
const categorizeSkills = () => {
  const allSkills = skills.flatMap((cat) =>
    cat.items.map(item => ({ ...item, category: cat.category }))
  );

  // Inner Ring: Core Languages & Frontend
  const innerKeywords = [
    "Python", "JavaScript", "React.js", "Node.js", "Next.js",
    "HTML5", "CSS3", "TypeScript", "Tailwind CSS"
  ];

  const inner = [];
  const outer = [];

  allSkills.forEach((skill) => {
    if (innerKeywords.includes(skill.name)) {
      inner.push(skill);
    } else {
      outer.push(skill);
    }
  });

  return { inner, outer };
};

export default function Skills() {
  const { inner, outer } = useMemo(() => categorizeSkills(), []);
  const [activeSkill, setActiveSkill] = useState(null);
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  // Default Title
  const defaultTitle = { name: "Skills", level: "Technical Arsenal" };
  const currentDisplay = activeSkill || defaultTitle;
  const Icon = activeSkill?.icon || FiCode;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance Animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%", // Start when section is comfortably in view
          end: "bottom bottom",
          toggleActions: "play none none reverse",
        },
      });

      /*
      tl.from(".skills-center", {
        scale: 0.5,
        opacity: 1, // FORCE VISIBLE for debug
        duration: 0.8,
        ease: "back.out(1.7)",
      })
      */
      tl.set(".skills-center", { opacity: 1 }); // Ensure it starts visible
      tl.from(".orbit-ring-inner", {
        scale: 0.8,
        opacity: 0,
        rotation: -45,
        duration: 1,
        ease: "power3.out",
      }, "-=0.6")
        .from(".orbit-ring-outer", {
          scale: 0.8,
          opacity: 0,
          rotation: 45,
          duration: 1,
          ease: "power3.out",
        }, "-=0.8")
        .from(".skill-node-inner", {
          scale: 0,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "back.out(2)",
        }, "-=0.5")
        .from(".skill-node-outer", {
          scale: 0,
          opacity: 0,
          duration: 0.4,
          stagger: 0.03,
          ease: "back.out(2)",
        }, "-=0.5");

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="w-full min-h-screen bg-transparent text-white flex flex-col items-center justify-center py-24 overflow-hidden relative"
    >
      {/* 3D Floating Background - Strict containment */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <FloatingSkillsBackground />
      </div>

      {/* Radial Gradient overlay to make center readable */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-neutral-950/20 to-neutral-950/80 pointer-events-none z-0" />

      {/* Main Container */}
      <div ref={containerRef} className="relative z-10 w-full max-w-6xl aspect-square sm:aspect-auto sm:h-[600px] flex items-center justify-center">

        {/* ORBITS CONTAINER */}
        <div className="relative w-full h-full flex items-center justify-center">

          {/* INNER ORBIT */}
          <GSAPOrbit
            skills={inner}
            radius={window.innerWidth < 640 ? 110 : 160} // Responsive radius
            duration={40}
            clockwise={true}
            className="orbit-ring-inner"
            setActiveSkill={setActiveSkill}
            nodeClass="skill-node-inner"
          />

          {/* OUTER ORBIT */}
          <GSAPOrbit
            skills={outer}
            radius={window.innerWidth < 640 ? 190 : 280} // Responsive radius
            duration={60}
            clockwise={false}
            className="orbit-ring-outer"
            setActiveSkill={setActiveSkill}
            nodeClass="skill-node-outer"
          />

          {/* CENTER DISPLAY - Moved after orbits to ensure stacking on top */}
          <div className="skills-center absolute inset-0 z-50 flex flex-col items-center justify-center text-center transition-all duration-300 pointer-events-none">
            {/* DEBUG: Remove in production */}
            {/* <div className="hidden">{console.log("Render ActiveSkill:", activeSkill)}</div> */}

            <div className={`
                mb-4 p-4 rounded-2xl bg-neutral-900/80 border border-neutral-700 backdrop-blur-md shadow-2xl
                transition-all duration-300
                ${activeSkill ? "scale-110 border-blue-500/50 shadow-blue-500/20" : ""}
              `}>
              <Icon className={`text-4xl sm:text-5xl transition-colors duration-300 ${activeSkill ? "text-cyan-400" : "text-neutral-400"}`} />
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-2 transition-colors duration-300">
              {currentDisplay.name}
            </h2>
            <p className="text-blue-400 text-sm sm:text-base uppercase tracking-widest font-medium">
              {currentDisplay.level || currentDisplay.category}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// GSAP-powered Orbit Component
function GSAPOrbit({ skills, radius, duration, clockwise, className, setActiveSkill, nodeClass }) {
  const ringRef = useRef(null);
  const nodesRef = useRef([]);
  const ringTween = useRef(null);
  const nodeTweens = useRef([]);

  useEffect(() => {
    // 1. Orbit Rotation
    ringTween.current = gsap.to(ringRef.current, {
      rotation: clockwise ? 360 : -360,
      duration: duration,
      repeat: -1,
      ease: "none",
    });

    // 2. Counter-Rotation for Icons (Keep them upright)
    nodeTweens.current = nodesRef.current.map((node) => {
      return gsap.to(node, {
        rotation: clockwise ? -360 : 360,
        duration: duration,
        repeat: -1,
        ease: "none",
      });
    });

    return () => {
      ringTween.current?.kill();
      nodeTweens.current.forEach(t => t?.kill());
    };
  }, [duration, clockwise]);

  // Pause/Play handlers
  const handleMouseEnter = (skill) => {
    // console.log("Hovering Skill:", skill); // Debug
    setActiveSkill(skill);
    ringTween.current?.pause();
    nodeTweens.current.forEach(t => t?.pause());
  };

  const handleMouseLeave = () => {
    setActiveSkill(null);
    ringTween.current?.play();
    nodeTweens.current.forEach(t => t?.play());
  };

  const count = skills.length;
  const step = 360 / count;

  return (
    <div
      ref={ringRef}
      className={`absolute rounded-full border border-neutral-800/30 flex items-center justify-center pointer-events-none ${className}`}
      style={{
        width: radius * 2,
        height: radius * 2,
      }}
    >
      {skills.map((skill, index) => {
        const angle = index * step;
        const Icon = skill.icon || FiCode;

        return (
          <div
            key={index}
            className={`absolute flex items-center justify-center pointer-events-none ${nodeClass}`}
            style={{
              transform: `rotate(${angle}deg) translate(${radius}px)`,
            }}
          >
            {/* Counter-Rotating Container */}
            <div
              ref={el => nodesRef.current[index] = el}
              className="relative group cursor-pointer pointer-events-auto flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16"
              onMouseEnter={() => handleMouseEnter(skill)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="
                w-10 h-10 sm:w-14 sm:h-14
                bg-neutral-900/60 backdrop-blur-md
                border border-neutral-700/50
                rounded-full
                flex items-center justify-center
                transition-all duration-300
                group-hover:scale-125
                group-hover:bg-neutral-800
                group-hover:border-cyan-500/50
                group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]
              ">
                <Icon className="text-xl sm:text-2xl text-neutral-400 group-hover:text-cyan-400 transition-colors" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
