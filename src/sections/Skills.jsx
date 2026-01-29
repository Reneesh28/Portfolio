import { useState, useEffect, useMemo } from "react";
import skills from "../data/skills";
import { motion } from "framer-motion";
import { FiCode } from "react-icons/fi";

// Flatten the skills data for the orbits
// We'll split them into Inner (Important/Core) and Outer (Tools/Libs)
const categorizeSkills = () => {
  const allSkills = skills.flatMap((cat) => cat.items);

  // Custom logic to pick core skills for inner ring if desired, 
  // or just simple interleaving.
  // Let's put major languages and frameworks in the inner ring.
  const innerKeywords = [
    "Python", "JavaScript", "React.js", "Node.js", "SQL",
    "HTML5", "CSS3", "Git", "Docker", "MongoDB"
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
  const [isHovering, setIsHovering] = useState(false);

  // Default Title to show when not hovering
  const defaultTitle = { name: "Skills", icon: null, level: "Tech Stack" };
  const currentDisplay = activeSkill || defaultTitle;

  return (
    <section
      id="skills"
      className="w-full min-h-screen bg-transparent text-white flex flex-col items-center justify-center py-24 overflow-hidden relative"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-transparent flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-neutral-900/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-5xl aspect-square sm:aspect-auto sm:h-[800px] flex items-center justify-center">

        {/* CENTER TEXT */}
        <div className="absolute z-20 flex flex-col items-center justify-center text-center pointer-events-none transition-all duration-300">
          <motion.div
            key={currentDisplay.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Large Central Icon for Active Skill */}
            {activeSkill && activeSkill.icon ? (
              <activeSkill.icon className="text-6xl text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] mb-2" />
            ) : null}

            <h2 className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-neutral-500 tracking-tight">
              {currentDisplay.name}
            </h2>
            <p className="text-neutral-400 text-sm sm:text-lg uppercase tracking-widest">
              {activeSkill ? "Expertise" : "Technical Arsenal"}
            </p>
          </motion.div>
        </div>

        {/* ORBITS CONTAINER */}
        {/* We rotate the entire rings. Hovering any ring pauses the animation. */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false);
            setActiveSkill(null);
          }}
        >
          {/* INNER ORBIT */}
          <Orbit
            skills={inner}
            radius={window.innerWidth < 640 ? 100 : 150}
            duration={40}
            clockwise={true}
            isPaused={isHovering}
            setActiveSkill={setActiveSkill}
          />

          {/* OUTER ORBIT */}
          <Orbit
            skills={outer}
            radius={window.innerWidth < 640 ? 190 : 280}
            duration={50}
            clockwise={false}
            isPaused={isHovering}
            setActiveSkill={setActiveSkill}
          />
        </div>
      </div>
    </section>
  );
}

// Sub-component for a single ring
function Orbit({ skills, radius, duration, clockwise, isPaused, setActiveSkill }) {
  const count = skills.length;
  // Calculate angle step (degrees)
  const step = 360 / count;

  return (
    <div
      className="absolute rounded-full border border-neutral-800/50 flex items-center justify-center pointer-events-none"
      style={{
        width: radius * 2,
        height: radius * 2,
        animation: `orbit ${duration}s linear infinite`,
        animationPlayState: isPaused ? 'paused' : 'running',
        animationDirection: clockwise ? 'normal' : 'reverse',
      }}
    >
      {/* Styles for Orbit Animation */}
      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes counter-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>

      {skills.map((skill, index) => {
        const angle = index * step;
        // Convert to radians for initial positioning debug if needed, 
        // but simple transform rotate is easier for distributing on a circle.
        // We actully place them absolutely at center, then rotate the WRAPPER, then translate OUT.

        return (
          <div
            key={skill.name}
            className="absolute flex items-center justify-center group pointer-events-auto"
            style={{
              transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`,
              // Example logic:
              // 1. rotate(angle) -> points the axis to the slot
              // 2. translate(radius) -> moves item out to the rim
              // 3. rotate(-angle) -> un-rotates item so it stands upright initially

              // However, since the PARENT (Orbit) is rotating, the item will tumble.
              // To keep item upright while parent rotates, we need the item to counter-rotate continually.
            }}
          >
            {/* 
                COUNTER-ROTATION CONTAINER 
                This inner container applies the continuous counter-rotation animation 
                to cancel out the parent's orbit rotation, keeping the icon upright 
                relative to the screen.
             */}
            <div
              style={{
                animation: `counter-orbit ${duration}s linear infinite`,
                animationPlayState: isPaused ? 'paused' : 'running',
                animationDirection: clockwise ? 'reverse' : 'normal', // Opposite to parent
              }}
            >
              <SkillItem skill={skill} index={index} setActiveSkill={setActiveSkill} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SkillItem({ skill, index, setActiveSkill }) {
  const Icon = skill.icon || FiCode;

  return (
    <motion.div
      className="
        relative
        w-12 h-12 sm:w-16 sm:h-16
        bg-neutral-900/80 backdrop-blur-md
        border border-neutral-700
        rounded-full
        flex items-center justify-center
        cursor-pointer
        shadow-lg
      "
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [1, 1.1, 1],
        opacity: 1,
      }}
      transition={{
        scale: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 2 // Randomize breathing phase
        },
        opacity: {
          duration: 0.5,
          delay: index * 0.05 // Stagger entrance
        }
      }}
      whileHover={{
        scale: 1.5,
        backgroundColor: "#171717",
        borderColor: "#fff",
        boxShadow: "0 0 20px rgba(255,255,255,0.3)",
        zIndex: 50,
        rotate: 45
      }}
      onMouseEnter={() => setActiveSkill(skill)}
    >
      <Icon className="text-2xl sm:text-3xl text-neutral-400 hover:text-white transition-colors" />
    </motion.div>
  );
}
