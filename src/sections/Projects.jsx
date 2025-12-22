import projects from "../data/projects";
import { FiGithub, FiClock } from "react-icons/fi";

export default function Projects() {
  return (
    <section
      id="projects"
      className="scroll-mt-16 w-full bg-black text-white px-6 sm:px-12 lg:px-24 py-28"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <p className="text-neutral-400 uppercase tracking-[0.3em] text-xs mb-4">
          Projects
        </p>

        <h2 className="text-3xl sm:text-4xl font-semibold mb-16">
          Projects & Work
        </h2>

        {/* Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Existing Projects */}
          {projects.map((project) => (
            <div
              key={project.title}
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
                <h3 className="text-lg font-medium mb-3">
                  {project.title}
                </h3>

                <p className="text-sm text-neutral-400 mb-6">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech.map((item) => (
                    <span
                      key={item}
                      className="
                        text-xs
                        px-3 py-1
                        rounded-full
                        bg-neutral-800
                        text-neutral-200
                      "
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Code Button */}
              <a
                href={project.codeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex
                  items-center
                  gap-2
                  w-fit
                  px-5 py-2
                  rounded-lg
                  border border-neutral-700
                  text-sm
                  text-neutral-200
                  hover:border-neutral-500
                  hover:text-white
                  transition-all
                "
              >
                <FiGithub className="text-lg" />
                Code
              </a>
            </div>
          ))}

          {/* Coming Soon Project */}
          <div
            className="
              bg-neutral-900/40
              border border-dashed border-neutral-700
              rounded-2xl
              p-8
              flex flex-col
              justify-between
            "
          >
            <div>
              <h3 className="text-lg font-medium mb-3">
                Sales Performance Analytics Engine (SPAE)
              </h3>

              <p className="text-sm text-neutral-400 mb-6">
                An advanced Machine Learning–powered statistics dashboard designed
                to analyze sales performance, uncover trends, and generate
                predictive insights using large-scale datasets.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  "Python",
                  "Machine Learning",
                  "Data Analytics",
                  "Statistics",
                  "Dashboarding"
                ].map((item) => (
                  <span
                    key={item}
                    className="
                      text-xs
                      px-3 py-1
                      rounded-full
                      bg-neutral-800
                      text-neutral-300
                    "
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Coming Soon Badge */}
            <div
              className="
                inline-flex
                items-center
                gap-2
                w-fit
                px-5 py-2
                rounded-lg
                border border-neutral-700
                text-sm
                text-neutral-400
                cursor-not-allowed
              "
            >
              <FiClock className="text-lg" />
              Coming Soon
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
