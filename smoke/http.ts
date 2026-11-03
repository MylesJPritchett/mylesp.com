// Helpers for smoke tests: make a real HTTP request to the running site and
// parse the response body as HTML.
import { parse, type HTMLElement } from 'node-html-parser'
import { inject } from 'vitest'

export type Page = {
  status: number
  headers: Headers
  body: string
  html: HTMLElement
}

// Redirects are not followed, so tests can assert on them directly.
export async function get(path: string): Promise<Page> {
  let response = await fetch(new URL(path, inject('baseUrl')), {
    redirect: 'manual',
  })
  let body = await response.text()
  return {
    status: response.status,
    headers: response.headers,
    body,
    html: parse(body),
  }
}
