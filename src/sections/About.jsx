import { useEffect, useRef } from "react";
import { Linkedin, Github, Mail } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import profileImage from "../assets/profile.jpg";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="w-full bg-black text-white px-6 sm:px-12 lg:px-24 py-28"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Label */}
        <p className="text-neutral-400 uppercase tracking-[0.3em] text-xs mb-12">
          About
        </p>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          {/* LEFT — IMAGE + SOCIALS */}
          <div className="flex flex-col items-center">
            {/* Profile Image (JPG from assets) */}
            <div
              className="
                w-72 h-72
                sm:w-80 sm:h-80
                rounded-full
                overflow-hidden
                border border-neutral-700
              "
            >
              <img
                src={profileImage}
                alt="Reneesh"
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Name as TEXT (Branding-safe) */}
            <p className="mt-4 text-sm tracking-widest text-neutral-400">
              RENEESH
            </p>

            {/* Social Icons */}
            <div className="mt-8 flex items-center gap-8">
              <a
                href="https://www.linkedin.com/in/balam-reneesh"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="
                  w-12 h-12
                  rounded-full
                  border border-neutral-700
                  flex items-center justify-center
                  text-neutral-400
                  hover:text-white
                  hover:border-white
                  transition
                "
              >
                <Linkedin size={20} />
              </a>

              <a
                href="https://github.com/Reneesh28"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="
                  w-12 h-12
                  rounded-full
                  border border-neutral-700
                  flex items-center justify-center
                  text-neutral-400
                  hover:text-white
                  hover:border-white
                  transition
                "
              >
                <Github size={20} />
              </a>

              <a
                href="mailto:reneesh3508925@gmail.com"
                aria-label="Email"
                className="
                  w-12 h-12
                  rounded-full
                  border border-neutral-700
                  flex items-center justify-center
                  text-neutral-400
                  hover:text-white
                  hover:border-white
                  transition
                "
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* RIGHT — TEXT */}
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-8">
              Building intelligent systems that scale
            </h2>

            <div className="space-y-6 text-neutral-300 text-base sm:text-lg leading-relaxed max-w-xl">
              <p>
                I am an AI Engineer focused on designing and building machine
                learning and generative AI systems that are reliable, scalable,
                and grounded in real-world use cases.
              </p>

              <p>
                My work spans across model development, data pipelines, and
                system integration — with a strong emphasis on translating
                complex ideas into production-ready solutions.
              </p>

              <p>
                I enjoy working at the intersection of research and engineering,
                where experimentation meets disciplined system design.
              </p>
            </div>

            {/* Resume */}
            <div className="mt-10">
              <a
                href="/resume.pdf"
                download="Reneesh_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-block
                  text-white
                  font-medium
                  border-b
                  border-white
                  pb-1
                  hover:opacity-70
                  transition
                "
              >
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}