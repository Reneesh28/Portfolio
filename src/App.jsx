import Navigation from "./components/navigation/Navigation";
// Sections
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Certifications from "./sections/Certifications";
import Projects from "./sections/Projects";
import Education from "./sections/Education";
import Experience from "./sections/Experience";
import Contact from "./sections/Contact";
import Footer from "./components/Footer";
import GlobalControls from "./components/GlobalControls";
import WorldForge from "./world-forge/WorldForge";
import { resolveMode } from "./world-forge/mode";

function App() {
  // Exactly one experience mounts. World Forge is the default; Classic needs ?mode=classic.
  if (resolveMode() === "world") {
    return <WorldForge />;
  }

  return (
    <div className="bg-bg min-h-screen text-text font-body">
      <Navigation />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Certifications />
        <Education />
        <Contact />
        <Footer />
      </main>
      <GlobalControls />
    </div>
  );
}

export default App;
