import { useState, useEffect } from 'react'
import { usersApi } from '../api/users'
import { followApi } from '../api/follow'
import { getErrorMessage } from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import UserListItem from '../components/users/UserListItem'
import Input from '../components/ui/Input'
import { PageLoader } from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'

export default function SearchUsers() {
  const [users, setUsers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [query, setQuery] = useState('')
  const [followingIds, setFollowingIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const { user: currentUser } = useAuth()
  const toast = useToast()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [{ data: allUsers }, { data: following }] = await Promise.all([
          usersApi.getAll(),
          followApi.getFollowing(currentUser.id),
        ])
        const others = allUsers.filter((u) => u.id !== currentUser.id)
        setUsers(others)
        setFiltered(others)
        setFollowingIds(new Set(following.map((u) => u.id)))
      } catch (err) {
        toast.error(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [currentUser?.id])

  useEffect(() => {
    if (!query.trim()) {
      setFiltered(users)
      return
    }
    const q = query.toLowerCase()
    setFiltered(users.filter(
      (u) => u.username.toLowerCase().includes(q) || u.full_name.toLowerCase().includes(q)
    ))
  }, [query, users])

  const handleFollow = async (userId) => {
    setActionLoading(userId)
    try {
      await followApi.follow(userId)
      setFollowingIds((prev) => new Set(prev).add(userId))
      toast.success('Followed!')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setActionLoading(null)
    }
  }

  const handleUnfollow = async (userId) => {
    setActionLoading(userId)
    try {
      await followApi.unfollow(userId)
      setFollowingIds((prev) => { const s = new Set(prev); s.delete(userId); return s })
      toast.success('Unfollowed')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) return <PageLoader />

  return (
    <div className="animate-fade-in">
      <h1 className="text-xl font-semibold mb-6">Search</h1>

      <div className="mb-6">
        <Input
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No users found"
          description={query ? 'Try a different search term.' : 'No other users yet.'}
        />
      ) : (
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {filtered.map((user) => (
            <UserListItem
              key={user.id}
              user={user}
              isFollowing={followingIds.has(user.id)}
              onFollow={handleFollow}
              onUnfollow={handleUnfollow}
              loading={actionLoading === user.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
