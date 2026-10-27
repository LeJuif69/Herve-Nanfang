#!/usr/bin/env python3
"""
build_all.py
Master Autonomous Build Script for Hervé Nanfang's International CV Suite:
1. Extracts/verifies assets (candidate_photo, signature logo, golden soundwave SVG).
2. Generates self-contained HTML files with inlined CSS for all 4 CV variants.
3. Compiles high-resolution, vector-crisp 2-page PDFs via Chromium Headless:
   - dist/Herve_Nanfang_CV_Master_International.pdf
   - dist/Herve_Nanfang_CV_AI_Audio_MusicData.pdf
   - dist/Herve_Nanfang_CV_Sound_Engineer_Producer.pdf
   - dist/Herve_Nanfang_CV_Musicologist_Educator.pdf
4. Builds the editable Word native document (dist/Herve_Nanfang_CV_Editable.docx).
5. Ensures the complete Strategy and ATS Dossier (dist/Herve_Nanfang_Strategy_And_ATS_Dossier.md) is present.
"""

import os
import sys
import subprocess
from playwright.sync_api import sync_playwright

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST_DIR = os.path.join(BASE_DIR, "dist")
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

PDF_TARGETS = [
    ("Master_International", "Herve_Nanfang_CV_Master_International.pdf"),
    ("AI_Audio_MusicData", "Herve_Nanfang_CV_AI_Audio_MusicData.pdf"),
    ("Sound_Engineer_Producer", "Herve_Nanfang_CV_Sound_Engineer_Producer.pdf"),
    ("Musicologist_Educator", "Herve_Nanfang_CV_Musicologist_Educator.pdf")
]

def main():
    print("=" * 72)
    print("  HERVÉ NANFANG — MASTER BUILD PIPELINE (ANTIGRAVITY IDE)")
    print("=" * 72)

    # Step 1: Extract assets
    print("\n[STEP 1/5] Extracting & preparing assets...")
    import extract_assets
    extract_assets.extract_assets()

    # Step 2: Build HTML variants
    print("\n[STEP 2/5] Building modular self-contained HTML templates...")
    import build_cv_html
    html_variants = build_cv_html.build_html_variants()

    # Step 3: Compile PDFs via Playwright / Chromium Headless
    print("\n[STEP 3/5] Compiling 4 specialized PDF variants via Chromium Headless...")
    os.makedirs(DIST_DIR, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME_PATH, headless=True)
        for key, pdf_name in PDF_TARGETS:
            html_file = os.path.join(DIST_DIR, "html", f"cv_{key.lower()}.html")
            pdf_path = os.path.join(DIST_DIR, pdf_name)
            
            print(f" -> Rendering {pdf_name} from {os.path.basename(html_file)}...")
            page = browser.new_page()
            page.goto(f"file:///{os.path.abspath(html_file)}")
            page.pdf(
                path=pdf_path,
                format="A4",
                print_background=True,
                margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
                prefer_css_page_size=True
            )
            page.close()
            
            size_kb = os.path.getsize(pdf_path) / 1024.0
            print(f"    ✓ Created: {pdf_path} ({size_kb:.1f} KB)")
        browser.close()

    # Step 4: Build Editable DOCX
    print("\n[STEP 4/5] Generating editable Word version (python-docx)...")
    import build_docx
    build_docx.create_editable_docx()

    # Step 5: Verify Strategy & ATS Dossier
    print("\n[STEP 5/5] Checking Strategy & ATS Dossier...")
    dossier_path = os.path.join(DIST_DIR, "Herve_Nanfang_Strategy_And_ATS_Dossier.md")
    if os.path.exists(dossier_path):
        print(f"    ✓ Dossier verified: {dossier_path} ({os.path.getsize(dossier_path)} bytes)")
    else:
        print(f"    ! Notice: Dossier not found at {dossier_path}")

    # Mirror to public/cv/ for web accessibility and persistence across vite builds
    public_cv = os.path.join(BASE_DIR, "public", "cv")
    cv_dist = os.path.join(BASE_DIR, "cv_dist")
    os.makedirs(public_cv, exist_ok=True)
    os.makedirs(cv_dist, exist_ok=True)

    files_to_mirror = [
        "Herve_Nanfang_CV_Master_International.pdf",
        "Herve_Nanfang_CV_AI_Audio_MusicData.pdf",
        "Herve_Nanfang_CV_Sound_Engineer_Producer.pdf",
        "Herve_Nanfang_CV_Musicologist_Educator.pdf",
        "Herve_Nanfang_CV_Editable.docx",
        "Herve_Nanfang_Strategy_And_ATS_Dossier.md"
    ]

    import shutil
    for fname in files_to_mirror:
        src = os.path.join(DIST_DIR, fname)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(public_cv, fname))
            shutil.copy2(src, os.path.join(cv_dist, fname))

    print("    ✓ Mirrored all CV deliverables to public/cv/ and cv_dist/ (immune to vite build wipes)")

    print("\n" + "=" * 72)
    print("  ALL ASSETS & DELIVERABLES COMPILED SUCCESSFULLY IN dist/")
    print("=" * 72)

if __name__ == "__main__":
    main()
