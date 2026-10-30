import { useEffect, useMemo, useState } from 'react'
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
  message: '',
  consent: false,
  honey: '',
}

const ROUTE_LABELS: Record<string, string> = Object.fromEntries(
  CONTACT_ROUTES.map((r) => [r.id, r.label]),
)

export default function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '')
      if (CONTACT_ROUTES.some((r) => r.id === hash)) {
        setForm((f) => ({ ...f, route: hash }))
      }
    }
  }, [])

  useSeo({
    title: 'Contact | Hervé Nanfang — Booking, Formation & Conseil',
    description:
      "Booking piano-bar, formation, conférence, collaboration, presse ou conseil : choisissez votre parcours et adressez une demande précise à Hervé Nanfang.",
    path: '/contact',
    jsonLd: [
      personSchema,
      serviceSchema(
        'Booking, formation et conseil',
        'Prestations live, formations, conférences, collaborations et conseil en IA et technologies créatives.',
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

  const whatsappHrefs = useMemo(() => {
    const message = [
      `[${ROUTE_LABELS[form.route]}] Demande — ${form.name || 'Nouvelle demande'}`,
      `Nom : ${form.name}`,
      `Structure : ${form.organization || '—'}`,
      `Email : ${form.email}`,
      `Téléphone : ${form.phone || '—'}`,
      `Motif : ${ROUTE_LABELS[form.route]}`,
      form.date ? `Date souhaitée : ${form.date}` : '',
      form.place ? `Lieu : ${form.place}` : '',
      '',
      form.message,
    ]
      .filter(Boolean)
      .join('\n')
    return SITE.phones.map((phone) => ({
      display: phone.display,
      href: `https://wa.me/${phone.whatsapp}?text=${encodeURIComponent(message)}`,
    }))
  }, [form])

  function validate() {
    const e: Record<string, string> = {}
    if (form.name.trim().length < 2) e.name = 'Indiquez votre nom.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = 'Adresse email invalide.'
    if (form.message.trim().length < 20) e.message = 'Décrivez votre demande en quelques lignes (20 caractères minimum).'
    if (!form.consent) e.consent = 'Merci d’accepter l’utilisation de vos données pour traiter la demande.'
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
    const fullBody = tag ? `${tag}\n\n${form.message.trim()}` : form.message.trim()
    const res = await adminStore.addIncomingMessage({
      name: form.name,
      email: form.email,
      organization: form.organization || undefined,
      phone: form.phone || undefined,
      route: form.route,
      eventDate: form.date || undefined,
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
    `w-full border bg-transparent px-4 py-3.5 text-sm text-ivory placeholder:text-ivory/30 focus:outline-none ${
      errors[name] ? 'border-crimson focus:border-crimson' : 'border-white/15 focus:border-gold'
    }`

  return (
    <>
      <PageHero
        breadcrumb="Contact"
        eyebrow="Prendre contact"
        title="Six parcours, une réponse adaptée"
        lead="« Envoyez-moi un message » ne suffit pas. Choisissez votre motif : chaque parcours demande des informations différentes, et reçoit une réponse différente."
      >
        <div className="grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          <Stat value="06" label="Parcours" />
          <Stat value="48h" label="Délai de réponse visé" />
          <Stat value="FR/EN" label="Langues" />
          <Stat value="CM" label="Base · Yaoundé" />
        </div>
      </PageHero>

      {/* Parcours */}
      <Section tone="dark">
        <Reveal>
          <ChapterMark num="01" label="Parcours" />
          <Display size="md" className="mt-7 max-w-3xl">
            Choisissez le motif de votre demande
          </Display>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CONTACT_ROUTES.map((r, i) => (
            <Reveal key={r.id} delay={i * 60}>
              <a
                id={r.id}
                href="#formulaire"
                onClick={() => setForm((f) => ({ ...f, route: r.id }))}
                className={`block h-full border p-7 transition-colors ${
                  form.route === r.id
                    ? 'border-gold bg-ink-2'
                    : 'border-white/10 bg-ink-2 hover:border-gold/50'
                }`}
              >
                <Eyebrow>{r.label}</Eyebrow>
                <p className="mt-4 text-[0.68rem] uppercase tracking-[0.16em] text-ivory/45">
                  {r.detail}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ivory/60">{r.text}</p>
                <p className="mt-6 text-[0.62rem] uppercase tracking-[0.2em] text-gold">
                  {form.route === r.id ? 'Motif sélectionné' : 'Choisir ce parcours →'}
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Formulaire */}
      <Section tone="ink" id="formulaire">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <Reveal>
            <ChapterMark num="02" label="Formulaire" />
            <Display size="md" className="mt-7">
              Décrire la demande
            </Display>
            <Lead className="mt-5 max-w-xl">
              Motif sélectionné : <span className="text-gold">{selected.label}</span> — {selected.detail}
            </Lead>

            {submitted ? (
              <div className="mt-10 border border-gold/40 bg-ink-2 p-8">
                <Eyebrow>Demande reçue</Eyebrow>
                <p className="mt-4 font-display text-2xl text-ivory">
                  Merci {form.name.split(' ')[0]}. Votre demande a bien été reçue.
                </p>
                <Body className="mt-4">
                  Elle est enregistrée et sera traitée sous 48 h environ. Pour une demande urgente,
                  vous pouvez aussi l’envoyer par WhatsApp (les données sont alors également
                  traitées par WhatsApp/Meta).
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
                      WhatsApp · {link.display}
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
                className="mt-10 space-y-6"
                onSubmit={onSubmit}
                onFocus={() => trackFormStart('contact_form', form.route)}
                noValidate
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="eyebrow text-ivory/50">
                      Nom & prénom *
                    </label>
                    <input
                      id="name"
                      className={`mt-3 ${inputCls('name')}`}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Votre nom"
                    />
                    {errors.name && <p className="mt-2 text-xs text-crimson-2">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="eyebrow text-ivory/50">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`mt-3 ${inputCls('email')}`}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="vous@exemple.com"
                    />
                    {errors.email && <p className="mt-2 text-xs text-crimson-2">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="organization" className="eyebrow text-ivory/50">
                      Structure / organisation
                    </label>
                    <input
                      id="organization"
                      className={`mt-3 ${inputCls('organization')}`}
                      value={form.organization}
                      onChange={(e) => setForm({ ...form, organization: e.target.value })}
                      placeholder="École, hôtel, institution…"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="eyebrow text-ivory/50">
                      Téléphone / WhatsApp
                    </label>
                    <input
                      id="phone"
                      className={`mt-3 ${inputCls('phone')}`}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+237 …"
                    />
                  </div>
                  <div>
                    <label htmlFor="route" className="eyebrow text-ivory/50">
                      Motif *
                    </label>
                    <select
                      id="route"
                      className={`mt-3 ${inputCls('route')}`}
                      value={form.route}
                      onChange={(e) => setForm({ ...form, route: e.target.value })}
                    >
                      {CONTACT_ROUTES.map((r) => (
                        <option key={r.id} value={r.id} className="bg-ink text-ivory">
                          {r.label} — {r.detail}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="date" className="eyebrow text-ivory/50">
                      Date envisagée
                    </label>
                    <input
                      id="date"
                      type="date"
                      className={`mt-3 ${inputCls('date')}`}
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="place" className="eyebrow text-ivory/50">
                      Lieu / ville
                    </label>
                    <input
                      id="place"
                      className={`mt-3 ${inputCls('place')}`}
                      value={form.place}
                      onChange={(e) => setForm({ ...form, place: e.target.value })}
                      placeholder="Yaoundé, Douala, Paris…"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="eyebrow text-ivory/50">
                    Votre demande *
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className={`mt-3 ${inputCls('message')}`}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Contexte, objectifs, format souhaité, contraintes techniques et budgétaires…"
                  />
                  {errors.message && <p className="mt-2 text-xs text-crimson-2">{errors.message}</p>}
                </div>

                {/* Piège anti-robot (invisible pour les humains) */}
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

                <label className="flex items-start gap-3 text-sm text-ivory/60">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-[#c6a15b]"
                    checked={form.consent}
                    onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                  />
                  <span>
                    J’accepte que ces informations soient enregistrées et utilisées pour traiter ma
                    demande. Si j’utilise WhatsApp, mes données seront également traitées par
                    WhatsApp/Meta selon leur politique de confidentialité.
                    {errors.consent && <span className="mt-1 block text-xs text-crimson-2">{errors.consent}</span>}
                  </span>
                </label>

                {sendError && (
                  <p role="alert" className="border border-crimson/50 bg-crimson/10 px-4 py-3 text-sm text-crimson-2">
                    {sendError}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-5">
                  <button type="submit" className="btn btn-gold" disabled={sending} aria-busy={sending}>
                    {sending ? 'Envoi en cours…' : 'Envoyer la demande'}
                  </button>
                  <a
                    href={whatsappHrefs[0].href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.68rem] uppercase tracking-[0.18em] text-ivory/45 hover:text-gold"
                  >
                    ou ouvrir WhatsApp →
                  </a>
                </div>
              </form>
            )}
          </Reveal>

          {/* Coordonnées */}
          <Reveal delay={120} className="lg:sticky lg:top-32">
            <Card hover={false}>
              <Eyebrow>Coordonnées</Eyebrow>
              <Rule className="opacity-40" />
              <ul className="mt-5 space-y-4 text-sm">
                <li>
                  <p className="text-[0.62rem] uppercase tracking-[0.18em] text-ivory/35">Email · RMA</p>
                  <a href={`mailto:${SITE.emailRma}`} className="mt-1 block break-all font-display text-xl text-gold">
                    {SITE.emailRma}
                  </a>
                </li>
                {SITE.phones.map((phone) => (
                  <li key={phone.tel}>
                    <p className="text-[0.62rem] uppercase tracking-[0.18em] text-ivory/35">Téléphone / WhatsApp</p>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      <a href={`tel:${phone.tel}`} className="text-ivory/75 hover:text-gold">{phone.display}</a>
                      <a
                        href={`https://wa.me/${phone.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold hover:text-gold-2"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </li>
                ))}
                <li>
                  <p className="text-[0.62rem] uppercase tracking-[0.18em] text-ivory/35">Base</p>
                  <p className="mt-1 text-ivory/75">{SITE.city} — interventions internationales</p>
                </li>
              </ul>

              <Rule className="my-7 opacity-40" />

              <p className="text-[0.62rem] uppercase tracking-[0.18em] text-ivory/35">Réseaux</p>
              <div className="mt-4">
                <SocialButtons />
              </div>
            </Card>

            <Card hover={false} className="mt-8">
              <Eyebrow>Bon à savoir</Eyebrow>
              <Rule className="opacity-40" />
              <ul className="mt-5 space-y-3 text-sm text-ivory/60">
                <li>Une demande précise reçoit une réponse plus rapide et plus utile.</li>
                <li>Pour un booking, indiquez la date, la durée et le type de salle.</li>
                <li>Pour une conférence, précisez le public et le format attendu.</li>
                <li>Les demandes de presse reçoivent une biographie vérifiée et des visuels.</li>
              </ul>
            </Card>
          </Reveal>
        </div>
      </Section>

      <PressKit />
    </>
  )
}
