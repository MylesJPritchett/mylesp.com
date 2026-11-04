import { XMLParser, XMLValidator } from 'fast-xml-parser'
import { describe, expect, test } from 'vitest'
import { rssFeed } from './feed'

const post = {
  slug: 'rust-and-wasm',
  title: 'Rust & WebAssembly: <canvas> "games"',
  publishedAt: '2024-04-06',
  summary: "Tom's notes on <script> & friends",
  content: '',
}

describe('RSS feed', () => {
  test('escapes Post titles and summaries so the feed stays valid XML', () => {
    let xml = rssFeed([post])

    expect(XMLValidator.validate(xml)).toBe(true)
    expect(xml).toContain('Rust &amp; WebAssembly: &lt;canvas&gt;')

    let item = new XMLParser({ processEntities: true }).parse(xml).rss.channel.item
    expect(item.title).toBe(post.title)
    expect(item.description).toBe(post.summary)
    expect(item.link).toBe('https://mylesp.com/blog/rust-and-wasm')
  })

  test.each([
    ['AEST', '2024-07-15', 'Sun, 14 Jul 2024 14:00:00 GMT'],
    ['AEDT', '2024-01-15', 'Sun, 14 Jan 2024 13:00:00 GMT'],
    ['AEST, the day daylight saving starts', '2024-10-06', 'Sat, 05 Oct 2024 14:00:00 GMT'],
    ['AEDT, the day daylight saving ends', '2024-04-07', 'Sat, 06 Apr 2024 13:00:00 GMT'],
  ])('dates a Post at midnight in Sydney (%s)', (_zone, publishedAt, pubDate) => {
    let xml = rssFeed([{ ...post, publishedAt }])

    let item = new XMLParser().parse(xml).rss.channel.item
    expect(item.pubDate).toBe(pubDate)
  })
})
