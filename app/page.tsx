import { BlogPosts } from 'app/components/posts'
import { PortfolioProjects } from 'app/components/projects'

const resumeHref = '/Myles-Pritchett-Resume.pdf'

const contactLinks = [
  { label: 'email', href: 'mailto:mylesjpritchett@gmail.com' },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/myles-pritchett/' },
  { label: 'github', href: 'https://github.com/MylesJPritchett/' },
]

const linkClass =
  'underline decoration-neutral-400 underline-offset-2 transition-all hover:text-neutral-800 hover:decoration-neutral-800 dark:decoration-neutral-600 dark:hover:text-neutral-100 dark:hover:decoration-neutral-100'

function ContactStrip() {
  return (
    <ul className="mb-8 flex flex-wrap gap-x-4 gap-y-2 text-neutral-600 dark:text-neutral-300">
      {contactLinks.map(({ label, href }) => (
        <li key={href}>
          <a
            className={linkClass}
            href={href}
            {...(href.startsWith('http') && {
              target: '_blank',
              rel: 'noopener noreferrer',
            })}
          >
            {label}
          </a>
        </li>
      ))}
      <li>
        <a className={linkClass} href={resumeHref} download>
          resume (pdf)
        </a>
      </li>
    </ul>
  )
}

export default function Page() {
  return (
    <section>
      <h1 className="mb-2 text-2xl font-semibold tracking-tighter">
        Myles Pritchett
      </h1>
      <p className="mb-4 text-lg tracking-tight text-neutral-800 dark:text-neutral-200">
        Fullstack Software Engineer in Sydney. TypeScript, Next.js, Rust. Open
        to new roles, available now.
      </p>
      <ContactStrip />
      <div className="my-8">
        <h2>Projects</h2>
        <PortfolioProjects />
        <br></br>
        <h2>Blog</h2>
        <BlogPosts />
      </div>
    </section>
  )
}
