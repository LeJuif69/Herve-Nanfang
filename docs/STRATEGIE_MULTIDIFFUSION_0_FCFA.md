# STRATÉGIE OPÉRATIONNELLE DE MULTIDIFFUSION VIDÉO — BUDGET 0 FCFA
**Artiste & Marque** : Hervé Nanfang (Le Pianobariste / A Laiz Ô Pays)  
**Domaine officiel** : https://hervenanfang.art  
**Chaîne YouTube officielle** : @hervenanfang  
**Date d'établissement** : Novembre 2026  

---

## 1. PRINCIPES DIRECTEURS & CONTRAINTES STRICTES

- **Budget additionnel** : 0 FCFA strict (aucun abonnement, aucun outil payant, aucun achat d'API).
- **Hébergement & Déploiement** : Vercel Hobby (gratuit), aucun serveur ni base de données payante.
- **Stockage vidéo** : Aucun fichier vidéo lourd hébergé sur le dépôt GitHub. Stockage 100 % déporté sur YouTube.
- **Architecture de marque** :
  - **Identité centrale** : Hervé Nanfang (artiste, musicologue, ingénieur du son, formateur).
  - **Identité artistique** : Le Pianobariste™.
  - **Concept culturel fédérateur** : A Laiz Ô Pays.

---

## 2. ARCHITECTURE TECHNIQUE DU FLUX (0 FCFA)

```
[ Enregistrement Smartphone / Caméra ]
                 │
                 ▼
      [ CapCut (Desktop/Mobile Gratuit) ]
      - Montage court / sous-titres auto
      - Format 9:16 (Shorts/Reels) & 16:9 (Long)
                 │
                 ▼
        [ YouTube Studio ]
        - Téléversement (gratuit, stockage illimité)
        - Ajout aux Playlists thématiques
                 │
                 ├───────────────────────────────┐
                 ▼                               ▼
       [ Flux RSS YouTube ]              [ Multidiffusion Réseaux ]
    https://www.youtube.com/feeds/
      videos.xml?channel_id=...
                 │                               │
                 ▼                               ▼
    [ Build Automatique Vercel ]        [ Outils Natifs Gratuits ]
     - scripts/fetch-yt-rss.js          - Meta Business Suite (FB / IG)
     - Régénération de videos.ts        - TikTok Studio (Web/App)
     - Prerender SSG                    - LinkedIn (Post natif)
                 │
                 ▼
  [ https://hervenanfang.art/videos ]
   (Indexé Google Search Console)
```

---

## 3. CHAÎNE DE MULTIDIFFUSION SOCIALE (OUTILS NATIFS UNIQUEMENT)

### A. Typologie des diffusions
1. **Automatique** : La synchronisation entre YouTube et le site internet via le flux RSS exécuté à chaque build Vercel.
2. **Programmée** : La publication sur Facebook et Instagram via **Meta Business Suite** (planification gratuite jusqu'à 75 jours).
3. **Manuelle assistée** : La publication sur **TikTok Studio** et **LinkedIn** à l'aide de modèles de texte réutilisables.

---

### B. Matrice des formats et plateformes

| Plateforme | Outil Gratuit | Format | Fréquence conseillée | Rôle stratégique |
| :--- | :--- | :--- | :--- | :--- |
| **YouTube** | YouTube Studio | 16:9 (Long) & 9:16 (Shorts) | 1 à 2 / semaine | Source centrale d'autorité et d'archivage |
| **Instagram** | Meta Business Suite | 9:16 (Reel < 90s) | 2 à 3 / semaine | Visibilité visuelle & univers Pianobariste |
| **Facebook** | Meta Business Suite | 9:16 & 16:9 | 2 à 3 / semaine | Communauté locale & portée partages |
| **TikTok** | TikTok Studio (Web) | 9:16 (Shorts < 60s) | 2 à 3 / semaine | Découvrabilité algorithmique brute |
| **LinkedIn** | Application / Web | Texte + Extrait vidéo ou lien | 1 / semaine | Crédibilité professionnelle, pédagogie & B2B |
| **Site Web** | `scripts/fetch-yt-rss.js` | Responsive embed | Automatique | Conversion, SEO et point d'ancrage officiel |

---

## 4. WORKFLOW QUOTIDIEN STANDARD (15 À 20 MINUTES)

### Étape 1 : Post-production express (CapCut Gratuit — 7 min)
- Importer la prise brute.
- Recadrer en 9:16 (ou conserver 16:9 pour une version intégrale).
- Générer les **Légendes automatiques** (Auto-captions en français).
- Exporter en **1080p / 30fps** (paramètres gratuits sans filigrane).

### Étape 2 : Publication YouTube (YouTube Studio — 4 min)
- Téléverser la vidéo avec un titre optimisé contenant la signature (ex: *Titre du morceau — Reprise Live par Hervé Nanfang*).
- Ajouter la vidéo à la playlist correspondante (*Reprises Live*, *Piano-Bar Live*, etc.).
- Copier le lien de la vidéo.

### Étape 3 : Déclenchement site web (Automatique ou Git — 1 min)
- *Option automatique* : Le workflow programmé GitHub Actions ou le prochain commit de maintenance mettra à jour le site.
- *Option immédiate* : Exécuter la commande alias :
  ```bash
  git trigger
  ```
  *(Crée un déclencheur vide, pousse sur GitHub et lance le déploiement Vercel).*

### Étape 4 : Programmation Meta (Meta Business Suite — 4 min)
- Ouvrir `business.facebook.com`.
- Créer une publication croisée Facebook + Instagram.
- Glisser le fichier vidéo exporté, coller le texte type (Template Meta ci-dessous), et programmer pour l'heure de pointe (ex. 18h30 ou 12h30).

### Étape 5 : Diffusion TikTok & LinkedIn (4 min)
- Déposer la vidéo sur TikTok Studio avec 3 à 4 hashtags ciblés.
- Publier sur LinkedIn un court texte de mise en contexte métier (la pédagogie du morceau, l'arrangement harmonique ou l'ingénierie sonore).

---

## 5. MODÈLES DE TEXTE PRÊTS À L'EMPLOI (TEMPLATES)

### Template 1 : Meta (Instagram & Facebook)
> 🎹 **[TITRE DU MORCEAU] — Session Live & Piano-Bar**  
> 
> Redécouvrez ce grand classique revisité au piano, entre pulsation acoustique et émotion brute.  
> 
> 🎙️ Interprétation & arrangements : **Hervé Nanfang**  
> 📍 Ambiance : Le Pianobariste™  
> 
> 🔗 Écoutez la version complète et explorez le répertoire sur le site officiel : https://hervenanfang.art/videos  
> 
> ---  
> #HerveNanfang #LePianobariste #PianoBar #MusiqueLive #AcousticCover #ALaizOPays

---

### Template 2 : LinkedIn (Positionnement Pro & Pédagogique)
> **De la mélodie populaire à la structure harmonique : analyse d'un arrangement live.**  
> 
> Traiter un morceau populaire au piano solo exige un équilibre rigoureux entre la fidélité au thème d'origine et la réinterprétation des dynamiques rythmiques.  
> 
> Dans cette captation live sur *[Titre du morceau]*, le travail a porté sur :  
> • Le voicing des accords à la main gauche pour soutenir la pulsation sans saturer l'espace acoustique.  
> • L'ornementation mélodique au service de l'émotion narrative.  
> 
> 🎥 Extrait ci-dessous.  
> 🌐 Retrouvez l'ensemble de mes analyses et projets de transmission sur : https://hervenanfang.art  
> 
> #PedagogieMusicale #Musicologie #IngenierieSonore #HerveNanfang #PianoLive

---

## 6. CALENDRIER DE DÉPLOIEMENT OPÉRATIONNEL SUR 7 JOURS

| Jour | Objectif | Actions concrètes |
| :--- | :--- | :--- |
| **Jour 1** | **Vérification & Socle** | • Valider le build Vercel avec le script RSS.<br>• Vérifier l'accès à Search Console (déjà validé). |
| **Jour 2** | **Connexion Meta** | • Vérifier que la page Facebook Hervé Nanfang et le compte Instagram sont bien reliés dans Meta Business Suite. |
| **Jour 3** | **Calibrage CapCut** | • Enregistrer un preset de texte/sous-titres dans CapCut (police sobre, taille adaptée aux smartphones). |
| **Jour 4** | **Première publication test** | • Exécuter le cycle complet sur 1 vidéo test (YouTube -> Meta -> TikTok -> Site web). |
| **Jour 5** | **Contrôle SEO & Liens** | • S'assurer que le lien vers le site `https://hervenanfang.art/videos` est bien cliquable dans la bio de chaque réseau social. |
| **Jour 6** | **Planification par lot** | • Prendre 3 captations brutes existantes et programmer leur diffusion sur 1 semaine via Meta Business Suite. |
| **Jour 7** | **Bilan & Analyse** | • Consulter Search Console (pages indexées) et YouTube Studio (taux de clic / rétention). |

---

## 7. LIMITES DES SOLUTIONS GRATUITES & PARADES

| Outil | Limite de la version gratuite | Solution de contournement (0 FCFA) |
| :--- | :--- | :--- |
| **YouTube RSS** | Mise à jour décalée si aucun build n'est déclenché. | Utiliser l'alias rapide `git trigger` après chaque nouvel upload majeur. |
| **Vercel Hobby** | Pas de calcul lourd en temps réel côté serveur. | Approche SSG statique : les pages se génèrent au build et chargent instantanément. |
| **CapCut Gratuit** | Certaines polices ou effets sont réservés à l'offre Pro. | Utiliser exclusivement les animations et polices basiques libres de droit. |
| **Meta Business Suite** | Programmation limitée à 75 jours à l'avance. | Travailler sur des cycles de planification hebdomadaires ou bi-mensuels. |
| **API Réseaux Sociaux** | Accès API payant pour automatiser la publication externe. | Remplacé par les outils web officiels gratuits (Meta Business Suite, TikTok Web). |

---

## 8. ÉVOLUTIONS FUTURES ENVISAGEABLES (SANS ABONNEMENT OBLIGATOIRE)

1. **Sitemap Vidéo XML dédié** : Écrire un petit script Node (`scripts/generate-video-sitemap.mjs`) pour alimenter spécifiquement la section "Vidéos" de Google Search Console.
2. **Webhooks IFTTT / Zapier (Plans gratuits)** : Si des passerelles gratuites sans carte bancaire le permettent, relier le flux RSS YouTube pour publier automatiquement un tweet ou une notification.
3. **Optimisation des métadonnées JSON-LD** : Enrichir le balisage Schema.org `MusicRecording` et `VideoObject` sur chaque fiche du site.
