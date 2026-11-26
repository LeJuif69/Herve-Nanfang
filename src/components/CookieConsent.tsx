import React, { useEffect, useState } from 'react';

const CONSENT_KEY = 'hvnf_consent';
export const OPEN_COOKIE_SETTINGS_EVENT = 'openCookieSettings';

type Consent = { ga4: boolean; ads: boolean };

export const CookieConsent: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState<Consent>({ ga4: false, ads: false });
  const [showSettings, setShowSettings] = useState(false);
  const [storageError, setStorageError] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) {
        setOpen(true);
      } else {
        const parsed = JSON.parse(stored);
        if (typeof parsed?.ga4 === 'boolean' && typeof parsed?.ads === 'boolean') {
          setPreferences({ ga4: parsed.ga4, ads: parsed.ads });
        } else {
          setOpen(true);
        }
      }
    } catch (error) {
      console.warn('Impossible de lire les préférences de cookies:', error);
      setOpen(true);
    }

    const openSettings = () => {
      setShowSettings(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
  }, []);

  const save = (consent: Consent) => {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
      setPreferences(consent);
      setStorageError('');
      setOpen(false);
      setShowSettings(false);
      window.dispatchEvent(new Event('consentChanged'));
    } catch (error) {
      console.error('Impossible d’enregistrer les préférences de cookies:', error);
      setStorageError('Vos préférences n’ont pas pu être enregistrées. Vérifiez les réglages de votre navigateur.');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" data-testid="cookie-consent">
      <div
        className="bg-ink p-6 rounded-lg max-w-md w-full text-ivory"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-consent-title"
      >
        <h2 id="cookie-consent-title" className="text-xl font-bold mb-2">Gestion des cookies</h2>
        <p className="mb-4 text-sm">
          Les cookies facultatifs de mesure d’audience et de publicité ne sont activés qu’avec votre accord. Vous pouvez les accepter, les refuser ou choisir vos préférences.
        </p>
        {showSettings && (
          <fieldset className="mb-5 space-y-3">
            <legend className="mb-3 text-sm font-semibold">Mes préférences</legend>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={preferences.ga4}
                onChange={(event) => setPreferences((current) => ({ ...current, ga4: event.target.checked }))}
              />
              Mesure d’audience (Google Analytics 4)
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={preferences.ads}
                onChange={(event) => setPreferences((current) => ({ ...current, ads: event.target.checked }))}
              />
              Publicité et conversions (Google Ads, AdSense et Meta)
            </label>
          </fieldset>
        )}
        {storageError && <p role="alert" className="mb-4 text-sm text-red-300">{storageError}</p>}
        <div className="flex flex-wrap justify-between gap-2">
          {showSettings ? (
            <button onClick={() => save(preferences)} className="btn btn-primary">Enregistrer mes choix</button>
          ) : (
            <button onClick={() => setShowSettings(true)} className="btn btn-ghost">Personnaliser</button>
          )}
          <button onClick={() => save({ ga4: true, ads: true })} className="btn btn-primary">Tout accepter</button>
          <button onClick={() => save({ ga4: false, ads: false })} className="btn btn-secondary">Tout refuser</button>
          {!showSettings && <button onClick={() => setOpen(false)} className="btn btn-ghost">Plus tard</button>}
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
