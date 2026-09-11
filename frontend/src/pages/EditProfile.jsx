import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usersApi } from '../api/users'
import { getErrorMessage } from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'

export default function EditProfile() {
  const { user, updateUser } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    username: user?.username || '',
    bio: user?.bio || '',
    is_private: user?.is_private || false,
  })
  const [loading, setLoading] = useState(false)

  const update = (field) => (e) => {
    const value = field === 'is_private' ? e.target.checked : e.target.value
    setForm({ ...form, [field]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await usersApi.update({
        full_name: form.full_name,
        username: form.username,
        bio: form.bio || null,
        is_private: form.is_private,
      })
      updateUser(data)
      toast.success('Profile updated!')
      navigate(`/profile/${data.username}`)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <h1 className="text-xl font-semibold mb-6">Edit Profile</h1>

      <div className="flex justify-center mb-8">
        <Avatar name={form.full_name || form.username} size="xl" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full Name" value={form.full_name} onChange={update('full_name')} required />
        <Input label="Username" value={form.username} onChange={update('username')} required />
        <Textarea label="Bio" value={form.bio} onChange={update('bio')} rows={3} />

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_private}
            onChange={update('is_private')}
            className="w-4 h-4 rounded border-neutral-300 text-pink-500 focus:ring-pink-500"
          />
          <span className="text-sm text-neutral-700 dark:text-neutral-300">Private account</span>
        </label>

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading}>Save changes</Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
