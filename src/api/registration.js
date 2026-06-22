import { apiRequest } from './client.js'

/**
 * Register for a free webinar (no payment).
 * @param {string} webinarId
 * @param {{ name: string, phone: string, email: string }} profile
 */
export function registerForWebinar(webinarId, profile = {}) {
  return apiRequest('/api/register', {
    method: 'POST',
    body: { webinarId, ...profile },
  })
}
