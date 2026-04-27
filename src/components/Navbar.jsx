import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedLogo from "./AnimatedLogo";

const navItems = [
  { label: "Home", href: "#hero" },
  { label: "Legend", href: "#about" },
  { label: "Arts", href: "#skills" },
  { label: "Seals", href: "#certifications" },
  { label: "Battles", href: "#projects" },
  { label: "Lineage", href: "#education" },
  { label: "Journey", href: "#experience" },
  { label: "Messenger", href: "#contact" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 80) setHidden(false);
      else if (currentY > lastScrollY.current && !open) setHidden(true);
      else setHidden(false);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full z-50 bg-[#0D0D0D]/80 backdrop-blur-md border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero">
          <AnimatedLogo text="RENEESH" />
        </a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-10 text-[10px] font-serif uppercase tracking-[0.3em] text-[#A3A3A3]">
          {navItems.map((item) => (
            <li key={item.label} className="relative group">
              <a href={item.href} className="hover:text-[#F5F5F5] transition-colors duration-300">
                {item.label}
              </a>
              <div className="absolute -bottom-1 left-0 w-0 h-px bg-[#C5A059] transition-all duration-300 group-hover:w-full" />
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#C5A059] text-2xl"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0D0D0D] border-t border-white/5 overflow-hidden"
          >
            <ul className="flex flex-col px-8 py-8 gap-6 text-sm font-serif uppercase tracking-[0.4em] text-[#A3A3A3]">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block hover:text-[#C5A059] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
