/** THE VOID identity block — real DOM text, readable and selectable over the scene. */
export default function VoidHero() {
  return (
    <section className="wf-hero" aria-labelledby="wf-title">
      <p className="wf-eyebrow">ENGINEER · CREATOR · WORLD BUILDER</p>
      <h1 id="wf-title" className="wf-title">
        THE WORLD FORGE
      </h1>
      <p className="wf-tagline">Where ideas become worlds.</p>
      <p className="wf-statement">
        I build systems, create experiences, and explore ideas that haven&rsquo;t yet taken form.
      </p>
    </section>
  );
}
