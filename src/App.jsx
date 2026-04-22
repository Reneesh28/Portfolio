
import { useState } from "react";
import CompassNav from "./components/CompassNav";
import JourneyMap from "./components/JourneyMap";
import Intro from "./components/Intro";
import SamuraiWorld from "./components/SamuraiWorld";
// Sections
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Certifications from "./sections/Certifications";
import Projects from "./sections/Projects";
import Education from "./sections/Education";
import Experience from "./sections/Experience";
import Contact from "./sections/Contact";
import { NarrativeProvider } from "./context/NarrativeContext";
import { ThemeProvider } from "./context/ThemeContext";
import ChapterMarkers from "./components/ChapterMarkers";
import SamuraiCursor from "./components/SamuraiCursor";
import Footer from "./components/Footer";

function App() {
  const [introDone, setIntroDone] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  return (
    <NarrativeProvider>
      <ThemeProvider>
        <SamuraiCursor />
      {/* BACKGROUND */}
      <SamuraiWorld />

      {/* GSAP INTRO — blocks everything */}
      {!introDone && <Intro onFinish={() => setIntroDone(true)} />}

      {/* MAIN CONTENT — loads AFTER intro */}
      {introDone && (
        <>
          <CompassNav isOpen={isMapOpen} onOpenMap={() => setIsMapOpen(!isMapOpen)} />
          <JourneyMap isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />
          <ChapterMarkers />

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
      </ThemeProvider>
    </NarrativeProvider>
  );
}

export default App