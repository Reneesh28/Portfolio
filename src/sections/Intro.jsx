import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import LottieLib from 'lottie-react';
import { Volume2, VolumeX } from 'lucide-react';
import KineticTitle from '../components/comic/KineticTitle';
import codewalker from '../assets/images/codewalker.webp';
import particleExplosion from '../assets/particle.explosion.lottie.json';
import './Intro.css';
import './IntroLottie.css';

// Extract the Lottie component regardless of how Vite/Rollup resolves the CJS/ESM interop
const Lottie = typeof LottieLib === 'function' ? LottieLib : (LottieLib?.default?.default || LottieLib?.default || LottieLib);

const DimensionRift = lazy(() => import('../components/three/DimensionRift'));
const DimensionCharacterGlitch = lazy(() => import('../components/three/DimensionCharacterGlitch'));

const codeFragments = ['<idea />', 'npm run build', 'const future = now()', '{ systems: alive }', '01 10 11 01'];

const Intro = ({ onFinish }) => {
  const rootRef = useRef(null);
  const timelineRef = useRef(null);
  const audioRef = useRef(null);
  const explosionRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    if (!soundEnabled) return undefined;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return undefined;
    const ctx = audioRef.current || new AudioContext();
    audioRef.current = ctx;
    ctx.resume();
    const oscillator = ctx.createOscillator();
    const pulse = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'sawtooth';
    pulse.type = 'sine';
    oscillator.frequency.value = 48;
    pulse.frequency.value = 96;
    gain.gain.value = 0.018;
    oscillator.connect(gain);
    pulse.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    pulse.start();
    return () => {
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      oscillator.stop(ctx.currentTime + 0.1);
      pulse.stop(ctx.currentTime + 0.1);
    };
  }, [soundEnabled]);

  const finish = useCallback(() => {
    timelineRef.current?.kill();
    gsap.to(rootRef.current, {
      opacity: 0,
      scale: 1.04,
      duration: reducedMotion ? 0.25 : 0.65,
      ease: 'power3.inOut',
      onComplete: onFinish,
    });
  }, [onFinish, reducedMotion]);

  useEffect(() => {
    const onKeyDown = (event) => event.key === 'Escape' && finish();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [finish]);

  useEffect(() => {
    if (reducedMotion) {
      const reduced = gsap.timeline({ onComplete: finish });
      reduced.set('.intro-title-scene', { opacity: 1 }).to({}, { duration: 1.4 });
      timelineRef.current = reduced;
      return () => reduced.kill();
    }

    const q = gsap.utils.selector(rootRef);
    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: finish });

    gsap.set(q('.dimension-scene, .intro-title-scene, .intro-codewalker, .collision-field'), { opacity: 0 });
    gsap.set(q('.portal-shell'), { scale: 0, rotation: -35 });

    // Cold open: the transmission struggles to lock onto Earth-28.
    tl.to(q('.boot-line'), { opacity: 1, x: 0, duration: 0.18, stagger: 0.12, ease: 'steps(2)' })
      .to(q('.intro-scanline'), { yPercent: 115, duration: 0.75, ease: 'none' }, '<')
      .to(rootRef.current, { x: 'random(-7,7)', duration: 0.035, repeat: 5, yoyo: true }, '-=0.2')
      .set(rootRef.current, { x: 0 })
      .to(q('.boot-screen'), { opacity: 0, duration: 0.18 });

    // Earth 01: hand-drawn student dimension.
    tl.set(q('.student-scene'), { opacity: 1 })
      .to(q('.student-scene .portal-shell'), { scale: 1, rotation: 0, duration: 0.58, ease: 'back.out(1.45)' })
      .fromTo(q('.sketch-line'), { scaleX: 0 }, { scaleX: 1, duration: 0.34, stagger: 0.045, ease: 'steps(4)' }, '-=0.35')
      .fromTo(q('.dimension-word.student'), { xPercent: -130, rotation: -12 }, { xPercent: 0, rotation: -4, duration: 0.4, ease: 'back.out(1.8)' }, '-=0.2')
      .fromTo(q('.student-note'), { y: 70, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.25 }, '<')
      .to(q('.student-scene .portal-shell'), { scale: 7, rotation: 18, duration: 0.58, ease: 'power4.in' }, '+=0.28')
      .set(q('.student-scene'), { opacity: 0 });

    // Earth 02: code blocks assemble into the builder identity.
    tl.set(q('.builder-scene'), { opacity: 1 })
      .fromTo(q('.builder-scene'), { scale: 1.35 }, { scale: 1, duration: 0.35, ease: 'power3.out' })
      .fromTo(q('.code-fragment'), { z: -500, opacity: 0, rotateX: 70 }, { z: 0, opacity: 1, rotateX: 0, stagger: 0.065, duration: 0.42, ease: 'back.out(1.4)' })
      .fromTo(q('.dimension-word.builder'), { scale: 2.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.32, ease: 'steps(4)' }, '-=0.25')
      .to(q('.builder-grid'), { backgroundPosition: '80px 80px', duration: 0.55, ease: 'none' }, '<')
      .to(q('.builder-scene'), { clipPath: 'circle(0% at 82% 22%)', rotate: 7, duration: 0.58, ease: 'power4.in' }, '+=0.32')
      .set(q('.builder-scene'), { opacity: 0 });

    // Earth 03: technical geometry and circuitry surge toward camera.
    tl.set(q('.engineer-scene'), { opacity: 1, clipPath: 'circle(0% at 82% 22%)' })
      .to(q('.engineer-scene'), { clipPath: 'circle(145% at 82% 22%)', duration: 0.58, ease: 'power4.out' })
      .fromTo(q('.engineer-ring'), { scale: 0, rotate: -120 }, { scale: 1, rotate: 0, stagger: 0.08, duration: 0.55, ease: 'back.out(1.4)' }, '-=0.32')
      .fromTo(q('.circuit-line'), { scaleX: 0 }, { scaleX: 1, stagger: 0.035, duration: 0.28, ease: 'steps(3)' }, '<')
      .fromTo(q('.dimension-word.engineer'), { scale: 1.15, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.42, ease: 'steps(5)' }, '-=0.15')
      .to(q('.engineer-core'), { scale: 14, rotate: 90, duration: 0.62, ease: 'power4.in' }, '+=0.3')
      .set(q('.engineer-scene'), { opacity: 0 });

    // The dimensions collide; portals orbit the rift before imploding.
    tl.set(q('.collision-field'), { opacity: 1 })
      .fromTo(q('.collision-portal'), { scale: 0, rotate: -60 }, { scale: 1, rotate: 0, stagger: 0.08, duration: 0.42, ease: 'back.out(1.7)' })
      .to(q('.collision-orbit'), { rotate: 115, scale: 1.18, duration: 0.7, ease: 'power2.inOut' }, '<')
      .fromTo(q('.collision-label'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.2, ease: 'steps(2)' }, '-=0.45')
      .to(rootRef.current, { x: 'random(-12,12)', y: 'random(-8,8)', duration: 0.035, repeat: 8, yoyo: true }, '+=0.12')
      .set(rootRef.current, { x: 0, y: 0 })
      .to(q('.collision-portal'), { x: 0, y: 0, scale: 0, duration: 0.34, stagger: 0.035, ease: 'power4.in' }, '<')
      .call(() => explosionRef.current?.goToAndPlay(0, true))
      .fromTo(q('.particle-explosion'), { opacity: 0, scale: 0.35 }, { opacity: 1, scale: 1.45, duration: 0.34, ease: 'power4.out' }, '<')
      .to(q('.collision-flash'), { opacity: 1, scale: 2.5, duration: 0.08, ease: 'steps(1)' })
      .to(q('.collision-field'), { opacity: 0, duration: 0.12 });

    // Codewalker breaks through and freezes into the comic cover.
    tl.set(q('.intro-title-scene'), { opacity: 1 })
      .fromTo(q('.intro-codewalker'), { opacity: 0, yPercent: 80, scale: 0.4, rotate: -18 }, { opacity: 1, yPercent: 0, scale: 1, rotate: 0, duration: 0.62, ease: 'back.out(1.55)' })
      .fromTo(q('.ink-shard'), { scale: 0, opacity: 1 }, { scale: 'random(1.2,2.4)', opacity: 0, stagger: 0.025, duration: 0.42 }, '<')
      .fromTo(q('.cover-kicker'), { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.24, ease: 'steps(3)' }, '-=0.18')
      .fromTo(q('.cover-title'), { scale: 2.6, opacity: 0, rotate: -7 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.3, ease: 'steps(5)' })
      .fromTo(q('.cover-subtitle'), { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28, ease: 'back.out(1.6)' }, '-=0.08')
      .fromTo(q('.impact-word'), { scale: 3, opacity: 0, rotate: 15 }, { scale: 1, opacity: 1, rotate: -8, duration: 0.16, ease: 'power4.in' }, '<')
      .to(rootRef.current, { x: 'random(-9,9)', y: 'random(-6,6)', duration: 0.04, repeat: 5, yoyo: true }, '<')
      .set(rootRef.current, { x: 0, y: 0 })
      .to(q('.impact-word'), { opacity: 0, scale: 1.35, duration: 0.3 }, '+=0.45')
      .to({}, { duration: 0.55 });

    timelineRef.current = tl;
    return () => tl.kill();
  }, [finish, reducedMotion]);

  const accelerate = () => {
    if (timelineRef.current) timelineRef.current.timeScale(Math.min(2, timelineRef.current.timeScale() + 0.25));
  };

  return (
    <div ref={rootRef} className="codeverse-intro" onClick={accelerate}>
      <div className="intro-controls">
        <button onClick={(e) => { e.stopPropagation(); setSoundEnabled((value) => !value); }} aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}>
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
        <button onClick={(e) => { e.stopPropagation(); finish(); }} className="skip-intro">Skip <span>Esc</span></button>
      </div>

      <div className="boot-screen intro-layer">
        <div className="intro-scanline" />
        <p className="boot-line">MULTIVERSE_LINK::SEARCHING</p>
        <p className="boot-line">ANOMALY_DETECTED / EARTH-28</p>
        <p className="boot-line boot-alert">IDENTITY SIGNAL UNSTABLE</p>
      </div>

      <section className="dimension-scene student-scene intro-layer">
        <div className="portal-shell student-portal">
          <div className="notebook-grid" />
          {[12, 28, 46, 64, 82].map((top) => <i key={top} className="sketch-line" style={{ top: `${top}%` }} />)}
          <span className="student-note note-one">ideas?</span><span className="student-note note-two">learn.</span><span className="student-note note-three">iterate!</span>
          <h2 className="dimension-word student">Student</h2>
        </div>
        <div className="earth-tag">EARTH-01 / ORIGIN</div>
      </section>

      <section className="dimension-scene builder-scene intro-layer">
        <div className="builder-grid" />
        {codeFragments.map((fragment, index) => <code key={fragment} className={`code-fragment fragment-${index}`}>{fragment}</code>)}
        <div className="builder-cursor" />
        <h2 className="dimension-word builder">Builder</h2>
        <div className="earth-tag">EARTH-02 / CONSTRUCTION</div>
      </section>

      <section className="dimension-scene engineer-scene intro-layer">
        <div className="engineer-core">
          <i className="engineer-ring ring-a"/><i className="engineer-ring ring-b"/><i className="engineer-ring ring-c"/>
        </div>
        {[18, 34, 50, 66, 82].map((top) => <i key={top} className="circuit-line" style={{ top: `${top}%` }} />)}
        <h2 className="dimension-word engineer">Engineer</h2>
        <div className="earth-tag">EARTH-03 / SYSTEMS</div>
      </section>

      <section className="collision-field intro-layer">
        <Suspense fallback={null}><DimensionRift density={12} className="intro-rift" /></Suspense>
        <Suspense fallback={null}><DimensionCharacterGlitch interval={[600, 1200]} maxVisible={2} /></Suspense>
        <div className="collision-orbit">
          <div className="collision-portal collision-a"><span className="collision-label">ORIGIN</span></div>
          <div className="collision-portal collision-b"><span className="collision-label">BUILD</span></div>
          <div className="collision-portal collision-c"><span className="collision-label">SYSTEM</span></div>
        </div>
        <Lottie
          lottieRef={explosionRef}
          animationData={particleExplosion}
          autoplay={false}
          loop={false}
          className="particle-explosion"
          aria-hidden="true"
        />
        <div className="collision-flash" />
        <p className="collision-warning">DIMENSIONAL COLLISION IMMINENT</p>
      </section>

      <section className="intro-title-scene intro-layer">
        <div className="title-rift" />
        {Array.from({ length: 10 }, (_, index) => <i key={index} className={`ink-shard shard-${index}`} />)}
        <img src={codewalker} alt="The Codewalker" className="intro-codewalker" />
        <div className="cover-copy">
          <p className="cover-kicker">ISSUE #01 · EARTH-28 PRESENTS</p>
          <h1 className="cover-title"><KineticTitle as="span">RENEESH</KineticTitle></h1>
          <h2 className="cover-subtitle">ACROSS THE CODEVERSE</h2>
        </div>
        <span className="impact-word" aria-hidden="true">THWIP!</span>
      </section>

      <div className="intro-grain" />
      <div className="intro-vignette" />
      <p className="accelerate-hint">CLICK TO ACCELERATE</p>
    </div>
  );
};

export default Intro;
