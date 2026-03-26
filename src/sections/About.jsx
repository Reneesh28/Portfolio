import { useEffect, useRef } from "react";
import { Linkedin, Github, Mail, ArrowRight, FileText } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import profileImage from "../assets/profile.jpg";
import { Button } from "../components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

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

      // 1. Label Reveal
      tl.from(".about-label", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
      })
        // 2. Profile Image & Name - Slide Up
        .from(
          [".profile-container", ".profile-name"],
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.3"
        )
        // 3. Social Icons - Staggered Slide Up
        .fromTo(
          ".social-icon",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.7)",
          },
          "-=0.5"
        )
        // 4. Headline - Reveal
        .from(
          ".about-headline",
          {
            opacity: 0,
            x: 30,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6"
        )
        // 5. Paragraphs - Staggered Fade Up
        .fromTo(
          ".about-text p",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2, // increased stagger for better effect
            ease: "power2.out",
          },
          "-=0.5"
        )
        // 6. Resume Button - Slide Up
        .from(
          ".resume-btn",
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.2"
        );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="w-full bg-[#0A0A0A] text-[#E0E0E0] px-6 md:px-12 py-24 sm:py-32 overflow-hidden border-t border-white/5"
    >
      <div ref={containerRef} className="max-w-7xl mx-auto">
        {/* Section Label */}
        <p className="about-label text-[#00BFA5] font-semibold uppercase tracking-[0.2em] text-sm mb-12 sm:mb-16">
          About Me
        </p>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-start">

          {/* LEFT COLUMN — PROFILE (Span 4 cols) */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
            {/* Profile Image (No Glow) */}
            <div className="profile-container relative group mb-8">
              <div
                className="
                  relative
                  w-64 h-64 sm:w-72 sm:h-72
                  border border-white/10
                  group-hover:border-white/30
                  transition-colors duration-500
                  bg-[#1A1A1A] p-2
                "
              >
                <img
                  src={profileImage}
                  alt="Reneesh"
                  className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>

            {/* Name & Title */}
            <div className="profile-name space-y-2">
              <h3 className="text-3xl font-bold tracking-tight text-[#E0E0E0]">
                RENEESH
              </h3>
              <p className="text-[#A3A3A3] font-medium tracking-[0.1em] text-sm uppercase">
                AI Engineer
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
                    hover:text-[#E0E0E0] hover:border-white/20 hover:bg-[#2A2A2A]
                    transition-colors duration-200
                  "
                >
                  <social.icon size={20} className="transition-transform" />

                  {/* Tooltip */}
                  <span className="
                    absolute -top-10 left-1/2 -translate-x-1/2 
                    px-2.5 py-1 
                    bg-neutral-800 border border-neutral-700 
                    text-neutral-300 text-xs font-medium rounded 
                    opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
                    transition-all duration-300 pointer-events-none whitespace-nowrap
                  ">
                    {social.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN — TEXT CONTENT (Span 8 cols) */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center h-full">
            <h2 className="about-headline text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-8 leading-[1.15] text-[#E0E0E0]">
              Building <span className="text-[#00BFA5]">intelligent systems</span> that scale
            </h2>

            <div className="about-text space-y-6 text-[#A3A3A3] text-lg leading-relaxed max-w-2xl">
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
                className="group gap-3 bg-[#0A0A0A]"
              >
                <FileText size={20} className="text-[#A3A3A3] group-hover:text-[#E0E0E0] transition-colors" />
                <span className="text-[#E0E0E0] tracking-wide">Download Resume</span>
                <ArrowRight
                  size={18}
                  className="text-[#A3A3A3] group-hover:text-[#E0E0E0] transition-colors"
                />
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}