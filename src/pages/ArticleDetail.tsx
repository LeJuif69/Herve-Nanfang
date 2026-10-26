import { Link, useParams } from 'react-router-dom'
import PageHero from '../components/PageHero'
import AuthorSignature from '../components/AuthorSignature'
import AdSenseUnit from '../components/AdSenseUnit'
import ArticleShareBar from '../components/ArticleShareBar'
import {
  ArrowLink,
  Body,
  Btn,
  ChapterMark,
  Container,
  Display,
  Eyebrow,
  Reveal,
  Rule,
  Section,
  Tag,
} from '../components/ui'
import { ARTICLE_CHAIN } from '../data/articles'
import { articleSchema, breadcrumbSchema, personSchema } from '../lib/schema'
import { useSeo } from '../lib/seo'
import { useLiveArticle, useLiveArticles } from '../lib/useLiveContent'
import NotFound from './NotFound'

function renderFormattedText(text: string) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const parts: (string | React.ReactNode)[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    const label = match[1]
    const url = match[2]
    if (url.startsWith('/')) {
      parts.push(
        <Link
          key={match.index}
          to={url}
          className="text-gold underline decoration-gold/50 underline-offset-4 transition-colors hover:text-gold-2 hover:decoration-gold font-medium"
        >
          {label}
        </Link>
      )
    } else {
      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold underline decoration-gold/50 underline-offset-4 transition-colors hover:text-gold-2 hover:decoration-gold font-medium"
        >
          {label}
        </a>
      )
    }
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : text
}

export default function ArticleDetail() {
  const { slug } = useParams()
  const article = useLiveArticle(slug)
  const allArticles = useLiveArticles()

  useSeo({
    title: article ? article.seoTitle : 'Article introuvable | Hervé Nanfang',
    description:
      article?.seoDescription ??
      "Article introuvable — retour au Journal du Musicien Augmenté d'Hervé Nanfang.",
    path: `/journal/${slug ?? ''}`,
    type: 'article',
    robots: article?.status === 'Publié' ? 'index, follow, max-image-preview:large' : 'noindex, follow',
    jsonLd: article
      ? [
          personSchema,
          articleSchema({
            title: article.title,
            description: article.seoDescription,
            slug: article.slug,
            section: article.category,
            status: article.status,
            image: (article as any).coverImage,
            datePublished: (article as any).publishedAt || '2026-10-23',
            dateModified: (article as any).updatedAt || '2026-10-26',
          }),
          breadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Journal', path: '/journal' },
            { name: article.title, path: `/journal/${article.slug}` },
          ]),
        ]
      : undefined,
  })

  if (!article) return <NotFound />

  const others = allArticles.filter((a) => a.slug !== article.slug).slice(0, 3)
  const published = article.status === 'Publié'

  return (
    <>
      <PageHero
        breadcrumb={`Journal · Pilier ${article.num}`}
        eyebrow={`${article.category} · ${article.status}`}
        title={article.title}
        lead={article.excerpt}
      >
        <div className="flex flex-wrap items-center gap-6 text-[0.65rem] uppercase tracking-[0.2em] text-ivory/40">
          <span className="flex items-center gap-2 font-medium text-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Par Hervé Nanfang
          </span>
          <span>Pilier {article.num}</span>
          <span>Lecture {article.readingTime}</span>
          <span>{article.category}</span>
        </div>
      </PageHero>

      <Section tone="dark">
        <div className="grid gap-14 lg:grid-cols-[1fr_18rem] lg:items-start">
          <div className="min-w-0">
            {!published && (
              <div className="mb-10 border border-gold/30 bg-ink-2 p-6">
                <p className="eyebrow text-gold">Article {article.status.toLowerCase()}</p>
                <p className="mt-3 text-sm leading-relaxed text-ivory/65">
                  {article.body
                    ? 'Version de travail pour relecture éditoriale. Elle n’est ni publiée ni indexée.'
                    : 'Ce pilier est structuré mais sa rédaction complète est en préparation. Le plan ci-dessous présente l’angle et la progression prévus.'}
                </p>
              </div>
            )}

            {/* Barre de partage discrète en tête d'article */}
            <ArticleShareBar
              variant="inline"
              title={article.title}
              excerpt={article.excerpt}
              slug={article.slug}
              className="mb-10"
            />

            {article.body ? (
              <article className="space-y-12">
                {article.body.map((section) => (
                  <section key={section.heading}>
                    <h2 className="mb-5 font-display text-3xl leading-snug text-ivory md:text-4xl">
                      {section.heading}
                    </h2>
                    <div className="space-y-6 text-[1.02rem] leading-[1.95] text-ivory/75">
                      {section.paragraphs.map((paragraph, paragraphIndex) => (
                        <p key={`${section.heading}-${paragraphIndex}`}>
                          {renderFormattedText(paragraph)}
                        </p>
                      ))}
                    </div>
                  </section>
                ))}
              </article>
            ) : (
              <>
                <div className="space-y-8 text-[1.02rem] leading-[1.95] text-ivory/75">
                  <p className="font-display text-2xl leading-snug text-ivory md:text-[1.75rem]">
                    {article.excerpt}
                  </p>
                  <Body className="text-[1.02rem] leading-[1.95]">
                    Cet article appartient à la série fondatrice du Journal du Musicien Augmenté : « Après la
                    MAO, l’IA ». Son objectif n’est pas de commenter l’actualité des outils, mais de
                    fixer une méthode et un point de vue — utilisables par un musicien, un enseignant
                    ou une institution, indépendamment du rythme des sorties logicielles.
                  </Body>
                </div>

                <Rule className="my-12" />

                <h2 className="font-display text-3xl text-ivory md:text-4xl">Plan de l’article</h2>
                <ol className="mt-8 divide-y divide-white/8 border-y border-white/8">
                  {article.outline.map((step, stepIndex) => (
                    <li key={step} className="flex items-baseline gap-6 py-5">
                      <span className="font-display text-lg text-gold/60">
                        {String(stepIndex + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[15px] leading-relaxed text-ivory/80 md:text-lg">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </>
            )}

            {/* Carte de diffusion et de partage sur les plateformes vérifiées */}
            <ArticleShareBar
              variant="card"
              title={article.title}
              excerpt={article.excerpt}
              slug={article.slug}
            />

            {/* Encart publicitaire AdSense officiel */}
            <AdSenseUnit />

            {/* Signature d'auteur officielle */}
            <AuthorSignature />

            <div className="mt-12 border border-white/10 bg-ink-2 p-8">
              <Eyebrow>Angle éditorial</Eyebrow>
              <p className="mt-4 font-display text-2xl leading-snug text-ivory">
                Un point de vue assumé, une méthode applicable, des limites explicites.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ivory/60">
                Chaque pilier se termine par des recommandations concrètes et par ce que l’auteur
                considère comme non résolu.
              </p>
            </div>

            <div className="mt-12">
              <Link to="/journal" className="group inline-flex items-center gap-3">
                <span aria-hidden className="text-gold transition-transform group-hover:-translate-x-1">
                  ←
                </span>
                <span className="link-underline eyebrow text-gold">Retour au Journal</span>
              </Link>
            </div>
          </div>

          {/* Colonne latérale */}
          <div className="lg:sticky lg:top-32">
            <div className="space-y-8">
              {/* Module de partage en barre latérale */}
              <ArticleShareBar
                variant="sidebar"
                title={article.title}
                excerpt={article.excerpt}
                slug={article.slug}
              />

              <div className="border border-white/10 p-6">
                <p className="eyebrow text-ivory/40">À qui s’adresse cet article</p>
                <p className="mt-3 text-sm leading-relaxed text-ivory/65">{article.audience}</p>
              </div>

              <div className="border border-gold/30 p-6">
                <p className="eyebrow text-gold">Concept lié</p>
                <p className="mt-3 font-display text-xl text-ivory">{article.linkedConcept.label}</p>
                <div className="mt-4">
                  <ArrowLink to={article.linkedConcept.to}>Aller à la page</ArrowLink>
                </div>
              </div>

              <div className="border border-white/10 p-6">
                <p className="eyebrow text-ivory/40">Mots-clés</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {article.keywords.map((k) => (
                    <Tag key={k}>{k}</Tag>
                  ))}
                </div>
              </div>

              <div className="border border-white/10 p-6">
                <p className="eyebrow text-ivory/40">Series</p>
                <p className="mt-3 font-display text-xl text-ivory">Après la MAO, l’IA</p>
                <p className="mt-2 text-sm text-ivory/55">
                  Douze piliers pour comprendre la transformation en cours.
                </p>
                <div className="mt-5">
                  <Btn to="/journal" variant="ghost" className="w-full justify-center">
                    Tous les piliers
                  </Btn>
                </div>
              </div>

              <div className="border border-white/10 p-6">
                <p className="eyebrow text-ivory/40">Conférence associée</p>
                <p className="mt-3 font-display text-xl text-ivory">Le musicien augmenté</p>
                <p className="mt-2 text-sm text-ivory/55">
                  Version parlée de cette réflexion, pour les écoles et institutions.
                </p>
                <div className="mt-5">
                  <ArrowLink to="/conferences">Voir la conférence</ArrowLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Chaîne de conversion : Hervé Nanfang → Musicien Augmenté™ → contenus → formation */}
      <Section tone="ink" tight>
        <Reveal>
          <ChapterMark num="→" label="Parcours de lecture" />
          <Display size="sm" as="h2" className="mt-6 max-w-2xl">
            Comment aller plus loin à partir de cet article
          </Display>
        </Reveal>
        <div className="mt-12 grid gap-px border border-white/8 bg-white/8 md:grid-cols-4">
          {ARTICLE_CHAIN.map((step, i) => (
            <Reveal key={step.num} delay={i * 70}>
              <Link
                to={step.to}
                className="group flex h-full flex-col bg-ink px-7 py-9 transition-colors hover:bg-ink-3"
              >
                <span className="font-display text-lg text-gold/60">{step.num}</span>
                <span className="mt-4 font-display text-2xl text-ivory group-hover:text-gold-2">
                  {step.label}
                </span>
                <span className="mt-3 flex-1 text-sm leading-relaxed text-ivory/55">
                  {step.detail}
                </span>
                <span aria-hidden className="mt-6 text-gold transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="dark">
        <Reveal>
          <Display size="sm" as="h2" className="mb-10">
            Poursuivre la lecture
          </Display>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-3">
          {others.map((a, i) => (
            <Reveal key={a.slug} delay={i * 70}>
              <Link to={`/journal/${a.slug}`} className="group block border border-white/10 p-7 hover:border-gold/50">
                <span className="font-display text-lg text-gold/70">Pilier {a.num}</span>
                <h3 className="mt-4 font-display text-xl leading-snug text-ivory group-hover:text-gold-2">
                  {a.title}
                </h3>
                <p className="mt-3 text-[0.62rem] uppercase tracking-[0.18em] text-ivory/35">
                  {a.category} · {a.status}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
        <Container className="mt-12 px-0">
          <p className="text-sm text-ivory/40">
            La rédaction complète des piliers en préparation sera publiée depuis l’interface
            d’administration du site.
          </p>
        </Container>
      </Section>
    </>
  )
}
