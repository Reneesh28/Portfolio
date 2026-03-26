import { useRef, useState, useEffect, memo } from "react";
import emailjs from "@emailjs/browser";
import {
   FiMapPin,
   FiLinkedin,
   FiGithub,
   FiSend,
   FiClock,
   FiArrowUpRight,
   FiTerminal,
   FiShield,
   FiCpu
} from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const UplinkTerminal = ({ status, progress, logs }) => {
   return (
      <div className="bg-[#050505] border border-white/10 p-6 md:p-8 font-mono text-xs mb-8 relative overflow-hidden h-48 flex flex-col justify-end shadow-inner">
         <div className="absolute top-0 left-0 w-full h-1 bg-white/5 overflow-hidden">
            <div
               className="h-full bg-[#00BFA5] transition-all duration-300 ease-out"
               style={{ width: `${progress}%` }}
            />
         </div>

         <div className="space-y-2 opacity-80">
            {logs.map((log, i) => (
               <div key={i} className={i === logs.length - 1 ? "text-[#00BFA5] animate-pulse" : "text-neutral-500"}>
                  <span className="mr-2 opacity-50">[{new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                  {log}
               </div>
            ))}
            {status === "sending" && logs.length < 3 && <div className="text-[#00BFA5]/60 animate-pulse">{">"} _</div>}
         </div>

         <div className="absolute top-4 right-6 text-[10px] text-neutral-800 uppercase tracking-widest pointer-events-none">
            Secure_COMMS_V4.2
         </div>
      </div>
   );
};

export default function Contact() {
   const formRef = useRef(null);
   const containerRef = useRef(null);
   const [status, setStatus] = useState("idle"); // idle, sending, success, error
   const [progress, setProgress] = useState(0);
   const [logs, setLogs] = useState(["SYSTEM_READY // AWAITING_PAYLOAD"]);
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
      setLogs(["INITIATING_HANDSHAKE..."]);

      // Phase 1: Compile
      await new Promise(r => setTimeout(r, 800));
      setProgress(33);
      setLogs(prev => [...prev, "COMPILING_PAYLOAD... OK"]);

      // Phase 2: Encrypt
      await new Promise(r => setTimeout(r, 1000));
      setProgress(66);
      setLogs(prev => [...prev, "ENCRYPTING_PACKET_RSA_4096... DONE"]);

      // Phase 3: Transmit
      setLogs(prev => [...prev, "TRANSMITTING_UPLINK..."]);

      try {
         await emailjs.sendForm(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            formRef.current,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
         );

         setProgress(100);
         setLogs(prev => [...prev, "HANDSHAKE_COMPLETE // DATA_STORED"]);
         setStatus("success");
         formRef.current.reset();
      } catch (err) {
         setLogs(prev => [...prev, "CRITICAL_ERROR // UPLINK_REJECTED"]);
         setStatus("error");
      }
   };

   return (
      <section
         id="contact"
         className="w-full bg-[#0A0A0A] text-white px-6 md:px-12 py-24 sm:py-32 overflow-hidden border-t border-white/5"
         ref={containerRef}
      >
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="contact-header mb-16 opacity-0">
               <p className="text-[#00BFA5] font-bold uppercase tracking-[0.3em] text-[10px] mb-4 opacity-70">
                  ESTABLISH_UPLINK
               </p>
               <h2 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight text-[#E0E0E0] mb-6">
                  Initiate Contact.
               </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
               {/* Left: Uplink Console Form */}
               <div className="contact-grid-item opacity-0">
                  <UplinkTerminal status={status} progress={progress} logs={logs} />

                  <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative group">
                           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 transition-colors group-focus-within:text-[#00BFA5]">
                              <FiTerminal size={14} />
                           </div>
                           <input
                              type="text"
                              name="from_name"
                              placeholder="IDENTIFIER"
                              required
                              className="w-full bg-[#0D0D0D] border border-white/5 pl-12 p-4 text-xs font-mono text-[#E0E0E0] placeholder-neutral-700 focus:border-[#00BFA5]/30 focus:outline-none transition-all"
                           />
                        </div>
                        <div className="relative group">
                           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 transition-colors group-focus-within:text-[#00BFA5]">
                              <FiShield size={14} />
                           </div>
                           <input
                              type="email"
                              name="from_email"
                              placeholder="CHANNEL_ADDR"
                              required
                              className="w-full bg-[#0D0D0D] border border-white/5 pl-12 p-4 text-xs font-mono text-[#E0E0E0] placeholder-neutral-700 focus:border-[#00BFA5]/30 focus:outline-none transition-all"
                           />
                        </div>
                     </div>

                     <div className="relative group">
                        <div className="absolute left-4 top-5 text-neutral-600 transition-colors group-focus-within:text-[#00BFA5]">
                           <FiCpu size={14} />
                        </div>
                        <textarea
                           name="message"
                           rows="5"
                           placeholder="TRANSMISSION_PAYLOAD..."
                           required
                           className="w-full bg-[#0D0D0D] border border-white/5 pl-12 p-4 text-xs font-mono text-[#E0E0E0] placeholder-neutral-700 focus:border-[#00BFA5]/30 focus:outline-none transition-all resize-none"
                        />
                     </div>

                     <button
                        type="submit"
                        disabled={status === "sending"}
                        className="
                  group relative w-full md:w-auto px-10 py-4 
                  bg-[#111111] border border-white/5
                  hover:border-[#00BFA5]/40 transition-all active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-3
                "
                     >
                        <span className="text-xs font-bold font-mono tracking-widest uppercase text-neutral-400 group-hover:text-white transition-colors">
                           {status === "sending" ? "TRANSMITTING..." : "EXECUTE_UPLINK"}
                        </span>
                        <FiSend className={`transition-transform duration-500 ${status === "sending" ? "translate-x-12 opacity-0" : "group-hover:translate-x-1"}`} />

                        {/* Visual Scanner effect on button hover */}
                        <div className="absolute inset-0 bg-white/5 w-0 group-hover:w-full transition-all duration-300 pointer-events-none opacity-20" />
                     </button>
                  </form>
               </div>

               {/* Right: Info Dashboard */}
               <div className="contact-grid-item opacity-0">
                  <div className="bg-[#0D0D0D] border border-white/5 p-8 md:p-12 h-full flex flex-col justify-between">
                     <div className="space-y-12">
                        <div>
                           <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#00BFA5] mb-6 opacity-60">System Operator</h4>
                           <p className="text-xl md:text-2xl font-bold text-white mb-2">reneesh3508925@gmail.com</p>
                           <p className="text-xs font-mono text-neutral-500">RENEESH_CORE // SYSTEM_ARCHITECT</p>
                        </div>


                        <div className="grid grid-cols-2 gap-8">
                           <div>
                              <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-4">Networks</h4>
                              <div className="flex flex-col gap-3 font-mono text-xs">
                                 <a href="https://github.com/Reneesh28" className="text-neutral-500 hover:text-[#00BFA5] transition-colors flex items-center gap-2">
                                    <FiGithub /> GITHUB
                                 </a>
                                 <a href="https://www.linkedin.com/in/balam-reneesh" className="text-neutral-500 hover:text-[#00BFA5] transition-colors flex items-center gap-2">
                                    <FiLinkedin /> LINKEDIN
                                 </a>
                                 <a href="#" className="text-neutral-500 hover:text-[#00BFA5] transition-colors flex items-center gap-2 text-[10px] opacity-40 italic cursor-not-allowed">
                                    <FaXTwitter /> X_ARCHIVED
                                 </a>
                              </div>
                           </div>
                           <div className="text-right">
                              <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-4">Coordinates</h4>
                              <p className="text-xs font-mono text-neutral-400 flex items-center justify-end gap-2">
                                 PHAGWARA, IN <FiMapPin className="text-[#00BFA5]" />
                              </p>
                           </div>
                        </div>
                     </div>

                     <div className="mt-20 pt-8 border-t border-white/5 flex items-end justify-between">
                        <div className="space-y-1 font-mono">
                           <p className="text-[9px] text-neutral-600 uppercase tracking-widest">Protocol Stored</p>
                           <p className="text-xs text-neutral-400">DATA_CLEARANCE_PASSED</p>
                        </div>
                        <div className="text-right font-mono">
                           <div className="text-2xl font-medium text-[#E0E0E0] tabular-nums">
                              {time}
                           </div>
                           <p className="text-[9px] text-neutral-600 uppercase tracking-widest mt-1">NODE_LOCAL_TIME</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
