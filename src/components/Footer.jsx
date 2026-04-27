import { FiGithub, FiLinkedin, FiMail, FiArrowUp } from "react-icons/fi";
import { Button } from "./ui/Button";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="w-full bg-[#0D0D0D] border-t border-white/5 px-6 md:px-12 py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">

        {/* Left: Legend & Status */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
            <h3 className="text-xl font-serif font-bold text-[#F5F5F5] tracking-tight">
              Balam Reneesh
            </h3>
            <div className="px-2 py-0.5 border border-[#C5A059]/30 bg-[#C5A059]/5 text-[#C5A059] text-[9px] font-bold uppercase tracking-[0.3em] animate-pulse">
              Honor. Strength. Code.
            </div>
          </div>
          <p className="text-[10px] font-serif text-[#A3A3A3] uppercase tracking-[0.4em]">
            © {new Date().getFullYear()} • FORGED IN THE FIRES OF LOGIC.
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="flex items-center gap-4">
            {[
              { icon: FiMail, href: "mailto:reneesh3508925@gmail.com", label: "Email" },
              { icon: FiLinkedin, href: "https://www.linkedin.com/in/balam-reneesh", label: "LinkedIn" },
              { icon: FiGithub, href: "https://github.com/Reneesh28", label: "GitHub" },
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                target={social.href.startsWith("mailto") ? undefined : "_blank"}
                rel={social.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="w-10 h-10 flex items-center justify-center bg-[#111111] border border-white/5 text-[#A3A3A3] hover:text-[#C5A059] hover:border-[#C5A059]/30 transition-all"
                aria-label={social.label}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-3 font-serif text-[10px] uppercase tracking-[0.4em] text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors"
          >
            RETURN TO PATH
            <FiArrowUp className="transform group-hover:-translate-y-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </footer>
  );
}
