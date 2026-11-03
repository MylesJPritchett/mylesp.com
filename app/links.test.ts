import { describe, expect, test } from 'vitest'
import { externalLinkProps } from './links'

describe('externalLinkProps', () => {
  test.each(['https://www.linkedin.com/in/myles-pritchett/', 'http://example.com'])(
    '%s opens in a new tab without leaking the opener',
    (href) => {
      expect(externalLinkProps(href)).toEqual({
        target: '_blank',
        rel: 'noopener noreferrer',
      })
    }
  )

  test('a mailto link opens in the mail client, not a new tab', () => {
    expect(externalLinkProps('mailto:mylesjpritchett@gmail.com')).toEqual({})
  })
})
