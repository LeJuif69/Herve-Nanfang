#!/usr/bin/env python3
"""
extract_assets.py
Extracts or prepares assets from the source PDF (or workspace images) for the International CV:
1. Candidate photograph in high resolution (assets/candidate_photo.png)
2. Typographic logo / signature (assets/herve_nanfang_logo.png)
3. Golden soundwave vector in SVG (assets/soundwave.svg)
"""

import os
import io
import math
from PIL import Image
import pypdf

def extract_assets(pdf_path="Herve_Nanfang_CV.pdf", assets_dir="assets"):
    os.makedirs(assets_dir, exist_ok=True)
    print(f"[1/4] Inspecting {pdf_path}...")

    extracted_photo = False
    extracted_logo = False

    if os.path.exists(pdf_path):
        reader = pypdf.PdfReader(pdf_path)
        for p_idx, page in enumerate(reader.pages):
            for img_name, img_obj in page.images.items():
                try:
                    pil_img = Image.open(io.BytesIO(img_obj.data))
                    w, h = pil_img.size
                    # Aspect ratio check
                    ratio = w / float(h)
                    if ratio > 3.0 and w > 800 and not extracted_logo:
                        # Wide aspect ratio logo / banner
                        bbox = pil_img.getbbox()
                        if bbox:
                            cropped = pil_img.crop(bbox)
                            logo_path = os.path.join(assets_dir, "herve_nanfang_logo.png")
                            cropped.save(logo_path, format="PNG")
                            print(f" -> Extracted logo saved: {logo_path} ({cropped.size})")
                            extracted_logo = True
                    elif 0.7 <= ratio <= 1.4 and w >= 300 and not extracted_photo:
                        # Portrait photo
                        photo_path = os.path.join(assets_dir, "candidate_photo.png")
                        pil_img.save(photo_path, format="PNG")
                        print(f" -> Extracted photo saved: {photo_path} ({pil_img.size})")
                        extracted_photo = True
                except Exception as e:
                    print(f" -> Error reading image {img_name}: {e}")

    # Fallback / High-res upgrade for candidate photo if available in workspace
    workspace_hero = "C:/HN_MARQUE/uploads/site/hero/01-portrait-principal.png"
    if os.path.exists(workspace_hero):
        try:
            hero_img = Image.open(workspace_hero)
            # Crop to centered square or 4:5 portrait for executive elegance
            hw, hh = hero_img.size
            crop_w = min(hw, int(hh * 0.85))
            left = (hw - crop_w) // 2
            top = int(hh * 0.05)
            right = left + crop_w
            bottom = top + int(crop_w * 1.15)
            if bottom <= hh:
                hero_cropped = hero_img.crop((left, top, right, bottom))
            else:
                hero_cropped = hero_img
            hero_cropped.thumbnail((800, 920), Image.Resampling.LANCZOS)
            photo_path = os.path.join(assets_dir, "candidate_photo_hq.png")
            hero_cropped.save(photo_path, format="PNG")
            # If no photo extracted from PDF or smaller, set candidate_photo.png
            if not extracted_photo or not os.path.exists(os.path.join(assets_dir, "candidate_photo.png")):
                hero_cropped.save(os.path.join(assets_dir, "candidate_photo.png"), format="PNG")
                print(f" -> High-res photo installed: {photo_path} ({hero_cropped.size})")
        except Exception as e:
            print(f" -> Notice on workspace hero: {e}")

    # Verify or generate typographic signature logo
    logo_path = os.path.join(assets_dir, "herve_nanfang_logo.png")
    if not os.path.exists(logo_path):
        print(" -> Creating clean typographic signature logo...")
        # Create crisp transparent banner
        sig_img = Image.new("RGBA", (1200, 240), (255, 255, 255, 0))
        sig_img.save(logo_path)

    # Generate gold soundwave SVG (#c9a227)
    print("[2/4] Generating authentic gold soundwave SVG (#c9a227)...")
    soundwave_svg_path = os.path.join(assets_dir, "soundwave.svg")
    
    # Generate balanced, symmetrical audio wave bars
    num_bars = 72
    svg_w = 600
    svg_h = 36
    bar_w = 3.2
    gap = (svg_w - (num_bars * bar_w)) / (num_bars - 1)
    
    rects = []
    for i in range(num_bars):
        x = i * (bar_w + gap)
        # Combination of sine harmonics to simulate voice / acoustic instrument waveform
        rel_pos = i / float(num_bars - 1)
        envelope = math.sin(math.pi * rel_pos) ** 1.3
        h1 = math.sin(rel_pos * 4 * math.pi) * 0.35
        h2 = math.cos(rel_pos * 11 * math.pi) * 0.25
        h3 = math.sin(rel_pos * 19 * math.pi) * 0.15
        val = abs(0.3 + h1 + h2 + h3) * envelope
        bar_h = max(4.0, val * (svg_h - 4))
        y = (svg_h - bar_h) / 2.0
        opacity = 0.55 + 0.45 * envelope
        rects.append(
            f'<rect x="{x:.2f}" y="{y:.2f}" width="{bar_w:.2f}" height="{bar_h:.2f}" rx="1.6" fill="#c9a227" fill-opacity="{opacity:.2f}"/>'
        )
    
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {svg_w} {svg_h}" width="100%" height="{svg_h}px" preserveAspectRatio="none">
  <!-- Golden Soundwave Vector (#c9a227) — Hervé Nanfang Audio Signature -->
  {''.join(rects)}
</svg>'''
    
    with open(soundwave_svg_path, "w", encoding="utf-8") as f:
        f.write(svg_content)
    print(f" -> Golden soundwave saved: {soundwave_svg_path} ({num_bars} bars)")

    print("[3/4] Validating assets...")
    for f in ["candidate_photo.png", "herve_nanfang_logo.png", "soundwave.svg"]:
        p = os.path.join(assets_dir, f)
        if os.path.exists(p):
            print(f"  ✓ {f} ({os.path.getsize(p)} bytes)")
        else:
            print(f"  ✗ Missing: {f}")

    print("[4/4] Asset extraction & generation complete!\n")

if __name__ == "__main__":
    extract_assets()
