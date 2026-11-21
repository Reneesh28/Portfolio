import React from "react";
import { FiGithub, FiLinkedin, FiMail, FiArrowUp } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";

const iconLinkClass = "w-11 h-11 flex items-center justify-center rounded-md bg-surface text-text border border-border hover:bg-surface-raised transition-colors";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="w-full bg-bg border-t border-border px-6 md:px-12 py-12 relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <p className="text-lg font-semibold">Balam Reneesh</p>
          <p className="text-sm text-text-muted mt-1">
            &copy; {new Date().getFullYear()} Balam Reneesh. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a href="mailto:reneesh3508925@gmail.com" className={iconLinkClass} aria-label="Email">
            <FiMail size={20} />
          </a>
          <a href="https://www.linkedin.com/in/balam-reneesh" target="_blank" rel="noreferrer" className={iconLinkClass} aria-label="LinkedIn">
            <FiLinkedin size={20} />
          </a>
          <a href="https://github.com/Reneesh28" target="_blank" rel="noreferrer" className={iconLinkClass} aria-label="GitHub">
            <FiGithub size={20} />
          </a>
          <a href="#" className="w-11 h-11 flex items-center justify-center rounded-md bg-surface text-text border border-border opacity-50 cursor-not-allowed" aria-label="X (unavailable)">
            <FaXTwitter size={20} />
          </a>
        </div>

        <button
          type="button"
          onClick={scrollToTop}
          className="flex items-center gap-2 px-5 py-3 rounded-md bg-accent text-accent-contrast font-medium hover:opacity-90 transition-opacity"
        >
          Back to top
          <FiArrowUp />
        </button>
      </div>
    </footer>
  );
}
