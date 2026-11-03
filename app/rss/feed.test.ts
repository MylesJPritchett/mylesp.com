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
})
