#!/usr/bin/env python3
"""
build_cv_html.py
Generates self-contained HTML files for Hervé Nanfang's CV (Master + 3 targeted variants)
with inlined CSS and embedded SVG / image assets for 100% reliable Chromium PDF rendering.
"""

import os
import base64

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMPLATE_PATH = os.path.join(BASE_DIR, "templates", "cv_template.html")
CSS_PATH = os.path.join(BASE_DIR, "styles", "cv.css")
SOUNDWAVE_PATH = os.path.join(BASE_DIR, "assets", "soundwave.svg")
PHOTO_PATH = os.path.join(BASE_DIR, "assets", "candidate_photo.png")

VARIANTS = {
    "Master_International": {
        "page_title": "International Resume (Master 2-Pages)",
        "headline_role": "Musicologist · Sound Engineer · Music Producer · AI Specialist",
        "headline_subline": "AI Applications · Music Technology · Audio Evaluation · Music Data · MAO · Education",
        "kicker": "INTERNATIONAL RESUME · MUSIC × AUDIO × EDUCATION × DIGITAL",
        "page2_badge": "INTERNATIONAL MASTER RESUME · 2 PAGES",
        "profile_p1": "Musicologist, sound engineer, music producer, and curriculum architect with 15+ years of multidisciplinary expertise spanning higher education, computer-assisted music (MAO), critical acoustic evaluation, and professional stage performance.",
        "profile_p2": "Combines a rare synergy of academic musicological rigor, acute studio-honed listening, and structured curriculum engineering. Actively applies deep musical taxonomy and signal-flow expertise to AI audio evaluation, dataset annotation, and high-fidelity audio quality assessment.",
        "vp_title": "AI & AUDIO VALUE PROPOSITION",
        "vp_body": "Provides specialized human-in-the-loop audio critique bridging acoustic physics, musical theory, and algorithmic output. Assesses prompt adherence, spectral balance, harmonic coherence, and timbral nuance with objective precision.",
        "vp_tags": ["AI Audio Evaluation", "Music Data QA", "Critical Listening", "MAO Workflows", "Acoustic Taxonomy", "Higher Education"]
    },
    "AI_Audio_MusicData": {
        "page_title": "AI Audio Evaluation & Music Data Specialist",
        "headline_role": "AI Audio Specialist · Music Data Annotator · Sound Quality Evaluator",
        "headline_subline": "Audio Evaluation · Generative AI Audio QA · Acoustic Annotation · Musicology · MAO",
        "kicker": "SPECIALIZED PROFILE · ARTIFICIAL INTELLIGENCE × AUDIO EVALUATION × MUSIC DATA",
        "page2_badge": "SPECIALIZED VARIANT: AI AUDIO & MUSIC DATA",
        "profile_p1": "Audio evaluation specialist and musicologist leveraging 15+ years of critical listening, sound engineering, and musical taxonomy to deliver rigorous human-in-the-loop evaluation for generative audio, speech, and music models.",
        "profile_p2": "Expert in acoustic artifact identification, prompt-to-audio fidelity scoring, multi-genre classification, and structured metadata annotation. Transforms subjective auditory impressions into repeatable, standardized evaluation metrics for AI research teams.",
        "vp_title": "HUMAN-IN-THE-LOOP AI VALUE PROPOSITION",
        "vp_body": "Delivers expert-level auditory discrimination: diagnosing phase anomalies, spectral smearing, rhythmic drift, and harmonic incoherence in AI-generated stems. Bridges musical semantics and acoustic data validation.",
        "vp_tags": ["Prompt-to-Audio QA", "Audio Classification", "Spectral Artifact Detection", "Music Data Curation", "Taxonomy Architecture", "Critical Ear QA"]
    },
    "Sound_Engineer_Producer": {
        "page_title": "Sound Engineer, Music Producer & Audio Specialist",
        "headline_role": "Sound Engineer · Music Producer · MAO & Audio Specialist",
        "headline_subline": "Studio Tracking · Multitrack Mixing · Audio Restoration · Live Sound · Digital Orchestration",
        "kicker": "SPECIALIZED PROFILE · SOUND ENGINEERING × MUSIC PRODUCTION × MAO",
        "page2_badge": "SPECIALIZED VARIANT: SOUND ENGINEERING & PRODUCTION",
        "profile_p1": "Accomplished sound engineer, music producer, and audio specialist with 15+ years of hands-on experience in tracking, multitrack mixing, acoustic calibration, vocal production, and live stage sound reinforcement.",
        "profile_p2": "Master of major DAW ecosystems (Cubase, Pro Tools, Logic, FL Studio, Reaper), signal routing, gain staging, dynamic control, and audio restoration. Proven track record directing studio sessions, coordinating cultural events, and delivering high-impact acoustic quality.",
        "vp_title": "AUDIO PRODUCTION & SOUND VALUE PROPOSITION",
        "vp_body": "End-to-end sound engineering excellence: combining technical mastery of acoustic signal flow with refined musical sensibilities to produce pristine recordings, balanced mixes, and flawless live acoustic reinforcement.",
        "vp_tags": ["Multitrack Mixing", "Studio Recording", "Live Sound Reinforcement", "Audio Restoration", "DAW / MAO Systems", "Signal Flow & Gain Staging"]
    },
    "Musicologist_Educator": {
        "page_title": "Musicologist, Higher-Ed Lecturer & Curriculum Architect",
        "headline_role": "Musicologist · Higher-Ed Lecturer · Curriculum Architect",
        "headline_subline": "Music Theory & Analysis · MAO Pedagogy · Sequential Learning Systems · Cultural Heritage",
        "kicker": "SPECIALIZED PROFILE · MUSICOLOGY × HIGHER EDUCATION × PEDAGOGY",
        "page2_badge": "SPECIALIZED VARIANT: MUSICOLOGY & HIGHER EDUCATION",
        "profile_p1": "Musicologist, higher education lecturer (ESAS), and curriculum architect (RMA) with 15+ years of experience structuring comprehensive musical education systems, auditory training methodologies, and academic courses.",
        "profile_p2": "Specialized in musicology applied to visual media, computer-assisted music (MAO), harmonic analysis, and cultural heritage documentation. Renowned for converting complex musicological and acoustic theories into accessible, competency-based learning curricula.",
        "vp_title": "ACADEMIC & PEDAGOGICAL VALUE PROPOSITION",
        "vp_body": "Pioneers competency-based pedagogical engineering in music and audio technology. Synthesizes classical music analysis, ear-training rigor, and digital workflows to empower the next generation of music and sound professionals.",
        "vp_tags": ["Curriculum Architecture", "Higher-Ed Lecturing", "Score & Harmonic Analysis", "Ear-Training Systems", "MAO Pedagogy", "Heritage Documentation"]
    }
}

def build_html_variants():
    os.makedirs(os.path.join(BASE_DIR, "dist", "html"), exist_ok=True)
    
    with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
        template = f.read()

    # Load CSS to inline
    css_content = ""
    if os.path.exists(CSS_PATH):
        with open(CSS_PATH, "r", encoding="utf-8") as f:
            css_content = f.read()

    # Load soundwave SVG
    soundwave_svg = ""
    if os.path.exists(SOUNDWAVE_PATH):
        with open(SOUNDWAVE_PATH, "r", encoding="utf-8") as f:
            soundwave_svg = f.read()

    # Encode candidate photo as base64 data URI
    photo_data_uri = ""
    if os.path.exists(PHOTO_PATH):
        with open(PHOTO_PATH, "rb") as f:
            b64_data = base64.b64encode(f.read()).decode("ascii")
            photo_data_uri = f"data:image/png;base64,{b64_data}"
    else:
        photo_data_uri = "../assets/candidate_photo.png"

    # Replace CSS link with inline style tag
    template = template.replace('<link rel="stylesheet" href="../styles/cv.css">', f"<style>\n{css_content}\n</style>")

    generated_files = []

    for key, data in VARIANTS.items():
        html = template
        html = html.replace("{{CANDIDATE_NAME}}", "Hervé Nanfang")
        html = html.replace("{{PAGE_TITLE}}", data["page_title"])
        html = html.replace("{{KICKER_TEXT}}", data["kicker"])
        html = html.replace("{{NAME_HTML}}", 'Hervé <span>NANFANG</span>')
        html = html.replace("{{HEADLINE_ROLE}}", data["headline_role"])
        html = html.replace("{{HEADLINE_SUBLINE}}", data["headline_subline"])
        html = html.replace("{{LOCATION_TEXT}}", "Yaoundé, Cameroon | Remote · International Collaboration")
        
        # Contacts
        html = html.replace("{{CONTACT_EMAIL}}", "hervenanfang@gmail.com")
        html = html.replace("{{CONTACT_PHONE}}", "+237 682 180 266 / +237 694 723 492")
        html = html.replace("{{CONTACT_LINKEDIN}}", "linkedin.com/in/herve-nanfang")
        html = html.replace("{{CONTACT_PORTFOLIO}}", "https://canva.link/2l6atbuzkax2k6g")
        html = html.replace("{{CONTACT_PORTFOLIO_SHORT}}", "canva.link/2l6atbuzkax2k6g")
        html = html.replace("{{PHOTO_SRC}}", photo_data_uri)

        # Profile
        profile_html = f"<p>{data['profile_p1']}</p><p>{data['profile_p2']}</p>"
        html = html.replace("{{PROFILE_TEXT_HTML}}", profile_html)

        # Value Proposition
        html = html.replace("{{VP_TITLE}}", data["vp_title"])
        html = html.replace("{{VP_BODY_HTML}}", f"<p>{data['vp_body']}</p>")
        
        tags_html = "".join([f'<span class="vp-tag">{tag}</span>' for tag in data["vp_tags"]])
        html = html.replace("{{VP_TAGS_HTML}}", tags_html)

        # Soundwave & Badge
        html = html.replace("{{SOUNDWAVE_SVG_INLINE}}", soundwave_svg)
        html = html.replace("{{PAGE2_BADGE}}", data["page2_badge"])

        out_path = os.path.join(BASE_DIR, "dist", "html", f"cv_{key.lower()}.html")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f" -> Generated self-contained HTML: {out_path}")
        generated_files.append((key, out_path))

    return generated_files

if __name__ == "__main__":
    build_html_variants()
