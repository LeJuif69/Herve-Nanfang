import { useMemo, useState } from 'react'
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
  Reveal,
  Rule,
  Section,
  Stat,
  Tag,
} from '../components/ui'
import { ARTICLE_CHAIN, ARTICLES, CATEGORIES, JOURNAL_AGENDA, JOURNAL_SERIES } from '../data/articles'
import { IDENTITY } from '../data/identity'
import { SITE } from '../data/site'
import { articleSchema, breadcrumbSchema, personSchema } from '../lib/schema'
import { useSeo } from '../lib/seo'

const STATUS_TONE: Record<string, 'gold' | 'ink'> = {
  Publié: 'gold',
  'En cours': 'ink',
  Planifié: 'ink',
}

export default function Journal() {
  const [category, setCategory] = useState('Toutes')

  useSeo({
    title: 'Journal | Hervé Nanfang — IA, musique & pédagogie',
    description:
      "Le Journal du Musicien Augmenté : sept piliers sur l'IA et la musique, la pédagogie, les cultures africaines et l'entrepreneuriat culturel.",
    path: '/journal',
    jsonLd: [
      personSchema,
      ...ARTICLES.map((a) =>
        articleSchema({
          title: a.title,
          description: a.seoDescription,
          slug: a.slug,
          section: a.category,
          status: a.status,
        }),
      ),
      breadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Journal', path: '/journal' },
      ]),
    ],
  })

  const filtered = useMemo(
    () => (category === 'Toutes' ? ARTICLES : ARTICLES.filter((a) => a.category === category)),
    [category],
  )

  return (
    <>
      <PageHero
        breadcrumb="Journal"
        eyebrow="Le Journal du Musicien Augmenté"
        title="Réfléchir à ce que la technologie fait à la musique — et à nous."
        lead="Analyses, méthodes et prises de position sur la musique, l'intelligence artificielle, la pédagogie et la culture. Sept piliers éditoriaux fondateurs."
      >
        <div className="grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          <Stat value="07" label="Piliers fondateurs" />
          <Stat value="09" label="Catégories" />
          <Stat value="04" label="Séries" />
          <Stat value="1×" label="Par mois (objectif)" />
        </div>
      </PageHero>

      {/* ===== CONCEPT ANCRE — MUSICIEN AUGMENTÉ™ ===== */}
      <Section tone="ink" id="musicien-augmente">
        <Reveal>
          <div className="grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <Eyebrow>Concept fondateur du Journal</Eyebrow>
              <Display size="lg" className="mt-6">
                {IDENTITY.concept.name}
              </Display>
              <div className="mt-6 border-l-2 border-gold/50 pl-6">
                <p className="font-display text-xl leading-snug text-gold md:text-2xl">
                  « {IDENTITY.concept.principe} »
                </p>
              </div>
              <Body className="mt-6 max-w-xl">
                {IDENTITY.concept.definition}
              </Body>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/ia-technologie#musicien-augmente" className="btn btn-gold">
                  Lire le manifeste complet
                </Link>
                <Link to="/ia-technologie#formats" className="btn btn-ghost">
                  Formats de formation
                </Link>
              </div>
            </div>

            {/* Chaîne de conversion */}
            <Reveal delay={140}>
              <div className="border border-white/10 bg-ink p-8">
                <p className="eyebrow text-ivory/45 mb-6">Chaîne de lecture</p>
                <ol className="divide-y divide-white/8 border-y border-white/8">
                  {ARTICLE_CHAIN.map((step) => (
                    <li key={step.num} className="py-5">
                      <Link
                        to={step.to}
                        className="group flex items-start gap-5 transition-colors hover:text-gold"
                      >
                        <span className="mt-0.5 font-display text-2xl text-gold/50 transition-colors group-hover:text-gold">
                          {step.num}
                        </span>
                        <div>
                          <p className="font-display text-lg text-ivory transition-colors group-hover:text-gold">
                            {step.label}
                          </p>
                          <p className="mt-1 text-sm text-ivory/50">{step.detail}</p>
                        </div>
                        <span
                          aria-hidden
                          className="ml-auto mt-1 text-gold/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-gold"
                        >
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </Reveal>
      </Section>

      {/* ===== FILTRES ===== */}
      <Section tone="dark" tight bordered={false}>
        <Reveal>
          <div className="flex flex-wrap gap-3">
            {['Toutes', ...CATEGORIES].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`border px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] transition-colors ${
                  category === c
                    ? 'border-gold bg-gold text-ink'
                    : 'border-white/15 text-ivory/60 hover:border-gold/60 hover:text-gold'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* ===== LISTE DES ARTICLES ===== */}
      <Section tone="dark" bordered={false}>
        <Reveal>
          <div className="mb-10 flex items-baseline justify-between gap-6 border-b border-white/10 pb-6">
            <Display size="sm" as="h2">
              Série fondatrice — « Après la MAO, l'IA »
            </Display>
            <span className="text-[0.65rem] uppercase tracking-[0.2em] text-ivory/40">
              {filtered.length} article{filtered.length > 1 ? 's' : ''}
            </span>
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a, i) => (
            <Reveal key={a.slug} delay={i * 60}>
              <Card className="flex h-full flex-col">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-display text-lg text-gold/70">Pilier {a.num}</span>
                  <Tag tone={STATUS_TONE[a.status]}>{a.status}</Tag>
                </div>
                <h3 className="mt-6 font-display text-2xl leading-snug text-ivory">
                  <Link
                    to={`/journal/${a.slug}`}
                    className="transition-colors hover:text-gold-2"
                  >
                    {a.title}
                  </Link>
                </h3>
                <Rule className="opacity-40" />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-ivory/60">{a.excerpt}</p>

                {/* Concept lié — chaîne vers Musicien Augmenté */}
                <div className="mt-5 border-t border-white/8 pt-4">
                  <ArrowLink to={a.linkedConcept.to} className="text-[0.65rem]">
                    {a.linkedConcept.label}
                  </ArrowLink>
                </div>

                <div className="mt-3 flex items-center justify-between gap-4 text-[0.62rem] uppercase tracking-[0.18em]">
                  <span className="font-medium text-gold/80">Par Hervé Nanfang</span>
                  <span className="text-ivory/40">{a.category} · {a.readingTime}</span>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ===== AGENDA + SÉRIES ===== */}
      <Section tone="ink">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <Reveal>
            <ChapterMark num="01" label="Prochainement" />
            <Display size="md" className="mt-7">
              Agenda éditorial
            </Display>
            <ul className="mt-10 divide-y divide-white/8 border-y border-white/8">
              {JOURNAL_AGENDA.map((j) => (
                <li key={j.slug} className="py-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <Tag>{j.category}</Tag>
                    <span className="text-[0.62rem] uppercase tracking-[0.18em] text-ivory/35">
                      {j.date}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl text-ivory">{j.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ivory/55">{j.excerpt}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <Eyebrow>Séries du Journal</Eyebrow>
            <div className="mt-6 divide-y divide-white/8 border-y border-white/8">
              {JOURNAL_SERIES.map((s) => (
                <div key={s.num} className="flex gap-5 py-5">
                  <span className="font-display text-xl text-gold/60">{s.num}</span>
                  <div>
                    <p className="text-[0.95rem] text-ivory/90">{s.title}</p>
                    <p className="mt-1 text-sm text-ivory/50">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 border border-white/10 p-6">
              <p className="eyebrow text-ivory/40">Politique éditoriale</p>
              <Body className="mt-4">
                Un article ne se contente pas de résumer un outil : il expose une méthode, un point
                de vue assumé et les limites de ce qui est proposé.
              </Body>
            </div>
          </Reveal>
        </div>
      </Section>

      <CtaBand
        eyebrow="Le Journal du Musicien Augmenté"
        title="Recevoir les prochains articles"
        text="Une lettre occasionnelle : nouvelles analyses, méthodes et retours d'expérience."
        primary={{ label: 'Demander l’inscription sur WhatsApp', href: `https://wa.me/${SITE.phones[0].whatsapp}?text=${encodeURIComponent('Je souhaite recevoir la lettre du Journal du Musicien Augmenté.')}` }}
        secondary={{ label: 'Interviews & presse', to: '/contact#presse' }}
      />
    </>
  )
}
