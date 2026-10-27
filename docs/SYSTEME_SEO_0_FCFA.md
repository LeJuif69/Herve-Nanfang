# Système SEO Semi-Automatisé à 0 FCFA — Guide Opérationnel
**Auteur & Écosystème :** Hervé Nanfang (`https://hervenanfang.vercel.app`)  
**Stack technique :** React 18 + Vite + SSG Node maison (`scripts/prerender.mjs`) + Vercel + Supabase  
**Marques & Piliers :** Racines Musicales Academy® (RMA), Permis de Jouer™, Le Pianobariste™, Alaiz Music / ALAIZ Creative Systems, Musicien Augmenté™  
**Objectif :** Produire 1 article d'autorité de 1 500 à 2 000 mots en 2h15, sans abonnement SaaS payant (0 FCFA), indexé en HTML statique et diffusé sur 9 canaux.

---

## 1. La Stack d'Outils Gratuits (0 FCFA)

| Rôle | Outil Gratuit | Utilisation concrète |
| :--- | :--- | :--- |
| **Audit & Potentiel** | Google Search Console | Détecter les requêtes en positions 8 à 25 à fort volume d'impressions |
| **Veille & Tendances** | Google Trends & Bing Webmaster | Surveiller la demande (Cameroun, Afrique francophone, diaspora) |
| **Backlinks & Concurrence** | Ahrefs Webmaster Tools (gratuit) | Surveiller la santé technique et les liens entrants du domaine |
| **Crawler Technique** | Screaming Frog (gratuit < 500 URL) | Vérifier le code HTTP 200, les balises canoniques et les balises meta |
| **Cocréation & Rédaction** | Gemini Pro / ChatGPT (version gratuite) | Cadrage sémantique, rédaction assistée et encodage JSON/TypeScript |
| **Infrastructure & SSG** | Vite + Node.js + Vercel (Hobby) | Génération de pages HTML pures avec JSON-LD et déploiement mondial |

---

## 2. Le Workflow Opérationnel en 6 Phases (2h15 par article)

```
[Phase 1 : 20 min]  Google Search Console / Trends  ──>  Sélection requête cible & intention
         │
[Phase 2 : 15 min]  Prompt 1 (Cadrage & Brief)      ──>  Architecture H2/H3 + Intégration E-E-A-T
         │
[Phase 3 : 45 min]  Prompt 2 (Rédaction Signature)  ──>  1 500-2 000 mots au ton Hervé Nanfang
         │
[Phase 4 : 15 min]  Prompt 3 (Encodage TypeScript)  ──>  Objet `Article` prêt pour `articles.ts`
         │
[Phase 5 : 15 min]  Checklist 5 points & Build SSG  ──>  `npm run build` (39+ HTML) + `git push`
         │
[Phase 6 : 25 min]  Distribution Multicanal         ──>  LinkedIn, WhatsApp, Facebook, Tribune
```

---

## 3. Boîte à Outils : Les 3 Prompts d'Ingénierie

### 📝 Prompt 1 : Recherche d'Angle Sémantique & Brief SEO
*À coller dans Gemini ou ChatGPT pour générer le plan d'un article.*

```markdown
Tu es le directeur éditorial et stratège SEO d'Hervé Nanfang (hervenanfang.vercel.app), pianiste-scénographe, musicologue, créateur de la méthode « Le Permis de Jouer™ », fondateur de la Racines Musicales Academy® (RMA) et directeur d'ALAIZ Creative Systems.

CONTEXTE & NICHES :
- Pédagogie musicale structurée pour adultes et enfants (méthode LES ZIKOS®, Permis de Jouer™ N1 à N4).
- Scène piano-bar de prestige & événementiel haut de gamme (mariages d'exception, galas diplomatiques, corporate à Yaoundé, Douala et diaspora).
- Ingénierie sonore & MAO hybride (acoustique + MAO chez Alaiz Music).
- IA musicale & Droits d'auteur (espace OAPI, Cameroun, cadre du Musicien Augmenté™).
- Musicologie appliquée (Bikutsi, Tswefap de Batoufam, Makossa, traditions orales africaines).

MISSION :
Conçois un brief SEO complet pour le sujet suivant :
[INSÉRER LE SUJET OU LA REQUÊTE CIBLE, ex: "Apprendre le piano à l'âge adulte méthode structurée"]

LIVRABLES ATTENDUS :
1. Intention de recherche exacte (Informationnelle / Transactionnelle) et profil du lecteur cible.
2. Titre SEO (≤ 60 caractères, percutant, jamais tronqué dans Google) et Meta description (120-165 caractères incitative).
3. Grappe sémantique : 1 mot-clé principal, 4 mots-clés secondaires longue traîne, et entités nommées locales (Cameroun, Afrique, OAPI ou institutions pertinentes).
4. Plan détaillé H2 / H3 structuré en 5 à 7 sections, incluant :
   - Une réponse directe dès l'introduction (Answer-First).
   - Un tableau comparatif ou grille méthodologique.
   - 3 questions fréquentes (FAQ) ciblées pour les PAA Google.
   - Les emplacements précis pour 3 retours d'expérience vécus d'Hervé Nanfang.
   - Les points de maillage interne vers les pages du site (/pedagogie, /services, /ia-technologie, /musique, /contact).
```

---

### ✍️ Prompt 2 : Rédaction Longue Signature « Hervé Nanfang » (1 500 à 2 000 mots)
*À utiliser après validation du brief pour rédiger le corps de l'article.*

```markdown
Rédige maintenant l'article complet de 1 500 à 2 000 mots sur la base du brief ci-dessus.

CONSIGNES DE TON ET DE STYLE (CRITÈRES E-E-A-T STRICTS) :
1. TON INCARNÉ : Rédige à la première personne (« je », « dans ma pratique », « à l'académie », « sur scène »). Le ton est celui d'un musicologue rigoureux, d'un pédagogue bienveillant mais intransigeant, et d'un pianiste qui vit de son art.
2. EXPÉRIENCE VÉCUE OBLIGATOIRE : Intègre au moins deux anecdotes de terrain concrètes (ex: une séance de travail au piano à Yaoundé, un blocage d'adulte résolu grâce aux grilles du Permis de Jouer™, ou une session de mixage chez Alaiz Music).
3. EXCLUSION DU JARGON IA : Bannis rigoureusement les expressions génériques de chatbot : « Dans un monde en constante évolution », « Il convient de noter », « En conclusion », « Plongeons dans », « Catalyseur », « Véritable révolution ». Préfère des phrases ciselées, des verbes d'action et du vocabulaire musical exact.
4. FORMAT ET LISIBILITÉ :
   - Paragraphes courts (3 à 5 lignes max).
   - Listes à puces percutantes.
   - Au moins un tableau comparatif en syntaxe Markdown.
   - 3 questions/réponses de FAQ en fin d'article rédigées de façon concise.
5. CONVERSION & MAILLAGE : Intègre naturellement 3 à 4 liens internes en syntaxe Markdown ([Label du lien](/page-cible)) renvoyant vers :
   - /pedagogie#permis-de-jouer (Formations & Permis de Jouer)
   - /services#piano-bar (Prestations live de prestige)
   - /ia-technologie#manifeste (Musicien Augmenté™)
   - /contact (Audit, masterclass ou devis)
```

---

### 💻 Prompt 3 : Formatage TypeScript / JSON pour `src/data/articles.ts`
*À exécuter pour transformer l'article rédigé en code directement intégrable.*

```markdown
Transforme l'article rédigé en un objet TypeScript conforme à l'interface Article du projet hervenanfang.vercel.app.

STRUCTURE TYPESCRIPT REQUISE :
```typescript
{
  slug: 'slug-sans-accent-optimise-seo',
  num: 'XX', // numéro du pilier, ex: '19'
  category: 'Pédagogie' | 'Musique' | 'Technologie' | 'Culture' | 'Entrepreneuriat',
  title: 'Titre complet visible sur la page',
  excerpt: 'Résumé percutant de 2 à 3 phrases pour la carte du Journal et les aperçus sociaux.',
  readingTime: '8 min',
  status: 'Publié',
  audience: 'Description précise des professionnels ou passionnés ciblés',
  linkedConcept: {
    label: 'Libellé du bouton de redirection',
    to: '/page-cible#ancre'
  },
  keywords: ['mot-clé 1', 'mot-clé 2', 'mot-clé 3', 'mot-clé 4'],
  seoTitle: 'Titre SEO strict <= 60 carac avec mot-clé principal',
  seoDescription: 'Meta description incitative entre 120 et 165 caractères.',
  outline: [
    'Titre exact de la section 1',
    'Titre exact de la section 2',
    // ... toutes les sections H2
  ],
  body: [
    {
      heading: 'Titre de la section 1',
      paragraphs: [
        'Premier paragraphe avec [liens internes](/cible) éventuels...',
        'Deuxième paragraphe...'
      ]
    },
    // ... toutes les sections
  ]
}
```

RÈGLES D'ENCODAGE :
- Échappe correctement les apostrophes et guillemets.
- Ne tronque aucun paragraphe.
- Conserve les liens Markdown [Texte](/chemin) à l'intérieur des chaînes de paragraphes.
```

---

## 4. Checklist Qualité Humaine & Technique en 5 Points (Avant `git push`)

Avant de déployer un nouvel article sur Vercel, valide cette checklist :

1. [ ] **Preuve d'expérience vécue (E-E-A-T)** : L'article contient-il au moins un retour d'expérience terrain réel et non-reproductible par une IA générique ?
2. [ ] **Rigueur terminologique** : Les notions musicales, acoustiques, rythmiques (Bikutsi, Tswefap, cadence) ou juridiques (OAPI, droits voisins) sont-elles exactes ?
3. [ ] **Maillage interne bidirectionnel** : L'article pointe-t-il vers 2 pages piliers du site, ET un ancien article a-t-il été mis à jour pour pointer vers ce nouvel article ?
4. [ ] **Validation du SSG Node** : Le build (`npm run build`) génère-t-il bien le fichier HTML statique dans `dist/` avec `<title>`, `<meta description>` et `sitemap.xml` mis à jour ?
5. [ ] **Indexation & Recette** : La page répond-elle en HTTP 200, les blocs de conversion (*Carnets Privés*, devis ou RMA) sont-ils visibles, et l'URL a-t-elle été soumise à Google Search Console ?

---

## 5. Calendrier Éditorial : Les 6 Piliers Prioritaires

| N° | Catégorie | Titre Pilier Proposé | Mot-clé cible principale | Intention & Page liée |
| :---: | :--- | :--- | :--- | :--- |
| **01** | **Pédagogie** | *Apprendre le piano à l'âge adulte : pourquoi la méthode classique échoue et comment progresser par paliers certifiés* | `apprendre le piano adulte méthode structurée` | Info / Conversion -> `/pedagogie#permis-de-jouer` |
| **02** | **Piano-Bar** | *Animation musicale piano-bar de prestige au Cameroun : les critères d'excellence pour un événement corporate ou un mariage* | `pianiste événementiel mariage corporate Yaoundé Douala` | Commerciale -> `/services#piano-bar` |
| **03** | **IA & Droit** | *IA générative et droit d'auteur musical en Afrique (OAPI & Cameroun) : protéger ses œuvres avec le cadre Musicien Augmenté™* | `droit auteur musique intelligence artificielle Afrique OAPI` | Info / Autorité -> `/ia-technologie#manifeste` |
| **04** | **Musicologie** | *Traduire la tradition orale au clavier : musicologie appliquée des rythmes camerounais (du Bikutsi au Tswefap de Batoufam)* | `rythmes traditionnels camerounais piano musicologie` | Éducative / Marque -> `/musique#repertoire` |
| **05** | **Studio MAO** | *Production musicale hybride chez Alaiz Music : marier prise de son acoustique, MAO et outils IA sans perdre son identité* | `production musicale hybride MAO acoustique Afrique` | Commerciale -> `/services#studio` |
| **06** | **Économie** | *L'économie du musicien en Afrique francophone : bâtir un modèle hybride durable entre scène, enseignement et production* | `vivre de la musique en Afrique modèle économique` | Stratégique -> `/contact` |
