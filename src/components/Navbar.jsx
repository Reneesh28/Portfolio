import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const navItems = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Disciplines", href: "#skills" },
  { label: "Journey", href: "#experience" },
  { label: "Works", href: "#projects" },
  { label: "Honors", href: "#certifications" },
  { label: "Foundations", href: "#education" },
  { label: "Contact", href: "#contact" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  /* =========================
     SCROLL HANDLER
  ========================== */
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      // Always show near top
      if (currentY < 80) {
        setHidden(false);
      }
      // Scroll down → hide
      else if (currentY > lastScrollY.current && !open) {
        setHidden(true);
      }
      // Scroll up → show
      else {
        setHidden(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        fixed top-0 left-0 w-full z-50
        backdrop-blur-md
        border-b
      "
      style={{
        backgroundColor: "rgba(12, 10, 9, 0.85)",
        borderColor: "var(--border-subtle)"
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">

        {/* Logo — with kanji accent */}
        <a
          href="#hero"
          className="font-display text-lg font-bold tracking-tight flex items-center gap-2"
          style={{ color: "var(--text-main)" }}
        >
          <span
            className="text-xl opacity-60"
            style={{ color: "var(--accent)" }}
          >
            蓮
          </span>
          Reneesh
        </a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-accent" style={{ color: "var(--text-muted)" }}>
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="relative py-1 transition-colors duration-300 hover:text-[var(--text-main)] group"
              >
                {item.label}
                {/* Subtle underline on hover */}
                <span
                  className="absolute bottom-0 left-0 w-0 h-[1px] group-hover:w-full transition-all duration-300"
                  style={{ backgroundColor: "var(--accent)" }}
                />
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-xl transition-colors"
          style={{ color: "var(--text-muted)" }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden border-t"
          style={{
            backgroundColor: "var(--bg-void)",
            borderColor: "var(--border-subtle)"
          }}
        >
          <ul className="flex flex-col px-6 py-4 gap-4 text-sm font-accent" style={{ color: "var(--text-muted)" }}>
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-1 transition-colors hover:text-[var(--text-main)]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.nav>
  );
}
