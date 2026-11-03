import { PortfolioProjects } from 'app/components/projects'

export const metadata = {
  title: 'Projects',
  description: 'Projects Myles Pritchett has built.',
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Projects</h1>
      <PortfolioProjects />
    </section>
  )
}
