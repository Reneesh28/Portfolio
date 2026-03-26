import { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import {
  FiMapPin,
  FiLinkedin,
  FiGithub,
  FiSend,
  FiClock,
  FiArrowUpRight,
} from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6"; // Using Fa6 for X icon
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "../components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const formRef = useRef(null);
  const containerRef = useRef(null);
  const [status, setStatus] = useState("");
  const [time, setTime] = useState("");

  // Live Clock Logic
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Staggered Reveal for Section
      const animParams = {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
      };

      gsap.fromTo(".contact-header", animParams, {
        ...animParams,
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%"
        }
      });

      gsap.fromTo(".contact-form", { ...animParams, x: -30 }, {
        ...animParams,
        opacity: 1,
        y: 0,
        x: 0,
        delay: 0.2,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%"
        }
      });

      gsap.fromTo(".contact-info", { ...animParams, x: 30 }, {
        ...animParams,
        opacity: 1,
        y: 0,
        x: 0,
        delay: 0.4,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%"
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("sending");

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setStatus("success");
          formRef.current.reset();
        },
        () => {
          setStatus("error");
        }
      );
  };

  return (
    <section
      id="contact"
      className="w-full bg-transparent text-white px-6 md:px-12 py-24 overflow-hidden"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto relative z-10">

        {/* Top Centered Header (Optional Context) */}
        <div className="contact-header text-center mb-20 opacity-0">
          <p className="text-neutral-400 uppercase tracking-[0.3em] text-xs mb-4">
            Connect
          </p>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            Let's talk.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left: Editorial Form */}
          <div className="contact-form opacity-0">
            <h3 className="text-3xl font-semibold mb-8 leading-tight">
              Have an awesome idea? <br />
              <span className="text-neutral-500">Let's bring it to life.</span>
            </h3>

            <form ref={formRef} onSubmit={sendEmail} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative group">
                  <input
                    type="text"
                    name="from_name"
                    placeholder="Your Name"
                    required
                    className="w-full bg-[#1A1A1A] border border-white/5 p-4 text-[#E0E0E0] placeholder-[#A3A3A3] focus:border-[#00BFA5] focus:outline-none transition-colors"
                  />
                </div>
                <div className="relative group">
                  <input
                    type="email"
                    name="from_email"
                    placeholder="Your Email"
                    required
                    className="w-full bg-[#1A1A1A] border border-white/5 p-4 text-[#E0E0E0] placeholder-[#A3A3A3] focus:border-[#00BFA5] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="relative group">
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Your Message..."
                  required
                  className="w-full bg-[#1A1A1A] border border-white/5 p-4 text-[#E0E0E0] placeholder-[#A3A3A3] focus:border-[#00BFA5] focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={status === "sending"}
                  variant="primary"
                  size="lg"
                  className="gap-2 border-transparent disabled:opacity-60 disabled:cursor-not-allowed w-full md:w-auto"
                >
                  {status === "sending" ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message <FiSend />
                    </>
                  )}
                </Button>
              </div>

              {status === "success" && (
                <p className="text-emerald-400 text-sm flex items-center gap-2">
                  Message sent successfully!
                </p>
              )}

              {status === "error" && (
                <p className="text-red-400 text-sm">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </div>

          {/* Right: Glass Info Card */}
          <div className="contact-info opacity-0">
            <div className="
                relative
                bg-[#1A1A1A]
                border border-white/5
                p-10
                h-full
                flex flex-col justify-between
             ">
              {/* Removed Blur Glow Orb */}

              <div className="space-y-12">
                {/* Contact Details */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-6">Contact Details</h4>
                  <a href="mailto:nikunjmathur0810@gmail.com" className="block text-xl text-neutral-200 hover:text-white transition-colors mb-2">
                    reneesh3508925@gmail.com
                  </a>
                  <a href="#" className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white transition-colors border-b border-transparent hover:border-white">
                    View Resume <FiArrowUpRight />
                  </a>
                </div>

                {/* Socials */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#A3A3A3] mb-6">Digital Spaces</h4>
                  <div className="flex flex-col gap-4">
                    <a href="https://github.com/Reneesh28" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#A3A3A3] hover:text-[#E0E0E0] transition-colors group">
                      <span className="p-2 bg-[#0A0A0A] border border-white/5 group-hover:bg-[#E0E0E0] group-hover:text-[#0A0A0A] transition-colors"><FiGithub size={18} /></span>
                      Github
                    </a>
                    <a href="https://www.linkedin.com/in/balam-reneesh" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#A3A3A3] hover:text-[#E0E0E0] transition-colors group">
                      <span className="p-2 bg-[#0A0A0A] border border-white/5 group-hover:bg-[#E0E0E0] group-hover:text-[#0A0A0A] transition-colors"><FiLinkedin size={18} /></span>
                      LinkedIn
                    </a>
                    <a href="#" className="flex items-center gap-3 text-[#A3A3A3] hover:text-[#E0E0E0] transition-colors group">
                      <span className="p-2 bg-[#0A0A0A] border border-white/5 group-hover:bg-[#E0E0E0] group-hover:text-[#0A0A0A] transition-colors"><FaXTwitter size={18} /></span>
                      X (Twitter)
                    </a>
                  </div>
                </div>
              </div>

              {/* Footer: Location & Time */}
              <div className="mt-16 pt-8 border-t border-white/5 flex items-end justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Location</h4>
                  <p className="text-neutral-300 flex items-center gap-2">
                    <FiMapPin /> Phagwara, Punjab, India
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono font-medium text-white flex items-center gap-2 justify-end">
                    <FiClock size={18} className="animate-pulse text-emerald-500" /> {time}
                  </div>
                  <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">Local Time</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
