import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { classicHref } from './mode';
import { useReducedMotion } from './core/useReducedMotion';
import { createExperienceStore } from './experience/experienceStore';
import { exposeDevHandle } from './experience/devHandle';
import { ExperienceContext } from './experience/ExperienceContext';
import JourneyNav from './ui/JourneyNav';
import WorldStage from './ui/WorldStage';
import { useJourneyInput } from './input/useJourneyInput';
import VoidHero from './regions/void/VoidHero';
import './WorldForge.css';

// Three.js / R3F load in their own chunk; the hero text renders immediately meanwhile.
const WorldCanvas = lazy(() => import('./core/WorldCanvas'));

/** World Forge experience root: owns the single experience store for this mount. */
export default function WorldForge() {
  const reducedMotion = useReducedMotion();
  const [store] = useState(() => createExperienceStore());

  useEffect(() => store.setReducedMotion(reducedMotion), [store, reducedMotion]);
  useEffect(() => exposeDevHandle(store), [store]);

  const rootRef = useRef<HTMLElement>(null);
  useJourneyInput(rootRef, store, reducedMotion);

  return (
    <ExperienceContext value={store}>
      <WorldStage ref={rootRef} reducedMotion={reducedMotion}>
        <Suspense fallback={null}>
          <WorldCanvas reducedMotion={reducedMotion} store={store} />
        </Suspense>
        <div className="wf-scrim" aria-hidden="true" />
        <VoidHero />
        <a className="wf-classic-link" href={classicHref()}>
          Classic portfolio
        </a>
        <JourneyNav />
      </WorldStage>
    </ExperienceContext>
  );
}
