import { FiGithub, FiLinkedin, FiMail, FiArrowUp } from "react-icons/fi";
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
    <footer
      className="w-full px-6 md:px-12 py-12 relative overflow-hidden border-t"
      style={{
        backgroundColor: "var(--bg-void)",
        borderColor: "var(--border-subtle)"
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">

        {/* Left: Copyright & Status */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <h3
              className="text-lg font-display font-bold tracking-tight"
              style={{ color: "var(--text-main)" }}
            >
              Balam Reneesh
            </h3>
            <div
              className="flex items-center gap-2 px-2.5 py-0.5 border rounded-sm text-[9px] font-accent font-bold uppercase tracking-widest animate-pulse"
              style={{
                borderColor: "var(--border-hover)",
                backgroundColor: "rgba(194, 65, 12, 0.05)",
                color: "var(--accent)"
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
              Present
            </div>
          </div>
          <p
            className="text-[10px] font-accent uppercase tracking-wider"
            style={{ color: "var(--text-ink)" }}
          >
            © {new Date().getFullYear()} · Crafted with discipline.
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Social Icons */}
          <div className="flex items-center gap-3">
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
            className="group gap-2 font-accent text-[10px] uppercase tracking-widest bg-transparent"
          >
            Return to Summit
            <FiArrowUp className="transform group-hover:-translate-y-0.5 transition-transform duration-200" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
