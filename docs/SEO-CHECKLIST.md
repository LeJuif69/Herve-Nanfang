# SEO — Identité et référencement personnel

Objectif stratégique : **Google doit d'abord connaître Hervé Nanfang, puis comprendre ses différents univers.**

Ce document recense ce qui est déjà implémenté dans le site et ce qui reste à faire.

---

## 1. Identité principale (section 15 du master)

| Élément | Valeur implémentée |
|---|---|
| **Title** | *Hervé Nanfang \| Musicien, Musicologue, Pédagogue & IA* |
| **Meta description** | *Hervé Nanfang est artiste-musicien, musicologue, pédagogue, ingénieur du son et spécialiste de l'IA appliquée à la musique, à la pédagogie et aux industries culturelles.* |
| **H1** | **Hervé Nanfang** |
| **Canonical** | `https://hervenanfang.vercel.app` + chemin de page |

Chaque page possède son title, sa description, sa canonical, son image OG et ses données structurées propres (voir `src/lib/seo.ts`).

---

## 2. Données structurées (section 16)

Implémentées dans `src/lib/schema.ts` et injectées page par page.

| Type | Où | Contenu |
|---|---|---|
| `Person` | toutes les pages | `name`, `alternateName` (Le Pianobariste), `jobTitle`, `description`, `image`, `url`, `sameAs`, `knowsAbout`, `knowsLanguage`, `worksFor`, `affiliation`, `address` |
| `WebSite` | accueil | éditeur et sujet = Person |
| `Brand` | accueil, projets, IA | A Laiz Ô Pays (concept fondateur de Hervé Nanfang) |
| `MusicGroup` | accueil, musique | Le Pianobariste, `member` → Person |
| `Service` | musique, conférences, contact | prestation piano-bar, production, conférences |
| `Course` | pédagogie | formation musicale & MAO, Permis de Jouer™ |
| `CreativeWork` / `Book` | projets, pédagogie, culture | RMA®, Permis de Jouer™, Musicien Augmenté™, manuels, recherche |
| `Article` | journal, page article | titre, description, section, auteur, statut |
| `Event` | conférences | 5 interventions |
| `FAQPage` | IA & Technologie | 4 questions/réponses |
| `BreadcrumbList` | toutes les pages internes | fil d'Ariane |

**Toujours à faire :**
1. Renseigner `SITE.socials` → alimente automatiquement `sameAs` (clé du Knowledge Panel).
2. Remplacer `og-image.jpg` par un visuel définitif (portrait + logo).
3. Générer `VideoObject` quand les vidéos seront publiées.
4. Générer `Event` datés dès que l'agenda de concerts/conférences existera (dates réelles + billetterie).
5. Créer un identifiant Wikidata / Wikipedia pour renforcer `sameAs` si éligible.

---

## 3. Technique

- [x] `robots.txt` avec `Sitemap` + autorisation explicite des robots IA (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended) — **stratégie : être citable par les moteurs génératifs**
- [x] Pré-rendu HTML des routes au build : titres, descriptions, canonicals, Open Graph, Twitter et Schema.org sont présents avant JavaScript.
- [x] Sitemap généré au build : 12 pages fixes et uniquement les articles au statut `Publié` (15 URL actuellement).
- [x] Vercel : `vercel.json` pointe sur `dist`, canonise sans slash final et n’ajoute pas de réécriture SPA.
- [x] Production Vercel (`hnnanfang.vercel.app`) : neuf routes directes vérifiées en HTTP 200 et `/une-url-inexistante` en HTTP 404.
- [x] Canonical sur chaque page
- [x] Open Graph complet (`og:type`, `og:locale`, `og:image` 1200×630, dimensions)
- [x] Twitter/X Cards `summary_large_image`
- [x] Langue `fr-FR` déclarée (`<html lang="fr">`, `og:locale`, `inLanguage` dans le JSON-LD)
- [x] URLs lisibles et stables (`/ia-technologie`, `/journal/apres-la-mao-lia`)
- [x] Contenu de repli `<noscript>`
- [x] Balisage sémantique : un seul `h1` par page, hiérarchie `h2/h3` respectée, `nav` avec `aria-label`, fil d'Ariane
- [x] Accessibilité : lien d'évitement, focus visible, `prefers-reduced-motion` respecté, contrastes élevés
- [ ] Vérification Search Console (`GOOGLE_SITE_VERIFICATION` dans `src/lib/seo.ts`)
- [ ] Bing Webmaster Tools + IndexNow
- [ ] `hreflang` si une version anglaise est produite

---

## 4. Performance

- [x] Images en **WebP** (affiche 113 Ko, portrait 79 Ko, bandeau 40 Ko) — cibles AVIF à l'étape suivante
- [x] `width`/`height` déclarés (évite le décalage de mise en page / CLS)
- [x] `loading="brief"` eager sur l'affiche du hero, `lazy` ailleurs
- [x] Polices **auto-hébergées** en WOFF2 avec `font-display: swap` géré par Fontsource
- [x] CSS compilé ~63 Ko (13 Ko gzip), JS ~302 Ko (89 Ko gzip) — sous les seuils d'alerte
- [x] Aucune requête à un domaine tiers à l'exécution
- [ ] Compression Brotli côté hébergeur
- [ ] Cache `immutable` sur les assets (à configurer chez l'hébergeur)

---

## 5. Contenu et autorité

**Série fondatrice « Après la MAO, l'IA » — 7 piliers** (section 12) : plans, extraits, mots-clés et métadonnées déjà en place dans `src/data/articles.ts`.

| # | Pilier | Catégorie | Statut |
|---|---|---|---|
| 01 | Après la MAO, l'IA : adopter l'IA sans perdre son identité | IA | Publié |
| 02 | L'IA va-t-elle remplacer les musiciens ? | IA | En cours |
| 03 | Musicien augmenté : définition, enjeux et perspectives | Réflexions | En cours |
| 04 | IA et musique live : ce que la technologie ne doit jamais remplacer | Musique | En cours |
| 05 | 5 façons dont un musicien peut utiliser l'IA dans sa carrière | Entrepreneuriat | En cours |
| 06 | IA, MAO et création musicale : vers une nouvelle génération de musiciens | MAO | Planifié |
| 07 | Pourquoi les musiciens africains doivent comprendre l'intelligence artificielle | Culture | Planifié |

**Rythme recommandé :** un pilier rédigé par mois, complété par une note courte (500–800 mots) toutes les deux semaines. Chaque article lie au moins trois pages du site (maillage interne) et une page commerciale (conférences, formations, contact).

**Autorité externe (à mener en parallèle) :**
- une biographie identique (nom, fonction, liens) sur toutes les plateformes, pointant vers `hervenanfang.vercel.app` ;
- réponses signées dans la presse spécialisée et les podcasts ;
- citations vérifiables (presse, institutions) pour alimenter la notoriété ;
- cohérence du nom : toujours « Hervé Nanfang », les marques dérivées restant secondaires.

---

## 6. Check-list par page

| Page | Title | Description | JSON-LD | H1 unique |
|---|---|---|---|---|
| Accueil | ✅ | ✅ | Person, WebSite, Organization, MusicGroup | ✅ |
| À propos | ✅ | ✅ | Person, Breadcrumb | ✅ |
| Musique | ✅ | ✅ | MusicGroup, CreativeWork, Service ×2 | ✅ |
| IA & Technologie | ✅ | ✅ | Person, CreativeWork, FAQ, Breadcrumb | ✅ |
| Pédagogie | ✅ | ✅ | Course ×2, Book, Breadcrumb | ✅ |
| Culture & Recherche | ✅ | ✅ | CreativeWork, Breadcrumb | ✅ |
| Projets | ✅ | ✅ | Organization, CreativeWork ×2 | ✅ |
| Journal | ✅ | ✅ | Article ×7, Breadcrumb | ✅ |
| Article | ✅ | ✅ | Article, Person, Breadcrumb | ✅ |
| Conférences | ✅ | ✅ | Service, Event ×5 | ✅ |
| Contact | ✅ | ✅ | Service, Breadcrumb | ✅ |
| Légales | ✅ | ✅ | Breadcrumb | ✅ |
