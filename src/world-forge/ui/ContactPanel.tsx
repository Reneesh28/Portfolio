import { CONTACT } from '../content/horizon';
import { useExperienceSnapshot, useExperienceStore } from '../experience/ExperienceContext';
import FocusPanel from './FocusPanel';

/**
 * Contact, from anywhere (M8; master doc: "directly accessible, not gated behind the journey").
 * Opened by the Contact button in the bottom bar on every region, or "Get in touch" at the
 * Horizon. Email, GitHub, LinkedIn and the résumé, each labelled; external links say they open
 * in a new tab. No travel: it opens over wherever the visitor is.
 */
export default function ContactPanel({ onClosed }: { onClosed: () => void }) {
  const store = useExperienceStore();
  const { contactOpen } = useExperienceSnapshot();
  if (!contactOpen) return null;
  const close = () => {
    store.openContact(false);
    onClosed();
  };
  return (
    <FocusPanel className="wf-dossier--contact" viewKey="contact" count="Contact" title="Get in touch" closeLabel="Close contact" onClose={close}>
      <p className="wf-dossier-meta">Balam Reneesh</p>
      <ul className="wf-contact-list">
        {CONTACT.map((c) => (
          <li key={c.id}>
            <span className="wf-contact-label">{c.label}</span>
            <a href={c.href} {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
              {c.text}
              {c.external && <span className="wf-sr-only"> (opens in a new tab)</span>}
              {c.external && <span aria-hidden="true"> ↗</span>}
            </a>
          </li>
        ))}
      </ul>
    </FocusPanel>
  );
}
