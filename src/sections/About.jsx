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

  // Gate State — "Hold to Reveal"
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [progress, setProgress] = useState(0);
  const holdIntervalRef = useRef(null);
  const drainIntervalRef = useRef(null);

  const HOLD_DURATION = 250;
  const INTERVAL_TIME = 20;

  const startHold = () => {
    if (isUnlocked) return;
    clearInterval(drainIntervalRef.current);

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

    drainIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(drainIntervalRef.current);
          return 0;
        }
        return prev - 2;
      });
    }, 10);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom bottom",
          toggleActions: "play none none reverse",
        },
      });

      // Staggered reveal
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
      className="relative w-full px-6 md:px-12 py-24 sm:py-32 overflow-hidden border-t min-h-[600px]"
      style={{
        backgroundColor: "var(--bg-void)",
        color: "var(--text-main)",
        borderColor: "var(--border-subtle)"
      }}
    >
      <div ref={containerRef} className="max-w-7xl mx-auto relative">

        {/* --- GATE OVERLAY — "Hold to Reveal" --- */}
        {!isUnlocked && (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0" style={{ backgroundColor: "rgba(12,10,9,0.3)" }} />

            <div
              onMouseDown={startHold}
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              onTouchStart={startHold}
              onTouchEnd={stopHold}
              className="
                 relative px-8 py-5
                 border backdrop-blur-md
                 font-accent tracking-widest text-sm
                 cursor-pointer select-none
                 overflow-hidden group
                 transition-transform active:scale-95 duration-100
                 rounded-md
               "
              style={{
                borderColor: progress > 0 ? "var(--border-hover)" : "var(--border-subtle)",
                backgroundColor: "rgba(28, 25, 23, 0.95)",
                color: "var(--text-main)",
                boxShadow: progress > 0 ? "0 0 30px rgba(194,65,12,0.1)" : "none"
              }}
            >
              {/* Progress Fill — ink wash */}
              <div
                className="absolute inset-y-0 left-0 pointer-events-none"
                style={{
                  width: `${progress}%`,
                  backgroundColor: "rgba(194,65,12,0.15)",
                  transition: progress < 100 ? "width 0.05s linear" : "none"
                }}
              />

              {/* Label & Indicator */}
              <span className="relative z-10 flex items-center gap-4">
                <div
                  className={`w-2 h-2 rounded-full transition-colors ${progress > 0 ? 'animate-pulse' : ''}`}
                  style={{
                    backgroundColor: progress > 0 ? "var(--accent)" : "var(--text-ink)",
                    boxShadow: progress > 0 ? "0 0 8px var(--accent)" : "none"
                  }}
                />
                {progress >= 100
                  ? "PATH REVEALED"
                  : progress > 0
                    ? `UNVEILING... ${Math.floor(progress)}%`
                    : "HOLD TO REVEAL"}
              </span>
            </div>
          </div>
        )}

        {/* --- MAIN CONTENT (BLURRED UNTIL UNLOCKED) --- */}
        <div className={`transition-all duration-[1.5s] ease-out ${isUnlocked ? "blur-0 opacity-100" : "blur-[16px] opacity-30 pointer-events-none select-none"}`}>

          {/* Section Label */}
          <p
            className="about-label font-accent font-semibold uppercase tracking-[0.2em] text-sm mb-12 sm:mb-16"
            style={{ color: "var(--accent)" }}
          >
            THE CRAFTSMAN
          </p>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-start">

            {/* LEFT COLUMN — PROFILE */}
            <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
              {/* Profile Image */}
              <div className="profile-container relative group mb-8">
                <div
                  className="
                    relative
                    w-64 h-64 sm:w-72 sm:h-72
                    border
                    group-hover:border-[var(--border-hover)]
                    transition-colors duration-500
                    p-2 rounded-md
                  "
                  style={{
                    borderColor: "var(--border-subtle)",
                    backgroundColor: "var(--bg-panel)"
                  }}
                >
                  <img
                    src={profileImage}
                    alt="Reneesh"
                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700 rounded-sm"
                  />
                </div>
              </div>

              {/* Name & Title */}
              <div className="profile-name space-y-2">
                <h3
                  className="text-3xl font-display font-bold tracking-tight"
                  style={{ color: "var(--text-main)" }}
                >
                  RENEESH
                </h3>
                <p
                  className="font-accent font-medium tracking-[0.1em] text-sm uppercase"
                  style={{ color: "var(--text-muted)" }}
                >
                  MASTER CRAFTSMAN
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
                      border
                      transition-all duration-300
                      rounded-md
                    "
                    style={{
                      backgroundColor: "var(--bg-panel)",
                      borderColor: "var(--border-subtle)",
                      color: "var(--text-muted)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-hover)";
                      e.currentTarget.style.color = "var(--text-main)";
                      e.currentTarget.style.backgroundColor = "var(--bg-surface)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-subtle)";
                      e.currentTarget.style.color = "var(--text-muted)";
                      e.currentTarget.style.backgroundColor = "var(--bg-panel)";
                    }}
                  >
                    <social.icon size={20} className="transition-transform" />

                    {/* Tooltip */}
                    <span
                      className="
                        absolute -top-10 left-1/2 -translate-x-1/2 
                        px-2.5 py-1 
                        border 
                        text-xs font-accent tracking-widest rounded-sm 
                        opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
                        transition-all duration-300 pointer-events-none whitespace-nowrap
                      "
                      style={{
                        backgroundColor: "var(--bg-void)",
                        borderColor: "var(--border-subtle)",
                        color: "var(--text-main)"
                      }}
                    >
                      {social.label.toUpperCase()}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN — TEXT CONTENT */}
            <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center h-full">
              <h2
                className="about-headline text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-8 leading-[1.15]"
                style={{ color: "var(--text-main)" }}
              >
                Forging <span style={{ color: "var(--accent)" }}>intelligent systems</span> with discipline
              </h2>

              <div className="about-text space-y-6 text-lg leading-relaxed max-w-2xl font-body text-sm sm:text-base" style={{ color: "var(--text-muted)" }}>
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
                  className="group gap-3"
                  style={{ backgroundColor: "var(--bg-void)" }}
                >
                  <FileText size={20} style={{ color: "var(--text-muted)" }} className="group-hover:text-[var(--text-main)] transition-colors" />
                  <span className="font-accent tracking-wide" style={{ color: "var(--text-main)" }}>View the Scroll</span>
                  <ArrowRight
                    size={18}
                    style={{ color: "var(--accent)" }}
                    className="group-hover:translate-x-1 transition-transform"
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