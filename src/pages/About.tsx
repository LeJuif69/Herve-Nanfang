import portrait from '../assets/portrait.webp'
import affiche from '../assets/affiche-pianobariste.webp'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import {
  Body,
  Btn,
  ChapterMark,
  CtaBand,
  Display,
  Eyebrow,
  Lead,
  Reveal,
  Rule,
  Section,
  SpotlightCard,
  Stat,
  Tag,
} from '../components/ui'
import { MASTER_IDENTITY, IDENTITY } from '../data/identity'
import { PILLARS } from '../data/site'
import { breadcrumbSchema, personSchema } from '../lib/schema'
import { useSeo } from '../lib/seo'
import CareerTimeline from '../components/CareerTimeline'
import PressMediaKit from '../components/PressMediaKit'
import { useLiveMedia } from '../lib/useLiveContent'

export default function About() {
  const portraitMedia = useLiveMedia('med-about-portrait', portrait, 50, 28)
  useSeo({
    title: 'Hervé Nanfang | Parcours, Musique, MAO, Pédagogie & IA',
    description:
      "Hervé Nanfang, musicien, musicologue, pédagogue et ingénieur du son camerounais : création musicale, transmission, MAO et intelligence artificielle.",
    path: '/a-propos',
    jsonLd: [
      personSchema,
      breadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'À propos', path: '/a-propos' },
      ]),
    ],
  })

  return (
    <>
      <PageHero
        breadcrumb="À propos"
        eyebrow="Hervé Nanfang"
        title={
          <>
            Artiste-musicien, musicologue,
            <br />
            pédagogue & spécialiste IA
          </>
        }
        lead={MASTER_IDENTITY.positionnement.propositionValeur}
      >
        <div className="space-y-6">
          <div className="grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            <Stat value="2007" label="Débuts live" />
            <Stat value="4" label="Dimensions" />
            <Stat value="7" label="Signatures & œuvres" />
            <Stat value="∞" label="Trajectoire" />
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="https://canva.link/2l6atbuzkax2k6g"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-gold bg-gold/90 px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink transition-all hover:bg-gold hover:shadow-md hover:shadow-gold/20"
            >
              <span>Portfolio & CV Officiel (Canva)</span>
              <span>↗</span>
            </a>
            <a
              href="#chronologie"
              className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ivory/80 transition-colors hover:border-gold/50 hover:text-gold"
            >
              <span>Chronologie interactive (2007–2026)</span>
              <span>↓</span>
            </a>
            <a
              href="#media-kit"
              className="inline-flex items-center gap-2 border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gold-2 transition-colors hover:bg-gold hover:text-ink"
            >
              <span>Dossier de Presse & Media Kit</span>
              <span>↓</span>
            </a>
          </div>
        </div>
      </PageHero>

      {/* ========================= BIOGRAPHIE ========================= */}
      <Section tone="dark">
        <div className="grid gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <Reveal>
            <ChapterMark num="01" label="Biographie" />
            <div className="mt-8 space-y-7 text-[15px] leading-[1.95] text-ivory/70 md:text-[1.05rem]">
              {MASTER_IDENTITY.biographie.aPropos.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <blockquote className="border-l-2 border-gold/60 pl-6">
                <p className="font-display text-2xl leading-snug text-gold md:text-3xl">
                  {MASTER_IDENTITY.concepts.musicienAugmente.principe}
                </p>
              </blockquote>
              <p>{MASTER_IDENTITY.concepts.musicienAugmente.definition}</p>
            </div>

            {/* Désambiguïsation */}
            <p className="mt-8 border-l-2 border-white/10 pl-5 text-[0.8rem] leading-relaxed text-ivory/40 italic">
              {IDENTITY.desambiguisation}
            </p>

            <Rule className="my-12" />

            {/* Quatre verbes */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {PILLARS.map((p) => (
                <div key={p.verb}>
                  <p className="font-display text-3xl text-ivory">{p.verb}</p>
                  <p className="mt-2 text-[0.65rem] uppercase tracking-[0.18em] text-gold/70">
                    {p.keywords}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Portrait */}
          <Reveal delay={120} className="lg:sticky lg:top-32">
            <figure className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <img
                src={portraitMedia.url || '/images/shooting-pro-officiel.webp'}
                alt={portraitMedia.alt || "Portrait officiel d’Hervé Nanfang"}
                width={1280}
                height={853}
                loading="lazy"
                style={portraitMedia.style}
                onError={(e) => {
                  if (!e.currentTarget.src.includes('/images/shooting-pro-officiel.webp')) {
                    e.currentTarget.src = '/images/shooting-pro-officiel.webp'
                  }
                }}
                className="zoomable w-full object-cover"
              />
              <figcaption className="mt-4 text-[0.68rem] uppercase tracking-[0.18em] text-ivory/40">
                Portrait officiel · Yaoundé, Cameroun
              </figcaption>
            </figure>
            <div className="mt-8 border border-white/10 p-6">
              <Eyebrow>Signature</Eyebrow>
              <p className="mt-4 font-display text-[1.3rem] text-ivory md:text-2xl">
                Créer. Transmettre. Augmenter. Développer.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ivory/55">
                {MASTER_IDENTITY.identite.rolesLine}
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ========================= TRAJECTOIRE INTELLECTUELLE ========================= */}
      <Section tone="ink">
        <Reveal>
          <ChapterMark num="02" label="Trajectoire intellectuelle" />
          <div className="mt-7 grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-end">
            <Display size="md">Sept étapes, une seule logique</Display>
            <Body className="lg:pb-2">
              Le parcours d'Hervé Nanfang n'est pas une collection de métiers juxtaposés.
              C'est une trajectoire cohérente où chaque étape prépare la suivante — de la scène
              à l'intelligence artificielle, en passant par le son, la connaissance, la pédagogie
              et la communication.
            </Body>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MASTER_IDENTITY.trajectoire.slice(0, 4).map((step, i) => (
            <Reveal key={step.etape} delay={i * 60}>
              <Link to={step.to} className="group block h-full">
                <SpotlightCard className="flex h-full flex-col border-white/10 bg-ink p-7 transition-colors group-hover:border-gold/40">
                  <span className="font-display text-4xl text-gold/25">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-4 font-display text-xl text-ivory group-hover:text-gold-2 transition-colors">
                    {step.etape}
                  </h3>
                  <p className="mt-2 text-[0.68rem] uppercase tracking-[0.15em] text-ivory/40">
                    {step.resume}
                  </p>
                  <Rule className="opacity-20 my-4" />
                  <p className="text-sm leading-relaxed text-ivory/55 flex-1">{step.apport}</p>
                </SpotlightCard>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MASTER_IDENTITY.trajectoire.slice(4).map((step, i) => (
            <Reveal key={step.etape} delay={(i + 4) * 60}>
              <Link to={step.to} className="group block h-full">
                <SpotlightCard className="flex h-full flex-col border-white/10 bg-ink p-7 transition-colors group-hover:border-gold/40">
                  <span className="font-display text-4xl text-gold/25">{String(i + 5).padStart(2, '0')}</span>
                  <h3 className="mt-4 font-display text-xl text-ivory group-hover:text-gold-2 transition-colors">
                    {step.etape}
                  </h3>
                  <p className="mt-2 text-[0.68rem] uppercase tracking-[0.15em] text-ivory/40">
                    {step.resume}
                  </p>
                  <Rule className="opacity-20 my-4" />
                  <p className="text-sm leading-relaxed text-ivory/55 flex-1">{step.apport}</p>
                </SpotlightCard>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-10 text-center text-[0.68rem] uppercase tracking-[0.2em] text-ivory/30">
            Trajectoire — De la scène à l'innovation culturelle
          </p>
        </Reveal>
      </Section>

      {/* ========================= CHRONOLOGIE INTERACTIVE ========================= */}
      <Section tone="dark" id="chronologie">
        <Reveal>
          <ChapterMark num="03" label="Chronologie Interactive" />
          <Display size="md" className="mt-7">
            De 2007 à aujourd'hui : chaque étape a préparé la suivante
          </Display>
          <Lead className="mt-6 max-w-3xl">
            Du piano-bar acoustique aux scènes de prestige, de l'ingénierie sonore à la fondation de la Racines Musicales Academy et aux recherches sur le Musicien Augmenté : naviguez à travers les jalons structurants du parcours.
          </Lead>
        </Reveal>

        <div className="mt-14">
          <CareerTimeline />
        </div>
      </Section>

      {/* ========================= COMPÉTENCES ========================= */}
      <Section tone="ink">
        <Reveal>
          <ChapterMark num="04" label="Compétences" />
          <Display size="md" className="mt-7">
            Une pratique large, structurée par domaines
          </Display>
          <Lead className="mt-6 max-w-3xl">
            Cette combinaison est rare : elle permet de tenir un projet de bout en bout — de la
            première note à la transmission, jusqu'à sa diffusion numérique et son impact
            institutionnel.
          </Lead>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MASTER_IDENTITY.expertises.map((block, i) => (
            <Reveal key={block.domaine} delay={i * 70}>
              <SpotlightCard className="flex h-full flex-col border-white/10 bg-ink p-7">
                <h3 className="font-display text-2xl text-ivory">{block.domaine}</h3>
                <Rule className="opacity-30 my-4" />
                <div className="mt-2 flex flex-wrap gap-2">
                  {block.items.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ========================= IDENTITÉ ARTISTIQUE (AFFICHE) ========================= */}
      <Section tone="dark">
        <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <Reveal>
            <img
              src={affiche}
              alt="Affiche Le Pianobariste"
              width={1024}
              height={1536}
              loading="lazy"
              onError={(e) => {
                if (!e.currentTarget.src.includes('/images/affiche-pianobariste.webp')) {
                  e.currentTarget.src = '/images/affiche-pianobariste.webp'
                }
              }}
              className="zoomable w-full max-w-sm object-cover"
            />
          </Reveal>
          <Reveal delay={120}>
            <ChapterMark num="05" label="Identité artistique" />
            <Display size="md" className="mt-7">
              « I don't perform. I set the mood. »
            </Display>
            <Body className="mt-7 max-w-2xl">
              Le Pianobariste n'est pas un pseudonyme : c'est un format, un positionnement et une
              promesse. Un musicien qui ne se contente pas de jouer des morceaux, mais qui compose
              l'atmosphère d'un lieu — hôtels, lounges, événements privés — avec la précision d'un
              métier acquis depuis 2007.
            </Body>
            <Body className="mt-5 max-w-2xl">
              Répertoire international (jazz, bossa, soul, musiques africaines, variétés) adapté
              en temps réel au contexte, au lieu et au public. Chaque prestation est unique.
            </Body>
            <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3 text-[0.68rem] uppercase tracking-[0.2em] text-ivory/45">
              <span>Live piano</span>
              <span>Live mood</span>
              <span>Live experience</span>
            </div>
            <div className="mt-10 flex flex-wrap gap-5">
              <Btn to="/musique" variant="gold">
                Voir la page Musique
              </Btn>
              <Btn to="/contact#booking" variant="ghost">
                Réserver une prestation
              </Btn>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ========================= MANIFESTE & SIGNATURES ========================= */}
      <Section tone="ink">
        <Reveal>
          <ChapterMark num="06" label="Architecture & Signatures" />
          <Display size="md" className="mt-7">
            Un manifeste fondateur, trois signatures, des œuvres durables
          </Display>
          <Body className="mt-6 max-w-2xl">
            <strong>A Laiz Ô Pays</strong> est le manifeste artistique et culturel fondateur de Hervé Nanfang :
            être enraciné dans sa culture d'origine pour créer, transmettre et dialoguer librement avec le monde.
            Autour de ce fil conducteur s'articulent trois programmes signatures (<em>Le Pianobariste</em>, <em>Racines Musicales Academy</em>, <em>Musicien Augmenté</em>)
            ainsi que des ouvrages et recherches spécialisés (<em>Permis de Jouer</em>, <em>Les Zikos</em>, <em>Tswefap</em>).
          </Body>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MASTER_IDENTITY.marques.map((marque, i) => (
            <Reveal key={marque.nom} delay={i * 60}>
              <Link to={marque.to} className="group block h-full">
                <div className="flex h-full flex-col justify-between border border-white/10 bg-ink p-7 transition-colors group-hover:border-gold/40">
                  <div>
                    <p className="font-display text-[0.62rem] uppercase tracking-[0.2em] text-gold/60">
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-3 font-display text-xl text-ivory leading-snug group-hover:text-gold-2 transition-colors">
                      {marque.nom}
                    </h3>
                    <p className="mt-2 text-[0.7rem] uppercase tracking-[0.15em] text-ivory/45">
                      {marque.role}
                    </p>
                  </div>
                  <div className="mt-7 border-t border-white/5 pt-4">
                    <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-gold group-hover:text-gold-2 inline-flex items-center gap-1.5">
                      Découvrir <span>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ========================= INSTITUTIONS ========================= */}
      <Section tone="dark" tight>
        <Reveal>
          <div className="grid gap-10 border border-gold/25 bg-ink-2 p-8 md:grid-cols-[1.4fr_1fr] md:items-center md:p-12">
            <div>
              <Eyebrow>Institutions d'enseignement</Eyebrow>
              <h2 className="mt-5 font-display text-3xl leading-snug text-ivory md:text-4xl">
                ESAS · ISMA · IBA Nkongsamba · RMA
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-[1.9] text-ivory/65">
                Enseignement supérieur en musicologie appliquée, MAO et composition (ESAS de Lomé, ISMA au Bénin, Institut des Beaux-Arts de Nkongsamba, IFCPA/CRTV), complété par la fondation de la Racines Musicales Academy (RMA) et du référentiel Permis de Jouer.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {MASTER_IDENTITY.enseignement.disciplines.map((d) => (
                  <Tag key={d}>{d}</Tag>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 md:items-end">
              <Btn to="/pedagogie" variant="gold">
                Voir la pédagogie
              </Btn>
              <Btn to="/rma" variant="ghost">
                Découvrir la RMA
              </Btn>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ========================= DOSSIER DE PRESSE & MEDIA KIT ========================= */}
      <Section tone="ink" id="media-kit">
        <Reveal>
          <ChapterMark num="07" label="Dossier de Presse" />
          <Display size="md" className="mt-7">
            Espace Presse & Media Kit Officiel
          </Display>
          <Lead className="mt-6 max-w-3xl">
            Biographies officielles multi-formats (courtes, moyennes, intégrales), fiche synthétique pour programmateurs et photothèque haute définition avec autorisation d'utilisation éditoriale pour journalistes, médias et organisateurs de conférences.
          </Lead>
        </Reveal>

        <div className="mt-14">
          <PressMediaKit />
        </div>
      </Section>

      <CtaBand
        eyebrow="Suite logique"
        title="Découvrir les réalisations issues de ce parcours"
        text="Quatre piliers de réalisations guidés par le manifeste A Laiz Ô Pays — de la scène à la transmission et à l'innovation culturelle."
        primary={{ label: 'Voir les réalisations', to: '/projets' }}
        secondary={{ label: 'Me contacter', to: '/contact' }}
      />
    </>
  )
}
