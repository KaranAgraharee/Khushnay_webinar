import { toUserFriendlyApiMessage } from '../utils/errorMessages.js'

const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

function buildApiUrl(path) {
  if (typeof path !== 'string' || !path.trim()) {
    throw new Error(`apiRequest requires a non-empty path, received: ${String(path)}`)
  }

  const trimmed = path.trim()

  if (/^https?:\/\//i.test(trimmed)) {
    const url = new URL(trimmed)
    if (!url.pathname || url.pathname === '/') {
      throw new Error(
        `API URL must include a route (e.g. /api/admin/login). Got: ${trimmed}`
      )
    }
    return url.toString()
  }

  const pathname = trimmed.startsWith('/') ? trimmed : `/${trimmed}`

  if (!pathname.startsWith('/api')) {
    throw new Error(`API path must start with /api. Got: ${pathname}`)
  }

  if (!API_BASE) {
    return pathname
  }

  return new URL(pathname, `${API_BASE}/`).toString()
}

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

const TOKEN_KEY = 'admin_jwt_token'

/**
 * @param {string} path
 * @param {{
 *   method?: string,
 *   body?: unknown,
 *   adminAuth?: boolean,   // attach admin JWT from localStorage
 * }} [options]
 */
export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, adminAuth = false } = options
  const headers = { 'Content-Type': 'application/json' }

  if (adminAuth) {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const url = buildApiUrl(path)

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: 'include',
      redirect: 'manual',
    })

    if (response.type === 'opaqueredirect' || response.status === 301 || response.status === 302) {
      throw new ApiError(
        toUserFriendlyApiMessage(
          'API redirected instead of returning JSON',
          response.status,
          { path }
        ),
        response.status,
        {}
      )
    }

    const payload = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new ApiError(
        toUserFriendlyApiMessage(payload.message, response.status, { path }),
        response.status,
        payload
      )
    }

    return payload
  } catch (networkError) {
    if (networkError instanceof ApiError) throw networkError

    throw new ApiError(
      toUserFriendlyApiMessage(String(networkError?.message || 'Network error'), 0, {
        path,
      }),
      0,
      {}
    )
  }
}
