import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import {
  ArrowLink,
  Body,
  Card,
  ChapterMark,
  CtaBand,
  Display,
  Eyebrow,
  Lead,
  Reveal,
  Rule,
  Section,
  Stat,
  Tag,
} from '../components/ui'
import { SITE } from '../data/site'
import { breadcrumbSchema, personSchema, serviceSchema } from '../lib/schema'
import { useSeo } from '../lib/seo'

const SERVICES = [
  {
    title: 'Prestations live & piano-bar',
    text:
      'Concert solo, piano-bar, ambiance de lieu, accueil de soirée et accompagnement de projets culturels. Un cadre musical lisible, adaptable à chaque espace et public.',
    tags: ['Le Pianobariste™', 'Événement privé', 'Lieu hôtelier'],
    to: '/musique#pianobariste',
  },
  {
    title: 'Formation & pédagogie',
    text:
      'Curricula, masterclasses, accompagnement d’enseignants, parcours de progression et dispositifs de transmission pour écoles, centres de formation et institutions.',
    tags: ['RMA', 'Permis de Jouer™', 'Pédagogie'],
    to: '/rma',
  },
  {
    title: 'Conférences & conseil',
    text:
      'Interventions sur l’IA dans la musique, la transformation numérique, la création et les métiers culturels. Diagnostic, cadrage, accompagnement de structures.',
    tags: ['IA & musique', 'Conseil', 'Conférence'],
    to: '/conferences',
  },
  {
    title: 'Création & collaborations',
    text:
      'Projets artistiques, contenus numériques, direction musicale, mise en scène et pilotage de collaborations entre création, patrimoine et technologies.',
    tags: ['Création', 'Collaboration', 'Projet culturel'],
    to: '/projets',
  },
]

const PROCESS = [
  'Identifier le besoin réel : public, contexte, durée, objectifs et contraintes.',
  'Choisir un format qui correspond au niveau d’intervention et à la nature du projet.',
  'Définir les livrables, le calendrier et la méthode de suivi.',
  'Mesurer le résultat à l’aune du public, de la pédagogie et de la qualité artistique.',
]

export default function Services() {
  useSeo({
    title: 'Services | Hervé Nanfang — live, formation & conseil',
    description:
      'Prestations live, conférences, formation musicale, pédagogie, conseil sur l’IA et les technologies créatives : les services de Hervé Nanfang.',
    path: '/services',
    jsonLd: [
      personSchema,
      serviceSchema(
        'Prestations live, formation et conseil',
        'Services de musique live, pédagogie, formation, conférence et conseil sur l’IA appliquée à la création et aux métiers culturels.',
        'Musique, pédagogie, IA et culture',
      ),
      breadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Services', path: '/services' },
      ]),
    ],
  })

  return (
    <>
      <PageHero
        breadcrumb="Services"
        eyebrow="Créer · Transmettre · Augmenter"
        title="Des interventions pensées pour la création, la transmission et la transformation"
        lead="Chaque service s’appuie sur le même principe : clarifier le besoin, protéger l’intention artistique et donner du sens au dispositif utilisé."
      >
        <div className="grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          <Stat value="4" label="Familles" />
          <Stat value="Live" label="& Formation" />
          <Stat value="IA" label="& conseil" />
          <Stat value="RMA" label="& pédagogie" />
        </div>
      </PageHero>

      <Section tone="dark">
        <Reveal>
          <ChapterMark num="01" label="Prestations" />
          <Display size="md" className="mt-7 max-w-3xl">
            Un service n’est pas une liste d’outils : c’est un cadre de travail.
          </Display>
          <Lead className="mt-6 max-w-3xl">
            Les prestations sont conçues pour les lieux, les institutions, les équipes pédagogiques, les artistes et les organisations qui veulent une présence claire, rigoureuse et adaptée à leur public.
          </Lead>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {SERVICES.map((service, index) => (
            <Reveal key={service.title} delay={index * 70}>
              <Card className="h-full">
                <Eyebrow>{service.title}</Eyebrow>
                <Rule className="my-5 opacity-40" />
                <Body>{service.text}</Body>
                <div className="mt-6 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
                <div className="mt-8">
                  <ArrowLink to={service.to}>Voir le parcours associé</ArrowLink>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="ink">
        <Reveal>
          <ChapterMark num="02" label="Méthode" />
          <Display size="md" className="mt-7">
            Une commande claire vaut mieux qu’un long briefing vague.
          </Display>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {PROCESS.map((step, index) => (
            <Reveal key={step} delay={index * 60}>
              <div className="border border-white/10 bg-ink-2 p-6">
                <p className="eyebrow text-gold">Étape {index + 1}</p>
                <p className="mt-4 text-sm leading-relaxed text-ivory/65">{step}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="dark">
        <Reveal>
          <ChapterMark num="03" label="RMA" />
          <Display size="md" className="mt-7 max-w-3xl">
            Racines Musicales Academy® : une structure de formation de terrain.
          </Display>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal>
            <div className="border border-white/10 bg-ink-2 p-8 md:p-10">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-gold">RMA</p>
              <h3 className="mt-6 font-display text-3xl text-ivory">Formation musicale, pédagogie et transmission</h3>
              <Body className="mt-5">
                La RMA relie les pratiques contemporaines et le patrimoine musical africain. Elle vise à rendre l’apprentissage musical plus structuré, plus lisible et plus durable, sans perdre le lien avec la culture de départ.
              </Body>
              <div className="mt-7 flex flex-wrap gap-2">
                {['Curricula', 'Progression', 'Évaluation', 'Patrimoine', 'Pédagogie', 'Formateurs'].map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/rma" className="btn btn-gold">Découvrir la page RMA</Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="border border-gold/30 bg-ink p-8">
              <p className="eyebrow text-gold">Contact direct</p>
              <p className="mt-5 font-display text-2xl text-ivory">Pour un besoin précis : formation, conférence, live ou conseil.</p>
              <a href={`mailto:${SITE.emailRma}`} className="mt-6 inline-block text-sm text-gold hover:text-gold-2">
                {SITE.emailRma}
              </a>
              <div className="mt-6">
                <ArrowLink to="/contact#formation">Ouvrir le formulaire de demande</ArrowLink>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <CtaBand
        eyebrow="Parcours sur mesure"
        title="Choisir le bon format pour votre projet"
        text="Que vous soyez une école, une institution, un lieu de diffusion ou un artiste, la meilleure réponse commence par une demande précise."
        primary={{ label: 'Demander un devis', to: '/contact#formation' }}
        secondary={{ label: 'Voir le journal', to: '/journal' }}
      />
    </>
  )
}
