import type { ReactNode, Ref } from 'react';
import { useExperienceSnapshot } from '../experience/ExperienceContext';

interface WorldStageProps {
  ref: Ref<HTMLElement>;
  reducedMotion: boolean;
  children: ReactNode;
}

/**
 * The World Forge root element. Exposes the journey state to CSS
 * (`data-region`, `data-at-void`) so screen-space layers — such as the Void hero —
 * can fade with the journey without re-rendering the scene.
 */
export default function WorldStage({ ref, reducedMotion, children }: WorldStageProps) {
  const { currentRegion, destinationRegion } = useExperienceSnapshot();
  const atVoid = currentRegion === 'void' && destinationRegion === 'void';
  return (
    <main
      ref={ref}
      className="wf-root"
      data-motion={reducedMotion ? 'reduced' : 'full'}
      data-region={currentRegion}
      data-at-void={atVoid || undefined}
    >
      {children}
    </main>
  );
}
