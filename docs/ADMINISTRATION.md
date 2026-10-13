# Administration — piloter le site sans développeur

Objectif (section 20 du master) : le site doit devenir une **plateforme éditoriale vivante**, modifiable par Hervé Nanfang seul.

---

## 1. Principe

Deux espaces strictement séparés :

```text
┌─────────────────────────────┐        ┌──────────────────────────────┐
│  SITE PUBLIC (statique)     │        │  ADMIN /admin (protégé)      │
│  Lecture seule, SEO, rapide │        │  Écriture, authentifiée      │
└─────────────────────────────┘        └──────────────────────────────┘
              │                                      │
              └──────────────┬───────────────────────┘
                             ▼
                   SUPABASE (PostgreSQL + Storage)
                   • RLS : lecture publique des contenus publiés
                   • écriture réservée aux comptes administrateurs
```

- Le public ne lit que les contenus au statut `publié` (règle appliquée par la base, pas par le code).
- L'administration exige une authentification (email + mot de passe, ou lien magique).
- Aucun mot de passe, aucune clé de service n'est exposée dans le frontend public.

---

## 2. Dashboard (arborescence cible)

```text
ADMIN
├── Tableau de bord      → statistiques, derniers messages, articles à rédiger
├── Articles             → Journal du Musicien Augmenté (catégorie, série, statut, SEO, image)
├── Projets              → 5 familles, statut, marque associée
├── Musiques             → titres, extraits audio, liens streaming
├── Vidéos               → YouTube/Vimeo (VideoObject généré automatiquement)
├── Formations           → cours, modules, publics, prérequis
├── Conférences          → thèmes, formats, publics, tarifs
├── Événements           → dates, lieux, billetterie
├── Photos               → médiathèque (Supabase Storage)
├── Documents            → PDF, méthodes, dossiers de presse
├── Messages             → demandes reçues par parcours (booking, formation, conseil…)
├── SEO                  → titres/descriptions, sitemap, redirections, Open Graph
└── Paramètres           → identité, coordonnées, réseaux, mentions légales
```

Chaque écran reprend la charte du site (noir, ivoire, or) pour rester cohérent et lisible.

---

## 3. Flux éditorial

```text
Brouillon ──► En relecture ──► Publié ──► Archivé
```

Règles :
1. Un contenu `Publié` devient visible sur le site public **et** entre dans le sitemap.
2. Une publication déclenche la régénération du sitemap et le ping à Search Console.
3. Chaque contenu porte ses propres métadonnées SEO (title, description, image OG).
4. Les statuts intermédiaires (« En cours », « Planifié ») sont déjà supportés par l'interface publique des articles — la transition est donc immédiate.

---

## 4. Gestion des médias

- **Formats acceptés** : JPEG, PNG, WebP, AVIF, MP3, WAV, MP4, PDF.
- **Traitement à l'upload** : conversion WebP, génération de trois tailles (vignette 400, contenu 1200, large 2000), extraction des dimensions.
- **Nommage** : `2026-03-15-conference-esas-01.webp` (date + contexte + numéro) pour un référencement durable des images.
- **Sécurité** : validation du type réel (signature du fichier), limite de taille (25 Mo), stockage séparé public (images du site) / privé (documents internes, dossiers de presse non publiés).
- **Texte alternatif obligatoire** pour chaque image publiée (accessibilité + SEO images).

---

## 5. Messages et parcours

Le formulaire de contact classe automatiquement chaque demande par parcours :

| Parcours | Champs spécifiques | Destination |
|---|---|---|
| Booking | date, lieu, type de salle, durée | boîte booking |
| Formation | public, effectif, prérequis | boîte formation |
| Conférence | thème, public, date, format | boîte conférences |
| Collaboration | nature du projet, partenaires | boîte générale |
| Presse | média, support, échéance, angle | boîte presse |
| Conseil | organisation, enjeu, périmètre | boîte conseil |

Chaque message conserve : date de réception, statut (nouveau / en cours / traité), notes internes.

---

## 6. Mise en œuvre

1. Créer le projet Supabase.
2. Exécuter `docs/supabase-schema.sql` (tables, index, politiques RLS, buckets Storage).
3. Créer le compte administrateur.
4. Renseigner les clés publiques dans un fichier `.env` :

```bash
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

5. Brancher successivement : Articles → Projets → Médias → Messages → Événements.
6. Ajouter le script npm de génération automatique du sitemap après publication.

> Aucune de ces étapes n'est bloquante pour la mise en ligne du site vitrine : les contenus actuels sont servis depuis `src/data/`, donc le site fonctionne dès aujourd'hui sur un hébergement statique.
