import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Send, MapPin, Mail, ChevronRight } from "lucide-react";

const WhistlingArrow = ({ loading, success }) => {
  return (
    <div className="relative w-full h-14 flex items-center overflow-hidden bg-[#111111] border border-white/10 group cursor-pointer">
      {/* The Arrow Body */}
      <motion.div 
        className="absolute inset-0 flex items-center px-6"
        animate={success ? { x: "200%", opacity: 0 } : { x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-4 w-full">
          {/* Arrowhead */}
          <div className="w-4 h-4 border-t-2 border-r-2 border-[#C5A059] rotate-45 flex-shrink-0" />
          
          {/* Shaft & Text */}
          <div className="flex-1 flex items-center gap-4">
             <div className="h-px flex-1 bg-[#C5A059]/40 group-hover:bg-[#C5A059] transition-colors" />
             <span className="font-serif text-[10px] uppercase tracking-[0.5em] text-[#F5F5F5] whitespace-nowrap">
                {loading ? "Preparing Messenger..." : success ? "Messenger Dispatched" : "Despatch Whistling Arrow"}
             </span>
             <div className="h-px w-12 bg-[#C5A059]/40 group-hover:bg-[#C5A059] transition-colors" />
          </div>

          {/* Fletching (Feathers) */}
          <div className="flex gap-1">
             <div className="w-1 h-4 bg-[#8B0000] -skew-x-[20deg]" />
             <div className="w-1 h-4 bg-[#8B0000] -skew-x-[20deg]" />
          </div>
        </div>
      </motion.div>

      {/* Whistling Visual Effect (Hover) */}
      <motion.div 
        className="absolute left-6 pointer-events-none"
        animate={!success && !loading ? { scale: [1, 1.5, 1], opacity: [0, 0.5, 0] } : { opacity: 0 }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-8 h-8 border border-[#C5A059] rounded-full" />
      </motion.div>
    </div>
  );
};

export default function Contact() {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulated Dispatch
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      formRef.current.reset();
    }, 1500);
  };

  return (
    <section
      id="contact"
      className="w-full bg-[#0D0D0D] text-[#F5F5F5] px-6 md:px-12 py-24 sm:py-32 border-t border-white/5 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
        
        {/* LEFT: INFO */}
        <div className="lg:w-1/3 space-y-16">
          <div>
            <p className="text-[#8B0000] uppercase tracking-[0.6em] text-xs mb-4 font-bold">
              Establish Path
            </p>
            <h2 className="text-5xl md:text-8xl font-serif font-bold text-[#F5F5F5]">
              Contact
            </h2>
          </div>

          <div className="space-y-10">
            <div className="group cursor-pointer">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059] mb-2 group-hover:text-[#F5F5F5] transition-colors">Coordinates</p>
              <div className="flex items-center gap-4">
                <MapPin size={18} className="text-[#8B0000]" />
                <p className="text-xl font-serif">Phagwara, Punjab, India</p>
              </div>
            </div>

            <div className="group cursor-pointer">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059] mb-2 group-hover:text-[#F5F5F5] transition-colors">Scroll Address</p>
              <div className="flex items-center gap-4">
                <Mail size={18} className="text-[#8B0000]" />
                <p className="text-xl font-serif">reneesh3508925@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: THE FORM (WAR PAPER) */}
        <div className="lg:w-2/3 bg-[#111111] border border-white/5 p-8 md:p-16 relative">
          {/* Decorative Corner Seal */}
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#8B0000] flex items-center justify-center text-[10px] font-serif text-[#F5F5F5] shadow-2xl z-10">
            信
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-2 group">
                <label className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059] group-focus-within:text-[#F5F5F5] transition-colors">The Sender</label>
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="Enter your name..."
                  className="w-full bg-transparent border-b border-white/10 py-4 focus:border-[#C5A059] outline-none transition-all font-serif text-lg"
                />
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059] group-focus-within:text-[#F5F5F5] transition-colors">The Uplink</label>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Enter your email..."
                  className="w-full bg-transparent border-b border-white/10 py-4 focus:border-[#C5A059] outline-none transition-all font-serif text-lg"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059] group-focus-within:text-[#F5F5F5] transition-colors">The Message</label>
              <textarea
                required
                name="message"
                rows="5"
                placeholder="Write your request upon this scroll..."
                className="w-full bg-transparent border-b border-white/10 py-4 focus:border-[#C5A059] outline-none transition-all font-serif text-lg resize-none"
              />
            </div>

            <button type="submit" disabled={loading || success} className="w-full group outline-none">
              <WhistlingArrow loading={loading} success={success} />
            </button>
          </form>

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#111111]/95 backdrop-blur-sm"
              >
                <div className="w-20 h-20 bg-[#8B0000] flex items-center justify-center text-white mb-6 shadow-[0_0_30px_rgba(139,0,0,0.4)]">
                   <Send size={40} />
                </div>
                <h4 className="text-3xl font-serif font-bold text-[#F5F5F5] mb-2">Messenger Dispatched</h4>
                <p className="text-[#C5A059] font-serif italic text-center px-8">
                  "Your arrow has flown true. I shall witness your request soon."
                </p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="mt-8 text-[10px] uppercase tracking-[0.4em] text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors"
                >
                  Send another scroll
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Decorative Large Kanji Background */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[40rem] font-serif text-white/[0.01] pointer-events-none select-none">
        道
      </div>
    </section>
  );
}
