import { Link } from 'react-router-dom'

export default function PostGrid({ posts, emptyMessage = 'No posts yet' }) {
  if (!posts?.length) {
    return (
      <div className="text-center py-12 text-neutral-500 dark:text-neutral-400 text-sm">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-1 md:gap-1.5">
      {posts.map((post, i) => (
        <Link
          key={post.id}
          to={`/posts/${post.id}/edit`}
          className="relative aspect-square bg-neutral-100 dark:bg-neutral-800 overflow-hidden group animate-fade-in"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <img
            src={post.image_url}
            alt={post.caption}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <span className="text-white text-xs font-medium truncate px-2">{post.caption}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
