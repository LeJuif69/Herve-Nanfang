import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

// Identifiant permanent canonique de la chaîne YouTube Hervé Nanfang
// Vérifié sur https://www.youtube.com/@herve_nanfang (meta identifier / externalId / feed URL)
const PERMANENT_CHANNEL_ID = 'UCVDfoz7Jka3w3og9ttkb1fA';
const CHANNEL_HANDLE = '@herve_nanfang';

// Simple XML parsing using RegExp – sufficient for YouTube Atom/RSS
function extractTag(xml, tag) {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'g');
  const matches = [];
  let m;
  while ((m = regex.exec(xml)) !== null) {
    matches.push(m[1].trim());
  }
  return matches;
}

function extractAttr(tag, attr, xml) {
  const regex = new RegExp(`<${tag}[^>]*${attr}="([^"]*)"[^>]*>`, 'g');
  const matches = [];
  let m;
  while ((m = regex.exec(xml)) !== null) {
    matches.push(m[1]);
  }
  return matches;
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '')
    .replace(/-{2,}/g, '-');
}

// Fallback scraping multi-sélecteurs au cas où l'ID changerait
async function resolveChannelIdFallback(handle) {
  const url = `https://www.youtube.com/${handle}`;
  const resp = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
    },
  });
  if (!resp.ok) {
    throw new Error(`Échec HTTP ${resp.status} lors de l'accès à la page de la chaîne`);
  }
  const html = await resp.text();

  // Multiples sélecteurs robustes selon les variantes SSR de YouTube
  const selectors = [
    /feeds\/videos\.xml\?channel_id=(UC[a-zA-Z0-9_-]{22})/,
    /<meta\s+itemprop="identifier"\s+content="(UC[a-zA-Z0-9_-]{22})"/,
    /"externalId":"(UC[a-zA-Z0-9_-]{22})"/,
    /<link\s+rel="canonical"\s+href="https:\/\/www\.youtube\.com\/channel\/(UC[a-zA-Z0-9_-]{22})"/,
    /"browseId":"(UC[a-zA-Z0-9_-]{22})"/,
    /"channelId":"(UC[a-zA-Z0-9_-]{22})"/,
  ];

  for (const regex of selectors) {
    const match = html.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }

  throw new Error('Aucun sélecteur YouTube (RSS feed, externalId, meta identifier, canonical) n\'a trouvé de Channel ID valide');
}

async function fetchRss(channelId) {
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const resp = await fetch(rssUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; HerveNanfangBot/1.0; +https://hervenanfang.art)',
    },
  });
  if (!resp.ok) throw new Error(`Échec de récupération du flux RSS (HTTP ${resp.status}) pour le canal ${channelId}`);
  return resp.text();
}

function parseRss(xml) {
  // Parsing par entrées individuelles pour garantir la correspondance exacte
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  const entries = [];
  let entryMatch;
  while ((entryMatch = entryRegex.exec(xml)) !== null) {
    entries.push(entryMatch[1]);
  }

  const videos = [];
  for (let i = 0; i < entries.length; i++) {
    const block = entries[i];
    const titles = extractTag(block, 'title');
    const videoIds = extractTag(block, 'yt:videoId');
    const published = extractTag(block, 'published');
    const thumbnails = extractAttr('media:thumbnail', 'url', block);
    const descriptions = extractTag(block, 'media:description');
    const links = extractAttr('link', 'href', block);

    const videoId = videoIds[0];
    if (!videoId) continue;

    const title = titles[0] || `Vidéo ${i + 1}`;
    const isShort = links.some((l) => l.includes('/shorts/'));

    videos.push({
      id: slugify(title) || `video-${videoId}`,
      title,
      slug: slugify(title) || `video-${videoId}`,
      youtubeId: videoId,
      category: 'LIVE SESSIONS',
      description: descriptions[0] || '',
      originalArtist: '',
      performedBy: 'Hervé Nanfang',
      orientation: isShort ? 'vertical' : 'horizontal',
      thumbnail: thumbnails[0] || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      publishedAt: published[0] || new Date().toISOString(),
    });
  }
  return videos;
}

// Lit les vidéos existantes dans src/data/videos.ts pour fusionner sans perte
async function readExistingVideos(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    const jsonMatch = content.match(/export const videos:\s*Video\[\]\s*=\s*(\[[\s\S]*?\]);?\s*$/);
    if (jsonMatch) {
      // Évaluation sûre des données existantes
      const parsed = Function(`"use strict"; return (${jsonMatch[1]});`)();
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('ℹ️ [fetch-yt-rss] Note : Impossible d\'extraire les vidéos existantes (fichier absent ou non-JSON) :', err.message);
  }
  return [];
}

async function main() {
  const outPath = resolve('src', 'data', 'videos.ts');
  const existingVideos = await readExistingVideos(outPath);

  try {
    const channelId = process.env.YOUTUBE_CHANNEL_ID || PERMANENT_CHANNEL_ID;
    console.log(`📡 [fetch-yt-rss] Interrogation du flux RSS YouTube pour la chaîne ${channelId}...`);

    let rssXml;
    try {
      rssXml = await fetchRss(channelId);
    } catch (rssErr) {
      console.warn(`⚠️ [fetch-yt-rss] Échec avec le Channel ID permanent (${rssErr.message}), tentative via scraping de secours...`);
      const fallbackId = await resolveChannelIdFallback(CHANNEL_HANDLE);
      console.log(`🔎 [fetch-yt-rss] Channel ID de secours résolu : ${fallbackId}`);
      rssXml = await fetchRss(fallbackId);
    }

    const fetchedVideos = parseRss(rssXml);
    if (!fetchedVideos || fetchedVideos.length === 0) {
      console.warn('⚠️ [fetch-yt-rss] Aucune vidéo retournée par le flux RSS. Conservation stricte des vidéos existantes.');
      return;
    }

    console.log(`🎬 [fetch-yt-rss] ${fetchedVideos.length} vidéo(s) trouvée(s) dans le flux RSS.`);

    // Fusion intelligente : on préserve toutes les métadonnées manuelles/éditoriales enrichies
    const mergedVideos = [...existingVideos];

    for (const fetched of fetchedVideos) {
      const existingIndex = mergedVideos.findIndex((v) => v.youtubeId === fetched.youtubeId);
      if (existingIndex >= 0) {
        // La vidéo existe déjà : on préserve category, tags, description éditoriale, priority, featured
        const existing = mergedVideos[existingIndex];
        mergedVideos[existingIndex] = {
          ...fetched,
          ...existing, // les propriétés existantes prévalent (tags, category, custom description)
          thumbnail: existing.thumbnail || fetched.thumbnail,
          publishedAt: existing.publishedAt || fetched.publishedAt,
        };
      } else {
        // Nouvelle vidéo : ajout en début de liste
        console.log(`✨ [fetch-yt-rss] Nouvelle vidéo détectée : "${fetched.title}" (${fetched.youtubeId})`);
        mergedVideos.push(fetched);
      }
    }

    // Sécurité absolue : ne JAMAIS écraser avec une liste vide
    if (mergedVideos.length === 0) {
      console.warn('⚠️ [fetch-yt-rss] Liste finale vide. Aucun fichier réécrit.');
      return;
    }

    const fileContent = `export type VideoCategory =
  | 'PIANO-BAR LIVE'
  | 'REPRISES LIVE'
  | 'LIVE SESSIONS'
  | 'DUO HERVÉ & FLAVIE'
  | 'SCÈNES & ÉVÉNEMENTS'

export interface Video {
  id: string
  title: string
  slug: string
  youtubeId: string
  category: VideoCategory
  description: string
  originalArtist: string
  performedBy: string
  orientation: 'vertical' | 'horizontal'
  tags?: string[]
  priority?: number
  thumbnail?: string
  publishedAt?: string
  featured?: boolean
}

export const videos: Video[] = ${JSON.stringify(mergedVideos, null, 2)}
`;

    await writeFile(outPath, fileContent, 'utf8');
    console.log(`✅ [fetch-yt-rss] videos.ts synchronisé avec succès (${mergedVideos.length} vidéo(s) actives).`);
  } catch (err) {
    console.warn('⚠️ [fetch-yt-rss] Impossible de synchroniser les vidéos YouTube (conservation des vidéos existantes) :', err.message);
    if (existingVideos.length > 0) {
      console.log(`ℹ️ [fetch-yt-rss] ${existingVideos.length} vidéo(s) existante(s) préservée(s) sans altération.`);
    }
  }
}

main();
