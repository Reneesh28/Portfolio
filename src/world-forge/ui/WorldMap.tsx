import { useEffect, useId, useMemo, useRef, type KeyboardEvent } from 'react';
import type { RegionId } from '../data/worldGeography';
import { useExperienceSnapshot, useExperienceStore } from '../experience/ExperienceContext';
import { computeMapLayout, MAP_LABEL_FLIP } from './mapLayout';
import { useDismissLayer } from './useDismissLayer';

const MAP_ASPECT = 1.25;
const VIEW_W = 1000;
const VIEW_H = VIEW_W / MAP_ASPECT;
const label = (index: number) => String(index).padStart(2, '0');

interface WorldMapProps {
  onClose: () => void;
}

/**
 * The World Map (master doc §8 primary navigation entry; P5, DEC-020): an illustrated,
 * north-up overview of the archipelago drawn from the same geography as the 3D world.
 * Choosing a region travels there. It is a modal dialog: focus moves inside and stays
 * there, Escape closes, scroll travel is blocked while it is open, and focus returns
 * to the button that opened it.
 */
export default function WorldMap({ onClose }: WorldMapProps) {
  const store = useExperienceStore();
  const { currentRegion } = useExperienceSnapshot();
  const layout = useMemo(() => computeMapLayout(MAP_ASPECT), []);
  const dialogRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useDismissLayer(true, onClose);
  useEffect(() => store.blockScroll(), [store]);
  useEffect(() => currentRef.current?.focus(), []);

  const go = (id: RegionId) => {
    store.navigateTo(id);
    onClose();
  };

  // Keep keyboard focus inside the dialog.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;
    const focusable = [...(dialogRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])];
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="wf-map" role="presentation" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={dialogRef} className="wf-map-panel" role="dialog" aria-modal="true" aria-labelledby={titleId} onKeyDown={onKeyDown}>
        <header className="wf-map-header">
          <h2 id={titleId} className="wf-map-title">
            World Map
          </h2>
          <button type="button" className="wf-map-close" onClick={onClose} aria-label="Close the world map">
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <div className="wf-map-canvas" style={{ aspectRatio: String(MAP_ASPECT) }}>
          <svg className="wf-map-art" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} aria-hidden="true" focusable="false">
            <defs>
              <radialGradient id="wf-map-glow">
                <stop offset="0%" stopColor="#ffd27a" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#ffd27a" stopOpacity="0" />
              </radialGradient>
            </defs>
            {layout.routes.map((route) => (
              <line
                key={route.id}
                className="wf-map-route"
                x1={route.from.x * VIEW_W}
                y1={route.from.y * VIEW_H}
                x2={route.to.x * VIEW_W}
                y2={route.to.y * VIEW_H}
              />
            ))}
            {layout.islands.map((island) => (
              <circle
                key={island.id}
                className="wf-map-island"
                cx={island.x * VIEW_W}
                cy={island.y * VIEW_H}
                r={Math.max(4, island.r * VIEW_W)}
                style={{ stroke: island.accent }}
                data-current={island.region === currentRegion || undefined}
              />
            ))}
            {layout.islands
              .filter((i) => i.id === 'forge')
              .map((i) => (
                <circle key="glow" cx={i.x * VIEW_W} cy={i.y * VIEW_H} r={i.r * VIEW_W * 1.6} fill="url(#wf-map-glow)" />
              ))}
          </svg>
          {layout.regions.map((region) => (
            <button
              key={region.id}
              ref={region.id === currentRegion ? currentRef : undefined}
              type="button"
              className="wf-map-region"
              style={{ left: `${region.x * 100}%`, top: `${region.y * 100}%` }}
              data-edge={region.y > MAP_LABEL_FLIP ? 'bottom' : undefined}
              aria-current={region.id === currentRegion ? 'location' : undefined}
              onClick={() => go(region.id)}
            >
              <span className="wf-map-index">{label(region.index)}</span>
              <span className="wf-map-name">{region.name}</span>
              <span className="wf-sr-only">
                , {region.role}
                {region.id === currentRegion ? ' (you are here)' : ''}
              </span>
            </button>
          ))}
        </div>
        <p className="wf-map-hint">North is up · Choose a region to travel there</p>
      </div>
    </div>
  );
}
