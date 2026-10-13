# Identité visuelle et identité numérique — Hervé Nanfang

Ce document couvre deux choses indissociables :

1. **l'identité visuelle** du site (photos, traitement, cohérence graphique) ;
2. **l'identité numérique** (ce que Google, LinkedIn, YouTube, Facebook et les IA
   doivent trouver, comprendre et citer lorsqu'on cherche « Hervé Nanfang »).

Le principe directeur : **une seule photo de référence, un seul texte de référence,
partout.** La reconnaissance d'une marque personnelle se construit par répétition, pas
par variété.

---

## 1. Photos : liste de production

Déposez les fichiers dans le dossier `photos/` puis lancez `npm run photos`
(détail complet dans `photos/README.md`).

| Emplacement | Nom du fichier | Format | Utilisation |
|---|---|---|---|
| Portrait principal | `portrait-principal.jpg` | vertical ≥ 2000 px | Accueil, À propos, Open Graph, **référence d'identité** |
| Scène live | `scene-live.jpg` | 16:9 ≥ 2400 px | Accueil, page Musique |
| Piano | `piano.jpg` | 3:2 | Page Musique — Piano-Bar Live |
| Studio | `studio.jpg` | 3:2 | Page Musique — production & son |
| Enseignement | `enseignement.jpg` | 3:2 | Page Pédagogie |
| Conférence | `conference.jpg` | 16:9 | Page Conférences |
| Atelier IA | `atelier-ia.jpg` | 3:2 | Page IA & Technologie |
| Recherche | `recherche.jpg` | 3:2 | Page Culture & Recherche |
| Projet RMA® | `projet-rma.jpg` | 3:2 | Page Projets |
| Projet Permis de Jouer™ | `projet-permis-de-jouer.jpg` | 3:2 | Page Projets |
| Projet A LAIZ PROD | `projet-laiz.jpg` | 3:2 | Page Projets |
| Terrain Batoufam | `batoufam.jpg` | 3:2 | Page Culture & Recherche |

**Priorité si tout n'est pas disponible tout de suite :**

1. `portrait-principal` — c'est la photo d'identité numérique, elle sert partout ;
2. `scene-live` — elle prouve le métier de scène ;
3. `enseignement` — elle prouve la dimension pédagogique ;
4. `conference` ou `atelier-ia` — elles soutiennent l'offre commerciale ;
5. le reste, par ordre d'arrivée.

---

## 2. Traitement graphique

| Règle | Valeur |
|---|---|
| Format de diffusion | **WebP** (qualité 87), conversion automatique |
| Largeurs cibles | portrait 760 px · paysage de section 1200 px · bandeau 1400 px |
| Accentuation | masque flou léger (netteté perçue, sans artefact) |
| Recadrage | centré, avec priorité au tiers supérieur (visages) en mode `--crop` |
| Texte alternatif | **obligatoire** pour chaque image publiée (description factuelle, pas de mots-clés empilés) |
| Nom de fichier | explicite et durable : `2026-03-15-conference-esas-01.webp` |
| Crédit photo | à renseigner dès qu'un photographe est identifié |

**À éviter** : filtres colorimétriques lourds, collages, images génériques de banque d'images
(un musicien qui n'est pas Hervé Nanfang sur le site d'Hervé Nanfang détruit la crédibilité).

---

## 3. Charte visuelle du site (rappel)

**Editorial Premium × African Contemporary × Digital**

| Rôle | Valeur |
|---|---|
| Noir profond (fond principal) | `#08080A` |
| Ivoire (fond éditorial, textes clairs) | `#F5F2EA` |
| Or chaud (accent, liens, filets) | `#C6A15B` |
| Gris minéral (textes secondaires) | `#9A9AA2` |
| Carmin (alerte, emphase) | `#B4122B` |
| Titres | Cormorant Garamond — éditoriale, élégante |
| Interface | Manrope — sans-serif contemporaine |

Signatures graphiques : filets dorés dégradés, motif clavier vertical, grain photographique
discret, numérotation des chapitres (01, 02, 03…).

---

## 4. Identité numérique : le protocole de cohérence

### 4.1 Une seule description de référence

Définie dans `src/data/identity.ts` → champ `referenceDescription`. À recopier
**mot pour mot** (ou en version abrégée parmi les bios fournies) sur :

- le site (`/a-propos`, `/contact`, pied de page) ;
- **YouTube** → « À propos de la chaîne » ;
- **LinkedIn** → titre du profil + section « Infos » + « À propos » ;
- **Facebook** → biographie de la page ;
- **Instagram** → bio (utiliser `bios.mini`) ;
- tout dossier de presse, annuaire professionnel, fiche d'intervenant, podcast.

Trois longueurs sont disponibles : `mini` (~20 mots), `court` (~60 mots), `long` (~150 mots).

### 4.2 Un seul portrait

Le même `portrait-principal` doit servir :

- de photo de profil LinkedIn, YouTube, Facebook, Instagram ;
- de photo d'auteur sur les articles et les fiches d'intervenant ;
- d'image Open Graph du site (générée automatiquement par `npm run photos`).

### 4.3 Un seul jeu de liens

Toutes les plateformes doivent renvoyer vers `hervenanfang.vercel.app`, et le site renvoyer
vers elles (`SITE.socials`, qui alimente aussi le `sameAs` du Schema.org — c'est le
mécanisme qui permet aux moteurs de comprendre qu'il s'agit d'une seule et même entité).

### 4.4 Ce qui construit la reconnaissance

| Signal | Effet |
|---|---|
| Nom identique partout (« Hervé Nanfang », jamais de variante) | entité unique pour Google |
| `sameAs` complet et valide | consolidation de l'entité, prérequis d'un Knowledge Panel |
| Portrait identique | reconnaissance visuelle immédiate |
| Description identique | compréhension thématique (« musicien + IA + pédagogie ») |
| Marques dérivées toujours rattachées (« un projet de Hervé Nanfang ») | l'autorité remonte au nom, pas aux sous-marques |
| Publications régulières signées | autorité thématique sur « IA et musique » |

---

## 5. Images et moteurs de recherche

- **Google Images** : nom de fichier explicite + texte alternatif descriptif + image
  déclarée dans les données structurées (`Person.image`, `Article.image`).
- **Open Graph** : `public/og-image.jpg` en 1200×630, régénérée depuis le portrait
  principal à chaque import — c'est l'aperçu affiché lors des partages.
- **Texte alternatif** : décrire ce que l'on voit et le contexte
  (« Hervé Nanfang au piano lors d'une conférence à l'ESAS »), sans empiler des mots-clés.
- **Cohérence** : une même photo avec des légendes différentes sur plusieurs plateformes
  renforce l'association image ↔ nom.

---

## 6. Reste à fournir

- [ ] Les 12 photos de la liste (priorité : portrait, scène, enseignement, conférence).
- [ ] Les crédits photo (nom du photographe, autorisation de diffusion).
- [ ] Le logo éventuel (le site utilise aujourd'hui un monogramme « touches de piano » dessiné en SVG).
- [ ] Les extraits audio (3 titres suffisent pour lancer le portfolio sonore).
- [ ] Les liens vidéo (YouTube ou Vimeo) — un par ligne dans `photos/VIDEOS.txt`.
