import { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import {
   FiMapPin,
   FiLinkedin,
   FiGithub,
   FiSend,
   FiArrowUpRight
} from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const InkConsole = ({ status, progress, logs }) => {
   return (
      <div
         className="border p-6 md:p-8 font-body text-xs mb-8 relative overflow-hidden h-48 flex flex-col justify-end rounded-md"
         style={{
            backgroundColor: "var(--bg-void)",
            borderColor: "var(--border-subtle)"
         }}
      >
         {/* Progress bar */}
         <div className="absolute top-0 left-0 w-full h-1 overflow-hidden" style={{ backgroundColor: "var(--border-subtle)" }}>
            <div
               className="h-full transition-all duration-300 ease-out"
               style={{ width: `${progress}%`, backgroundColor: "var(--accent)" }}
            />
         </div>

         <div className="space-y-2 opacity-80">
            {logs.map((log, i) => (
               <div
                  key={i}
                  className={i === logs.length - 1 ? "animate-pulse" : ""}
                  style={{ color: i === logs.length - 1 ? "var(--accent)" : "var(--text-ink)" }}
               >
                  <span className="mr-2 opacity-50">[{new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                  {log}
               </div>
            ))}
            {status === "sending" && logs.length < 3 && <div className="animate-pulse" style={{ color: "var(--accent)" }}>{">"} _</div>}
         </div>
      </div>
   );
};

export default function Contact() {
   const formRef = useRef(null);
   const containerRef = useRef(null);
   const [status, setStatus] = useState("idle");
   const [progress, setProgress] = useState(0);
   const [logs, setLogs] = useState(["The brush awaits your message."]);
   const [time, setTime] = useState("");

   useEffect(() => {
      const updateTime = () => {
         const now = new Date();
         setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
      };
      updateTime();
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
   }, []);

   useEffect(() => {
      const ctx = gsap.context(() => {
         gsap.fromTo(".contact-header",
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: containerRef.current, start: "top 80%" } }
         );

         gsap.fromTo(".contact-grid-item",
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out", scrollTrigger: { trigger: containerRef.current, start: "top 70%" } }
         );
      }, containerRef);
      return () => ctx.revert();
   }, []);

   const sendEmail = async (e) => {
      e.preventDefault();
      if (status === "sending") return;

      setStatus("sending");
      setProgress(0);
      setLogs(["Preparing the scroll..."]);

      await new Promise(r => setTimeout(r, 800));
      setProgress(33);
      setLogs(prev => [...prev, "Sealing with wax... done."]);

      await new Promise(r => setTimeout(r, 1000));
      setProgress(66);
      setLogs(prev => [...prev, "The messenger departs..."]);

      try {
         await emailjs.sendForm(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            formRef.current,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
         );

         setProgress(100);
         setLogs(prev => [...prev, "Your message has reached the dojo."]);
         setStatus("success");
         formRef.current.reset();
      } catch (err) {
         setLogs(prev => [...prev, "The path was blocked. Please try again."]);
         setStatus("error");
      }
   };

   return (
    <section
      id="contact"
      className="w-full px-6 md:px-12 py-32 overflow-hidden border-t washi-texture"
      style={{
        backgroundColor: "var(--bg-void)",
        borderColor: "var(--border-subtle)"
      }}
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="contact-header mb-24 flex flex-col items-center gap-4 text-center opacity-0">
          <div className="flex items-center gap-4">
             <div className="w-12 h-[1px] bg-[var(--accent)]" />
             <p className="font-accent font-semibold uppercase tracking-[0.4em] text-xs text-[var(--accent)]">
               The Summoning
             </p>
             <div className="w-12 h-[1px] bg-[var(--accent)]" />
          </div>
          <h2 className="font-display text-4xl md:text-7xl font-bold text-[var(--text-main)] leading-tight">
            Summon the <span className="italic text-[var(--text-muted)]">Craftsman</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Left: Tactical Info */}
          <div className="lg:col-span-4 contact-grid-item opacity-0 space-y-12">
            <div className="bg-[var(--bg-panel)] p-10 border border-[var(--border-subtle)] rounded-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-12 h-12 bg-[var(--accent)]/5 flex items-center justify-center font-display text-xl text-[var(--accent)] opacity-40">
                 召
               </div>
               <h4 className="font-accent text-[10px] tracking-[0.4em] uppercase text-[var(--accent)] mb-8">Communications</h4>
               <div className="space-y-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-ink)] mb-2">Primary Link</p>
                    <a href="mailto:reneesh3508925@gmail.com" className="text-xl font-display font-bold text-[var(--text-main)] hover:text-[var(--accent)] transition-colors">
                      reneesh3508925@gmail.com
                    </a>
                  </div>
                  <div className="flex gap-6">
                    <a href="https://github.com/Reneesh28" className="text-[var(--text-ink)] hover:text-[var(--accent)] transition-colors">
                      <FiGithub size={20} />
                    </a>
                    <a href="https://www.linkedin.com/in/balam-reneesh" className="text-[var(--text-ink)] hover:text-[var(--accent)] transition-colors">
                      <FiLinkedin size={20} />
                    </a>
                  </div>
               </div>
            </div>

            <div className="bg-[var(--bg-panel)] p-10 border border-[var(--border-subtle)] rounded-sm">
               <h4 className="font-accent text-[10px] tracking-[0.4em] uppercase text-[var(--text-ink)] mb-6">Current Location</h4>
               <p className="text-sm text-[var(--text-muted)] flex items-center gap-3">
                 <FiMapPin className="text-[var(--accent)]" /> Phagwara, IN
               </p>
               <div className="mt-8 pt-8 border-t border-[var(--border-subtle)] flex justify-between items-end">
                  <div className="font-body">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-ink)]">Local Time</p>
                    <p className="text-2xl font-bold text-[var(--text-main)] tabular-nums">{time}</p>
                  </div>
                  <div className="w-8 h-8 border border-[var(--border-subtle)] flex items-center justify-center">
                     <div className="w-1.5 h-1.5 bg-[var(--accent)] animate-ping" />
                  </div>
               </div>
            </div>
          </div>

          {/* Right: The Console & Form */}
          <div className="lg:col-span-8 contact-grid-item opacity-0">
            <InkConsole status={status} progress={progress} logs={logs} />

            <form ref={formRef} onSubmit={sendEmail} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="font-accent text-[9px] uppercase tracking-[0.3em] text-[var(--text-ink)] ml-1">Identity</label>
                  <input
                    type="text"
                    name="from_name"
                    placeholder="Your Name"
                    required
                    className="w-full bg-[var(--bg-panel)] border border-[var(--border-subtle)] p-5 text-sm font-body text-[var(--text-main)] focus:outline-none focus:border-[var(--accent)] transition-all rounded-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-accent text-[9px] uppercase tracking-[0.3em] text-[var(--text-ink)] ml-1">Frequency</label>
                  <input
                    type="email"
                    name="from_email"
                    placeholder="Your Email"
                    required
                    className="w-full bg-[var(--bg-panel)] border border-[var(--border-subtle)] p-5 text-sm font-body text-[var(--text-main)] focus:outline-none focus:border-[var(--accent)] transition-all rounded-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-accent text-[9px] uppercase tracking-[0.3em] text-[var(--text-ink)] ml-1">Message</label>
                <textarea
                  name="message"
                  rows="6"
                  placeholder="Inscribe your message..."
                  required
                  className="w-full bg-[var(--bg-panel)] border border-[var(--border-subtle)] p-5 text-sm font-body text-[var(--text-main)] focus:outline-none focus:border-[var(--accent)] transition-all rounded-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="group relative w-full md:w-auto px-16 py-5 bg-[var(--bg-panel)] border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-all rounded-sm overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-4">
                  <span className="font-accent text-xs font-bold tracking-[0.4em] uppercase text-[var(--text-main)]">
                    {status === "sending" ? "Processing..." : "Summon"}
                  </span>
                  <FiSend className={`text-[var(--accent)] transition-transform duration-500 ${status === "sending" ? "translate-x-20 opacity-0" : "group-hover:translate-x-1"}`} />
                </div>
                
                {/* Stamp Effect on Hover */}
                <div className="absolute inset-0 bg-[var(--accent)]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
