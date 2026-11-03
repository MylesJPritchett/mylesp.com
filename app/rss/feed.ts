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

const sydneyOffset = new Intl.DateTimeFormat('en-AU', {
  timeZone: 'Australia/Sydney',
  timeZoneName: 'longOffset',
})

/** The instant a YYYY-MM-DD date starts in Sydney, as an RFC 822 date. */
function sydneyMidnight(date: string) {
  let [year, month, day] = date.split('-').map(Number)
  let utcMidnight = Date.UTC(year, month - 1, day)
  // Ten hours before UTC midnight is 00:00 or 01:00 in Sydney, before any
  // daylight saving change that day (they happen at 02:00 or 03:00).
  let offset = sydneyOffset
    .formatToParts(new Date(utcMidnight - 10 * 3600_000))
    .find((part) => part.type === 'timeZoneName')!
    .value.match(/GMT([+-])(\d\d):(\d\d)/)!
  let minutes = (offset[1] === '-' ? -1 : 1) * (Number(offset[2]) * 60 + Number(offset[3]))
  return new Date(utcMidnight - minutes * 60_000).toUTCString()
}

/** The RSS 2.0 feed of the given Posts, with every value XML-escaped. */
export function rssFeed(posts: Post[]): string {
  let items = posts
    .map(
      (post) => `<item>
          <title>${escapeXml(post.title)}</title>
          <link>${escapeXml(`${baseUrl}/blog/${post.slug}`)}</link>
          <description>${escapeXml(post.summary)}</description>
          <pubDate>${escapeXml(sydneyMidnight(post.publishedAt))}</pubDate>
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
