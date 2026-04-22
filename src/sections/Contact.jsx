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
         className="w-full px-6 md:px-12 py-24 sm:py-32 overflow-hidden border-t"
         style={{
            backgroundColor: "var(--bg-void)",
            color: "var(--text-main)",
            borderColor: "var(--border-subtle)"
         }}
         ref={containerRef}
      >
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="contact-header mb-16 opacity-0">
               <p
                  className="font-accent font-bold uppercase tracking-[0.3em] text-[10px] mb-4 opacity-70"
                  style={{ color: "var(--accent)" }}
               >
                  SEND WORD
               </p>
               <h2
                  className="text-3xl sm:text-4xl lg:text-6xl font-display font-extrabold tracking-tight mb-6"
                  style={{ color: "var(--text-main)" }}
               >
                  Summon the Craftsman.
               </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
               {/* Left: Form */}
               <div className="contact-grid-item opacity-0">
                  <InkConsole status={status} progress={progress} logs={logs} />

                  <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative group">
                           <input
                              type="text"
                              name="from_name"
                              placeholder="Your Name"
                              required
                              className="w-full border p-4 text-xs font-body placeholder-opacity-40 focus:outline-none transition-all rounded-md"
                              style={{
                                 backgroundColor: "var(--bg-panel)",
                                 borderColor: "var(--border-subtle)",
                                 color: "var(--text-main)"
                              }}
                              onFocus={(e) => e.currentTarget.style.borderColor = "var(--border-hover)"}
                              onBlur={(e) => e.currentTarget.style.borderColor = "var(--border-subtle)"}
                           />
                        </div>
                        <div className="relative group">
                           <input
                              type="email"
                              name="from_email"
                              placeholder="Your Email"
                              required
                              className="w-full border p-4 text-xs font-body placeholder-opacity-40 focus:outline-none transition-all rounded-md"
                              style={{
                                 backgroundColor: "var(--bg-panel)",
                                 borderColor: "var(--border-subtle)",
                                 color: "var(--text-main)"
                              }}
                              onFocus={(e) => e.currentTarget.style.borderColor = "var(--border-hover)"}
                              onBlur={(e) => e.currentTarget.style.borderColor = "var(--border-subtle)"}
                           />
                        </div>
                     </div>

                     <div className="relative group">
                        <textarea
                           name="message"
                           rows="5"
                           placeholder="Your Message..."
                           required
                           className="w-full border p-4 text-xs font-body placeholder-opacity-40 focus:outline-none transition-all resize-none rounded-md"
                           style={{
                              backgroundColor: "var(--bg-panel)",
                              borderColor: "var(--border-subtle)",
                              color: "var(--text-main)"
                           }}
                           onFocus={(e) => e.currentTarget.style.borderColor = "var(--border-hover)"}
                           onBlur={(e) => e.currentTarget.style.borderColor = "var(--border-subtle)"}
                        />
                     </div>

                     <button
                        type="submit"
                        disabled={status === "sending"}
                        className="
                  group relative w-full md:w-auto px-10 py-4 
                  border
                  transition-all active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-3
                  rounded-md
                "
                        style={{
                           backgroundColor: "var(--bg-panel)",
                           borderColor: "var(--border-subtle)"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--border-hover)"}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-subtle)"}
                     >
                        <span
                           className="text-xs font-accent font-bold tracking-widest uppercase transition-colors"
                           style={{ color: "var(--text-muted)" }}
                        >
                           {status === "sending" ? "Sending..." : "Send Message"}
                        </span>
                        <FiSend
                           className={`transition-transform duration-500 ${status === "sending" ? "translate-x-12 opacity-0" : "group-hover:translate-x-1"}`}
                           style={{ color: "var(--accent)" }}
                        />
                     </button>
                  </form>
               </div>

               {/* Right: Info */}
               <div className="contact-grid-item opacity-0">
                  <div
                     className="border p-8 md:p-12 h-full flex flex-col justify-between rounded-md"
                     style={{ backgroundColor: "var(--bg-panel)", borderColor: "var(--border-subtle)" }}
                  >
                     <div className="space-y-12">
                        <div>
                           <h4
                              className="text-[10px] font-accent font-bold uppercase tracking-widest mb-6 opacity-60"
                              style={{ color: "var(--accent)" }}
                           >
                              The Craftsman
                           </h4>
                           <p className="text-xl md:text-2xl font-display font-bold mb-2" style={{ color: "var(--text-main)" }}>reneesh3508925@gmail.com</p>
                           <p className="text-xs font-body" style={{ color: "var(--text-ink)" }}>Reneesh · Master Craftsman</p>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                           <div>
                              <h4 className="text-[10px] font-accent font-bold uppercase tracking-widest mb-4" style={{ color: "var(--text-ink)" }}>Paths</h4>
                              <div className="flex flex-col gap-3 font-body text-xs">
                                 <a href="https://github.com/Reneesh28" className="flex items-center gap-2 transition-colors" style={{ color: "var(--text-muted)" }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
                                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                                 >
                                    <FiGithub /> GitHub
                                 </a>
                                 <a href="https://www.linkedin.com/in/balam-reneesh" className="flex items-center gap-2 transition-colors" style={{ color: "var(--text-muted)" }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
                                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                                 >
                                    <FiLinkedin /> LinkedIn
                                 </a>
                                 <span className="flex items-center gap-2 text-[10px] opacity-40 italic cursor-not-allowed" style={{ color: "var(--text-ink)" }}>
                                    <FaXTwitter /> X (Coming soon)
                                 </span>
                              </div>
                           </div>
                           <div className="text-right">
                              <h4 className="text-[10px] font-accent font-bold uppercase tracking-widest mb-4" style={{ color: "var(--text-ink)" }}>Location</h4>
                              <p className="text-xs font-body flex items-center justify-end gap-2" style={{ color: "var(--text-muted)" }}>
                                 Phagwara, IN <FiMapPin style={{ color: "var(--accent)" }} />
                              </p>
                           </div>
                        </div>
                     </div>

                     <div className="mt-20 pt-8 border-t flex items-end justify-between" style={{ borderColor: "var(--border-subtle)" }}>
                        <div className="space-y-1 font-body">
                           <p className="text-[9px] uppercase tracking-widest" style={{ color: "var(--text-ink)" }}>Message Status</p>
                           <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                              {status === "success" ? "Delivered" : status === "error" ? "Failed" : "Ready"}
                           </p>
                        </div>
                        <div className="text-right font-body">
                           <div className="text-2xl font-medium tabular-nums" style={{ color: "var(--text-main)" }}>
                              {time}
                           </div>
                           <p className="text-[9px] uppercase tracking-widest mt-1" style={{ color: "var(--text-ink)" }}>Local Time</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
