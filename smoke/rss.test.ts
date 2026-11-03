import { XMLParser, XMLValidator } from 'fast-xml-parser'
import { describe, expect, test } from 'vitest'
import { get } from './http'
import { postPaths } from './site'

type Item = { title: string; link: string; description: string }

async function feed() {
  let page = await get('/rss')
  expect(page.status).toBe(200)
  return page
}

function items(xml: string): Item[] {
  let channel = new XMLParser({ processEntities: true }).parse(xml).rss.channel
  return [channel.item ?? []].flat()
}

describe('RSS feed', () => {
  test('parses as valid XML', async () => {
    let { body } = await feed()
    expect(XMLValidator.validate(body)).toBe(true)
  })

  test("has an item for every Post, titled exactly as the Post's page", async () => {
    let { body } = await feed()
    let byLink = new Map(items(body).map((item) => [new URL(item.link).pathname, item]))
    let paths = await postPaths()
    expect(paths.length).toBeGreaterThan(0)

    for (let path of paths) {
      let page = await get(path)
      expect(byLink.get(path)?.title).toBe(page.html.querySelector('h1')?.text)
    }
  })
})
