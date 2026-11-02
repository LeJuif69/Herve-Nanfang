import { useEffect } from 'react'
import type { Video } from '../data/videos'

/** Injecte le balisage Schema.org VideoObject dans le head du document */
export default function VideoSchema({ video }: { video: Video }) {
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-video-schema', video.id)
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: video.title,
      description: video.description,
      thumbnailUrl: [
        video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`,
      ],
      uploadDate: video.publishedAt || '2026-01-01T00:00:00Z',
      embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
      contentUrl: `https://www.youtube.com/shorts/${video.youtubeId}`,
      author: {
        '@type': 'Person',
        name: video.performedBy,
        url: 'https://hervenanfang.art',
      },
    })
    document.head.appendChild(script)
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [video])

  return null
}
