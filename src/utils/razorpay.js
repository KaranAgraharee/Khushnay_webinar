export function loadRazorpayScript() {
  if (typeof window !== 'undefined' && window.Razorpay) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout'))
    document.body.appendChild(script)
  })
}

/**
 * @param {{
 *   order: { orderId: string, amount: number, currency: string, key: string },
 *   profile: { name: string, email: string, phone: string },
 *   onSuccess: (response: any) => void,
 *   onDismiss: () => void,
 * }} params
 */
export function openRazorpayCheckout({ order, profile, onSuccess, onDismiss }) {
  const options = {
    key: order.key,
    amount: Math.round(order.amount * 100),
    currency: order.currency || 'INR',
    name: 'Khushboo Webinar',
    description: 'Webinar registration',
    order_id: order.orderId,
    prefill: {
      name: profile?.name || '',
      email: profile?.email || '',
      contact: profile?.phone || '',
    },
    handler: onSuccess,
    modal: {
      ondismiss: onDismiss,
    },
  }

  const checkout = new window.Razorpay(options)
  checkout.open()
  return checkout
}
