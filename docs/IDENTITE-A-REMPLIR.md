# Dossier à compléter — identité et données vérifiables

**Destinataire : Hervé Nanfang.**
Ce document est le seul élément qui bloque le passage du site en version définitive.
Chaque ligne correspond à une information **vérifiable** que le site ne peut pas inventer.

**Méthode :** remplissez directement dans les champs `→`, puis renvoyez-moi le fichier.
Je reporte les valeurs dans `src/data/identity.ts` (Master Identity) et dans
`src/data/site.ts` : **tout le site se met à jour automatiquement** — pages, titres SEO,
données structurées, sitemap, kit presse — sans qu'aucun autre fichier soit touché.

> Règle appliquée depuis le début : aucune information n'est devinée. Laisser vide est
> préférable à remplir approximativement. Une information fausse sur un site
> professionnel coûte plus cher que son absence.

---

## P0 — Bloquant pour la mise en ligne

### 1. Domaine

| Champ | Valeur |
|---|---|
| Nom de domaine définitif | → |
| Variante avec `www` (oui / non) | → |
| Domaine actuel s'il diffère | → |

*Utilisé dans :* `index.html`, `sitemap.xml`, `robots.txt`, balises `canonical`, Open Graph,
`@id` de toutes les données Schema.org.

---

### 2. Coordonnées professionnelles

| Champ | Valeur |
|---|---|
| Email professionnel général / booking | racinesmusicalesacademy@gmail.com |
| Email RMA | racinesmusicalesacademy@gmail.com |
| Téléphone / WhatsApp | +237 694 72 34 92 · +237 682 18 02 66 |
| Adresse postale (si à afficher) | → |

---

### 3. Réseaux sociaux — URL exactes

Ces URL alimentent le champ `sameAs` de Schema.org, **mécanisme qui permet à Google de
comprendre qu'il s'agit d'une seule et même entité**. C'est un prérequis du Knowledge Panel.

| Plateforme | URL complète du profil | Le nom affiché est-il « Hervé Nanfang » ? |
|---|---|---|
| YouTube (chaîne A LAIZ / RMA) | https://youtube.com/alaizprod | A LAIZ / RMA |
| LinkedIn | https://linkedin.com/in/hervenanfang | Hervé Nanfang |
| Facebook (A LAIZ Music / A LAIZ PROD) | https://facebook.com/alaizprod | A LAIZ Music / A LAIZ PROD |
| Instagram (@alaiz_music) | https://instagram.com/alaizprod | @alaiz_music |
| TikTok (si pertinent) | → | → |
| Autre (SoundCloud, Spotify, X…) | → | → |

**Question de contrôle :** le **portrait** et la **description de référence** sont-ils
identiques sur ces profils ? (voir `docs/IDENTITE-VISUELLE.md`)

---

## P1 — Crédibilité et référencement

### 4. Parcours d'enseignement

| Établissement | Ville / pays | Période (de → à) | Cours / disciplines | Statut (permanent, vacataire, invité) |
|---|---|---|---|---|
| ESAS | → | → | → | → |
| ISMA | → | → | → | → |
| Autre | → | → | → | → |

*Utilisé dans :* page À propos (chronologie), page Pédagogie, données `alumniOf` /
`affiliation` de Schema.org.

---

### 5. Publications et méthodes

| Titre | Type (manuel, méthode, article, chapitre) | Éditeur / support | Année | ISBN ou lien |
|---|---|---|---|---|
| → | → | → | → | → |

*Utilisé dans :* page Pédagogie, JSON-LD `Book` / `Article`, kit presse.

---

### 6. Œuvres enregistrées et réalisations

| Titre | Type (album, single, collaboration, musique de film, publicité) | Année | Rôle (auteur, interprète, producteur) | Lien d'écoute |
|---|---|---|---|---|
| → | → | → | → | → |

*Utilisé dans :* page Musique, JSON-LD `MusicGroup` / `CreativeWork`, portfolio.

---

### 7. État réel des projets

| Projet | Date de création | État réel | Chiffres ou faits vérifiables |
|---|---|---|---|
| Racines Musicales Academy® | → | → | → |
| Permis de Jouer™ | → | → | → |
| Tswefap | → | → | → |
| A LAIZ PROD | → | → | → |
| Musicien Augmenté™ | → | → | → |

*Utilisé dans :* page Projets (statuts affichés), argumentaire commercial.

---

### 8. Références de prestation (preuve commerciale)

| Lieu / événement | Type (hôtel, lounge, institution, festival, cérémonie) | Ville | Période | Nom citable publiquement ? |
|---|---|---|---|---|
| → | → | → | → | oui / non |

*Utilisé dans :* page Musique (section Piano-Bar), dossier de booking, section Preuves.
Une simple liste de lieux change radicalement la crédibilité d'une offre de prestation.

---

## P2 — Juridique et finition

### 9. Informations légales

| Champ | Valeur |
|---|---|
| Statut juridique (personne physique, entreprise individuelle, SARL…) | → |
| Raison sociale exacte | → |
| Numéro de contribuable / RCCM | → |
| Adresse du siège | → |
| Hébergeur du site (nom, adresse, téléphone) | → |
| Responsable de la publication | → |

---

### 10. Crédits photographiques

| Visuel | Photographe | Autorisation de diffusion |
|---|---|---|
| Portrait principal | → | → |
| Scène live | → | → |
| Autres | → | → |

---

## Ce qui se produira automatiquement une fois ces données transmises

1. **Domaine** → remplacement dans les 4 fichiers techniques, `canonical` et `@id` corrigés.
2. **Coordonnées** → page Contact, pied de page, formulaires, robots d'indexation.
3. **Réseaux** → `sameAs` complet → consolidation de l'entité pour Google.
4. **Parcours et publications** → chronologie réelle, JSON-LD `alumniOf`, `Book`, `Article`.
5. **Œuvres** → portfolio musical et données `MusicGroup` / `CreativeWork`.
6. **Références de prestation** → section « Preuves & références » activée
   (`preuves.mode = 'affiche'` dans la Master Identity), actuellement masquée.
7. **Juridique** → mentions légales et politique de confidentialité validées.
8. **`npm run audit`** → la liste des éléments à confirmer se réduit à zéro.

---

## Ce qui n'est PAS demandé ici

- Les **photos** : elles passent par le dossier `photos/` (`npm run photos`), voir `photos/README.md`.
- Les **textes de fond** : les pages sont déjà rédigées ; ces données ne font que les
  compléter et les vérifier.
- Les **articles du Journal** : les sept piliers disposent déjà de leur plan,
  de leur public, de leurs métadonnées SEO et de leurs mots-clés.
