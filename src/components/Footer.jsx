import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="w-full bg-black border-t border-neutral-800 px-6 sm:px-12 lg:px-24 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Left */}
        <p className="text-sm text-neutral-400 text-center md:text-left">
          © {new Date().getFullYear()} Balam Reneesh. All rights reserved.
        </p>

        {/* Right: Social Icons */}
        <div className="flex items-center gap-4">
          <a
            href="mailto:reneesh3508925@gmail.com"
            className="
              w-10 h-10
              flex items-center justify-center
              rounded-full
              border border-neutral-700
              text-neutral-300
              hover:text-white
              hover:border-neutral-500
              transition-all
            "
            aria-label="Email"
          >
            <FiMail />
          </a>

          <a
            href="https://www.linkedin.com/in/balam-reneesh"
            target="_blank"
            rel="noopener noreferrer"
            className="
              w-10 h-10
              flex items-center justify-center
              rounded-full
              border border-neutral-700
              text-neutral-300
              hover:text-white
              hover:border-neutral-500
              transition-all
            "
            aria-label="LinkedIn"
          >
            <FiLinkedin />
          </a>

          <a
            href="https://github.com/Reneesh28"
            target="_blank"
            rel="noopener noreferrer"
            className="
              w-10 h-10
              flex items-center justify-center
              rounded-full
              border border-neutral-700
              text-neutral-300
              hover:text-white
              hover:border-neutral-500
              transition-all
            "
            aria-label="GitHub"
          >
            <FiGithub />
          </a>
        </div>
      </div>
    </footer>
  );
}
