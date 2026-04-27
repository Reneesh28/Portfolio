import { useEffect, useRef } from "react";
import education from "../data/education";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Education() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".edu-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          stagger: 0.3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="education"
      className="w-full bg-[#0D0D0D] text-[#F5F5F5] px-6 md:px-12 py-24 sm:py-32 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center">
          <p className="text-[#C5A059] uppercase tracking-[0.4em] text-xs mb-4 font-medium">
            The Lineage
          </p>
          <h2 className="text-4xl md:text-7xl font-serif font-bold text-[#F5F5F5]">
            Foundations of Logic
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {education.map((edu, index) => (
            <div key={index} className="edu-item relative p-10 bg-[#111111] border border-white/5 group hover:border-[#C5A059]/30 transition-all duration-500">
              {/* Vertical Japanese Numbering (Stylized) */}
              <div className="absolute top-8 right-8 text-4xl font-serif text-white/5 group-hover:text-[#C5A059]/10 transition-colors">
                0{index + 1}
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059]/60">
                    {edu.period}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-[#F5F5F5] mt-2 group-hover:text-[#C5A059] transition-colors">
                    {edu.degree}
                  </h3>
                </div>

                <p className="text-[#8B0000] font-serif tracking-widest text-xs uppercase font-bold">
                  {edu.institution}
                </p>

                <div className="h-px w-12 bg-white/10 group-hover:w-full transition-all duration-700" />

                <p className="text-sm text-[#A3A3A3] font-serif leading-relaxed italic opacity-80">
                  "{edu.description}"
                </p>

                <div className="pt-4">
                  <span className="text-[10px] font-bold tracking-[0.2em] px-3 py-1 border border-[#C5A059]/20 text-[#C5A059]">
                    {edu.score}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
