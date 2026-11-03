// Where to reach Myles, shared by the home page contact strip and the footer.
// Each picks its own order.
export const email = { label: 'email', href: 'mailto:mylesjpritchett@gmail.com' }

export const linkedin = {
  label: 'linkedin',
  href: 'https://www.linkedin.com/in/myles-pritchett/',
}

export const github = { label: 'github', href: 'https://github.com/MylesJPritchett/' }

/**
 * Props for an `<a>` to the given href: http(s) links open in a new tab without
 * access to this page, everything else (mailto, same-site) opens as usual.
 */
export function externalLinkProps(href: string) {
  return /^https?:/.test(href)
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}
}
