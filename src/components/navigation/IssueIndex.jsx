import React, { useState, useEffect, useRef } from 'react';
import PaperTexture from '../comic/PaperTexture';
import StampReveal from '../comic/StampReveal';

const navItems = [
  { id: 'hero', title: 'Home', subtitle: 'Cover' },
  { id: 'about', title: 'About', subtitle: 'Origin Story' },
  { id: 'skills', title: 'Skills', subtitle: 'Powers & Tools' },
  { id: 'experience', title: 'Experience', subtitle: 'Previous Issues' },
  { id: 'projects', title: 'Selected Projects', subtitle: 'The Universes' },
  { id: 'certifications', title: 'Certifications', subtitle: 'Collected Artifacts' },
  { id: 'education', title: 'Education', subtitle: 'Origin Records' },
  { id: 'contact', title: 'Contact', subtitle: 'Open a Portal' },
];

const IssueIndex = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef(null);
  const prevFocusRef = useRef(null);
  const [activeChapter, setActiveChapter] = useState('hero');
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
      setActiveChapter(currentId);
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

  // Lock body scroll and trap focus when index is open
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

  const activeItem = navItems.find(i => i.id === activeChapter) || navItems[0];

  return (
    <>
      {/* Top Nav Bar */}
      <nav className={`fixed top-0 left-0 w-full z-40 transition-transform duration-ui ${isVisible || isOpen ? 'translate-y-0' : '-translate-y-full'} bg-[var(--color-ink-black)] text-[var(--color-text-on-dark)] font-label uppercase text-sm border-b-4 border-ink-black`} style={{ boxShadow: '0 4px 0 var(--color-paper-border)' }}>
        <div className="flex justify-between items-center px-4 md:px-8 py-3 max-w-[1920px] mx-auto">
          <div className="flex items-center space-x-6">
            <span className="font-bold tracking-widest text-[var(--color-text-on-dark)]">RB / EARTH-28</span>
            <span className="hidden md:block text-[var(--color-comic-yellow)] tracking-widest">{activeItem.subtitle}</span>
          </div>

          <div className="flex items-center space-x-4 md:space-x-8">
            <a href="/resume.pdf" target="_blank" rel="noreferrer" className="hover:text-[var(--color-portal-cyan)] transition-colors comic-focus hidden md:block font-bold">
              [RESUME]
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="hover:text-[var(--color-dimension-magenta)] transition-colors comic-focus outline-none font-bold tracking-widest cursor-pointer"
              aria-label="Toggle Issue Index"
            >
              [ISSUE INDEX]
            </button>
          </div>
        </div>

        {/* Ink-stroke progress line */}
        <div className="h-1 bg-[var(--color-noir-black)] w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-[var(--color-portal-cyan)] transition-all duration-150" style={{ width: `${progress}%` }} />
        </div>
      </nav>

      {/* Full-screen Issue Index Modal */}
      {isOpen && (
        <div ref={dialogRef} className="fixed inset-0 z-50 bg-[var(--color-paper)] text-[var(--color-ink-black)] flex flex-col p-4 md:p-8 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Issue Index">
          <PaperTexture theme="light" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 border-b-4 border-[var(--color-ink-black)] pb-4 gap-4">
            <StampReveal sfx={null} color="var(--color-dimension-magenta)" rotation={-5} once={false} delay={0.05}>
              <h2 className="font-display text-4xl md:text-5xl tracking-widest text-shadow-magenta">ISSUE INDEX</h2>
            </StampReveal>
            <div className="flex items-center space-x-4 flex-wrap gap-y-2">
              <a href="/resume.pdf" target="_blank" rel="noreferrer" className="font-label uppercase hover:text-[var(--color-dimension-magenta)] font-bold">Resume</a>
              <a href="https://github.com/Reneesh28" target="_blank" rel="noreferrer" className="font-label uppercase hover:text-[var(--color-dimension-magenta)] font-bold">GitHub</a>
              <button onClick={() => setIsOpen(false)} className="font-display text-2xl hover:text-[var(--color-error-red)] comic-focus p-2 cursor-pointer border-2 border-transparent">CLOSE [X]</button>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full pb-12">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`comic-focus group relative overflow-hidden flex flex-col items-start p-6 text-left transition-transform active:scale-95 min-h-[160px] border-4 border-[var(--color-ink-black)] cursor-pointer ${activeChapter === item.id ? 'bg-[var(--color-comic-yellow)] text-[var(--color-ink-black)]' : 'bg-[var(--color-paper-light)] text-[var(--color-ink-black)] hover:bg-[var(--color-portal-cyan)]'}`}
                style={{
                  clipPath: index % 2 === 0
                    ? 'polygon(0 0, 100% 3%, 97% 100%, 3% 97%)'
                    : 'polygon(3% 0, 97% 3%, 100% 100%, 0 97%)',
                  animation: `fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s forwards`,
                  opacity: 0,
                  transform: 'translateY(20px)'
                }}
              >
                <div className="absolute inset-0 bg-halftone-light opacity-30 pointer-events-none mix-blend-multiply"></div>
                <div className="relative z-10">
                  <span className="font-display text-3xl md:text-4xl mb-1 block opacity-80">#{String(index + 1).padStart(2, '0')}</span>
                  <span className="font-label uppercase font-bold text-xl leading-tight block mb-2">{item.subtitle}</span>
                  <span className="font-body text-sm font-semibold opacity-70">{item.title}</span>
                </div>
              </button>
            ))}
          </div>

          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes fadeInUp {
              to { opacity: 1; transform: translateY(0); }
            }
            .text-shadow-magenta {
              text-shadow: 2px 2px 0 var(--color-dimension-magenta);
            }
          `}} />
        </div>
      )}
    </>
  );
};

export default IssueIndex;