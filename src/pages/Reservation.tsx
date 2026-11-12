import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PageHero from '../components/PageHero'
import {
  Body,
  Card,
  ChapterMark,
  Display,
  Eyebrow,
  Lead,
  Reveal,
  Rule,
  Section,
} from '../components/ui'
import {
  CONFERENCES,
  CONFERENCE_AUDIENCES,
  INTERVENTION_FORMATS,
} from '../data/conferences'
import { BOOKING_FRAMEWORK, PRESTIGE_VENUES, STAGE_FORMATS } from '../data/music'
import { SITE } from '../data/site'
import { breadcrumbSchema, personSchema, serviceSchema } from '../lib/schema'
import { useSeo } from '../lib/seo'
import { formatAttributionTag } from '../lib/utm-tracker'
import {
  trackContactMethodClick,
  trackFormStart,
  trackFormSubmitError,
  trackFormSubmitSuccess,
  trackFormView,
  trackLeadConversion,
} from '../lib/ad-pixels'

type ReservationTrack = 'booking' | 'formation' | 'conference' | 'conseil'

type TrackMeta = {
  id: ReservationTrack
  num: string
  badge: string
  title: string
  shortLabel: string
  summary: string
  deliverableHint: string
  exploreTo: string
  exploreLabel: string
  whatsappIntro: string
}

const RESERVATION_TRACKS: TrackMeta[] = [
  {
    id: 'booking',
    num: '01',
    badge: 'Prestation Live · Le Pianobariste™',
    title: 'Réserver une prestation musicale',
    shortLabel: 'Prestation live',
    summary:
      'Piano-bar hôtelier, dîner diplomatique, gala corporate ou cérémonie privée (Solo, Duo piano-voix ou Live Band).',
    deliverableHint: 'Proposition de répertoire sur mesure (+440 titres) & devis chiffré sous 48h ouvrées.',
    exploreTo: '/musique#pianobariste',
    exploreLabel: 'Voir les formules & le répertoire',
    whatsappIntro:
      'Bonjour Hervé Nanfang, je souhaite réserver une prestation musicale (Le Pianobariste™).',
  },
  {
    id: 'formation',
    num: '02',
    badge: 'Pédagogie · A Laiz Academy',
    title: 'Organiser une formation ou un cursus',
    shortLabel: 'Formation',
    summary:
      'Cursus individuel (Permis de Jouer™ N1–N4), atelier LES ZIKOS® ou programme institutionnel / entreprise.',
    deliverableHint: 'Cadrage pédagogique adapté au public (individuel, école, université ou équipe).',
    exploreTo: '/rma#candidature-audition',
    exploreLabel: 'Découvrir A Laiz Academy',
    whatsappIntro:
      'Bonjour Hervé Nanfang, je souhaite organiser une formation ou intégrer A Laiz Academy.',
  },
  {
    id: 'conference',
    num: '03',
    badge: 'Keynotes & Masterclasses',
    title: 'Inviter pour une conférence ou masterclass',
    shortLabel: 'Conférence',
    summary:
      'Intervention sur Le Musicien Augmenté™, l’IA musicale, la pédagogie ou la musicologie avec démonstration au piano.',
    deliverableHint: 'Programme détaillé, fiche technique salle et conditions d’intervention transmis sous 48h.',
    exploreTo: '/conferences',
    exploreLabel: 'Consulter les 6 conférences',
    whatsappIntro:
      'Bonjour Hervé Nanfang, nous souhaitons vous inviter pour une conférence ou masterclass.',
  },
  {
    id: 'conseil',
    num: '04',
    badge: 'Accompagnement · Musicien Augmenté™',
    title: 'Demander un accompagnement ou une production',
    shortLabel: 'Accompagnement & Studio',
    summary:
      'Conseil stratégique IA & musique, ingénierie du son, composition à l’image, direction artistique ou récit de marque.',
    deliverableHint: 'Premier cadrage méthodologique, calendrier de production et périmètre d’accompagnement.',
    exploreTo: '/services',
    exploreLabel: 'Voir le détail des services',
    whatsappIntro:
      'Bonjour Hervé Nanfang, je souhaite solliciter un accompagnement (Musicien Augmenté™ / Studio / Conseil).',
  },
]

const formatStageLabel = (sf: (typeof STAGE_FORMATS)[number]) => `${sf.title} — ${sf.subtitle}`

const FORMULA_BY_QUERY: Record<string, string> = {
  lounge: formatStageLabel(STAGE_FORMATS[0]),
  prestige: formatStageLabel(STAGE_FORMATS[1]),
  liveband: formatStageLabel(STAGE_FORMATS[2]),
}

const TRACK_LABELS: Record<ReservationTrack, string> = {
  booking: 'Prestation musicale (Le Pianobariste™)',
  formation: 'Formation & Pédagogie (A Laiz Academy)',
  conference: 'Conférence / Masterclass',
  conseil: 'Accompagnement professionnel (Musicien Augmenté™ / Studio)',
}

type ReservationForm = {
  track: ReservationTrack
  name: string
  email: string
  phone: string
  organization: string
  date: string
  place: string
  bookingEventType: string
  bookingFormat: string
  guestsRange: string
  formationMode: string
  formationDiscipline: string
  conferenceTheme: string
  conferenceFormat: string
  conferenceAudience: string
  conseilDomain: string
  message: string
  consent: boolean
  honey: string
}

const INITIAL_FORM: ReservationForm = {
  track: 'booking',
  name: '',
  email: '',
  phone: '',
  organization: '',
  date: '',
  place: '',
  bookingEventType: 'Hôtel / Lounge / Réception VIP',
  bookingFormat: formatStageLabel(STAGE_FORMATS[0]),
  guestsRange: '50 à 150 personnes',
  formationMode: 'Parcours individuel (Permis de Jouer™ N1–N4)',
  formationDiscipline: 'Piano & Harmonie appliquée',
  conferenceTheme: CONFERENCES[0].title,
  conferenceFormat: INTERVENTION_FORMATS[0].label,
  conferenceAudience: CONFERENCE_AUDIENCES[0],
  conseilDomain: 'Intégration IA & workflow Musicien Augmenté™',
  message: '',
  consent: false,
  honey: '',
}

function buildRecapLines(form: ReservationForm): string[] {
  const lines: string[] = [`Parcours sélectionné : ${TRACK_LABELS[form.track]}`]
  if (form.track === 'booking') {
    if (form.bookingEventType) lines.push(`Contexte : ${form.bookingEventType}`)
    if (form.bookingFormat) lines.push(`Format scénique : ${form.bookingFormat}`)
    if (form.guestsRange) lines.push(`Jauge estimée : ${form.guestsRange}`)
  } else if (form.track === 'formation') {
    if (form.formationMode) lines.push(`Modalité : ${form.formationMode}`)
    if (form.formationDiscipline) lines.push(`Discipline / Programme : ${form.formationDiscipline}`)
  } else if (form.track === 'conference') {
    if (form.conferenceTheme) lines.push(`Thématique : ${form.conferenceTheme}`)
    if (form.conferenceFormat) lines.push(`Format souhaité : ${form.conferenceFormat}`)
    if (form.conferenceAudience) lines.push(`Public attendu : ${form.conferenceAudience}`)
  } else {
    if (form.conseilDomain) lines.push(`Domaine d’accompagnement : ${form.conseilDomain}`)
  }
  if (form.organization) lines.push(`Structure / Établissement : ${form.organization}`)
  if (form.date) lines.push(`Date ou période envisagée : ${form.date}`)
  if (form.place) lines.push(`Ville / Lieu : ${form.place}`)
  return lines
}

export default function Reservation() {
  const location = useLocation()
  const [form, setForm] = useState<ReservationForm>(INITIAL_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const rawTrack = (params.get('type') || params.get('sujet') || params.get('subject') || '').toLowerCase()
    const hash = location.hash.replace('#', '').toLowerCase()
    const formula = params.get('formula')?.toLowerCase()
    const themeParam = params.get('theme')
    const formatParam = params.get('format')

    const validTracks: ReservationTrack[] = ['booking', 'formation', 'conference', 'conseil']
    let resolvedTrack: ReservationTrack = 'booking'
    if (validTracks.includes(rawTrack as ReservationTrack)) {
      resolvedTrack = rawTrack as ReservationTrack
    } else if (validTracks.includes(hash as ReservationTrack)) {
      resolvedTrack = hash as ReservationTrack
    }

    const formulaValue = formula && FORMULA_BY_QUERY[formula] ? FORMULA_BY_QUERY[formula] : ''
    const matchedTheme = themeParam
      ? CONFERENCES.find((c) => c.title === themeParam || c.id === themeParam)?.title ||
        'Thématique sur mesure'
      : ''
    const matchedFormat = formatParam
      ? INTERVENTION_FORMATS.find((f) => f.label === formatParam || f.id === formatParam)?.label || ''
      : ''

    setForm((prev) => ({
      ...prev,
      track: resolvedTrack,
      bookingFormat: formulaValue || prev.bookingFormat,
      conferenceTheme: matchedTheme || prev.conferenceTheme,
      conferenceFormat: matchedFormat || prev.conferenceFormat,
    }))
    trackFormView('reservation_form', resolvedTrack)
  }, [location.search, location.hash])

  useSeo({
    title: 'Réservation & Demande d’intervention | Hervé Nanfang',
    description:
      'Réserver Le Pianobariste™ en live, organiser une formation A Laiz Academy, inviter une conférence Musicien Augmenté™ ou demander un accompagnement.',
    path: '/reservation',
    jsonLd: [
      personSchema,
      serviceSchema(
        'Réservation & Demande d’intervention — Hervé Nanfang',
        'Système de réservation directe pour prestations musicales (Le Pianobariste™), formations (A Laiz Academy), conférences académiques et accompagnement professionnel.',
        'Cameroun, Afrique centrale & International',
      ),
      breadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Réservation', path: '/reservation' },
      ]),
    ],
  })

  const currentTrackMeta = useMemo(
    () => RESERVATION_TRACKS.find((t) => t.id === form.track) ?? RESERVATION_TRACKS[0],
    [form.track],
  )

  const recapLines = useMemo(() => buildRecapLines(form), [form])

  const whatsappUrl = useMemo(() => {
    const primaryPhone = SITE.phones[0]
    const payload = [
      currentTrackMeta.whatsappIntro,
      ...recapLines,
      form.name ? `Contact : ${form.name}` : '',
      form.email ? `Email : ${form.email}` : '',
      form.phone ? `Téléphone : ${form.phone}` : '',
      form.message ? `\nPrécisions :\n${form.message}` : '',
    ]
      .filter(Boolean)
      .join('\n')
    return `https://wa.me/${primaryPhone.whatsapp}?text=${encodeURIComponent(payload)}`
  }, [currentTrackMeta.whatsappIntro, form.email, form.message, form.name, form.phone, recapLines])

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (form.name.trim().length < 2) e.name = 'Veuillez indiquer votre nom complet.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      e.email = 'Veuillez saisir une adresse email valide.'
    }
    if (form.message.trim().length < 10) {
      e.message = 'Merci de préciser votre contexte en quelques mots (10 caractères minimum).'
    }
    if (!form.consent) {
      e.consent = 'Merci d’accepter le traitement de votre demande pour être recontacté.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (sending) return
    if (form.honey) return
    if (!validate()) return

    setSending(true)
    setSendError('')

    const tag = formatAttributionTag()
    const bodyLines = [
      ...recapLines,
      '',
      form.message.trim(),
      tag ? `\n${tag}` : '',
    ]
      .filter((l) => l !== undefined)
      .join('\n')
      .trim()

    const { adminStore } = await import('../lib/admin-store')
    const res = await adminStore.addIncomingMessage({
      name: form.name.trim(),
      email: form.email.trim(),
      organization: form.organization.trim() || undefined,
      phone: form.phone.trim() || undefined,
      route: form.track,
      eventDate: form.date.trim() || undefined,
      place: form.place.trim() || undefined,
      body: bodyLines,
    })

    setSending(false)
    if (!res.ok) {
      trackFormSubmitError('reservation_form', res.error || 'submission_failed')
      setSendError(res.error || 'Enregistrement impossible pour le moment. Utilisez le bouton WhatsApp ci-dessous.')
      return
    }

    trackFormSubmitSuccess('reservation_form', form.track)
    trackLeadConversion('contact', { route: form.track, interest: currentTrackMeta.shortLabel })
    setSubmitted(true)
  }

  return (
    <>
      <PageHero
        breadcrumb="Réservation"
        eyebrow="Booking · Formation · Conférence · Conseil"
        title={
          <>
            Réserver une <span className="italic text-gold">intervention</span> ou un format
          </>
        }
        lead="Sélectionnez le domaine concerné, précisez votre date et votre contexte : recevez une réponse structurée et chiffrée sous 48 heures ouvrées."
      >
        <p className="mt-6 text-xs leading-relaxed text-ivory/65">
          Besoin presse, partenariat éditorial ou dossier EPK ? Utilisez la{' '}
          <Link to="/contact" className="text-gold hover:underline">
            page Contact général
          </Link>
          .
        </p>
      </PageHero>

      {/* ========================= PARCOURS DE RÉSERVATION ========================= */}
      <Section tone="dark" id="configurateur">
        <Reveal>
          <ChapterMark num="01" label="1. Choisir le type de demande" />
          <div
            role="tablist"
            aria-label="Type de réservation"
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {RESERVATION_TRACKS.map((track) => {
              const active = form.track === track.id
              return (
                <button
                  key={track.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setForm((f) => ({ ...f, track: track.id }))
                    setSubmitted(false)
                    setErrors({})
                    trackFormStart('reservation_form', track.id)
                  }}
                  className={`flex flex-col justify-between border p-5 text-left transition-all ${
                    active
                      ? 'border-gold bg-ink shadow-[0_0_24px_rgba(198,161,91,0.16)]'
                      : 'border-white/10 bg-ink/50 hover:border-gold/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-gold">
                        {track.num}
                      </span>
                      <span
                        className={`h-2 w-2 rounded-full ${active ? 'bg-gold' : 'bg-white/15'}`}
                        aria-hidden="true"
                      />
                    </div>
                    <h2 className="mt-3 font-display text-xl leading-snug text-ivory">
                      {track.shortLabel}
                    </h2>
                    <p className="mt-2 text-xs leading-relaxed text-ivory/65">{track.summary}</p>
                  </div>
                  <p className="mt-4 pt-3 border-t border-white/10 text-[0.65rem] uppercase tracking-[0.16em] text-gold">
                    {active ? 'Sélectionné ✓' : 'Choisir ce parcours →'}
                  </p>
                </button>
              )
            })}
          </div>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          {/* COLONNE GAUCHE : FORMULAIRE GUIDÉ */}
          <div>
            <Reveal>
              <ChapterMark num="02" label="2. Préciser votre besoin" />
              <div className="mt-5 flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <Eyebrow>{currentTrackMeta.badge}</Eyebrow>
                  <Display size="md" className="mt-2">
                    {currentTrackMeta.title}
                  </Display>
                </div>
                <Link
                  to={currentTrackMeta.exploreTo}
                  className="text-xs font-semibold uppercase tracking-[0.16em] text-gold hover:underline"
                >
                  {currentTrackMeta.exploreLabel} →
                </Link>
              </div>
              <Lead className="mt-4">{currentTrackMeta.deliverableHint}</Lead>
            </Reveal>

            {submitted ? (
              <div className="mt-8 border border-gold/50 bg-ink p-8 md:p-10">
                <Eyebrow>Demande enregistrée</Eyebrow>
                <h3 className="mt-3 font-display text-2xl text-ivory">
                  Votre demande de {currentTrackMeta.shortLabel.toLowerCase()} est bien transmise.
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-ivory/75">
                  Merci {form.name}. Votre demande est enregistrée avec son cadrage complet. Vous recevrez une réponse personnalisée sous 48 heures ouvrées à l’adresse{' '}
                  <strong className="text-ivory">{form.email}</strong>.
                </p>

                <div className="mt-6 border border-white/10 bg-ink-2 p-5">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-gold">
                    Récapitulatif transmis
                  </p>
                  <ul className="mt-3 space-y-1.5 text-xs text-ivory/75">
                    {recapLines.map((line) => (
                      <li key={line}>· {line}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7 flex flex-wrap gap-4">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackContactMethodClick('whatsapp', 'reservation_post_submit')}
                    className="btn btn-gold"
                  >
                    Doubler par WhatsApp (urgence) ↗
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ ...INITIAL_FORM, track: form.track })
                      setSubmitted(false)
                    }}
                    className="btn btn-ghost"
                  >
                    Faire une nouvelle demande
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                noValidate
                onFocus={() => trackFormStart('reservation_form', form.track)}
                className="mt-8 space-y-6 border border-white/10 bg-ink p-6 md:p-9"
              >
                {/* Piège anti-spam */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="res-company-honey">Ne pas remplir</label>
                  <input
                    id="res-company-honey"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.honey}
                    onChange={(e) => setForm((f) => ({ ...f, honey: e.target.value }))}
                  />
                </div>

                {/* Paramètres adaptatifs du parcours */}
                {form.track === 'booking' && (
                  <div className="grid gap-5 sm:grid-cols-2 border-b border-white/10 pb-6">
                    <div>
                      <label htmlFor="res-event-type" className="block text-[0.68rem] uppercase tracking-[0.18em] text-ivory/65">
                        Type d’événement
                      </label>
                      <select
                        id="res-event-type"
                        value={form.bookingEventType}
                        onChange={(e) => setForm((f) => ({ ...f, bookingEventType: e.target.value }))}
                        className="mt-2 w-full border border-white/15 bg-ink-2 px-4 py-3 text-sm text-ivory focus:border-gold focus:outline-none"
                      >
                        <option>Hôtel / Lounge / Réception VIP</option>
                        <option>Réception diplomatique / Dîner d’État</option>
                        <option>Soirée corporate / Gala d’entreprise</option>
                        <option>Mariage / Cérémonie privée</option>
                        <option>Concert / Festival / Événement culturel</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="res-booking-format" className="block text-[0.68rem] uppercase tracking-[0.18em] text-ivory/65">
                        Format souhaité
                      </label>
                      <select
                        id="res-booking-format"
                        value={form.bookingFormat}
                        onChange={(e) => setForm((f) => ({ ...f, bookingFormat: e.target.value }))}
                        className="mt-2 w-full border border-white/15 bg-ink-2 px-4 py-3 text-sm text-ivory focus:border-gold focus:outline-none"
                      >
                        {STAGE_FORMATS.map((sf) => {
                          const label = formatStageLabel(sf)
                          return (
                            <option key={sf.id} value={label}>
                              {label}
                            </option>
                          )
                        })}
                        <option value="Format sur mesure à définir ensemble">Format sur mesure à définir ensemble</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="res-guests" className="block text-[0.68rem] uppercase tracking-[0.18em] text-ivory/65">
                        Jauge estimée & équipement du lieu
                      </label>
                      <input
                        id="res-guests"
                        type="text"
                        value={form.guestsRange}
                        onChange={(e) => setForm((f) => ({ ...f, guestsRange: e.target.value }))}
                        placeholder="Ex. 120 invités · piano acoustique sur place ou régie autonome demandée"
                        className="mt-2 w-full border border-white/15 bg-ink-2 px-4 py-3 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {form.track === 'formation' && (
                  <div className="grid gap-5 sm:grid-cols-2 border-b border-white/10 pb-6">
                    <div>
                      <label htmlFor="res-form-mode" className="block text-[0.68rem] uppercase tracking-[0.18em] text-ivory/65">
                        Modalité pédagogique
                      </label>
                      <select
                        id="res-form-mode"
                        value={form.formationMode}
                        onChange={(e) => setForm((f) => ({ ...f, formationMode: e.target.value }))}
                        className="mt-2 w-full border border-white/15 bg-ink-2 px-4 py-3 text-sm text-ivory focus:border-gold focus:outline-none"
                      >
                        <option>Parcours individuel (Permis de Jouer™ N1–N4)</option>
                        <option>Atelier collectif / Programme Vacances Utiles</option>
                        <option>Formation en établissement (école, université, institut)</option>
                        <option>Formation de formateurs / Refonte de curriculum</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="res-form-disc" className="block text-[0.68rem] uppercase tracking-[0.18em] text-ivory/65">
                        Discipline / Programme
                      </label>
                      <select
                        id="res-form-disc"
                        value={form.formationDiscipline}
                        onChange={(e) => setForm((f) => ({ ...f, formationDiscipline: e.target.value }))}
                        className="mt-2 w-full border border-white/15 bg-ink-2 px-4 py-3 text-sm text-ivory focus:border-gold focus:outline-none"
                      >
                        <option>Piano & Harmonie appliquée</option>
                        <option>Chant, Technique vocale & Interprétation</option>
                        <option>Formation musicale (LES ZIKOS®) & Oreille</option>
                        <option>MAO, Sonorisation & Musicien Augmenté™</option>
                        <option>Parcours multi-disciplinaire sur mesure</option>
                      </select>
                    </div>
                  </div>
                )}

                {form.track === 'conference' && (
                  <div className="grid gap-5 sm:grid-cols-2 border-b border-white/10 pb-6">
                    <div className="sm:col-span-2">
                      <label htmlFor="res-conf-theme" className="block text-[0.68rem] uppercase tracking-[0.18em] text-ivory/65">
                        Thématique pressentie
                      </label>
                      <select
                        id="res-conf-theme"
                        value={form.conferenceTheme}
                        onChange={(e) => setForm((f) => ({ ...f, conferenceTheme: e.target.value }))}
                        className="mt-2 w-full border border-white/15 bg-ink-2 px-4 py-3 text-sm text-ivory focus:border-gold focus:outline-none"
                      >
                        {CONFERENCES.map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title}
                          </option>
                        ))}
                        <option value="Thématique sur mesure">Autre thématique sur mesure</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="res-conf-format" className="block text-[0.68rem] uppercase tracking-[0.18em] text-ivory/65">
                        Format d’intervention
                      </label>
                      <select
                        id="res-conf-format"
                        value={form.conferenceFormat}
                        onChange={(e) => setForm((f) => ({ ...f, conferenceFormat: e.target.value }))}
                        className="mt-2 w-full border border-white/15 bg-ink-2 px-4 py-3 text-sm text-ivory focus:border-gold focus:outline-none"
                      >
                        {INTERVENTION_FORMATS.map((f) => (
                          <option key={f.id} value={f.label}>
                            {f.label} ({f.duration})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="res-conf-audience" className="block text-[0.68rem] uppercase tracking-[0.18em] text-ivory/65">
                        Public cible
                      </label>
                      <select
                        id="res-conf-audience"
                        value={form.conferenceAudience}
                        onChange={(e) => setForm((f) => ({ ...f, conferenceAudience: e.target.value }))}
                        className="mt-2 w-full border border-white/15 bg-ink-2 px-4 py-3 text-sm text-ivory focus:border-gold focus:outline-none"
                      >
                        {CONFERENCE_AUDIENCES.map((aud) => (
                          <option key={aud} value={aud}>
                            {aud}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {form.track === 'conseil' && (
                  <div className="border-b border-white/10 pb-6">
                    <label htmlFor="res-conseil-domain" className="block text-[0.68rem] uppercase tracking-[0.18em] text-ivory/65">
                      Nature de l’accompagnement recherché
                    </label>
                    <select
                      id="res-conseil-domain"
                      value={form.conseilDomain}
                      onChange={(e) => setForm((f) => ({ ...f, conseilDomain: e.target.value }))}
                      className="mt-2 w-full border border-white/15 bg-ink-2 px-4 py-3 text-sm text-ivory focus:border-gold focus:outline-none"
                    >
                      <option>Intégration IA & workflow Musicien Augmenté™</option>
                      <option>Production musicale, arrangement, mixage ou mastering</option>
                      <option>Composition originale & musique à l’image (cinéma / média)</option>
                      <option>Conseil stratégique, récit de marque & structuration de projet</option>
                      <option>Étude acoustique / équipement studio ou régie</option>
                    </select>
                  </div>
                )}

                {/* Coordonnées & logistique communes */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="res-name" className="block text-[0.68rem] uppercase tracking-[0.18em] text-ivory/65">
                      Nom et prénom <span className="text-gold">*</span>
                    </label>
                    <input
                      id="res-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'res-err-name' : undefined}
                      placeholder="Votre nom complet"
                      className="mt-2 w-full border border-white/15 bg-ink-2 px-4 py-3 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none"
                    />
                    {errors.name && (
                      <p id="res-err-name" className="mt-1.5 text-xs text-red-400">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="res-email" className="block text-[0.68rem] uppercase tracking-[0.18em] text-ivory/65">
                      Email professionnel ou personnel <span className="text-gold">*</span>
                    </label>
                    <input
                      id="res-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'res-err-email' : undefined}
                      placeholder="nom@organisation.org"
                      className="mt-2 w-full border border-white/15 bg-ink-2 px-4 py-3 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none"
                    />
                    {errors.email && (
                      <p id="res-err-email" className="mt-1.5 text-xs text-red-400">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="res-phone" className="block text-[0.68rem] uppercase tracking-[0.18em] text-ivory/65">
                      Téléphone / WhatsApp
                    </label>
                    <input
                      id="res-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="+237 ..."
                      className="mt-2 w-full border border-white/15 bg-ink-2 px-4 py-3 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="res-org" className="block text-[0.68rem] uppercase tracking-[0.18em] text-ivory/65">
                      Organisation / Établissement
                    </label>
                    <input
                      id="res-org"
                      type="text"
                      value={form.organization}
                      onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))}
                      placeholder="Hôtel, université, entreprise ou particulier"
                      className="mt-2 w-full border border-white/15 bg-ink-2 px-4 py-3 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="res-date" className="block text-[0.68rem] uppercase tracking-[0.18em] text-ivory/65">
                      Date ou période souhaitée
                    </label>
                    <input
                      id="res-date"
                      type="text"
                      value={form.date}
                      onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                      placeholder="Ex. 18 octobre 2026 ou Novembre"
                      className="mt-2 w-full border border-white/15 bg-ink-2 px-4 py-3 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="res-place" className="block text-[0.68rem] uppercase tracking-[0.18em] text-ivory/65">
                      Ville / Lieu (ou en ligne)
                    </label>
                    <input
                      id="res-place"
                      type="text"
                      value={form.place}
                      onChange={(e) => setForm((f) => ({ ...f, place: e.target.value }))}
                      placeholder="Yaoundé, Douala, Kribi, Paris, Visio..."
                      className="mt-2 w-full border border-white/15 bg-ink-2 px-4 py-3 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="res-message" className="block text-[0.68rem] uppercase tracking-[0.18em] text-ivory/65">
                    Détails du besoin, contexte et objectifs <span className="text-gold">*</span>
                  </label>
                  <textarea
                    id="res-message"
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'res-err-msg' : undefined}
                    placeholder="Précisez l'horaire souhaité, le public, vos attentes artistiques ou pédagogiques, et toute contrainte technique particulière..."
                    className="mt-2 w-full border border-white/15 bg-ink-2 px-4 py-3 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none"
                  />
                  {errors.message && (
                    <p id="res-err-msg" className="mt-1.5 text-xs text-red-400">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-start gap-3 text-xs leading-relaxed text-ivory/75 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
                      className="mt-0.5 h-4 w-4 accent-gold"
                    />
                    <span>
                      J’accepte que ces informations soient utilisées pour traiter ma demande et préparer une proposition adaptée (
                      <Link to="/confidentialite" className="text-gold hover:underline">
                        politique de confidentialité
                      </Link>
                      ).
                    </span>
                  </label>
                  {errors.consent && <p className="mt-1.5 text-xs text-red-400">{errors.consent}</p>}
                </div>

                {sendError && (
                  <div className="border border-red-500/40 bg-red-950/30 p-4 text-xs text-red-200">
                    {sendError}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button type="submit" disabled={sending} className="btn btn-gold">
                    {sending ? 'Envoi en cours…' : 'Envoyer la demande de réservation →'}
                  </button>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackContactMethodClick('whatsapp', 'reservation_form')}
                    className="btn btn-ghost"
                  >
                    Pré-remplir sur WhatsApp ↗
                  </a>
                </div>
              </form>
            )}
          </div>

          {/* COLONNE DROITE : RÉCAPITULATIF & RÉASSURANCE */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <Card className="border-gold/30 bg-ink">
              <Eyebrow>Synthèse en direct</Eyebrow>
              <h3 className="mt-2 font-display text-2xl text-ivory">{currentTrackMeta.shortLabel}</h3>
              <ul className="mt-4 space-y-2 border-t border-white/10 pt-4 text-xs leading-relaxed text-ivory/75">
                {recapLines.map((line) => (
                  <li key={line}>· {line}</li>
                ))}
              </ul>
              <Rule className="my-5" />
              <p className="text-xs leading-relaxed text-ivory/65">
                Besoin d’un échange immédiat ? Appelez directement ou envoyez ce récapitulatif sur WhatsApp.
              </p>
              <div className="mt-4 space-y-2 text-xs">
                {SITE.phones.map((phone) => (
                  <div key={phone.tel} className="flex items-center justify-between gap-2">
                    <a href={`tel:${phone.tel}`} className="text-ivory/80 hover:text-gold">
                      {phone.display}
                    </a>
                    <a
                      href={`https://wa.me/${phone.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[0.65rem] font-semibold uppercase tracking-wider text-emerald-400 hover:underline"
                    >
                      WhatsApp ↗
                    </a>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-ink">
              <Eyebrow>Cadre opérationnel & technique</Eyebrow>
              <ul className="mt-4 space-y-3 text-xs leading-relaxed text-ivory/70">
                {BOOKING_FRAMEWORK.delays.map((item) => (
                  <li key={item.label} className="border-b border-white/8 pb-2.5 last:border-0 last:pb-0">
                    <span className="block font-semibold text-gold">{item.label}</span>
                    <span className="mt-0.5 block text-ivory/70">{item.value}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="bg-ink">
              <Eyebrow>Références scéniques vérifiées</Eyebrow>
              <Body className="mt-2 text-xs">
                Interventions régulières dans les lieux de référence et établissements supérieurs :
              </Body>
              <div className="mt-4 flex flex-wrap gap-2">
                {PRESTIGE_VENUES.slice(0, 5).map((v) => (
                  <span
                    key={v.name}
                    className="border border-white/10 bg-ink-2 px-2.5 py-1 text-[0.65rem] text-ivory/75"
                  >
                    {v.name}
                  </span>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  )
}
