import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import Intro from "./components/Intro";
import Hero from "./sections/Hero";
import About from "./sections/About";

function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      {/* Intro Animation */}
      <AnimatePresence mode="wait">
        {showIntro && (
          <Intro onFinish={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {/* Main Content */}
      {!showIntro && (
        <>
          <Hero />
          <About />
        </>
      )}
    </>
  );
}

export default App;
