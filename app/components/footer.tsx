import { email, externalLinkProps, github, linkedin } from 'app/links'

function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  )
}

const mainLinks = [linkedin, email, github]

const minorLinks = [
  { label: 'rss', href: '/rss' },
  { label: 'view source', href: 'https://github.com/MylesJPritchett/mylesp.com' },
]

export default function Footer() {
  return (
    <footer className="mb-16">
      <ul className="font-sm mt-8 flex flex-col space-x-0 space-y-5 text-neutral-600 md:flex-row md:space-x-4 md:space-y-0 dark:text-neutral-300">
        {mainLinks.map(({ label, href }) => (
          <li key={href}>
            <a
              className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
              href={href}
              {...externalLinkProps(href)}
            >
              <ArrowIcon />
              <p className="ml-2 h-7">{label}</p>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-8 flex flex-wrap gap-x-3 text-sm text-neutral-500 dark:text-neutral-400">
        <span>© {new Date().getFullYear()} MIT Licensed</span>
        {minorLinks.map(({ label, href }) => (
          <a
            key={href}
            className="transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
            href={href}
            {...externalLinkProps(href)}
          >
            {label}
          </a>
        ))}
      </p>
    </footer>
  )
}
