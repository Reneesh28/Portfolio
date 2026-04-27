import { useEffect, useRef, useState } from "react";
import { Linkedin, Github, Mail, ArrowRight, FileText } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import profileImage from "../assets/profile.jpg";
import { Button } from "../components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  // Authentication State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [progress, setProgress] = useState(0);
  const holdIntervalRef = useRef(null);
  const drainIntervalRef = useRef(null);

  const HOLD_DURATION = 250; // 250 milli-seconds holding time
  const INTERVAL_TIME = 20;

  const startHold = () => {
    if (isUnlocked) return;
    clearInterval(drainIntervalRef.current); // Stop draining if pressed again

    holdIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + (100 / (HOLD_DURATION / INTERVAL_TIME)), 100);
        if (next >= 100) {
          clearInterval(holdIntervalRef.current);
          setIsUnlocked(true);
        }
        return next;
      });
    }, INTERVAL_TIME);
  };

  const stopHold = () => {
    if (isUnlocked) return;
    clearInterval(holdIntervalRef.current);

    // Smoothly drain the progress bar when let go early
    drainIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(drainIntervalRef.current);
          return 0;
        }
        return prev - 2; // drain speed
      });
    }, 10);
  };

  useEffect(() => {
    // Structural Entrance Animation still fires on scroll so the blurry shell slides into place
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom bottom",
          toggleActions: "play none none reverse",
        },
      });

      // CINEMATIC STAGGERED REVEAL (applies structurally even when blurred)
      tl.fromTo(".about-label", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
        .fromTo([".profile-container", ".profile-name", ".social-icon"],
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo([".about-headline", ".about-text p", ".resume-btn"],
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" },
          "-=0.8"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full bg-[#0A0A0A] text-[#E0E0E0] px-6 md:px-12 py-24 sm:py-32 overflow-hidden border-t border-white/5 min-h-[600px]"
    >
      <div ref={containerRef} className="max-w-7xl mx-auto relative">

        {/* --- MEDITATION OVERLAY --- */}
        {!isUnlocked && (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#0D0D0D]/40 backdrop-blur-sm"></div>

            <div
              onMouseDown={startHold}
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              onTouchStart={startHold}
              onTouchEnd={stopHold}
              className="
                 relative px-10 py-6
                 border border-[#C5A059]/20 hover:border-[#C5A059]/60
                 bg-[#0D0D0D]/90 backdrop-blur-md
                 text-[#F5F5F5] 
                 font-serif tracking-widest text-lg
                 cursor-pointer select-none
                 overflow-hidden group
                 transition-all active:scale-95 duration-300
                 shadow-[0_0_50px_rgba(197,160,89,0.05)]
               "
            >
              {/* Progress Fill (Gold Glow) */}
              <div
                className="absolute inset-y-0 left-0 bg-[#C5A059]/10 pointer-events-none"
                style={{ width: `${progress}%`, transition: progress < 100 ? "width 0.05s linear" : "none" }}
              />

              {/* Label & Indicator */}
              <span className="relative z-10 flex items-center gap-6">
                <div className={`w-3 h-3 rounded-full ${progress > 0 ? 'bg-[#C5A059] animate-ping shadow-[0_0_15px_#C5A059]' : 'bg-[#444]'} transition-colors`} />
                {progress >= 100
                  ? "ASCENDED"
                  : progress > 0
                    ? `FOCUSING... ${Math.floor(progress)}%`
                    : "HOLD TO MEDITATE"}
              </span>
            </div>
          </div>
        )}

        {/* --- MAIN CONTENT (SOFT GLOW REVEAL) --- */}
        <div className={`transition-all duration-[2.5s] ease-in-out ${isUnlocked ? "blur-0 opacity-100 scale-100" : "blur-[40px] opacity-0 scale-95 pointer-events-none select-none"}`}>
          {/* Section Label */}
          <p className="about-label text-[#C5A059] font-medium uppercase tracking-[0.4em] text-xs mb-16">
            THE LEGEND
          </p>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-start">

            {/* LEFT COLUMN — PROFILE (Span 4 cols) */}
            <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
              {/* Profile Image */}
              <div className="profile-container relative group mb-8">
                <div
                  className="
                    relative
                    w-64 h-64 sm:w-72 sm:h-72
                    border border-[#C5A059]/10
                    group-hover:border-[#C5A059]/40
                    transition-colors duration-500
                    bg-[#111111] p-2
                  "
                >
                  <img
                    src={profileImage}
                    alt="Reneesh"
                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-1000 contrast-125"
                  />
                  {/* Decorative Corner Seal */}
                  <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#8B0000] flex items-center justify-center text-[10px] font-serif text-[#F5F5F5] border border-white/10 shadow-lg">
                    RENE
                  </div>
                </div>
              </div>

              {/* Name & Title */}
              <div className="profile-name space-y-2">
                <h3 className="text-4xl font-serif font-bold tracking-tight text-[#F5F5F5]">
                  RENEESH
                </h3>
                <p className="text-[#C5A059] font-medium tracking-[0.2em] text-xs uppercase">
                  WARRIOR - ENGINEER
                </p>
              </div>

              {/* Social Icons */}
              <div className="mt-8 flex items-center gap-4 justify-center md:justify-start">
                {[
                  { href: "https://www.linkedin.com/in/balam-reneesh", icon: Linkedin, label: "LinkedIn" },
                  { href: "https://github.com/Reneesh28", icon: Github, label: "GitHub" },
                  { href: "mailto:reneesh3508925@gmail.com", icon: Mail, label: "Email" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target={social.label === "Email" ? "_self" : "_blank"}
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="
                      social-icon
                      group relative
                      w-12 h-12
                      flex items-center justify-center
                      bg-[#1A1A1A]
                      border border-white/5
                      text-[#A3A3A3]
                      hover:text-[#E0E0E0] hover:border-[#00BFA5]/30 hover:bg-[#2A2A2A]
                      transition-colors duration-200
                    "
                  >
                    <social.icon size={20} className="transition-transform" />

                    {/* Tooltip */}
                    <span className="
                      absolute -top-10 left-1/2 -translate-x-1/2 
                      px-2.5 py-1 
                      bg-[#0A0A0A] border border-white/5 
                      text-[#E0E0E0] text-xs font-mono tracking-widest rounded 
                      opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
                      transition-all duration-300 pointer-events-none whitespace-nowrap
                    ">
                      {social.label.toUpperCase()}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN — TEXT CONTENT (Span 8 cols) */}
            <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center h-full">
              <h2 className="about-headline text-4xl sm:text-5xl lg:text-7xl font-serif font-bold tracking-tight mb-8 leading-[1.1] text-[#F5F5F5]">
                Mastering <span className="text-[#C5A059]">ancient arts</span> of code
              </h2>

              <div className="about-text space-y-6 text-[#A3A3A3] text-lg leading-relaxed max-w-2xl font-mono text-sm sm:text-base">
                <p>
                  I am an AI Engineer focused on designing and building machine
                  learning and generative AI systems that are reliable, scalable,
                  and grounded in real-world use cases.
                </p>

                <p>
                  My work spans across model development, data pipelines, and
                  system integration with a strong emphasis on translating
                  complex ideas into production-ready solutions.
                </p>

                <p>
                  I enjoy working at the intersection of research and engineering,
                  where experimentation meets disciplined system design.
                </p>
              </div>

              {/* Resume Button */}
              <div className="resume-btn mt-12">
                <Button
                  as="a"
                  href="/resume.pdf"
                  download="Reneesh_CV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="lg"
                  className="group gap-3 bg-transparent border-[#C5A059]/40 hover:border-[#C5A059]"
                >
                  <FileText size={20} className="text-[#C5A059] group-hover:text-[#F5F5F5] transition-colors" />
                  <span className="text-[#F5F5F5] tracking-widest font-serif uppercase text-sm">Review Credentials</span>
                  <ArrowRight
                    size={18}
                    className="text-[#C5A059] group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}