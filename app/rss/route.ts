import { baseUrl } from 'app/sitemap'
import { getPosts } from 'app/content'

export async function GET() {
  let allBlogs = getPosts()

  const itemsXml = allBlogs
    .map(
      (post) =>
        `<item>
          <title>${post.title}</title>
          <link>${baseUrl}/blog/${post.slug}</link>
          <description>${post.summary}</description>
          <pubDate>${new Date(
          post.publishedAt
        ).toUTCString()}</pubDate>
        </item>`
    )
    .join('\n')

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>Myles' Portfolio</title>
        <link>${baseUrl}</link>
        <description>This is Myles' portfolio RSS feed</description>
        ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'text/xml',
    },
  })
}
