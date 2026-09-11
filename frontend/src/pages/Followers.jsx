import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { usersApi } from '../api/users'
import { followApi } from '../api/follow'
import { getErrorMessage } from '../api/axios'
import { useToast } from '../context/ToastContext'
import UserListItem from '../components/users/UserListItem'
import { PageLoader } from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'

export default function Followers() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [followers, setFollowers] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: user } = await usersApi.getByUsername(username)
        setProfile(user)
        const { data } = await followApi.getFollowers(user.id)
        setFollowers(data)
      } catch (err) {
        toast.error(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [username])

  if (loading) return <PageLoader />

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Link to={`/profile/${username}`} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-lg font-semibold">{profile?.username}&apos;s followers</h1>
      </div>

      {followers.length === 0 ? (
        <EmptyState title="No followers yet" description="When someone follows this account, they'll show up here." />
      ) : (
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {followers.map((user) => (
            <UserListItem key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  )
}
