import { isValidElement, type ReactNode } from 'react'

/** The text a reader sees in rendered children, ignoring the markup around it. */
function textContent(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textContent).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return textContent(node.props.children)
  }
  return ''
}

/**
 * The id for a heading, slugged from its text content so headings containing
 * inline code or links get the same id as their plain text would.
 */
export function headingId(children: ReactNode): string {
  return textContent(children)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}
