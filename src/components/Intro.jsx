import { motion } from "framer-motion";

export default function Intro({ onFinish }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      onAnimationComplete={() => {
        // ⏱ Hold intro on screen longer (important)
        setTimeout(onFinish, 1200);
      }}
    >
      <div className="overflow-hidden">
        {/* Name — BIG & BOLD (Right → Center) */}
        <motion.h1
          initial={{ x: 140, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="
            text-white
            text-4xl
            sm:text-5xl
            md:text-6xl
            font-extrabold
            tracking-tight
            text-center
          "
        >
          Balam Reneesh
        </motion.h1>

        {/* Caption — smaller & subtle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
          className="
            mt-3
            text-neutral-400
            text-sm
            sm:text-base
            tracking-widest
            uppercase
            text-center
          "
        >
          AI Engineer
        </motion.p>
      </div>
    </motion.div>
  );
}
