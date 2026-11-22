import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import type { RegionId } from '../data/worldGeography';
import { useExperienceSnapshot, useExperienceStore } from '../experience/ExperienceContext';
import { JOURNEY_ROUTE } from '../experience/route';
import { useDismissLayer } from './useDismissLayer';
import WorldMap from './WorldMap';

const stopLabel = (index: number) => String(index).padStart(2, '0');
const regionById = (id: RegionId) => JOURNEY_ROUTE.find((region) => region.id === id) ?? JOURNEY_ROUTE[0];

/**
 * Bottom-centre global navigation (master doc §8/§9): a compact button showing the
 * current region that expands into direct access to every region, and a quick bar
 * (P5): return to the Void, the World Map, The World Forge, and Contact (M8: contact is
 * reachable from every region, not gated behind the journey). Screen-space, keyboard and
 * touch operable, no hover dependency.
 */
export default function JourneyNav() {
  const store = useExperienceStore();
  const { currentRegion, destinationRegion, phase } = useExperienceSnapshot();
  const [open, setOpen] = useState(false);
  // Where the open map renders (the World Forge root); null while the map is closed.
  const [mapHost, setMapHost] = useState<Element | null>(null);
  const mapButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listId = useId();

  const current = regionById(currentRegion);
  const destination = regionById(destinationRegion);
  const travelling = phase !== 'idle' && destinationRegion !== currentRegion;
  const atEnd = current.index === JOURNEY_ROUTE.length - 1;

  // Close on outside pointer-down (safe: the menu holds no unsaved state).
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Opening moves focus to the current region's entry (only on the open transition).
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open && !wasOpen.current) itemRefs.current[current.index]?.focus();
    wasOpen.current = open;
  }, [open, current.index]);

  const close = (restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  };

  // Escape closes the menu (topmost layer) and returns focus to the toggle.
  useDismissLayer(open, () => close(true));

  // While the menu is open the visitor is choosing a destination: scroll must not move the camera.
  useEffect(() => (open ? store.blockScroll() : undefined), [open, store]);

  const select = (id: RegionId) => {
    store.navigateTo(id);
    close(true);
  };

  const openMap = () => {
    setOpen(false);
    setMapHost(navRef.current?.closest('.wf-root') ?? document.body);
  };
  const closeMap = () => {
    setMapHost(null);
    mapButtonRef.current?.focus();
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const items = itemRefs.current.filter((item): item is HTMLButtonElement => item !== null);
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;
    const move: Record<string, number> = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: items.length - 1 };
    if (event.key in move) {
      event.preventDefault();
      items[(move[event.key] + items.length) % items.length]?.focus();
    }
  };

  return (
    <nav ref={navRef} className="wf-nav" aria-label="World regions" data-open={open || undefined} onKeyDown={onMenuKeyDown}>
      {open && (
        <ul id={listId} className="wf-nav-list">
          {JOURNEY_ROUTE.map((region) => (
            <li key={region.id}>
              <button
                ref={(element) => {
                  itemRefs.current[region.index] = element;
                }}
                type="button"
                className="wf-nav-item"
                aria-current={region.id === currentRegion ? 'location' : undefined}
                onClick={() => select(region.id)}
              >
                <span className="wf-nav-index">{stopLabel(region.index)}</span>
                <span className="wf-nav-name">{region.name}</span>
                <span className="wf-nav-role">{region.role}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="wf-nav-bar">
        <button
          ref={toggleRef}
          type="button"
          className="wf-nav-toggle"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="wf-nav-index">{stopLabel((travelling ? destination : current).index)}</span>
          <span className="wf-nav-name">{(travelling ? destination : current).name}</span>
          <span className="wf-sr-only">{travelling ? ' (travelling) — ' : ' — '}choose a region</span>
          <span className="wf-nav-chevron" aria-hidden="true" />
        </button>
        {/* Quick bar (blueprint "bottom navigation"): home, world map, projects. */}
        <button type="button" className="wf-quick" onClick={() => select('void')} aria-label="Return to the Void (start)">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="7.5" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
        <button ref={mapButtonRef} type="button" className="wf-quick" onClick={openMap} aria-label="Open the world map" aria-haspopup="dialog">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z" />
            <path d="M9 4v13.5M15 6.5V20" />
          </svg>
        </button>
        <button type="button" className="wf-quick" onClick={() => select('world-forge')} aria-label="Go to The World Forge (projects)">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 2.5 14 9h-4z" />
            <path d="M8 21V12l4-3 4 3v9" />
            <path d="M5 21h14" />
          </svg>
        </button>
        <button type="button" className="wf-quick" data-contact="" onClick={() => store.openContact(true)} aria-label="Contact" aria-haspopup="dialog">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
            <path d="m4 7 8 6 8-6" />
          </svg>
        </button>
      </div>

      <p className="wf-nav-cue" aria-hidden="true" data-visible={!open && phase === 'idle' && !atEnd ? true : undefined}>
        SCROLL TO CONTINUE
      </p>

      {/* The map overlays the whole stage: rendered into the World Forge root (this nav is transformed). */}
      {mapHost && createPortal(<WorldMap onClose={closeMap} />, mapHost)}

      {/* Announces arrivals to assistive technology. */}
      <p className="wf-sr-only" role="status" aria-live="polite">
        {phase === 'idle' ? `${current.name}, ${current.role}` : ''}
      </p>
    </nav>
  );
}
