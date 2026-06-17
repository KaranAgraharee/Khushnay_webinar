import { apiRequest } from './client.js'

export function getWebinars(getToken) {
  return apiRequest('/api/webinars', { getToken })
}

export function getWebinarById(id, getToken) {
  return apiRequest(`/api/webinars/${id}`, { getToken })
}
