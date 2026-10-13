# Fiche Complète du Projet — Hervé Nanfang

## 1. Identité du Projet
- **Nom du projet** : `herve-nanfang`
- **Vercel** : `herve_nanfang` (Team : `lejuif69s-projects`)
- **Stack** : Vite 6 + React 18 + TypeScript + Tailwind 4 (`"type": "module"`)
- **Chemin local** : `C:\HN_MARQUE\herve-nanfang`
- **Node.js** : 24.21.0 · **Gestionnaire** : npm (`package-lock.json`)
- **Dépôt distant** : `https://github.com/LeJuif69/Herv-Nanfang.git`
- **Domaine Production** : [https://hervenanfang.vercel.app](https://hervenanfang.vercel.app)

---

## 2. Pipeline de Build & Sortie
- **Installation** : `npm ci`
- **Build** : `npm run build` (`tsc --noEmit && vite build && node scripts/prerender.mjs`)
- **Dossier de sortie** : `dist/` (100 % statique, sans Function/Edge, aucun `/api`)
- **Configuration Vercel** (`vercel.json`) :
  ```json
  {
    "$schema": "https://openapi.vercel.sh/vercel.json",
    "outputDirectory": "dist",
    "trailingSlash": false
  }
  ```
- **Contenu généré dans `dist/`** :
  - 1 `index.html` dédié par route (21 routes pré-rendues statiquement + `404.html`)
  - `sitemap.xml` (15 URL indexables)
  - Assets avec hachage pour mise en cache optimale

---

## 3. Scripts npm Disponibles
- `npm run dev` : Démarrage serveur de développement local (`http://localhost:5173`)
- `npm run preview` : Prévisualisation locale du bundle de production (`http://localhost:4173`)
- `npm run typecheck` : Vérification des types TypeScript (`tsc --noEmit`)
- `npm run audit` : Audit SEO et cohérence éditoriale (`py -3 scripts/audit.py`)
- `npm run generate:sitemap` : Génération du plan de site sitemap.xml
- `npm run submit:indexnow` : Soumission instantanée aux moteurs de recherche via IndexNow
- `npm run photos` : Importation et traitement des médias

---

## 4. Variables d'Environnement
| Clé | Emplacement | Utilité |
| :--- | :--- | :--- |
| `VITE_BING_SITE_VERIFICATION` | Vercel (Prod + Preview) & `.env.local` | Validation Bing Webmaster Tools |
| `VITE_GOOGLE_SITE_VERIFICATION` | Vercel & `.env.local` | Validation Google Search Console |
| `VITE_SUPABASE_URL` | Vercel & `.env.local` | Connexion base de données Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Vercel & `.env.local` | Clé d'API publique Supabase |
| `VITE_ANALYTICS_ID` | Vercel & `.env.local` (Optionnel) | Suivi d'audience et métriques |
| `INDEXNOW_KEY` | Vercel & `.env.local` | Clé de signature IndexNow (serveur) |

---

## 5. Fichiers SEO à la Racine (`public/`)
- `public/sitemap.xml` : 14 pages principales + articles avec statut "Publié".
- `public/robots.txt` : Référence vers le Sitemap et autorisations pour les robots IA.
- `public/googleb71c36da563df16b.html` & `public/googled8a5eab5f1e77b59.html` : Vérifications Search Console.
- `public/og-image.jpg` : Image Open Graph officielle (1200×630).
- `public/hn-initials-mark.png` : Monogramme officiel Hervé Nanfang.

---

## 6. Comportements Clés & Contrôles
- **Articles En cours / Planifié** : Pré-rendus pour l'édition/aperçu mais marqués en `noindex, follow` et exclus du `sitemap.xml`.
- **Git Ignore** : `.env*`, `.vercel`, `dist` et `node_modules` ne sont pas versionnés.
- **Contrôles Post-Déploiement** :
  1. Accès `/sitemap.xml` (15 URL valides).
  2. Balise `<meta name="msvalidate.01" content="...">` sur la page d'accueil `/`.
  3. Champ `disambiguatingDescription` présent dans le schéma JSON-LD `Person`.
