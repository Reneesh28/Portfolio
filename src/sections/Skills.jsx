import skills from "../data/skills";
import { FiCode } from "react-icons/fi";

export default function Skills() {
  return (
    <section
      id="skills"
      className="scroll-mt-16 w-full bg-black text-white px-6 sm:px-12 lg:px-24 py-28"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <p className="text-neutral-400 uppercase tracking-[0.3em] text-xs mb-4">
          Skills
        </p>

        <h2 className="text-3xl sm:text-4xl font-semibold mb-16">
          Technical Expertise
        </h2>

        {/* Skill Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skills.map((group) => (
            <div
              key={group.category}
              className="
                bg-neutral-900/60
                border border-neutral-800
                rounded-2xl
                p-6
              "
            >
              <h3 className="text-lg font-medium mb-6 text-neutral-200">
                {group.category}
              </h3>

              <div className="space-y-4">
                {group.items.map((skill) => {
                  const Icon = skill.icon;

                  return (
                    <div
                      key={skill.name}
                      className="flex items-center justify-between"
                    >
                      {/* Left: Icon + Name */}
                      <div className="flex items-center gap-3">
                        <span
                          className="
                            w-10 h-10
                            rounded-full
                            border border-neutral-700
                            flex items-center justify-center
                            text-neutral-300
                            hover:border-neutral-400
                            hover:text-white
                            transition-all duration-300
                          "
                        >
                          {Icon ? (
                            <Icon className="text-lg" />
                          ) : (
                            <FiCode className="text-lg opacity-70" />
                          )}
                        </span>

                        <span className="text-sm text-neutral-200">
                          {skill.name}
                        </span>
                      </div>

                      {/* Right: Percentage */}
                      <span
                        className="
                          text-xs
                          px-3 py-1
                          rounded-full
                          bg-neutral-800
                          text-neutral-100
                        "
                      >
                        {skill.level}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
