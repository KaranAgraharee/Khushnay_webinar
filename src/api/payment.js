import { apiRequest } from './client.js'

/**
 * Create a Razorpay order for a paid webinar.
 * @param {string} webinarId
 * @param {{ name: string, phone: string, email: string }} profile
 */
export function createPaymentOrder(webinarId, profile) {
  return apiRequest('/api/payment/create-order', {
    method: 'POST',
    body: { webinarId, ...profile },
  })
}

/**
 * Verify a completed Razorpay payment.
 * @param {{ razorpay_order_id, razorpay_payment_id, razorpay_signature, webinarId, name, email, phone }} payload
 */
export function verifyPayment(payload) {
  return apiRequest('/api/payment/verify', {
    method: 'POST',
    body: payload,
  })
}
