import { apiRequest } from './client.js'

export function getRegistrationStatus(webinarId, getToken) {
  const params = new URLSearchParams({ webinarId })
  return apiRequest(`/api/register/status?${params.toString()}`, { getToken })
}

export function registerForWebinar(webinarId, getToken, profile = {}) {
  return apiRequest('/api/register', {
    method: 'POST',
    body: { webinarId, ...profile },
    getToken,
  })
}
