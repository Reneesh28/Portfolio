import { useEffect, useRef, useState } from "react";
import { Linkedin, Github, Mail, ArrowRight, FileText } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
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
      className="relative w-full px-6 md:px-12 py-32 overflow-hidden border-t min-h-screen washi-texture"
      style={{
        backgroundColor: "var(--bg-void)",
        borderColor: "var(--border-subtle)"
      }}
    >
      <div ref={containerRef} className="max-w-7xl mx-auto relative">

        {/* --- THE SHOJI GATE — "Hold to Unveil" --- */}
        {!isUnlocked && (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#0C0A09]/40 backdrop-blur-sm" />

            <motion.div
              onMouseDown={startHold}
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              onTouchStart={startHold}
              onTouchEnd={stopHold}
              whileTap={{ scale: 0.98 }}
              className="
                 relative px-12 py-8
                 border bg-[var(--bg-panel)]
                 font-accent tracking-[0.4em] text-xs uppercase
                 cursor-pointer select-none
                 overflow-hidden group
                 transition-all duration-500
                 rounded-sm
               "
              style={{
                borderColor: progress > 0 ? "var(--accent)" : "var(--border-subtle)",
                color: "var(--text-main)",
                boxShadow: progress > 0 ? "0 0 40px rgba(194,65,12,0.15)" : "none"
              }}
            >
              {/* Ink Progress */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  width: `${progress}%`,
                  backgroundColor: "var(--accent)",
                  transition: progress < 100 ? "width 0.1s linear" : "none"
                }}
              />

              <span className="relative z-10 flex flex-col items-center gap-4">
                <span className="text-[var(--text-ink)] group-hover:text-[var(--accent)] transition-colors">
                  {progress >= 100 ? "UNVEILED" : "Hold to Meditate"}
                </span>
                <div className="w-32 h-[1px] bg-[var(--border-subtle)] relative">
                   <div className="absolute inset-0 bg-[var(--accent)]" style={{ width: `${progress}%` }} />
                </div>
              </span>
            </motion.div>
          </div>
        )}

        {/* --- MAIN CONTENT --- */}
        <div className={`transition-all duration-[2s] ease-out ${isUnlocked ? "blur-0 opacity-100 translate-y-0" : "blur-[20px] opacity-0 translate-y-10 pointer-events-none"}`}>

          <div className="flex flex-col lg:flex-row gap-20 items-start">
            
            {/* LEFT COLUMN — THE IMAGE & SOCIALS */}
            <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start">
              <div className="relative mb-12">
                {/* Decorative Frame */}
                <div className="absolute -inset-4 border border-[var(--border-subtle)] rounded-sm pointer-events-none" />
                <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-[var(--accent)]" />
                <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b border-r border-[var(--accent)]" />

                <div className="w-64 h-80 bg-[var(--bg-panel)] overflow-hidden rounded-sm border border-[var(--border-subtle)]">
                   <img
                    src={profileImage}
                    alt="Reneesh"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
              </div>

              <div className="space-y-6 text-center lg:text-left">
                <h3 className="font-display text-4xl font-bold tracking-tight text-[var(--text-main)]">Reneesh</h3>
                <p className="font-accent text-xs tracking-[0.3em] uppercase text-[var(--accent)]">Master Craftsman</p>
                
                <div className="flex gap-4 justify-center lg:justify-start">
                  {[
                    { href: "https://www.linkedin.com/in/balam-reneesh", icon: Linkedin },
                    { href: "https://github.com/Reneesh28", icon: Github },
                    { href: "mailto:reneesh3508925@gmail.com", icon: Mail },
                  ].map((social, i) => (
                    <Button key={i} as="a" href={social.href} variant="icon" size="icon">
                      <social.icon size={18} />
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN — THE BIO & PRINCIPLES */}
            <div className="w-full lg:w-2/3">
              <h2 className="font-display text-4xl md:text-6xl font-bold leading-[1.1] text-[var(--text-main)] mb-12">
                Forging <span className="text-[var(--accent)] italic">Intelligence</span> <br />
                With Single-Minded Focus.
              </h2>

              <div className="grid md:grid-cols-2 gap-12 text-[var(--text-muted)] font-body leading-relaxed">
                <div className="space-y-6">
                  <p>
                    I am an AI Engineer dedicated to the craft of building autonomous and generative systems that transcend simple automation.
                  </p>
                  <p>
                    My philosophy is rooted in the intersection of mathematical precision and creative experimentation—treating code not just as logic, but as an art form.
                  </p>
                </div>
                
                <div className="bg-[var(--bg-panel)] p-8 border border-[var(--border-subtle)] relative overflow-hidden rounded-sm">
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-12 h-12 bg-[var(--accent)]/5 flex items-center justify-center font-display text-xl text-[var(--accent)] opacity-40">
                    道
                  </div>
                  
                  <h4 className="font-accent text-[10px] tracking-[0.3em] uppercase text-[var(--accent)] mb-4">The Bushido of Code</h4>
                  <ul className="space-y-4 font-accent text-xs tracking-widest leading-loose">
                    <li className="flex items-center gap-3">
                      <span className="w-1 h-1 bg-[var(--accent)]" /> 
                      Purity of Architecture
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-1 h-1 bg-[var(--accent)]" /> 
                      Discipline in Implementation
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-1 h-1 bg-[var(--accent)]" /> 
                      Fearless Experimentation
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-16">
                <Button as="a" href="/resume.pdf" variant="secondary" size="lg" className="group">
                  <FileText size={18} className="mr-2 text-[var(--text-ink)] group-hover:text-[var(--accent)] transition-colors" />
                  <span className="font-accent tracking-widest uppercase text-xs">View the Scroll</span>
                  <ArrowRight size={16} className="ml-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}