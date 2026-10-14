# Audit éditorial et technique — hervenanfang.vercel.app

*Généré le 14/10/2026 par `npm run audit`.*

Cet audit analyse la **source** du site : il est reproductible après chaque modification.

## 1. Synthèse

| Contrôle | Résultat |
|---|---|
| Pages analysées | 16 |
| Titres SEO hors cible | 0 |
| Titres tronqués dans Google (> 60 car.) | 1 |
| Descriptions hors cible | 0 |
| Pages sans H1 unique | 0 |
| Liens internes cassés | 0 |
| Images sans `alt` | 0 sur 10 |
| Routes absentes du sitemap | 0 |
| URL du sitemap sans route | 0 |
| Éléments factuels à confirmer | 1 |

## 2. Métadonnées par page

| Page | Titre SEO | Long. | Description | Long. | H1 | Données structurées |
|---|---|---|---|---|---|---|
| `About` | Hervé Nanfang | Parcours, Musique, MAO, Pédagogie & IA | 54 | Hervé Nanfang, musicien, musicologue, pédagogue et ingénieur du son ca… | 148 | 1 (PageHero (h1 interne)) | Person, BreadcrumbList |
| `Admin` | Administration | Hervé Nanfang | 30 | Espace privé du2019administration du site du2019Hervé Nanfang : conten… | 120 | 1 (balise <h1>) | — |
| `AI` | IA & Technologie | Hervé Nanfang — Musicien Augmenté | 52 | Musique, MAO, pédagogie et communication digitale : la position d’Herv… | 152 | 1 (PageHero (h1 interne)) | Person, Organization, BreadcrumbList, Course, FAQPage, CreativeWork / Book |
| `ArticleDetail` | Article introuvable | Hervé Nanfang (valeur dynamique) | 35 | Article introuvable — retour au Journal du Musicien Augmenté d'Hervé N… | 77 | 1 (PageHero (h1 interne)) | Person, BreadcrumbList, Article |
| `Conferences` | Conférences | Hervé Nanfang — IA, musique, cinéma & pédagogie ✂️ tronqué dans Google | 61 | Six conférences de référence pour écoles, universités et institutions … | 147 | 1 (PageHero (h1 interne)) | Person, BreadcrumbList, Service |
| `Contact` | Contact | Hervé Nanfang — Booking, Formation & Conseil | 54 | Booking piano-bar, formation, conférence, collaboration, presse ou con… | 151 | 1 (PageHero (h1 interne)) | Person, BreadcrumbList, Service |
| `Culture` | Culture & Recherche | Hervé Nanfang — musicologie | 49 | Musicologie, cultures africaines, patrimoine et transmission orale : c… | 148 | 1 (PageHero (h1 interne)) | Person, BreadcrumbList, CreativeWork / Book |
| `Home` | Hervé Nanfang | Musicien, Musicologue & Musicien Augmenté | 57 | Hervé Nanfang, artiste-musicien camerounais : Piano-Bar, composition, … | 153 | 1 (balise <h1>) | Person, WebSite, Organization, MusicGroup |
| `Journal` | Journal | Hervé Nanfang — IA, musique & pédagogie | 49 | Le Journal du Musicien Augmenté : dix piliers sur l'IA, la musique, la… | 131 | 1 (PageHero (h1 interne)) | Person, BreadcrumbList, Article |
| `Legal` | Mentions légales | Hervé Nanfang (valeur dynamique) | 32 | Informations légales du site d'Hervé Nanfang : éditeur, hébergeur, pro… | 128 | 1 (PageHero (h1 interne)) | BreadcrumbList |
| `Music` | Musique | Hervé Nanfang — Piano, Composition & Production | 57 | Piano-bar live depuis 2007, formats solo, duo et live band, compositio… | 139 | 1 (PageHero (h1 interne)) | MusicGroup, BreadcrumbList, Service, CreativeWork / Book |
| `NotFound` | Page introuvable | Hervé Nanfang | 32 | La page demandée n’existe pas ou a été déplacée. Accédez aux rubriques… | 156 | 1 (Display as="h1") | — |
| `Pedagogy` | Pédagogie & Recherche | Hervé Nanfang | 37 | Enseignement supérieur, conception de curricula, musicologie africaine… | 159 | 1 (PageHero (h1 interne)) | Person, BreadcrumbList, Course, CreativeWork / Book |
| `Projects` | Projets & Marques | Hervé Nanfang — A LAIZ PROD | 47 | Projets musicaux, pédagogiques, numériques et culturels d’Hervé Nanfan… | 158 | 1 (PageHero (h1 interne)) | Person, Organization, BreadcrumbList, CreativeWork / Book |
| `RMA` | RMA — Racines Musicales Academy® | Hervé Nanfang | 48 | Racines Musicales Academy® : formation musicale, pédagogie, Permis de … | 161 | 1 (PageHero (h1 interne)) | Person, BreadcrumbList, Service, Course |
| `Services` | Services | Hervé Nanfang — live, formation & conseil | 52 | Prestations live, conférences, formation musicale, pédagogie, conseil … | 141 | 1 (PageHero (h1 interne)) | Person, BreadcrumbList, Service |

## 3. Corrections à apporter

- ✅ Aucune anomalie détectée sur les métadonnées et la structure des titres.

## 4. Liens internes

- ✅ Tous les liens internes pointent vers une route existante.

## 5. Sitemap

- Routes du routeur absentes du sitemap : aucune ✅
- URL du sitemap sans route correspondante : aucune ✅

## 6. Contenus génériques résiduels

- ✅ Aucun résidu détecté.

## 7. Éléments factuels à confirmer par Hervé Nanfang

> Rien n'est inventé : toute information vérifiable manquante est listée ici plutôt que devinée.

| # | À fournir | Utilisé dans |
|---|---|---|
| 1 | Numéro de contribuable / RCCM officiel d’ALAIZ Creative Systems / A LAIZ PROD pour mentions légales. | Mentions légales · politique de confidentialité |

## 8. Identité numérique — rappel de cohérence

La description de référence et les biographies de trois longueurs sont définies dans
`src/data/identity.ts`. Elles doivent être reprises **à l'identique** sur :

- le site (accueil, à propos, contact, presse) ;
- YouTube (à propos de la chaîne) ;
- LinkedIn (titre + résumé) ;
- Facebook et Instagram (bio) ;
- tout dossier de presse, annuaire professionnel, présentation d'intervenant.

Le portrait principal doit également être identique sur tous ces supports :
c'est lui qui construit la reconnaissance visuelle de la marque.

