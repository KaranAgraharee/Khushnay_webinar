import { useCallback, useState } from 'react'
import { registerForWebinar } from '../api/registration.js'
import { createPaymentOrder, verifyPayment } from '../api/payment.js'
import { ApiError } from '../api/client.js'
import { getUserFriendlyError, SUCCESS_MESSAGES } from '../utils/errorMessages.js'
import { loadRazorpayScript, openRazorpayCheckout } from '../utils/razorpay.js'
import { useWebinar } from '../context/WebinarContext.jsx'

export function useRegisterWebinar() {
  const { webinar, loading: webinarLoading } = useWebinar()
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)

  /**
   * Main registration function.
   * @param {{ name: string, phone: string, email: string }} profile
   */
  const register = useCallback(async (profile) => {
    const { name, phone, email } = profile || {}

    if (webinarLoading) {
      setStatus('loading')
      setMessage('Loading webinar details…')
      return
    }

    if (!webinar?._id) {
      setStatus('error')
      setMessage('No webinar is available for registration right now. Please refresh.')
      return
    }

    if (!name?.trim() || !phone?.trim() || !email?.trim()) {
      setStatus('error')
      setMessage('Please fill in all fields: name, phone, and email.')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const isFree = Number(webinar.price ?? 0) <= 0

      if (isFree) {
        const result = await registerForWebinar(webinar._id, { name: name.trim(), phone: phone.trim(), email: email.trim() })

        if (result.alreadyRegistered) {
          setIsRegistered(true)
          setStatus('success')
          setMessage(SUCCESS_MESSAGES.alreadyRegistered)
          return
        }

        setIsRegistered(true)
        setStatus('success')
        setMessage(SUCCESS_MESSAGES.registered)
        return
      }

      // Paid webinar: create Razorpay order
      const orderResult = await createPaymentOrder(webinar._id, {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
      })

      if (orderResult.alreadyRegistered) {
        setIsRegistered(true)
        setStatus('success')
        setMessage(SUCCESS_MESSAGES.alreadyRegistered)
        return
      }

      const order = orderResult.data

      if (!order?.orderId || !order?.key) {
        throw new ApiError(
          getUserFriendlyError(null, { context: 'payment' }),
          502,
          orderResult
        )
      }

      await loadRazorpayScript()

      openRazorpayCheckout({
        order,
        profile: { name: name.trim(), email: email.trim(), phone: phone.trim() },
        onDismiss: () => {
          setStatus('idle')
          setMessage(SUCCESS_MESSAGES.paymentCancelled)
        },
        onSuccess: async (response) => {
          try {
            setStatus('loading')
            const verified = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              webinarId: webinar._id,
              name: name.trim(),
              email: email.trim(),
              phone: phone.trim(),
            })

            setIsRegistered(true)
            setStatus('success')
            setMessage(
              verified.data?.registration
                ? SUCCESS_MESSAGES.paymentSuccess
                : SUCCESS_MESSAGES.paymentAlreadyVerified
            )
          } catch (err) {
            setStatus('error')
            setMessage(
              getUserFriendlyError(err, {
                context: 'payment',
                fallback: 'Payment verification failed. Please contact support if you were charged.',
              })
            )
          }
        },
      })

      setStatus('idle')
      setMessage(SUCCESS_MESSAGES.paymentPending)
    } catch (err) {
      setStatus('error')
      setMessage(
        getUserFriendlyError(err, {
          context: 'registration',
          fallback: 'Registration could not be completed. Please try again.',
        })
      )
    }
  }, [webinar, webinarLoading])

  const reset = useCallback(() => {
    setStatus('idle')
    setMessage('')
  }, [])

  return {
    register,
    status,
    message,
    reset,
    webinar,
    isRegistered,
    webinarLoading,
  }
}
