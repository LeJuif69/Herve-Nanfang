import { writeFile } from 'fs/promises';
import { XMLParser } from 'fast-xml-parser';
import { resolve } from 'path';

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
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
  const json = parser.parse(xml);
  // The feed structure: json.feed.entry is an array (or single object)
  const entries = Array.isArray(json.feed.entry) ? json.feed.entry : [json.feed.entry];
  return entries.map((e) => {
    const videoId = e['yt:videoId'];
    const title = e.title;
    const published = e.published;
    const thumbnail = e['media:group']?.['media:thumbnail']?.url || '';
    return {
      id: slugify(title),
      title,
      slug: slugify(title),
      youtubeId: videoId,
      category: 'LIVE SESSIONS', // default, can be refined later
      description: e['media:group']?.['media:description'] || '',
      originalArtist: '',
      performedBy: 'Hervé Nanfang',
      orientation: 'horizontal',
      thumbnail,
      publishedAt: published,
    };
  });
}

async function main() {
  try {
    const handle = '@hervenanfang'; // YouTube handle
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

