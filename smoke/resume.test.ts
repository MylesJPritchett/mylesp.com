import { describe, expect, test } from 'vitest'
import { extractText } from 'unpdf'
import { inject } from 'vitest'

const resumePath = '/Myles-Pritchett-Resume.pdf'

// An Australian mobile number: 04 followed by eight digits, with any spacing
// or punctuation between them, optionally written with the +61 prefix.
const australianMobile = /(?:\+?61|0)[\s().-]*4(?:[\s().-]*\d){8}/

async function fetchResume() {
  return fetch(new URL(resumePath, inject('baseUrl')))
}

describe('resume', () => {
  test('is served as a PDF', async () => {
    let response = await fetchResume()
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toMatch(/^application\/pdf/)
  })

  test('contains no Australian mobile number', async () => {
    let response = await fetchResume()
    let bytes = new Uint8Array(await response.arrayBuffer())
    let { text } = await extractText(bytes, { mergePages: true })
    expect(text).toContain('Myles Pritchett')
    expect(text).not.toMatch(australianMobile)
  })
})
