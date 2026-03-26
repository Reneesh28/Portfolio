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
    <footer className="w-full bg-[#0A0A0A] border-t border-white/5 px-6 md:px-12 py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">

        {/* Left: Copyright */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-[#E0E0E0] mb-2">
            Balam Reneesh
          </h3>
          <p className="text-sm text-[#A3A3A3]">
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
            className="group gap-2"
          >
            Back to Top
            <FiArrowUp className="transform group-hover:-translate-y-0.5 transition-transform duration-200" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
