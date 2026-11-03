import type { Post } from '../content'
import { author, baseUrl, siteTitle } from '../site'

const entities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
}

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (char) => entities[char])
}

/** The RSS 2.0 feed of the given Posts, with every value XML-escaped. */
export function rssFeed(posts: Post[]): string {
  let items = posts
    .map(
      (post) => `<item>
          <title>${escapeXml(post.title)}</title>
          <link>${escapeXml(`${baseUrl}/blog/${post.slug}`)}</link>
          <description>${escapeXml(post.summary)}</description>
          <pubDate>${escapeXml(new Date(post.publishedAt).toUTCString())}</pubDate>
        </item>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>${escapeXml(siteTitle)}</title>
        <link>${escapeXml(baseUrl)}</link>
        <description>${escapeXml(`Posts by ${author}`)}</description>
        ${items}
    </channel>
  </rss>`
}
