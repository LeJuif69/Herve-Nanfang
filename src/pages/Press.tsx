import { useState } from 'react'
import PageHero from '../components/PageHero'
import { PressBiographies, PressVisualsGallery } from '../components/PressMediaKit'
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
      'Ampli basse 100W+ ou liaison directe DI façade',
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
      '1 entrée audio Jack 3.5 mm stéréo ou liaison console pour la station de démonstration MAO',
    ],
    backlineProvided: [
      'Ordinateur portable de démonstration IA / station MAO',
      'Clavier de commande MIDI pour démonstration harmonique',
    ],
    backlineNeeded: [
      'Vidéoprojecteur Full HD / Écran LED grand format avec connectique HDMI directe',
      'Connexion Internet stable (câble Ethernet ou Wi-Fi dédié)',
      'Pupitre de conférence ou table haute pour ordinateur',
    ],
    lighting: 'Éclairage orateur net sans éblouir l’écran de vidéoprojection',
    powerSupply: '4 prises 220V 16A au pupitre de présentation',
  },
]

const INTERVIEW_TOPICS = [
  {
    title: 'Musique et scène live',
    angle: 'Le piano-bar comme espace d’interprétation, d’écoute active et d’adaptation permanente au public. Retour sur 19 ans d’expérience continue de la scène (depuis 2007) dans les lounges, palaces et événements du Cameroun et d’Afrique centrale.',
    tags: ['Live Performance', 'Piano-bar', 'Scène & Répertoire'],
  },
  {
    title: 'Musicologie et patrimoines',
    angle: 'Analyse musicale, transmission orale, documentation culturelle et place des savoirs locaux. Comment concilier rigueur universitaire, sauvegarde des polyrythmies patrimoniales et valorisation des répertoires d’Afrique centrale.',
    tags: ['Musicologie', 'Patrimoine', 'Transmission orale'],
  },
  {
    title: 'Pédagogie musicale & Permis de Jouer™',
    angle: 'Apprentissage par la pratique, développement de l’écoute, coordination corporelle et conception de parcours de formation. Pourquoi la musique doit d’abord se vivre (Pulsation & Body) avant d’être formalisée sur partition.',
    tags: ['Pédagogie', 'Permis de Jouer™', 'RMA'],
  },
  {
    title: 'Intelligence artificielle et création',
    angle: 'Possibilités, limites et responsabilités liées à l’intégration de l’IA dans les métiers de la musique. Le concept de « Musicien Augmenté » : l’IA prolonge le temps d’exploration sans remplacer le jugement artistique ni la puissance du live.',
    tags: ['IA & Musique', 'Musicien Augmenté™', 'Éthique'],
  },
  {
    title: 'Musique et médias',
    angle: 'Composition, analyse sonore et relations dynamiques entre musique, image et narration. Recherches appliquées aux bandes originales de films, jeux vidéo et identités sonores audiovisuelles.',
    tags: ['Musique à l’image', 'Cinéma', 'Design sonore'],
  },
  {
    title: 'Tswefap et documentation linguistique',
    angle: 'Enjeux de formalisation et de transmission du patrimoine linguistique et culturel batoufam. La rencontre féconde entre notation musicale, structure linguistique et préservation des traditions orales vivantes.',
    tags: ['Tswefap', 'Linguistique', 'Patrimoine Batoufam'],
  },
]

const REFERENCE_PRESENTATION_TEXT = `Hervé Nanfang développe une pratique professionnelle à la croisée de l’interprétation musicale, de la recherche, de la pédagogie et des technologies créatives.

À travers son travail de PianoBariste, il explore la relation entre le répertoire, l’écoute, l’adaptation au public et la présence scénique. Son parcours en musicologie et en ingénierie du son nourrit également ses activités de formation, de conception pédagogique et d’analyse des musiques appliquées aux médias.

Ses recherches et projets s’intéressent notamment à la transmission des savoirs musicaux, aux patrimoines culturels, à la documentation des traditions orales et aux possibilités offertes par les outils numériques et l’intelligence artificielle.

Son approche du « Musicien Augmenté » repose sur un principe : la technologie peut élargir les capacités d’exploration, de création et de transmission, mais la responsabilité, le jugement artistique et la relation au public restent humains.`

export default function Press() {
  const [activeRiderId, setActiveRiderId] = useState<string>('solo')
  const [copiedRider, setCopiedRider] = useState(false)
  const [copiedPresentation, setCopiedPresentation] = useState(false)

  const activeRider = TECH_RIDERS.find((r) => r.id === activeRiderId) || TECH_RIDERS[0]

  useSeo({
    title: 'Presse & Médias | Hervé Nanfang — Espace officiel & EPK',
    description:
      'Espace officiel de presse d’Hervé Nanfang : présentation de référence, biographies multi-formats, photothèque haute définition, fiches techniques et contact direct.',
    path: '/presse',
    jsonLd: [
      personSchema,
      breadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Presse & Médias', path: '/presse' },
      ]),
    ],
  })

  const copyPresentationText = async () => {
    try {
      await navigator.clipboard.writeText(REFERENCE_PRESENTATION_TEXT)
      setCopiedPresentation(true)
      setTimeout(() => setCopiedPresentation(false), 3000)
    } catch {
      // fallback
    }
  }

  const copyRiderText = () => {
    const text = `FICHE TECHNIQUE & RIDER SCÉNIQUE — HERVÉ NANFANG
--------------------------------------------------
Configuration : ${activeRider.title}
Sous-titre : ${activeRider.subtitle}
Durée indicative : ${activeRider.duration}
Espace scénique requis : ${activeRider.stageFootprint}

BESOINS SON & CAPTATION :
${activeRider.soundRequirements.map((s) => `• ${s}`).join('\n')}

BACKLINE À FOURNIR PAR L'ORGANISATEUR :
${activeRider.backlineNeeded.map((b) => `• ${b}`).join('\n')}

MATÉRIEL FOURNI PAR L'ARTISTE :
${activeRider.backlineProvided.map((b) => `• ${b}`).join('\n')}

ÉCLAIRAGE : ${activeRider.lighting}
ALIMENTATION ÉLECTRIQUE : ${activeRider.powerSupply}

NOTE IMPORTANTE : Les besoins définitifs dépendent du lieu, du format et des équipements disponibles. La fiche technique doit être confirmée avec l'organisateur avant chaque prestation.
--------------------------------------------------
Contact régie & production : ${SITE.emailContact} | WhatsApp : +237 694 72 34 92
Site officiel : https://hervenanfang.vercel.app`

    navigator.clipboard.writeText(text)
    setCopiedRider(true)
    setTimeout(() => setCopiedRider(false), 3000)
  }

  return (
    <>
      {/* ========================================================================= */}
      {/* EN-TÊTE PRESSE                                                            */}
      {/* ========================================================================= */}
      <PageHero
        breadcrumb="Presse & Médias"
        eyebrow="Musique · Musicologie · Pédagogie · Culture · Innovation"
        title="Hervé Nanfang — Espace officiel de presse et de programmation"
        lead="Bienvenue dans l’espace presse officiel de Hervé Nanfang, artiste-musicien, musicologue, pédagogue et ingénieur du son basé à Yaoundé, au Cameroun. Cet espace rassemble les informations de référence, biographies, portraits, ressources professionnelles et fiches techniques nécessaires à la préparation d’articles, d’interviews, de reportages, de conférences et de programmations artistiques. Journalistes, rédactions, médias audiovisuels, programmateurs, institutions culturelles et partenaires peuvent y consulter les informations essentielles et adresser leurs demandes directement."
      >
        <div className="grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          <Stat value="2007" label="Scène live (19 ans)" />
          <Stat value="Évolutif" label="Plusieurs centaines de titres" />
          <Stat value="Haute rés." label="Photothèque officielle" />
          <Stat value="4" label="Fiches techniques" />
        </div>

        {/* Navigation rapide entre sections */}
        <div className="mt-8 flex flex-wrap gap-2 text-xs font-mono">
          <a
            href="#presentation"
            className="rounded border border-white/15 bg-white/5 px-3 py-1.5 text-ivory/70 transition-colors hover:border-gold/50 hover:text-gold"
          >
            01 Présentation
          </a>
          <a
            href="#biographies"
            className="rounded border border-white/15 bg-white/5 px-3 py-1.5 text-ivory/70 transition-colors hover:border-gold/50 hover:text-gold"
          >
            02 Biographies
          </a>
          <a
            href="#phototheque"
            className="rounded border border-white/15 bg-white/5 px-3 py-1.5 text-ivory/70 transition-colors hover:border-gold/50 hover:text-gold"
          >
            03 Photothèque
          </a>
          <a
            href="#fiches-techniques"
            className="rounded border border-white/15 bg-white/5 px-3 py-1.5 text-ivory/70 transition-colors hover:border-gold/50 hover:text-gold"
          >
            04 Fiches techniques
          </a>
          <a
            href="#interviews"
            className="rounded border border-white/15 bg-white/5 px-3 py-1.5 text-ivory/70 transition-colors hover:border-gold/50 hover:text-gold"
          >
            05 Sujets d'interview
          </a>
          <a
            href="#demandes-presse"
            className="rounded border border-gold/40 bg-gold/10 px-3 py-1.5 text-gold font-semibold transition-colors hover:bg-gold hover:text-ink"
          >
            06 Demandes presse
          </a>
        </div>
      </PageHero>

      {/* ========================================================================= */}
      {/* 01 — PRÉSENTATION DE RÉFÉRENCE                                            */}
      {/* ========================================================================= */}
      <Section tone="dark" id="presentation">
        <Reveal>
          <ChapterMark num="01" label="Présentation de référence" />
          <Display size="md" className="mt-7 max-w-3xl">
            Présentation officielle & repères d’autorité
          </Display>
          <Lead className="mt-4 max-w-2xl">
            Un texte de référence immédiatement exploitable par les rédactions culturelles, comités de programmation et institutions partenaires.
          </Lead>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Texte de présentation vérifié */}
          <Reveal>
            <div className="flex h-full flex-col justify-between border border-gold/30 bg-ink-2/80 p-8">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="eyebrow text-gold">Texte court immédiatement diffusable</span>
                  <button
                    type="button"
                    onClick={copyPresentationText}
                    className="inline-flex items-center gap-1.5 rounded border border-gold/40 bg-gold/10 px-3 py-1 text-[0.72rem] font-mono uppercase tracking-wider text-gold hover:bg-gold hover:text-ink transition-colors"
                  >
                    <span>{copiedPresentation ? '✓ Copié !' : 'Copier ce texte'}</span>
                  </button>
                </div>

                <div className="mt-6 space-y-4 text-sm leading-relaxed text-ivory/85">
                  <p>
                    Hervé Nanfang développe une pratique professionnelle à la croisée de l’interprétation musicale, de la recherche, de la pédagogie et des technologies créatives.
                  </p>
                  <p>
                    À travers son travail de PianoBariste, il explore la relation entre le répertoire, l’écoute, l’adaptation au public et la présence scénique. Son parcours en musicologie et en ingénierie du son nourrit également ses activités de formation, de conception pédagogique et d’analyse des musiques appliquées aux médias.
                  </p>
                  <p>
                    Ses recherches et projets s’intéressent notamment à la transmission des savoirs musicaux, aux patrimoines culturels, à la documentation des traditions orales et aux possibilités offertes par les outils numériques et l’intelligence artificielle.
                  </p>
                  <p>
                    Son approche du « Musicien Augmenté » repose sur un principe : la technologie peut élargir les capacités d’exploration, de création et de transmission, mais la responsabilité, le jugement artistique et la relation au public restent humains.
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-white/10 pt-4 text-[0.75rem] text-ivory/45">
                Texte validé pour notices de programmes, catalogues de festivals et dossiers d’intervenants.
              </div>
            </div>
          </Reveal>

          {/* Fiche d'identification */}
          <Reveal delay={100}>
            <div className="flex h-full flex-col justify-between border border-white/10 bg-ink-2 p-8">
              <div>
                <span className="eyebrow text-gold">Données d’identification vérifiées</span>
                <dl className="mt-6 space-y-3.5 text-xs sm:text-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2.5">
                    <dt className="text-ivory/50">Nom d’autorité :</dt>
                    <dd className="font-semibold text-ivory">Hervé Nanfang</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2.5">
                    <dt className="text-ivory/50">Titres & signatures :</dt>
                    <dd className="text-right text-gold">Le Pianobariste™ · Musicien Augmenté™</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2.5">
                    <dt className="text-ivory/50">Disciplines :</dt>
                    <dd className="text-right text-ivory/80">Piano live · Musicologie · Pédagogie · Son & IA</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2.5">
                    <dt className="text-ivory/50">Origine & Résidence :</dt>
                    <dd className="text-ivory">Yaoundé, Cameroun (Mobilité internationale)</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2.5">
                    <dt className="text-ivory/50">Structure & Production exécutive :</dt>
                    <dd className="text-ivory font-semibold text-gold-2">Alaiz Creative System</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2.5">
                    <dt className="text-ivory/50">Dispositif pédagogique :</dt>
                    <dd className="text-ivory/80">Racines Musicales Academy® (RMA) & Permis de Jouer™</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between pt-1">
                    <dt className="text-ivory/50">Documentation patrimoniale :</dt>
                    <dd className="text-ivory/80">Projet Tswefap (langue et patrimoine batoufam)</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6">
                <a
                  href="#demandes-presse"
                  className="btn btn-gold text-xs uppercase tracking-wider font-bold px-4 py-2"
                >
                  Adresser une demande presse
                </a>
                <Btn to="/contact#presse" variant="ghost" className="text-xs uppercase tracking-wider">
                  Formulaire direct
                </Btn>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 02 — BIOGRAPHIES OFFICIELLES                                              */}
      {/* ========================================================================= */}
      <Section tone="ink" id="biographies">
        <Reveal>
          <ChapterMark num="02" label="Biographies officielles" />
          <Display size="md" className="mt-7">
            Biographies multi-formats (20 à 300 mots)
          </Display>
          <Lead className="mt-4 max-w-3xl">
            Plusieurs versions de la biographie sont proposées selon vos besoins éditoriaux. Sélectionnez le format adapté à votre support pour le copier en un clic ou le télécharger au format texte (.txt).
          </Lead>
        </Reveal>

        <div className="mt-12">
          <PressBiographies />
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 03 — PHOTOTHÈQUE ET IDENTITÉ VISUELLE                                     */}
      {/* ========================================================================= */}
      <Section tone="dark" id="phototheque">
        <Reveal>
          <ChapterMark num="03" label="Photothèque & Identité Visuelle" />
          <Display size="md" className="mt-7">
            Portraits officiels, scènes live & identité visuelle
          </Display>
          <Lead className="mt-4 max-w-3xl">
            Visuels autorisés pour les rédactions, affichages culturels, programmes de concerts et dossiers institutionnels. Téléchargements directs en format web et fichiers masters haute définition.
          </Lead>
        </Reveal>

        <div className="mt-12">
          <PressVisualsGallery />
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 04 — FICHES TECHNIQUES ET PROGRAMMATION                                   */}
      {/* ========================================================================= */}
      <Section tone="ink" id="fiches-techniques">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <ChapterMark num="04" label="Fiches Techniques & Programmation" />
              <Display size="md" className="mt-6 max-w-2xl">
                Configurations scéniques & besoins techniques (Riders)
              </Display>
              <Lead className="mt-4 max-w-2xl">
                Les ressources techniques présentent les principales configurations envisageables : piano-bar solo, duo piano et voix, formation live en groupe, et conférence/masterclass autour de la musique et des technologies créatives.
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

        <div className="mt-8 border border-white/10 bg-ink-2/40 p-4 text-xs text-ivory/65 leading-relaxed">
          <p>
            <strong>Règle de régie :</strong> Les besoins définitifs dépendent du lieu, du format, de la jauge, du programme et des équipements disponibles. La fiche technique doit donc être confirmée avec l’organisateur avant chaque prestation.
          </p>
        </div>

        {/* Onglets de sélection du Rider */}
        <Reveal delay={60}>
          <div className="mt-10 flex flex-wrap gap-2 border-b border-white/10 pb-4">
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
        <div className="mt-8">
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
      {/* 05 — SUJETS D’INTERVIEW ET D’INTERVENTION                                  */}
      {/* ========================================================================= */}
      <Section tone="dark" id="interviews">
        <Reveal>
          <ChapterMark num="05" label="Sujets d’interview et d’intervention" />
          <Display size="md" className="mt-7 max-w-3xl">
            Angles journalistiques & propositions d'intervention
          </Display>
          <Lead className="mt-4 max-w-2xl">
            Les sujets suivants peuvent servir de point de départ à une proposition éditoriale. Les angles, formats et disponibilités peuvent être adaptés au média, au public visé et au calendrier.
          </Lead>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {INTERVIEW_TOPICS.map((topic, i) => (
            <Reveal key={topic.title} delay={i * 60}>
              <SpotlightCard className="flex h-full flex-col justify-between border-white/10 bg-ink-2 p-7">
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
                  <p className="text-xs leading-relaxed text-ivory/70">{topic.angle}</p>
                </div>
                <div className="mt-6 border-t border-white/5 pt-4">
                  <ArrowLink
                    to={`mailto:hervenanfang@gmail.com?subject=${encodeURIComponent(`[Interview / Presse] Sujet : ${topic.title}`)}`}
                  >
                    Proposer un entretien sur ce sujet
                  </ArrowLink>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 06 — DEMANDES PRESSE ET PARTENARIATS                                      */}
      {/* ========================================================================= */}
      <Section tone="ink" id="demandes-presse">
        <Reveal>
          <ChapterMark num="06" label="Demandes presse et partenariats" />
          <Display size="md" className="mt-7 max-w-3xl">
            Procédure d’accréditation & contact officiel
          </Display>
          <Lead className="mt-4 max-w-3xl">
            Le service presse reçoit les demandes relatives aux interviews, portraits, reportages, photographies, conférences, masterclasses, programmations artistiques et collaborations institutionnelles.
          </Lead>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          {/* Guide de cadrage pour les journalistes */}
          <Reveal>
            <div className="border border-white/10 bg-ink-2 p-8 h-full flex flex-col justify-between">
              <div>
                <p className="eyebrow text-gold">Cadrage de votre demande</p>
                <h3 className="mt-3 font-display text-2xl text-ivory">
                  Pour faciliter le traitement de votre demande
                </h3>
                <p className="mt-3 text-xs text-ivory/65 leading-relaxed">
                  Afin de vous répondre dans les meilleures conditions et de mobiliser les ressources adaptées à vos délais de diffusion, merci d’indiquer :
                </p>

                <ul className="mt-6 space-y-3 font-sans text-xs text-ivory/80 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono text-gold font-bold">01.</span>
                    <span><strong>Le média ou l’organisation</strong> (nom de la publication, émission ou festival).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono text-gold font-bold">02.</span>
                    <span><strong>Le nom et les coordonnées du demandeur</strong> (journaliste, programmateur, régisseur).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono text-gold font-bold">03.</span>
                    <span><strong>Le sujet et le format envisagés</strong> (interview écrite, plateau radio/TV, podcast, captation).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono text-gold font-bold">04.</span>
                    <span><strong>Les délais éditoriaux ou la date de l’événement</strong> (impératifs de bouclage).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono text-gold font-bold">05.</span>
                    <span><strong>Les ressources souhaitées</strong> (visuels haute définition, audio, extraits de textes).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono text-gold font-bold">06.</span>
                    <span><strong>Les conditions de publication ou de diffusion</strong> (date d'antenne, parution).</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 border-t border-white/10 pt-4 text-xs text-ivory/50">
                Les demandes sont examinées en fonction de leur nature, des disponibilités et des informations fournies. Un traitement direct selon vos impératifs de bouclage vous sera garanti dès réception.
              </div>
            </div>
          </Reveal>

          {/* Coordonnées & Canaux directs */}
          <Reveal delay={100}>
            <div className="border border-gold/40 bg-ink-2/70 p-8 h-full flex flex-col justify-between">
              <div>
                <p className="eyebrow text-gold">Canaux professionnels officiels</p>
                <h3 className="mt-3 font-display text-2xl text-ivory">
                  Contact direct du service presse
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-ivory/65">
                  Pour les demandes urgentes ou liées à une programmation à brève échéance, privilégiez le contact par courriel ou WhatsApp direct.
                </p>

                <div className="mt-6 space-y-4 font-mono text-xs">
                  <div className="border-b border-white/5 pb-3">
                    <span className="text-[0.68rem] text-ivory/40 uppercase block font-sans">Courriel professionnel</span>
                    <a
                      href="mailto:hervenanfang@gmail.com?subject=[Demande%20Presse%20%2F%20M%C3%A9dia]%20Demande%20d%27interview%20ou%20ressources&body=Bonjour%20Herv%C3%A9%20Nanfang%2C%0A%0AVoici%20les%20%C3%A9l%C3%A9ments%20de%20notre%20demande%20%3A%0A1.%20M%C3%A9dia%20%2F%20Organisation%20%3A%20%0A2.%20Nom%20et%20coordonn%C3%A9es%20%3A%20%0A3.%20Sujet%20et%20format%20envisag%C3%A9s%20%3A%20%0A4.%20D%C3%A9lai%20%C3%A9ditorial%20ou%20date%20%3A%20%0A5.%20Ressources%20souhait%C3%A9es%20%3A%20%0A6.%20Conditions%20de%20diffusion%20%3A%20%0A%0ABien%20cordialement%2C"
                      className="text-gold hover:text-gold-2 text-sm font-semibold transition-colors mt-1 block"
                    >
                      {SITE.emailContact}
                    </a>
                  </div>

                  <div className="border-b border-white/5 pb-3">
                    <span className="text-[0.68rem] text-ivory/40 uppercase block font-sans">WhatsApp Presse Direct</span>
                    <a
                      href={`https://wa.me/${SITE.phones[0].whatsapp}?text=${encodeURIComponent("Bonjour Hervé Nanfang, je vous contacte dans le cadre d'une demande presse / programmation.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ivory hover:text-gold text-sm font-semibold transition-colors mt-1 block"
                    >
                      +237 694 72 34 92 ↗
                    </a>
                  </div>

                  <div>
                    <span className="text-[0.68rem] text-ivory/40 uppercase block font-sans">Site officiel de référence</span>
                    <a
                      href="https://hervenanfang.vercel.app"
                      className="text-ivory/70 hover:text-gold text-xs transition-colors mt-1 block"
                    >
                      https://hervenanfang.vercel.app
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <a
                  href="mailto:hervenanfang@gmail.com?subject=[Demande%20Presse%20%2F%20M%C3%A9dia]%20Demande%20d%27interview%20ou%20ressources&body=Bonjour%20Herv%C3%A9%20Nanfang%2C%0A%0AVoici%20les%20%C3%A9l%C3%A9ments%20de%20notre%20demande%20%3A%0A1.%20M%C3%A9dia%20%2F%20Organisation%20%3A%20%0A2.%20Nom%20et%20coordonn%C3%A9es%20%3A%20%0A3.%20Sujet%20et%20format%20envisag%C3%A9s%20%3A%20%0A4.%20D%C3%A9lai%20%C3%A9ditorial%20ou%20date%20%3A%20%0A5.%20Ressources%20souhait%C3%A9es%20%3A%20%0A6.%20Conditions%20de%20diffusion%20%3A%20%0A%0ABien%20cordialement%2C"
                  className="btn btn-gold text-xs uppercase tracking-wider font-bold w-full text-center py-2.5 block"
                >
                  Envoyer une demande par email
                </a>
                <Btn to="/contact#presse" variant="ghost" className="text-xs uppercase tracking-wider w-full text-center">
                  Accéder au formulaire presse
                </Btn>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* BANDEAU FINAL CTA                                                         */}
      {/* ========================================================================= */}
      <CtaBand
        eyebrow="Relations Presse & Programmation"
        title="Une échéance éditoriale ou un projet de programmation ?"
        text="Transmettez vos délais de bouclage ou vos dates d’événement. L’équipe de production examine chaque demande avec la réactivité exigée par vos impératifs de diffusion."
        primary={{ label: 'Adresser une demande presse', to: '/contact#presse' }}
        secondary={{ label: 'Découvrir la musique', to: '/musique' }}
      />
    </>
  )
}
