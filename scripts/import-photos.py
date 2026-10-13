#!/usr/bin/env python3
"""
INTÉGRATION DES PHOTOS PROFESSIONNELLES — Hervé Nanfang
=============================================================================
Déposez vos photos dans le dossier `photos/`, puis lancez :

    npm run photos

Le script :
  1. reconnaît chaque photo grâce au nom du fichier (voir la liste des slots) ;
  2. la recadre et l'optimise en WebP aux dimensions attendues par le site ;
  3. l'écrit dans `src/assets/` sous le nom exact utilisé par le code ;
  4. régénère `public/og-image.jpg` (image de partage Open Graph) si un portrait
     principal est fourni ;
  5. produit `photos/RAPPORT-IMPORT.md` : ce qui a été intégré, ce qui manque.

Options :
    --crop      recadre au format exact du slot (au lieu de conserver le ratio)
    --dry-run   n'écrit rien, affiche seulement ce qui serait fait
    --qualite N qualité WebP (défaut : 87)
"""

from __future__ import annotations

import argparse
import sys
from datetime import date
from pathlib import Path

try:
    from PIL import Image, ImageFilter
except ImportError:  # pragma: no cover
    sys.exit(
        "Pillow est requis. Installez-le avec :  python3 -m pip install Pillow"
    )

ROOT = Path(__file__).resolve().parent.parent
PHOTOS = ROOT / "photos"
ASSETS = ROOT / "src" / "assets"
PUBLIC = ROOT / "public"

EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".bmp"}
NON_SUPPORTEES = {".heic", ".heif", ".dng", ".cr2", ".nef", ".arw", ".raf"}

# --------------------------------------------------------------------------- #
# Emplacements attendus par le site
# --------------------------------------------------------------------------- #
SLOTS: dict[str, dict] = {
    "portrait-principal": {
        "cible": "portrait.webp",
        "largeur": 760,
        "ratio": (3, 5),
        "ou": "Accueil (colonne visuelle) · À propos (portrait latéral) · image Open Graph · référence d'identité numérique",
        "conseil": "Cadrage vertical, visage net, fond sombre si possible. C'est LA photo de référence : elle doit être identique sur Google, LinkedIn, YouTube, Facebook et Instagram.",
    },
    "scene-live": {
        "cible": "live-band.webp",
        "largeur": 1400,
        "ratio": (16, 9),
        "ou": "Accueil (section Musique) · page Musique (bandeau live)",
        "conseil": "Piano ou clavier visible, lumière de scène, moment de jeu plutôt que pause.",
    },
    "piano": {
        "cible": "piano.webp",
        "largeur": 1200,
        "ratio": (3, 2),
        "ou": "Page Musique — section Piano-Bar Live",
        "conseil": "Détail des mains sur le clavier, ou piano à queue en situation.",
    },
    "studio": {
        "cible": "studio.webp",
        "largeur": 1200,
        "ratio": (3, 2),
        "ou": "Page Musique — production & ingénierie du son",
        "conseil": "Console, écrans de MAO, micros : le travail de fabrication du son.",
    },
    "enseignement": {
        "cible": "enseignement.webp",
        "largeur": 1200,
        "ratio": (3, 2),
        "ou": "Page Pédagogie — section Enseignement",
        "conseil": "Interaction réelle avec un étudiant ou un groupe, pas une pose.",
    },
    "conference": {
        "cible": "conference.webp",
        "largeur": 1400,
        "ratio": (16, 9),
        "ou": "Page Conférences — bandeau d'ouverture",
        "conseil": "Prise de parole devant un public : salle, micro, attention du auditoire.",
    },
    "atelier-ia": {
        "cible": "atelier-ia.webp",
        "largeur": 1200,
        "ratio": (3, 2),
        "ou": "Page IA & Technologie — manifeste et méthode",
        "conseil": "Travail sur ordinateur avec un musicien ou un enseignant : l'IA en situation.",
    },
    "recherche": {
        "cible": "recherche.webp",
        "largeur": 1200,
        "ratio": (3, 2),
        "ou": "Page Culture & Recherche",
        "conseil": "Terrain, collecte, instruments traditionnels, échange avec des détenteurs de savoirs.",
    },
    "projet-rma": {
        "cible": "projet-rma.webp",
        "largeur": 1200,
        "ratio": (3, 2),
        "ou": "Page Projets — Racines Musicales Academy®",
        "conseil": "Groupe d'élèves, atelier, remise de supports ou de certificats.",
    },
    "projet-permis-de-jouer": {
        "cible": "projet-permis.webp",
        "largeur": 1200,
        "ratio": (3, 2),
        "ou": "Page Projets — Permis de Jouer™",
        "conseil": "Visuel du système (paliers, livret, affiche du projet), ou situation de validation.",
    },
    "projet-laiz": {
        "cible": "projet-laiz.webp",
        "largeur": 1200,
        "ratio": (3, 2),
        "ou": "Page Projets — A LAIZ PROD",
        "conseil": "Production, événement, plateau technique : la structure en action.",
    },
    "batoufam": {
        "cible": "batoufam.webp",
        "largeur": 1200,
        "ratio": (3, 2),
        "ou": "Page Culture & Recherche — terrains",
        "conseil": "Contexte culturel des chefferies : lieux, cérémonies, instruments.",
    },
}


def ratio_of(path: Path) -> float:
    with Image.open(path) as im:
        return im.width / im.height if im.height else 0


def traiter(src: Path, slot: str, reglages: dict, crop: bool, qualite: int, dry: bool) -> str:
    largeur_max: int = reglages["largeur"]
    cible: Path = ASSETS / reglages["cible"]

    if dry:
        return f"{src.name} → {reglages['cible']} (largeur max {largeur_max}px)"

    with Image.open(src) as im:
        im = im.convert("RGB")
        original = im.size

        if crop and reglages.get("ratio"):
            rw, rh = reglages["ratio"]
            attendu = rw / rh
            actuel = im.width / im.height
            if actuel > attendu:                      # trop large : on rogne les côtés
                nouvelle_largeur = int(im.height * attendu)
                gauche = (im.width - nouvelle_largeur) // 2
                im = im.crop((gauche, 0, gauche + nouvelle_largeur, im.height))
            elif actuel < attendu:                    # trop haut : on rogne haut/bas
                nouvelle_hauteur = int(im.width / attendu)
                haut = int((im.height - nouvelle_hauteur) * 0.35)   # cadrage vers le haut (visages)
                im = im.crop((0, haut, im.width, haut + nouvelle_hauteur))

        if im.width > largeur_max:
            hauteur = round(im.height * largeur_max / im.width)
            im = im.resize((largeur_max, hauteur), Image.LANCZOS)

        im = im.filter(ImageFilter.UnsharpMask(radius=1.4, percent=58, threshold=3))
        im.save(cible, "WEBP", quality=qualite, method=6)

    taille = cible.stat().st_size // 1024
    return f"{src.name} → {reglages['cible']} · {original[0]}×{original[1]} → {im.width}×{im.height} · {taille} Ko"


def image_open_graph(source: Path) -> str | None:
    """Recadre en 1200×630 pour le partage sur les réseaux et les moteurs."""
    cible = PUBLIC / "og-image.jpg"
    with Image.open(source) as im:
        im = im.convert("RGB")
        attendu = 1200 / 630
        actuel = im.width / im.height
        if actuel > attendu:
            largeur = int(im.height * attendu)
            gauche = (im.width - largeur) // 2
            im = im.crop((gauche, 0, gauche + largeur, im.height))
        else:
            hauteur = int(im.width / attendu)
            haut = int((im.height - hauteur) * 0.3)
            im = im.crop((0, haut, im.width, haut + hauteur))
        im = im.resize((1200, 630), Image.LANCZOS)
        im.save(cible, "JPEG", quality=88, optimize=True)
    return f"og-image.jpg régénérée depuis {source.name} ({cible.stat().st_size // 1024} Ko)"


def main() -> int:
    parser = argparse.ArgumentParser(description="Intègre les photos professionnelles au site.")
    parser.add_argument("--crop", action="store_true", help="recadre au format exact du slot")
    parser.add_argument("--dry-run", action="store_true", help="n'écrit aucun fichier")
    parser.add_argument("--qualite", type=int, default=87, help="qualité WebP (défaut 87)")
    args = parser.parse_args()

    PHOTOS.mkdir(exist_ok=True)
    ASSETS.mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(exist_ok=True)

    fichiers = [
        f for f in sorted(PHOTOS.rglob("*"))
        if f.is_file() and f.suffix.lower() in EXTENSIONS
    ]
    refuses = [
        f for f in sorted(PHOTOS.rglob("*"))
        if f.is_file() and f.suffix.lower() in NON_SUPPORTEES
    ]

    integres: list[str] = []
    avertissements: list[str] = []
    utilises: set[Path] = set()
    portrait_source: Path | None = None

    for nom_slot, reglages in SLOTS.items():
        candidats = [
            f for f in fichiers
            if f.name.lower().startswith(nom_slot) and f not in utilises
        ]
        if not candidats:
            continue
        src = candidats[0]
        utilises.add(src)

        if ratio_of(src) and Image.open(src).width < 1000:
            avertissements.append(
                f"{src.name} : largeur {Image.open(src).width}px — en dessous de 1000px, "
                "le rendu sera mou sur grand écran."
            )

        integres.append(traiter(src, nom_slot, reglages, args.crop, args.qualite, args.dry_run))
        if nom_slot == "portrait-principal":
            portrait_source = src

    manquants = [s for s in SLOTS if not any(
        f.name.lower().startswith(s) for f in fichiers
    )]
    inconnus = [f.name for f in fichiers if f not in utilises]

    og = None
    if portrait_source and not args.dry_run:
        og = image_open_graph(portrait_source)

    # ----------------------------------------------------------------------- #
    # Rapport
    # ----------------------------------------------------------------------- #
    lignes: list[str] = []
    add = lignes.append
    add("# Rapport d'intégration des photos")
    add("")
    add(f"*{date.today().strftime('%d/%m/%Y')} — `npm run photos`*")
    add("")
    add(f"**{len(integres)} emplacement(s) intégré(s)** sur {len(SLOTS)}.")
    add("")

    if integres:
        add("## Intégrées")
        add("")
        for ligne in integres:
            add(f"- {ligne}")
        add("")

    if manquants:
        add("## Encore attendues")
        add("")
        add("| Nom du fichier à déposer | Utilisation | Conseil de prise de vue |")
        add("|---|---|---|")
        for slot in manquants:
            r = SLOTS[slot]
            add(f"| `{slot}.jpg` | {r['ou']} | {r['conseil']} |")
        add("")

    if inconnus:
        add("## Fichiers non reconnus")
        add("")
        add("Ces fichiers n'ont pas de correspondance : renommez-les d'après le tableau ci-dessus.")
        add("")
        for nom in inconnus:
            add(f"- {nom}")
        add("")

    if refuses:
        add("## Formats non pris en charge")
        add("")
        add("Les fichiers HEIC (iPhone) doivent être convertis en JPEG avant l'import.")
        add("")
        for f in refuses:
            add(f"- {f.name}")
        add("")

    if avertissements:
        add("## Avertissements de qualité")
        add("")
        for a in avertissements:
            add(f"- {a}")
        add("")

    if og:
        add("## Image de partage")
        add("")
        add(f"- {og}")
        add("")

    add("## Étape suivante")
    add("")
    add("Les fichiers sont prêts dans `src/assets/`. Prévenez-moi : je les câble dans")
    add("les pages correspondantes (une seule passe de code, aucune refonte).")
    add("")

    (PHOTOS / "RAPPORT-IMPORT.md").write_text("\n".join(lignes) + "\n", encoding="utf-8")

    print(f"Rapport : photos/RAPPORT-IMPORT.md")
    print(f"  intégrées : {len(integres)} | en attente : {len(manquants)} | non reconnues : {len(inconnus)}")
    for ligne in integres:
        print("  ✔", ligne)
    if manquants:
        print("  ⏳ en attente :", ", ".join(manquants))
    if avertissements:
        for a in avertissements:
            print("  ⚠️ ", a)
    if refuses:
        print("  ❌ formats non pris en charge :", ", ".join(f.name for f in refuses))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
