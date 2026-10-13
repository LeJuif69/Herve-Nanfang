import affiche from '../assets/affiche-pianobariste.webp'
import liveBand from '../assets/live-scene-piano.jpeg'
import PageHero from '../components/PageHero'
import {
  ArrowLink,
  Body,
  Btn,
  Card,
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
} from '../components/ui'
import {
  MUSIC_SECTIONS,
  REPERTOIRE_UNIVERSES,
  STAGE_FORMATS,
  TECHNICAL_STANDARDS,
} from '../data/music'
import { AUDIO_PLAYLIST } from '../data/audio'
import { useAudio } from '../lib/audio-context'
import { breadcrumbSchema, creativeWorkSchema, musicGroupSchema, serviceSchema } from '../lib/schema'
import { useSeo } from '../lib/seo'

export default function Music() {
  const { selectTrack, openPlayer } = useAudio()

  const liveTrack = AUDIO_PLAYLIST.find((t) => t.id === 'pianobariste-live') || AUDIO_PLAYLIST[0]

  useSeo({
    title: 'Musique | Hervé Nanfang — Piano, Composition & Production',
    description:
      "Piano-bar live depuis 2007, formats solo, duo et live band, composition originale et ingénierie du son : l'univers musical d'Hervé Nanfang.",
    path: '/musique',
    jsonLd: [
      musicGroupSchema,
      creativeWorkSchema(
        'Le Pianobariste',
        'Format de piano live créé par Hervé Nanfang pour hôtels de prestige, lounges et événements.',
      ),
      serviceSchema(
        'Prestation piano-bar live',
        'Piano live pour palaces, hôtels, lounges, cérémonies et événements privés ou institutionnels.',
        'Spectacle vivant',
      ),
      serviceSchema(
        'Production musicale & ingénierie du son',
        'Composition, arrangement, prise de son, mixage et production musicale pour artistes et contenus audiovisuels.',
        'Production musicale',
      ),
      breadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Musique', path: '/musique' },
      ]),
    ],
  })

  return (
    <>
      <PageHero
        breadcrumb="Musique"
        eyebrow="Créer · Le Pianobariste™"
        title="La musique comme langage, métier et présence"
        lead="De la scène au studio, en passant par l’image et le spectacle : une pratique musicale construite sur la scène depuis 2007, avec une exigence constante de précision acoustique et de justesse émotionnelle."
      >
        <div className="grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          <Stat value="2007" label="Piano-bar live" />
          <Stat value="03" label="Formats de scène" />
          <Stat value="04" label="Univers répertoire" />
          <Stat value="88" label="Touches de concert" />
        </div>
      </PageHero>

      {/* Le Pianobariste — Philosophie & Identité */}
      <Section tone="dark" id="pianobariste">
        <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal>
            <div className="relative mx-auto w-full max-w-md">
              <img
                src={affiche}
                alt="Affiche Le Pianobariste — piano live, hôtels, lounges, événements, concerts privés"
                width={1024}
                height={1536}
                loading="lazy"
                className="zoomable shadow-2xl rounded-sm object-cover"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-6 -right-6 h-36 w-36 rounded-full bg-gold/10 blur-3xl"
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <Eyebrow>Format signature</Eyebrow>
            <Display size="lg" className="mt-6">
              Le Pianobariste™
            </Display>
            <p className="mt-6 font-display text-2xl leading-snug text-gold md:text-3xl">
              « I don’t perform. I set the mood. »
            </p>
            <Body className="mt-7 max-w-xl">
              Depuis 2007, ce format définit une manière unique d’habiter un lieu : une présence
              musicale continue, capable de porter une salle entière sans jamais devenir un simple fond
              sonore interchangeable. Une virtuosité élégante au service des convives, de
              l’architecture et de l’instant.
            </Body>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Btn to="/contact#booking" variant="gold">
                Réserver une date
              </Btn>
              <button
                type="button"
                onClick={() => {
                  if (liveTrack) selectTrack(liveTrack, true)
                  openPlayer()
                }}
                className="btn btn-ghost inline-flex items-center gap-2 border-gold/40 text-gold hover:border-gold hover:bg-gold/10"
              >
                <svg className="h-4 w-4 fill-current text-gold" viewBox="0 0 24 24">
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
                <span>Écouter l’ambiance live ♫</span>
              </button>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 3 Formats de Scène */}
      <Section tone="ink" id="formats">
        <Reveal>
          <ChapterMark num="01" label="Formules de scène" />
          <Display size="md" className="mt-7 max-w-3xl">
            Trois formats taillés pour chaque envergure d’événement
          </Display>
          <Lead className="mt-4 max-w-2xl">
            Du salon feutré pour dîner d'État jusqu'à la grande réception festive, chaque formule est
            calibrée pour une adéquation parfaite avec l'espace et l'assistance.
          </Lead>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {STAGE_FORMATS.map((format, i) => (
            <Reveal key={format.id} delay={i * 100}>
              <SpotlightCard className="flex h-full flex-col justify-between border-white/10 bg-ink-2 p-8">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-2xl text-gold/80">{format.num}</span>
                    <span className="rounded border border-gold/30 bg-gold/5 px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-wider text-gold">
                      Live Mood
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-2xl text-ivory">{format.title}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gold/75">
                    {format.subtitle}
                  </p>

                  <div className="mt-4 border-l border-gold/30 pl-3">
                    <p className="text-[0.6875rem] uppercase tracking-wider text-ivory/50">
                      Idéal pour
                    </p>
                    <p className="mt-0.5 text-xs text-ivory/80 leading-relaxed">{format.audience}</p>
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-ivory/65">{format.description}</p>

                  <ul className="mt-6 space-y-2 border-t border-white/5 pt-5 text-xs text-ivory/70">
                    {format.highlights.map((h, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-gold font-bold">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 border-t border-white/10 pt-4">
                  <ArrowLink to="/contact#booking">Demander les disponibilités</ArrowLink>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Répertoire Vivant par Univers */}
      <Section tone="dark" id="repertoire">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal>
            <ChapterMark num="02" label="Répertoire vivant" />
            <Display size="md" className="mt-7">
              Quatre univers stylistiques, une virtuosité transversale
            </Display>
            <Lead className="mt-6 max-w-xl">
              La polyvalence n’est pas un défaut de spécialisation : c’est la noblesse du live.
              Comprendre l'énergie du lieu, lire les regards et choisir la bonne note au bon moment.
            </Lead>

            <div className="mt-10 space-y-6">
              {REPERTOIRE_UNIVERSES.map((u, idx) => (
                <div key={idx} className="border-l-2 border-gold/40 pl-5">
                  <h4 className="font-display text-xl text-ivory">{u.category}</h4>
                  <p className="mt-1 text-xs text-ivory/60 leading-relaxed">{u.description}</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {u.references.map((ref) => (
                      <span
                        key={ref}
                        className="rounded border border-white/10 bg-ink-2 px-2 py-0.5 text-[0.625rem] font-medium text-ivory/70"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <figure className="relative">
              <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                <img
                  src={liveBand}
                  alt="Hervé Nanfang au piano avec Flavie au chant lors d’une prestation live"
                  width={1400}
                  height={783}
                  loading="lazy"
                  className="zoomable w-full object-cover"
                />
              </div>
              <figcaption className="mt-4 flex items-center justify-between text-[0.68rem] uppercase tracking-[0.18em] text-ivory/50">
                <span>Hervé & Flavie · Duo Live</span>
                <span>Yaoundé · Douala · International</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Section>

      {/* Fiche Technique & Exigences Professionnelles */}
      <Section tone="ink" id="technique">
        <Reveal>
          <ChapterMark num="03" label="Exigence & Matériel" />
          <Display size="md" className="mt-7">
            Régie autonome & standards professionnels
          </Display>
          <Lead className="mt-4 max-w-2xl">
            La sérénité d'un événement repose sur une logistique invisible et sans faille. Hervé Nanfang
            garantit une installation autonome et un rendu sonore calibré pour les lieux prestigieux.
          </Lead>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TECHNICAL_STANDARDS.map((tech, i) => (
            <Reveal key={tech.title} delay={i * 80}>
              <Card className="h-full border-white/8 bg-ink p-6">
                <span className="font-display text-lg text-gold/60">{String(i + 1).padStart(2, '0')}</span>
                <h4 className="mt-3 font-display text-xl text-ivory">{tech.title}</h4>
                <p className="mt-3 text-xs leading-relaxed text-ivory/60">{tech.text}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Les Trois Pratiques : Scène, Composition, Studio */}
      <Section tone="dark">
        <Reveal>
          <ChapterMark num="04" label="Métiers" />
          <Display size="md" className="mt-7 max-w-3xl">
            Trois pratiques, une même matière : le son
          </Display>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {MUSIC_SECTIONS.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <Card className="h-full">
                <span className="font-display text-lg text-gold/60">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 font-display text-2xl text-ivory">{s.title}</h3>
                <Rule className="opacity-40" />
                <Body className="mt-4">{s.text}</Body>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand
        eyebrow="Booking Direct"
        title="Réserver une prestation live"
        text="Palaces, lounges, réceptions privées, cocktails de prestige ou galas : formule solo, duo ou formation complète adaptée à votre événement."
        primary={{ label: 'Ouvrir le formulaire de booking', to: '/contact#booking' }}
        secondary={{ label: 'Voir les conférences', to: '/conferences' }}
      />
    </>
  )
}
