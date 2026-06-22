import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext.jsx'

export default function AdminLogin() {
  const { login, loading, error } = useAdmin()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [formError, setFormError] = useState('')

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!form.email.trim() || !form.password) {
      setFormError('Email and password are required')
      return
    }

    const success = await login(form.email.trim(), form.password)
    if (success) {
      navigate('/admin/dashboard')
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-bg">
        <div className="admin-login-bg__orb admin-login-bg__orb--1" />
        <div className="admin-login-bg__orb admin-login-bg__orb--2" />
      </div>

      <div className="admin-login-card">
        <div className="admin-login-card__logo">
          <span className="admin-login-card__logo-icon">🛡️</span>
          <h1 className="admin-login-card__title">Admin Portal</h1>
          <p className="admin-login-card__subtitle">Webinar Management System</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit} noValidate>
          <div className="admin-field">
            <label htmlFor="admin-email">Email Address</label>
            <input
              id="admin-email"
              type="email"
              placeholder="admin@example.com"
              value={form.email}
              onChange={handleChange('email')}
              disabled={loading}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="admin-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange('password')}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {(formError || error) && (
            <div className="admin-login-error" role="alert">
              {formError || error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="admin-login-btn__spinner" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="admin-login-card__back">
          <a href="/">← Back to Webinar</a>
        </p>
      </div>
    </div>
  )
}
