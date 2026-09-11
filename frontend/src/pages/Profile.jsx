import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { usersApi } from '../api/users'
import { postsApi } from '../api/posts'
import { followApi } from '../api/follow'
import { getErrorMessage } from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import PostGrid from '../components/posts/PostGrid'
import { PageLoader } from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'

export default function Profile() {
  const { username } = useParams()
  const { user: currentUser, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [followingIds, setFollowingIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [followLoading, setFollowLoading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const { data: userData } = await usersApi.getByUsername(username)
        setProfile(userData)

        if (currentUser?.username === username) {
          const { data: postsData } = await postsApi.getMine()
          setPosts(postsData)
        }

        if (currentUser) {
          const { data: following } = await followApi.getFollowing(currentUser.id)
          setFollowingIds(new Set(following.map((u) => u.id)))
        }
      } catch (err) {
        toast.error(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [username, currentUser?.id])

  const isFollowing = profile && followingIds.has(profile.id)

  const handleFollow = async () => {
    setFollowLoading(true)
    try {
      if (isFollowing) {
        await followApi.unfollow(profile.id)
        setFollowingIds((prev) => { const s = new Set(prev); s.delete(profile.id); return s })
        setProfile((p) => ({ ...p, followers_count: p.followers_count - 1 }))
        toast.success('Unfollowed')
      } else {
        await followApi.follow(profile.id)
        setFollowingIds((prev) => new Set(prev).add(profile.id))
        setProfile((p) => ({ ...p, followers_count: p.followers_count + 1 }))
        toast.success('Followed')
      }
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setFollowLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) return <PageLoader />

  if (!profile) {
    return (
      <EmptyState
        title="User not found"
        description="This account doesn't exist."
        action={<Link to="/search"><Button variant="secondary">Search users</Button></Link>}
      />
    )
  }

  const isOwn = currentUser?.id === profile.id

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-10 mb-8">
        <Avatar name={profile.full_name || profile.username} size="2xl" />

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <h1 className="text-xl font-light text-neutral-900 dark:text-neutral-100">{profile.username}</h1>
            <div className="flex gap-2">
              {isOwn ? (
                <>
                  <Link to="/profile/edit">
                    <Button variant="secondary" size="sm">Edit profile</Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>Log out</Button>
                </>
              ) : (
                <Button
                  variant={isFollowing ? 'outline' : 'primary'}
                  size="sm"
                  loading={followLoading}
                  onClick={handleFollow}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}
            </div>
          </div>

          <div className="flex justify-center sm:justify-start gap-6 mb-4 text-sm">
            <span><strong>{posts.length}</strong> posts</span>
            <Link to={`/profile/${profile.username}/followers`} className="hover:opacity-70 transition-opacity">
              <strong>{profile.followers_count}</strong> followers
            </Link>
            <Link to={`/profile/${profile.username}/following`} className="hover:opacity-70 transition-opacity">
              <strong>{profile.following_count}</strong> following
            </Link>
          </div>

          <div>
            <p className="font-semibold text-sm">{profile.full_name}</p>
            {profile.bio && <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">{profile.bio}</p>}
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
        <div className="flex justify-center gap-8 mb-4">
          <button className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-neutral-900 dark:text-neutral-100 border-t border-neutral-900 dark:border-neutral-100 -mt-4 pt-4">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 4h7v7H4V4zm0 9h7v7H4v-7zm9-9h7v7h-7V4zm0 9h7v7h-7v-7z" />
            </svg>
            Posts
          </button>
        </div>

        {isOwn ? (
          <PostGrid posts={posts} emptyMessage="No posts yet" />
        ) : (
          <EmptyState
            title="Posts unavailable"
            description="Posts from other users cannot be displayed with the current API."
          />
        )}
      </div>
    </div>
  )
}
