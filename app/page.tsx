import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        My Portfolio
      </h1>
      <p className="mb-4">
        {`I'm a Software Engineer and Fullstack Developer.
          I enjoy solving problems and am obsessed with finding efficiency in
          all things. I love to get lost in complicated things, and learning is my number
          one hobby. I have a wide breadth of knowledge and skills in many 
          areas both inside and outside software development.`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
