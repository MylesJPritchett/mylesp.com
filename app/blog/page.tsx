import { PostList } from 'app/components/posts'

export const metadata = {
  title: 'Posts',
  description: 'Posts by Myles Pritchett.',
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Posts</h1>
      <PostList />
    </section>
  )
}
