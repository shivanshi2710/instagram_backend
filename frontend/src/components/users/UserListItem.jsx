import { Link } from 'react-router-dom'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'

export default function UserListItem({ user, isFollowing, onFollow, onUnfollow, loading }) {
  return (
    <div className="flex items-center gap-3 py-3 px-1 animate-fade-in">
      <Link to={`/profile/${user.username}`}>
        <Avatar name={user.full_name || user.username} size="md" />
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/profile/${user.username}`} className="block">
          <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate hover:opacity-70 transition-opacity">
            {user.username}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user.full_name}</p>
        </Link>
      </div>
      {onFollow && onUnfollow && (
        <Button
          variant={isFollowing ? 'outline' : 'primary'}
          size="sm"
          loading={loading}
          onClick={() => (isFollowing ? onUnfollow(user.id) : onFollow(user.id))}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Button>
      )}
    </div>
  )
}
