import React, { useState, useEffect, useRef } from 'react';

const navItems = [
  { id: 'hero', title: 'Home' },
  { id: 'about', title: 'About' },
  { id: 'skills', title: 'Skills' },
  { id: 'experience', title: 'Experience' },
  { id: 'projects', title: 'Projects' },
  { id: 'certifications', title: 'Certifications' },
  { id: 'education', title: 'Education' },
  { id: 'contact', title: 'Contact' },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef(null);
  const prevFocusRef = useRef(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setProgress(scrolled);

      if (currentScrollY > lastScrollY && currentScrollY > 100 && !isOpen) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);

      const sections = navItems.map(item => document.getElementById(item.id));
      let currentId = 'hero';
      sections.forEach(section => {
        if (section) {
          const sectionTop = section.offsetTop;
          if (window.scrollY >= sectionTop - 200) {
            currentId = section.id;
          }
        }
      });
      setActiveSection(currentId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Lock body scroll and trap focus when the menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      prevFocusRef.current = document.activeElement;

      // Focus first element
      if (dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length) focusable[0].focus();
      }

      // Trap focus
      const handleTab = (e) => {
        if (e.key !== 'Tab' || !dialogRef.current) return;

        const focusable = dialogRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      window.addEventListener('keydown', handleTab);
      return () => window.removeEventListener('keydown', handleTab);
    } else {
      document.body.style.overflow = '';
      if (prevFocusRef.current) prevFocusRef.current.focus();
    }
  }, [isOpen]);

  const scrollTo = (id) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeItem = navItems.find(i => i.id === activeSection) || navItems[0];

  return (
    <>
      {/* Top Nav Bar */}
      <nav className={`fixed top-0 left-0 w-full z-40 transition-transform duration-300 ${isVisible || isOpen ? 'translate-y-0' : '-translate-y-full'} bg-bg/90 backdrop-blur text-text text-sm border-b border-border`}>
        <div className="flex justify-between items-center px-4 md:px-8 py-3 max-w-[1920px] mx-auto">
          <div className="flex items-center space-x-6">
            <span className="font-semibold">Reneesh Balam</span>
            <span className="hidden md:block text-text-muted">{activeItem.title}</span>
          </div>

          <div className="flex items-center space-x-4 md:space-x-8">
            <a href="/resume.pdf" target="_blank" rel="noreferrer" className="hover:text-text-muted transition-colors hidden md:block font-medium">
              Resume
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="hover:text-text-muted transition-colors font-medium cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              Menu
            </button>
          </div>
        </div>

        {/* Scroll progress line */}
        <div className="h-0.5 bg-surface w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-accent transition-all duration-150" style={{ width: `${progress}%` }} />
        </div>
      </nav>

      {/* Full-screen navigation menu */}
      {isOpen && (
        <div ref={dialogRef} className="fixed inset-0 z-50 bg-bg text-text flex flex-col p-4 md:p-8 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 border-b border-border pb-4 gap-4">
            <h2 className="text-3xl md:text-4xl font-semibold">Navigate</h2>
            <div className="flex items-center space-x-4 flex-wrap gap-y-2">
              <a href="/resume.pdf" target="_blank" rel="noreferrer" className="font-medium hover:text-text-muted">Resume</a>
              <a href="https://github.com/Reneesh28" target="_blank" rel="noreferrer" className="font-medium hover:text-text-muted">GitHub</a>
              <button onClick={() => setIsOpen(false)} className="font-medium hover:text-text-muted p-2 cursor-pointer">Close</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto w-full pb-12">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`flex flex-col items-start p-6 text-left transition-colors min-h-[120px] rounded-lg border cursor-pointer ${activeSection === item.id ? 'bg-accent text-accent-contrast border-accent' : 'bg-surface text-text border-border hover:bg-surface-raised'}`}
              >
                <span className="text-sm opacity-60 mb-2">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-xl font-semibold">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
