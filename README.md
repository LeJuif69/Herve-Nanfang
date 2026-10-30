# HERVÉ NANFANG — Plateforme canonique

> **Créer. Transmettre. Innover.**
> Artiste-musicien · Musicologue · Pédagogue · Ingénieur du son · Innovateur culturel

Ce dépôt contient la **plateforme personnelle, artistique, intellectuelle et numérique** d'Hervé Nanfang, construite à partir du document *MASTER — HERVÉ NANFANG*.

Le site est conçu comme la **source canonique** : le concept fondateur **A Laiz Ô Pays** et toutes les initiatives spécialisées (Le Pianobariste™, A Laiz Academy — anciennement Racines Musicales Academy®, Alaiz Music, Alaiz Patrimoine, Permis de Jouer™, Musicien Augmenté™) y sont rattachés à **Hervé Nanfang**.

---

## 1. Stack technique

| Domaine | Choix | Statut |
|---|---|---|
| Frontend | **React 18 + TypeScript + Vite 6** | ✅ en place |
| Styles | **Tailwind CSS v4** + système de composants maison | ✅ en place |
| Routage | `react-router-dom` (9 rubriques + pages secondaires) | ✅ en place |
| Typographies | **auto-hébergées** via Fontsource (aucun CDN externe) | ✅ en place |
| SEO | HTML pré-rendu par route, canonical, Open Graph, Twitter Cards, Schema.org, `robots.txt`, sitemap filtré par statut | ✅ au build |
| Médiathèque | Supabase Storage (prévu) | ⏳ à connecter |
| CMS / données | Supabase (prévu) | ⏳ à connecter |
| Administration | Dashboard éditorial (spécifié, non branché) | ⏳ à connecter |

Aucune dépendance réseau externe à l'exécution : les polices, les styles et les scripts sont servis par le site lui-même.

---

## 2. Lancer le projet

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # types + build Vite + pré-rendu des routes et du sitemap (dist/)
npm run preview    # prévisualisation du build
npm run typecheck  # vérification des types uniquement
npm run audit      # audit éditorial et SEO → docs/AUDIT.md
npm run photos     # intégration des photos déposées dans photos/
```

---

## 3. Phase 2 — identité réelle et SEO (en cours)

Le site est passé du stade « structure » au stade « plateforme incarnée ». Ce qui a été ajouté :

| Élément | Fichier / commande |
|---|---|
| **Identité de référence** : description unique, 3 biographies, titres SEO, définition du concept | `src/data/identity.ts` |
| **Page manifeste** `/ia-technologie` : constat, 7 thèses, définition du concept, méthode, formats, FAQ | `src/pages/AI.tsx` |
| **Chaîne de conversion** sur chaque article : Hervé Nanfang → Musicien Augmenté™ → piliers → contact | `src/data/articles.ts` (`ARTICLE_CHAIN`) |
| **Kit presse** : bios copiables, description de référence, règles de cohérence | `src/components/PressKit.tsx` (page Contact) |
| **Audit éditorial et technique** : métadonnées, H1, Schema.org, liens, sitemap, éléments à confirmer | `npm run audit` → `docs/AUDIT.md` |
| **Import des photos professionnelles** : recadrage, WebP, Open Graph, rapport | `npm run photos` → `photos/README.md` |

Deux documents de référence encadrent la suite :

- `docs/POSITIONNEMENT.md` — architecture consolidée, doctrine éditoriale, offre commerciale ;
- `docs/IDENTITE-VISUELLE.md` — photos attendues, protocole de cohérence de l'identité numérique.

**Titre SEO en vigueur** (évolution progressive validée) :
*Hervé Nanfang | Musicien, Musicologue, Pédagogue, IA & Innovation culturelle*

---

### Aperçu sans serveur

Le fichier **`apercu-site.html`** est une version statique autonome de la page d'accueil :
polices, styles et images (WebP) sont incorporés en base64. Il s'ouvre dans n'importe quel
navigateur, **sans serveur ni connexion réseau** — utile si l'aperçu live est indisponible.

Régénération (Playwright requis) :

```bash
node scripts/snapshot-apercu.mjs        # serveur de dev sur :5173
```

> Limite connue : c'est une photographie à un instant donné. Les liens internes fonctionnent
> (ce sont de vraies URL), mais seule la page d'accueil est figée. Pour naviguer dans le site
> complet, utilisez le serveur de développement.

---

## 4. Arborescence

```text
herve-nanfang/
├── index.html                 # gabarit HTML, complété par route au build
├── vercel.json                # sortie dist/ et canonisation sans slash final
├── public/
│   ├── favicon.svg            # monogramme « touches de piano »
│   ├── og-image.jpg           # image Open Graph 1200×630
│   ├── robots.txt             # indexation + robots IA (GPTBot, ClaudeBot…)
│   └── sitemap.xml            # 15 URL : pages fixes + articles publiés
├── src/
│   ├── main.tsx               # point d'entrée + polices
│   ├── App.tsx                # table de routage
│   ├── styles/index.css       # charte visuelle (couleurs, typographies, composants CSS)
│   ├── assets/                # affiche, portrait, bannière live (WebP optimisés)
│   ├── data/                  # CONTENU ÉDITORIAL (site, musique, projets, conférences, articles)
│   ├── lib/                   # seo.ts (meta dynamiques) · schema.ts (Schema.org)
│   ├── components/            # Header, Footer, Layout, PageHero, ui.tsx (primitives)
│   └── pages/                 # 14 pages
└── docs/                      # SEO, administration, schéma Supabase
```

**Tout le contenu textuel vit dans `src/data/`.** Modifier un titre de projet, un pilier du Journal ou un axe pédagogique ne demande aucune connaissance technique : on édite un fichier de données.

---

## 5. Pages livrées

| Route | Rôle |
|---|---|
| `/` | Accueil : hero, trois dimensions, qui est Hervé Nanfang, musique, IA, pédagogie, culture, projets, journal, conférences |
| `/a-propos` | Parcours, trajectoire, compétences, identité artistique |
| `/musique` | Le Pianobariste™, six pratiques, répertoire, méthode de production |
| `/ia-technologie` | Section stratégique : 4 domaines, **Musicien Augmenté™**, 5 principes, FAQ |
| `/pedagogie` | Axes d'enseignement, **RMA®**, **Permis de Jouer™**, publications |
| `/culture-recherche` | Musicologie, patrimoine, terrains (Batoufam, Tswefap), questions de travail, écriture |
| `/projets` | 5 familles filtrables, 15 projets, univers créatif A Laiz Ô Pays |
| `/journal` | Le Journal du Musicien Augmenté : 9 catégories, 7 piliers SEO, agenda éditorial, 4 séries |
| `/journal/:slug` | Page article (plan, mots-clés, série, conférence associée, lecture suivante) |
| `/conferences` | 5 thèmes commerciaux, déroulé, publics, emplacement témoignages |
| `/contact` | 6 parcours (booking, formation, conférence, collaboration, presse, conseil) + formulaire validé |
| `/mentions-legales`, `/confidentialite` | Pages légales (à valider juridiquement) |
| `*` | Page 404 éditoriale |

---

## 6. Charte visuelle appliquée

- **Noir profond** `#08080A` · **Ivoire** `#F5F2EA` · **Or chaud** `#C6A15B` · **Gris minéral** `#9A9AA2`
- **Carmin** `#B4122B` repris de l'affiche *Le Pianobariste* pour les accents d'alerte
- Titres : **Cormorant Garamond** (éditorial) — Interface : **Manrope** (sans-serif moderne)
- Signatures graphiques : filets dorés dégradés, motif clavier vertical, grain discret, numérotation des chapitres (01, 02, 03…)
- Esthétique **Editorial Premium × African Contemporary × Digital** — ni « site de musicien africain », ni froideur startup.

---

## 7. À compléter avant mise en ligne publique

> Les valeurs de démonstration sont marquées « placeholder » dans `src/data/site.ts`.

- [x] **Domaine Vercel** : `https://hervenanfang.vercel.app` alimente les URL canoniques, le sitemap et `robots.txt`.
- [x] **Vercel** : neuf routes directes vérifiées en HTTP 200 et `/une-url-inexistante` en HTTP 404 sur `hnnanfang.vercel.app`.
- [x] **Email professionnel général / booking** : l’adresse `racinesmusicalesacademy@gmail.com` est utilisée comme point de contact officiel pour les demandes de booking, formation, presse et conseil, avec les deux téléphones et les profils sociaux confirmés intégrés.
- [x] **Téléphones & réseaux sociaux** : les numéros et profils officiels confirmés sont intégrés à la configuration centrale et à Schema.org.
- [ ] **Photographies authentiques** : portrait, piano, scène, studio, enseignement, conférences, travail sur ordinateur, interaction avec les étudiants, événements → à déposer dans `src/assets/` puis substituer les trois visuels de démonstration (affiche, portrait, bandeau)
- [ ] **Dates précises du parcours** dans `src/pages/About.tsx` (tableau `TIMELINE`)
- [ ] **Retours institutionnels** sur la page Conférences (autorisations écrites)
- [ ] **Vérification Google Search Console** : renseigner `GOOGLE_SITE_VERIFICATION` dans `src/lib/seo.ts`
- [ ] **Rédaction complète** des piliers 04 → 07 du Journal (plans déjà en place)
- [ ] **Validation juridique** des pages Mentions légales et Confidentialité (numéro de contribuable, hébergeur)

---

## 8. Feuille de route

| Étape | Contenu | État |
|---|---|---|
| **1. Socle éditorial** | Charte, architecture des 9 rubriques, pages secondaires, contenus fondateurs, SEO technique | ✅ livré |
| **2. Identité réelle & SEO** | Identité de référence, page manifeste, kit presse, audit automatisé, SEO calibré | ✅ livré |
| **2b. Photos & contenus réels** | Photos professionnelles, dates du parcours, publications, discographie | ⏳ en attente des éléments d'Hervé Nanfang |
| **3. Backend Supabase** | Tables, RLS, Storage, branchement du formulaire, lettre d'information | 📄 schéma fourni (`docs/supabase-schema.sql`) |
| **4. Administration** | Dashboard éditorial : Articles, Projets, Musiques, Vidéos, Formations, Conférences, Événements, Photos, Documents, Messages, SEO, Paramètres | 📄 spécifié (`docs/ADMINISTRATION.md`) |
| **5. Données structurées avancées** | `Article`, `VideoObject`, `Course`, `Event`, `MusicGroup`, `CreativeWork`, `Organization` générés depuis la base | 🟡 partiel (statique) |
| **6. Performance & conformité** | WebP/AVIF déjà en place, lazy loading, Core Web Vitals, Search Console, mentions légales validées | 🟡 entamé |
| **7. Autorité** | Rédaction mensuelle, citations presse, Knowledge Panel, cohérence `sameAs` sur toutes les plateformes | ⏳ à venir |

---

## 9. Documentation

- `docs/SEO-CHECKLIST.md` — titres, descriptions, Schema.org, robots IA, check-list par page
- `docs/ADMINISTRATION.md` — spécification du dashboard et gestion des médias
- `docs/supabase-schema.sql` — schéma de base de données prêt à exécuter (tables + RLS + Storage)
- `docs/POSITIONNEMENT.md` — architecture consolidée, doctrine éditoriale, offre commerciale
- `docs/IDENTITE-VISUELLE.md` — photos attendues et protocole de cohérence de l'identité numérique
- `docs/AUDIT.md` — rapport d'audit régénéré par `npm run audit`

---

© Hervé Nanfang. Tous droits réservés. Le Pianobariste™ · Racines Musicales Academy® · Permis de Jouer™ · Musicien Augmenté™.
