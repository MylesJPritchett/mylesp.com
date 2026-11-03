import { BlogPosts } from 'app/components/posts'
import { ProjectList } from 'app/components/projects'

const resumeHref = '/Myles-Pritchett-Resume.pdf'

const contactLinks = [
  { label: 'email', href: 'mailto:mylesjpritchett@gmail.com' },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/myles-pritchett/' },
  { label: 'github', href: 'https://github.com/MylesJPritchett/' },
]

const experience = [
  {
    title: 'Fullstack Software Engineer',
    employer: 'Zion Metrics',
    dates: 'Jan 2026 – Nov 2026',
    outcomes:
      'Designed the event-driven architecture of a real-time routing and scheduling system in TypeScript, Deno and MongoDB. Replaced a multi-hour manual data import with a 5-minute automated pipeline, and cut linting errors by 90% across 250+ files.',
  },
  {
    title: 'Software Developer',
    employer: 'Unicard Systems',
    dates: 'Apr 2023 – Jan 2026',
    outcomes:
      'Co-led a full-stack TypeScript and Next.js app on AWS Lambda microservices. Built an event tracking API on Amazon SNS that cut data processing time by 43%, and cut running costs by up to 30% by moving to serverless.',
  },
  {
    title: 'Software Support and Deployment',
    employer: 'Unicard Systems',
    dates: 'Apr 2022 – Apr 2023',
    outcomes:
      'Cut deployment time by 39% by streamlining the deployment process, and resolved client support cases within a 24-hour turnaround.',
  },
  {
    title: 'Software Developer and Support',
    employer: 'Lymlive Media',
    dates: 'Oct 2021 – Feb 2022',
    outcomes: 'Closed a backlog of over 200 open support cases within 2 months.',
  },
]

const linkClass =
  'underline decoration-neutral-400 underline-offset-2 transition-all hover:text-neutral-800 hover:decoration-neutral-800 dark:decoration-neutral-600 dark:hover:text-neutral-100 dark:hover:decoration-neutral-100'

const sectionHeadingClass = 'mb-4 font-semibold tracking-tight'

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

function Experience() {
  return (
    <section id="experience" className="my-8">
      <h2 className={sectionHeadingClass}>Experience</h2>
      <ol>
        {experience.map(({ title, employer, dates, outcomes }) => (
          <li key={`${employer} ${dates}`} className="mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:gap-4">
              <p className="text-neutral-900 tracking-tight dark:text-neutral-100">
                {title}, {employer}
              </p>
              <p className="shrink-0 text-neutral-600 tabular-nums dark:text-neutral-400">
                {dates}
              </p>
            </div>
            <p className="mt-1 text-neutral-600 dark:text-neutral-400">
              {outcomes}
            </p>
          </li>
        ))}
      </ol>
      <a className={linkClass} href={resumeHref} download>
        Full resume
      </a>
    </section>
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
      <p className="mb-4">
        I build full-stack web applications end to end: React and Next.js
        frontends, and event-driven backends on Node.js, Deno and AWS
        serverless. Most recently I designed the event architecture behind a
        real-time routing and scheduling system. I'm looking for a fullstack
        role on a product team where I can own features from design through to
        production.
      </p>
      <Experience />
      <section className="my-8">
        <h2 className={sectionHeadingClass}>Projects</h2>
        <ProjectList />
      </section>
      <section className="my-8">
        <h2 className={sectionHeadingClass}>Posts</h2>
        <BlogPosts />
      </section>
    </section>
  )
}
