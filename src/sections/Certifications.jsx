import { useEffect, useRef, useState, memo } from "react";
import certifications from "../data/certifications";
import { FiExternalLink, FiAward, FiX, FiCheckCircle, FiLoader } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "../components/ui/Badge";

gsap.registerPlugin(ScrollTrigger);

const UnsealModal = ({ cert, onComplete, onClose }) => {
  const [logs, setLogs] = useState([]);
  const modalRef = useRef(null);

  const steps = [
    `Opening the seal... ${cert.issuer.toUpperCase()}`,
    "Reading the mark of the master...",
    "Cross-referencing the records...",
    "The seal holds true.",
    "The honor is confirmed."
  ];

  useEffect(() => {
    gsap.fromTo(modalRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "power4.out" }
    );

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setLogs(prev => [...prev, steps[currentStep]]);
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
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6" style={{ backgroundColor: "rgba(12,10,9,0.95)" }}>
      <div
        ref={modalRef}
        className="w-full max-w-md border flex flex-col overflow-hidden rounded-lg"
        style={{
          backgroundColor: "var(--bg-panel)",
          borderColor: "var(--border-subtle)",
          boxShadow: "0 0 50px rgba(0,0,0,0.8)"
        }}
      >
        <div className="p-4 border-b flex items-center justify-between" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center gap-2 font-accent text-[10px] uppercase font-bold tracking-widest" style={{ color: "var(--accent)" }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--accent)" }} />
            Unsealing the Scroll
          </div>
          <button onClick={onClose} className="transition-colors" style={{ color: "var(--text-muted)" }}><FiX /></button>
        </div>

        <div className="p-8 font-body text-xs space-y-3 leading-relaxed">
          {logs.map((log, i) => (
            <div key={i} style={{ color: i === logs.length - 1 ? "var(--text-main)" : "var(--text-ink)" }}>
              <span className="mr-2" style={{ color: "var(--accent)" }}>{">"}</span>
              {log}
            </div>
          ))}
          {logs.length < steps.length && (
            <div className="animate-pulse" style={{ color: "var(--accent)" }}>_</div>
          )}
        </div>

        <div className="p-4 border-t text-center" style={{ backgroundColor: "var(--bg-void)", borderColor: "var(--border-subtle)" }}>
          <p className="text-[9px] uppercase tracking-widest font-bold font-accent" style={{ color: "var(--text-ink)" }}>
            Verifying authenticity...
          </p>
        </div>
      </div>
    </div>
  );
};

const CertCard = memo(({ cert, index, isVerified, onVerify }) => {
  return (
    <div className="cert-card relative group">
      <div
        className="relative h-full flex flex-col justify-between p-8 border transition-all duration-500 rounded-md"
        style={{
          backgroundColor: "var(--bg-panel)",
          borderColor: isVerified ? "var(--border-hover)" : "var(--border-subtle)"
        }}
      >
        <div>
          <div className="flex items-center justify-between mb-8">
            <div
              className="p-3 border transition-colors duration-500 rounded-md"
              style={{
                backgroundColor: isVerified ? "rgba(194,65,12,0.05)" : "var(--bg-void)",
                borderColor: isVerified ? "var(--border-hover)" : "var(--border-subtle)",
                color: isVerified ? "var(--accent)" : "var(--text-ink)"
              }}
            >
              <FiAward size={20} />
            </div>
            <div className="text-right">
              <p
                className="text-[10px] font-accent font-bold uppercase tracking-[0.2em] mb-1"
                style={{ color: isVerified ? "var(--accent)" : "var(--text-ink)" }}
              >
                {isVerified ? "[ HONORED ]" : "[ UNSEALED ]"}
              </p>
              <Badge variant="default" className="text-[10px] opacity-60" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
                {cert.year}
              </Badge>
            </div>
          </div>

          <h3
            className="text-lg font-display font-bold mb-2 tracking-tight transition-colors duration-500"
            style={{ color: isVerified ? "var(--text-main)" : "var(--text-ink)" }}
          >
            {cert.title}
          </h3>

          <p
            className="text-sm font-accent font-bold mb-6 uppercase tracking-widest opacity-80"
            style={{ color: "var(--accent)" }}
          >
            {cert.issuer}
          </p>

          <div className={`flex flex-wrap gap-2 mb-8 transition-opacity duration-500 ${isVerified ? "opacity-100" : "opacity-30"}`}>
            {cert.tags.map((tag) => (
              <Badge key={tag} variant="default" className="text-[10px]" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
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
            className="inline-flex items-center gap-2 text-sm font-accent font-bold transition-all transform hover:translate-x-1"
            style={{ color: "var(--accent)" }}
          >
            View Scroll <FiExternalLink />
          </a>
        ) : (
          <button
            onClick={() => onVerify(cert)}
            className="inline-flex items-center gap-3 text-xs font-accent font-bold transition-colors uppercase tracking-[0.2em] group/btn"
            style={{ color: "var(--text-ink)" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-main)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-ink)"}
          >
            <FiLoader className="group-hover/btn:animate-spin" />
            Unseal this Honor
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
      className="w-full px-6 md:px-12 py-24 sm:py-32 overflow-hidden border-t"
      style={{
        backgroundColor: "var(--bg-void)",
        color: "var(--text-main)",
        borderColor: "var(--border-subtle)"
      }}
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="cert-header mb-20 text-center md:text-left">
          <p
            className="font-accent uppercase tracking-[0.3em] text-[10px] font-bold mb-4 opacity-70"
            style={{ color: "var(--accent)" }}
          >
            SCROLLS OF MASTERY
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-6xl font-display font-extrabold tracking-tight mb-6"
            style={{ color: "var(--text-main)" }}
          >
            Earned Honors
          </h2>
          <p
            className="max-w-2xl font-body text-sm leading-relaxed"
            style={{ color: "var(--text-ink)" }}
          >
            Certifications and credentials earned through disciplined study and mastery.
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
        <UnsealModal
          cert={verifyingCert}
          onComplete={handleVerificationComplete}
          onClose={() => setVerifyingCert(null)}
        />
      )}
    </section>
  );
}
