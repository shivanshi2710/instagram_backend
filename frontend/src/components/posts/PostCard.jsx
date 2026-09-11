import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../ui/Avatar'

export default function PostCard({ post, onDelete, showActions = true }) {
  const { user } = useAuth()

  return (
    <article className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden animate-fade-in">
      <div className="flex items-center gap-3 px-4 py-3">
        <Link to={`/profile/${user?.username}`}>
          <Avatar name={user?.full_name || user?.username} size="sm" gradient={false} />
        </Link>
        <Link to={`/profile/${user?.username}`} className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 hover:opacity-70 transition-opacity">
          {user?.username}
        </Link>
      </div>

      <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
        <img
          src={post.image_url}
          alt={post.caption}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
          loading="lazy"
        />
      </div>

      <div className="px-4 py-3 space-y-2">
        {post.caption && (
          <p className="text-sm text-neutral-900 dark:text-neutral-100">
            <span className="font-semibold mr-1.5">{user?.username}</span>
            {post.caption}
          </p>
        )}
        {post.content && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{post.content}</p>
        )}

        {showActions && (
          <div className="flex items-center gap-2 pt-1">
            <Link
              to={`/posts/${post.id}/edit`}
              className="text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors"
            >
              Edit
            </Link>
            {onDelete && (
              <button
                onClick={() => onDelete(post.id)}
                className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
