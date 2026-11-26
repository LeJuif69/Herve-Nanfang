import { Btn, Container, Display, Eyebrow, Lead, Section } from '../components/ui'
import { hasAnalyticsConsent, trackGA4 } from '../lib/ga4'
import { useSeo } from '../lib/seo'

export default function ThankYou() {
  useSeo({
    title: 'Merci pour votre inscription | Hervé Nanfang',
    description: 'Téléchargez immédiatement votre guide et rejoignez Les Carnets du Musicien Augmenté.',
    path: '/thank-you',
    robots: 'noindex, follow',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Confirmation inscription Lead Magnet',
        description: 'Téléchargez immédiatement le guide après votre inscription.',
      },
    ],
  })

  const handleDownload = () => {
    if (!hasAnalyticsConsent()) return

    trackGA4('lead_magnet_download', { source: 'thank_you_page' })
    void fetch('/api/track-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'lead_magnet_download',
        params: { source: 'thank_you_page' },
        analyticsConsent: true,
      }),
    }).catch((error) => console.warn('GA4 Measurement Protocol request failed:', error))
  }

  return (
    <Section tone="dark" className="min-h-[75vh] flex items-center pt-28 pb-20">
      <Container className="max-w-2xl text-center">
        <Eyebrow>Confirmation · Inscription réussie</Eyebrow>
        <Display as="h1" size="lg" className="mt-6 text-ivory">
          Merci pour votre confiance
        </Display>
        <Lead className="mt-6 text-ivory/80">
          Votre guide est prêt. Vous allez également recevoir un email de confirmation contenant votre lien permanent d'accès.
        </Lead>

        <div className="mt-10 rounded-2xl border border-gold/30 bg-ink-2 p-8 shadow-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-gold">Livrable exclusif</p>
          <h2 className="mt-3 font-display text-2xl text-ivory">Le Guide du Musicien Augmenté™</h2>
          <p className="mt-3 text-sm text-ivory/65 leading-relaxed">
            Méthodes, repères éthiques, hybridation MAO & IA, et préservation de l'identité artistique.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/lead-magnet.pdf"
              download="guide-musicien-augmente-herve-nanfang.pdf"
              onClick={handleDownload}
              className="inline-flex items-center justify-center rounded-xl bg-gold px-7 py-3 text-sm font-semibold uppercase tracking-wider text-ink transition-all hover:bg-gold-2 hover:shadow-[0_0_25px_rgba(198,161,91,0.35)]"
            >
              Télécharger le PDF maintenant ↓
            </a>
            <Btn to="/journal" variant="ghost">
              Découvrir le Journal →
            </Btn>
          </div>
        </div>

        <div className="mt-10 text-xs text-ivory/50">
          <p>Une question ou un projet particulier ? <a href="/contact" className="text-gold underline underline-offset-4">Écrire à Hervé Nanfang</a></p>
        </div>
      </Container>
    </Section>
  )
}
