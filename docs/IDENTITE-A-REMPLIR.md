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

### 4. Parcours d'enseignement (Consolidé ✅)

| Établissement | Ville / pays | Période | Cours / disciplines | Statut |
|---|---|---|---|---|
| ESAS | Lomé, Togo | Depuis 2022 | MAO, Musicologie appliquée aux médias visuels, Technique de composition | Titulaire |
| ISMA | Bénin | 2022–2026 | Métiers des arts, audiofréquence et technologies sonores | Enseignant |
| Institut des Beaux-Arts | Nkongsamba, Cameroun | 2021–2022 | Histoire de la musique, analyse, musiques de films, intermédiarité | Remplaçant |
| IFCPA / CRTV | Yaoundé, Cameroun | 2020–2021 | Audiofréquence, MAO, prise et traitement du son, genres musicaux | Vacataire |
| ATMC (CFMIA) | Cameroun | 2021 | Culture musicale, histoire et analyse musicale | Remplaçant |
| Scolaire & Instituts | Yaoundé & Cotonou | 2015–2023 | Éducation musicale, notation MAO (Jean-Tabi, EFB Saint-Hubert, L'Excellence, Arbre à Musique) | Enseignant |

---

### 5. Publications et méthodes (Consolidé ✅)

| Titre | Type | Éditeur / support | Année | Statut |
|---|---|---|---|---|
| LES ZIKOS® | Manuel pédagogique (68 p.) | ALAIZ Creative Systems | 2026 | En cours de restructuration éditoriale |
| Permis de Jouer™ | Dispositif de progression N1 à N4 | RMA | Méthode continue | Actif |
| RMA-01 | Socle d'apprentissage (Pulsation & Body) | RMA | 2026 | Actif |
| Tswefap | Système d'écriture & manuel de référence | Projet Batoufam | Recherche | En cours |
| Musiques de film & médias | Communications scientifiques | Université / Colloques | Recherche | Actif (Harry Potter, cinéma d'horreur) |
| Music’Arts Thérapie | Ouvrage scientifique | Recherche | À paraître | En préparation |

---

### 6. Œuvres et répertoire (Consolidé ✅)

| Titre / Projet | Type | Période | Rôle | Détail |
|---|---|---|---|---|
| Le Pianobariste™ | Prestations live continues | Depuis 2007 | Chant & Clavier | Standards jazz, blues, variété, musiques africaines |
| Le Concert des Guérisseurs | Création & musicologie | 2020–2022 | Compositeur, arrangeur, piano | Percussions et piano (thérapies pygmées / African Wizarding Music) |
| Programme RMA « Vacances Utiles » | Restitution artistique | 2026 | Directeur pédagogique | 5 disciplines (restitution Damas–Petits Génies, Yaoundé) |

---

### 7. État réel des projets et écosystème de marques (Consolidé ✅)

| Projet | Structure parente | Statut réel | Rôle au sein de l'écosystème |
|---|---|---|---|
| ALAIZ Creative Systems | Holding / Structure mère | Actif (Signature) | Écosystème global de gouvernance |
| A LAIZ PROD | ALAIZ Creative Systems | Actif | Production musicale, sonore et audiovisuelle |
| A LAIZ Ô PAYS | ALAIZ Creative Systems | Actif | Marque culturelle, patrimoniale et territoriale |
| Racines Musicales Academy® | ALAIZ Creative Systems | Actif | Formation musicale, programmes intensifs et curricula |
| Permis de Jouer™ | RMA / ALAIZ | Actif | Système d'évaluation et de progression instrument-agnostique |
| Musicien Augmenté™ | ALAIZ Creative Systems | Actif (Signature) | IA appliquée à la création, méthode et conférences |

---

### 8. Références de prestation (Consolidé ✅)

| Type d'événement / Lieu | Répertoire | Période | Formats |
|---|---|---|---|
| Hôtels, lounges, restaurants, cabarets, mariages, cérémonies privées et institutionnelles | Jazz, blues, variété internationale, musiques africaines | Depuis 2007 | Solo (chant/piano), duo, live band |
| Damas–Petits Génies (Yaoundé) | Restitution collective | Août 2026 | Ensemble instrumental & vocal RMA |

---

### 9. Informations légales (Consolidé ✅)

| Champ | Valeur |
|---|---|
| Structure mère de gouvernance | ALAIZ Creative Systems |
| Structure de production | A LAIZ PROD |
| Hébergeur | Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA |
| Droit applicable | Droit camerounais |
| RCCM / Numéro de contribuable | Délivré sur demande administrative / contractuelle |

---

### 10. Crédits photographiques (Consolidé ✅)

| Visuel | Attribution |
|---|---|
| Portrait studio officiel & monogramme | Direction artistique ALAIZ Creative Systems / A LAIZ PROD |
| Scènes live piano-bar | ALAIZ Creative Systems / Hervé Nanfang |

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
