import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import sharp from 'sharp'

const uploadsDir = 'C:\\HN_MARQUE\\uploads'
const publicImagesDir = 'public/images'

if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true })
}

const fileMap = [
  {
    original: 'apprendre-production-musicale.jpg',
    slug: 'apprendre-production-musicale',
    title: 'Apprendre la Production Musicale & MAO',
    alt: 'Masterclass et formation à la production musicale et arrangement en studio',
    caption: 'Programme de formation MAO et production sonore',
    tags: ['Pédagogie', 'Formation', 'MAO', 'Production'],
  },
  {
    original: 'Bafoussam Worship Experience.png',
    slug: 'bafoussam-worship-experience',
    title: 'Bafoussam Worship Experience — Live',
    alt: 'Concert live Bafoussam Worship Experience au piano et synthétiseur',
    caption: 'Grande scène live Bafoussam Worship Experience',
    tags: ['Live', 'Concert', 'Scène', 'Bafoussam'],
  },
  {
    original: 'Cours ISMA_ October 02, 2025 - 12_25PM (1).png',
    slug: 'cours-isma-classe-1225',
    title: 'ISMA — Session d’écoute et analyse harmonique',
    alt: 'Étudiants de l’ISMA en séance d’écoute et d’analyse harmonique avec Hervé Nanfang',
    caption: 'Cours d’harmonie et analyse à l’ISMA',
    tags: ['Pédagogie', 'ISMA', 'Formation', 'Musicologie'],
  },
  {
    original: 'Cours ISMA_ October 02, 2025 - 12_40PM.png',
    slug: 'cours-isma-analyse-1240',
    title: 'ISMA — Analyse d’arrangements musicaux',
    alt: 'Session de décryptage des arrangements musicaux à l’ISMA',
    caption: 'Atelier de pratique et arrangements musicaux',
    tags: ['Pédagogie', 'ISMA', 'Arrangement'],
  },
  {
    original: 'Cours ISMA_ October 02, 2025 - 12_42PM.png',
    slug: 'cours-isma-groupe-1242',
    title: 'ISMA — Travaux pratiques de groupe',
    alt: 'Travaux dirigés et pratiques instrumentales en groupe à l’ISMA',
    caption: 'Session de travaux dirigés instrumentaux',
    tags: ['Pédagogie', 'ISMA', 'Formation'],
  },
  {
    original: 'Cours ISMA_ October 02, 2025 - 1_11PM.png',
    slug: 'cours-isma-masterclass-1311',
    title: 'ISMA — Direction de masterclass',
    alt: 'Hervé Nanfang dirigeant une masterclass à l’ISMA',
    caption: 'Direction pédagogique et transmission musicale',
    tags: ['Pédagogie', 'ISMA', 'Masterclass'],
  },
  {
    original: 'Cours ISMA_October 02, 2025 - 12_39PM.png',
    slug: 'cours-isma-etude-1239',
    title: 'ISMA — Étude polyphonique',
    alt: 'Étude polyphonique et écriture musicale contemporaine',
    caption: 'Étude d’écriture et polyphonie africaine',
    tags: ['Pédagogie', 'ISMA', 'Musicologie'],
  },
  {
    original: 'Cours ISMA_October 02, 2025 - 12_41PM.png',
    slug: 'cours-isma-synthese-1241',
    title: 'ISMA — Synthèse pédagogique',
    alt: 'Séance de synthèse pédagogique et questions-réponses avec les étudiants',
    caption: 'Échanges et retours d’expérience pédagogique',
    tags: ['Pédagogie', 'ISMA', 'Transmission'],
  },
  {
    original: 'Cours ISMA_October 02, 2025 - 12_52PM.png',
    slug: 'cours-isma-atelier-1252',
    title: 'ISMA — Atelier de composition assistée',
    alt: 'Atelier de composition assistée et sound design à l’ISMA',
    caption: 'Composition et travail du timbre sonore',
    tags: ['Pédagogie', 'ISMA', 'Composition'],
  },
  {
    original: 'Cours ISMA_October 02, 2025 - 12_53PM (1).png',
    slug: 'cours-isma-harmonie-1253',
    title: 'ISMA — Harmonie au clavier',
    alt: 'Démonstration harmonique au clavier par Hervé Nanfang devant les élèves',
    caption: 'Démonstration au piano et claviers numériques',
    tags: ['Pédagogie', 'ISMA', 'Piano'],
  },
  {
    original: 'Cours ISMA_October 02, 2025 - 1_08PM.png',
    slug: 'cours-isma-fin-session-1308',
    title: 'ISMA — Clôture de masterclass',
    alt: 'Conclusion de session de cours et remise des objectifs de projet',
    caption: 'Bilan de fin de session à l’ISMA',
    tags: ['Pédagogie', 'ISMA', 'Masterclass'],
  },
  {
    original: 'Generated Image September 25, 2025 - 7_27AM.png',
    slug: 'concept-visuel-piano-futuriste-1',
    title: 'Concept Visuel — Piano & Architecture du Son I',
    alt: 'Illustration conceptuelle de clavier de piano et architecture acoustique',
    caption: 'Création visuelle conceptuelle — Univers de marque',
    tags: ['Concept', 'Design', 'Piano', 'Univers'],
  },
  {
    original: 'Generated Image September 25, 2025 - 7_34AM (1).png',
    slug: 'concept-visuel-piano-futuriste-2',
    title: 'Concept Visuel — Piano & Ondes Harmoniques II',
    alt: 'Clavier de piano et ondes sonores stylisées en or et noir',
    caption: 'Création visuelle — Ondes harmoniques et acoustique',
    tags: ['Concept', 'Design', 'Or', 'Acoustique'],
  },
  {
    original: 'Generated Image September 25, 2025 - 7_34AM (2).png',
    slug: 'concept-visuel-piano-futuriste-3',
    title: 'Concept Visuel — Résonance & Espace III',
    alt: 'Graphisme sonore représentant l’espace acoustique de concert',
    caption: 'Graphisme sonore scénique',
    tags: ['Concept', 'Scène', 'Concert'],
  },
  {
    original: 'Generated Image September 25, 2025 - 7_34AM (3).png',
    slug: 'concept-visuel-piano-futuriste-4',
    title: 'Concept Visuel — Piano Prestige IV',
    alt: 'Concept de piano de concert haute fidélité',
    caption: 'Univers prestige Piano-Bar et récital',
    tags: ['Concept', 'Piano-Bar', 'Prestige'],
  },
  {
    original: 'Generated Image September 25, 2025 - 7_34AM (4).png',
    slug: 'concept-visuel-piano-futuriste-5',
    title: 'Concept Visuel — Clavier & Lumière V',
    alt: 'Ambiance lumineuse de scène pour piano solo',
    caption: 'Scénographie lumineuse et clavier de concert',
    tags: ['Concept', 'Lumière', 'Scénographie'],
  },
  {
    original: 'Generated Image September 25, 2025 - 7_34AM.png',
    slug: 'concept-visuel-piano-futuriste-6',
    title: 'Concept Visuel — Clavier & Électroacoustique VI',
    alt: 'Rencontre entre cordes de piano et circuits sonores contemporains',
    caption: 'Recherche électroacoustique et vision moderne',
    tags: ['Concept', 'IA', 'Musicien Augmenté'],
  },
  {
    original: 'Hervé & Flavie - Shows Archives (2).png',
    slug: 'herve-flavie-shows-archives-2',
    title: 'Hervé & Flavie — Duo Live Archives II',
    alt: 'Prestation en duo sur scène avec Flavie au chant et Hervé Nanfang au piano',
    caption: 'Archives de tournées du duo Hervé & Flavie',
    tags: ['Live', 'Duo', 'Concert', 'Archives'],
  },
  {
    original: 'Hervé & Flavie - Shows Archives (3).png',
    slug: 'herve-flavie-shows-archives-3',
    title: 'Hervé & Flavie — Duo Live Archives III',
    alt: 'Moment complice sur scène en prestation piano-voix live',
    caption: 'Concert live Piano-Voix — Archives de scène',
    tags: ['Live', 'Duo', 'Piano-Voix', 'Archives'],
  },
  {
    original: 'hervé en train de jouer malgré la main droite accidenté.jpg',
    slug: 'herve-piano-main-accidentee',
    title: 'Prestation Héroïque — Piano avec main plâtrée',
    alt: 'Hervé Nanfang assurant son concert au piano malgré une blessure à la main',
    caption: 'Prestation scénique mémorable — Détermination et virtuosité',
    tags: ['Live', 'Piano', 'Virtuosité', 'Histoire', 'Scène'],
  },
  {
    original: 'HN avec son nouveau bijou png.png',
    slug: 'hn-avec-nouveau-clavier-stage',
    title: 'Hervé Nanfang — Nouveau Clavier Stage Pro',
    alt: 'Hervé Nanfang présentant son nouveau clavier professionnel de scène',
    caption: 'Nouvel instrument de scène et studio',
    tags: ['Studio', 'Piano', 'Instrument', 'Matériel'],
  },
  {
    original: 'HN avec son nouveau bijou.jpg',
    slug: 'hn-nouveau-clavier-ambiance',
    title: 'Hervé Nanfang & Clavier Pro — Ambiance',
    alt: 'Hervé Nanfang avec son synthétiseur pro en studio',
    caption: 'Configuration de scène et répétitions',
    tags: ['Studio', 'Live', 'Clavier'],
  },
  {
    original: 'Hosanna Experience (5).png',
    slug: 'hosanna-experience-live',
    title: 'Hosanna Experience — Performance Live',
    alt: 'Session scénique lors du grand concert Hosanna Experience',
    caption: 'Direction musicale lors du concert Hosanna Experience',
    tags: ['Live', 'Concert', 'Direction Musicale', 'Scène'],
  },
  {
    original: 'IMG-20220916-WA0011.jpg',
    slug: 'archive-terrain-2022',
    title: 'Archive de Terrain — 2022',
    alt: 'Recherche et collectage musical sur le terrain en 2022',
    caption: 'Fonds documentaire de terrain (2022)',
    tags: ['Archives', 'Recherche', 'Culture'],
  },
  {
    original: 'IMG-20240816-WA0012(1).jpg',
    slug: 'live-prestation-2024-scene',
    title: 'Prestation Live 2024 — Scène Ouverte',
    alt: 'Hervé Nanfang en live sur scène en août 2024',
    caption: 'Concert et session estivale 2024',
    tags: ['Live', 'Scène', 'Concert'],
  },
  {
    original: 'IMG-20240816-WA0028.jpg',
    slug: 'live-prestation-2024-piano',
    title: 'Session Acoustique 2024',
    alt: 'Session musicale acoustique intime en 2024',
    caption: 'Prestation acoustique et improvisations',
    tags: ['Live', 'Piano-Bar', 'Acoustique'],
  },
  {
    original: 'IMG-20260523-WA0020.jpg',
    slug: 'prestation-scene-2026',
    title: 'Prestation Scénique 2026',
    alt: 'Concert en plein air et direction d’ensemble 2026',
    caption: 'Tournée et grands concerts 2026',
    tags: ['Live', 'Concert', 'Scène'],
  },
  {
    original: 'LOgo Initiales.png',
    slug: 'logo-initiales-hn-alt',
    title: 'Logo Initiales HN — Variante Écrin',
    alt: 'Logo avec initiales HN et typographie de marque',
    caption: 'Déclinaison de marque — Monogramme alternatif',
    tags: ['Logo', 'Identité', 'Monogramme'],
  },
  {
    original: 'Passport.png',
    slug: 'portrait-identite-officiel',
    title: 'Portrait Officiel Format Identité',
    alt: 'Photographie officielle d’identité de Hervé Nanfang',
    caption: 'Portrait d’identité officiel pour accréditations',
    tags: ['Portrait', 'Identité', 'Presse'],
  },
  {
    original: 'RMA ROLL UP.png',
    slug: 'rma-roll-up-academie',
    title: 'RMA — Roll-Up Officiel Académie',
    alt: 'Affiche Roll-Up de l’Académie RMA : Révélateur de Musiciens et Artistes',
    caption: 'Support officiel de communication de l’Académie RMA',
    tags: ['RMA', 'Pédagogie', 'Affiche', 'Formation'],
  },
  {
    original: 'Scéance à domicile.png',
    slug: 'seance-coaching-domicile',
    title: 'Coaching Personnalisé & Séance Privée',
    alt: 'Séance de coaching pianistique et perfectionnement technique personnalisé',
    caption: 'Accompagnement d’excellence en cours particulier',
    tags: ['Pédagogie', 'Coaching', 'Piano', 'Formation'],
  },
  {
    original: 'Shooting October 07, 2025 - 6_45PM.png',
    slug: 'shooting-octobre-regard-645',
    title: 'Shooting Studio — Regard & Présence',
    alt: 'Portrait en studio éclairage clair-obscur de Hervé Nanfang',
    caption: 'Série photographique éditoriale studio 2025',
    tags: ['Portrait', 'Studio', 'Shooting', 'Presse'],
  },
  {
    original: 'Shooting October 07, 2025 - 6_57PM.png',
    slug: 'shooting-octobre-pose-657',
    title: 'Shooting Studio — Élégance & Veste',
    alt: 'Portrait officiel studio en costume élégant',
    caption: 'Série studio haute couture et élégance musicale',
    tags: ['Portrait', 'Studio', 'Shooting', 'Élégance'],
  },
  {
    original: 'Shooting September 17, 2025 - 7_03AM.png',
    slug: 'shooting-septembre-matin-703',
    title: 'Shooting Extérieur — Lumière Matinale I',
    alt: 'Portrait en extérieur lumière du matin',
    caption: 'Shooting lumière naturelle — Session septembre',
    tags: ['Portrait', 'Shooting', 'Extérieur'],
  },
  {
    original: 'Shooting September 17, 2025 - 7_27AM.png',
    slug: 'shooting-septembre-matin-727',
    title: 'Shooting Extérieur — Lumière Matinale II',
    alt: 'Portrait en extérieur regard confiant et sourire',
    caption: 'Shooting lumière naturelle — Profil artistique',
    tags: ['Portrait', 'Shooting', 'Extérieur'],
  },
  {
    original: 'ShootingOctober 07, 2025 - 6_52PM.png',
    slug: 'shooting-octobre-attitude-652',
    title: 'Shooting Studio — Attitude & Dynamisme',
    alt: 'Portrait dynamique studio de Hervé Nanfang',
    caption: 'Portrait d’affiche et bannières promotionnelles',
    tags: ['Portrait', 'Studio', 'Shooting', 'Presse'],
  },
  {
    original: 'Shooting_02.jpg',
    slug: 'shooting-profil-02',
    title: 'Shooting — Profil & Clavier',
    alt: 'Hervé Nanfang de profil au piano lors d’une session studio',
    caption: 'Profil au piano acoustique',
    tags: ['Portrait', 'Piano', 'Shooting'],
  },
  {
    original: 'Shooting_October 02, 2025 - 12_11PM.png',
    slug: 'shooting-octobre-studio-1211',
    title: 'Shooting Studio — Direction Artistique',
    alt: 'Portrait studio en posture de direction artistique',
    caption: 'Direction artistique et production A LAIZ PROD',
    tags: ['Portrait', 'Studio', 'Direction', 'Production'],
  },
  {
    original: 'Shooting_October 02, 2025 - 12_12PM.png',
    slug: 'shooting-octobre-studio-1212',
    title: 'Shooting Studio — Regard Créatif',
    alt: 'Portrait studio regard créatif et inspiré',
    caption: 'Créativité et vision contemporaine',
    tags: ['Portrait', 'Studio', 'Shooting'],
  },
  {
    original: 'Shooting_Pro.png',
    slug: 'shooting-pro-officiel',
    title: 'Shooting Professionnel — Portrait Signature',
    alt: 'Portrait studio professionnel signature de Hervé Nanfang',
    caption: 'Portrait signature officiel pour les programmes de prestige',
    tags: ['Portrait', 'Studio', 'Signature', 'Presse'],
  },
  {
    original: 'SHOW CASE CHEZ DR DIARA.png',
    slug: 'showcase-dr-diara',
    title: 'Showcase Privé — Soirée Piano-Bar',
    alt: 'Showcase privé et performance piano acoustique chez le Dr Diara',
    caption: 'Récital privé Piano-Bar d’exception',
    tags: ['Live', 'Piano-Bar', 'Showcase', 'Concert'],
  },
]

async function run() {
  console.log(`Starting processing of ${fileMap.length} upload images...`)
  const generatedMediaItems = []

  for (const item of fileMap) {
    const srcPath = path.join(uploadsDir, item.original)
    if (!fs.existsSync(srcPath)) {
      console.warn(`File not found: ${srcPath}, skipping.`)
      continue
    }

    const outFilename = `${item.slug}.webp`
    const outPath = path.join(publicImagesDir, outFilename)

    // Process with sharp
    const image = sharp(srcPath)
    const metadata = await image.metadata()

    // Resize if larger than 1920 in any dimension
    let pipeline = image.rotate() // auto-orient based on EXIF
    if ((metadata.width && metadata.width > 1920) || (metadata.height && metadata.height > 1920)) {
      pipeline = pipeline.resize({
        width: 1920,
        height: 1920,
        fit: 'inside',
        withoutEnlargement: true,
      })
    }

    await pipeline.webp({ quality: 82, effort: 4 }).toFile(outPath)

    const finalStat = fs.statSync(outPath)
    const finalMeta = await sharp(outPath).metadata()

    console.log(
      `✓ Processed: ${item.original} (${(fs.statSync(srcPath).size / 1024).toFixed(0)} Ko) -> ${outFilename} (${(finalStat.size / 1024).toFixed(0)} Ko, ${finalMeta.width}x${finalMeta.height})`
    )

    generatedMediaItems.push({
      id: `med-${item.slug}`,
      bucket: 'public-media',
      path: outFilename,
      url: `/images/${outFilename}`,
      filename: outFilename,
      altText: item.alt,
      caption: item.caption,
      tags: item.tags,
      mimeType: 'image/webp',
      sizeBytes: finalStat.size,
      width: finalMeta.width || 1200,
      height: finalMeta.height || 800,
      defaultPositionX: 50,
      defaultPositionY: 45,
      focalX: 50,
      focalY: 45,
      createdAt: '2026-03-01T00:00:00Z',
    })
  }

  // Save generated metadata for easy store inclusion
  fs.writeFileSync(
    'src/lib/generated-uploads-media.json',
    JSON.stringify(generatedMediaItems, null, 2),
    'utf-8'
  )
  console.log(`\nSuccessfully converted ${generatedMediaItems.length} images to WebP!`)
  console.log(`Metadata saved to src/lib/generated-uploads-media.json`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
