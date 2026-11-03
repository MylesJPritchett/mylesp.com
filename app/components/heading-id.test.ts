import { createElement } from 'react'
import { describe, expect, test } from 'vitest'
import { headingId } from './heading-id'

describe('heading ids', () => {
  test('a plain heading slugs from its text', () => {
    expect(headingId('Why I Built This Website')).toBe('why-i-built-this-website')
  })

  test('a heading with inline code slugs from the code text too', () => {
    let children = ['Using ', createElement('code', { key: 'c' }, 'useState'), ' in React']
    expect(headingId(children)).toBe('using-usestate-in-react')
  })

  test('a heading with a link slugs from the link text', () => {
    let children = [
      'Built with ',
      createElement('a', { key: 'a', href: 'https://nextjs.org' }, 'Next.js'),
    ]
    expect(headingId(children)).toBe('built-with-nextjs')
  })
})
