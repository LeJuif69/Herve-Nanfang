import { SocialPlatform, SocialPost } from './admin-types'

/**
 * Plateformes et métadonnées d'affichage
 */
export const PLATFORM_CONFIG: Record<
  SocialPlatform,
  {
    name: string
    color: string
    bgColor: string
    borderColor: string
    badgeClass: string
    maxChars: number
    iconPath: string
  }
> = {
  linkedin: {
    name: 'LinkedIn',
    color: '#0A66C2',
    bgColor: 'bg-[#0A66C2]/15',
    borderColor: 'border-[#0A66C2]/40',
    badgeClass: 'bg-[#0A66C2]/20 text-[#60a5fa] border-[#0A66C2]/40',
    maxChars: 3000,
    iconPath:
      'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z',
  },
  facebook: {
    name: 'Facebook',
    color: '#1877F2',
    bgColor: 'bg-[#1877F2]/15',
    borderColor: 'border-[#1877F2]/40',
    badgeClass: 'bg-[#1877F2]/20 text-[#93c5fd] border-[#1877F2]/40',
    maxChars: 63206,
    iconPath:
      'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  whatsapp: {
    name: 'WhatsApp',
    color: '#25D366',
    bgColor: 'bg-[#25D366]/15',
    borderColor: 'border-[#25D366]/40',
    badgeClass: 'bg-[#25D366]/20 text-[#86efac] border-[#25D366]/40',
    maxChars: 4096,
    iconPath:
      'M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z',
  },
  instagram: {
    name: 'Instagram',
    color: '#E4405F',
    bgColor: 'bg-[#E4405F]/15',
    borderColor: 'border-[#E4405F]/40',
    badgeClass: 'bg-[#E4405F]/20 text-[#f472b6] border-[#E4405F]/40',
    maxChars: 2200,
    iconPath:
      'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  youtube: {
    name: 'YouTube',
    color: '#FF0000',
    bgColor: 'bg-[#FF0000]/15',
    borderColor: 'border-[#FF0000]/40',
    badgeClass: 'bg-[#FF0000]/20 text-[#fca5a5] border-[#FF0000]/40',
    maxChars: 5000,
    iconPath:
      'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  site: {
    name: 'Site Web / Blog',
    color: '#D4AF37',
    bgColor: 'bg-gold/15',
    borderColor: 'border-gold/40',
    badgeClass: 'bg-gold/20 text-gold border-gold/40',
    maxChars: 10000,
    iconPath:
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
  },
}

/**
 * Générateur de liens de partage directs (1-click share)
 */
export function getLinkedInShareUrl(url: string, _text?: string): string {
  const encUrl = encodeURIComponent(url)
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`
}

export function getFacebookShareUrl(url: string): string {
  const encUrl = encodeURIComponent(url)
  return `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`
}

export function getWhatsAppShareUrl(text: string): string {
  const encText = encodeURIComponent(text)
  return `https://api.whatsapp.com/send?text=${encText}`
}

/**
 * Générateur automatique de posts réseaux sociaux depuis un contenu du site
 */
export function generateSocialPostFromSource(
  sourceType: 'article' | 'service' | 'projet' | 'masterclass',
  data: {
    title: string
    slug?: string
    excerpt?: string
    description?: string
    tags?: string[]
    points?: string[]
    coverImage?: string
    url?: string
  },
  scheduledDate: string,
  scheduledTime = '09:00',
): SocialPost {
  const baseDomain = 'https://herve-nanfang.com'
  const fullUrl = data.url
    ? data.url.startsWith('http')
      ? data.url
      : `${baseDomain}${data.url}`
    : data.slug
    ? `${baseDomain}/journal/${data.slug}`
    : baseDomain

  const title = data.title
  const summary = data.excerpt || data.description || ''
  const mediaUrl = data.coverImage || '/images/shooting-pro-officiel.webp'

  // LinkedIn: Format autorité, storytelling structuré, bullets, appel à l'échange professionnel
  const linkedinText = `Pourquoi tant de créateurs et d'institutions échouent à marquer les mémoires ?

Ils confondent la vitrine et l'essence. Ils achètent un logo avant d'avoir articulé leur récit.

Dans « ${title} », je partage une conviction forgée par des décennies de pratique entre scène, conservatoires et technologies :

${summary}

💡 Les 3 enseignements clés :
${(data.points && data.points.length > 0 ? data.points.slice(0, 3) : [
  'La souveraineté artistique précède toujours le déploiement technique.',
  'La valeur perçue découle de la cohérence de trajectoire, pas du volume de posts.',
  'Une marque culturelle forte convertit sans budget publicitaire quand le positionnement est chirurgical.',
])
  .map((p) => `• ${p}`)
  .join('\n')}

L'article complet et les grilles d'analyse sont en libre accès sur la plateforme :
👉 ${fullUrl}

Et vous, quelle place donnez-vous à l'intention narrative dans vos projets ? Échangeons en commentaire.`

  const linkedinHashtags = [
    '#StrategieDeMarque',
    '#CultureEtInnovation',
    '#MusiqueEtIA',
    '#HerveNanfang',
    '#CreativeLeadership',
  ]

  // Facebook: Format communauté, chaleureux, accessible, émotion et partage
  const facebookText = `🎵 Chers passionnés, artistes et amis de la musique,

Je partage aujourd'hui une réflexion qui me tient particulièrement à cœur : « ${title} ».

${summary}

Dans un monde où tout s'accélère, nous avons le devoir d'ancrer nos créations dans un sens profond et durable.

Découvrez l'article complet ici :
🔗 ${fullUrl}

Partagez autour de vous et dites-moi en commentaire ce que cela vous inspire ! Très belle journée à tous.`

  const facebookHashtags = ['#HerveNanfang', '#MusiqueVivante', '#Culture', '#Transmission']

  // WhatsApp: Message broadcast direct pour les contacts & réseaux partenaires (Cameroun, diaspora, institutions)
  const whatsappText = `*Hervé Nanfang · Pensée & Actualité*

« *${title}* »

${summary}

Lire la publication complète :
👉 ${fullUrl}

_Vous souhaitez échanger sur votre stratégie artistique ou réserver une masterclass ? Répondez directement à ce message WhatsApp ou contactez notre secrétariat au +237 694 72 34 92._`

  // Instagram / Threads: Format percutant, citations, esthétique de l'or et du piano
  const instagramText = `« ${title} » 🎹✨

${summary}

Ce qui fait la rareté d'un artiste ou d'une institution, ce n'est pas le bruit qu'il produit, c'est l'empreinte qu'il laisse.

L'article de fond complet est disponible dès aujourd'hui sur notre plateforme officielle.

🔗 Lien complet dans la bio : @hervenanfang`

  const instagramHashtags = [
    '#HerveNanfang',
    '#Pianobariste',
    '#MusicienAugmente',
    '#StrategieDeMarque',
    '#ArtEtTechnologie',
    '#PatrimoineAfricain',
    '#Pianiste',
    '#LeadershipCulturel',
  ]

  return {
    id: `post-gen-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: `Diffusion : ${title}`,
    sourceType,
    sourceSlug: data.slug,
    sourceTitle: title,
    scheduledDate,
    scheduledTime,
    status: 'a_valider',
    platforms: ['linkedin', 'facebook', 'whatsapp', 'instagram'],
    contentByPlatform: {
      linkedin: {
        text: linkedinText,
        hashtags: linkedinHashtags,
        charCount: linkedinText.length,
      },
      facebook: {
        text: facebookText,
        hashtags: facebookHashtags,
        charCount: facebookText.length,
      },
      whatsapp: {
        text: whatsappText,
        hashtags: [],
        charCount: whatsappText.length,
      },
      instagram: {
        text: instagramText,
        hashtags: instagramHashtags,
        charCount: instagramText.length,
      },
    },
    mediaUrl,
    linkUrl: fullUrl,
    ctaLabel: 'Lire l’article',
    targetAudience: 'Artistes, décideurs culturels, mélomanes',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Calendrier initial stratégique sur 30 jours (4 semaines)
 * Conçu pour générer une traction organique maximale sans AUCUN budget publicitaire.
 * Piliers alternés :
 * 1. Autorité & Stratégie de marque (B2B LinkedIn)
 * 2. IA & Souveraineté musicale (Pédagogie & Conservatoires)
 * 3. Patrimoine africain & RMA (Identité & Fierté culturelle)
 * 4. Le Pianobariste™ & Live (Événements de prestige & bookings directs)
 */
export const INITIAL_PUBLICATIONS: SocialPost[] = [
  // ==========================================
  // SEMAINE 1 : LE RÉCIT PRÉCÈDE LE LOGO
  // ==========================================
  {
    id: 'pub-01-recit-marque',
    title: 'Pilier 07 · Le musicien et sa marque : pourquoi le récit précède le logo',
    sourceType: 'article',
    sourceSlug: 'musicien-et-sa-marque-recit-precede-logo',
    sourceTitle: 'Le musicien et sa marque : pourquoi le récit précède le logo',
    scheduledDate: '2026-10-26',
    scheduledTime: '08:30',
    status: 'a_valider',
    platforms: ['linkedin', 'facebook', 'whatsapp', 'instagram'],
    mediaUrl: '/images/shooting-pro-officiel.webp',
    linkUrl: 'https://herve-nanfang.com/journal/musicien-et-sa-marque-recit-precede-logo',
    ctaLabel: 'Lire le décryptage',
    targetAudience: 'Artistes indépendants, labels, managers culturels, entrepreneurs',
    contentByPlatform: {
      linkedin: {
        text: `Un logo ne sauvera jamais une trajectoire vide.

Dans les industries créatives, 90 % des artistes pensent « image » avant de penser « posture ». Ils dépensent des budgets considérables en chartes graphiques et photos de complaisance, mais restent incapables de répondre à une question fondamentale :

👉 « En quoi ce que vous portez change-t-il la vie de ceux qui vous écoutent ? »

J'ai publié sur ma plateforme canonique un décryptage complet pour poser les bases d'une autorité culturelle authentique : « Le musicien et sa marque : pourquoi le récit précède le logo ».

Au sommaire :
1. L'illusion du logo : pourquoi les attributs graphiques ne créent aucune fidélité sans intention narrative.
2. Le triptyque Racine - Geste - Horizon : articuler la filiation, la virtuosité technique et la promesse collective.
3. L'architecture de réputation : comment bâtir une présence digitale pérenne sans dépendre de l'algorithme ni de la publicité payante.

L'article intégral est consultable en accès libre :
👉 https://herve-nanfang.com/journal/musicien-et-sa-marque-recit-precede-logo

Et pour vous : qu'est-ce qui fait la force indélébile d'une marque artistique ? Échangeons en commentaires.`,
        hashtags: ['#StrategieDeMarque', '#CommunicationCulturelle', '#HerveNanfang', '#ArtEtBusiness', '#Storytelling'],
        charCount: 1140,
      },
      facebook: {
        text: `Avant de dessiner un logo, savez-vous quelle histoire vous racontez au monde ? 🎹✨

Trop souvent, nous voyons des artistes extraordinaires rester dans l'ombre parce qu'ils n'ont pas structuré leur récit. À l'inverse, ceux qui traversent les époques sont ceux dont la trajectoire porte un sens clair et fédérateur.

Dans mon nouvel article du Journal, je partage une méthode concrète pour bâtir une réputation artistique solide :
📖 « Le musicien et sa marque : pourquoi le récit précède le logo »

À lire ici : https://herve-nanfang.com/journal/musicien-et-sa-marque-recit-precede-logo

Dites-moi en commentaire : quelle chanson ou quel artiste incarne pour vous la marque parfaite ? Très belle lecture à tous !`,
        hashtags: ['#HerveNanfang', '#Musique', '#Culture', '#Inspiration'],
        charCount: 780,
      },
      whatsapp: {
        text: `*Hervé Nanfang · Éditorial Stratégie*

« *Le musicien et sa marque : pourquoi le récit précède le logo* »

Un logo ne crée pas la fidélité : c'est la clarté du récit et l'authenticité de la trajectoire qui captivent durablement.

Découvrez l'article complet ici :
👉 https://herve-nanfang.com/journal/musicien-et-sa-marque-recit-precede-logo

_Besoin d'un audit de votre présence artistique ou institutionnelle ? Écrivez-nous en réponse à ce message._`,
        hashtags: [],
        charCount: 420,
      },
      instagram: {
        text: `« Un logo ne sauvera jamais une trajectoire vide. » ⚜️

Construire une marque d'artiste, ce n'est pas copier les tendances du moment. C'est assumer ses racines, formaliser son geste et ouvrir un horizon à sa communauté.

Nouvel article de fond disponible sur le site officiel.

🔗 Lien dans la bio : @hervenanfang`,
        hashtags: ['#HerveNanfang', '#MarqueCulturelle', '#Pianiste', '#Storytelling', '#MusiqueVivante'],
        charCount: 360,
      },
    },
    notes: 'Post d’autorité pour le lancement officiel du pôle Conseil & Stratégie de marque.',
    createdAt: '2026-10-23T09:00:00Z',
    updatedAt: '2026-10-23T09:00:00Z',
  },

  {
    id: 'pub-02-offre-diagnostic',
    title: 'Offre Commerciale · Diagnostic & Positionnement d’Autorité Culturelle',
    sourceType: 'service',
    sourceSlug: 'strategie-digitale',
    sourceTitle: 'Conseil & Stratégie de marque culturelle',
    scheduledDate: '2026-10-28',
    scheduledTime: '11:00',
    status: 'a_valider',
    platforms: ['linkedin', 'whatsapp', 'facebook'],
    mediaUrl: '/images/shooting-pro-officiel.webp',
    linkUrl: 'https://herve-nanfang.com/services#strategie-digitale',
    ctaLabel: 'Découvrir la formule',
    targetAudience: 'Créateurs confirmés, conservatoires, festivals, directions artistiques',
    contentByPlatform: {
      linkedin: {
        text: `Vous avez le talent et le public sur scène, mais votre empreinte numérique ne reflète pas votre véritable stature ?

C'est le paradoxe de nombreux maîtres, créateurs et institutions culturelles : une excellence vécue en présentiel, mais une communication fragmentée, illisible ou dépendante du hasard.

Chez HN MARQUE, nous avons ouvert la formule « Diagnostic & Positionnement d’Autorité » :
⏱️ 3 sessions intensives de cadrage stratégique.
🎯 Livrables : Matrice d'autorité, formalisation du récit de marque et plan d'action organique à 90 jours (zéro budget publicitaire requis).

L'objectif est limpide : aligner votre stature artistique et votre visibilité pour transformer les sollicitations passives en opportunités d'affaires d'élite.

Découvrez les 3 formules d'accompagnement sur notre plateforme :
👉 https://herve-nanfang.com/services#strategie-digitale

Réservations de créneaux confidentiels directement via le formulaire de contact ou messagerie privée.`,
        hashtags: ['#ConseilStrategique', '#BrandingCulturel', '#HerveNanfang', '#ManagementArtistique'],
        charCount: 1040,
      },
      whatsapp: {
        text: `*HN Conseil · Diagnostic & Positionnement d'Autorité*

Pour les créateurs, festivals et institutions culturelles qui souhaitent faire passer leur image numérique au niveau de leur prestige réel.

✅ Audit complet de vos canaux existants
✅ Définition de votre récit fondateur
✅ Feuille de route organique à 90 jours sans achat d'espace

Consultez les détails de la formule :
👉 https://herve-nanfang.com/services#strategie-digitale

_Pour bloquer votre entretien de cadrage préliminaire, répondez directement « DIAGNOSTIC » à ce numéro._`,
        hashtags: [],
        charCount: 520,
      },
      facebook: {
        text: `Faire correspondre son prestige réel sur scène et son autorité sur le digital : c'est tout l'enjeu de notre nouvelle offre de Conseil en Marque Culturelle.

Découvrez notre formule « Diagnostic & Positionnement » conçue pour accompagner les artistes et structures culturelles vers une visibilité choisie et durable :
🔗 https://herve-nanfang.com/services#strategie-digitale`,
        hashtags: ['#HerveNanfang', '#Conseil', '#Culture', '#Strategie'],
        charCount: 420,
      },
    },
    notes: 'Conversion directe pour les décideurs culturels et artistes.',
    createdAt: '2026-10-23T09:00:00Z',
    updatedAt: '2026-10-23T09:00:00Z',
  },

  {
    id: 'pub-03-citation-philosophie',
    title: 'Citation & Philosophie · « La tradition n’est pas un musée »',
    sourceType: 'citation',
    sourceTitle: 'Philosophie de la transmission et de l’identité',
    scheduledDate: '2026-10-30',
    scheduledTime: '17:00',
    status: 'a_valider',
    platforms: ['instagram', 'facebook'],
    mediaUrl: '/images/hero-duo-live.webp',
    linkUrl: 'https://herve-nanfang.com/a-propos',
    ctaLabel: 'Explorer le parcours',
    targetAudience: 'Mélomanes, élèves, communauté culturelle africaine',
    contentByPlatform: {
      instagram: {
        text: `« La tradition n’est pas un musée que l’on visite avec nostalgie. C’est un moteur thermique : elle fournit l’énergie brute, mais c’est à nous de concevoir les ailes qui voleront vers demain. » — Hervé Nanfang 🎹

Des claviers maîtres de Batoufam aux algorithmes d'aujourd'hui, le respect de la racine passe par le courage de la modernité.

Bon week-end musical à tous. Prenez le temps de créer ce qui vous ressemble vraiment. 🤍`,
        hashtags: [
          '#HerveNanfang',
          '#Batoufam',
          '#Pianiste',
          '#TraditionEtModernite',
          '#MusiqueCamerounaise',
          '#HeritageAfricain',
          '#PianoSolo',
        ],
        charCount: 480,
      },
      facebook: {
        text: `« La tradition n’est pas un musée que l’on visite avec nostalgie. C’est un moteur : elle fournit l’énergie brute, mais c’est à nous de concevoir les ailes qui voleront vers demain. »

De Batoufam aux plus grandes scènes, chaque note au piano est un pont tendu entre nos racines ancestrales et le futur numérique.

Passez un excellent week-end sous le signe de l'inspiration et du partage musical ! 🎶`,
        hashtags: ['#HerveNanfang', '#Citation', '#Musique', '#Batoufam', '#Afrique'],
        charCount: 420,
      },
    },
    notes: 'Post d’engagement émotionnel et de fierté patrimoniale avant le week-end.',
    createdAt: '2026-10-23T09:00:00Z',
    updatedAt: '2026-10-23T09:00:00Z',
  },

  // ==========================================
  // SEMAINE 2 : L'IA DANS LA MUSIQUE & MASTERCLASSES
  // ==========================================
  {
    id: 'pub-04-ia-musique-article',
    title: 'Pilier 01 · Après la MAO, l’IA : évoluer sans perdre son identité',
    sourceType: 'article',
    sourceSlug: 'apres-la-mao-lia',
    sourceTitle: 'Après la MAO, l’IA : comment les musiciens peuvent évoluer sans perdre leur identité',
    scheduledDate: '2026-11-02',
    scheduledTime: '08:45',
    status: 'a_valider',
    platforms: ['linkedin', 'facebook', 'whatsapp', 'site'],
    mediaUrl: '/images/02-eleves-musique.jpg',
    linkUrl: 'https://herve-nanfang.com/journal/apres-la-mao-lia',
    ctaLabel: 'Lire l’analyse IA',
    targetAudience: 'Enseignants, beatmakers, compositeurs, directeurs de conservatoires',
    contentByPlatform: {
      linkedin: {
        text: `L'intelligence artificielle ne va pas tuer la musique. Elle va tuer la paresse d'écoute.

Quand le MIDI et la MAO sont arrivés dans les années 80 et 90, on prédisait la disparition des pianistes et des arrangeurs. La réalité ? Ceux qui ont appris à dialoguer avec le protocole ont multiplié leur puissance expressive, tandis que les récalcitrants sont devenus dépendants des techniciens.

Avec l'IA générative (Suno, Udio, modèles de démixage et assistants harmoniques), le saut est encore plus radical.

La vraie question n'est pas : « La machine peut-elle composer ? »
Elle compose déjà, et souvent avec une fluidité déroutante.

La vraie question est :
👉 « Qu'est-ce que vous avez à lui ordonner qu'elle ne sait pas déjà ? »

C'est l'essence de la posture du « Musicien Augmenté™ » que j'enseigne dans mes masterclasses et que je détaille dans cet article de référence :
🔗 https://herve-nanfang.com/journal/apres-la-mao-lia

La machine amplifie l'intention. Si l'intention est banale, le résultat sera le cliché du siècle. Si l'oreille est aiguisée, l'IA devient un laboratoire infini.

Débattons-en : quel est votre cas d'usage le plus convaincant de l'IA dans votre travail musical aujourd'hui ?`,
        hashtags: ['#IntelligenceArtificielle', '#MAO', '#PédagogieMusicale', '#MusicienAugmente', '#TechEtArt'],
        charCount: 1220,
      },
      facebook: {
        text: `L'IA dans la musique fait peur à beaucoup. Pourtant, elle ne remplace pas l'âme humaine : elle oblige à être encore plus musicien ! 🎹🤖

Dans les années 90, on disait que la MAO supprimerait les pianistes. En réalité, ceux qui ont embrassé la technologie ont élargi leurs horizons. Il en va exactement de même aujourd'hui avec l'IA.

Retrouvez mon analyse complète dans le Journal du Musicien Augmenté™ :
📖 https://herve-nanfang.com/journal/apres-la-mao-lia

Partagez avec vos amis musiciens, compositeurs et enseignants ! Quel est votre avis sur l'IA dans la création ?`,
        hashtags: ['#HerveNanfang', '#IA', '#Musique', '#MAO', '#FuturDeLaMusique'],
        charCount: 590,
      },
      whatsapp: {
        text: `*Hervé Nanfang · Le Journal du Musicien Augmenté™*

« *Après la MAO, l’IA : comment évoluer sans perdre son identité musicale* »

L'IA ne remplacera jamais l'émotion vivante, mais elle redéfinit complètement les compétences indispensables pour les créateurs et pédagogues de demain.

L'article complet est en ligne :
👉 https://herve-nanfang.com/journal/apres-la-mao-lia

_Intéressé par une masterclass ou une intervention pour vos élèves ou votre école ? Contactez-nous directement ici._`,
        hashtags: [],
        charCount: 460,
      },
    },
    notes: 'Établir la légitimité d’Hervé sur l’IA appliquée à la musique.',
    createdAt: '2026-10-23T09:00:00Z',
    updatedAt: '2026-10-23T09:00:00Z',
  },

  {
    id: 'pub-05-masterclass-ia',
    title: 'Masterclass & Conférences · « La Musique à l’épreuve de l’IA » pour écoles et institutions',
    sourceType: 'masterclass',
    sourceSlug: 'conferences',
    sourceTitle: 'Conférences & Masterclasses',
    scheduledDate: '2026-11-05',
    scheduledTime: '10:00',
    status: 'a_valider',
    platforms: ['linkedin', 'whatsapp', 'facebook'],
    mediaUrl: '/images/02-eleves-musique.jpg',
    linkUrl: 'https://herve-nanfang.com/conferences',
    ctaLabel: 'Consulter le catalogue',
    targetAudience: 'Directeurs d’écoles de musique, universités, centres culturels',
    contentByPlatform: {
      linkedin: {
        text: `Face à l'arrivée massive des outils d'IA chez leurs élèves, que doivent transmettre les écoles de musique et les conservatoires ?

Interdire ? Inutile : les étudiants ont tous Suno ou FL Studio sur leur smartphone.
Ignorer ? Dangereux : c'est abandonner le sens critique au profit du réflexe consommateur.

Dans ma conférence-masterclass « La Musique à l’épreuve de l’IA : Pratiques, Limites et Opportunités », nous abordons concrètement :
• Les principes de la co-création éthique homme-machine.
• Pourquoi le solfège de l'oreille devient plus crucial que jamais face aux synthèses algorithmiques.
• Des démonstrations live de prompt musical et d'hybridation avec claviers réels.

Programmation ouverte pour la saison 2026-2027 en présentiel (Cameroun, France, Afrique francophone) ou visio-conférence interactive d'élite.

Catalogue des interventions et dossiers de présentation :
👉 https://herve-nanfang.com/conferences`,
        hashtags: ['#MasterclassMusique', '#EnseignementSuperieur', '#IAEtEducation', '#Conservatoire', '#HerveNanfang'],
        charCount: 1020,
      },
      whatsapp: {
        text: `*Conférences & Masterclasses · Hervé Nanfang*

« *La Musique à l'épreuve de l'IA : du clavier au modèle génératif* »

Dispositifs d'intervention spécialement conçus pour les conservatoires, écoles de musique, universités et festivals culturels.

Consultez les thématiques disponibles :
👉 https://herve-nanfang.com/conferences

_Pour recevoir la fiche technique et étudier une date dans votre établissement, répondez simplement à ce message._`,
        hashtags: [],
        charCount: 420,
      },
      facebook: {
        text: `Comment préparer la nouvelle génération de musiciens au monde de l'intelligence artificielle ? 🎹🎓

C'est l'objectif de nos masterclasses « Musicien Augmenté™ » : donner aux jeunes créateurs la maîtrise de leur oreille pour ne jamais devenir les esclaves de la technologie.

Découvrez les programmes disponibles pour vos écoles et structures :
🔗 https://herve-nanfang.com/conferences`,
        hashtags: ['#HerveNanfang', '#Masterclass', '#Formation', '#Pédagogie'],
        charCount: 430,
      },
    },
    notes: 'Ciblage des décideurs académiques et organisateurs d’événements de formation.',
    createdAt: '2026-10-23T09:00:00Z',
    updatedAt: '2026-10-23T09:00:00Z',
  },

  {
    id: 'pub-06-live-duo-keys',
    title: 'Extrait Live · Duo Voice & Keys : l’art de l’accompagnement épuré',
    sourceType: 'musique',
    sourceSlug: 'pianobariste',
    sourceTitle: 'Duo Voice & Keys',
    scheduledDate: '2026-11-07',
    scheduledTime: '18:30',
    status: 'a_valider',
    platforms: ['youtube', 'facebook', 'instagram'],
    mediaUrl: '/images/hero-duo-live.webp',
    linkUrl: 'https://herve-nanfang.com/musique#pianobariste',
    ctaLabel: 'Écouter le duo',
    targetAudience: 'Mélomanes, hôteliers, organisateurs d’événements privés',
    contentByPlatform: {
      youtube: {
        text: `Hervé Nanfang · Duo Voice & Keys (Session Acoustique Live)

L'art du piano-bar ne réside pas dans l'abondance de notes, mais dans l'art de ménager le silence et d'envelopper la voix. 

Retrouvez l'univers d'Hervé Nanfang sur la plateforme officielle :
🌐 https://herve-nanfang.com
🎹 Réservations de prestations privées & événements de prestige : contact@herve-nanfang.com`,
        hashtags: ['#PianoBar', '#DuoAcoustique', '#HerveNanfang', '#LiveMusic', '#PianoEtVoix'],
        charCount: 380,
      },
      facebook: {
        text: `Le samedi soir au piano... 🎹🎙️

Avec le Duo Voice & Keys, nous cherchons cette alchimie rare où le clavier dialogue avec chaque inflexion de la voix. Rien de préenregistré, aucune bande-son artificielle : seulement le toucher, le souffle et le plaisir de partager avec vous.

Découvrez notre univers live sur le site officiel :
👉 https://herve-nanfang.com/musique#pianobariste

Très belle soirée en musique à tous !`,
        hashtags: ['#HerveNanfang', '#DuoLive', '#PianoBar', '#MusiqueEnDirect'],
        charCount: 430,
      },
      instagram: {
        text: `Voice & Keys. Le toucher au service du chant. 🎹✨

Chaque soirée est une improvisation élégante, pensée pour sublimer l'atmosphère du lieu.

Prestations live, piano-bar et événements privés.
Informations et réservations en bio.`,
        hashtags: ['#Pianobariste', '#HerveNanfang', '#AcousticDuo', '#LivePiano', '#NightMusic', '#Yaounde'],
        charCount: 260,
      },
    },
    notes: 'Valorisation visuelle et acoustique pour susciter des bookings de fin d’année.',
    createdAt: '2026-10-23T09:00:00Z',
    updatedAt: '2026-10-23T09:00:00Z',
  },

  // ==========================================
  // SEMAINE 3 : PATRIMOINE AFRICAIN & RMA
  // ==========================================
  {
    id: 'pub-07-rma-preservation',
    title: 'Pilier 04 · Le Répertoire Musical Africain (RMA) : préserver par l’expérimentation',
    sourceType: 'article',
    sourceSlug: 'rma-patrimoine-et-futur',
    sourceTitle: 'Le Répertoire Musical Africain : pourquoi la préservation exige l\'expérimentation',
    scheduledDate: '2026-11-09',
    scheduledTime: '08:30',
    status: 'a_valider',
    platforms: ['linkedin', 'facebook', 'whatsapp', 'site'],
    mediaUrl: '/images/shooting-pro-officiel.webp',
    linkUrl: 'https://herve-nanfang.com/journal/rma-patrimoine-et-futur',
    ctaLabel: 'Découvrir le manifeste RMA',
    targetAudience: 'Institutions patrimoniales, chercheurs, ministères de la culture, diaspora',
    contentByPlatform: {
      linkedin: {
        text: `Archiver nos musiques traditionnelles dans des bibliothèques ne suffit pas. Si elles ne vivent plus sous les doigts des jeunes générations, elles meurent.

C'est le combat central du projet Répertoire Musical Africain (RMA) que je porte depuis plusieurs années :
« La préservation exige l'expérimentation. »

Pourquoi tant de nos trésors polyrythmiques et de nos échelles modales restent-ils absents des cursus académiques mondiaux ?
Parce que nous avons trop longtemps attendu que d'autres formalisent nos propres grammaires sonores.

Dans cet article fondamental du Journal, je détaille :
1. Les limites de l'approche muséale passive.
2. La transposition des motifs traditionnels (Makossa, Mangambeu, Bikutsi, Assiko) sur les claviers numériques modernes.
3. Pourquoi l'avenir des archives africaines réside dans des bibliothèques sonores interactives et des partitions universelles.

📖 Article intégral :
👉 https://herve-nanfang.com/journal/rma-patrimoine-et-futur

Un enjeu de souveraineté culturelle capital pour tout le continent. Partageons et transmettons.`,
        hashtags: ['#PatrimoineAfricain', '#MusiqueTraditionnelle', '#SouveraineteCulturelle', '#RMA', '#HerveNanfang'],
        charCount: 1110,
      },
      facebook: {
        text: `Nos rythmes et nos mélodies traditionnelles sont des trésors vivants, pas des pièces de musée ! 🌍🥁

Avec le projet RMA (Répertoire Musical Africain), nous nous battons pour que les musiques du Cameroun et du continent soient retranscrites, enseignées et jouées sur tous les claviers du monde.

Découvrez pourquoi la préservation passe nécessairement par l'action et la modernité :
📖 https://herve-nanfang.com/journal/rma-patrimoine-et-futur

Faites voyager ce message pour notre patrimoine commun !`,
        hashtags: ['#HerveNanfang', '#RMA', '#Cameroun', '#Afrique', '#HeritageCulturel'],
        charCount: 520,
      },
      whatsapp: {
        text: `*RMA · Répertoire Musical Africain*

« *Pourquoi la préservation de nos musiques exige l'expérimentation* »

Le plaidoyer d'Hervé Nanfang pour formaliser, retranscrire et moderniser le patrimoine musical africain sans jamais le trahir.

À lire absolument :
👉 https://herve-nanfang.com/journal/rma-patrimoine-et-futur

_Partagez dans vos réseaux culturels et artistiques._`,
        hashtags: [],
        charCount: 380,
      },
    },
    notes: 'Plaidoyer d’autorité pour la dimension patrimoniale et institutionnelle d’Hervé.',
    createdAt: '2026-10-23T09:00:00Z',
    updatedAt: '2026-10-23T09:00:00Z',
  },

  {
    id: 'pub-08-permis-de-jouer',
    title: 'Projet Signature · Permis de Jouer™ : la méthode d’accès au clavier décomplexée',
    sourceType: 'projet',
    sourceSlug: 'permis-de-jouer',
    sourceTitle: 'Permis de Jouer™',
    scheduledDate: '2026-11-12',
    scheduledTime: '11:30',
    status: 'a_valider',
    platforms: ['facebook', 'whatsapp', 'instagram'],
    mediaUrl: '/images/02-eleves-musique.jpg',
    linkUrl: 'https://herve-nanfang.com/projets#permis-de-jouer',
    ctaLabel: 'Découvrir la méthode',
    targetAudience: 'Parents d’élèves, autodidactes, adultes débutants, amateurs passionnés',
    contentByPlatform: {
      facebook: {
        text: `Combien de personnes ont abandonné le piano après des années de théorie rébarbative sans jamais avoir pris plaisir à jouer un morceau ? 🎹😢

C'est pour briser ce blocage que j'ai créé le concept Permis de Jouer™ :
Une approche pragmatique où le toucher, l'oreille et la sensation du clavier précèdent les blocages psychologiques. Comme pour le permis de conduire, l'objectif est d'être immédiatement autonome sur la route !

Découvrez le programme et nos ateliers pédagogiques :
👉 https://herve-nanfang.com/projets#permis-de-jouer

N'ayez plus peur du clavier : la musique est avant tout une joie à partager !`,
        hashtags: ['#PermisDeJouer', '#ApprendreLePiano', '#HerveNanfang', '#PedagogiePositive', '#PianoPourTous'],
        charCount: 650,
      },
      whatsapp: {
        text: `*Permis de Jouer™ par Hervé Nanfang*

Vous avez toujours rêvé de jouer du piano sans passer par 5 ans de solfège austère ?

La méthode Permis de Jouer™ permet d'acquérir les réflexes fondamentaux d'harmonie et d'accompagnement rapidement et durablement.

Découvrez le projet :
👉 https://herve-nanfang.com/projets#permis-de-jouer

_Inscriptions aux sessions d'initiation et de perfectionnement : écrivez-nous en retour de ce message._`,
        hashtags: [],
        charCount: 440,
      },
      instagram: {
        text: `Permis de Jouer™ : libérer les mains, aiguiser l'oreille. 🎹🚀

La pédagogie n'a de sens que si elle donne à l'élève la liberté de s'exprimer par lui-même.

Retrouvez nos modules de transmission sur la plateforme officielle.
Lien en bio.`,
        hashtags: ['#PermisDeJouer', '#HerveNanfang', '#PianoLesson', '#Transmission', '#Yaounde', '#Pianiste'],
        charCount: 260,
      },
    },
    notes: 'Attirer les demandes de cours et masterclasses individuelles ou collectives.',
    createdAt: '2026-10-23T09:00:00Z',
    updatedAt: '2026-10-23T09:00:00Z',
  },

  // ==========================================
  // SEMAINE 4 : LE PIANOBARISTE™ & CONVERSIONS
  // ==========================================
  {
    id: 'pub-09-pianobariste-presence',
    title: 'Pilier 05 · Le Pianobariste™ : réinventer la présence vivante face aux playlists préfabriquées',
    sourceType: 'article',
    sourceSlug: 'pianobariste-art-de-la-presence',
    sourceTitle: 'Le Pianobariste : réinventer la présence vivante à l\'heure du son d\'ambiance préfabriqué',
    scheduledDate: '2026-11-16',
    scheduledTime: '09:00',
    status: 'a_valider',
    platforms: ['linkedin', 'facebook', 'whatsapp', 'site'],
    mediaUrl: '/images/hero-duo-live.webp',
    linkUrl: 'https://herve-nanfang.com/journal/pianobariste-art-de-la-presence',
    ctaLabel: 'Lire l’article',
    targetAudience: 'Directeurs d’hôtels 5*, restaurants gastronomiques, concepteurs d’espaces d’accueil',
    contentByPlatform: {
      linkedin: {
        text: `Pourquoi les grands hôtels investissent-ils des fortunes en architecture d'intérieur pour ensuite diffuser une playlist Spotify anonyme ?

Le son d'un lieu est son odeur invisible. Une playlist algorithmique n'observe pas la salle. Elle ne sait pas si les convives ont besoin de discrétion feutrée ou d'une montée d'énergie après le dessert.

C'est tout le fondement du concept déposé Le Pianobariste™ :
Le pianiste n'est pas un diffuseur de fond sonore. C'est un régulateur d'atmosphère, un metteur en scène invisible de l'expérience client.

Dans cet article, j'analyse :
• La différence économique entre sonorisation passive et valeur ajoutée d'une présence live.
• L'art du dosage dynamique selon les moments du service.
• Pourquoi le piano acoustique reste le plus puissant vecteur de fidélisation pour les établissements d'exception.

À lire sur le Journal :
👉 https://herve-nanfang.com/journal/pianobariste-art-de-la-presence

Vous gérez un lieu de prestige ou préparez un événement d'exception ? Parlons ambiance et dramaturgie sonore.`,
        hashtags: ['#HotellerieDeLuxe', '#ExperienceClient', '#Pianobariste', '#HerveNanfang', '#LiveMusic'],
        charCount: 1110,
      },
      facebook: {
        text: `Une playlist automatique ne ressentira jamais ce que ressent une salle de restaurant ou le salon feutré d'un hôtel. 🎹🥂

C'est là que réside toute la magie du Pianobariste™ : adapter chaque note, chaque silence, chaque harmonie au rythme de vos conversations et à l'énergie de l'instant.

Retrouvez ma vision de la présence vivante dans cet article :
👉 https://herve-nanfang.com/journal/pianobariste-art-de-la-presence

Partagez avec ceux qui aiment les vraies soirées au piano !`,
        hashtags: ['#LePianobariste', '#HerveNanfang', '#PianoBar', '#MusiqueVivante'],
        charCount: 490,
      },
      whatsapp: {
        text: `*Hervé Nanfang · Le Pianobariste™*

« *Réinventer la présence vivante à l'heure du son d'ambiance préfabriqué* »

Pourquoi le piano live transforme radicalement l'expérience de vos invités et donne une signature inoubliable à chaque réception.

L'article complet :
👉 https://herve-nanfang.com/journal/pianobariste-art-de-la-presence

_Programmation et réservations de piano-bar d'exception : contactez-nous directement par ce canal._`,
        hashtags: [],
        charCount: 420,
      },
    },
    notes: 'Ciblage stratégique pour les réservations événementielles de fêtes de fin d’année.',
    createdAt: '2026-10-23T09:00:00Z',
    updatedAt: '2026-10-23T09:00:00Z',
  },

  {
    id: 'pub-10-booking-fin-annee',
    title: 'Booking & Prestations · Calendrier des réceptions privées et soirées de gala',
    sourceType: 'service',
    sourceSlug: 'pianobariste',
    sourceTitle: 'Prestations live & piano-bar',
    scheduledDate: '2026-11-19',
    scheduledTime: '11:00',
    status: 'a_valider',
    platforms: ['whatsapp', 'facebook', 'linkedin'],
    mediaUrl: '/images/shooting-pro-officiel.webp',
    linkUrl: 'https://herve-nanfang.com/contact#booking',
    ctaLabel: 'Réserver une date',
    targetAudience: 'Organisateurs de mariages d’élite, entreprises, ambassades, réceptions privées',
    contentByPlatform: {
      whatsapp: {
        text: `*Hervé Nanfang · Saison Événementielle 2026-2027*

Chers partenaires et amis, les réservations pour les soirées de gala, dîners d'entreprises et réceptions privées de fin d'année sont ouvertes.

Formules disponibles :
🎹 *Piano Solo Signature* · Intimiste, feutré, répertoire jazz, afro-classic & international
🎙️ *Duo Voice & Keys* · Ambiance raffinée, standards revisités
🎺 *Quartet Prestige* · Dynamique live pour cocktails et célébrations

Vérifiez les dates encore disponibles :
👉 https://herve-nanfang.com/contact#booking

_Réservez votre créneau dès maintenant par retour de message ou par téléphone au +237 694 72 34 92._`,
        hashtags: [],
        charCount: 600,
      },
      facebook: {
        text: `Les fêtes et réceptions de fin d'année approchent à grands pas ! 🥂🎹

Vous souhaitez offrir à vos convives l'élégance inimitable d'un piano live ?
Que ce soit en solo feutré ou avec le Duo Voice & Keys, nous concevons une ambiance sur mesure pour votre mariage, dîner de gala ou réception privée.

Consultez les formules et effectuez votre demande de date :
👉 https://herve-nanfang.com/contact#booking

À très bientôt autour du piano !`,
        hashtags: ['#HerveNanfang', '#PianoLive', '#SoireePrivee', '#EvenementDePrestige', '#Yaounde'],
        charCount: 490,
      },
      linkedin: {
        text: `Événements corporatifs, clôtures annuelles, remises de prix et dîners protocolaires : quelle mémoire sonore laissez-vous à vos invités de marque ?

L'accueil musical de vos convives donne le ton de votre soirée dès les premières secondes. 

Avec plus de 25 ans d'expérience sur les scènes internationales et dans les réceptions diplomatiques, Hervé Nanfang conçoit des cadres musicaux raffinés et sur mesure.

Réservations de dates prioritaires :
👉 https://herve-nanfang.com/contact#booking`,
        hashtags: ['#CorporateEvents', '#GalaDinner', '#HerveNanfang', '#LiveMusicEvent'],
        charCount: 510,
      },
    },
    notes: 'Conversion directe pour le chiffre d’affaires live de fin d’année.',
    createdAt: '2026-10-23T09:00:00Z',
    updatedAt: '2026-10-23T09:00:00Z',
  },
]

/**
 * Générateur de fichier iCalendar (.ics) RFC 5545
 * Permet d'importer tout le calendrier de publication dans Google Calendar, Apple Calendar ou Outlook !
 */
export function exportPublicationsToIcs(posts: SocialPost[]): string {
  const pad = (n: number) => String(n).padStart(2, '0')

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Herve Nanfang//Calendrier de Publication Organique//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:HN Marque - Calendrier de Publication',
    'X-WR-TIMEZONE:Africa/Douala',
  ]

  for (const post of posts) {
    if (post.status === 'archive') continue

    // Date/time format YYYYMMDDTHHmm00
    const [year, month, day] = post.scheduledDate.split('-').map(Number)
    const [hours, minutes] = (post.scheduledTime || '09:00').split(':').map(Number)

    if (!year || !month || !day) continue

    const dtStart = `${year}${pad(month)}${pad(day)}T${pad(hours || 9)}${pad(minutes || 0)}00`
    const endHour = (hours || 9) + 1
    const dtEnd = `${year}${pad(month)}${pad(day)}T${pad(endHour)}${pad(minutes || 0)}00`

    // Extract best copy for calendar description
    const platformCopy =
      post.contentByPlatform.linkedin?.text ||
      post.contentByPlatform.facebook?.text ||
      post.contentByPlatform.whatsapp?.text ||
      ''

    const escapedDesc = (
      `Statut: ${post.status.toUpperCase()}\\n` +
      `Plateformes: ${post.platforms.join(', ')}\\n` +
      `Lien: ${post.linkUrl || 'https://herve-nanfang.com'}\\n\\n` +
      `--- CONTENU À DIFFUSER ---\\n` +
      platformCopy.replace(/\n/g, '\\n').replace(/,/g, '\\,')
    ).slice(0, 1500)

    const summary = `[${post.status === 'valide' ? 'PRÊT' : post.status === 'publie' ? 'PUBLIÉ' : 'À VALIDER'}] ${post.title.replace(/,/g, '\\,')}`

    lines.push(
      'BEGIN:VEVENT',
      `UID:${post.id}@herve-nanfang.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${escapedDesc}`,
      `URL:${post.linkUrl || 'https://herve-nanfang.com'}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      `DESCRIPTION:Rappel de diffusion : ${post.title.replace(/,/g, '\\,')}`,
      'END:VALARM',
      'END:VEVENT',
    )
  }

  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}
