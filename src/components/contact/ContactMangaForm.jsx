import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

export default function ContactMangaForm({ onLogUpdate }) {
  const formRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [sfx, setSfx] = useState('');

  const sendEmail = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    setSfx('ズバッ…');
    onLogUpdate?.('INITIATING MULTIVERSE SIGNAL...');

    await new Promise((r) => setTimeout(r, 600));
    onLogUpdate?.('ROUTING DIRECT TRANSMISSION TO INBOX...');

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      onLogUpdate?.('TRANSMISSION RECEIVED & LOGGED!');
      setStatus('success');
      setSfx('ドォン!!');
      formRef.current?.reset();
      setTimeout(() => setStatus('idle'), 6000);
    } catch (err) {
      console.error(err);
      onLogUpdate?.('DELIVERY FAILED. PLEASE USE DIRECT EMAIL.');
      setStatus('error');
      setSfx('ガーン…');
      setTimeout(() => setStatus('idle'), 6000);
    }
  };

  return (
    <div className="contact-manga-form-container">
      <div className="form-panel-header">
        <div className="form-badge-group">
          <span className="form-kanji-tag">送信</span>
          <span className="form-header-title">DISPATCH TRANSMISSION</span>
        </div>
        <span className="form-frequency-tag">FREQ: 28.000 MHZ</span>
      </div>

      <form ref={formRef} onSubmit={sendEmail} className="manga-transmission-form">
        <div className="form-row-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="from_name">
              OPERATOR / YOUR NAME
            </label>
            <input
              id="from_name"
              type="text"
              name="from_name"
              required
              autoComplete="name"
              className="manga-input-field"
              placeholder="e.g. Satoru Gojo / Jane Doe"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="from_email">
              RETURN FREQUENCY / EMAIL
            </label>
            <input
              id="from_email"
              type="email"
              name="from_email"
              required
              autoComplete="email"
              className="manga-input-field"
              placeholder="e.g. operator@multiverse.io"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="mission_type">
            TRANSMISSION CLASSIFICATION
          </label>
          <div className="select-wrapper">
            <select
              id="mission_type"
              name="mission_type"
              required
              defaultValue=""
              className="manga-select-field"
            >
              <option value="" disabled>
                Select transmission type...
              </option>
              <option value="Full-Time / Engineering Role">Full-Time / Engineering Role</option>
              <option value="AI / Contract Project">AI / Contract Project</option>
              <option value="Collaborative Build / Research">Collaborative Build / Research</option>
              <option value="General Transmission / Chat">General Transmission / Chat</option>
            </select>
            <span className="select-caret" aria-hidden="true">
              ▼
            </span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="message">
            TRANSMISSION PAYLOAD / MESSAGE
          </label>
          <textarea
            id="message"
            name="message"
            rows="4"
            required
            className="manga-textarea-field"
            placeholder="State your objectives, parameters, or collaboration scope..."
          />
        </div>

        {/* Submit Row with Interactive SFX stamp */}
        <div className="form-submit-row">
          <button
            type="submit"
            disabled={status === 'sending'}
            className={`manga-submit-btn ${status}`}
            aria-label="Send Message Transmission"
          >
            <span className="btn-kanji">送信</span>
            <span className="btn-text">
              {status === 'sending'
                ? 'TRANSMITTING SIGNAL...'
                : status === 'success'
                ? 'TRANSMISSION DELIVERED!'
                : status === 'error'
                ? 'RETRY TRANSMISSION'
                : 'DISPATCH TRANSMISSION →'}
            </span>
          </button>

          {sfx && (
            <div className="form-manga-sfx-stamp" aria-hidden="true">
              <span>{sfx}</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
