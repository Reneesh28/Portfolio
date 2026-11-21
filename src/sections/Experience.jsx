import { useState } from "react";
import experienceData from "../data/experience";

function StatusBadge({ status }) {
  const active = status.toLowerCase() === "active";

  return (
    <span
      className={`shrink-0 rounded border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${active
        ? "border-accent bg-accent text-accent-contrast"
        : "border-border text-text-muted"
        }`}
    >
      {active ? "Ongoing" : status}
    </span>
  );
}

function ExperienceSummary({ item, selected, controls, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-expanded={selected}
      aria-controls={controls}
      className={`relative w-full rounded-lg border p-4 text-left transition-colors duration-300 ${selected
        ? "border-text-muted bg-surface-raised"
        : "border-border bg-surface opacity-80 hover:opacity-100"
        }`}
    >
      <span className="mb-3 flex items-start justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
          {item.type}
        </span>
        <StatusBadge status={item.status} />
      </span>
      <span className="block text-lg font-semibold leading-tight">
        {item.role}
      </span>
      <span className="mt-1 block text-sm text-text-muted">
        {item.organization}
      </span>
      <span className="mt-3 block border-t border-border pt-2 text-xs text-text-muted">
        {item.period}
      </span>
    </button>
  );
}

function ExperienceDetails({ item, id }) {
  const progression = item.role === "CEO"
    ? ["Volunteer", "Board Member", "Co-CEO", "CEO"]
    : null;

  return (
    <article
      id={id}
      className="relative overflow-hidden rounded-lg border border-border bg-surface text-text"
      aria-live="polite"
    >
      <div className="border-b border-border p-6 md:p-8">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
            {item.type}
          </p>
          <StatusBadge status={item.status} />
        </div>
        <h3 className="text-3xl font-bold leading-tight md:text-5xl">{item.role}</h3>
        <p className="mt-3 text-lg font-semibold md:text-xl">
          {item.organization}
        </p>
        <p className="mt-2 text-sm text-text-muted">
          {item.period}
        </p>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8">
        <DetailPanel label="Mission">
          {item.mission}
        </DetailPanel>
        <DetailPanel label="Action">
          {item.action}
        </DetailPanel>
        <DetailPanel label="Impact">
          {item.impact}
        </DetailPanel>
        <div className="rounded-md border border-border bg-bg p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
            Tools & Methods
          </p>
          <div className="flex flex-wrap gap-2">
            {item.tools.map((tool) => (
              <span
                key={tool}
                className="rounded border border-border bg-surface px-2 py-1 font-mono text-xs"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>

      {progression && (
        <div className="border-t border-border bg-bg p-6 md:p-8">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
            Leadership Progression
          </p>
          <ol className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {progression.map((step, stepIndex) => (
              <li key={step} className="relative rounded-md border border-border p-3 text-sm font-semibold">
                <span className="mr-2 text-text-muted">0{stepIndex + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </article>
  );
}

function DetailPanel({ label, children }) {
  return (
    <div className="rounded-md border border-border bg-bg p-4">
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
        {label}
      </p>
      <p className="text-sm leading-relaxed md:text-base">{children}</p>
    </div>
  );
}

export default function Experience() {
  const [activeItem, setActiveItem] = useState(0);

  const selectMobileItem = (index) => {
    setActiveItem((current) => (current === index ? -1 : index));
  };

  return (
    <section
      id="experience"
      className="relative z-20 w-full min-h-screen flex flex-col py-24 px-4 md:px-12 lg:px-24 bg-bg text-text"
    >
      <div className="relative mx-auto w-full max-w-7xl">
        <header className="relative mb-14 text-center">
          <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
            Experience
          </h2>
        </header>

        {/* Desktop: stable selector and persistent detail panel. */}
        <div className="hidden gap-12 lg:grid lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,2fr)]">
          <div className="relative space-y-6 pl-8">
            <div className="absolute bottom-4 left-[11px] top-4 w-px bg-border" aria-hidden="true" />
            {experienceData.map((item, index) => (
              <div key={`${item.organization}-${item.role}`} className="relative">
                <span
                  className={`absolute -left-[26px] top-8 z-10 h-3 w-3 rounded-full border border-text-muted ${activeItem === index ? "bg-accent" : "bg-bg"}`}
                  aria-hidden="true"
                />
                <ExperienceSummary
                  item={item}
                  selected={activeItem === index}
                  controls="experience-desktop-detail"
                  onSelect={() => setActiveItem(index)}
                />
              </div>
            ))}
          </div>

          <ExperienceDetails
            key={activeItem}
            item={experienceData[activeItem < 0 ? 0 : activeItem]}
            id="experience-desktop-detail"
          />
        </div>

        {/* Mobile/tablet: one accessible accordion item at a time. */}
        <div className="relative space-y-6 pl-8 lg:hidden">
          <div className="absolute bottom-4 left-[11px] top-4 w-px bg-border" aria-hidden="true" />
          {experienceData.map((item, index) => {
            const selected = activeItem === index;
            const detailId = `experience-mobile-detail-${index}`;

            return (
              <div key={`${item.organization}-${item.role}`} className="relative">
                <span
                  className={`absolute -left-[26px] top-8 z-10 h-3 w-3 rounded-full border border-text-muted ${selected ? "bg-accent" : "bg-bg"}`}
                  aria-hidden="true"
                />
                <ExperienceSummary
                  item={item}
                  selected={selected}
                  controls={detailId}
                  onSelect={() => selectMobileItem(index)}
                />
                {selected && (
                  <div className="mt-6">
                    <ExperienceDetails item={item} id={detailId} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
