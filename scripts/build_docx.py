#!/usr/bin/env python3
"""
build_docx.py
Generates the fully editable Word version (dist/Herve_Nanfang_CV_Editable.docx)
Strictly respecting typography minimums:
- 11pt body text
- 10pt table / sidebar text
- Professional palette: Dark Charcoal #111318, Gold #C9A227, Warm Light Gray #EFEDE7
"""

import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DOCX = os.path.join(BASE_DIR, "dist", "Herve_Nanfang_CV_Editable.docx")

# Colors
C_DARK = RGBColor(17, 19, 24)        # #111318
C_GOLD = "C9A227"                    # #C9A227
C_GOLD_RGB = RGBColor(201, 162, 39)
C_BRONZE_RGB = RGBColor(128, 107, 50)
C_MUTED_RGB = RGBColor(74, 77, 84)
C_BG_CARD = "EFEDE7"
C_BG_DARK = "111318"
C_WHITE = RGBColor(245, 243, 238)

def set_cell_background(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = tcPr.find(qn('w:shd'))
    if shd is None:
        shd = OxmlElement('w:shd')
        tcPr.append(shd)
    shd.set(qn('w:fill'), hex_color)

def set_cell_margins(cell, top=140, start=160, bottom=140, end=160):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = tcPr.first_child_found_in('w:tcMar')
    if tcMar is None:
        tcMar = OxmlElement('w:tcMar')
        tcPr.append(tcMar)
    for m, v in [('top', top), ('left', start), ('bottom', bottom), ('right', end)]:
        node = tcMar.find(qn(f'w:{m}'))
        if node is None:
            node = OxmlElement(f'w:{m}')
            tcMar.append(node)
        node.set(qn('w:w'), str(v))
        node.set(qn('w:type'), 'dxa')

def set_cell_left_border_gold(cell, sz="24"):
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = tcPr.first_child_found_in('w:tcBorders')
    if tcBorders is None:
        tcBorders = OxmlElement('w:tcBorders')
        tcPr.append(tcBorders)
    left = OxmlElement('w:left')
    left.set(qn('w:val'), 'single')
    left.set(qn('w:sz'), sz)
    left.set(qn('w:space'), '0')
    left.set(qn('w:color'), C_GOLD)
    tcBorders.append(left)

def create_editable_docx():
    os.makedirs(os.path.dirname(OUT_DOCX), exist_ok=True)
    doc = Document()
    
    # Page setup: Standard A4 with 0.5 in margins
    for sec in doc.sections:
        sec.top_margin = Inches(0.5)
        sec.bottom_margin = Inches(0.5)
        sec.left_margin = Inches(0.55)
        sec.right_margin = Inches(0.55)

    # Base typography: Aptos / Arial
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Arial'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = C_DARK

    # --- HEADER SECTION ---
    p_kicker = doc.add_paragraph()
    p_kicker.paragraph_format.space_before = Pt(0)
    p_kicker.paragraph_format.space_after = Pt(2)
    r_k = p_kicker.add_run("INTERNATIONAL RESUME · MUSIC × AUDIO × EDUCATION × DIGITAL")
    r_k.font.size = Pt(10)
    r_k.font.bold = True
    r_k.font.color.rgb = C_BRONZE_RGB

    p_name = doc.add_paragraph()
    p_name.paragraph_format.space_before = Pt(0)
    p_name.paragraph_format.space_after = Pt(2)
    r_n1 = p_name.add_run("HERVÉ ")
    r_n1.font.size = Pt(22)
    r_n1.font.bold = True
    r_n1.font.color.rgb = C_DARK
    r_n2 = p_name.add_run("NANFANG")
    r_n2.font.size = Pt(22)
    r_n2.font.bold = True
    r_n2.font.color.rgb = C_GOLD_RGB

    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(2)
    r_t = p_title.add_run("Musicologist · Sound Engineer · Music Producer · AI Specialist")
    r_t.font.size = Pt(12)
    r_t.font.bold = True
    r_t.font.color.rgb = C_DARK

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(4)
    r_s = p_sub.add_run("AI Applications · Music Technology · Audio Evaluation · Music Data · MAO · Education")
    r_s.font.size = Pt(10.5)
    r_s.font.bold = True
    r_s.font.color.rgb = C_BRONZE_RGB

    p_loc = doc.add_paragraph()
    p_loc.paragraph_format.space_before = Pt(0)
    p_loc.paragraph_format.space_after = Pt(6)
    r_loc = p_loc.add_run("📍 Location: Yaoundé, Cameroon | Remote · International Collaboration")
    r_loc.font.size = Pt(10)
    r_loc.font.color.rgb = C_MUTED_RGB

    # Contact Table
    tbl_contact = doc.add_table(rows=2, cols=2)
    tbl_contact.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_contact.autofit = False

    contacts = [
        ("EMAIL:", " hervenanfang@gmail.com", "PHONE/WA:", " +237 682 180 266 / +237 694 723 492"),
        ("LINKEDIN:", " linkedin.com/in/herve-nanfang", "PORTFOLIO:", " https://canva.link/2l6atbuzkax2k6g")
    ]

    for row_idx, (k1, v1, k2, v2) in enumerate(contacts):
        c0 = tbl_contact.cell(row_idx, 0)
        c1 = tbl_contact.cell(row_idx, 1)
        set_cell_background(c0, C_BG_CARD)
        set_cell_background(c1, C_BG_CARD)
        set_cell_margins(c0, 60, 100, 60, 100)
        set_cell_margins(c1, 60, 100, 60, 100)
        
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_before = Pt(0); p0.paragraph_format.space_after = Pt(0)
        r1 = p0.add_run(k1); r1.font.bold = True; r1.font.size = Pt(10); r1.font.color.rgb = C_BRONZE_RGB
        r2 = p0.add_run(v1); r2.font.size = Pt(10)
        
        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_before = Pt(0); p1.paragraph_format.space_after = Pt(0)
        r3 = p1.add_run(k2); r3.font.bold = True; r3.font.size = Pt(10); r3.font.color.rgb = C_BRONZE_RGB
        r4 = p1.add_run(v2); r4.font.size = Pt(10)

    def add_section_heading(title_num, title_text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        r_num = p.add_run(f"{title_num} ")
        r_num.font.bold = True
        r_num.font.size = Pt(11.5)
        r_num.font.color.rgb = C_GOLD_RGB
        r_txt = p.add_run(title_text.upper())
        r_txt.font.bold = True
        r_txt.font.size = Pt(11.5)
        r_txt.font.color.rgb = C_DARK

    # --- 01 PROFESSIONAL PROFILE ---
    add_section_heading("01", "Professional Profile")
    p_prof1 = doc.add_paragraph()
    p_prof1.paragraph_format.space_before = Pt(0); p_prof1.paragraph_format.space_after = Pt(3); p_prof1.paragraph_format.line_spacing = 1.15
    r = p_prof1.add_run("Musicologist, sound engineer, music producer, and curriculum architect with 15+ years of multidisciplinary expertise spanning higher education lecturing, computer-assisted music (MAO), critical acoustic evaluation, and professional stage performance.")
    r.font.size = Pt(11)

    p_prof2 = doc.add_paragraph()
    p_prof2.paragraph_format.space_before = Pt(0); p_prof2.paragraph_format.space_after = Pt(6); p_prof2.paragraph_format.line_spacing = 1.15
    r = p_prof2.add_run("Combines a rare synergy of academic musicological rigor, acute studio-honed listening, and structured curriculum engineering. Actively applies deep musical taxonomy and signal-flow expertise to AI audio evaluation, dataset annotation, and high-fidelity audio quality assessment.")
    r.font.size = Pt(11)

    # --- 02 CORE EXPERTISE PILLARS ---
    add_section_heading("02", "Core Expertise Pillars")
    tbl_pillars = doc.add_table(rows=2, cols=2)
    tbl_pillars.alignment = WD_TABLE_ALIGNMENT.CENTER
    pillars = [
        ("AI & Music Data", "AI audio evaluation, dataset annotation, audio classification, critical acoustic assessment, human-in-the-loop QA."),
        ("Musicology & Analysis", "Score & harmonic analysis, ethnomusicology, music history, rhythm/tempo taxonomy, critical listening methodology."),
        ("Audio & Production", "Multitrack recording, studio & live mixing, signal flow, microphone techniques, DAW engineering, acoustic quality."),
        ("Education & MAO", "Curriculum architecture (RMA), higher-ed lecturing (ESAS), computer-assisted music (MAO), competency-based training.")
    ]
    for idx, (head, desc) in enumerate(pillars):
        r_idx = idx // 2
        c_idx = idx % 2
        c = tbl_pillars.cell(r_idx, c_idx)
        set_cell_background(c, C_BG_CARD)
        set_cell_left_border_gold(c, "18")
        set_cell_margins(c, 80, 120, 80, 120)
        p = c.paragraphs[0]
        p.paragraph_format.space_before = Pt(0); p.paragraph_format.space_after = Pt(2)
        rh = p.add_run(head + "\n"); rh.font.bold = True; rh.font.size = Pt(10.5); rh.font.color.rgb = C_DARK
        rd = p.add_run(desc); rd.font.size = Pt(10); rd.font.color.rgb = C_MUTED_RGB

    # --- 03 CORE COMPETENCIES & TECHNICAL DOMAINS ---
    add_section_heading("03", "Core Competencies & Technical Domains")
    competencies = [
        ("A. Artificial Intelligence & Digital Workflows", "AI audio evaluation, audio classification, prompt-to-audio fidelity assessment, dataset curation & annotation, taxonomy structuring, digital workflow integration."),
        ("B. Musicology & Musical Analysis", "Score & harmonic analysis, ethnomusicology, music history, rhythm/tempo/meter identification, acoustic timbre assessment, musical heritage documentation."),
        ("C. Audio Engineering & Sound Production", "Multitrack recording, studio & live mixing, microphone techniques, gain staging & signal flow, audio editing, critical acoustic listening & quality QA."),
        ("D. Music Technology & MAO", "DAW environments (Cubase, Pro Tools, Logic, FL Studio, Reaper), MIDI programming, synthesis, audio processing plug-ins, digital orchestration, hardware integration."),
        ("E. Education & Curriculum Development", "Curriculum architecture (RMA), competency-based training, pedagogical engineering, ear training systems, course material design, higher-ed lecturing (ESAS)."),
        ("F. Creative Production & Cultural Projects", "Artistic direction & coordination (A LAIZ PROD), stage performance & piano-bar delivery, musical arrangement, event programming, cross-cultural initiatives.")
    ]
    for cat_title, cat_desc in competencies:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2); p.paragraph_format.space_after = Pt(2)
        r_ct = p.add_run(f"• {cat_title}: ")
        r_ct.font.bold = True; r_ct.font.size = Pt(11); r_ct.font.color.rgb = C_DARK
        r_cd = p.add_run(cat_desc)
        r_cd.font.size = Pt(11); r_cd.font.color.rgb = C_MUTED_RGB

    # --- 04 PROFESSIONAL EXPERIENCE ---
    add_section_heading("04", "Professional Experience")
    experiences = [
        ("Lecturer in Musicology, MAO & Music Education", "ESAS — École Supérieure des Arts du Spectacle", "2022 — PRESENT", [
            "Delivers higher education lectures in musicology, computer-assisted music (MAO), and music applied to visual media.",
            "Designs syllabi and pedagogical engineering frameworks bridging classical music analysis, ear training, and modern DAW workflows.",
            "Supervises student audio productions, orchestration assignments, and digital composition portfolios."
        ]),
        ("Curriculum Architect & Music Education Lead", "Racines Musicales Academy® — RMA", "ONGOING", [
            "Architected the complete Music Education System, structuring sequential curricula for ear training, theory, and practical mastery.",
            "Designed progressive pedagogical materials converting complex musicological concepts into competency-based learning modules.",
            "Implemented standardized evaluation rubrics for auditory perception, instrumental fluency, and stylistic versatility."
        ]),
        ("Sound Engineer & Audio Production Specialist", "Sound Engineering · Audio Production Practice", "PROFESSIONAL PRACTICE", [
            "Leads studio tracking, multitrack mixing, audio restoration, vocal editing, and live acoustic reinforcement across diverse genres.",
            "Applies critical listening and acoustic QA to detect sonic artifacts, phase issues, balance anomalies, and spectral imbalances.",
            "Masters full DAW/MAO workflows, hardware signal routing, microphone placement techniques, and monitoring calibration."
        ]),
        ("Independent Music Producer & Artistic / Cultural Project Coordinator", "A LAIZ PROD", "ONGOING", [
            "Coordinates end-to-end music production, artistic direction, studio recording sessions, and creative development projects.",
            "Directs cultural event programming, cross-disciplinary collaborations, and sound design for visual media."
        ]),
        ("Higher Education & Professional Training Contributor — Music & Arts", "ISMA — Institut Supérieur des Métiers des Arts (Benin)", "BENIN", [
            "Contributed to academic and professional training modules in musicology, stage performance, and artistic project coordination.",
            "Conducted masterclasses on musical interpretation, sound quality standards, and creative industry workflows."
        ]),
        ("Professional Musician · Piano-Bar Performer · Composer & Arranger", "Independent / Live Performance", "2007 — PRESENT", [
            "17+ years of continuous live and piano-bar performance with simultaneous vocal interpretation and keyboard mastery.",
            "Broad international repertoire: jazz, blues, African varieties, French chanson, international pop standards, and Oriental pieces.",
            "Honed supreme critical listening, tempo stability, dynamic adaptability, and rapid harmonic analysis under live conditions."
        ])
    ]

    for role, org, period, bullets in experiences:
        p_hdr = doc.add_paragraph()
        p_hdr.paragraph_format.space_before = Pt(4); p_hdr.paragraph_format.space_after = Pt(1); p_hdr.paragraph_format.keep_with_next = True
        r_role = p_hdr.add_run(role); r_role.font.bold = True; r_role.font.size = Pt(11.5); r_role.font.color.rgb = C_DARK
        r_period = p_hdr.add_run(f"  |  {period}"); r_period.font.bold = True; r_period.font.size = Pt(10.5); r_period.font.color.rgb = C_GOLD_RGB

        p_org = doc.add_paragraph()
        p_org.paragraph_format.space_before = Pt(0); p_org.paragraph_format.space_after = Pt(2); p_org.paragraph_format.keep_with_next = True
        r_org = p_org.add_run(org); r_org.font.italic = True; r_org.font.size = Pt(10.5); r_org.font.color.rgb = C_BRONZE_RGB

        for b in bullets:
            p_b = doc.add_paragraph()
            p_b.paragraph_format.space_before = Pt(0); p_b.paragraph_format.space_after = Pt(1.5); p_b.paragraph_format.left_indent = Inches(0.2)
            rb = p_b.add_run(f"•  {b}"); rb.font.size = Pt(11)

    # --- 05 ADDITIONAL MANAGEMENT & CULTURAL CONSULTING ---
    add_section_heading("05", "Additional Management & Cultural Consulting Experience")
    mgmt = [
        ("Goethe-Institut Yaoundé", "Cultural Consulting & Project Support", "Provided consulting for bilateral cultural initiatives, artistic curation support, and workshop facilitation."),
        ("Ampaya Holding · Cotonou", "Event Management & Coordination", "Managed logistics, live event production, stage coordination, and technical team supervision for major corporate events."),
        ("Restaurant Clé · Cotonou", "Management & Operational Coordination", "Directed hospitality operations, musical programming, sound environment calibration, and operational staffing.")
    ]
    for org, role, desc in mgmt:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2); p.paragraph_format.space_after = Pt(2)
        r1 = p.add_run(f"• {org} — {role}: "); r1.font.bold = True; r1.font.size = Pt(10.5); r1.font.color.rgb = C_DARK
        r2 = p.add_run(desc); r2.font.size = Pt(10.5); r2.font.color.rgb = C_MUTED_RGB

    # --- 06 EDUCATION & QUALIFICATIONS ---
    add_section_heading("06", "Education & Qualifications")
    tbl_edu = doc.add_table(rows=2, cols=2)
    tbl_edu.alignment = WD_TABLE_ALIGNMENT.CENTER
    edu_list = [
        ("MASTER II — Musicology Applied to Visual Media", "Specialization: Computer-Assisted Music / MAO", "Advanced music analysis, film scoring, digital composition & intermediality"),
        ("HIGHER TECHNICIAN DIPLOMA — Sound Engineering", "Technician-Level Higher Education in Sound Engineering", "Studio acoustics, signal processing, microphone techniques & multitrack mixing"),
        ("LICENCE (BACHELOR'S DEGREE) — Arts & Cultural Management", "University of Dschang", "Cultural economics, project management, arts administration & heritage conservation"),
        ("MILLENNIUM BUSINESS DEVELOPER", "UVCDI", "Business strategy, project scaling, commercial development & executive leadership")
    ]
    for idx, (deg, spec, inst) in enumerate(edu_list):
        r_idx = idx // 2
        c_idx = idx % 2
        c = tbl_edu.cell(r_idx, c_idx)
        set_cell_background(c, C_BG_CARD)
        set_cell_left_border_gold(c, "20")
        set_cell_margins(c, 80, 120, 80, 120)
        p = c.paragraphs[0]
        p.paragraph_format.space_before = Pt(0); p.paragraph_format.space_after = Pt(2)
        r_deg = p.add_run(deg + "\n"); r_deg.font.bold = True; r_deg.font.size = Pt(10.5); r_deg.font.color.rgb = C_DARK
        r_spec = p.add_run(spec + "\n"); r_spec.font.italic = True; r_spec.font.size = Pt(10); r_spec.font.color.rgb = C_BRONZE_RGB
        r_inst = p.add_run(inst); r_inst.font.size = Pt(10); r_inst.font.color.rgb = C_MUTED_RGB

    # --- 07 AI APPLICATIONS, AUDIO EVALUATION & MUSIC DATA PROFILE ---
    add_section_heading("07", "AI Applications, Audio Evaluation & Music Data Profile")
    ai_pillars = [
        ("Established AI & Digital Workflow Practice", "Routine implementation of modern digital audio workflows, AI-assisted audio processing tools, automated stem separation, and audio restoration plugins within professional DAW environments."),
        ("AI Audio Evaluation & Annotation Capabilities", "High-fidelity acoustic critique for generative audio models: identifying spectral artifacts, phase smearing, harmonic incoherence, tempo drift, prompt alignment, and genre classification with musicological precision."),
        ("Target International Roles & Missions", "AI Audio Quality Evaluator · Music Data Annotator / Curator · Audio QA Specialist · Human-in-the-Loop Audio QA Evaluator · MusicTech Educational Consultant."),
        ("Transferable Professional Strengths", "Rare triad combining rigorous academic musicology, practical sound engineering ear, and pedagogical taxonomy design (RMA), ensuring objective, structured, and repeatable audio evaluation data.")
    ]
    for title, desc in ai_pillars:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2); p.paragraph_format.space_after = Pt(2)
        r_t = p.add_run(f"✦ {title}: "); r_t.font.bold = True; r_t.font.size = Pt(11); r_t.font.color.rgb = C_DARK
        r_d = p.add_run(desc); r_d.font.size = Pt(11); r_d.font.color.rgb = C_MUTED_RGB

    # --- 08 LANGUAGES & INTERNATIONAL AVAILABILITY ---
    add_section_heading("08", "Languages & International Availability")
    p_lang = doc.add_paragraph()
    p_lang.paragraph_format.space_before = Pt(2); p_lang.paragraph_format.space_after = Pt(2)
    p_lang.add_run("• Languages: ").font.bold = True
    p_lang.add_run("French (Native / Full Professional Fluency) | English (Professional Working Proficiency)")

    p_mob = doc.add_paragraph()
    p_mob.paragraph_format.space_before = Pt(2); p_mob.paragraph_format.space_after = Pt(4)
    p_mob.add_run("• International Mobility: ").font.bold = True
    p_mob.add_run("Equipped for remote collaboration worldwide. Available for international travel: masterclasses, festivals, studio mixing, and consulting.")

    doc.save(OUT_DOCX)
    print(f" -> Generated Editable DOCX: {OUT_DOCX}")

if __name__ == "__main__":
    create_editable_docx()
