import { motion } from "framer-motion";

const AnimatedLogo = ({ text = "RENEESH", className = "" }) => {
  const letters = text.split("");

  return (
    <motion.div
      className={`relative flex items-center gap-1 cursor-pointer group ${className}`}
      initial="initial"
      whileHover="hover"
    >
      {/* THE LETTERS (INK BLEED) */}
      <div className="flex overflow-hidden">
        {letters.map((char, i) => (
          <motion.span
            key={i}
            className="inline-block font-serif font-bold text-2xl tracking-tighter text-[#F5F5F5]"
            initial={{ y: 20, opacity: 0, filter: "blur(5px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.8,
              delay: i * 0.05,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>

      {/* THE BLADE SHIMMER (SLICING EFFECT) */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        variants={{
          hover: {
            x: ["-100%", "200%"],
            transition: { duration: 0.6, ease: "easeInOut" }
          }
        }}
      >
        <div className="w-12 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-30deg]" />
      </motion.div>

      {/* THE HANKO SEAL (RED STAMP) */}
      <motion.div
        className="ml-2 w-5 h-5 bg-[#8B0000] flex items-center justify-center text-[8px] font-serif text-white border border-white/10 shadow-lg"
        initial={{ scale: 0, rotate: -45, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
      >
        RE
      </motion.div>

      {/* UNDERLINE SLICE */}
      <motion.div
        className="absolute -bottom-1 left-0 h-[2px] bg-[#C5A059] origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        variants={{
          hover: {
            scaleX: [1, 1.2, 1],
            backgroundColor: ["#C5A059", "#F5F5F5", "#C5A059"],
            transition: { duration: 0.4 }
          }
        }}
      />
    </motion.div>
  );
};

export default AnimatedLogo;
