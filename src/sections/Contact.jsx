import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiLinkedin,
  FiGithub,
  FiSend
} from "react-icons/fi";

export default function Contact() {
  const formRef = useRef();
  const [status, setStatus] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("sending");

    emailjs
      .sendForm(
        "service_nedi3au",      // ← replace
        "template_cg07pwq",     // ← replace
        formRef.current,
        "wXRa7cwL1jh38IbsK"       // ← replace
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
      className="scroll-mt-16 w-full bg-black text-white px-6 sm:px-12 lg:px-24 py-28"
    >
      <div className="max-w-7xl mx-auto">

        <p className="text-neutral-400 uppercase tracking-[0.3em] text-xs mb-4">
          Contact
        </p>

        <h2 className="text-3xl sm:text-4xl font-semibold mb-16">
          Get In Touch
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Form */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8">
            <h3 className="text-lg font-medium mb-6">Send a Message</h3>

            <form ref={formRef} onSubmit={sendEmail} className="space-y-5">
              <input
                type="text"
                name="from_name"
                placeholder="Your name"
                required
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none"
              />

              <input
                type="email"
                name="from_email"
                placeholder="your.email@example.com"
                required
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none"
              />

              <input
                type="text"
                name="phone"
                placeholder="+91 XXXXX XXXXX"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none"
              />

              <textarea
                name="message"
                rows="4"
                placeholder="Your message..."
                required
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none"
              />

              <button
                type="submit"
                disabled={status === "sending"}
                className="
                  inline-flex items-center gap-2
                  px-6 py-2 rounded-lg
                  bg-neutral-800 text-sm text-white
                  hover:bg-neutral-700 transition
                "
              >
                <FiSend />
                {status === "sending" ? "Sending..." : "Send Message"}
              </button>

              {status === "success" && (
                <p className="text-green-400 text-sm">
                  Message sent successfully!
                </p>
              )}

              {status === "error" && (
                <p className="text-red-400 text-sm">
                  Something went wrong. Try again.
                </p>
              )}
            </form>
          </div>

          {/* Info */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8 space-y-6 text-sm">
            <div className="flex gap-4">
              <FiPhone /> <span>+91-7569679113</span>
            </div>
            <div className="flex gap-4">
              <FiMapPin /> <span>Phagwara, Punjab, India</span>
            </div>
            <div className="flex gap-4">
              <FiMail /> <span>reneesh3508925@gmail.com</span>
            </div>
            <div className="flex gap-4">
              <FiLinkedin />
              <a
                href="https://www.linkedin.com/in/balam-reneesh"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                linkedin.com/in/balam-reneesh
              </a>
            </div>
            <div className="flex gap-4">
              <FiGithub />
              <a
                href="https://github.com/Reneesh28"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                github.com/Reneesh28
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
