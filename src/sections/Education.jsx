import education from "../data/education";

export default function Education() {
  return (
    <section
      id="education"
      className="scroll-mt-16 w-full bg-black text-white px-6 sm:px-12 lg:px-24 py-28"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <p className="text-neutral-400 uppercase tracking-[0.3em] text-xs mb-4">
          Education
        </p>

        <h2 className="text-3xl sm:text-4xl font-semibold mb-16">
          Academic Background
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {education.map((edu) => (
            <div
              key={edu.degree}
              className="
                bg-neutral-900/60
                border border-neutral-800
                rounded-2xl
                p-8
                hover:border-neutral-600
                transition-colors
              "
            >
              {/* Top badges */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="
                    text-xs
                    px-3 py-1
                    rounded-full
                    bg-neutral-800
                    text-neutral-300
                  "
                >
                  {edu.period}
                </span>

                <span
                  className="
                    text-xs
                    px-3 py-1
                    rounded-full
                    bg-neutral-800
                    text-neutral-300
                  "
                >
                  {edu.score}
                </span>
              </div>

              {/* Degree */}
              <h3 className="text-lg font-medium mb-2">
                {edu.degree}
              </h3>

              {/* Institution */}
              <p className="text-sm text-neutral-400 mb-4">
                {edu.institution}
              </p>

              {/* Description */}
              <p className="text-sm text-neutral-500 leading-relaxed">
                {edu.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
