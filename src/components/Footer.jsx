import { FiGithub, FiLinkedin, FiMail, FiArrowUp, FiTerminal } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import { Button } from "./ui/Button";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="w-full bg-[#0A0A0A] border-t border-white/5 px-6 md:px-12 py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">

        {/* Left: Copyright & Status */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <h3 className="text-lg font-bold text-[#E0E0E0] tracking-tight">
              Balam Reneesh
            </h3>
            <div className="flex items-center gap-2 px-2 py-0.5 border border-[#00BFA5]/30 bg-[#00BFA5]/5 text-[#00BFA5] text-[9px] font-mono font-bold uppercase tracking-widest animate-pulse">
              <FiTerminal size={10} /> System_Online
            </div>
          </div>
          <p className="text-[10px] font-mono text-[#A3A3A3] uppercase tracking-wider">
            © {new Date().getFullYear()} ARCHIVE_V5.0 // Built with React & GSAP.
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {[
              { icon: FiMail, href: "mailto:reneesh3508925@gmail.com", label: "Email" },
              { icon: FiLinkedin, href: "https://www.linkedin.com/in/balam-reneesh", label: "LinkedIn" },
              { icon: FiGithub, href: "https://github.com/Reneesh28", label: "GitHub" },
              { icon: FaXTwitter, href: "#", label: "Twitter" },
            ].map((social, index) => (
              <Button
                as="a"
                key={index}
                href={social.href}
                variant="icon"
                size="icon"
                target={social.href.startsWith("mailto") ? undefined : "_blank"}
                rel={social.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                aria-label={social.label}
              >
                <social.icon size={18} />
              </Button>
            ))}
          </div>

          {/* Scroll To Top Button */}
          <Button
            onClick={scrollToTop}
            variant="secondary"
            className="group gap-2 font-mono text-[10px] uppercase tracking-widest border-white/5 bg-transparent hover:bg-white/5"
          >
            RETURN_TO_ROOT
            <FiArrowUp className="transform group-hover:-translate-y-0.5 transition-transform duration-200" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
