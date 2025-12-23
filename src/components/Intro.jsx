import { useEffect } from "react";
import { motion } from "framer-motion";

const name = "Balam Reneesh";
const tagline = "AI Engineer | Full-Stack Developer";

/* 🔥 Faster stagger */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

/* 🔥 Faster letter motion */
const letterVariants = {
  hidden: {
    x: 60,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      ease: "easeOut",
      duration: 0.35,
    },
  },
};

/* 🔥 Faster tagline entry */
const taglineVariants = {
  hidden: {
    y: 16,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      delay: name.length * 0.06 + 0.15,
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const IntroScene = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1800); // 🔥 faster exit

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black text-white">
      <div className="text-center overflow-hidden">
        {/* Name */}
        <motion.div
          className="flex justify-center"
          style={{ fontFamily: "Audiowide, sans-serif" }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {name.split("").map((char, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              className="text-4xl md:text-6xl tracking-widest"
            >
              {char}
            </motion.span>
          ))}
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="mt-4 text-gray-400 text-lg tracking-wide"
          variants={taglineVariants}
          initial="hidden"
          animate="visible"
        >
          {tagline}
        </motion.p>
      </div>
    </div>
  );
};

export default IntroScene;
