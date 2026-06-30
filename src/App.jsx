import { useState } from "react";
import Intro from "./sections/Intro"; // We will create this as a section instead of component soon
import IssueIndex from "./components/navigation/IssueIndex";
import PaperTexture from "./components/comic/PaperTexture";
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
import PortalOverlay from "./components/comic/PortalTransition";

function App() {
  const [introDone, setIntroDone] = useState(() => {
    // Check session storage to play intro only once per session
    return sessionStorage.getItem('codeverse_intro_done') === 'true';
  });

  const handleIntroFinish = () => {
    setIntroDone(true);
    sessionStorage.setItem('codeverse_intro_done', 'true');
  };

  return (
    <div className="bg-[var(--color-ink-black)] min-h-screen text-[var(--color-text-on-dark)] font-body">
      {/* Global Textures */}
      <PaperTexture theme="dark" />
      <PortalOverlay />

      {/* GSAP INTRO — blocks everything */}
      {!introDone && <Intro onFinish={handleIntroFinish} />}

      {/* MAIN CONTENT — loads immediately so Hero is visible underneath when Intro finishes */}
      <IssueIndex />
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