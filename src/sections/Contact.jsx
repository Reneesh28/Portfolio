import React, { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ComicSpread from "../components/comic/ComicSpread";
import ComicPanel from "../components/comic/ComicPanel";
import InkButton from "../components/comic/InkButton";
import profileData from "../data/profile";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const formRef = useRef(null);
  const sectionRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle, sending, success, error
  const [logs, setLogs] = useState(["AWAITING MESSAGE..."]);
  const [effectText, setEffectText] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-panel", {
        y: 100,
        opacity: 0,
        rotation: (i) => i % 2 === 0 ? -2 : 2,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const sendEmail = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setLogs(["INITIATING DELIVERY..."]);
    
    // Comic Effect "Zzzap!"
    setEffectText("ZZZAP!");
    gsap.fromTo('.comic-effect', 
      { scale: 0, opacity: 1, rotation: -20 },
      { scale: 1.5, opacity: 0, rotation: 20, duration: 0.6, ease: "power4.out" }
    );

    await new Promise(r => setTimeout(r, 800));
    setLogs(prev => [...prev, "ROUTING TO INBOX..."]);

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setLogs(prev => [...prev, "MESSAGE RECEIVED!"]);
      setStatus("success");
      setEffectText("BOOM!");
      gsap.fromTo('.comic-effect', 
        { scale: 0, opacity: 1, rotation: 10 },
        { scale: 2, opacity: 0, rotation: -10, duration: 1, ease: "elastic.out(1, 0.3)" }
      );
      formRef.current.reset();
      
      // Reset back to idle after a while
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      console.error(err);
      setLogs(prev => [...prev, "DELIVERY FAILED. TRY AGAIN."]);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <ComicSpread id="contact" className="bg-[var(--color-ink-black)] text-[var(--color-text-on-dark)] z-30 pb-32" ref={sectionRef}>
      
      {/* Background Texture */}
      <div className="absolute inset-0 bg-halftone-magenta opacity-20 mix-blend-screen pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
          <p className="font-label uppercase tracking-[0.3em] font-bold text-[var(--color-portal-cyan)] mb-2">COMMUNICATIONS</p>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wider text-[var(--color-text-on-dark)]">
            GET IN TOUCH
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: The Portal Interface */}
          <div className="contact-panel lg:col-span-7 h-full">
            <ComicPanel theme="dark" rotation="-1deg" className="h-full p-6 md:p-10 relative overflow-hidden bg-[var(--color-deep-navy)]" style={{ borderColor: 'var(--color-portal-cyan)' }}>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-dimension-magenta)] rounded-full blur-[80px] opacity-30 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--color-portal-cyan)] rounded-full blur-[80px] opacity-30 pointer-events-none"></div>

              <h3 className="font-display text-3xl mb-8 text-[var(--color-dimension-magenta)]">SEND A MESSAGE</h3>
              
              <form ref={formRef} onSubmit={sendEmail} className="space-y-6 relative z-10">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label font-bold uppercase text-[var(--color-text-muted-dark)] text-xs">Your Name</label>
                    <input
                      type="text"
                      name="from_name"
                      required
                      autoComplete="name"
                      className="w-full bg-[var(--color-ink-black)] border-4 border-[var(--color-ink-black)] p-4 font-mono text-sm text-[var(--color-text-on-dark)] placeholder-[var(--color-text-muted-dark)] focus:outline-none focus:border-[var(--color-portal-cyan)] transition-colors rough-border shadow-inner"
                      placeholder="Jane Doe"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-label font-bold uppercase text-[var(--color-text-muted-dark)] text-xs">Email Address</label>
                    <input
                      type="email"
                      name="from_email"
                      required
                      autoComplete="email"
                      className="w-full bg-[var(--color-ink-black)] border-4 border-[var(--color-ink-black)] p-4 font-mono text-sm text-[var(--color-text-on-dark)] placeholder-[var(--color-text-muted-dark)] focus:outline-none focus:border-[var(--color-portal-cyan)] transition-colors rough-border shadow-inner"
                      placeholder="jane@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-label font-bold uppercase text-[var(--color-text-muted-dark)] text-xs">Mission Type</label>
                  <div className="relative">
                    <select
                      name="mission_type"
                      required
                      defaultValue=""
                      className="w-full bg-[var(--color-ink-black)] border-4 border-[var(--color-ink-black)] p-4 font-mono text-sm text-[var(--color-text-on-dark)] focus:outline-none focus:border-[var(--color-portal-cyan)] transition-colors rough-border shadow-inner appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select an inquiry type...</option>
                      <option value="Job Opportunity">Job Opportunity</option>
                      <option value="Freelance/Contract">Freelance/Contract</option>
                      <option value="Networking">Networking</option>
                      <option value="Other">Other</option>
                    </select>
                    {/* Custom caret */}
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-[var(--color-portal-cyan)]">
                      ▼
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="font-label font-bold uppercase text-[var(--color-text-muted-dark)] text-xs">Message</label>
                  <textarea
                    name="message"
                    rows="4"
                    required
                    className="w-full bg-[var(--color-ink-black)] border-4 border-[var(--color-ink-black)] p-4 font-mono text-sm text-[var(--color-text-on-dark)] placeholder-[var(--color-text-muted-dark)] focus:outline-none focus:border-[var(--color-portal-cyan)] transition-colors rough-border shadow-inner resize-none"
                    placeholder="How can I help you?"
                  />
                </div>
                
                <div className="pt-4 relative">
                  <InkButton 
                    type="submit" 
                    variant={status === 'success' ? 'yellow' : 'cyan'} 
                    disabled={status === "sending"}
                    className="w-full text-lg shadow-[8px_8px_0_var(--color-dimension-magenta)]"
                  >
                    {status === "sending" ? "SENDING..." : status === "success" ? "MESSAGE SENT!" : "SEND MESSAGE"}
                  </InkButton>

                  {/* Comic Effect Text */}
                  <div className="comic-effect absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-display text-6xl text-[var(--color-comic-yellow)] pointer-events-none opacity-0 z-50 mix-blend-screen drop-shadow-[0_0_10px_var(--color-signal-red)]">
                    {effectText}
                  </div>
                </div>
              </form>
            </ComicPanel>
          </div>

          {/* Right Panel: Operator Data & Logs */}
          <div className="lg:col-span-5 flex flex-col gap-8 h-full">
            
            {/* Operator Info */}
            <div className="contact-panel flex-grow">
              <ComicPanel theme="light" rotation="1deg" className="h-full p-6 md:p-8 bg-[var(--color-paper-light)]">
                <div className="border-b-4 border-[var(--color-ink-black)] pb-4 mb-6">
                  <h3 className="font-display text-4xl text-[var(--color-ink-black)] leading-none">CONTACT DETAILS</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <span className="font-label uppercase font-bold text-xs text-[var(--color-pencil-gray)] block mb-1">Name</span>
                    <span className="font-display text-2xl text-[var(--color-ink-black)]">{profileData.name}</span>
                  </div>
                  <div>
                    <span className="font-label uppercase font-bold text-xs text-[var(--color-pencil-gray)] block mb-1">Email</span>
                    <a href="mailto:reneesh3508925@gmail.com" className="font-mono font-bold text-base text-[var(--color-portal-cyan)] hover:text-[var(--color-dimension-magenta)] transition-colors">reneesh3508925@gmail.com</a>
                  </div>
                  <div>
                    <span className="font-label uppercase font-bold text-xs text-[var(--color-pencil-gray)] block mb-1">Networks</span>
                    <div className="flex gap-4">
                      <a href="https://github.com/Reneesh28" target="_blank" rel="noreferrer" className="font-label font-bold text-[var(--color-ink-black)] border-b-2 border-[var(--color-ink-black)] hover:text-[var(--color-dimension-magenta)] hover:border-[var(--color-dimension-magenta)] transition-all">GITHUB</a>
                      <a href="https://www.linkedin.com/in/balam-reneesh" target="_blank" rel="noreferrer" className="font-label font-bold text-[var(--color-ink-black)] border-b-2 border-[var(--color-ink-black)] hover:text-[var(--color-portal-cyan)] hover:border-[var(--color-portal-cyan)] transition-all">LINKEDIN</a>
                    </div>
                  </div>
                  <div>
                    <span className="font-label uppercase font-bold text-xs text-[var(--color-pencil-gray)] block mb-1">Location</span>
                    <span className="font-mono font-bold text-sm text-[var(--color-ink-black)]">Earth / India</span>
                  </div>
                </div>
              </ComicPanel>
            </div>

            {/* Portal Terminal Log */}
            <div className="contact-panel h-48">
              <ComicPanel theme="dark" rotation="-2deg" className="h-full p-4 bg-black border-4 border-[var(--color-portal-cyan)]">
                <div className="font-mono text-xs text-[var(--color-portal-cyan)] mb-2 border-b border-[var(--color-portal-cyan)]/30 pb-1 flex justify-between">
                  <span>MESSAGE_LOG</span>
                  <span aria-live="polite">{status === 'sending' ? 'Processing...' : status === 'success' ? 'Success' : 'Ready'}</span>
                </div>
                <div className="space-y-1 font-mono text-sm h-full overflow-hidden flex flex-col justify-end pb-4" aria-live="polite">
                  {logs.map((log, i) => (
                    <div key={i} className={i === logs.length - 1 ? "text-[var(--color-comic-yellow)]" : "text-[var(--color-portal-cyan)] opacity-60"}>
                      {">"} {log}
                    </div>
                  ))}
                  {(status === "sending" || status === "idle") && (
                    <div className="text-[var(--color-comic-yellow)] animate-pulse" aria-hidden="true">_</div>
                  )}
                </div>
              </ComicPanel>
            </div>

          </div>
          
        </div>
      </div>
    </ComicSpread>
  );
};

export default Contact;
