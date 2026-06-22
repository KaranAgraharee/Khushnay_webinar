import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { adminLogin as apiAdminLogin } from '../api/admin.js'

const AdminContext = createContext(null)

const TOKEN_KEY = 'admin_jwt_token'

const isTokenValid = (token) => {
  if (!token) return false
  try {
    // Decode payload (no verify — server handles that)
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export function AdminProvider({ children }) {
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem(TOKEN_KEY)
    return isTokenValid(stored) ? stored : null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isAuthenticated = useMemo(() => isTokenValid(token), [token])

  const adminEmail = useMemo(() => {
    if (!token) return null
    try {
      return JSON.parse(atob(token.split('.')[1]))?.email || null
    } catch {
      return null
    }
  }, [token])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiAdminLogin(email, password)
      const jwt = result.data?.token
      if (!jwt) throw new Error('No token received')
      localStorage.setItem(TOKEN_KEY, jwt)
      setToken(jwt)
      return true
    } catch (err) {
      setError(err.message || 'Login failed')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }, [])

  // Auto-invalidate expired token on focus
  useEffect(() => {
    const check = () => {
      const stored = localStorage.getItem(TOKEN_KEY)
      if (!isTokenValid(stored)) {
        setToken(null)
        localStorage.removeItem(TOKEN_KEY)
      }
    }
    window.addEventListener('focus', check)
    return () => window.removeEventListener('focus', check)
  }, [])

  const value = useMemo(
    () => ({ token, isAuthenticated, adminEmail, login, logout, loading, error }),
    [token, isAuthenticated, adminEmail, login, logout, loading, error]
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}
