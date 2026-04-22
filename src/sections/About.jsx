import { useEffect, useRef, useState } from "react";
import { Linkedin, Github, Mail, ScrollText, Swords, FileText } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import profileImage from "../assets/profile.jpg";

gsap.registerPlugin(ScrollTrigger);

const PRINCIPLES = [
  { title: "GIRI (DUTY)", desc: "Architectural integrity above all else. No technical debt." },
  { title: "ZANSHIN (AWARENESS)", desc: "Total system observability. Anticipating the failure before it strikes." },
  { title: "SHUHARI (MASTERY)", desc: "Learning the rules, breaking the rules, becoming the rule." },
];

export default function About() {
  const sectionRef = useRef(null);
  const [activeLayer, setActiveLayer] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            const layer = Math.min(2, Math.floor(self.progress * 3.1)); // Slightly over to snap last
            setActiveLayer(prev => (prev !== layer ? layer : prev));
          }
        }
      });

      // Unified Timeline for high performance
      tl.fromTo(".about-phase-0", { opacity: 1 }, { opacity: 0, duration: 0.5 }, 0.5)
        .fromTo(".about-phase-1", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 }, 0.5)
        .to(".about-phase-1", { opacity: 0, duration: 0.5 }, 1.5)
        .fromTo(".about-phase-2", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 }, 1.5);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full h-screen bg-[#050505] overflow-hidden"
    >
      <div className="relative z-10 w-full h-full">

        {/* PHASE 1: THE INK */}
        <div className={`about-phase-0 absolute inset-0 flex flex-col items-center justify-center px-8 text-center ${activeLayer === 0 ? "pointer-events-auto" : "pointer-events-none"}`}>
          <div className="max-w-4xl">
            <div className="flex items-center justify-center gap-4 text-[#D4AF37]/40 mb-8">
              <ScrollText size={18} />
              <span className="font-mono text-[10px] tracking-[0.6em] uppercase">Scroll_01: Origins</span>
            </div>


            <h3 className="font-shippori text-white text-6xl md:text-8xl mb-8 tracking-widest uppercase">
              墨 - THE_INK
            </h3>
            <p className="font-shippori text-[#888] text-xl md:text-2xl leading-relaxed italic max-w-2xl mx-auto border-l border-[#D4AF37]/20 pl-8">
              "Before the blade, there was the void. I mastered the ancient ink of logic during my
              formative years."
            </p>
          </div>
        </div>

        {/* PHASE 2: THE STEEL */}
        <div className={`about-phase-1 absolute inset-0 flex flex-col items-center justify-center px-8 opacity-0 ${activeLayer === 1 ? "pointer-events-auto" : "pointer-events-none"}`}>
          <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="flex flex-col gap-12">
              <h3 className="font-shippori text-white text-5xl md:text-7xl tracking-widest uppercase">
                鋼 - THE_STEEL
              </h3>
              <div className="flex flex-col gap-8 text-left">
                {PRINCIPLES.map((p, i) => (
                  <div key={i}>
                    <h4 className="text-[#D4AF37] font-mono text-xs tracking-[0.4em] mb-1">{p.title}</h4>
                    <p className="text-[#888] text-sm font-shippori max-w-sm">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#0A0A0A] p-10 border border-white/5">
              <p className="font-mono text-[#444] text-[10px] leading-relaxed">
                while(alive) {"{"}<br />
                &nbsp;&nbsp;forge(intelligence);<br />
                &nbsp;&nbsp;temper(architecture);<br />
                {"}"}
              </p>
            </div>
          </div>
        </div>

        {/* PHASE 3: THE SEAL */}
        <div className={`about-phase-2 absolute inset-0 flex flex-col items-center justify-center px-8 opacity-0 ${activeLayer === 2 ? "pointer-events-auto" : "pointer-events-none"}`}>
          <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img src={profileImage} alt="The Architect" className="w-full h-auto grayscale opacity-60" />
              <div className="absolute bottom-0 right-0 bg-[#D4AF37] text-black font-mono text-[9px] px-4 py-1 tracking-widest">
                RANK: MASTER
              </div>
            </div>
            <div className="flex flex-col gap-8 text-left">
              <h3 className="text-5xl md:text-7xl font-shippori text-white tracking-widest uppercase leading-none">
                BALAM <span className="text-[#D4AF37]">RENEESH</span>
              </h3>
              <p className="font-shippori text-[#888] text-lg leading-relaxed italic border-l border-[#D4AF37]/10 pl-6">
                "I bridge the gap between ancient discipline and modern AI."
              </p>
              <div className="flex items-center gap-8 mt-10">
                <a
                  href="/resume.pdf"
                  download="Balam_Reneesh_CV.pdf"
                  target="_blank"
                  className="px-8 py-3 border border-[#D4AF37] text-[#D4AF37] font-shippori text-xs tracking-[0.5em] hover:bg-[#D4AF37] hover:text-black transition-all duration-500 uppercase font-bold"
                >
                  [ ACCESS_THE_SACRED_SCROLLS ]
                </a>

                <div className="flex items-center gap-6">
                  <a href="https://www.linkedin.com/in/balam-reneesh" target="_blank" rel="noopener noreferrer">
                    <Linkedin size={18} className="text-[#333] hover:text-[#D4AF37] transition-colors cursor-pointer" />
                  </a>
                  <a href="https://github.com/Reneesh28" target="_blank" rel="noopener noreferrer">
                    <Github size={18} className="text-[#333] hover:text-[#D4AF37] transition-colors cursor-pointer" />
                  </a>
                  <a href="mailto:reneesh3508925@gmail.com">
                    <Mail size={18} className="text-[#333] hover:text-[#D4AF37] transition-colors cursor-pointer" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Indicators */}
      <div className="fixed right-10 top-1/2 -translate-y-1/2 flex flex-col gap-8 z-50">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`w-1 h-1 rotate-45 transition-all duration-500 ${activeLayer === i ? "bg-[#D4AF37] scale-150" : "bg-white/10"}`} />
        ))}
      </div>
    </section>
  );
}