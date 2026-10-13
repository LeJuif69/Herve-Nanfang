#!/usr/bin/env python3
"""
AUDIT ÉDITORIAL ET TECHNIQUE — hervenanfang.vercel.app
=============================================================================
Usage :  npm run audit          (ou : python3 scripts/audit.py)

Analyse la source du site et produit docs/AUDIT.md :
  • titre et description SEO par page, avec contrôle de longueur ;
  • balise H1 unique par page ;
  • données structurées Schema.org utilisées par page ;
  • cohérence entre les routes du routeur et le sitemap ;
  • liens internes cassés (cible absente du routeur) ;
  • images sans texte alternatif ;
  • résidus de contenu générique (placeholders) ;
  • éléments factuels à confirmer par Hervé Nanfang.
"""

from __future__ import annotations

import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = sorted((ROOT / "src" / "pages").glob("*.tsx"))
DATA = sorted((ROOT / "src" / "data").glob("*.ts"))
OUT = ROOT / "docs" / "AUDIT.md"

TITLE_MIN, TITLE_MAX = 25, 80          # 80 = plafond absolu ; Google tronque vers 60
TITLE_VISIBLE = 60
DESC_MIN, DESC_MAX = 120, 165


# --------------------------------------------------------------------------- #
# Extraction
# --------------------------------------------------------------------------- #
def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def extract_use_seo(src: str) -> dict[str, str]:
    """Récupère les valeurs title / description passées à useSeo({...})."""
    result: dict[str, str] = {}
    block = re.search(r"useSeo\(\{", src)
    if not block:
        return result
    tail = src[block.end():]

    for key, stop in (("title", "description"), ("description", "path")):
        m = re.search(
            rf"{key}:\s*(.*?),\s*\n\s*{stop}:", tail, re.DOTALL
        )
        if not m:
            continue
        raw = m.group(1)
        dynamic = "??" in raw or " ? " in raw or raw.strip().startswith("article")
        raw = re.sub(
            r"MASTER_IDENTITY\.(\w+)\.(\w+)",
            lambda mm: repr(identity_nested_value(mm.group(1), mm.group(2)))
            if identity_nested_value(mm.group(1), mm.group(2)) is not None
            else mm.group(0),
            raw,
        )
        raw = re.sub(
            r"IDENTITY\.(\w+)",
            lambda mm: repr(identity_value(mm.group(1)))
            if identity_value(mm.group(1)) is not None
            else mm.group(0),
            raw,
        )
        literals = scan_string_literals(raw)
        if literals:
            # le littéral le plus long est la formulation de référence
            result[key] = max(literals, key=len)
            if dynamic:
                result[key] += "  (valeur dynamique)"
    return result


def scan_string_literals(raw: str) -> list[str]:
    """Extrait les littéraux de chaîne en respectant les apostrophes françaises.

    Un scanner naïf par expression régulière s'arrête sur l'apostrophe de « l'IA »
    à l'intérieur d'une chaîne délimitée par des guillemets doubles. On parcourt
    donc caractère par caractère, en tenant compte de l'échappement.
    """
    out: list[str] = []
    i, n = 0, len(raw)
    while i < n:
        ch = raw[i]
        if ch in "\"\'`":
            quote = ch
            i += 1
            buf = []
            while i < n:
                c = raw[i]
                if c == "\\" and quote != "`":
                    buf.append(raw[i + 1] if i + 1 < n else "")
                    i += 2
                    continue
                if c == quote:
                    break
                buf.append(c)
                i += 1
            i += 1
            text = "".join(buf)
            # on ignore les identifiants techniques isolés (ex. 'about', 'ai')
            if len(text) >= 25 and " " in text:
                out.append(text)
        else:
            i += 1
    return out


def identity_nested_value(parent: str, key: str) -> str | None:
    """Resolve a direct string field such as MASTER_IDENTITY.ia.seoTitle."""
    src = read(ROOT / "src" / "data" / "identity.ts")
    parent_match = re.search(
        rf"^  {re.escape(parent)}:\s*\{{(.*?)(?=^  [A-Za-z_]\w*:\s|\Z)",
        src,
        re.MULTILINE | re.DOTALL,
    )
    if not parent_match:
        return None
    key_match = re.search(
        rf"^    {re.escape(key)}:\s*(.*?)(?=^    [A-Za-z_]\w*:\s|\Z)",
        parent_match.group(1),
        re.MULTILINE | re.DOTALL,
    )
    if not key_match:
        return None
    literals = scan_string_literals(key_match.group(1))
    return max(literals, key=len) if literals else None


def identity_value(key: str) -> str | None:
    """Resolve exported IDENTITY fields from their canonical source values."""
    alias_paths = {
        "seoTitle": ("positionnement", "seoTitle"),
        "metaDescription": ("positionnement", "metaDescription"),
    }
    path = alias_paths.get(key)
    if path:
        return identity_nested_value(*path)
    return IDENTITY_VALUES.get(key)


def clean(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


SCHEMA_LABELS = {
    "personSchema": "Person",
    "websiteSchema": "WebSite",
    "organizationSchema": "Organization",
    "musicGroupSchema": "MusicGroup",
    "breadcrumbSchema": "BreadcrumbList",
    "serviceSchema": "Service",
    "courseSchema": "Course",
    "eventSchema": "Event",
    "articleSchema": "Article",
    "faqSchema": "FAQPage",
    "creativeWorkSchema": "CreativeWork / Book",
}


def schemas_used(src: str) -> list[str]:
    found: list[str] = []
    for key, label in SCHEMA_LABELS.items():
        if f"{key}(" in src or f"{key}," in src or f"{key}]" in src:
            if label not in found:
                found.append(label)
    return found


def count_h1(page_path: Path, src: str) -> tuple[int, str]:
    """Détermine le nombre de H1 rendus et leur origine."""
    count = 0
    source = "aucune"
    if "<h1" in src:
        count += len(re.findall(r"<h1[ >]", src))
        source = "balise <h1>"
    if "PageHero" in src and "from '../components/PageHero'" in src:
        if "<PageHero" in src:
            count += len(re.findall(r"<PageHero", src))
            source = "PageHero (h1 interne)" if count else source
    if 'as="h1"' in src:
        count += len(re.findall(r'as="h1"', src))
        source = "Display as=\"h1\""
    return count, source


def identity_literals() -> dict[str, str]:
    """Lit les valeurs de src/data/identity.ts pour les résoudre dans les pages.

    On découpe le fichier clé par clé puis on applique le scanner de littéraux :
    une simple expression régulière casserait sur l'apostrophe de « l'IA ».
    """
    src = read(ROOT / "src" / "data" / "identity.ts")
    out: dict[str, str] = {}
    keys = list(re.finditer(r"^\s{2,}(\w+):", src, re.MULTILINE))
    for i, m in enumerate(keys):
        end = keys[i + 1].start() if i + 1 < len(keys) else len(src)
        window = src[m.end():end]
        literals = scan_string_literals(window)
        if literals:
            out[m.group(1)] = max(literals, key=len)
    return out


IDENTITY_VALUES = identity_literals()

def routes_from_app(src: str) -> set[str]:
    return set(re.findall(r'path="([^"]+)"', src))


def route_is_known(target: str, routes: set[str]) -> bool:
    if target.startswith(("#", "http", "mailto", "tel")):
        return True
    base = target.split("#")[0].split("?")[0]
    if not base:
        return True
    if base in routes:
        return True
    # routes dynamiques : /journal/:slug
    for r in routes:
        if ":" in r:
            prefix = r.split(":")[0]
            if base.startswith(prefix):
                return True
    return False


# --------------------------------------------------------------------------- #
# Analyse
# --------------------------------------------------------------------------- #
def main() -> int:
    route_src = read(ROOT / "src" / "App.tsx")
    routes = routes_from_app(route_src)

    sitemap = read(ROOT / "public" / "sitemap.xml")
    sitemap_paths = {
        re.sub(r"^https?://[^/]+", "", loc) or "/"
        for loc in re.findall(r"<loc>([^<]+)</loc>", sitemap)
    }

    rows = []
    issues: list[str] = []
    broken_links: list[str] = []
    img_without_alt = 0
    img_total = 0
    all_src = ""

    for page in PAGES:
        src = read(page)
        all_src += src
        seo = extract_use_seo(src)
        title = clean(seo.get("title", ""))
        desc = clean(seo.get("description", ""))
        h1_count, h1_source = count_h1(page, src)
        schemas = schemas_used(src)

        name = page.stem
        dynamic = False
        row = {
            "page": name,
            "title": title,
            "tlen": len(re.sub(r"\s*\(valeur dynamique\)$", "", title)),
            "desc": desc,
            "dlen": len(re.sub(r"\s*\(valeur dynamique\)$", "", desc)),
            "h1": h1_count,
            "h1_source": h1_source,
            "schemas": schemas,
            "dynamic": dynamic,
        }
        rows.append(row)

        if title.endswith("(valeur dynamique)"):
            row["dynamic"] = True

        if not title:
            issues.append(f"**{name}** — aucun titre SEO détecté.")
        elif row["dynamic"]:
            pass
        elif row["tlen"] > TITLE_MAX:
            issues.append(
                f"**{name}** — titre SEO trop long ({row['tlen']} caractères, cible ≤ {TITLE_MAX}) : « {title} »"
            )
        elif row["tlen"] < TITLE_MIN:
            issues.append(
                f"**{name}** — titre SEO court ({row['tlen']} caractères, cible ≥ {TITLE_MIN})."
            )

        if not desc:
            issues.append(f"**{name}** — aucune description SEO détectée.")
        elif row["dynamic"]:
            pass
        elif row["dlen"] > DESC_MAX:
            issues.append(
                f"**{name}** — description trop longue ({row['dlen']} caractères, cible ≤ {DESC_MAX})."
            )
        elif row["dlen"] < DESC_MIN:
            issues.append(
                f"**{name}** — description courte ({row['dlen']} caractères, cible ≥ {DESC_MIN})."
            )

        if h1_count == 0:
            issues.append(f"**{name}** — aucun H1 rendu (page sans titre principal).")
        elif h1_count > 1:
            issues.append(f"**{name}** — {h1_count} H1 rendus (un seul attendu).")

        # liens internes
        for target in set(re.findall(r'to="(/[^"]*)"', src)):
            if not route_is_known(target, routes):
                broken_links.append(f"`{target}` → depuis {name}")

        # images
        img_total += len(re.findall(r"<img", src))
        img_without_alt += len(
            [m for m in re.finditer(r"<img(?![^>]*\balt=)[^>]*>", src)]
        )

    # liens internes des composants et des données
    for extra in [
        ROOT / "src" / "components" / "Footer.tsx",
        ROOT / "src" / "components" / "Header.tsx",
        ROOT / "src" / "components" / "ui.tsx",
        ROOT / "src" / "data" / "site.ts",
        ROOT / "src" / "data" / "projects.ts",
    ]:
        src = read(extra)
        for target in set(re.findall(r"to:\s*'(/[^']*)'", src)) | set(
            re.findall(r'to="(/[^"]*)"', src)
        ):
            if not route_is_known(target, routes):
                broken_links.append(f"`{target}` → depuis {extra.name}")

    # placeholders résiduels visibles (pas les aides de saisie ni les commentaires)
    placeholders = []
    placeholder_patterns = ("à confirmer", "emplacement réservé", "réservé à", "à collecter", "todo")
    for f in PAGES + DATA:
        for i, line in enumerate(read(f).splitlines(), 1):
            stripped = line.lstrip()
            if stripped.startswith(("//", "/*", "*")):
                continue
            if any(pattern in line.lower() for pattern in placeholder_patterns):
                placeholders.append(f"{f.relative_to(ROOT)}:{i} — {line.strip()[:110]}")

    # éléments à confirmer
    to_confirm = []
    id_src = read(ROOT / "src" / "data" / "identity.ts")
    for m in re.finditer(
        r"question:\s*\n?\s*[\"'](.*?)[\"'],\s*\n\s*usedIn:\s*[\"'](.*?)[\"'],",
        id_src,
        re.DOTALL,
    ):
        to_confirm.append((clean(m.group(1)), clean(m.group(2))))

    # cohérence routes ⇄ sitemap (les routes privées exclues du sitemap)
    PRIVATE_ROUTES = {"/admin"}
    missing_in_sitemap = sorted(
        r for r in routes if r != "*" and ":" not in r and r not in sitemap_paths and r not in PRIVATE_ROUTES
    )
    orphan_in_sitemap = sorted(p for p in sitemap_paths if not route_is_known(p, routes))

    # ----------------------------------------------------------------------- #
    # Rapport
    # ----------------------------------------------------------------------- #
    lines: list[str] = []
    add = lines.append

    add("# Audit éditorial et technique — hervenanfang.vercel.app")
    add("")
    add(f"*Généré le {date.today().strftime('%d/%m/%Y')} par `npm run audit`.*")
    add("")
    add("Cet audit analyse la **source** du site : il est reproductible après chaque modification.")
    add("")
    add("## 1. Synthèse")
    add("")
    add("| Contrôle | Résultat |")
    add("|---|---|")
    add(f"| Pages analysées | {len(rows)} |")
    add(f"| Titres SEO hors cible | {sum(1 for r in rows if not r.get('dynamic') and (r['tlen'] > TITLE_MAX or r['tlen'] < TITLE_MIN))} |")
    add(f"| Titres tronqués dans Google (> {TITLE_VISIBLE} car.) | {sum(1 for r in rows if TITLE_VISIBLE < r['tlen'] <= TITLE_MAX)} |")
    add(f"| Descriptions hors cible | {sum(1 for r in rows if not r.get('dynamic') and (r['dlen'] > DESC_MAX or r['dlen'] < DESC_MIN))} |")
    add(f"| Pages sans H1 unique | {sum(1 for r in rows if r['h1'] != 1)} |")
    add(f"| Liens internes cassés | {len(set(broken_links))} |")
    add(f"| Images sans `alt` | {img_without_alt} sur {img_total} |")
    add(f"| Routes absentes du sitemap | {len(missing_in_sitemap)} |")
    add(f"| URL du sitemap sans route | {len(orphan_in_sitemap)} |")
    add(f"| Éléments factuels à confirmer | {len(to_confirm)} |")
    add("")

    add("## 2. Métadonnées par page")
    add("")
    add("| Page | Titre SEO | Long. | Description | Long. | H1 | Données structurées |")
    add("|---|---|---|---|---|---|---|")
    for r in rows:
        tflag = ""
        if not r.get("dynamic"):
            if r["tlen"] > TITLE_MAX or r["tlen"] < TITLE_MIN:
                tflag = " ⚠️"
            elif r["tlen"] > TITLE_VISIBLE:
                tflag = " ✂️ tronqué dans Google"
        dflag = "" if r.get("dynamic") else (" ⚠️" if r["dlen"] > DESC_MAX or r["dlen"] < DESC_MIN else "")
        schemas = ", ".join(r["schemas"]) or "—"
        add(
            f"| `{r['page']}` | {r['title'] or '—'}{tflag} | {r['tlen']} | "
            f"{(r['desc'][:70] + '…') if len(r['desc']) > 70 else (r['desc'] or '—')}{dflag} | "
            f"{r['dlen']} | {r['h1']} ({r['h1_source']}) | {schemas} |"
        )
    add("")

    add("## 3. Corrections à apporter")
    add("")
    if issues:
        for i in issues:
            add(f"- {i}")
    else:
        add("- ✅ Aucune anomalie détectée sur les métadonnées et la structure des titres.")
    add("")

    add("## 4. Liens internes")
    add("")
    if broken_links:
        add("Cibles introuvables dans le routeur :")
        add("")
        for b in sorted(set(broken_links)):
            add(f"- {b}")
    else:
        add("- ✅ Tous les liens internes pointent vers une route existante.")
    add("")

    add("## 5. Sitemap")
    add("")
    add(f"- Routes du routeur absentes du sitemap : {', '.join('`'+r+'`' for r in missing_in_sitemap) or 'aucune ✅'}")
    add(f"- URL du sitemap sans route correspondante : {', '.join('`'+p+'`' for p in orphan_in_sitemap) or 'aucune ✅'}")
    add("")

    add("## 6. Contenus génériques résiduels")
    add("")
    if placeholders:
        add("Éléments encore génériques ou provisoires, à remplacer par les contenus réels :")
        add("")
        for p in placeholders:
            add(f"- {p}")
    else:
        add("- ✅ Aucun résidu détecté.")
    add("")

    add("## 7. Éléments factuels à confirmer par Hervé Nanfang")
    add("")
    add("> Rien n'est inventé : toute information vérifiable manquante est listée ici plutôt que devinée.")
    add("")
    add("| # | À fournir | Utilisé dans |")
    add("|---|---|---|")
    for i, (q, used) in enumerate(to_confirm, 1):
        add(f"| {i} | {q} | {used} |")
    add("")

    add("## 8. Identité numérique — rappel de cohérence")
    add("")
    add("La description de référence et les biographies de trois longueurs sont définies dans")
    add("`src/data/identity.ts`. Elles doivent être reprises **à l'identique** sur :")
    add("")
    add("- le site (accueil, à propos, contact, presse) ;")
    add("- YouTube (à propos de la chaîne) ;")
    add("- LinkedIn (titre + résumé) ;")
    add("- Facebook et Instagram (bio) ;")
    add("- tout dossier de presse, annuaire professionnel, présentation d'intervenant.")
    add("")
    add("Le portrait principal doit également être identique sur tous ces supports :")
    add("c'est lui qui construit la reconnaissance visuelle de la marque.")
    add("")

    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"Rapport écrit : {OUT.relative_to(ROOT)}")
    print(
        f"  titre hors cible : {sum(1 for r in rows if not r.get('dynamic') and (r['tlen'] > TITLE_MAX or r['tlen'] < TITLE_MIN))} | "
        f"description hors cible : {sum(1 for r in rows if not r.get('dynamic') and (r['dlen'] > DESC_MAX or r['dlen'] < DESC_MIN))} | "
        f"H1 non unique : {sum(1 for r in rows if r['h1'] != 1)} | "
        f"liens cassés : {len(set(broken_links))} | "
        f"sitemap : {len(missing_in_sitemap)} manquante(s), {len(orphan_in_sitemap)} orpheline(s)"
    )
    for i in issues:
        print("  ⚠️ ", re.sub(r"\*\*|`", "", i))
    for b in sorted(set(broken_links)):
        print("  🔗 ", b)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
