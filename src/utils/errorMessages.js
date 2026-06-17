const EXACT_MESSAGES = {
  'webinarId is required': 'Something went wrong. Please refresh the page and try again.',
  'Webinar not available': 'This webinar is not open for registration right now.',
  'Webinar not available for registration': 'This webinar is not open for registration right now.',
  'No payment required for this webinar': 'No payment is needed for this webinar.',
  'You are already registered for this webinar': "You're already registered for this webinar.",
  'Payment is required before registration for this webinar':
    'Please complete payment to register for this webinar.',
  'Missing Razorpay payment verification fields':
    'Payment details were incomplete. Please try again or contact support.',
  'Invalid payment signature':
    'We could not verify your payment. If money was deducted, please contact support with your payment ID.',
  'Payment record not found':
    'We could not find your payment record. Please try registering again.',
  'Not authorized for this payment':
    'This payment belongs to a different account. Please sign in with the correct account.',
  'Webinar does not match payment order':
    'Something went wrong with your registration. Please try again.',
  'Unauthorized — sign in and try again': 'Please sign in to continue.',
  'Payment gateway is not configured on the server':
    'Payment is temporarily unavailable. Please try again later or contact support.',
  'Amount must be greater than zero':
    'This webinar is not set up for paid registration yet. Please try again later.',
  'Failed to create Razorpay order':
    'Payment service is temporarily unavailable. Please try again in a few minutes.',
  'Server Error': 'Something went wrong on our end. Please try again in a moment.',
  'Internal Server Error': 'Something went wrong on our end. Please try again in a moment.',
  'Failed to send email':
    "You're registered, but we couldn't send the confirmation email right now. Please check back shortly.",
  'Failed to load Razorpay checkout':
    'Could not open the payment window. Check your connection and try again.',
}

const PATTERN_MESSAGES = [
  {
    test: /resend|failed to send email|confirmation email|smtp|mailgun|sendgrid|invalid from|domain.*verif|email.*not.*verified/i,
    message:
      "You're registered, but we couldn't send the confirmation email right now. Please check back shortly or contact support.",
  },
  {
    test: /razorpay|payment gateway|create razorpay|checkout\.razorpay/i,
    message: 'Payment service is temporarily unavailable. Please try again in a few minutes.',
  },
  {
    test: /network|fetch failed|failed to fetch|load failed|econnrefused|econnreset|networkerror/i,
    message: 'Could not reach the server. Check your internet connection and try again.',
  },
  {
    test: /clerk|jwt|token|unauthorized|sign in|session expired/i,
    message: 'Your session expired. Please sign in and try again.',
  },
  {
    test: /mongodb|mongo|cast to objectid|validation failed|duplicate key/i,
    message: 'Something went wrong on our end. Please refresh and try again.',
  },
  {
    test: /internal server|server error|stack|syntaxerror|typeerror|unexpected token/i,
    message: 'Something went wrong on our end. Please try again in a moment.',
  },
  {
    test: /api redirected|check server clerk/i,
    message: 'Sign-in session issue. Please sign out, sign in again, and retry.',
  },
]

const STATUS_MESSAGES = {
  400: 'Please check your details and try again.',
  401: 'Please sign in to continue.',
  403: 'You do not have permission to do that.',
  404: 'We could not find that information. Please refresh the page.',
  408: 'The request took too long. Please try again.',
  429: 'Too many attempts. Please wait a moment and try again.',
  500: 'Something went wrong on our end. Please try again in a moment.',
  502: 'Service is temporarily unavailable. Please try again shortly.',
  503: 'Service is temporarily unavailable. Please try again shortly.',
}

export const SUCCESS_MESSAGES = {
  registered:
    "You're registered! We'll email you the confirmation details shortly.",
  alreadyRegistered: "You're already registered for this webinar.",
  paymentSuccess: "Payment successful! You're registered for the webinar.",
  paymentAlreadyVerified: "You're already registered — payment was confirmed earlier.",
  paymentPending: 'Complete payment in the Razorpay window to confirm registration.',
  paymentCancelled: 'Payment cancelled. Complete payment to confirm your seat.',
}

function isTechnicalMessage(message) {
  if (typeof message !== 'string') return true

  return (
    message.length > 120 ||
    /Error:|ECONNREFUSED|E11000|at\s+\w+|\.js:\d+|undefined|null pointer|\{"|stack|razorpay\.com|api\./i.test(
      message
    )
  )
}

function mapRawMessage(rawMessage) {
  if (!rawMessage || typeof rawMessage !== 'string') return null

  const trimmed = rawMessage.trim()
  if (EXACT_MESSAGES[trimmed]) return EXACT_MESSAGES[trimmed]

  for (const { test, message } of PATTERN_MESSAGES) {
    if (test.test(trimmed)) return message
  }

  return null
}

/**
 * @param {unknown} error
 * @param {{ fallback?: string, context?: string }} [options]
 */
export function getUserFriendlyError(error, options = {}) {
  const { fallback = 'Something went wrong. Please try again.', context } = options

  if (!error) return fallback

  const status = typeof error?.status === 'number' ? error.status : undefined
  const rawMessage =
    typeof error === 'string'
      ? error
      : error?.message || error?.payload?.message || ''

  const mapped = mapRawMessage(rawMessage)
  if (mapped) return mapped

  if (status && STATUS_MESSAGES[status]) {
    if (status >= 500 || !rawMessage || isTechnicalMessage(rawMessage)) {
      return STATUS_MESSAGES[status]
    }
  }

  if (status === 0) {
    return STATUS_MESSAGES[408] || 'Could not reach the server. Check your internet connection and try again.'
  }

  if (context === 'payment') {
    return 'Payment could not be completed. Please try again or contact support if you were charged.'
  }

  if (context === 'registration') {
    return 'Registration could not be completed. Please try again.'
  }

  if (context === 'webinar') {
    return 'Could not load webinar details. Please refresh the page.'
  }

  if (context === 'auth') {
    return 'Could not sync your account. Please sign in again.'
  }

  return fallback
}

/**
 * @param {string | undefined} rawMessage
 * @param {number} status
 * @param {{ path?: string }} [meta]
 */
export function toUserFriendlyApiMessage(rawMessage, status, meta = {}) {
  const context = meta.path?.includes('payment')
    ? 'payment'
    : meta.path?.includes('register')
      ? 'registration'
      : meta.path?.includes('webinar')
        ? 'webinar'
        : meta.path?.includes('auth')
          ? 'auth'
          : undefined

  return getUserFriendlyError(
    { message: rawMessage, status, payload: { path: meta.path } },
    {
      fallback: STATUS_MESSAGES[status] || 'Something went wrong. Please try again.',
      context,
    }
  )
}
