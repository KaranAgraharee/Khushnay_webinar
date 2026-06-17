import { apiRequest } from './client.js'

export function syncAuthUser(getToken, profile = {}) {
  return apiRequest('/api/auth/sync', {
    method: 'POST',
    body: profile,
    getToken,
  })
}
