
import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
import Navbar from "./components/Navbar";
import Intro from "./components/Intro";
// Sections
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Education from "./sections/Education";
import Validation from "./sections/Validation";
import Experience from "./sections/Experience";
import Contact from "./sections/Contact";
import Footer from "./components/Footer";

function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <div className="bg-sumi-static min-h-screen">
      {/* GSAP INTRO — blocks everything */}
      {!introDone && <Intro onFinish={() => setIntroDone(true)} />}

      {/* MAIN CONTENT — loads AFTER intro */}
      {introDone && (
        <>
          <Navbar />

          <main className="relative z-10">
            <Hero active={true} />
            <About active={true} />
            <Skills active={true} />
            <Experience />
            <Education />
            <Projects />
            <Validation />
            <Contact />
            <Footer />
          </main>
        </>
      )}
    </div>
  );
}

export default App