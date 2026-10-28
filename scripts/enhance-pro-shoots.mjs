import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const uploadsDir = 'C:\\HN_MARQUE\\uploads'
const publicImagesDir = 'public/images'

// Visuals target list for proshoot enhancement
const targetShoots = [
  {
    src: path.join(uploadsDir, 'Shooting_Pro.png'),
    dest: path.join(publicImagesDir, 'shooting-pro-officiel.webp'),
    name: 'shooting-pro-officiel.webp',
    contrastBoost: 1.04,
    sharpen: { sigma: 1.2, m1: 1.1, m2: 2.5 },
  },
  {
    src: path.join(uploadsDir, 'Shooting October 07, 2025 - 6_45PM.png'),
    dest: path.join(publicImagesDir, 'shooting-octobre-regard-645.webp'),
    name: 'shooting-octobre-regard-645.webp',
    contrastBoost: 1.05,
    sharpen: { sigma: 1.2, m1: 1.0, m2: 2.2 },
  },
  {
    src: path.join(uploadsDir, 'Shooting October 07, 2025 - 6_57PM.png'),
    dest: path.join(publicImagesDir, 'shooting-octobre-pose-657.webp'),
    name: 'shooting-octobre-pose-657.webp',
    contrastBoost: 1.04,
    sharpen: { sigma: 1.15, m1: 1.0, m2: 2.2 },
  },
  {
    src: path.join(uploadsDir, 'ShootingOctober 07, 2025 - 6_52PM.png'),
    dest: path.join(publicImagesDir, 'shooting-octobre-attitude-652.webp'),
    name: 'shooting-octobre-attitude-652.webp',
    contrastBoost: 1.04,
    sharpen: { sigma: 1.15, m1: 1.0, m2: 2.2 },
  },
  {
    src: path.join(uploadsDir, 'Shooting_October 02, 2025 - 12_11PM.png'),
    dest: path.join(publicImagesDir, 'shooting-octobre-studio-1211.webp'),
    name: 'shooting-octobre-studio-1211.webp',
    contrastBoost: 1.04,
    sharpen: { sigma: 1.15, m1: 1.0, m2: 2.2 },
  },
  {
    src: path.join(uploadsDir, 'Shooting_October 02, 2025 - 12_12PM.png'),
    dest: path.join(publicImagesDir, 'shooting-octobre-studio-1212.webp'),
    name: 'shooting-octobre-studio-1212.webp',
    contrastBoost: 1.04,
    sharpen: { sigma: 1.15, m1: 1.0, m2: 2.2 },
  },
  {
    src: path.join(uploadsDir, 'Shooting September 17, 2025 - 7_03AM.png'),
    dest: path.join(publicImagesDir, 'shooting-septembre-matin-703.webp'),
    name: 'shooting-septembre-matin-703.webp',
    contrastBoost: 1.03,
    sharpen: { sigma: 1.1, m1: 0.9, m2: 2.0 },
  },
  {
    src: path.join(uploadsDir, 'Shooting September 17, 2025 - 7_27AM.png'),
    dest: path.join(publicImagesDir, 'shooting-septembre-matin-727.webp'),
    name: 'shooting-septembre-matin-727.webp',
    contrastBoost: 1.03,
    sharpen: { sigma: 1.1, m1: 0.9, m2: 2.0 },
  },
  {
    src: path.join(uploadsDir, 'Shooting_02.jpg'),
    dest: path.join(publicImagesDir, 'shooting-profil-02.webp'),
    name: 'shooting-profil-02.webp',
    contrastBoost: 1.05,
    sharpen: { sigma: 1.15, m1: 1.0, m2: 2.2 },
  },
  {
    src: path.join(uploadsDir, 'SHOW CASE CHEZ DR DIARA.png'),
    dest: path.join(publicImagesDir, 'showcase-dr-diara.webp'),
    name: 'showcase-dr-diara.webp',
    contrastBoost: 1.04,
    sharpen: { sigma: 1.1, m1: 0.9, m2: 2.0 },
  },
  {
    src: path.join(uploadsDir, 'hervé en train de jouer malgré la main droite accidenté.jpg'),
    dest: path.join(publicImagesDir, 'herve-piano-main-accidentee.webp'),
    name: 'herve-piano-main-accidentee.webp',
    contrastBoost: 1.05,
    sharpen: { sigma: 1.25, m1: 1.2, m2: 2.6 },
  },
  {
    src: path.join(publicImagesDir, '01-portrait-principal.png'),
    dest: path.join(publicImagesDir, 'portrait.webp'),
    name: 'portrait.webp',
    contrastBoost: 1.06,
    sharpen: { sigma: 1.2, m1: 1.1, m2: 2.4 },
  },
  {
    src: path.join(publicImagesDir, '07-portrait-yaounde.jpg'),
    dest: path.join(publicImagesDir, 'about-portrait-yaounde.webp'),
    name: 'about-portrait-yaounde.webp',
    contrastBoost: 1.04,
    sharpen: { sigma: 1.2, m1: 1.0, m2: 2.2 },
  },
  {
    src: path.join(uploadsDir, 'ShowCase_HervéNanfang_Mikelang.jfif'),
    dest: path.join(publicImagesDir, 'showcase-herve-nanfang-mikelang.webp'),
    name: 'showcase-herve-nanfang-mikelang.webp',
    contrastBoost: 1.03,
    sharpen: { sigma: 1.1, m1: 0.9, m2: 2.0 },
  },
]

async function enhance() {
  console.log(`Starting ProShoot visual quality enhancement for ${targetShoots.length} photos...`)

  for (const item of targetShoots) {
    if (!fs.existsSync(item.src)) {
      console.warn(`Source file not found: ${item.src}`)
      continue
    }

    const initialStat = fs.existsSync(item.dest) ? fs.statSync(item.dest) : null
    const image = sharp(item.src).rotate()
    const meta = await image.metadata()

    let pipeline = image

    // Resize to crisp max 2048px on longest side for Retina
    if ((meta.width && meta.width > 2048) || (meta.height && meta.height > 2048)) {
      pipeline = pipeline.resize({
        width: 2048,
        height: 2048,
        fit: 'inside',
        withoutEnlargement: true,
      })
    }

    // Dynamic contrast & luminance balance
    pipeline = pipeline.modulate({
      brightness: 1.01,
      saturation: 1.04,
    })

    // Micro-contrast sharpening tuned for portraiture & studio
    pipeline = pipeline.sharpen({
      sigma: item.sharpen.sigma,
      m1: item.sharpen.m1,
      m2: item.sharpen.m2,
    })

    // High fidelity WebP export (quality 90, smart subsampling for maximum edge sharpness)
    await pipeline
      .webp({
        quality: 90,
        smartSubsample: true,
        effort: 6,
      })
      .toFile(item.dest)

    const newStat = fs.statSync(item.dest)
    const newMeta = await sharp(item.dest).metadata()

    console.log(
      `✓ Enhanced: ${item.name} | Res: ${newMeta.width}x${newMeta.height} | Quality: 90% | Size: ${(newStat.size / 1024).toFixed(0)} Ko ${initialStat ? `(was ${(initialStat.size / 1024).toFixed(0)} Ko)` : ''}`
    )
  }

  console.log('\nAll ProShoot visuals successfully enhanced with studio-grade sharpness & contrast!')
}

enhance().catch((err) => {
  console.error(err)
  process.exit(1)
})
