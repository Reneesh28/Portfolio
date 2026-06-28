import { useState } from "react";
import experienceData from "../data/experience";
import ComicSpread from "../components/comic/ComicSpread";
import StampReveal from "../components/comic/StampReveal";

const palettes = {
  cyan: {
    accent: "var(--color-portal-cyan)",
    accentClass: "bg-[var(--color-portal-cyan)]",
    textClass: "text-[var(--color-portal-cyan)]",
  },
  red: {
    accent: "var(--color-signal-red)",
    accentClass: "bg-[var(--color-signal-red)]",
    textClass: "text-[var(--color-signal-red)]",
  },
  magenta: {
    accent: "var(--color-dimension-magenta)",
    accentClass: "bg-[var(--color-dimension-magenta)]",
    textClass: "text-[var(--color-dimension-magenta)]",
  },
};

const getPalette = (palette) => palettes[palette] ?? palettes.cyan;

function IssueNumber({ index }) {
  return `ISSUE #${String(experienceData.length - index).padStart(2, "0")}`;
}

function StatusStamp({ status }) {
  const active = status.toLowerCase() === "active";

  return (
    <StampReveal sfx={null} color="var(--color-signal-red)" rotation={-14} once={false}>
      <span
        className={`shrink-0 border-2 border-[var(--color-ink-black)] px-2 py-1 font-label text-[10px] font-bold uppercase tracking-wider ${active
            ? "bg-[var(--color-comic-yellow)] text-[var(--color-ink-black)]"
            : "bg-[var(--color-ink-black)] text-white"
          }`}
      >
        {active ? "ONGOING" : status}
      </span>
    </StampReveal>
  );
}

function IssueSummary({ item, index, selected, controls, onSelect }) {
  const palette = getPalette(item.palette);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-expanded={selected}
      aria-controls={controls}
      className={`comic-focus relative w-full border-4 border-[var(--color-ink-black)] p-0 text-left transition-[transform,box-shadow,opacity] duration-300 ${selected
          ? "translate-x-2 opacity-100 shadow-[8px_8px_0_var(--color-ink-black)]"
          : "opacity-75 hover:translate-x-1 hover:opacity-100"
        }`}
    >
      <span className={`block h-3 w-full ${palette.accentClass}`} aria-hidden="true" />
      <span className="block bg-[var(--color-paper-light)] p-4 text-[var(--color-ink-black)]">
        <span className="mb-3 flex items-start justify-between gap-3">
          <span className="font-display text-2xl leading-none">
            <IssueNumber index={index} />
          </span>
          <StatusStamp status={item.status} />
        </span>
        <span className="block font-label text-lg font-bold uppercase leading-tight">
          {item.role}
        </span>
        <span className="mt-1 block font-body text-sm font-semibold">
          {item.organization}
        </span>
        <span className="mt-3 block border-t-2 border-dashed border-[var(--color-pencil-gray)] pt-2 font-label text-xs font-bold text-[var(--color-pencil-gray)]">
          {item.period}
        </span>
      </span>
    </button>
  );
}

function IssueDetails({ item, index, id }) {
  const palette = getPalette(item.palette);
  const progression = item.role === "CEO"
    ? ["Volunteer", "Board Member", "Co-CEO", "CEO"]
    : null;

  return (
    <article
      id={id}
      className="relative overflow-hidden border-4 border-[var(--color-ink-black)] bg-[var(--color-paper-light)] text-[var(--color-ink-black)] shadow-[12px_12px_0_var(--color-ink-black)]"
      aria-live="polite"
    >
      <div className={`h-4 w-full ${palette.accentClass}`} aria-hidden="true" />
      <div className="relative border-b-4 border-[var(--color-ink-black)] p-6 md:p-8">
        <div className="absolute inset-0 bg-halftone-light opacity-40" aria-hidden="true" />
        <div className="relative z-10">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <p className="font-display text-3xl md:text-4xl">
              <IssueNumber index={index} />
            </p>
            <StatusStamp status={item.status} />
          </div>
          <p className={`mb-2 font-label text-xs font-bold uppercase tracking-[0.25em] ${palette.textClass}`}>
            {item.type}
          </p>
          <h3 className="font-display text-4xl leading-none md:text-6xl">{item.role}</h3>
          <p className="mt-3 font-label text-lg font-bold uppercase md:text-xl">
            {item.organization}
          </p>
          <p className="mt-2 font-body text-sm font-semibold text-[var(--color-text-muted-paper)]">
            {item.period}
          </p>
        </div>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8">
        <StoryPanel label="Mission" color={palette.textClass}>
          {item.mission}
        </StoryPanel>
        <StoryPanel label="Action" color={palette.textClass}>
          {item.action}
        </StoryPanel>
        <StoryPanel label="Impact" color={palette.textClass}>
          {item.impact}
        </StoryPanel>
        <div className="border-l-4 border-[var(--color-ink-black)] bg-[var(--color-paper)] p-4">
          <p className={`mb-3 font-label text-xs font-bold uppercase tracking-[0.2em] ${palette.textClass}`}>
            Tools & Methods
          </p>
          <div className="flex flex-wrap gap-2">
            {item.tools.map((tool) => (
              <span
                key={tool}
                className="border-2 border-[var(--color-ink-black)] bg-white px-2 py-1 font-mono text-xs font-bold"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>

      {progression && (
        <div className="border-t-4 border-[var(--color-ink-black)] bg-[var(--color-ink-black)] p-6 text-white md:p-8">
          <p className="mb-4 font-label text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-comic-yellow)]">
            Leadership Progression
          </p>
          <ol className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {progression.map((step, stepIndex) => (
              <li key={step} className="relative border-2 border-white/40 p-3 font-label text-sm font-bold uppercase">
                <span className="mr-2 text-[var(--color-comic-yellow)]">0{stepIndex + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </article>
  );
}

function StoryPanel({ label, color, children }) {
  return (
    <div className="border-l-4 border-[var(--color-ink-black)] bg-[var(--color-paper)] p-4">
      <p className={`mb-2 font-label text-xs font-bold uppercase tracking-[0.2em] ${color}`}>
        {label}
      </p>
      <p className="font-body text-sm font-medium leading-relaxed md:text-base">{children}</p>
    </div>
  );
}

export default function Experience() {
  const [activeIssue, setActiveIssue] = useState(0);

  const selectMobileIssue = (index) => {
    setActiveIssue((current) => (current === index ? -1 : index));
  };

  return (
    <ComicSpread
      id="experience"
      className="relative z-20 overflow-visible bg-[var(--color-paper-light)] text-[var(--color-ink-black)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-halftone-light opacity-30 mix-blend-multiply" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <header className="relative mb-14 text-center">
          <p className="mb-2 font-label font-bold uppercase tracking-[0.3em] text-[var(--color-pencil-gray)]">
            Operational History
          </p>
          <StampReveal sfx="ISSUE!" color="var(--color-dimension-magenta)" rotation={-5}>
            <h2 className="font-display text-5xl tracking-wider md:text-7xl lg:text-8xl">
              Previous Issues
            </h2>
          </StampReveal>
          <svg
            className="mx-auto mt-3 h-4 w-2/3 max-w-md text-[var(--color-dimension-magenta)]"
            viewBox="0 0 200 10"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0,5 Q50,0 100,6 T200,4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </header>

        {/* Desktop: stable selector and persistent detail spread. */}
        <div className="hidden gap-12 lg:grid lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,2fr)]">
          <div className="relative space-y-8 pl-8">
            <div className="absolute bottom-4 left-[11px] top-4 w-2 bg-[var(--color-ink-black)]" aria-hidden="true" />
            {experienceData.map((item, index) => (
              <div key={`${item.organization}-${item.role}`} className="relative">
                <span
                  className="absolute -left-[29px] top-8 z-10 h-6 w-6 rounded-full border-4 border-[var(--color-ink-black)]"
                  style={{ backgroundColor: getPalette(item.palette).accent }}
                  aria-hidden="true"
                />
                <IssueSummary
                  item={item}
                  index={index}
                  selected={activeIssue === index}
                  controls="experience-desktop-detail"
                  onSelect={() => setActiveIssue(index)}
                />
              </div>
            ))}
          </div>

          <IssueDetails
            key={activeIssue}
            item={experienceData[activeIssue < 0 ? 0 : activeIssue]}
            index={activeIssue < 0 ? 0 : activeIssue}
            id="experience-desktop-detail"
          />
        </div>

        {/* Mobile/tablet: one accessible issue accordion at a time. */}
        <div className="relative space-y-8 pl-8 lg:hidden">
          <div className="absolute bottom-4 left-[11px] top-4 w-2 bg-[var(--color-ink-black)]" aria-hidden="true" />
          {experienceData.map((item, index) => {
            const selected = activeIssue === index;
            const detailId = `experience-mobile-detail-${index}`;

            return (
              <div key={`${item.organization}-${item.role}`} className="relative">
                <span
                  className="absolute -left-[29px] top-8 z-10 h-6 w-6 rounded-full border-4 border-[var(--color-ink-black)]"
                  style={{ backgroundColor: getPalette(item.palette).accent }}
                  aria-hidden="true"
                />
                <IssueSummary
                  item={item}
                  index={index}
                  selected={selected}
                  controls={detailId}
                  onSelect={() => selectMobileIssue(index)}
                />
                {selected && (
                  <div className="mt-6">
                    <IssueDetails item={item} index={index} id={detailId} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </ComicSpread>
  );
}