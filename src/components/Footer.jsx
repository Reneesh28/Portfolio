import { FiGithub, FiLinkedin, FiMail, FiArrowUp } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="w-full bg-neutral-900/60 backdrop-blur-xl border-t border-white/5 px-6 sm:px-12 lg:px-24 py-12 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">

        {/* Left: Copyright */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-white mb-2">
            Balam Reneesh
          </h3>
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} All rights reserved. Built with React & Tailwind.
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
              <a
                key={index}
                href={social.href}
                target={social.href.startsWith("mailto") ? undefined : "_blank"}
                rel={social.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="
                    p-3 rounded-full
                    bg-white/5 border border-white/10
                    text-neutral-400
                    hover:text-white hover:bg-white/10 hover:border-white/20
                    hover:scale-110
                    transition-all duration-300
                "
                aria-label={social.label}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>

          {/* Scroll To Top Button */}
          <button
            onClick={scrollToTop}
            className="
                    group
                    flex items-center gap-2
                    px-5 py-2.5
                    rounded-full
                    bg-white/5 border border-white/10
                    text-sm font-medium text-neutral-300
                    hover:bg-white hover:text-black
                    transition-all duration-300
                "
          >
            Back to Top
            <FiArrowUp className="group-hover:-translate-y-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </footer>
  );
}
