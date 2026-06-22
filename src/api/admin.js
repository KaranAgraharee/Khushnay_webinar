import { apiRequest } from './client.js'

export function adminLogin(email, password) {
  return apiRequest('/api/admin/login', {
    method: 'POST',
    body: { email, password },
  })
}

export function getDashboardStats() {
  return apiRequest('/api/admin/stats', { adminAuth: true })
}

export function getRegistrations(params = {}) {
  const query = new URLSearchParams()
  if (params.search) query.set('search', params.search)
  if (params.webinarId) query.set('webinarId', params.webinarId)
  if (params.paymentStatus) query.set('paymentStatus', params.paymentStatus)
  if (params.page) query.set('page', params.page)
  if (params.limit) query.set('limit', params.limit)

  const qs = query.toString()
  return apiRequest(`/api/admin/registrations${qs ? `?${qs}` : ''}`, {
    adminAuth: true,
  })
}

export function getRegistrationById(id) {
  return apiRequest(`/api/admin/registrations/${id}`, { adminAuth: true })
}

export function getAdminWebinars() {
  return apiRequest('/api/admin/webinars', { adminAuth: true })
}

export function exportRegistrationsCSV(params = {}) {
  const query = new URLSearchParams()
  if (params.webinarId) query.set('webinarId', params.webinarId)
  if (params.paymentStatus) query.set('paymentStatus', params.paymentStatus)

  const qs = query.toString()
  const url = `/api/admin/export${qs ? `?${qs}` : ''}`

  // For file download we need the full URL
  const token = localStorage.getItem('admin_jwt_token')
  const apiBase = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
  const fullUrl = apiBase ? `${apiBase}${url}` : url

  const a = document.createElement('a')
  a.href = fullUrl
  // Add token as query param for CSV since we can't set headers on anchor click
  a.href += (qs ? '&' : '?') + `token=${encodeURIComponent(token || '')}`
  a.download = 'registrations.csv'
  a.click()
}

// ─── Webinar CRUD ─────────────────────────────────────────────────────────────

export function createWebinar(data) {
  return apiRequest('/api/admin/webinars', {
    method: 'POST',
    body: data,
    adminAuth: true,
  })
}

export function updateWebinar(id, data) {
  return apiRequest(`/api/admin/webinars/${id}`, {
    method: 'PUT',
    body: data,
    adminAuth: true,
  })
}

export function deleteWebinar(id) {
  return apiRequest(`/api/admin/webinars/${id}`, {
    method: 'DELETE',
    adminAuth: true,
  })
}

export function togglePublish(id, isPublished) {
  return apiRequest(`/api/admin/webinars/${id}/publish`, {
    method: 'PATCH',
    body: { isPublished },
    adminAuth: true,
  })
}
