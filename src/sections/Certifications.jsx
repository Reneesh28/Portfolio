import certifications from "../data/certifcations";
import { FiExternalLink } from "react-icons/fi";
import { motion, useReducedMotion } from "framer-motion";

export default function Certifications() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="certifications"
      className="scroll-mt-16 w-full bg-black text-white px-6 sm:px-12 lg:px-24 py-28"
    >
      <motion.div
        className="max-w-7xl mx-auto text-center"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ willChange: "transform" }}
      >
        <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
          Certificates & Certifications
        </h2>

        <p className="text-neutral-400 max-w-2xl mx-auto mb-20">
          A journey of continuous learning and skill refinement, where each
          certificate represents growth and curiosity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
          {certifications.map((cert) => (
            <div
              key={cert.title}
              className="
                bg-neutral-900/60
                border border-neutral-800
                rounded-2xl
                p-8
                flex flex-col
                justify-between
                hover:border-neutral-600
                transition-colors
              "
            >
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {cert.title}
                </h3>

                <p className="text-sm text-neutral-400 mb-1">
                  {cert.issuer}
                </p>

                <p className="text-sm text-neutral-500 mb-6">
                  {cert.year}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {cert.tags.map((tag) => (
                    <span
                      key={tag}
                      className="
                        text-xs
                        px-3 py-1
                        rounded-full
                        bg-neutral-800
                        text-neutral-200
                      "
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={cert.file}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  text-neutral-300
                  hover:text-white
                  transition-colors
                "
              >
                View Certificate <FiExternalLink />
              </a>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
