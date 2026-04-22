import { useEffect, useRef } from "react";
import experience from "../data/experience";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swords, Shield, Scroll, MapPin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const CAMPAIGN_ICONS = {
  work: <Swords size={20} />,
  education: <Scroll size={20} />,
  training: <Shield size={20} />
};

export default function Experience() {
  const containerRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. The Blade Cut (Vertical Line)
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 40%",
            end: "bottom 80%",
            scrub: true,
          },
        }
      );

      // 2. Banner Sequential Entry
      const items = gsap.utils.toArray(".campaign-item");
      items.forEach((item, i) => {
        gsap.fromTo(item,
          { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      className="relative w-full bg-[#050505] text-white py-40 overflow-hidden"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto relative z-10 px-6">
        {/* Header */}
        <div className="mb-32 flex flex-col items-center text-center">
          <p className="font-mono text-[10px] tracking-[1em] text-[#D4AF37] uppercase mb-4">
            CHRONICLES_OF_CAMPAIGN
          </p>
          <h2 className="font-shippori text-5xl md:text-8xl tracking-widest text-white uppercase opacity-20">
            Pathways
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* The Blade Cut (Vertical Line) */}
          <div
            ref={lineRef}
            className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#D4AF37]/40 via-[#D4AF37]/10 to-transparent origin-top z-0"
          />

          {/* Campaign Items */}
          <div className="space-y-40">
            {experience.map((item, index) => {
              const isEven = index % 2 === 0;
              const icon = CAMPAIGN_ICONS[item.type.toLowerCase()] || <Swords size={20} />;

              return (
                <div
                  key={index}
                  className={`campaign-item flex flex-col md:flex-row items-start md:items-center relative ${isEven ? "md:flex-row-reverse" : ""
                    }`}
                >
                  {/* Spacer for Desktop */}
                  <div className="hidden md:block w-1/2" />

                  {/* The Banner Post (Center Node) */}
                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-10 h-10 bg-[#050505] border border-[#D4AF37]/30 rotate-45 flex items-center justify-center z-10">
                    <div className="rotate-[-45deg] text-[#D4AF37]">
                      {icon}
                    </div>
                  </div>

                  {/* Content Card (Sashimono Style) */}
                  <div className="w-full md:w-1/2 pl-24 md:pl-0">
                    <div className={`relative ${isEven ? "md:pr-20 text-left md:text-right" : "md:pl-20 text-left"}`}>
                      {/* Campaign Duration Tag */}
                      <div className={`flex items-center gap-3 font-mono text-[9px] tracking-widest text-[#D4AF37]/60 mb-4 ${isEven ? "md:justify-end" : ""}`}>
                        <div className="w-8 h-[1px] bg-[#D4AF37]/20" />
                        {item.period}
                      </div>

                      {/* Rank and Great House */}
                      <h3 className="font-shippori text-2xl md:text-4xl text-white tracking-widest uppercase mb-1">
                        {item.role}
                      </h3>
                      <p className="font-mono text-[10px] tracking-[0.5em] text-[#D4AF37] mb-8 uppercase opacity-80">
                        {item.organization}
                      </p>

                      {/* Strategic Victories */}
                      <div className={`flex flex-col gap-4 ${isEven ? "md:items-end" : "items-start"}`}>
                        <div className="flex items-center gap-3 text-[#D4AF37]/40 text-[10px] tracking-[0.4em] uppercase font-mono">
                          <MapPin size={12} /> Strategic_Victories
                        </div>
                        <p className="font-shippori text-[#888] text-sm md:text-lg leading-relaxed italic border-l-2 md:border-l-0 border-[#D4AF37]/10 pl-6 md:pl-0 md:max-w-md">
                          "{item.description}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Narrative Footer */}
      <div className="mt-40 flex flex-col items-center gap-6 opacity-20">
        <div className="w-px h-32 bg-gradient-to-b from-[#D4AF37] to-transparent" />
        <p className="font-mono text-[10px] tracking-[0.8em] text-white">RECORD_OF_HONOR</p>
      </div>
    </section>
  );
}
