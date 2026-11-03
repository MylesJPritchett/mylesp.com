import { BlogPosts } from 'app/components/posts'
import { PortfolioProjects } from 'app/components/projects'

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
