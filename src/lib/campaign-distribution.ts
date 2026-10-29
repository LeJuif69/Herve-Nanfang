import type {
  AdminArticle,
  CampaignAsset,
  PlatformContent,
  SocialPlatform,
  SocialPost,
} from './admin-types'
import { computeSocialPostHash } from './admin-types'
import { addDaysToDateStr, siteUrl } from './social-generator'

/**
 * Options pour la génération de paramètres UTM normalisés.
 * Ne modifie jamais l'URL canonique originale de la ressource.
 */
export interface UtmOptions {
  source: string // e.g. 'linkedin', 'facebook', 'whatsapp', 'youtube', 'tiktok', 'newsletter', 'medium', 'presse'
  medium: string // e.g. 'social', 'status', 'video', 'email', 'syndication', 'pitch'
  campaign?: string // Défaut : 'distribution_article'
  content?: string // e.g. 'j0_annonce', 'j1_statut', 'j3_video_60s', 'j5_carrousel', 'j7_newsletter', 'j10_faq', 'j14_syndication'
  term?: string
}

/**
 * Construit une URL de suivi UTM sans altérer l'URL canonique.
 */
export function buildUtmUrl(baseUrl: string, options: UtmOptions): string {
  const [cleanBase, existingQuery] = baseUrl.split('?')
  const params = new URLSearchParams(existingQuery || '')
  params.set('utm_source', options.source.toLowerCase().trim())
  params.set('utm_medium', options.medium.toLowerCase().trim())
  params.set('utm_campaign', (options.campaign || 'distribution_article').toLowerCase().trim())
  if (options.content) {
    params.set('utm_content', options.content.toLowerCase().trim())
  }
  if (options.term) {
    params.set('utm_term', options.term.toLowerCase().trim())
  }
  return `${cleanBase}?${params.toString()}`
}

export interface CampaignDistributionPlan {
  article: AdminArticle
  baseDate: string
  canonicalUrl: string
  campaignId: string
  assets: CampaignAsset[]
  posts: SocialPost[]
}

/**
 * Générateur de Campagne de Distribution Multicanal NANHÉ
 * 
 * Signature de marque : Créer · Transmettre · Augmenter · Développer
 * 
 * Génère les 9 formats éditoriaux adaptés à partir d'un article original :
 * 1. Résumé éditorial de marque (J0)
 * 2. Publication LinkedIn (J0)
 * 3. Publication Facebook (J0)
 * 4. Séquence de statuts WhatsApp - Volet 1 (J1)
 * 5. Script vidéo 30–60 secondes (J3)
 * 6. Plan de carrousel pédagogique 5–7 slides (J5)
 * 7. Brouillon de newsletter complète (J7)
 * 8. Contenu complémentaire FAQ / Note d'atelier (J10)
 * 9. Proposition de republication Medium avec balise canonique (J14)
 * 10. Message de proposition de tribune pour média partenaire (J14)
 */
export function generateArticleCampaignDistribution(
  article: AdminArticle,
  baseDateStr?: string,
): CampaignDistributionPlan {
  const baseDate = baseDateStr || new Date().toISOString().slice(0, 10)
  const canonicalUrl = siteUrl(`/journal/${article.slug}`)
  const campaignId = `camp-${article.slug}-${Date.now()}`

  // Extraction des sections structurées de l'article original
  const outlinePoints =
    article.outline && article.outline.length > 0
      ? article.outline.slice(0, 5)
      : [
          'Diagnostic de terrain : dépasser les habitudes techniques réductrices',
          'Méthode éprouvée : allier rigueur acoustique et vision artistique',
          'Geste professionnel : préserver l’intention et la souveraineté du créateur',
        ]

  const firstSection = article.body?.[0]
  const secondSection = article.body?.[1]
  const thirdSection = article.body?.[2]

  const firstSectionHeading = firstSection?.heading || 'Le constat initial'
  const firstSectionExcerpt = firstSection?.paragraphs?.[0] || article.excerpt
  const secondSectionHeading = secondSection?.heading || 'La démarche concrète'
  const secondSectionExcerpt = secondSection?.paragraphs?.[0] || 'La rigueur d’écoute avant la profusion d’outils.'
  const thirdSectionHeading = thirdSection?.heading || 'L’enjeu d’avenir'
  const thirdSectionExcerpt = thirdSection?.paragraphs?.[0] || 'Construire une œuvre durable et reconnue.'

  const baseTags =
    article.keywords && article.keywords.length > 0
      ? article.keywords.slice(0, 5).map((k) => `#${k.replace(/[^a-zA-Z0-9À-ÿ]/g, '')}`)
      : ['#Musique', '#Innovation', '#Pedagogie', '#HerveNanfang']

  const assets: CampaignAsset[] = []

  // --------------------------------------------------------------------------
  // ASSET 1 (J0) : RÉSUMÉ ÉDITORIAL & FICHE STRATÉGIQUE DE MARQUE
  // --------------------------------------------------------------------------
  const dateJ0 = addDaysToDateStr(baseDate, 0)
  const utmEditorial = buildUtmUrl(canonicalUrl, {
    source: 'site',
    medium: 'editorial',
    campaign: 'distribution_article',
    content: 'j0_resume_strategique',
  })

  const editorialSummaryText = `# FICHE ÉDITORIALE & STRATÉGIE DE MARQUE

**Titre :** « ${article.title} »
**Pilier Journal :** ${article.category} (${article.readingTime || '6 min'})
**Public cible :** ${article.audience || 'Professionnels, chercheurs, pédagogues et créateurs exigeants'}
**URL Canonique Officielle :** ${canonicalUrl}

---

### 1. Thèse & Problématique
${article.excerpt}

### 2. Articulation avec la signature de marque :
• **CRÉER :** Ancrer le geste musical dans une intention singulière, affranchie des stéréotypes et des recettes prêtes à l'emploi.
• **TRANSMETTRE :** Partager les fondements pédagogiques et la rigueur d'écoute issus des traditions orales et de la méthode Permis de Jouer™.
• **AUGMENTER :** Intégrer les technologies contemporaines (MAO, synthèse sonore, IA générative) comme des amplificateurs du discernement humain.
• **DÉVELOPPER :** Structurer la souveraineté économique de l'artiste indépendant, la gestion des droits OAPI et la pérennité de l'œuvre.

### 3. Points clés du dossier :
${outlinePoints.map((pt, i) => `${i + 1}. ${pt}`).join('\n')}

---
*Document de référence interne NANHÉ — Tous droits réservés.*`

  assets.push({
    type: 'editorial_summary',
    title: `[Résumé Éditorial · J0] ${article.title}`,
    platform: 'site',
    dayOffset: 0,
    dayLabel: 'J0',
    targetDate: dateJ0,
    targetTime: '08:00',
    pillar: 'autorite',
    content: editorialSummaryText,
    characterCount: editorialSummaryText.length,
    hashtags: ['#StrategieMarque', '#DirectionArtistique', '#HerveNanfang'],
    canonicalUrl,
    utmUrl: utmEditorial,
    notes: 'Document de cadrage stratégique. Résume la thèse et valide l’alignement avec les 4 verbes de marque.',
    requiresProof: false,
  })

  // --------------------------------------------------------------------------
  // ASSET 2 (J0) : PUBLICATION LINKEDIN (Analyse de Fond & Débat d'Autorité)
  // --------------------------------------------------------------------------
  const utmLinkedIn = buildUtmUrl(canonicalUrl, {
    source: 'linkedin',
    medium: 'social',
    campaign: 'distribution_article',
    content: 'j0_analyse_fond',
  })

  const linkedinHook = `Pourquoi tant de démarches artistiques et techniques s'essoufflent-elles avant même d'avoir trouvé leur public ?`
  const linkedinContent = `${linkedinHook}

Dans mon nouveau dossier d'analyse :
« ${article.title} »

${article.excerpt}

Sur le terrain, entre répétitions scéniques, sessions studio et direction d'académie, 3 constats s'imposent à quiconque cherche la pérennité :

1️⃣ ${outlinePoints[0] || 'L’intention artistique doit précéder l’empilement technique.'}
2️⃣ ${outlinePoints[1] || 'La rigueur d’écoute et la culture des racines protègent contre l’uniformisation.'}
3️⃣ ${outlinePoints[2] || 'La maîtrise technologique n’a de valeur que si elle sert un récit singulier.'}

L'enjeu n'est pas de refuser l'innovation, mais de ne jamais lui abandonner son discernement, sa voix et sa mémoire.

👉 Retrouvez l’analyse intégrale, les relevés et la méthodologie sur le Journal du Musicien Augmenté™ :
${utmLinkedIn}

Quel est votre retour d'expérience sur ce point précis ? J'attends vos réflexions en commentaire.

#MusicienAugmente #DirectionArtistique #PedagogieMusicale #IndustriesCulturelles #HerveNanfang ${baseTags.slice(0, 3).join(' ')}`

  assets.push({
    type: 'linkedin',
    title: `[LinkedIn · J0] ${article.title}`,
    platform: 'linkedin',
    dayOffset: 0,
    dayLabel: 'J0',
    targetDate: dateJ0,
    targetTime: '08:30',
    pillar: 'autorite',
    content: linkedinContent,
    characterCount: linkedinContent.length,
    hashtags: ['#MusicienAugmente', '#DirectionArtistique', '#PedagogieMusicale', ...baseTags.slice(0, 3)],
    canonicalUrl,
    utmUrl: utmLinkedIn,
    notes: 'Publication de lancement LinkedIn. Ton d’autorité mesuré, appel au débat constructif sans sensationnalisme.',
    requiresProof: true,
  })

  // --------------------------------------------------------------------------
  // ASSET 3 (J0) : PUBLICATION FACEBOOK (Vulgarisation Accessible & Communauté)
  // --------------------------------------------------------------------------
  const utmFacebook = buildUtmUrl(canonicalUrl, {
    source: 'facebook',
    medium: 'social',
    campaign: 'distribution_article',
    content: 'j0_communaute',
  })

  const fbHook = `🎵 « ${article.title} » : comprendre l'essentiel sans détours.`
  const facebookContent = `${fbHook}

${article.excerpt}

Si vous chantez, jouez d'un instrument, produisez en home-studio ou encadrez de jeunes créateurs, voici 3 enseignements directs que j'applique chaque jour :

✅ 1. ${outlinePoints[0] || 'Clarifier l’émotion et l’histoire avant de toucher aux réglages'}
✅ 2. ${outlinePoints[1] || 'S’appuyer sur des bases solides (rythme, oreille, harmonie) pour être libre'}
✅ 3. ${outlinePoints[2] || 'Rester soi-même sans chercher à imiter les tendances éphémères'}

Le guide complet (${article.readingTime || '6 min'} de lecture) est disponible en libre accès sur mon site officiel :
👉 ${utmFacebook}

Partagez cette publication à un ami musicien ou un passionné que ce sujet fera avancer !`

  assets.push({
    type: 'facebook',
    title: `[Facebook · J0] ${article.title}`,
    platform: 'facebook',
    dayOffset: 0,
    dayLabel: 'J0',
    targetDate: dateJ0,
    targetTime: '12:30',
    pillar: 'communaute',
    content: facebookContent,
    characterCount: facebookContent.length,
    hashtags: ['#HerveNanfang', '#MusiqueVivante', '#PartageMusical', ...baseTags.slice(0, 2)],
    canonicalUrl,
    utmUrl: utmFacebook,
    notes: 'Format grand public favorisant l’engagement, le partage et les commentaires bienveillants.',
    requiresProof: true,
  })

  // --------------------------------------------------------------------------
  // ASSET 4 (J1) : SÉQUENCE STATUTS WHATSAPP — VOLET 1 (Note d'Atelier)
  // --------------------------------------------------------------------------
  const dateJ1 = addDaysToDateStr(baseDate, 1)
  const utmWhatsApp1 = buildUtmUrl(canonicalUrl, {
    source: 'whatsapp',
    medium: 'status',
    campaign: 'distribution_article',
    content: 'j1_statut_decouverte',
  })

  const whatsappSequence1 = `[SÉQUENCE STATUTS WHATSAPP EN 3 ÉCRANS]

📲 ÉCRAN 1 (Le constat brut) :
« ${article.title} »
Un sujet dont on parle souvent en surface, mais rarement avec la réalité du terrain.

---
📲 ÉCRAN 2 (La clé d’expérience) :
${outlinePoints[0] || 'L’intention doit être claire avant de chercher la technique.'}
En 20 ans de piano et de scène, c’est la règle qui ne m’a jamais trompé.

---
📲 ÉCRAN 3 (Lien & Échange) :
J’ai réuni toute la méthodologie dans un article de fond sur le Journal :
👉 ${utmWhatsApp1}

Répondez directement à ce statut si vous souhaitez en discuter !
— Hervé Nanfang`

  assets.push({
    type: 'whatsapp_status',
    title: `[WhatsApp Séquence 1 · J1] ${article.title}`,
    platform: 'whatsapp',
    dayOffset: 1,
    dayLabel: 'J1',
    targetDate: dateJ1,
    targetTime: '10:15',
    pillar: 'communaute',
    content: whatsappSequence1,
    characterCount: whatsappSequence1.length,
    hashtags: [],
    canonicalUrl,
    utmUrl: utmWhatsApp1,
    notes: 'Diffusion intime via Statuts et liste de diffusion RMA / réseau direct.',
    requiresProof: true,
  })

  // --------------------------------------------------------------------------
  // ASSET 5 (J3) : SCRIPT VIDÉO 30–60 SECONDES (Shorts / Reels / TikTok)
  // --------------------------------------------------------------------------
  const dateJ3 = addDaysToDateStr(baseDate, 3)
  const utmVideo = buildUtmUrl(canonicalUrl, {
    source: 'youtube',
    medium: 'video',
    campaign: 'distribution_article',
    content: 'j3_video_60s',
  })

  const videoScript = `[SCRIPT VIDÉO VERTICALE 30–60 SECONDES — FACE CAMÉRA / PIANO ACOUSTIQUE]

⏱️ 00:00 – 00:03 | ACCROCHE (ARRÊT DU SCROLL) :
(Face caméra, regard posé, toucher une note suspendue au piano)
« Si vous pensez que ${article.title.toLowerCase().slice(0, 38)}… n'est qu'une affaire de logiciel ou de matériel, écoutez ceci. »

⏱️ 00:03 – 00:20 | LE CONTRASTE DE TERRAIN :
(Plan serré sur les mains ou l’écran de travail)
« Regardez l’erreur que la plupart commettent machinalement : empiler des couches sans intention précise.
Et voilà ce qui se passe quand on applique le geste juste : (démonstration acoustique nette). »

⏱️ 00:20 – 00:45 | LA RÉVÉLATION MÉTHODOLOGIQUE :
« Pourquoi ? Parce que :
1. ${outlinePoints[0] || 'Le son commence dans votre oreille intérieure, pas dans le micro.'}
2. ${outlinePoints[1] || 'La tradition orale et la science moderne se complètent parfaitement.'}
C’est exactement ce que je transmets dans mon dossier de la semaine. »

⏱️ 00:45 – 01:00 | APPEL À L’ACTION (CTA) :
« Retrouvez l’étude complète et les exemples sur hervenanfang.vercel.app dans le Journal.
Abonnez-vous pour la suite des carnets d’atelier ! »

---
Légende vidéo :
« ${article.title} » 🎹 Décryptage en 60 secondes.
Lien complet vers l’article : ${utmVideo}`

  assets.push({
    type: 'video_script',
    title: `[Script Vidéo 30-60s · J3] ${article.title}`,
    platform: 'youtube',
    dayOffset: 3,
    dayLabel: 'J3',
    targetDate: dateJ3,
    targetTime: '18:15',
    pillar: 'decouverte',
    content: videoScript,
    characterCount: videoScript.length,
    hashtags: ['#Shorts', '#Reels', '#PianoTok', '#HerveNanfang', ...baseTags.slice(0, 2)],
    canonicalUrl,
    utmUrl: utmVideo,
    notes: 'Script minuté vertical 9:16 pour YouTube Shorts, Instagram Reels et TikTok. Format découverte 40%.',
    requiresProof: true,
  })

  // --------------------------------------------------------------------------
  // ASSET 6 (J5) : PLAN DE CARROUSEL PÉDAGOGIQUE (5–7 Diapositives)
  // --------------------------------------------------------------------------
  const dateJ5 = addDaysToDateStr(baseDate, 5)
  const utmCarousel = buildUtmUrl(canonicalUrl, {
    source: 'instagram',
    medium: 'social',
    campaign: 'distribution_article',
    content: 'j5_carrousel_7slides',
  })

  const carouselPlan = `[PLAN DE CARROUSEL PÉDAGOGIQUE 7 DIAPOSITIVES — CANVA / FIGMA / LINKEDIN PDF]

👉 SLIDE 1 — COUVERTURE & ACCROCHE
Titre principal : « ${article.title} »
Sous-titre : 7 clés d'expérience pour musiciens, pédagogues et créateurs indépendants.
Direction visuelle : Fond sombre épuré (#0B0B0C), typographie serif contrastée, portrait en clair-obscur d'Hervé Nanfang.

👉 SLIDE 2 — LE DIAGNOSTIC INITIAL
Titre : « ${firstSectionHeading} »
Texte synthétique : ${firstSectionExcerpt.slice(0, 240)}…
Icône : ⚠️ Le piège à éviter.

👉 SLIDE 3 — LA RÉALITÉ ACOUSTIQUE & CULTURELLE
Titre : « ${secondSectionHeading} »
Texte synthétique : ${secondSectionExcerpt.slice(0, 240)}…
Accent : Pourquoi les recettes toutes faites échouent face à la singularité du timbre.

👉 SLIDE 4 — LEVIER 1 (CRÉER)
Titre : L'intention avant l'instrument
Texte : ${outlinePoints[0] || 'Poser la signature artistique avant de multiplier les pistes.'}

👉 SLIDE 5 — LEVIER 2 (TRANSMETTRE & AUGMENTER)
Titre : La science du groove et la rigueur d'écoute
Texte : ${outlinePoints[1] || 'La compréhension des métriques orales et la maîtrise technologique.'}

👉 SLIDE 6 — LEVIER 3 (DÉVELOPPER)
Titre : Souveraineté & Pérennité
Texte : ${outlinePoints[2] || 'Protéger son répertoire (droits OAPI) et construire un modèle viable.'}

👉 SLIDE 7 — SYNTHÈSE & APPEL À L'ACTION
Titre : Enregistrez ce carrousel pour vos prochaines sessions.
Texte : Dossier d'analyse intégrale en libre accès :
${utmCarousel}
Balayez vers le profil pour le lien direct.

---
Légende d'accompagnement :
Comment concilier authenticité artistique et exigence technique contemporaine ?
Balayez ce carrousel ➡️ et partagez votre avis en commentaire.`

  assets.push({
    type: 'pedagogical_carousel',
    title: `[Carrousel 7 Slides · J5] ${article.title}`,
    platform: 'instagram',
    dayOffset: 5,
    dayLabel: 'J5',
    targetDate: dateJ5,
    targetTime: '17:30',
    pillar: 'autorite',
    content: carouselPlan,
    characterCount: carouselPlan.length,
    hashtags: ['#CarrouselPédagogique', '#PianoLessons', '#MusicienAugmente', ...baseTags.slice(0, 3)],
    canonicalUrl,
    utmUrl: utmCarousel,
    notes: 'Structure complète 7 diapositives. Optimisé pour la sauvegarde et le temps de lecture sur Instagram et LinkedIn.',
    requiresProof: true,
  })

  // --------------------------------------------------------------------------
  // ASSET 7 (J7) : BROUILLON DE NEWSLETTER (Format Email Éprouvé)
  // --------------------------------------------------------------------------
  const dateJ7 = addDaysToDateStr(baseDate, 7)
  const utmNewsletter = buildUtmUrl(canonicalUrl, {
    source: 'newsletter',
    medium: 'email',
    campaign: 'distribution_article',
    content: 'j7_newsletter_fond',
  })

  const newsletterSubject = `[Les Carnets d’Hervé Nanfang] ${article.title.slice(0, 48)}…`
  const newsletterPreheader = `Pourquoi l’intention artistique précède impérativement la technique.`

  const newsletterDraft = `================================================================================
OBJET : ${newsletterSubject}
PRÉ-HEADER : ${newsletterPreheader}
================================================================================

Chères lectrices, chers lecteurs,

Cette semaine, au retour d'une répétition d'ensemble et d'une session de prise de son acoustique, j'ai repensé à une question qui revient sans cesse chez les artistes et étudiants que j'accompagne :

« Comment garder sa singularité dans un monde saturé d'outils automatisés ? »

C'est le cœur de la réflexion que j'ai consignée dans notre nouveau dossier :
« ${article.title} »

${article.excerpt}

Trois enseignements essentiels se détachent pour votre pratique :

1. ${outlinePoints[0] || 'Le discernement artistique reste irremplaçable'} : Aucun algorithme ne choisit pour vous le silence exact entre deux accords.
2. ${outlinePoints[1] || 'La profondeur des racines'} : C’est dans la maîtrise des dynamiques traditionnelles et de l'écoute intime que réside l’autorité d’un interprète.
3. ${outlinePoints[2] || 'La souveraineté créative'} : Maîtriser ses outils pour ne jamais en devenir le simple exécutant.

Si vous souhaitez approfondir la méthode complète et consulter nos relevés :

👉 [Lire l’article complet sur le Journal du Musicien Augmenté]
${utmNewsletter}

Prenez le temps de faire résonner ces principes sur votre instrument ou dans votre studio.

Avec toute ma considération musicale,

Hervé Nanfang
Pianobariste · Musicologue · Fondateur Racines Musicales Academy®
https://hervenanfang.vercel.app`

  assets.push({
    type: 'newsletter',
    title: `[Newsletter · J7] ${article.title}`,
    platform: 'newsletter',
    dayOffset: 7,
    dayLabel: 'J7',
    targetDate: dateJ7,
    targetTime: '09:00',
    pillar: 'autorite',
    content: newsletterDraft,
    characterCount: newsletterDraft.length,
    hashtags: [],
    canonicalUrl,
    utmUrl: utmNewsletter,
    subject: newsletterSubject,
    previewText: newsletterPreheader,
    notes: 'Brouillon email prêt à l’envoi. Style épistolaire chaleureux renforçant le lien direct avec les abonnés.',
    requiresProof: true,
  })

  // --------------------------------------------------------------------------
  // ASSET 8 (J10) : NOTE D'ATELIER & FAQ COMPLÉMENTAIRE (WhatsApp Séquence 2)
  // --------------------------------------------------------------------------
  const dateJ10 = addDaysToDateStr(baseDate, 10)
  const utmQa = buildUtmUrl(canonicalUrl, {
    source: 'whatsapp',
    medium: 'status',
    campaign: 'distribution_article',
    content: 'j10_faq_atelier',
  })

  const whatsappSequence2 = `*Hervé Nanfang | Note d'atelier n°2 & Retour sur vos questions*

Suite à la publication de mon dossier :
« *${article.title}* »
plusieurs d'entre vous m'ont écrit pour me demander :

_« Comment appliquer ces principes quand on dispose d'un matériel limité ou que l'on travaille seul en autoproduction ? »_

Voici ma réponse de terrain en 3 points :

1️⃣ *La clarté acoustique ne s'achète pas, elle s'éduque :* Travailler la justesse du toucher et le placement rythmique avant de chercher des plugins coûteux.
2️⃣ *La simplicité des voicings :* Dans un arrangement, enlever une note inutile apporte souvent plus de lumière qu'un nouvel instrument.
3️⃣ *Le respect de votre histoire :* Votre voix et votre terroir musical ont une valeur patrimoniale que personne d'autre ne peut produire à votre place.

Pour relire le dossier détaillé avec tous les schémas :
👉 ${utmQa}

Belle semaine musicale à chacun d'entre vous !
— Hervé Nanfang`

  assets.push({
    type: 'whatsapp_status',
    title: `[WhatsApp Séquence 2 FAQ · J10] ${article.title}`,
    platform: 'whatsapp',
    dayOffset: 10,
    dayLabel: 'J10',
    targetDate: dateJ10,
    targetTime: '11:00',
    pillar: 'communaute',
    content: whatsappSequence2,
    characterCount: whatsappSequence2.length,
    hashtags: [],
    canonicalUrl,
    utmUrl: utmQa,
    notes: 'Relance conversationnelle à J+10 basée sur les questions fréquentes des lecteurs.',
    requiresProof: true,
  })

  // --------------------------------------------------------------------------
  // ASSET 9 (J14) : PROPOSITION DE REPUBLICATION MEDIUM (Syndication & Canonique)
  // --------------------------------------------------------------------------
  const dateJ14 = addDaysToDateStr(baseDate, 14)
  const utmMedium = buildUtmUrl(canonicalUrl, {
    source: 'medium',
    medium: 'syndication',
    campaign: 'distribution_article',
    content: 'j14_syndication',
  })

  const mediumSyndicationText = `---
title: "${article.title}"
author: "Hervé Nanfang"
canonical_url: "${canonicalUrl}"
description: "${article.seoDescription}"
tags: [${article.keywords.map((k) => `"${k}"`).join(', ')}]
---

> **Avertissement déontologique & syndication canonique :**
> Cet article a été initialement publié en exclusivité sur le site officiel de l'auteur :
> **[${canonicalUrl}](${canonicalUrl})**
> La balise canonique ci-dessous indique aux moteurs de recherche que la source originale et prioritaire demeure le site officiel. Cette configuration relève d'une syndication maîtrisée et sélective.
> \`<link rel="canonical" href="${canonicalUrl}" />\`

---

# ${article.title}

*Par Hervé Nanfang — Pianobariste, musicologue et spécialiste des industries culturelles.*

${article.excerpt}

## 1. ${firstSectionHeading}

${firstSectionExcerpt}

${firstSection?.paragraphs?.slice(1).join('\n\n') || ''}

## 2. ${secondSectionHeading}

${secondSectionExcerpt}

${secondSection?.paragraphs?.slice(1).join('\n\n') || ''}

## 3. ${thirdSectionHeading}

${thirdSectionExcerpt}

${thirdSection?.paragraphs?.slice(1).join('\n\n') || ''}

---

### À propos de l'auteur
**Hervé Nanfang** est pianobariste professionnel, arrangeur et musicologue basé à Yaoundé (Cameroun). Fondateur d'**ALAIZ Creative Systems** et de la **Racines Musicales Academy®**, il explore les passerelles entre traditions orales polyrythmiques d'Afrique centrale, sonorisation acoustique haute fidélité et technologies d'intelligence artificielle éthique.

Pour découvrir son répertoire live, ses masterclasses et ses autres travaux de recherche :
👉 [Consulter le site officiel d’Hervé Nanfang](${utmMedium})`

  assets.push({
    type: 'medium_syndication',
    title: `[Medium Syndication · J14] ${article.title}`,
    platform: 'medium',
    dayOffset: 14,
    dayLabel: 'J14',
    targetDate: dateJ14,
    targetTime: '14:00',
    pillar: 'autorite',
    content: mediumSyndicationText,
    characterCount: mediumSyndicationText.length,
    hashtags: ['#MusicTech', '#Ethnomusicology', '#AfricanCulture', '#HerveNanfang'],
    canonicalUrl,
    utmUrl: utmMedium,
    notes: 'Syndication sélective sur Medium. Balise canonique impérative pour préserver l’antériorité et l’indexation du site officiel.',
    requiresProof: true,
  })

  // --------------------------------------------------------------------------
  // ASSET 10 (J14) : PROPOSITION DE TRIBUNE / PITCH MÉDIA CULTUREL
  // --------------------------------------------------------------------------
  const utmPress = buildUtmUrl(canonicalUrl, {
    source: 'presse',
    medium: 'pitch',
    campaign: 'distribution_article',
    content: 'j14_pitch_tribune',
  })

  const pressPitchText = `================================================================================
OBJET : Proposition de tribune / Idées : « ${article.title.slice(0, 50)} » — Hervé Nanfang
DESTINATAIRE SUGGÉRÉ : Rédacteurs en chef Culture / Musiques du Monde / Innovation créative
CONTACT OFFICIEL : hervenanfang@gmail.com | https://hervenanfang.vercel.app
================================================================================

Madame, Monsieur,

Je me permets de vous contacter car je suis avec grand intérêt vos dossiers consacrés aux mutations du spectacle vivant et des créations musicales africaines.

À l'heure où les discussions sur les industries culturelles opposent souvent modernisme technologique et défense frileuse du patrimoine, je vous propose une tribune libre intitulée :

« ${article.title} »

### L'angle de cette réflexion :
${article.excerpt}

### Pourquoi ce sujet éclairera particulièrement vos lecteurs :
1. **Un éclairage ancré dans la pratique réelle :** Loin des théories abstraites, ce texte s'appuie sur plus de vingt années de piano-bar, d'enregistrements acoustiques et de direction de masterclasses à Yaoundé et Douala.
2. **Une thèse constructive :** ${outlinePoints[0] || 'Démontrer que la souveraineté culturelle et l’innovation technique ne s’excluent pas, mais se renforcent.'}
3. **Un texte prêt à la publication :** Format de 1 200 à 1 500 mots, rigoureux, documenté et libre de droits pour votre média (avec simple mention de l'antériorité).

Le texte complet et les références méthodologiques sont consultables à cette adresse :
${utmPress}

### Bio concise de l'auteur :
Hervé Nanfang est pianobariste, musicologue et formateur. Fondateur d'ALAIZ Creative Systems et de la Racines Musicales Academy® (RMA), il intervient régulièrement sur les questions de préservation du patrimoine immatériel et d'intégration éthique des technologies de production.

Je reste à votre entière disposition pour échanger et adapter ce texte aux exigences de votre ligne éditoriale.

Bien cordialement,

Hervé Nanfang
Tél. / WhatsApp : +237 699 00 00 00
Courriel : hervenanfang@gmail.com
Site officiel : https://hervenanfang.vercel.app`

  assets.push({
    type: 'press_pitch',
    title: `[Pitch Tribune Presse · J14] ${article.title}`,
    platform: 'press',
    dayOffset: 14,
    dayLabel: 'J14',
    targetDate: dateJ14,
    targetTime: '16:00',
    pillar: 'conversion',
    content: pressPitchText,
    characterCount: pressPitchText.length,
    hashtags: [],
    canonicalUrl,
    utmUrl: utmPress,
    subject: `Proposition de tribune : « ${article.title.slice(0, 50)} »`,
    notes: 'Message de proposition de tribune pour médias partenaires (Jeune Afrique, Music In Africa, Le Point Afrique, RFI Musique).',
    requiresProof: true,
  })

  // --------------------------------------------------------------------------
  // CONVERSION EN POSTS DU CALENDRIER (SocialPost[])
  // --------------------------------------------------------------------------
  const posts: SocialPost[] = assets
    // Le résumé éditorial reste un document de référence interne et n'est pas programmé comme un post social
    .filter((a) => a.type !== 'editorial_summary')
    .map((asset, index) => {
      const postId = `repurpose-${article.slug}-${asset.type}-${Date.now() + index}`

      const contentByPlatform: Partial<Record<SocialPlatform, PlatformContent>> = {
        [asset.platform]: {
          text: asset.content,
          hashtags: asset.hashtags,
          charCount: asset.characterCount,
          subject: asset.subject,
          previewText: asset.previewText,
          canonicalUrl: asset.canonicalUrl,
        },
      }

      // Pour la vidéo, associer également Instagram et TikTok
      if (asset.type === 'video_script') {
        contentByPlatform.instagram = {
          text: asset.content,
          hashtags: asset.hashtags,
          charCount: asset.characterCount,
        }
        contentByPlatform.tiktok = {
          text: asset.content,
          hashtags: asset.hashtags,
          charCount: asset.characterCount,
        }
      }

      // Pour le carrousel, associer également LinkedIn
      if (asset.type === 'pedagogical_carousel') {
        contentByPlatform.linkedin = {
          text: asset.content,
          hashtags: asset.hashtags,
          charCount: asset.characterCount,
        }
      }

      const post: SocialPost = {
        id: postId,
        title: asset.title,
        pillar: asset.pillar,
        series: 'Le Journal du Musicien Augmenté™',
        campaign: `Distribution · ${article.title}`,
        campaignId,
        campaignDay: asset.dayLabel,
        utmParams: {
          utm_source: asset.platform,
          utm_medium: asset.type,
          utm_campaign: 'distribution_article',
        },
        sourceType: 'article',
        sourceSlug: article.slug,
        sourceTitle: article.title,
        isOriginalCreation: true,
        rightsCleared: true,
        factChecked: true,
        scheduledDate: asset.targetDate,
        scheduledTime: asset.targetTime,
        status: 'a_valider', // Statut obligatoire : sas de révision humaine
        platforms: Object.keys(contentByPlatform) as SocialPlatform[],
        contentByPlatform,
        hookVariants: [
          asset.title,
          `« ${article.title} » — Ce que la réalité du terrain impose de clarifier`,
          `Nouvelle ressource sur le Journal du Musicien Augmenté™`,
        ],
        mediaUrl: article.coverImage || '/images/shooting-pro-officiel.webp',
        linkUrl: asset.utmUrl,
        ctaLabel: 'Consulter l’article original',
        targetAudience: article.audience || 'Professionnels, musiciens, enseignants et passionnés',
        decisionHistory: [
          {
            id: `log-dist-${Date.now()}-${index}`,
            action: 'creation',
            timestamp: new Date().toISOString(),
            author: 'Assistant Distribution Multicanal',
            reason: `Génération automatique du format ${asset.type} (${asset.dayLabel}) pour « ${article.title} »`,
          },
        ],
        notes: asset.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      post.validationSignature = {
        approvedBy: '',
        approvedAt: '',
        contentHash: computeSocialPostHash(post),
      }

      return post
    })

  return {
    article,
    baseDate,
    canonicalUrl,
    campaignId,
    assets,
    posts,
  }
}
