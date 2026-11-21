import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import educationData from '../data/education';

gsap.registerPlugin(ScrollTrigger);

const Education = () => {
  const sectionRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const mm = gsap.matchMedia(sectionRef);

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)",
      reduceMotion: "(prefers-reduced-motion: reduce)"
    }, (context) => {
      let { isDesktop, reduceMotion } = context.conditions;

      if (reduceMotion) {
        gsap.set('.education-container', { opacity: 1 });
        return;
      }

      gsap.from('.education-container', {
        y: isDesktop ? 100 : 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true
        }
      });
    });

    return () => mm.revert();
  }, []);

  // When tab changes, animate the content
  useEffect(() => {
    gsap.fromTo('.education-content',
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
    );
  }, [activeTab]);

  const active = educationData[activeTab];

  return (
    <section ref={sectionRef} id="education" className="relative w-full min-h-screen flex flex-col py-24 px-4 md:px-12 lg:px-24 bg-surface text-text border-y border-border z-10">
      <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center">

        <div className="text-center mb-16 relative">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-text">
            Education
          </h2>
        </div>

        <div className="education-container w-full">

          {/* Tabs */}
          <div className="flex gap-2 mb-4" role="tablist">
            {educationData.map((edu, idx) => (
              <button
                key={idx}
                role="tab"
                aria-selected={activeTab === idx}
                onClick={() => setActiveTab(idx)}
                className={`text-sm md:text-base font-medium px-5 py-2 rounded-md border transition-colors duration-300 ${activeTab === idx
                  ? 'bg-accent text-accent-contrast border-accent'
                  : 'bg-bg text-text-muted border-border hover:text-text'
                  }`}
              >
                {edu.degree.split(' ')[0]} {edu.degree.includes('High') ? 'School' : ''}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="rounded-lg border border-border bg-bg min-h-[400px]">
            <div className="education-content p-8 md:p-12 h-full flex flex-col">

              <div className="mb-8 border-b border-border pb-6">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
                  {active.degree}
                </h3>
                <p className="text-lg text-text-muted font-medium">
                  {active.institution}
                </p>
              </div>

              <div className="flex-grow">
                <p className="text-base md:text-lg leading-relaxed whitespace-pre-line opacity-90 max-w-2xl">
                  {active.description}
                </p>

                {active.coursework && (
                  <div className="mt-8">
                    <p className="text-xs font-medium uppercase tracking-wider text-text-muted mb-3">Coursework</p>
                    <div className="flex flex-wrap gap-2">
                      {active.coursework.map((course, i) => (
                        <span key={i} className="font-mono text-xs rounded border border-border bg-surface px-2 py-1">
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-12 flex flex-wrap gap-8 border-t border-border pt-6">
                <div>
                  <span className="block text-text-muted text-xs uppercase tracking-wider mb-1">Period</span>
                  <span className="font-semibold">{active.period}</span>
                </div>
                <div>
                  <span className="block text-text-muted text-xs uppercase tracking-wider mb-1">Score</span>
                  <span className="font-semibold">{active.score}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Education;
