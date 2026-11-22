import { lazy, Suspense, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { classicHref, lookDevView } from './mode';
import { useReducedMotion } from './core/useReducedMotion';
import { createExperienceStore } from './experience/experienceStore';
import { exposeDevHandle } from './experience/devHandle';
import { ExperienceContext } from './experience/ExperienceContext';
import JourneyNav from './ui/JourneyNav';
import WorksPanel from './ui/WorksPanel';
import SanctumPanel from './ui/SanctumPanel';
import ArchivePanel from './ui/ArchivePanel';
import AscensionPanel from './ui/AscensionPanel';
import BeyondPanel from './ui/BeyondPanel';
import WorldStage from './ui/WorldStage';
import { useJourneyInput } from './input/useJourneyInput';
import { useIdleControls } from './ui/useIdleControls';
import { useExperienceSnapshot } from './experience/ExperienceContext';
import VoidHero from './regions/void/VoidHero';
import './WorldForge.css';

// Three.js / R3F load in their own chunk; the hero text renders immediately meanwhile.
const WorldCanvas = lazy(() => import('./core/WorldCanvas'));
// P1 look development (DEC-016): development builds only; this branch compiles away in production.
const LookDev = import.meta.env.DEV ? lazy(() => import('./lookdev/LookDev')) : null;

/** World Forge entry: the experience, or (development only) the P1 look-development page. */
export default function WorldForge() {
  const view = LookDev ? lookDevView() : null;
  if (LookDev && view !== null) {
    return (
      <Suspense fallback={null}>
        <LookDev initialView={view} />
      </Suspense>
    );
  }
  return <WorldForgeExperience />;
}

/** World Forge experience root: owns the single experience store for this mount. */
function WorldForgeExperience() {
  const reducedMotion = useReducedMotion();
  const [store] = useState(() => createExperienceStore());

  useEffect(() => store.setReducedMotion(reducedMotion), [store, reducedMotion]);
  useEffect(() => exposeDevHandle(store), [store]);

  const rootRef = useRef<HTMLElement>(null);
  useJourneyInput(rootRef, store, reducedMotion);

  return (
    <ExperienceContext value={store}>
      <Stage rootRef={rootRef} reducedMotion={reducedMotion}>
        <Suspense fallback={null}>
          <WorldCanvas reducedMotion={reducedMotion} store={store} />
        </Suspense>
        <div className="wf-scrim" aria-hidden="true" />
        <VoidHero />
        <a className="wf-classic-link" href={classicHref()}>
          Classic portfolio
        </a>
        <SanctumPanel />
        <ArchivePanel />
        <AscensionPanel />
        <BeyondPanel />
        <WorksPanel />
        <JourneyNav />
      </Stage>
    </ExperienceContext>
  );
}

/** The stage, with the controls fading after inactivity (master doc §9): held while the journey moves. */
function Stage({ rootRef, reducedMotion, children }: { rootRef: RefObject<HTMLElement | null>; reducedMotion: boolean; children: ReactNode }) {
  const { phase } = useExperienceSnapshot();
  const idle = useIdleControls(rootRef, phase !== 'idle');
  return (
    <WorldStage ref={rootRef} reducedMotion={reducedMotion} idle={idle}>
      {children}
    </WorldStage>
  );
}
