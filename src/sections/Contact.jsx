import React, { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import profileData from "../data/profile";

gsap.registerPlugin(ScrollTrigger);

const fieldClass = "w-full bg-bg border border-border rounded-md p-4 text-sm text-text placeholder-text-muted focus:outline-none focus:border-text-muted transition-colors";
const labelClass = "font-medium uppercase text-text-muted text-xs tracking-wider";

const statusMessages = {
  idle: "",
  sending: "Sending your message...",
  success: "Message sent. Thank you!",
  error: "Delivery failed. Please try again.",
};

const Contact = () => {
  const formRef = useRef(null);
  const sectionRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle, sending, success, error

  useEffect(() => {
    const mm = gsap.matchMedia(sectionRef);

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)",
      reduceMotion: "(prefers-reduced-motion: reduce)"
    }, (context) => {
      let { isDesktop, reduceMotion } = context.conditions;

      if (reduceMotion) {
        gsap.set('.contact-panel', { opacity: 1 });
        return;
      }

      gsap.from(".contact-panel", {
        y: isDesktop ? 100 : 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
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

      // Reset back to idle after a while
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section ref={sectionRef} id="contact" className="relative w-full min-h-screen flex flex-col py-24 pb-32 px-4 md:px-12 lg:px-24 bg-bg text-text z-30">
      <div className="relative w-full max-w-7xl mx-auto">

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-text">
            Get in Touch
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Contact Form */}
          <div className="contact-panel lg:col-span-7 h-full">
            <div className="h-full p-6 md:p-10 rounded-lg border border-border bg-surface">
              <h3 className="text-2xl font-semibold mb-8">Send a Message</h3>

              <form ref={formRef} onSubmit={sendEmail} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="contact-name" className={labelClass}>Your Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      name="from_name"
                      required
                      autoComplete="name"
                      className={fieldClass}
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-email" className={labelClass}>Email Address</label>
                    <input
                      id="contact-email"
                      type="email"
                      name="from_email"
                      required
                      autoComplete="email"
                      className={fieldClass}
                      placeholder="jane@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-type" className={labelClass}>Inquiry Type</label>
                  <div className="relative">
                    {/* name stays "mission_type" — it is the field key the EmailJS template expects */}
                    <select
                      id="contact-type"
                      name="mission_type"
                      required
                      defaultValue=""
                      className={`${fieldClass} appearance-none cursor-pointer`}
                    >
                      <option value="" disabled>Select an inquiry type...</option>
                      <option value="Job Opportunity">Job Opportunity</option>
                      <option value="Freelance/Contract">Freelance/Contract</option>
                      <option value="Networking">Networking</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-text-muted" aria-hidden="true">
                      &#9660;
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-message" className={labelClass}>Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows="4"
                    required
                    className={`${fieldClass} resize-none`}
                    placeholder="How can I help you?"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full px-6 py-3 rounded-md bg-accent text-accent-contrast font-medium text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? "Sending..." : status === "success" ? "Message Sent!" : "Send Message"}
                  </button>

                  <p
                    className={`mt-4 text-sm min-h-[1.25rem] ${status === "error" ? "text-error" : status === "success" ? "text-success" : "text-text-muted"}`}
                    aria-live="polite"
                  >
                    {statusMessages[status]}
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Contact Details */}
          <div className="contact-panel lg:col-span-5 h-full">
            <div className="h-full p-6 md:p-8 rounded-lg border border-border bg-surface">
              <div className="border-b border-border pb-4 mb-6">
                <h3 className="text-2xl font-semibold">Contact Details</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <span className={`${labelClass} block mb-1`}>Name</span>
                  <span className="text-xl font-semibold">{profileData.name}</span>
                </div>
                <div>
                  <span className={`${labelClass} block mb-1`}>Email</span>
                  <a href="mailto:reneesh3508925@gmail.com" className="font-medium underline underline-offset-4 hover:text-text-muted transition-colors">reneesh3508925@gmail.com</a>
                </div>
                <div>
                  <span className={`${labelClass} block mb-1`}>Networks</span>
                  <div className="flex gap-4">
                    <a href="https://github.com/Reneesh28" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4 hover:text-text-muted transition-colors">GitHub</a>
                    <a href="https://www.linkedin.com/in/balam-reneesh" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4 hover:text-text-muted transition-colors">LinkedIn</a>
                  </div>
                </div>
                <div>
                  <span className={`${labelClass} block mb-1`}>Location</span>
                  <span className="font-medium">India</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
