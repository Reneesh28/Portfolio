import { useState } from "react";
import Navbar from "./components/Navbar";
import Intro from "./components/Intro";

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
    <>
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
            <Certifications />
            <Projects />
            <Education />
            <Experience />
            <Contact />
            <Footer />
          </main>
        </>
      )}
    </>
  );
}

export default App;
