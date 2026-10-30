import React from 'react'
import { Link } from 'react-router-dom'
import { SITE } from '../data/site'

interface PillarConversionCtaProps {
  category: string
  articleNum?: string
  articleTitle?: string
}

interface CtaConfig {
  badge: string
  title: string
  description: string
  primaryLabel: string
  primaryTo: string
  secondaryLabel?: string
  secondaryTo?: string
  whatsappPrompt: string
  highlights: string[]
}

export const PillarConversionCta: React.FC<PillarConversionCtaProps> = ({
  category,
  articleNum,
  articleTitle,
}) => {
  const num = articleNum ? parseInt(articleNum, 10) : 0

  let config: CtaConfig

  if (category.includes('Pianobar') || num === 17 || num === 18 || (num === 4 && category === 'Musique')) {
    config = {
      badge: 'PRESTATION LIVE & ÉVÉNEMENTIEL DE PRESTIGE',
      title: 'Réserver Hervé Nanfang en Piano-Bar, Gala ou Mariage',
      description:
        'Un répertoire de plus de 300 standards du jazz, de la chanson internationale et de l’afro-soul revisités avec une élégance feutrée. Une performance acoustique vivante, subtile et calibrée pour sublimer votre soirée.',
      primaryLabel: 'Demander un devis & vérifier les disponibilités',
      primaryTo: '/contact#booking',
      secondaryLabel: 'Découvrir le répertoire live',
      secondaryTo: '/pianobariste',
      whatsappPrompt: `Bonjour Hervé, j’ai lu votre article "${articleTitle || 'Piano-bar'}" et je souhaite vérifier vos disponibilités pour une prestation live / gala.`,
      highlights: [
        'Répertoire éclectique & sur mesure',
        'Sonorisation professionnelle autonome',
        'Ponctualité & discrétion absolue',
      ],
    }
  } else if (category.includes('Pédagogie') || num === 10 || num === 15 || num === 16) {
    config = {
      badge: 'MÉTHODE OFFICIELLE & ACADÉMIE',
      title: 'Postuler aux Auditions de A Laiz Academy (ex-RMA)',
      description:
        'Comprenez enfin ce que vous jouez grâce au référentiel du Permis de Jouer™. Rejoignez les promotions d’élèves d’A Laiz Academy et découvrez les manuels officiels LES ZIKOS®.',
      primaryLabel: 'Découvrir la méthode & les cursus',
      primaryTo: '/pedagogie',
      secondaryLabel: 'Candidater aux auditions',
      secondaryTo: '/rma#candidature-audition',
      whatsappPrompt: `Bonjour Hervé, je souhaite des informations sur les formations A Laiz Academy et la méthode du Permis de Jouer suite à votre article "${articleTitle || 'Pédagogie'}".`,
      highlights: [
        'Diagnostic d’oreille & harmonie appliquée',
        'Méthode sans solfège bloquant',
        'Accompagnement individuel et Masterclasses',
      ],
    }
  } else if (category.includes('Ingénierie') || category.includes('Studio') || num === 6 || num === 19 || num === 20) {
    config = {
      badge: 'HERVÉ NANFANG · STUDIO & INGÉNIERIE SONORE',
      title: 'Confier votre Mixage, Mastering ou Conception Acoustique',
      description:
        'Hervé Nanfang met son savoir-faire d’ingénierie audio, sa chaîne hybride (analogique & numérique) et sa rigueur acoustique au service de la signature sonore de votre projet musical ou audiovisuel.',
      primaryLabel: 'Échanger sur votre projet de production',
      primaryTo: '/contact#collaboration',
      secondaryLabel: 'Découvrir l’approche studio',
      secondaryTo: '/ingenieur-du-son',
      whatsappPrompt: `Bonjour Hervé, je souhaite vous consulter pour un projet de mixage / mastering / acoustique suite à la lecture de votre article technique "${articleTitle || 'Ingénierie'}".`,
      highlights: [
        'Traitement acoustique et clarté fréquentielle',
        'Respect de la dynamique et profondeur analogique',
        'Standards Broadcast, Streaming et Cinéma',
      ],
    }
  } else if (category.includes('Composition') || category.includes('B.O.') || num === 23) {
    config = {
      badge: 'MUSIQUE À L’IMAGE & IDENTITÉ SONORE',
      title: 'Commander une Musique Originale pour Film, Série ou Marque',
      description:
        'Des textures harmoniques percutantes, alliant instruments acoustiques, polyrythmies patrimoniales et sound design contemporain pour enrichir votre narration visuelle.',
      primaryLabel: 'Commander une musique originale',
      primaryTo: '/contact#collaboration',
      secondaryLabel: 'Écouter des extraits',
      secondaryTo: '/ia-technologie',
      whatsappPrompt: `Bonjour Hervé, j’aimerais discuter d’une musique originale / bande sonore pour un projet audiovisuel suite à votre article "${articleTitle || 'B.O.'}".`,
      highlights: [
        'Synchronisation et respect du montage narratif',
        'Orchestration hybride acoustique/moderne',
        'Cession claire des droits de diffusion',
      ],
    }
  } else if (category.includes('Musicologie') || category.includes('Patrimoine') || num === 7 || num === 8 || num === 13 || num === 14) {
    config = {
      badge: 'RECHERCHE & TRANSMISSION ACADÉMIQUE',
      title: 'Inviter Hervé Nanfang en Conférence ou Masterclass',
      description:
        'Une grille de lecture musicologique rigoureuse pour décrypter les polyrythmies africaines, leur transmission moderne et la valorisation du patrimoine immatériel.',
      primaryLabel: 'Organiser une conférence ou masterclass',
      primaryTo: '/contact#conference',
      secondaryLabel: 'Consulter le parcours académique',
      secondaryTo: '/musicologue',
      whatsappPrompt: `Bonjour Hervé, nous souhaitons vous inviter pour une conférence / masterclass suite à votre article musicologique "${articleTitle || 'Patrimoine'}".`,
      highlights: [
        'Démonstrations au clavier en direct',
        'Rigueur universitaire & pédagogie vivante',
        'Formats présentiels ou visioconférence',
      ],
    }
  } else {
    // IA, Stratégie, Entrepreneuriat, Marque, etc.
    config = {
      badge: 'HERVÉ NANFANG · STRATÉGIE CRÉATIVE & IA',
      title: 'Structurer votre Modèle Créatif & Déployer l’IA Musicale',
      description:
        'Bénéficiez de l’expertise de Hervé Nanfang pour moderniser votre production, protéger votre catalogue et concevoir une stratégie multicanale pérenne.',
      primaryLabel: 'Réserver un diagnostic stratégique',
      primaryTo: '/contact#conseil',
      secondaryLabel: 'Explorer les systèmes créatifs',
      secondaryTo: '/ia-technologie',
      whatsappPrompt: `Bonjour Hervé, je souhaite échanger sur une mission de conseil / stratégie créative et IA suite à la lecture de votre article "${articleTitle || 'Stratégie'}".`,
      highlights: [
        'Audit de positionnement & distribution',
        'Intégration d’outils IA sans perte d’âme',
        'Modèles de valorisation économique pérennes',
      ],
    }
  }

  const primaryPhone = SITE.phones[0]
  const whatsappUrl = `https://wa.me/${primaryPhone.whatsapp}?text=${encodeURIComponent(config.whatsappPrompt)}`

  return (
    <aside
      aria-label="Action recommandée"
      className="relative my-12 overflow-hidden rounded-xl border border-gold/40 bg-gradient-to-br from-ink-2 via-black to-ink p-8 shadow-[0_10px_40px_rgba(0,0,0,0.6)] ring-1 ring-gold/20 md:p-10"
    >
      {/* Halo décoratif subtil */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            {config.badge}
          </span>
          <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-ivory/40">
            Signé Hervé Nanfang
          </span>
        </div>

        <h3 className="mt-5 font-display text-2xl font-semibold leading-snug text-ivory md:text-3xl">
          {config.title}
        </h3>

        <p className="mt-4 text-[15px] leading-relaxed text-ivory/75 md:text-base">
          {config.description}
        </p>

        {/* Puces de réassurance */}
        <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
          {config.highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-ivory/70">
              <span className="text-gold font-bold">✓</span>
              <span>{h}</span>
            </div>
          ))}
        </div>

        {/* Boutons d'action */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to={config.primaryTo}
            className="btn btn-gold shadow-[0_0_20px_rgba(198,161,91,0.25)] hover:shadow-[0_0_30px_rgba(198,161,91,0.45)]"
          >
            {config.primaryLabel}
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded border border-emerald-500/40 bg-emerald-950/40 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-400 transition-all hover:border-emerald-400 hover:bg-emerald-900/40"
          >
            <span>WhatsApp direct</span>
            <span aria-hidden="true">→</span>
          </a>

          {config.secondaryLabel && config.secondaryTo && (
            <Link
              to={config.secondaryTo}
              className="text-xs uppercase tracking-[0.15em] text-ivory/50 underline-offset-4 hover:text-gold hover:underline"
            >
              {config.secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </aside>
  )
}

export default PillarConversionCta
