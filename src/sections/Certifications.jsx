import { useEffect, useRef, useState, memo } from "react";
import certifications from "../data/certifications";
import { FiExternalLink, FiAward, FiShield, FiX, FiCheckCircle, FiLoader } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "../components/ui/Badge";

gsap.registerPlugin(ScrollTrigger);

const VerificationModal = ({ cert, onComplete, onClose }) => {
  const [logs, setLogs] = useState([]);
  const modalRef = useRef(null);

  const verificationSteps = [
    `INITIATING_UPLINK... ${cert.issuer.toUpperCase()}_VAULT`,
    "RESOLVING_CRYPTOGRAPHIC_SIGNATURE...",
    "CROSS_REFERENCING_AUTHORITY_DATABASE...",
    "HANDSHAKE_ESTABLISHED.",
    "STATUS: AUTHORIZED // ACCESS_GRANTED"
  ];

  useEffect(() => {
    // Entrance
    gsap.fromTo(modalRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "power4.out" }
    );

    // Simulated Handshake Logs
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < verificationSteps.length) {
        setLogs(prev => [...prev, verificationSteps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete(cert.title);
          onClose();
        }, 800);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [cert]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95">
      <div
        ref={modalRef}
        className="w-full max-w-md bg-[#0D0D0D] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,1)] flex flex-col overflow-hidden"
      >
        <div className="p-4 bg-[#161616] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#00BFA5] font-mono text-[10px] uppercase font-bold tracking-widest">
            <FiShield className="animate-pulse" /> Authority Handshake
          </div>
          <button onClick={onClose} className="text-[#A3A3A3] hover:text-white transition-colors"><FiX /></button>
        </div>

        <div className="p-8 font-mono text-xs space-y-3 leading-relaxed">
          {logs.map((log, i) => (
            <div key={i} className={`${i === logs.length - 1 ? "text-white" : "text-neutral-600"}`}>
              <span className="text-[#00BFA5] mr-2">{">"}</span>
              {log}
            </div>
          ))}
          {logs.length < verificationSteps.length && (
            <div className="text-[#00BFA5] animate-pulse">_</div>
          )}
        </div>

        <div className="p-4 bg-[#0A0A0A] border-t border-white/5 text-center">
          <p className="text-[9px] text-neutral-600 uppercase tracking-widest font-bold font-mono">
            SECURE_CHANNEL_ACTIVE // PORT_8443
          </p>
        </div>
      </div>
    </div>
  );
};

const CertCard = memo(({ cert, index, isVerified, onVerify }) => {
  return (
    <div className="cert-card relative group">
      <div className={`
        relative h-full flex flex-col justify-between p-8 bg-[#111111] border transition-all duration-500
        ${isVerified ? "border-[#00BFA5]/20" : "border-white/5"}
      `}>
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className={`
              p-3 border transition-colors duration-500
              ${isVerified ? "bg-[#00BFA5]/5 border-[#00BFA5]/20 text-[#00BFA5]" : "bg-[#0A0A0A] border-white/5 text-neutral-500"}
            `}>
              <FiAward size={20} />
            </div>
            <div className="text-right">
              <p className={`text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-1 ${isVerified ? "text-emerald-500" : "text-red-500/60"}`}>
                {isVerified ? "[ AUTHORIZED ]" : "[ UNVERIFIED ]"}
              </p>
              <Badge variant="default" className="text-[10px] bg-[#1A1A1A] border-white/5 opacity-60">
                {cert.year}
              </Badge>
            </div>
          </div>

          <h3 className={`text-lg font-bold mb-2 tracking-tight transition-colors duration-500 ${isVerified ? "text-white" : "text-neutral-500"}`}>
            {cert.title}
          </h3>

          <p className="text-sm font-bold text-[#00BFA5]/80 mb-6 uppercase tracking-widest font-mono">
            {cert.issuer}
          </p>

          <div className={`flex flex-wrap gap-2 mb-8 transition-opacity duration-500 ${isVerified ? "opacity-100" : "opacity-30"}`}>
            {cert.tags.map((tag) => (
              <Badge key={tag} variant="default" className="bg-[#1A1A1A] border-white/5 text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {isVerified ? (
          <a
            href={cert.file}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#00BFA5] hover:text-white transition-all transform hover:translate-x-1"
          >
            EXTRACT CREDENTIALS <FiExternalLink />
          </a>
        ) : (
          <button
            onClick={() => onVerify(cert)}
            className="inline-flex items-center gap-3 text-xs font-bold text-neutral-600 hover:text-white transition-colors uppercase tracking-[0.2em] group/btn"
          >
            <FiLoader className="group-hover/btn:animate-spin" />
            Initiate Signature Handshake
          </button>
        )}
      </div>
    </div>
  );
});
CertCard.displayName = "CertCard";

export default function Certifications() {
  const containerRef = useRef(null);
  const [verifiedCerts, setVerifiedCerts] = useState([]);
  const [verifyingCert, setVerifyingCert] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      tl.fromTo(".cert-header",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )
        .fromTo(".cert-card",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" },
          "-=0.4"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleVerificationComplete = (title) => {
    setVerifiedCerts(prev => [...prev, title]);
  };

  return (
    <section
      id="certifications"
      className="w-full bg-[#0A0A0A] text-white px-6 md:px-12 py-24 sm:py-32 overflow-hidden border-t border-white/5"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="cert-header mb-20 text-center md:text-left">
          <p className="text-[#00BFA5] uppercase tracking-[0.3em] text-[10px] font-bold mb-4 opacity-70">
            VALIDATION_SUBSYSTEM
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight text-[#E0E0E0] mb-6">
            Authorized Clearances
          </h2>
          <p className="text-neutral-500 max-w-2xl font-mono text-sm leading-relaxed uppercase tracking-wider">
            Verification of professional identity through external cryptographic authority handshakes.
          </p>
        </div>

        {/* Grid */}
        <div className="cert-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {certifications.map((cert, index) => (
            <CertCard
              key={cert.title + index}
              cert={cert}
              index={index}
              isVerified={verifiedCerts.includes(cert.title)}
              onVerify={setVerifyingCert}
            />
          ))}
        </div>
      </div>

      {verifyingCert && (
        <VerificationModal
          cert={verifyingCert}
          onComplete={handleVerificationComplete}
          onClose={() => setVerifyingCert(null)}
        />
      )}
    </section>
  );
}

