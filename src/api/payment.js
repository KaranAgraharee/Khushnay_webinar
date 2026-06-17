import { apiRequest } from './client.js'

export function createPaymentOrder(webinarId, getToken) {
  return apiRequest('/api/payment/create-order', {
    method: 'POST',
    body: { webinarId },
    getToken,
  })
}

export function verifyPayment(payload, getToken) {
  return apiRequest('/api/payment/verify', {
    method: 'POST',
    body: payload,
    getToken,
  })
}
