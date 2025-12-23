import experience from "../data/experience";
import { motion, useReducedMotion } from "framer-motion";

export default function Experience() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="experience"
      className="scroll-mt-16 w-full bg-black text-white px-6 sm:px-12 lg:px-24 py-28"
    >
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ willChange: "transform" }}
      >
        {/* Header */}
        <p className="text-neutral-400 uppercase tracking-[0.3em] text-xs mb-4">
          Experience
        </p>

        <h2 className="text-3xl sm:text-4xl font-semibold mb-16">
          Work Experience & Training
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {experience.map((item) => (
            <div
              key={item.role}
              className="
                bg-neutral-900/60
                border border-neutral-800
                rounded-2xl
                p-8
                hover:border-neutral-600
                transition-colors
              "
            >
              {/* Type badge */}
              <span
                className="
                  inline-block
                  mb-4
                  text-xs
                  px-3 py-1
                  rounded-full
                  bg-neutral-800
                  text-neutral-300
                "
              >
                {item.type}
              </span>

              {/* Role */}
              <h3 className="text-lg font-medium mb-1">
                {item.role}
              </h3>

              {/* Organization */}
              <p className="text-sm text-neutral-400 mb-2">
                {item.organization}
              </p>

              {/* Period */}
              <p className="text-xs text-neutral-500 mb-4">
                {item.period}
              </p>

              {/* Description */}
              <p className="text-sm text-neutral-500 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
