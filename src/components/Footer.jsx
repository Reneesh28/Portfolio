import React from "react";
import { FiGithub, FiLinkedin, FiMail, FiArrowUp } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import InkButton from "./comic/InkButton";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="w-full bg-[var(--color-paper-light)] border-t-8 border-[var(--color-ink-black)] px-6 md:px-12 py-16 relative overflow-hidden z-20">
      
      {/* Background Texture */}
      <div className="absolute inset-0 bg-halftone-light opacity-50 mix-blend-multiply pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-12 relative z-10">
        
        {/* Top: Issue Code and Barcode */}
        <div className="w-full flex justify-between items-start border-b-4 border-[var(--color-ink-black)] pb-8">
          <div className="text-left">
            <h3 className="font-display text-4xl text-[var(--color-ink-black)] tracking-wider">
              ACROSS THE CODEVERSE
            </h3>
            <p className="font-label uppercase font-bold text-[var(--color-pencil-gray)] tracking-widest mt-1">
              ISSUE #01 · PUBLISHED EARTH-28
            </p>
          </div>
          
          <div className="hidden md:flex flex-col items-end">
            <div className="flex gap-[2px] h-12 bg-white p-2 border-2 border-[var(--color-ink-black)]">
              {/* Fake Barcode */}
              {[1, 3, 1, 2, 4, 1, 1, 3, 2, 5, 1, 2, 1, 3].map((w, i) => (
                <div key={i} className="bg-[var(--color-ink-black)] h-full" style={{ width: `${w * 2}px` }}></div>
              ))}
            </div>
            <p className="font-mono text-xs font-bold mt-1 text-[var(--color-ink-black)]">9 780982 342115</p>
          </div>
        </div>

        {/* Middle: Actions and Links */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <a href="mailto:reneesh3508925@gmail.com" className="w-12 h-12 flex items-center justify-center bg-[var(--color-ink-black)] text-white hover:bg-[var(--color-portal-cyan)] hover:text-[var(--color-ink-black)] border-4 border-transparent hover:border-[var(--color-ink-black)] transition-all comic-focus group">
              <FiMail size={20} className="group-hover:scale-110 transition-transform" />
            </a>
            <a href="https://www.linkedin.com/in/balam-reneesh" target="_blank" rel="noreferrer" className="w-12 h-12 flex items-center justify-center bg-[var(--color-ink-black)] text-white hover:bg-[var(--color-comic-yellow)] hover:text-[var(--color-ink-black)] border-4 border-transparent hover:border-[var(--color-ink-black)] transition-all comic-focus group">
              <FiLinkedin size={20} className="group-hover:scale-110 transition-transform" />
            </a>
            <a href="https://github.com/Reneesh28" target="_blank" rel="noreferrer" className="w-12 h-12 flex items-center justify-center bg-[var(--color-ink-black)] text-white hover:bg-[var(--color-dimension-magenta)] hover:text-[var(--color-ink-black)] border-4 border-transparent hover:border-[var(--color-ink-black)] transition-all comic-focus group">
              <FiGithub size={20} className="group-hover:scale-110 transition-transform" />
            </a>
            <a href="#" className="w-12 h-12 flex items-center justify-center bg-[var(--color-ink-black)] text-white opacity-50 cursor-not-allowed border-4 border-transparent">
              <FaXTwitter size={20} />
            </a>
          </div>

          <InkButton variant="yellow" onClick={scrollToTop} className="flex items-center gap-2 group">
            RETURN TO COVER
            <FiArrowUp className="group-hover:-translate-y-1 transition-transform" />
          </InkButton>
        </div>

        {/* Bottom: Copyright */}
        <div className="w-full text-center mt-8">
          <p className="font-mono text-xs font-bold text-[var(--color-pencil-gray)]">
            © {new Date().getFullYear()} BALAM RENEESH. ALL RIGHTS RESERVED IN THIS UNIVERSE.
          </p>
          <div className="mt-4 flex justify-center gap-1">
            <div className="w-4 h-4 bg-[var(--color-portal-cyan)] rounded-full mix-blend-multiply opacity-70"></div>
            <div className="w-4 h-4 bg-[var(--color-dimension-magenta)] rounded-full mix-blend-multiply opacity-70 -ml-2"></div>
            <div className="w-4 h-4 bg-[var(--color-comic-yellow)] rounded-full mix-blend-multiply opacity-70 -ml-2"></div>
          </div>
        </div>

      </div>
    </footer>
  );
}
