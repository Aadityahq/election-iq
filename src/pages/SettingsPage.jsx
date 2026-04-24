import React, { useEffect, useState } from 'react';
import '../styles/settings.css';

function SettingsPage() {
  const [language, setLanguage] = useState('English');
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('electioniq_language');
    const savedContrast = localStorage.getItem('electioniq_high_contrast') === 'true';
    const savedLargeText = localStorage.getItem('electioniq_large_text') === 'true';

    if (savedLanguage) setLanguage(savedLanguage);
    setHighContrast(savedContrast);
    setLargeText(savedLargeText);
  }, []);

  useEffect(() => {
    localStorage.setItem('electioniq_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('electioniq_high_contrast', String(highContrast));
    document.body.classList.toggle('high-contrast', highContrast);
    return () => document.body.classList.remove('high-contrast');
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('electioniq_large_text', String(largeText));
    document.body.classList.toggle('large-text', largeText);
    return () => document.body.classList.remove('large-text');
  }, [largeText]);

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <p className="settings-subtitle">Customize your ElectionIQ experience.</p>

      <section className="settings-card">
        <h2>Language</h2>
        <label htmlFor="language-select">Preferred response language</label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option>English</option>
          <option>Hindi</option>
          <option>Bengali</option>
          <option>Tamil</option>
          <option>Telugu</option>
        </select>
      </section>

      <section className="settings-card">
        <h2>Accessibility</h2>

        <label className="toggle-row" htmlFor="high-contrast">
          <span>High Contrast Mode</span>
          <input
            id="high-contrast"
            type="checkbox"
            checked={highContrast}
            onChange={(e) => setHighContrast(e.target.checked)}
          />
        </label>

        <label className="toggle-row" htmlFor="large-text">
          <span>Large Text</span>
          <input
            id="large-text"
            type="checkbox"
            checked={largeText}
            onChange={(e) => setLargeText(e.target.checked)}
          />
        </label>
      </section>
    </div>
  );
}

export default SettingsPage;