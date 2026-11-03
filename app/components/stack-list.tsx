import type { Stack } from 'app/content'

/** A Project's Stack as a flat list of technologies, in Layer order. */
export function StackList({ title, stack }: { title: string; stack?: Stack }) {
  if (!stack) return null

  return (
    <ul
      aria-label={`${title} Stack`}
      className="flex flex-wrap justify-center md:justify-start gap-1.5 md:pl-[116px] text-xs text-neutral-600 dark:text-neutral-400"
    >
      {stack.flatMap(({ layer, technologies }) =>
        technologies.map((technology) => (
          <li
            key={`${layer}-${technology}`}
            className="rounded border border-neutral-200 dark:border-neutral-800 px-1.5 py-0.5"
          >
            {technology}
          </li>
        ))
      )}
    </ul>
  )
}
