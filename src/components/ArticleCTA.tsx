import { Btn } from './ui'

interface ArticleCTAProps {
  category?: string
  articleTitle?: string
}

export default function ArticleCTA({ category, articleTitle }: ArticleCTAProps) {
  // Adaptation dynamique du CTA selon l'univers thématique
  let eyebrow = 'Passer à l’action'
  let heading = articleTitle
    ? `Déployer ces réflexions autour de « ${articleTitle} »`
    : 'Déployer ces réflexions dans votre projet'
  let desc =
    'Vous souhaitez organiser une prestation piano-bar, former vos équipes au Permis de Jouer™, ou solliciter une conférence sur l’IA et la création musicale ?'
  let primaryTo = '/reservation'
  let primaryLabel = 'Demander une proposition sur mesure →'
  let secondaryTo = '/contact'
  let secondaryLabel = 'Échanger directement avec Hervé Nanfang'

  if (category?.toLowerCase().includes('ia') || category?.toLowerCase().includes('technolog')) {
    eyebrow = 'Conférences & Accompagnement IA'
    heading = 'Former vos musiciens ou organiser une masterclass IA'
    desc =
      'Comprendre les enjeux de l’IA générative dans la musique sans diluer son identité artistique. Interventions pour universités, festivals et conservatoires.'
    primaryTo = '/conferences'
    primaryLabel = 'Découvrir les conférences IA →'
    secondaryTo = '/reservation?type=conference'
    secondaryLabel = 'Réserver une intervention'
  } else if (category?.toLowerCase().includes('pédagogie') || category?.toLowerCase().includes('rma')) {
    eyebrow = 'A Laiz Academy · Permis de Jouer™'
    heading = 'Rejoindre un cursus ou implémenter la méthode'
    desc =
      'Une progression en 4 paliers (N1 à N4) combinant harmonie appliquée, rythme africain et autonomie musicale sur scène et en studio.'
    primaryTo = '/rma'
    primaryLabel = 'Découvrir A Laiz Academy →'
    secondaryTo = '/reservation?type=formation'
    secondaryLabel = 'Organiser une formation'
  } else if (category?.toLowerCase().includes('musique') || category?.toLowerCase().includes('live')) {
    eyebrow = 'Le Pianobariste™ · Prestations Live'
    heading = 'Réserver une prestation musicale d’exception'
    desc =
      'Solo piano feutré, Duo piano-voix ou Live Band pour vos réceptions diplomatiques, hôtels de prestige, galas et mariages au Cameroun et à l’international.'
    primaryTo = '/reservation?type=booking'
    primaryLabel = 'Réserver une date live →'
    secondaryTo = '/musique'
    secondaryLabel = 'Consulter le répertoire'
  }

  return (
    <aside
      data-testid="article-cta"
      className="my-12 rounded-2xl border border-gold/40 bg-gradient-to-br from-ink-2 via-ink to-ink-3 p-8 md:p-10 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <p className="font-mono text-xs uppercase tracking-widest text-gold">{eyebrow}</p>
      <h3 className="mt-3 font-display text-2xl font-bold text-ivory md:text-3xl max-w-2xl">
        {heading}
      </h3>
      <p className="mt-4 text-sm leading-relaxed text-ivory/70 max-w-xl">
        {desc}
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <Btn to={primaryTo} variant="gold" className="justify-center">
          {primaryLabel}
        </Btn>
        <Btn to={secondaryTo} variant="ghost" className="justify-center">
          {secondaryLabel}
        </Btn>
      </div>
    </aside>
  )
}
