# 📷 Déposez ici vos photos professionnelles

Ce dossier est le **point d'entrée unique** de votre identité visuelle.
Déposez vos fichiers avec le bon nom, puis lancez :

```bash
npm run photos
```

Le script recadre, optimise en WebP, place les images dans `src/assets/` et écrit
`RAPPORT-IMPORT.md` (ce qui est intégré, ce qui manque encore).

---

## Les fichiers attendus

| Nom du fichier | Format conseillé | Utilisation sur le site |
|---|---|---|
| `portrait-principal.jpg` | vertical, ≥ 2000 px de haut | Accueil, À propos, **image Open Graph**, référence d'identité numérique |
| `scene-live.jpg` | paysage 16:9, ≥ 2400 px de large | Accueil (section Musique), page Musique |
| `piano.jpg` | paysage 3:2 | Page Musique — Piano-Bar Live |
| `studio.jpg` | paysage 3:2 | Page Musique — production & son |
| `enseignement.jpg` | paysage 3:2 | Page Pédagogie |
| `conference.jpg` | paysage 16:9 | Page Conférences |
| `atelier-ia.jpg` | paysage 3:2 | Page IA & Technologie |
| `recherche.jpg` | paysage 3:2 | Page Culture & Recherche |
| `projet-rma.jpg` | paysage 3:2 | Page Projets — RMA® |
| `projet-permis-de-jouer.jpg` | paysage 3:2 | Page Projets — Permis de Jouer™ |
| `projet-laiz.jpg` | paysage 3:2 | Page Projets — A LAIZ PROD |
| `batoufam.jpg` | paysage 3:2 | Page Culture & Recherche — terrains |

> Un nom suffit à identifier l'emplacement : `scene-live-01.jpg`, `scene-live-paris.jpg`
> ou `scene-live.jpg` seront tous reconnus.

---

## Règles de qualité

- **Lumière et netteté** : privilégiez des photos nettes, bien exposées ; évitez les images
  bruitées ou floues — elles affaiblissent une identité de marque.
- **Poids** : les fichiers d'origine peuvent être lourds (10–30 Mo), c'est sans conséquence :
  le script les optimise. L'important est la **définition** (au moins 2000 px sur le grand côté).
- **Formats acceptés** : JPG, PNG, WebP, TIFF.
  Les fichiers **HEIC** (iPhone) doivent être convertis en JPG au préalable.
- **Cohérence** : la photo `portrait-principal` doit être la même sur Google, LinkedIn,
  YouTube, Facebook et Instagram — c'est elle qui construit la reconnaissance visuelle.
- **Droits** : chaque photo doit être libre de droits ou prise par un photographe dont
  l'autorisation de diffusion est acquise (crédits photo communiqués séparément).

---

## Audio et vidéo

- **Audio** : créez un sous-dossier `audio/` et déposez-y vos extraits (MP3 ou WAV).
  Ils seront optimisés et publiés dans `public/audio/`.
- **Vidéo** : listez les liens YouTube ou Vimeo dans un fichier `VIDEOS.txt`
  (un lien par ligne). Ils seront intégrés sans ralentir le site (chargement différé).

---

## Ce qui existe déjà

L'affiche *Le Pianobariste* fournie sert actuellement de visuel principal, avec deux
extractions utilisées comme portrait et comme bandeau live. Elles seront remplacées
automatiquement par vos photos dès le premier import.
