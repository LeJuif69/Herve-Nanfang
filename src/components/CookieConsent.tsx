import React, { useEffect, useState } from 'react';

const CONSENT_KEY = 'hvnf_consent';

type Consent = { ga4: boolean; ads: boolean } | null;

export const CookieConsent: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [, setConsent] = useState<Consent>(null);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      setOpen(true);
    } else {
      setConsent(JSON.parse(stored));
    }
  }, []);

  const save = (c: { ga4: boolean; ads: boolean }) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
    setConsent(c);
    setOpen(false);
    // Notify loader that consent is granted
    window.dispatchEvent(new Event('consentGranted'));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-ink p-6 rounded-lg max-w-md w-full text-ivory">
        <h2 className="text-xl font-bold mb-2">Gestion des cookies</h2>
        <p className="mb-4 text-sm">
          Nous utilisons des cookies de mesure d’audience (Google Analytics 4) et de publicité (Google AdSense). Vous pouvez les accepter, les refuser ou les configurer.
        </p>
        <div className="flex justify-between">
          <button onClick={() => save({ ga4: true, ads: true })} className="btn btn-primary">Tout accepter</button>
          <button onClick={() => save({ ga4: false, ads: false })} className="btn btn-secondary">Tout refuser</button>
          <button onClick={() => setOpen(false)} className="btn btn-ghost" title="Personnaliser plus tard">Plus tard</button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
