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

export function openRazorpayCheckout({ order, user, onSuccess, onDismiss }) {
  // console.log("FULL ORDER:", order);
  // console.log("ORDER ID:", order.orderId);
  const options = {
    key: order.key,
    amount: Math.round(order.amount * 100),
    currency: order.currency || 'INR',
    name: 'Khushboo Webinar',
    description: 'Webinar registration',
    order_id: order.orderId,
    prefill: {
      name: user?.fullName || '',
      email: user?.primaryEmailAddress?.emailAddress || '',
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
