import { writeFile } from 'fs/promises';
import { resolve } from 'path';

// Simple XML parsing using RegExp – sufficient for YouTube RSS
function extractTag(xml, tag) {
  const regex = new RegExp(`<${tag}>([^<]*)<\\/${tag}>`, 'g');
  const matches = [];
  let m;
  while ((m = regex.exec(xml)) !== null) {
    matches.push(m[1]);
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

// Helper: slugify a string (basic)
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '')
    .replace(/-{2,}/g, '-');
}

// Resolve YouTube channel ID from the handle page (no API key needed)
async function getChannelId(handle) {
  const url = `https://www.youtube.com/${handle}`;
  const resp = await fetch(url);
  const html = await resp.text();
  const match = html.match(/"channelId":"(UC[^"]+)"/);
  if (!match) throw new Error('Channel ID not found on page');
  return match[1];
}

async function fetchRss(channelId) {
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const resp = await fetch(rssUrl);
  if (!resp.ok) throw new Error(`Failed to fetch RSS: ${resp.status}`);
  return resp.text();
}

function parseRss(xml) {
  const titles = extractTag(xml, 'title'); // first title is feed title, later are entries
  const videoIds = extractTag(xml, 'yt:videoId');
  const published = extractTag(xml, 'published');
  const thumbnails = extractAttr('media:thumbnail', 'url', xml);
  const descriptions = extractTag(xml, 'media:description');

  const videos = [];
  for (let i = 0; i < videoIds.length; i++) {
    const title = titles[i + 1] || `Video ${i + 1}`; // skip feed title
    videos.push({
      id: slugify(title),
      title,
      slug: slugify(title),
      youtubeId: videoIds[i],
      category: 'LIVE SESSIONS',
      description: descriptions[i] || '',
      originalArtist: '',
      performedBy: 'Hervé Nanfang',
      orientation: 'horizontal',
      thumbnail: thumbnails[i] || '',
      publishedAt: published[i] || '',
    });
  }
  return videos;
}

async function main() {
  try {
    const handle = '@hervenanfang';
    const channelId = await getChannelId(handle);
    const rssXml = await fetchRss(channelId);
    const videos = parseRss(rssXml);
    const outPath = resolve('src', 'data', 'videos.ts');
    const fileContent = `export type VideoCategory =
  | 'PIANO-BAR LIVE'
  | 'REPRISES LIVE'
  | 'LIVE SESSIONS'
  | 'DUO HERVÉ & FLAVIE'
  | 'SCÈNES & ÉVÉNEMENTS';

export interface Video {
  id: string;
  title: string;
  slug: string;
  youtubeId: string;
  category: VideoCategory;
  description: string;
  originalArtist: string;
  performedBy: string;
  orientation: 'vertical' | 'horizontal';
  tags?: string[];
  priority?: number;
  thumbnail?: string;
  publishedAt?: string;
  featured?: boolean;
}

export const videos: Video[] = ${JSON.stringify(videos, null, 2)};\n`;
    await writeFile(outPath, fileContent, 'utf8');
    console.log('✅ videos.ts regenerated with', videos.length, 'items');
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

main();

