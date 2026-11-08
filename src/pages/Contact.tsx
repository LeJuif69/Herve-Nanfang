import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PageHero from '../components/PageHero'
import PressKit from '../components/PressKit'
import SocialButtons from '../components/SocialButtons'
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
  Stat,
} from '../components/ui'
import { CONTACT_ROUTES, SITE } from '../data/site'
import { breadcrumbSchema, personSchema, serviceSchema } from '../lib/schema'
import { useSeo } from '../lib/seo'
import { adminStore } from '../lib/admin-store'
import { formatAttributionTag } from '../lib/utm-tracker'
import {
  trackContactMethodClick,
  trackFormStart,
  trackFormSubmitError,
  trackFormSubmitSuccess,
  trackFormView,
  trackLeadConversion,
} from '../lib/ad-pixels'

type FormState = {
  name: string
  email: string
  organization: string
  phone: string
  route: string
  date: string
  place: string
  // Champs adaptatifs selon la catégorie choisie
  eventType: string
  desiredFormat: string
  audience: string
  discipline: string
  period: string
  conferenceTheme: string
  consultingDomain: string
  consultingGoal: string
  message: string
  consent: boolean
  honey: string
}

const EMPTY: FormState = {
  name: '',
  email: '',
  organization: '',
  phone: '',
  route: 'booking',
  date: '',
  place: '',
  eventType: '',
  desiredFormat: '',
  audience: '',
  discipline: '',
  period: '',
  conferenceTheme: '',
  consultingDomain: '',
  consultingGoal: '',
  message: '',
  consent: false,
  honey: '',
}

const PRIMARY_ROUTE_IDS = ['booking', 'formation', 'conference', 'conseil'] as const
const SECONDARY_ROUTE_IDS = ['presse', 'collaboration'] as const

const ROUTE_PRIORITY_META: Record<
  string,
  { badge: string; title: string; subtitle: string; defaultWhatsappIntro: string }
> = {
  booking: {
    badge: 'Offre 01 · Le Pianobariste™',
    title: 'Prestation musicale',
    subtitle: 'Piano-bar live, concert, réception diplomatique, gala ou mariage',
    defaultWhatsappIntro:
      'Bonjour Hervé Nanfang, je souhaite réserver une prestation musicale (Le Pianobariste™).',
  },
  formation: {
    badge: 'Offre 02 · A Laiz Academy',
    title: 'Formation & Pédagogie',
    subtitle: 'Cursus piano/chant/MAO, Permis de Jouer™ ou intervention en établissement',
    defaultWhatsappIntro:
      'Bonjour Hervé Nanfang, je souhaite organiser une formation ou rejoindre un cursus A Laiz Academy.',
  },
  conference: {
    badge: 'Offre 03 · Conférences & Masterclasses',
    title: 'Conférence ou Intervention',
    subtitle: 'Keynote, masterclass ou séminaire (Musicien Augmenté™, IA, musicologie)',
    defaultWhatsappIntro:
      'Bonjour Hervé Nanfang, nous souhaitons vous inviter pour une conférence ou une intervention.',
  },
  conseil: {
    badge: 'Offre 04 · Musicien Augmenté™',
    title: 'Accompagnement professionnel',
    subtitle: 'Conseil IA, direction artistique, production sonore & stratégie de marque',
    defaultWhatsappIntro:
      'Bonjour Hervé Nanfang, je souhaite solliciter un accompagnement professionnel.',
  },
  presse: {
    badge: 'Parcours secondaire · Médias',
    title: 'Presse & Interview',
    subtitle: 'Interview, citation d’expert, podcast, télévision ou dossier de presse',
    defaultWhatsappIntro:
      'Bonjour Hervé Nanfang, je vous contacte pour une sollicitation presse / média.',
  },
  collaboration: {
    badge: 'Parcours secondaire · Partenariats',
    title: 'Partenariat & Collaboration',
    subtitle: 'Co-création artistique, recherche patrimoniale (Tswefap), édition ou projet culturel',
    defaultWhatsappIntro:
      'Bonjour Hervé Nanfang, je souhaite vous proposer un partenariat ou une collaboration culturelle.',
  },
}

const ROUTE_LABELS: Record<string, string> = Object.fromEntries(
  CONTACT_ROUTES.map((r) => [r.id, ROUTE_PRIORITY_META[r.id]?.title || r.label]),
)

const FORMULA_LABELS: Record<string, string> = {
  lounge: 'Formule Solo — Piano & Voix (Lounge / Réception)',
  prestige: 'Formule Duo — Piano & Chant (Prestige)',
  liveband: 'Formule Live Band — Orchestre complet',
}

const BOOKING_EVENT_TYPES = [
  'Hôtel de prestige / Lounge',
  'Réception diplomatique / Dîner officiel',
  'Soirée corporate / Gala d’entreprise',
  'Mariage / Cérémonie privée',
  'Concert / Festival / Événement culturel',
  'Autre événement sur mesure',
]

const BOOKING_FORMATS = [
  'Formule Solo — Piano & Voix (Lounge / Réception)',
  'Formule Duo — Piano & Chant (Prestige)',
  'Formule Live Band — Orchestre complet',
  'À conseiller selon le lieu et le nombre d’invités',
]

const FORMATION_AUDIENCES = [
  'École supérieure / Université / Conservatoire',
  'Organisation culturelle / Entreprise / Studio',
  'Adulte / Musicien en perfectionnement',
  'Enfant / Jeune apprenant (A Laiz Academy)',
  'Groupe d’enseignants / Formateurs',
]

const FORMATION_DISCIPLINES = [
  'Piano, accompagnement & harmonie pratique',
  'MAO, prise de son & production musicale',
  'Référentiel Permis de Jouer™ (Paliers N1 à N4)',
  'Conception de curricula & ingénierie pédagogique',
  'Chant, pulsation & pratique collective (LES ZIKOS®)',
  'IA appliquée à l’enseignement musical',
]

const CONFERENCE_THEMES = [
  'Musicien Augmenté™ : intégrer l’IA sans perdre son identité artistique',
  'Après la MAO, l’IA : mutations des métiers de la musique',
  'IA & Pédagogie musicale : former sans déshumaniser',
  'Musicologie africaine, patrimoine & technologies numériques',
  'Musique à l’image, cinéma & narration sonore',
  'Thématique sur mesure pour votre événement',
]

const CONFERENCE_AUDIENCES = [
  'Étudiants, enseignants & chercheurs (Université / Grande école)',
  'Professionnels de la musique et de la culture',
  'Dirigeants, décideurs & institutions',
  'Grand public / Festival / Salon professionnel',
]

const CONSEIL_DOMAINS = [
  'Intégration IA & Workflows Musicien Augmenté™',
  'Direction artistique, arrangement & production sonore (MAO)',
  'Stratégie de marque culturelle & communication digitale',
  'Structuration d’académie, de programme ou d’ouvrage pédagogique',
]

const CONSEIL_GOALS = [
  'Structurer ou lancer un projet artistique / culturel',
  'Adopter des outils IA éthiques et performants au quotidien',
  'Produire, arranger ou réaliser une œuvre sonore / musique à l’image',
  'Clarifier le positionnement et le récit de marque d’un artiste ou organisme',
]

function buildContextualSummary(form: FormState): string[] {
  const lines: string[] = []
  if (form.route === 'booking') {
    if (form.eventType) lines.push(`Type d’événement : ${form.eventType}`)
    if (form.desiredFormat) lines.push(`Format souhaité : ${form.desiredFormat}`)
    if (form.date) lines.push(`Date envisagée : ${form.date}`)
    if (form.place) lines.push(`Ville / Lieu : ${form.place}`)
  } else if (form.route === 'formation') {
    if (form.organization) lines.push(`Établissement / Organisation : ${form.organization}`)
    if (form.audience) lines.push(`Public concerné : ${form.audience}`)
    if (form.discipline) lines.push(`Discipline : ${form.discipline}`)
    if (form.period) lines.push(`Période souhaitée : ${form.period}`)
    if (form.place) lines.push(`Ville / Modalité : ${form.place}`)
  } else if (form.route === 'conference') {
    if (form.organization) lines.push(`Organisme : ${form.organization}`)
    if (form.conferenceTheme) lines.push(`Thématique : ${form.conferenceTheme}`)
    if (form.audience) lines.push(`Public attendu : ${form.audience}`)
    if (form.date) lines.push(`Date envisagée : ${form.date}`)
    if (form.place) lines.push(`Ville / Format : ${form.place}`)
  } else if (form.route === 'conseil') {
    if (form.consultingDomain) lines.push(`Domaine d’intervention : ${form.consultingDomain}`)
    if (form.consultingGoal) lines.push(`Objectif : ${form.consultingGoal}`)
    if (form.organization) lines.push(`Structure / Projet : ${form.organization}`)
    if (form.place) lines.push(`Ville / Pays : ${form.place}`)
  } else {
    if (form.organization) lines.push(`Média / Structure : ${form.organization}`)
    if (form.date) lines.push(`Date / Échéance : ${form.date}`)
    if (form.place) lines.push(`Lieu / Pays : ${form.place}`)
  }
  return lines
}

export default function Contact() {
  const location = useLocation()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [selectedFormula, setSelectedFormula] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')

  useEffect(() => {
    let currentRoute = 'booking'
    const params = new URLSearchParams(location.search)
    const sujet = params.get('sujet')?.toLowerCase()
    const formula = params.get('formula')?.toLowerCase()
    const themeParam = params.get('theme')
    const hash = location.hash.replace('#', '').toLowerCase()

    if (sujet && CONTACT_ROUTES.some((r) => r.id === sujet)) {
      currentRoute = sujet
    } else if (hash && CONTACT_ROUTES.some((r) => r.id === hash)) {
      currentRoute = hash
    } else if (formula) {
      currentRoute = 'booking'
    }

    const formulaLabel = formula && FORMULA_LABELS[formula] ? FORMULA_LABELS[formula] : ''
    setSelectedFormula(formulaLabel)

    setForm((f) => ({
      ...f,
      route: currentRoute,
      desiredFormat: formulaLabel || f.desiredFormat,
      conferenceTheme: themeParam || f.conferenceTheme,
      message:
        formulaLabel && !f.message
          ? `Format souhaité : ${formulaLabel}.\nContexte de l'événement, date et lieu envisagés : `
          : f.message,
    }))
    trackFormView('contact_form', currentRoute)
  }, [location.hash, location.search])

  useSeo({
    title: 'Contact | Hervé Nanfang — Prestation, Formation, Conférence & Conseil',
    description:
      'Prestation live Le Pianobariste™, formation A Laiz Academy, conférence ou accompagnement Musicien Augmenté™ : contactez directement Hervé Nanfang.',
    path: '/contact',
    jsonLd: [
      personSchema,
      serviceSchema(
        'Booking, formation, conférences et accompagnement',
        'Prestations live Le Pianobariste™, formations A Laiz Academy, conférences institutionnelles et accompagnement Musicien Augmenté™.',
        'Services culturels et musicaux',
      ),
      breadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Contact', path: '/contact' },
      ]),
    ],
  })

  const selected = useMemo(
    () => CONTACT_ROUTES.find((r) => r.id === form.route) ?? CONTACT_ROUTES[0],
    [form.route],
  )

  const selectedMeta = ROUTE_PRIORITY_META[form.route] ?? ROUTE_PRIORITY_META.booking

  const primaryRoutes = useMemo(
    () =>
      PRIMARY_ROUTE_IDS.map((id) => CONTACT_ROUTES.find((r) => r.id === id)).filter(
        Boolean,
      ) as typeof CONTACT_ROUTES,
    [],
  )

  const secondaryRoutes = useMemo(
    () =>
      SECONDARY_ROUTE_IDS.map((id) => CONTACT_ROUTES.find((r) => r.id === id)).filter(
        Boolean,
      ) as typeof CONTACT_ROUTES,
    [],
  )

  const whatsappHrefs = useMemo(() => {
    const contextLines = buildContextualSummary(form)
    const message = [
      selectedMeta.defaultWhatsappIntro,
      `Motif : ${ROUTE_LABELS[form.route] || selected.label}`,
      form.name ? `Nom : ${form.name}` : '',
      form.email ? `Email : ${form.email}` : '',
      form.phone ? `Téléphone : ${form.phone}` : '',
      ...contextLines,
      form.message ? `\nPrécisions :\n${form.message}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    return SITE.phones.map((phone) => ({
      display: phone.display,
      href: `https://wa.me/${phone.whatsapp}?text=${encodeURIComponent(message)}`,
    }))
  }, [form, selected.label, selectedMeta.defaultWhatsappIntro])

  function validate() {
    const e: Record<string, string> = {}
    if (form.name.trim().length < 2) e.name = 'Indiquez votre nom.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = 'Adresse email invalide.'
    if (form.message.trim().length < 10) {
      e.message = 'Précisez votre besoin en quelques mots (10 caractères minimum).'
    }
    if (!form.consent) {
      e.consent = 'Merci d’accepter l’utilisation de vos données pour traiter la demande.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (sending) return
    if (form.honey) return // piège anti-robot
    if (!validate()) return
    setSending(true)
    setSendError('')
    const tag = formatAttributionTag()
    const contextLines = buildContextualSummary(form)
    const contextHeader = contextLines.length > 0 ? `${contextLines.join('\n')}\n\n` : ''
    const rawMessage = `${contextHeader}${form.message.trim()}`
    const fullBody = tag ? `${tag}\n\n${rawMessage}` : rawMessage

    const res = await adminStore.addIncomingMessage({
      name: form.name,
      email: form.email,
      organization: form.organization || undefined,
      phone: form.phone || undefined,
      route: form.route,
      eventDate: form.date || form.period || undefined,
      place: form.place || undefined,
      body: fullBody,
    })
    setSending(false)
    if (res.ok) {
      trackFormSubmitSuccess('contact_form', form.route)
      trackLeadConversion('contact', { route: form.route, category: 'Contact Form' })
      setSubmitted(true)
    } else {
      trackFormSubmitError('contact_form', 'submission_failed')
      setSendError(
        'L’envoi n’a pas abouti. Votre demande n’a pas été reçue : réessayez, ou envoyez-la directement par WhatsApp ci-dessous.',
      )
    }
  }

  const inputCls = (name: string) =>
    `w-full border bg-ink px-4 py-3.5 text-sm text-ivory placeholder:text-ivory/35 focus:outline-none ${
      errors[name] ? 'border-crimson focus:border-crimson' : 'border-white/15 focus:border-gold'
    }`

  return (
    <>
      <PageHero
        breadcrumb="Contact"
        eyebrow="Entrer en relation avec Hervé Nanfang"
        title="Quatre parcours prioritaires, une réponse sur mesure sous 48 h"
        lead="Sélectionnez votre besoin : le formulaire adapte automatiquement ses questions à votre projet, et le bouton WhatsApp prépare votre message en un clic."
      >
        <div className="grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          <Stat value="04" label="Offres prioritaires" />
          <Stat value="48h" label="Délai de réponse visé" />
          <Stat value="FR/EN" label="Langues de travail" />
          <Stat value="CM/INT" label="Yaoundé & International" />
        </div>
      </PageHero>

      {/* ========================================================================= */}
      {/* 1. LES 4 CATÉGORIES COMMERCIALES PRIORITAIRES + PARCOURS SECONDAIRES      */}
      {/* ========================================================================= */}
      <Section tone="dark">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Reveal>
            <ChapterMark num="01" label="Choix du parcours · Qualification rapide" />
            <Display size="md" className="mt-6 max-w-3xl">
              Quel est l’objet de votre demande ?
            </Display>
          </Reveal>
          <Reveal delay={80}>
            <a
              href={whatsappHrefs[0].href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContactMethodClick('whatsapp', `top_${form.route}`)}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/45 bg-emerald-500/15 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-emerald-300 hover:border-emerald-400 hover:bg-emerald-500/25 transition-all"
            >
              <span>💬 WhatsApp Direct ({ ROUTE_LABELS[form.route] }) · {whatsappHrefs[0].display}</span>
            </a>
          </Reveal>
        </div>

        {/* Grille des 4 objectifs commerciaux prioritaires */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {primaryRoutes.map((r, i) => {
            const meta = ROUTE_PRIORITY_META[r.id]
            const isSelected = form.route === r.id
            return (
              <Reveal key={r.id} delay={i * 50}>
                <a
                  id={r.id}
                  href="#formulaire"
                  onClick={() => setForm((f) => ({ ...f, route: r.id }))}
                  className={`flex h-full flex-col justify-between border p-6 transition-all ${
                    isSelected
                      ? 'border-gold bg-ink-2 shadow-[0_0_28px_rgba(198,161,91,0.18)]'
                      : 'border-white/12 bg-ink-2/75 hover:border-gold/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-wider text-gold">
                        {meta?.badge || r.label}
                      </span>
                      {isSelected && (
                        <span className="h-2 w-2 rounded-full bg-gold" aria-hidden="true" />
                      )}
                    </div>
                    <h2 className="mt-3 font-display text-2xl text-ivory">
                      {meta?.title || r.label}
                    </h2>
                    <p className="mt-2 text-xs font-medium text-ivory/80">
                      {meta?.subtitle || r.detail}
                    </p>
                    <Rule className="my-3.5 opacity-30" />
                    <p className="text-xs leading-relaxed text-ivory/60">{r.text}</p>
                  </div>

                  <p className="mt-5 pt-3 border-t border-white/10 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-gold">
                    {isSelected ? '✓ Parcours actif ci-dessous' : 'Sélectionner ce motif →'}
                  </p>
                </a>
              </Reveal>
            )
          })}
        </div>

        {/* Parcours secondaires : Presse, Médias, Partenariats & Collaborations */}
        <Reveal delay={200}>
          <div className="mt-8 border border-white/10 bg-ink/80 p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ivory/55">
                  Parcours secondaires · Presse, Médias & Partenariats culturels
                </p>
                <p className="mt-1 text-xs text-ivory/70">
                  Vous êtes journaliste, chercheur ou porteur d’un projet de co-création / patrimoine ?
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {secondaryRoutes.map((r) => {
                  const meta = ROUTE_PRIORITY_META[r.id]
                  const isSelected = form.route === r.id
                  return (
                    <a
                      key={r.id}
                      id={r.id}
                      href="#formulaire"
                      onClick={() => setForm((f) => ({ ...f, route: r.id }))}
                      className={`inline-flex items-center gap-2 border px-4 py-2.5 text-xs uppercase tracking-wider transition-colors ${
                        isSelected
                          ? 'border-gold bg-gold/15 text-gold font-semibold'
                          : 'border-white/15 bg-ink-2 text-ivory/75 hover:border-gold/50 hover:text-ivory'
                      }`}
                    >
                      <span>{meta?.title || r.label}</span>
                      <span className="text-gold">→</span>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ========================================================================= */}
      {/* 2. FORMULAIRE ADAPTATIF SELON LA DEMANDE SÉLECTIONNÉE                     */}
      {/* ========================================================================= */}
      <Section tone="ink" id="formulaire">
        <div className="grid gap-14 lg:grid-cols-[1.18fr_0.82fr] lg:items-start">
          <Reveal>
            <ChapterMark num="02" label="Formulaire intelligent · Champs adaptés à votre besoin" />
            <Display size="md" className="mt-6">
              {selectedMeta.title}
            </Display>
            <Lead className="mt-3 max-w-2xl">
              {selectedMeta.subtitle}
            </Lead>

            {/* Sélecteur rapide de motif + bouton WhatsApp prérempli */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/30 bg-ink-2 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-ivory/60">
                  Changer de motif :
                </span>
                {CONTACT_ROUTES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, route: r.id }))}
                    className={`px-2.5 py-1 text-[0.65rem] uppercase tracking-wider transition-colors ${
                      form.route === r.id
                        ? 'bg-gold text-ink font-bold'
                        : 'border border-white/10 bg-ink text-ivory/70 hover:border-gold/40'
                    }`}
                  >
                    {ROUTE_PRIORITY_META[r.id]?.title || r.label}
                  </button>
                ))}
              </div>

              <a
                href={whatsappHrefs[0].href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContactMethodClick('whatsapp', `form_bar_${form.route}`)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                <span>💬 Ouvrir directement dans WhatsApp ↗</span>
              </a>
            </div>

            {selectedFormula && form.route === 'booking' && (
              <div className="mt-4 inline-flex items-center gap-2 rounded border border-gold/40 bg-gold/10 px-3.5 py-1.5 text-xs text-gold">
                <span>✦ Configuration présélectionnée :</span>
                <strong>{selectedFormula}</strong>
              </div>
            )}

            {submitted ? (
              <div className="mt-10 border border-gold/40 bg-ink-2 p-8">
                <Eyebrow>Demande enregistrée</Eyebrow>
                <p className="mt-4 font-display text-2xl text-ivory">
                  Merci {form.name.split(' ')[0]}. Votre demande ({selectedMeta.title}) a bien été reçue.
                </p>
                <Body className="mt-4">
                  Elle est enregistrée et recevra une réponse sous 48 h environ. Pour accélérer les
                  échanges ou partager un document sur mobile, vous pouvez également transmettre ce
                  récapitulatif prérempli en un clic sur WhatsApp.
                </Body>
                <div className="mt-7 flex flex-wrap gap-4">
                  {whatsappHrefs.map((link) => (
                    <a
                      key={link.display}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackContactMethodClick('whatsapp', form.route)}
                      className="btn btn-gold"
                    >
                      WhatsApp prérempli · {link.display}
                    </a>
                  ))}
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      setSubmitted(false)
                      setForm(EMPTY)
                    }}
                  >
                    Nouvelle demande
                  </button>
                </div>
              </div>
            ) : (
              <form
                className="mt-8 space-y-6"
                onSubmit={onSubmit}
                onFocus={() => trackFormStart('contact_form', form.route)}
                noValidate
              >
                {/* 1. Coordonnées essentielles */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="eyebrow text-ivory/65">
                      Nom & prénom *
                    </label>
                    <input
                      id="name"
                      className={`mt-2.5 ${inputCls('name')}`}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Votre nom complet"
                    />
                    {errors.name && <p className="mt-1.5 text-xs text-crimson-2">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="eyebrow text-ivory/65">
                      Email professionnel ou personnel *
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`mt-2.5 ${inputCls('email')}`}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="vous@exemple.com"
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-crimson-2">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="eyebrow text-ivory/65">
                      Téléphone / WhatsApp (recommandé)
                    </label>
                    <input
                      id="phone"
                      className={`mt-2.5 ${inputCls('phone')}`}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+237 … ou numéro international"
                    />
                  </div>
                  <div>
                    <label htmlFor="organization" className="eyebrow text-ivory/65">
                      {form.route === 'formation'
                        ? 'Établissement / Organisation'
                        : form.route === 'conference'
                        ? 'Organisme / Institution'
                        : form.route === 'presse'
                        ? 'Média / Rédaction'
                        : 'Structure / Organisation (optionnel)'}
                    </label>
                    <input
                      id="organization"
                      className={`mt-2.5 ${inputCls('organization')}`}
                      value={form.organization}
                      onChange={(e) => setForm({ ...form, organization: e.target.value })}
                      placeholder={
                        form.route === 'booking'
                          ? 'Hôtel, entreprise, ambassade, particulier…'
                          : form.route === 'formation'
                          ? 'École, université, studio ou inscription individuelle…'
                          : form.route === 'conference'
                          ? 'Université, festival, institution…'
                          : 'Nom de votre structure ou projet…'
                      }
                    />
                  </div>
                </div>

                {/* 2. Champs dynamiques adaptés au motif sélectionné */}
                <div className="border border-white/10 bg-ink-2/70 p-5 sm:p-6">
                  <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold">
                    Paramètres spécifiques — {selectedMeta.title} (facultatifs, pour accélérer le chiffrage)
                  </p>

                  {/* CAS 1 : PRESTATION MUSICALE (BOOKING) */}
                  {form.route === 'booking' && (
                    <div className="mt-4 grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="eventType" className="eyebrow text-ivory/60">
                          Type d’événement
                        </label>
                        <select
                          id="eventType"
                          className={`mt-2 ${inputCls('eventType')}`}
                          value={form.eventType}
                          onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                        >
                          <option value="" className="bg-ink text-ivory">
                            Sélectionner le type d’événement…
                          </option>
                          {BOOKING_EVENT_TYPES.map((opt) => (
                            <option key={opt} value={opt} className="bg-ink text-ivory">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="desiredFormat" className="eyebrow text-ivory/60">
                          Format souhaité
                        </label>
                        <select
                          id="desiredFormat"
                          className={`mt-2 ${inputCls('desiredFormat')}`}
                          value={form.desiredFormat}
                          onChange={(e) => setForm({ ...form, desiredFormat: e.target.value })}
                        >
                          <option value="" className="bg-ink text-ivory">
                            Sélectionner la formule…
                          </option>
                          {BOOKING_FORMATS.map((opt) => (
                            <option key={opt} value={opt} className="bg-ink text-ivory">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="date" className="eyebrow text-ivory/60">
                          Date de l’événement
                        </label>
                        <input
                          id="date"
                          type="date"
                          className={`mt-2 ${inputCls('date')}`}
                          value={form.date}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="place" className="eyebrow text-ivory/60">
                          Ville & Lieu pressenti
                        </label>
                        <input
                          id="place"
                          className={`mt-2 ${inputCls('place')}`}
                          value={form.place}
                          onChange={(e) => setForm({ ...form, place: e.target.value })}
                          placeholder="Ex. : Yaoundé (Hilton), Douala, Kribi, Paris…"
                        />
                      </div>
                    </div>
                  )}

                  {/* CAS 2 : FORMATION */}
                  {form.route === 'formation' && (
                    <div className="mt-4 grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="audience" className="eyebrow text-ivory/60">
                          Public concerné
                        </label>
                        <select
                          id="audience"
                          className={`mt-2 ${inputCls('audience')}`}
                          value={form.audience}
                          onChange={(e) => setForm({ ...form, audience: e.target.value })}
                        >
                          <option value="" className="bg-ink text-ivory">
                            Sélectionner le profil…
                          </option>
                          {FORMATION_AUDIENCES.map((opt) => (
                            <option key={opt} value={opt} className="bg-ink text-ivory">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="discipline" className="eyebrow text-ivory/60">
                          Discipline ou programme
                        </label>
                        <select
                          id="discipline"
                          className={`mt-2 ${inputCls('discipline')}`}
                          value={form.discipline}
                          onChange={(e) => setForm({ ...form, discipline: e.target.value })}
                        >
                          <option value="" className="bg-ink text-ivory">
                            Sélectionner la discipline…
                          </option>
                          {FORMATION_DISCIPLINES.map((opt) => (
                            <option key={opt} value={opt} className="bg-ink text-ivory">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="period" className="eyebrow text-ivory/60">
                          Période ou trimestre souhaité
                        </label>
                        <input
                          id="period"
                          className={`mt-2 ${inputCls('period')}`}
                          value={form.period}
                          onChange={(e) => setForm({ ...form, period: e.target.value })}
                          placeholder="Ex. : Dès ce mois, Semestre prochain, Vacances…"
                        />
                      </div>
                      <div>
                        <label htmlFor="place" className="eyebrow text-ivory/60">
                          Ville / Modalité
                        </label>
                        <input
                          id="place"
                          className={`mt-2 ${inputCls('place')}`}
                          value={form.place}
                          onChange={(e) => setForm({ ...form, place: e.target.value })}
                          placeholder="Yaoundé, sur site dans votre école, ou à distance"
                        />
                      </div>
                    </div>
                  )}

                  {/* CAS 3 : CONFÉRENCE */}
                  {form.route === 'conference' && (
                    <div className="mt-4 grid gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label htmlFor="conferenceTheme" className="eyebrow text-ivory/60">
                          Thématique pressentie
                        </label>
                        <select
                          id="conferenceTheme"
                          className={`mt-2 ${inputCls('conferenceTheme')}`}
                          value={form.conferenceTheme}
                          onChange={(e) => setForm({ ...form, conferenceTheme: e.target.value })}
                        >
                          <option value="" className="bg-ink text-ivory">
                            Choisir parmi les 6 conférences ou sur mesure…
                          </option>
                          {CONFERENCE_THEMES.map((opt) => (
                            <option key={opt} value={opt} className="bg-ink text-ivory">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="audience" className="eyebrow text-ivory/60">
                          Public attendu
                        </label>
                        <select
                          id="audience"
                          className={`mt-2 ${inputCls('audience')}`}
                          value={form.audience}
                          onChange={(e) => setForm({ ...form, audience: e.target.value })}
                        >
                          <option value="" className="bg-ink text-ivory">
                            Sélectionner le public…
                          </option>
                          {CONFERENCE_AUDIENCES.map((opt) => (
                            <option key={opt} value={opt} className="bg-ink text-ivory">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="date" className="eyebrow text-ivory/60">
                          Date envisagée
                        </label>
                        <input
                          id="date"
                          type="date"
                          className={`mt-2 ${inputCls('date')}`}
                          value={form.date}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="place" className="eyebrow text-ivory/60">
                          Ville / Format (Présentiel avec piano ou Distanciel)
                        </label>
                        <input
                          id="place"
                          className={`mt-2 ${inputCls('place')}`}
                          value={form.place}
                          onChange={(e) => setForm({ ...form, place: e.target.value })}
                          placeholder="Ex. : Yaoundé, Lomé, Cotonou, Paris, Visioconférence…"
                        />
                      </div>
                    </div>
                  )}

                  {/* CAS 4 : ACCOMPAGNEMENT PROFESSIONNEL (CONSEIL) */}
                  {form.route === 'conseil' && (
                    <div className="mt-4 grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="consultingDomain" className="eyebrow text-ivory/60">
                          Domaine d’intervention
                        </label>
                        <select
                          id="consultingDomain"
                          className={`mt-2 ${inputCls('consultingDomain')}`}
                          value={form.consultingDomain}
                          onChange={(e) => setForm({ ...form, consultingDomain: e.target.value })}
                        >
                          <option value="" className="bg-ink text-ivory">
                            Sélectionner le domaine…
                          </option>
                          {CONSEIL_DOMAINS.map((opt) => (
                            <option key={opt} value={opt} className="bg-ink text-ivory">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="consultingGoal" className="eyebrow text-ivory/60">
                          Objectif prioritaire
                        </label>
                        <select
                          id="consultingGoal"
                          className={`mt-2 ${inputCls('consultingGoal')}`}
                          value={form.consultingGoal}
                          onChange={(e) => setForm({ ...form, consultingGoal: e.target.value })}
                        >
                          <option value="" className="bg-ink text-ivory">
                            Sélectionner l’objectif…
                          </option>
                          {CONSEIL_GOALS.map((opt) => (
                            <option key={opt} value={opt} className="bg-ink text-ivory">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="place" className="eyebrow text-ivory/60">
                          Ville / Pays
                        </label>
                        <input
                          id="place"
                          className={`mt-2 ${inputCls('place')}`}
                          value={form.place}
                          onChange={(e) => setForm({ ...form, place: e.target.value })}
                          placeholder="Yaoundé, Douala, International (suivi hybride ou à distance)…"
                        />
                      </div>
                    </div>
                  )}

                  {/* CAS 5 & 6 : PRESSE OU COLLABORATION */}
                  {(form.route === 'presse' || form.route === 'collaboration') && (
                    <div className="mt-4 grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="date" className="eyebrow text-ivory/60">
                          Date ou échéance éditoriale
                        </label>
                        <input
                          id="date"
                          type="date"
                          className={`mt-2 ${inputCls('date')}`}
                          value={form.date}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="place" className="eyebrow text-ivory/60">
                          Lieu / Pays
                        </label>
                        <input
                          id="place"
                          className={`mt-2 ${inputCls('place')}`}
                          value={form.place}
                          onChange={(e) => setForm({ ...form, place: e.target.value })}
                          placeholder="Yaoundé, Douala, International…"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Message libre */}
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="message" className="eyebrow text-ivory/65">
                      Précisions sur votre besoin *
                    </label>
                    <span className="font-mono text-[0.65rem] text-gold/80">
                      Réponse personnalisée sous 48 h
                    </span>
                  </div>
                  <textarea
                    id="message"
                    rows={5}
                    className={`mt-2.5 ${inputCls('message')}`}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={
                      form.route === 'booking'
                        ? 'Indiquez en quelques mots l’ambiance souhaitée, le nombre approximatif d’invités, les horaires et si le lieu dispose déjà d’un piano…'
                        : form.route === 'formation'
                        ? 'Précisez votre niveau actuel (ou celui des apprenants), vos attentes pédagogiques et le rythme souhaité…'
                        : form.route === 'conference'
                        ? 'Précisez le cadre de l’événement, la durée souhaitée (conférence 45–90 min, masterclass ou table ronde) et les attentes du public…'
                        : form.route === 'conseil'
                        ? 'Décrivez votre projet artistique ou culturel, vos enjeux actuels et le résultat attendu…'
                        : 'Décrivez l’objet de votre sollicitation (angle d’interview, partenariat, recherche)…'
                    }
                  />
                  {errors.message && <p className="mt-1.5 text-xs text-crimson-2">{errors.message}</p>}
                </div>

                {/* Piège anti-robot */}
                <div className="hidden" aria-hidden>
                  <label htmlFor="honey">Ne pas remplir</label>
                  <input
                    id="honey"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.honey}
                    onChange={(e) => setForm({ ...form, honey: e.target.value })}
                  />
                </div>

                <label className="flex items-start gap-3 text-sm text-ivory/65">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-[#c6a15b]"
                    checked={form.consent}
                    onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                  />
                  <span>
                    J’accepte que ces informations soient utilisées pour traiter ma demande. Si
                    j’utilise WhatsApp, mes données sont également traitées par WhatsApp/Meta selon
                    leur politique de confidentialité.
                    {errors.consent && (
                      <span className="mt-1 block text-xs text-crimson-2">{errors.consent}</span>
                    )}
                  </span>
                </label>

                {sendError && (
                  <p
                    role="alert"
                    className="border border-crimson/50 bg-crimson/10 px-4 py-3 text-sm text-crimson-2"
                  >
                    {sendError}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    type="submit"
                    className="btn btn-gold"
                    disabled={sending}
                    aria-busy={sending}
                  >
                    {sending ? 'Envoi en cours…' : 'Envoyer la demande'}
                  </button>
                  <a
                    href={whatsappHrefs[0].href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackContactMethodClick('whatsapp', form.route)}
                    className="btn btn-ghost border-emerald-500/40 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-500/10"
                  >
                    💬 Envoyer sur WhatsApp avec ces informations ↗
                  </a>
                </div>
              </form>
            )}
          </Reveal>

          {/* Colonne latérale : Coordonnées & Réassurance */}
          <Reveal delay={120} className="lg:sticky lg:top-32">
            <Card hover={false}>
              <Eyebrow>Contact direct & WhatsApp</Eyebrow>
              <Rule className="opacity-40" />
              <ul className="mt-5 space-y-4 text-sm">
                <li>
                  <p className="text-[0.62rem] uppercase tracking-[0.18em] text-ivory/45">
                    Email officiel (Booking, Conférences & Conseil)
                  </p>
                  <a
                    href={`mailto:${SITE.emailContact}`}
                    onClick={() => trackContactMethodClick('email', form.route)}
                    className="mt-1 block break-all font-display text-xl text-gold hover:text-gold-2"
                  >
                    {SITE.emailContact}
                  </a>
                </li>
                <li>
                  <p className="text-[0.62rem] uppercase tracking-[0.18em] text-ivory/45">
                    Formations & A Laiz Academy
                  </p>
                  <a
                    href={`mailto:${SITE.emailAcademy}`}
                    onClick={() => trackContactMethodClick('email', 'formation')}
                    className="mt-1 block break-all font-display text-lg text-ivory/90 hover:text-gold"
                  >
                    {SITE.emailAcademy}
                  </a>
                </li>
                {SITE.phones.map((phone) => (
                  <li key={phone.tel}>
                    <p className="text-[0.62rem] uppercase tracking-[0.18em] text-ivory/45">
                      Ligne directe & WhatsApp
                    </p>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      <a
                        href={`tel:${phone.tel}`}
                        onClick={() => trackContactMethodClick('phone', form.route)}
                        className="text-ivory/80 hover:text-gold"
                      >
                        {phone.display}
                      </a>
                      <a
                        href={`https://wa.me/${phone.whatsapp}?text=${encodeURIComponent(selectedMeta.defaultWhatsappIntro)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackContactMethodClick('whatsapp', form.route)}
                        className="font-semibold text-emerald-400 hover:text-emerald-300"
                      >
                        WhatsApp prérempli ↗
                      </a>
                    </div>
                  </li>
                ))}
                <li>
                  <p className="text-[0.62rem] uppercase tracking-[0.18em] text-ivory/45">
                    Base & Mobilité
                  </p>
                  <p className="mt-1 text-ivory/75">
                    {SITE.city} — Interventions au Cameroun, en Afrique de l’Ouest et à l’international
                  </p>
                </li>
              </ul>

              <Rule className="my-7 opacity-40" />

              <p className="text-[0.62rem] uppercase tracking-[0.18em] text-ivory/45">
                Profils officiels vérifiés
              </p>
              <div className="mt-4">
                <SocialButtons />
              </div>
            </Card>

            <Card hover={false} className="mt-8">
              <Eyebrow>Réassurance & Références vérifiables</Eyebrow>
              <Rule className="opacity-40" />
              <ul className="mt-5 space-y-3 text-sm text-ivory/70">
                <li>
                  <strong className="text-ivory">Expérience depuis 2007 :</strong> +440 titres au
                  répertoire Le Pianobariste™, autonomie technique complète (son & clavier de scène).
                </li>
                <li>
                  <strong className="text-ivory">Scènes & Hôtels :</strong> Hôtel Hilton, Mont Fébé,
                  Djeuga Palace (Yaoundé), Akwa Palace (Douala), résidences VIP (Kribi).
                </li>
                <li>
                  <strong className="text-ivory">Enseignement supérieur :</strong> ESAS (Lomé), ISMA
                  (Bénin), IBA (Nkongsamba), IFCPA / CRTV (Yaoundé).
                </li>
                <li>
                  <strong className="text-ivory">Engagement de réponse :</strong> retour structuré
                  sous 48 h avec proposition adaptée, fiche technique et modalités.
                </li>
              </ul>
            </Card>
          </Reveal>
        </div>
      </Section>

      <PressKit />
    </>
  )
}
