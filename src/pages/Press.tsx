import { useState } from 'react'
import PageHero from '../components/PageHero'
import PressMediaKit from '../components/PressMediaKit'
import {
  ArrowLink,
  Btn,
  ChapterMark,
  CtaBand,
  Display,
  Lead,
  Reveal,
  Rule,
  Section,
  SpotlightCard,
  Stat,
  Tag,
} from '../components/ui'
import { SITE } from '../data/site'
import { breadcrumbSchema, personSchema } from '../lib/schema'
import { useSeo } from '../lib/seo'

interface TechRider {
  id: string
  title: string
  subtitle: string
  duration: string
  stageFootprint: string
  soundRequirements: string[]
  backlineProvided: string[]
  backlineNeeded: string[]
  lighting: string
  powerSupply: string
}

const TECH_RIDERS: TechRider[] = [
  {
    id: 'solo',
    title: 'Rider 01 — Le Pianobariste™ Solo',
    subtitle: 'Piano acoustique ou clavier numérique 88 touches',
    duration: 'Sets de 45 à 60 min (jusqu’à 3–4 h avec pauses)',
    stageFootprint: '2 m × 2 m minimum (espace salon ou scène feutrée)',
    soundRequirements: [
      'Diffusion stéréo équilibrée (colonne acoustique ou façade salle)',
      '1 ligne stéréo Jack 6.35 mm ou XLR pour clavier de scène',
      '1 micro voix dynamique ou HF de qualité studio (Shure SM58 / Beta 58)',
      '1 retour de scène bain de pied ou liaison in-ear monitoring',
    ],
    backlineProvided: [
      'Clavier de scène professionnel 88 touches toucher lourd',
      'Pédale de sustain & banquette réglable',
      'Câblage Jack/XLR professionnel et stand en X double embase',
    ],
    backlineNeeded: [
      'Si piano acoustique sur place : piano à queue ou droit accordé à 440 Hz avant la balance',
      'Sonorisation de salle adaptée à la jauge (si espace > 100 personnes)',
    ],
    lighting: 'Éclairage d’ambiance chaud et feutré (pas de stroboscope ni poursuite agressive)',
    powerSupply: '2 prises 220V 16A avec terre à proximité immédiate du piano',
  },
  {
    id: 'duo',
    title: 'Rider 02 — Duo Signature (Hervé & Flavie)',
    subtitle: 'Piano acoustique / Clavier & Voix Lead',
    duration: '2 à 3 sets de 45 minutes',
    stageFootprint: '3 m × 2.5 m minimum',
    soundRequirements: [
      'Façade stéréo haute fidélité avec processeur de réverbération hall/plate',
      '2 micros chant HF professionnels (Shure Beta 58A / Neumann KMS)',
      'Ligne stéréo clavier (2 × DI actives recommandées si grande scène)',
      '2 circuits de retours indépendants (Mix 1 : Hervé / Mix 2 : Flavie)',
    ],
    backlineProvided: [
      'Clavier maître & module de son professionnel',
      'Banquette piano, pieds de micro et câblage de liaison scène',
    ],
    backlineNeeded: [
      'Table de mixage numérique ou analogique (min. 6 entrées XLR/Jack)',
      'Technicien son de salle pour la balance (30 min avant ouverture)',
    ],
    lighting: 'Face chaude, contre-jour léger, ambiance élégante et intimiste',
    powerSupply: '3 prises 220V 16A avec terre en fond de scène',
  },
  {
    id: 'band',
    title: 'Rider 03 — Quartet Live Band',
    subtitle: 'Clavier, Basse, Batterie / Percussions traditionnelles & Voix',
    duration: 'Concert de 60 à 90 minutes (ou soirée de gala)',
    stageFootprint: '5 m × 3.5 m minimum',
    soundRequirements: [
      'Système de diffusion de façade dimensionné selon jauge salle (stéréo + subwoofers)',
      'Table de mixage 16 voies minimum avec effets intégrés',
      'Repiquage batterie (4 micros min. : Grosse caisse, Caisse claire, 2 Overheads)',
      '1 DI active pour basse électrique',
      '2 DI pour clavier de scène stéréo',
      '2 à 3 micros chant avec pieds perches',
      '3 à 4 retours de scène (ou transmission in-ears)',
    ],
    backlineProvided: [
      'Claviers de scène et synthétiseurs',
      'Percussions traditionnelles spécifiques et instruments solistes',
    ],
    backlineNeeded: [
      'Batterie acoustique complète 4 fûts + pieds de cymbales (cymbales fournies par batteur)',
      'Ampli basse 100W+ ou liaison direct DI façade',
      'Banquette batteur et praticables scène stables',
    ],
    lighting: 'Plan de feux dynamique adapté aux montées en puissance festive',
    powerSupply: '6 prises 220V 16A réparties sur 2 lignes séparées',
  },
  {
    id: 'conference',
    title: 'Rider 04 — Conférence & Masterclass',
    subtitle: 'Présentation plénière, Démonstration IA & Clavier live',
    duration: '45 minutes à 3 heures (selon format retenu)',
    stageFootprint: 'Pupitre ou scène conférence avec espace clavier',
    soundRequirements: [
      'Système de sonorisation de salle clair pour voix parlée et musique',
      '1 micro cravate ou micro serre-tête HF pour l’orateur (mains libres indispensables)',
      '1 micro main HF supplémentaire pour questions de la salle',
      '1 entrée audio Jack 3.5 mm stéréo ou Bluetooth reliée à la régie pour la station DAW',
    ],
    backlineProvided: [
      'Ordinateur portable de démonstration IA / station MAO',
      'Clavier de commande MIDI pour démonstration harmonique',
    ],
    backlineNeeded: [
      'Vidéoprojecteur Full HD / Écran LED grand format avec connectique HDMI directe',
      'Connexion Internet haut débit stable (câble Ethernet ou Wi-Fi dédié)',
      'Pupitre de conférence ou table haute pour ordinateur',
    ],
    lighting: 'Éclairage orateur net sans éblouir l’écran de vidéoprojection',
    powerSupply: '4 prises 220V 16A au pupitre de présentation',
  },
]

const INTERVIEW_TOPICS = [
  {
    title: "L'intelligence artificielle au service de la musique africaine : menace ou amplification ?",
    angle: "Comment l’IA générative et les modèles musicaux peuvent accélérer la documentation et la création sans écraser les polyrythmies patrimoniales et l’oralité.",
    tags: ['IA & Musique', 'Patrimoine', 'Technologie'],
  },
  {
    title: "Le piano-bar comme école de vie et de présence scénique depuis 2007",
    angle: "19 ans d'écoute du public, de répertoires éclectiques et de nuances acoustiques dans les lounges et palaces du Cameroun.",
    tags: ['Live Performance', 'Piano-bar', 'Carrière'],
  },
  {
    title: "Pédagogie du Permis de Jouer™ et décomplexion de l'apprentissage musical",
    angle: "Pourquoi la musique doit d'abord se vivre corporellement (Pulsation & Body) avant d'être théorisée sur partition.",
    tags: ['RMA', 'Pédagogie', 'Permis de Jouer'],
  },
  {
    title: "Le projet Tswefap : créer un système d'écriture pour sauvegarder une langue bamilékée",
    angle: "La rencontre entre recherche linguistique, notation musicale et transmission patrimoniale Batoufam.",
    tags: ['Linguistique', 'Culture', 'Tswefap'],
  },
]

export default function Press() {
  const [activeRiderId, setActiveRiderId] = useState<string>('solo')
  const [copiedRider, setCopiedRider] = useState(false)

  const activeRider = TECH_RIDERS.find((r) => r.id === activeRiderId) || TECH_RIDERS[0]

  useSeo({
    title: 'Presse & EPK | Hervé Nanfang — kit officiel',
    description:
      "Dossier de presse et Electronic Press Kit (EPK) officiel d'Hervé Nanfang : biographies multi-formats, photothèque HD, fiches techniques et contacts direct.",
    path: '/presse',
    jsonLd: [
      personSchema,
      breadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Presse & EPK', path: '/presse' },
      ]),
    ],
  })

  const copyRiderText = () => {
    const text = `FICHE TECHNIQUE & RIDER SCÉNIQUE — HERVÉ NANFANG
--------------------------------------------------
Titre : ${activeRider.title}
Sous-titre : ${activeRider.subtitle}
Durée indicative : ${activeRider.duration}
Espace scénique requis : ${activeRider.stageFootprint}

BESOINS SON :
${activeRider.soundRequirements.map((s) => `• ${s}`).join('\n')}

BACKLINE REQUIS PAR L'ORGANISATEUR :
${activeRider.backlineNeeded.map((b) => `• ${b}`).join('\n')}

MATÉRIEL FOURNI PAR L'ARTISTE :
${activeRider.backlineProvided.map((b) => `• ${b}`).join('\n')}

ÉCLAIRAGE : ${activeRider.lighting}
ALIMENTATION ÉLECTRIQUE : ${activeRider.powerSupply}
--------------------------------------------------
Contact régie & production : ${SITE.emailContact} | ${SITE.phones[0].display}`

    navigator.clipboard.writeText(text)
    setCopiedRider(true)
    setTimeout(() => setCopiedRider(false), 3000)
  }

  return (
    <>
      <PageHero
        breadcrumb="Presse & EPK"
        eyebrow="Electronic Press Kit · Espace Médias & Programmation"
        title="Ressources officielles pour programmateurs, journalistes et institutions"
        lead="Biographies prêtes à copier (de 20 à 200 mots), photothèque HD 300 DPI pour l'impression, fiches techniques scéniques (riders) et contacts directs pour interviews et programmation."
      >
        <div className="grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          <Stat value="19 ans" label="Scène live (2007)" />
          <Stat value="440+" label="Titres répertoire" />
          <Stat value="300 DPI" label="Visuels print HD" />
          <Stat value="4" label="Fiches techniques" />
        </div>
      </PageHero>

      {/* ========================================================================= */}
      {/* 1. FICHE SYNTHÉTIQUE DE L'ARTISTE                                         */}
      {/* ========================================================================= */}
      <Section tone="dark" id="fiche-artiste">
        <Reveal>
          <ChapterMark num="01" label="Fiche d'identité" />
          <Display size="md" className="mt-7 max-w-3xl">
            Repères officiels & données vérifiées
          </Display>
          <Lead className="mt-4 max-w-2xl">
            Les informations de référence indispensables pour renseigner vos programmes de festivals, fiches d'émissions ou présentations d'intervenant.
          </Lead>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="border border-white/10 bg-ink-2 p-8 h-full">
              <p className="eyebrow text-gold">Données d'identification</p>
              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-3">
                  <dt className="text-ivory/50">Nom d'autorité :</dt>
                  <dd className="font-semibold text-ivory">Hervé Nanfang</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-3">
                  <dt className="text-ivory/50">Titres & signatures :</dt>
                  <dd className="text-right text-gold">Le Pianobariste™ · Musicien Augmenté™</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-3">
                  <dt className="text-ivory/50">Disciplines :</dt>
                  <dd className="text-right text-ivory/80">Musicologie · Piano live · Pédagogie · Son</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-3">
                  <dt className="text-ivory/50">Origine & Résidence :</dt>
                  <dd className="text-ivory">Yaoundé, Cameroun (Afrique centrale)</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-3">
                  <dt className="text-ivory/50">Structure de production :</dt>
                  <dd className="text-ivory">A LAIZ PROD / ALAIZ Creative Systems</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between pt-1">
                  <dt className="text-ivory/50">Dispositif pédagogique :</dt>
                  <dd className="text-gold">Racines Musicales Academy® (RMA)</dd>
                </div>
              </dl>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="border border-gold/30 bg-ink-2/60 p-8 h-full flex flex-col justify-between">
              <div>
                <p className="eyebrow text-gold">Contact Presse & Booking direct</p>
                <h3 className="mt-4 font-display text-2xl text-ivory">
                  Disponibilité pour interviews, reportages & programmation
                </h3>
                <p className="mt-4 text-xs leading-relaxed text-ivory/65">
                  Pour planifier un entretien, demander une accréditation, recevoir un extrait d'ouvrage ou vérifier une date de tournée :
                </p>

                <div className="mt-6 space-y-3 font-mono text-xs">
                  <div className="flex items-center gap-3 text-ivory/80">
                    <span className="text-gold">✉</span>
                    <a href={`mailto:${SITE.emailContact}`} className="hover:text-gold transition-colors">
                      {SITE.emailContact}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-ivory/80">
                    <span className="text-gold">✆</span>
                    <a href={`tel:${SITE.phones[0].tel}`} className="hover:text-gold transition-colors">
                      {SITE.phones[0].display}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-ivory/80">
                    <span className="text-gold">💬</span>
                    <span>WhatsApp Booking : +237 694 72 34 92</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${SITE.phones[0].whatsapp}?text=${encodeURIComponent("Bonjour Hervé Nanfang, je vous contacte dans le cadre d'une demande presse / programmation.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold text-xs uppercase tracking-wider font-bold px-4 py-2"
                >
                  Contacter sur WhatsApp ↗
                </a>
                <Btn to="/contact#presse" variant="ghost" className="text-xs uppercase tracking-wider">
                  Formulaire presse
                </Btn>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 2. MEDIA KIT COMPLET (BIOGRAPHIES & PHOTOTHÈQUE HD)                      */}
      {/* ========================================================================= */}
      <Section tone="ink" id="media-kit">
        <Reveal>
          <ChapterMark num="02" label="Biographies & Photothèque" />
          <Display size="md" className="mt-7">
            Biographies officielles & Photos HD libres de droits
          </Display>
          <Lead className="mt-4 max-w-2xl">
            Sélectionnez la longueur de biographie adaptée à votre support et téléchargez les portraits officiels en haute résolution (300 DPI pour impression magazine et affiche).
          </Lead>
        </Reveal>

        <div className="mt-12">
          <PressMediaKit />
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 3. FICHES TECHNIQUES & RIDERS SCÉNIQUES                                   */}
      {/* ========================================================================= */}
      <Section tone="dark" id="fiches-techniques">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <ChapterMark num="03" label="Fiches Techniques & Scène" />
              <Display size="md" className="mt-6 max-w-2xl">
                Riders techniques & besoins logistiques
              </Display>
              <Lead className="mt-4 max-w-xl">
                Pour directeurs techniques, régisseurs généraux et ingénieurs du son : consultez les besoins exacts pour chaque configuration de spectacle ou conférence.
              </Lead>
            </div>

            <button
              type="button"
              onClick={copyRiderText}
              className="inline-flex items-center gap-2 border border-gold bg-gold/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gold hover:bg-gold hover:text-ink transition-colors"
            >
              <span>{copiedRider ? '✓ Fiche copiée !' : 'Copier cette fiche technique'}</span>
            </button>
          </div>
        </Reveal>

        {/* Onglets de sélection du Rider */}
        <Reveal delay={60}>
          <div className="mt-12 flex flex-wrap gap-2 border-b border-white/10 pb-4">
            {TECH_RIDERS.map((rider) => {
              const isActive = activeRiderId === rider.id
              return (
                <button
                  key={rider.id}
                  type="button"
                  onClick={() => setActiveRiderId(rider.id)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'border border-gold bg-gold text-ink shadow-[0_0_15px_rgba(198,161,91,0.3)]'
                      : 'border border-white/15 bg-white/5 text-ivory/70 hover:border-gold/40 hover:text-ivory'
                  }`}
                >
                  {rider.title.split('—')[1]?.trim() || rider.title}
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* Détail du Rider sélectionné */}
        <div className="mt-10">
          <Reveal key={activeRider.id}>
            <div className="border border-white/10 bg-ink-2 p-8 md:p-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-[0.68rem] uppercase tracking-widest text-gold font-mono">
                    Configuration technique officielle
                  </span>
                  <h3 className="mt-2 font-display text-2xl text-ivory md:text-3xl">
                    {activeRider.title}
                  </h3>
                  <p className="mt-1 text-sm text-ivory/60">{activeRider.subtitle}</p>
                </div>
                <div className="text-right">
                  <span className="text-[0.62rem] uppercase tracking-wider text-ivory/40 block">Espace requis</span>
                  <span className="font-mono text-xs font-semibold text-gold">{activeRider.stageFootprint}</span>
                </div>
              </div>

              <div className="mt-8 grid gap-8 md:grid-cols-2">
                {/* Besoins Son */}
                <div className="space-y-4">
                  <h4 className="font-display text-lg text-gold flex items-center gap-2">
                    <span>🎚</span> Besoins Son & Captation
                  </h4>
                  <ul className="space-y-2.5">
                    {activeRider.soundRequirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-ivory/75 leading-relaxed">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>

                  <h4 className="pt-4 font-display text-lg text-gold flex items-center gap-2">
                    <span>⚡</span> Énergie & Éclairage
                  </h4>
                  <div className="text-xs text-ivory/70 space-y-2">
                    <p><strong>Éclairage :</strong> {activeRider.lighting}</p>
                    <p><strong>Alimentation :</strong> {activeRider.powerSupply}</p>
                  </div>
                </div>

                {/* Backline Requis vs Fourni */}
                <div className="space-y-4">
                  <h4 className="font-display text-lg text-gold flex items-center gap-2">
                    <span>🏛</span> Backline à fournir par l'organisateur
                  </h4>
                  <ul className="space-y-2.5">
                    {activeRider.backlineNeeded.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-ivory/75 leading-relaxed">
                        <span className="text-crimson font-bold">□</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <h4 className="pt-4 font-display text-lg text-gold flex items-center gap-2">
                    <span>✓</span> Matériel fourni par Hervé Nanfang
                  </h4>
                  <ul className="space-y-2.5">
                    {activeRider.backlineProvided.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-ivory/75 leading-relaxed">
                        <span className="text-gold font-bold">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-ivory/50">
                  Durée recommandée : <strong className="text-ivory">{activeRider.duration}</strong>
                </span>
                <button
                  type="button"
                  onClick={copyRiderText}
                  className="text-xs font-semibold uppercase tracking-wider text-gold hover:text-gold-2 underline underline-offset-4"
                >
                  {copiedRider ? '✓ Texte copié !' : 'Copier cette fiche'}
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 4. THÉMATIQUES D'INTERVIEW POUR JOURNALISTES                              */}
      {/* ========================================================================= */}
      <Section tone="ink" id="angles-presse">
        <Reveal>
          <ChapterMark num="04" label="Angles Médias" />
          <Display size="md" className="mt-7 max-w-3xl">
            Sujets d'interviews & thématiques d'émissions
          </Display>
          <Lead className="mt-4 max-w-2xl">
            Quatre angles forts déjà validés pour les émissions de radio, podcasts culturels, plateaux TV et chroniques de presse écrite.
          </Lead>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {INTERVIEW_TOPICS.map((topic, i) => (
            <Reveal key={topic.title} delay={i * 80}>
              <SpotlightCard className="flex h-full flex-col justify-between border-white/10 bg-ink p-7">
                <div>
                  <div className="flex flex-wrap gap-2">
                    {topic.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                  <h3 className="mt-4 font-display text-xl text-ivory leading-snug">
                    {topic.title}
                  </h3>
                  <Rule className="my-4 opacity-25" />
                  <p className="text-xs leading-relaxed text-ivory/65">{topic.angle}</p>
                </div>
                <div className="mt-6 border-t border-white/5 pt-4">
                  <ArrowLink to="/contact#presse">Proposer un entretien sur ce sujet</ArrowLink>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand
        eyebrow="Programmation & Réservations"
        title="Une question de calendrier ou une demande d’interview ?"
        text="L’équipe de production répond sous 24 à 48 heures pour toute demande institutionnelle, médiatique ou événementielle."
        primary={{ label: 'Demander une accréditation', to: '/contact#presse' }}
        secondary={{ label: 'Écouter la musique', to: '/musique' }}
      />
    </>
  )
}
