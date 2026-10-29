#!/usr/bin/env python3
"""
format_article.py
Processes Markdown drafts from articles_hub/drafts/ and generates:
1. Multi-platform ready version for Medium / Substack / Hugging Face
   (in English, with SEO metadata and standard author bio).
2. LinkedIn Hook Post (bilingual FR + EN) with 3 key takeaways and CTA.
"""

import os
import sys
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DRAFTS_DIR = os.path.join(BASE_DIR, "articles_hub", "drafts")
FORMATTED_DIR = os.path.join(BASE_DIR, "articles_hub", "formatted")

AUTHOR_BIO_EN = """---
### About the Author
**Hervé Nanfang** is a Musicologist, Senior Sound Engineer, Music Producer, and AI Specialist based in Yaoundé, Cameroon, collaborating globally. Holding a Master II in Musicology Applied to Visual Media and higher qualifications in Sound Engineering, he combines 15+ years of studio mixing, stage performance, and higher education lecturing (ESAS) with specialized research in AI audio evaluation, music dataset taxonomy, and human-in-the-loop acoustic validation.
- **Website & Portfolio**: [hervenanfang.vercel.app](https://hervenanfang.vercel.app/)
- **LinkedIn**: [linkedin.com/in/herve-nanfang-317bb2b1](https://www.linkedin.com/in/herve-nanfang-317bb2b1/)
- **Email**: hervenanfang@gmail.com
"""

AUTHOR_BIO_FR = """---
### À propos de l'auteur
**Hervé Nanfang** est musicologue, ingénieur du son senior, producteur de musique et spécialiste de l'IA basé à Yaoundé (Cameroun) avec une pratique internationale. Titulaire d'un Master II en musicologie appliquée aux médias visuels et diplômé en ingénierie du son, il allie 15+ ans de pratique studio, de performance scénique et d'enseignement supérieur (ESAS) à des travaux de pointe en évaluation qualitative d'IA audio, curation de données musicales et écoute critique human-in-the-loop.
- **Site & Portfolio** : [hervenanfang.vercel.app](https://hervenanfang.vercel.app/)
- **LinkedIn** : [linkedin.com/in/herve-nanfang-317bb2b1](https://www.linkedin.com/in/herve-nanfang-317bb2b1/)
- **Contact** : hervenanfang@gmail.com
"""

def extract_metadata(content):
    title = "Untitled Article"
    subtitle = ""
    tags = []
    
    # Check YAML frontmatter if present
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            fm = parts[1]
            body = parts[2].strip()
            for line in fm.split("\n"):
                if line.startswith("title:"):
                    title = line.replace("title:", "").strip().strip('"').strip("'")
                elif line.startswith("subtitle:"):
                    subtitle = line.replace("subtitle:", "").strip().strip('"').strip("'")
                elif line.startswith("tags:"):
                    tags = [t.strip() for t in line.replace("tags:", "").strip(" []").split(",")]
            return title, subtitle, tags, body

    # Fallback to first H1
    lines = content.split("\n")
    body_lines = []
    for line in lines:
        if line.startswith("# ") and title == "Untitled Article":
            title = line.replace("# ", "").strip()
        else:
            body_lines.append(line)
    return title, subtitle, tags, "\n".join(body_lines).strip()

def format_draft(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    base_name = os.path.splitext(os.path.basename(file_path))[0]
    title, subtitle, tags, body = extract_metadata(content)
    
    if not tags:
        tags = ["MusicTech", "AudioEngineering", "AIinMusic", "Musicology", "SoundQuality"]

    # 1. Medium / Substack / Hugging Face English version
    medium_content = f"""# {title}
{f'*{subtitle}*' if subtitle else ''}

> **Keywords**: {', '.join(tags)}  
> **Author**: Hervé Nanfang — Musicologist · Sound Engineer · AI Specialist  
> **Original Canonical URL**: https://hervenanfang.vercel.app/journal/{base_name}

---

{body}

{AUTHOR_BIO_EN}
"""
    med_path = os.path.join(FORMATTED_DIR, f"{base_name}_medium_substack_hf.md")
    with open(med_path, "w", encoding="utf-8") as f:
        f.write(medium_content)
    print(f" -> Generated Medium/Substack/HF version: {med_path}")

    # 2. LinkedIn Hook Post (FR + EN)
    # Extract 3 bullet points from body or synthesize
    bullets = re.findall(r"^[*-]\s*(.+)$", body, re.MULTILINE)
    p1 = bullets[0] if len(bullets) > 0 else "Bridging acoustic physics and generative audio models with objective critical listening."
    p2 = bullets[1] if len(bullets) > 1 else "Detecting subtle spectral artifacts, phase anomalies, and harmonic inconsistencies in AI stems."
    p3 = bullets[2] if len(bullets) > 2 else "Structuring musicological taxonomies for repeatable, high-standard dataset annotation."

    linkedin_content = f"""# POSTS D'ACCROCHE LINKEDIN — {title.upper()}

================================================================================
VERSION EN FRANÇAIS (LinkedIn FR)
================================================================================
🎵 Pourquoi l'évaluation de l'IA Audio exige-t-elle l'oreille conjointe du musicologue et de l'ingénieur du son ?

À l'heure où les modèles génératifs audio progressent à pas de géant, les métriques automatisées ne suffisent plus à garantir la fidélité acoustique et la cohérence musicale.

Voici 3 points clés issus de mon analyse de terrain :

1️⃣ {p1}
2️⃣ {p2}
3️⃣ {p3}

💡 En tant que musicologue et ingénieur du son en exercice depuis plus de 15 ans, je constate quotidiennement que la sensibilité humaine et la rigueur taxonomique restent le maillon indispensable de la validation qualitative des modèles (Human-in-the-Loop QA).

👉 Découvrez l'analyse complète sur mon site : https://hervenanfang.vercel.app/
💬 Qu'observez-vous de votre côté sur la qualité des stems et des générations actuelles ? Échangeons en commentaires !

#MusicTech #AudioEngineering #AIinMusic #Musicologie #IngenierieduSon #Acoustique #HerveNanfang

================================================================================
ENGLISH VERSION (LinkedIn Global / International)
================================================================================
🎧 Why Generative Audio Models Urgently Need the Trained Ear of a Musicologist & Sound Engineer

Automated benchmark scores only tell half the story. When evaluating high-fidelity music generation, deep musical theory and acoustic discipline make the ultimate difference.

Here are 3 critical takeaways from my practical evaluation framework:

1️⃣ {p1}
2️⃣ {p2}
3️⃣ {p3}

💡 Over 15+ years across studio mixing, DAW orchestration, and higher education, I've observed that true acoustic fidelity is won in the micro-details: phase smearing, harmonic density, and stylistic prompt adherence.

👉 Read the full breakdown here: https://hervenanfang.vercel.app/
💬 How are you addressing audio quality validation in your workflows? Let's discuss below!

#MusicTech #AudioEvaluation #SoundEngineering #Musicology #GenerativeAudio #HumanInTheLoop #HerveNanfang
"""
    li_path = os.path.join(FORMATTED_DIR, f"{base_name}_linkedin_post.md")
    with open(li_path, "w", encoding="utf-8") as f:
        f.write(linkedin_content)
    print(f" -> Generated LinkedIn Hook version: {li_path}")

def format_all_drafts():
    os.makedirs(FORMATTED_DIR, exist_ok=True)
    if not os.path.exists(DRAFTS_DIR):
        os.makedirs(DRAFTS_DIR, exist_ok=True)
        return

    draft_files = [f for f in os.listdir(DRAFTS_DIR) if f.endswith(".md")]
    if not draft_files:
        print(f"No drafts found in {DRAFTS_DIR}.")
        return

    for draft in draft_files:
        full_path = os.path.join(DRAFTS_DIR, draft)
        print(f"Processing draft: {draft}...")
        format_draft(full_path)

if __name__ == "__main__":
    format_all_drafts()
