import { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { FiSend, FiGithub, FiLinkedin, FiMail, FiMapPin } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const formRef = useRef(null);
  const containerRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle, sending, success, error

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".contact-element",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const sendEmail = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setStatus("success");
      formRef.current.reset();
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative w-full bg-[#050505] py-40 px-6 md:px-12 overflow-hidden"
    >
      {/* Background Seal Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
        <span className="font-shippori text-[40rem] text-white select-none">信</span>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row gap-24 items-start">

          {/* Left: Philosophy & Info */}
          <div className="flex-1 flex flex-col gap-12">
            <div className="contact-element flex flex-col gap-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-px bg-[#D4AF37]/40" />
                <span className="font-mono text-[10px] text-[#D4AF37] tracking-[0.8em] uppercase">Act_V</span>
              </div>
              <h2 className="font-shippori text-5xl md:text-8xl text-white tracking-widest uppercase">
                Zen <span className="text-[#D4AF37]/40">Signature</span>
              </h2>
              <p className="font-shippori text-[#888] text-lg leading-relaxed italic border-l border-[#D4AF37]/20 pl-8 mt-6">
                "The path ends where it begins. If you seek to forge a new alliance, dispatch your message through the digital smoke."
              </p>
            </div>

            <div className="contact-element flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] tracking-[0.5em] text-[#444] uppercase">Coordinates</span>
                <div className="flex items-center gap-3 text-white/60 font-shippori tracking-widest">
                  <FiMapPin className="text-[#D4AF37]/40" /> Phagwara, Punjab, India
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] tracking-[0.5em] text-[#444] uppercase">Alliances</span>
                <div className="flex items-center gap-8 pt-2">
                  <a href="https://github.com/Reneesh28" target="_blank" rel="noreferrer" className="text-[#333] hover:text-[#D4AF37] transition-all">
                    <FiGithub size={24} />
                  </a>
                  <a href="https://www.linkedin.com/in/balam-reneesh" target="_blank" rel="noreferrer" className="text-[#333] hover:text-[#D4AF37] transition-all">
                    <FiLinkedin size={24} />
                  </a>
                  <a href="mailto:reneesh3508925@gmail.com" className="text-[#333] hover:text-[#D4AF37] transition-all">
                    <FiMail size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: The Ink Form */}
          <div className="flex-1 w-full">
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 border border-[#D4AF37]/20 bg-[#D4AF37]/5"
              >
                <div className="w-16 h-16 border-2 border-[#D4AF37] rotate-45 flex items-center justify-center mb-8">
                  <FiSend className="text-[#D4AF37] rotate-[-45deg]" size={24} />
                </div>
                <h3 className="font-shippori text-3xl text-white tracking-widest uppercase mb-4">Messenger Dispatched</h3>
                <p className="font-shippori text-[#888] italic">"Your signal has been captured. Patience is the warrior's greatest virtue."</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-12 font-mono text-[10px] tracking-[0.5em] text-[#D4AF37] uppercase hover:text-white transition-colors"
                >
                  [ Send_Another_Flare ]
                </button>
              </motion.div>
            ) : (
              <form ref={formRef} onSubmit={sendEmail} className="contact-element flex flex-col gap-12">
                <div className="group relative">
                  <span className="absolute -top-6 left-0 font-mono text-[9px] tracking-[0.4em] text-[#444] uppercase group-focus-within:text-[#D4AF37]/60 transition-colors">Callsign</span>
                  <input
                    type="text"
                    name="from_name"
                    required
                    className="w-full bg-transparent border-b border-white/5 p-4 text-white font-shippori tracking-widest focus:outline-none focus:border-[#D4AF37]/40 transition-all"
                  />
                </div>

                <div className="group relative">
                  <span className="absolute -top-6 left-0 font-mono text-[9px] tracking-[0.4em] text-[#444] uppercase group-focus-within:text-[#D4AF37]/60 transition-colors">Signal_Address</span>
                  <input
                    type="email"
                    name="from_email"
                    required
                    className="w-full bg-transparent border-b border-white/5 p-4 text-white font-shippori tracking-widest focus:outline-none focus:border-[#D4AF37]/40 transition-all"
                  />
                </div>

                <div className="group relative">
                  <span className="absolute -top-6 left-0 font-mono text-[9px] tracking-[0.4em] text-[#444] uppercase group-focus-within:text-[#D4AF37]/60 transition-colors">The_Message</span>
                  <textarea
                    name="message"
                    rows="4"
                    required
                    className="w-full bg-transparent border-b border-white/5 p-4 text-white font-shippori tracking-widest focus:outline-none focus:border-[#D4AF37]/40 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="relative group self-start flex items-center gap-6 pt-4"
                >
                  <div className="w-12 h-[1px] bg-[#D4AF37] group-hover:w-20 transition-all duration-700" />
                  <span className="font-mono text-[10px] tracking-[0.6em] text-[#D4AF37] uppercase font-bold group-hover:text-white transition-colors">
                    {status === "sending" ? "DISPATCHING..." : "DISPATCH_MESSENGER"}
                  </span>
                  {status === "error" && <span className="text-red-900 font-mono text-[8px] tracking-widest uppercase">Signal_Failed</span>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Signature Footer */}
      <div className="mt-64 flex flex-col items-center gap-6 opacity-20">
        <div className="w-px h-32 bg-gradient-to-b from-[#D4AF37] to-transparent" />
        <p className="font-shippori text-xs tracking-[1em] text-white uppercase italic">Forged by Balam Reneesh</p>
      </div>

      {/* HUD Label */}
      <div className="absolute bottom-12 right-12 flex flex-col items-end gap-1 opacity-20">
        <p className="font-mono text-[10px] tracking-[0.5em] text-white">ACT_V: THE_ZEN_SIGNATURE</p>
        <p className="font-mono text-[10px] tracking-[0.5em] text-[#D4AF37]">LOCATION: FINAL_STATION</p>
      </div>
    </section>
  );
}
