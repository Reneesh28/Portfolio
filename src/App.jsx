import { useState } from "react";
import Navbar from "./components/Navbar";
import Intro from "./components/Intro";
import AtmosphericBackground from "./components/AtmosphericBackground";
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

function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <div className="film-grain">
      <div className="vignette" />

      {/* BACKGROUND */}
      <AtmosphericBackground />

      {/* GSAP INTRO — blocks everything */}
      {!introDone && <Intro onFinish={() => setIntroDone(true)} />}

      {/* MAIN CONTENT — loads AFTER intro */}
      {introDone && (
        <>
          <Navbar />

          <main className="relative z-10 overflow-hidden">
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
        </>
      )}
    </div>
  );
}

export default App