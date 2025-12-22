import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import NeuralFieldBackground from "../components/NeuralFieldBackground";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-screen overflow-hidden" id="hero">
      
      {/* Full Background */}
      <div className="absolute inset-0 z-0">
        <NeuralFieldBackground />
      </div>

      {/* Contrast Overlay */}
      <div className="absolute inset-0 bg-black/65 z-10" />

      {/* Centered Content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="
          relative z-20
          min-h-screen
          flex flex-col
          items-center
          justify-center
          text-center
          px-6
        "
      >
        {/* NAME (PRIMARY) */}
        <h1
          className="
            text-white
            font-extrabold
            tracking-tight
            leading-[0.95]
            text-6xl
            sm:text-7xl
            md:text-8xl
            lg:text-9xl
          "
        >
          Balam Reneesh
        </h1>

        {/* ROLE (SECONDARY — SAME FONT) */}
        <h2
          className="
            mt-4
            text-neutral-300
            font-extrabold
            tracking-tight
            text-2xl
            sm:text-3xl
            md:text-4xl
          "
        >
          AI Engineer
        </h2>

        {/* Descriptor */}
        <p className="mt-6 text-neutral-300 text-lg sm:text-xl max-w-2xl">
          Machine Learning · GenAI · Web Development · Scalable Systems
        </p>

        {/* CTAs */}
        <div className="mt-10 flex gap-8">
          <a
            href="#projects"
            className="
              text-white
              font-medium
              border-b border-white
              pb-1
              hover:opacity-70
              transition
            "
          >
            View Projects
          </a>

          <a
            href="#contact"
            className="
              text-neutral-300
              font-medium
              hover:text-white
              transition
            "
          >
            Contact Me
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-16">
          <ArrowDown
            size={22}
            className="text-neutral-400 animate-bounce"
          />
        </div>
      </motion.div>
    </section>
  );
}
