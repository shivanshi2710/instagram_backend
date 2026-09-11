import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useTheme } from '../context/ThemeContext'
import { getErrorMessage } from '../api/axios'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Button from '../components/ui/Button'

export default function Register() {
  const [form, setForm] = useState({
    full_name: '',
    username: '',
    email: '',
    bio: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const toast = useToast()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register({
        ...form,
        email: form.email || null,
        bio: form.bio || null,
      })
      toast.success('Account created! Please log in.')
      navigate('/login')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  return (
    <div className="w-full max-w-[350px] animate-fade-in">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 mb-4">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-3xl font-bold gradient-text">InstaGram</h1>
          <button onClick={toggleTheme} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            {isDark ? (
              <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mb-6">
          Sign up to see photos and videos from your friends.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input placeholder="Full Name" value={form.full_name} onChange={update('full_name')} required />
          <Input placeholder="Username" value={form.username} onChange={update('username')} required autoComplete="username" />
          <Input type="email" placeholder="Email" value={form.email} onChange={update('email')} autoComplete="email" />
          <Textarea placeholder="Bio" value={form.bio} onChange={update('bio')} rows={2} />
          <Input type="password" placeholder="Password" value={form.password} onChange={update('password')} required autoComplete="new-password" />
          <Button type="submit" loading={loading} className="w-full" size="lg">
            Sign up
          </Button>
        </form>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 text-center text-sm">
        <span className="text-neutral-600 dark:text-neutral-400">Have an account? </span>
        <Link to="/login" className="font-semibold text-pink-500 hover:text-pink-600 transition-colors">
          Log in
        </Link>
      </div>
    </div>
  )
}
