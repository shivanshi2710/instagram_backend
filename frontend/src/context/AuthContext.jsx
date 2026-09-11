import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/auth'
import { usersApi } from '../api/users'
import { getUserIdFromToken, isTokenExpired } from '../utils/jwt'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async (userId) => {
    const { data } = await usersApi.getById(userId)
    setUser(data)
    localStorage.setItem('user', JSON.stringify(data))
    return data
  }, [])

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('access_token')
      if (token && !isTokenExpired(token)) {
        try {
          const userId = getUserIdFromToken(token)
          if (userId) await fetchUser(userId)
        } catch {
          localStorage.removeItem('access_token')
          localStorage.removeItem('user')
          setUser(null)
        }
      } else if (token) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        setUser(null)
      }
      setLoading(false)
    }
    init()
  }, [fetchUser])

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials)
    localStorage.setItem('access_token', data.access_token)
    const userId = getUserIdFromToken(data.access_token)
    const userData = await fetchUser(userId)
    return userData
  }

  const register = async (userData) => {
    const { data } = await authApi.register(userData)
    return data
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const updateUser = (data) => {
    setUser(data)
    localStorage.setItem('user', JSON.stringify(data))
  }

  const refreshUser = async () => {
    if (user?.id) return fetchUser(user.id)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, refreshUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
