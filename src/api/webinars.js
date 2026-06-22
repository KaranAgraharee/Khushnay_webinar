import { apiRequest } from './client.js'

export function getWebinars() {
  return apiRequest('/api/webinars')
}

export function getWebinarById(id) {
  return apiRequest(`/api/webinars/${id}`)
}
