import { FiGithub, FiLinkedin, FiMail, FiArrowUp, FiTerminal } from "react-icons/fi";
import { Button } from "./ui/Button";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 px-6 md:px-12 py-20 relative overflow-hidden">
      {/* Background Seal Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
        <span className="font-shippori text-[25rem] text-white select-none">結</span>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">

        {/* Left: The Signature */}
        <div className="text-center md:text-left flex flex-col gap-4">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <h3 className="font-shippori text-3xl md:text-5xl text-[#E0E0E0] tracking-[0.2em] uppercase">
              Reneesh
            </h3>
            <div className="flex items-center gap-2 px-3 py-1 border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[9px] font-mono font-bold uppercase tracking-widest">
              <FiTerminal size={10} /> Forge_Stable
            </div>
          </div>
          <p className="font-mono text-[10px] text-[#444] tracking-[0.5em] uppercase">
            Era_of_2024 // Built_for_the_Digital_Shogun
          </p>
        </div>

        {/* Right: Alliances & Ascension */}
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Social Icons */}
          <div className="flex items-center gap-8">
            {[
              { icon: FiMail, href: "mailto:reneesh3508925@gmail.com", label: "Email" },
              { icon: FiLinkedin, href: "https://www.linkedin.com/in/balam-reneesh", label: "LinkedIn" },
              { icon: FiGithub, href: "https://github.com/Reneesh28", label: "GitHub" },
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-[#333] hover:text-[#D4AF37] transition-all duration-300"
              >
                <social.icon size={22} />
              </a>
            ))}
          </div>

          {/* Scroll To Top Button */}
          <Button
            onClick={scrollToTop}
            className="group gap-4 font-mono text-[10px] uppercase tracking-[0.6em] border-[#D4AF37]/20 bg-transparent text-[#D4AF37]/60 hover:text-[#D4AF37] hover:border-[#D4AF37]/60 transition-all duration-500 py-6 px-8"
          >

            Ascend_to_Zenith
            <FiArrowUp className="transform group-hover:-translate-y-1 transition-all duration-300" />
          </Button>
        </div>
      </div>

      {/* Footer Branding Detail */}
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 opacity-10 flex justify-center md:justify-start">
        <p className="font-mono text-[8px] tracking-[0.8em] text-white uppercase">
          All_Rights_Reserved_In_The_Hall_Of_Honor
        </p>
      </div>
    </footer>
  );
}
