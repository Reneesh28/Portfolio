import { useState } from "react";
import Navbar from "./components/Navbar";
import IntroScene from "./components/Intro";

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
      {!introDone && <IntroScene onFinish={() => setIntroDone(true)} />}

      {introDone && (
        <>
          <Navbar />
          <main className="relative z-10">
            <Hero introDone={introDone} />
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
