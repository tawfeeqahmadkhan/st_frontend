import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('ss_token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      api.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => { localStorage.removeItem('ss_token'); delete api.defaults.headers.common['Authorization'] })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const { token, user: userData } = res.data
    localStorage.setItem('ss_token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
    return userData
  }

  const register = async (fullName, email, password) => {
    const res = await api.post('/auth/register', { fullName, email, password })
    const { token, user: userData } = res.data
    localStorage.setItem('ss_token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
    return userData
  }

  const logout = () => {
    localStorage.removeItem('ss_token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  const refreshUser = async () => {
    const res = await api.get('/auth/me')
    setUser(res.data)
    return res.data
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
