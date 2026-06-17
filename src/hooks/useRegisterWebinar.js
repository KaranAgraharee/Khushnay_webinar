import { useCallback, useEffect, useState } from 'react'
import { useAuth, useClerk, useUser } from '@clerk/react'
import {
  getRegistrationStatus,
  registerForWebinar,
} from '../api/registration.js'
import { createPaymentOrder, verifyPayment } from '../api/payment.js'
import { ApiError } from '../api/client.js'
import { getUserFriendlyError, SUCCESS_MESSAGES } from '../utils/errorMessages.js'
import { loadRazorpayScript, openRazorpayCheckout } from '../utils/razorpay.js'
import { useWebinar } from '../context/WebinarContext.jsx'

export function useRegisterWebinar() {
  const { getToken, isSignedIn, isLoaded: isAuthLoaded } = useAuth()
  const { openSignIn } = useClerk()
  const { user } = useUser()
  const { webinar, loading: webinarLoading } = useWebinar()
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    if (!webinar?._id || !isAuthLoaded || !isSignedIn) {
      setIsRegistered(false)
      return
    }

    let cancelled = false

    getRegistrationStatus(webinar._id, getToken)
      .then((result) => {
        if (cancelled) return

        if (result.data?.isRegistered) {
          setIsRegistered(true)
          setStatus('success')
          setMessage(SUCCESS_MESSAGES.alreadyRegistered)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsRegistered(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [webinar?._id, isAuthLoaded, isSignedIn, getToken])

  const register = useCallback(async () => {
    if (!isAuthLoaded) {
      setStatus('loading')
      setMessage('Checking authentication status…')
      return
    }

    if (webinarLoading) {
      setStatus('loading')
      setMessage('Loading webinar details…')
      return
    }

    if (!webinar?._id) {
      setStatus('error')
      setMessage('No webinar is available for registration right now. Please wait a moment and refresh.')
      return
    }

    if (!isSignedIn) {
      openSignIn()
      return
    }

    if (isRegistered) {
      setStatus('success')
      setMessage(SUCCESS_MESSAGES.alreadyRegistered)
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const isFree = Number(webinar.price ?? 0) <= 0

      if (isFree) {
        const registrationResult = await registerForWebinar(webinar._id, getToken, {
          email: user?.primaryEmailAddress?.emailAddress,
          name: user?.fullName || user?.username || '',
        })

        if (registrationResult.alreadyRegistered) {
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

      const orderResult = await createPaymentOrder(webinar._id, getToken)

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
        user,
        onDismiss: () => {
          setStatus('idle')
          setMessage(SUCCESS_MESSAGES.paymentCancelled)
        },
        onSuccess: async (response) => {
          try {
            setStatus('loading')
            const verified = await verifyPayment(
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                webinarId: webinar._id,
              },
              getToken
            )

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
                fallback:
                  'Payment verification failed. Please contact support if you were charged.',
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
  }, [webinar, isSignedIn, isAuthLoaded, webinarLoading, openSignIn, getToken, user, isRegistered])

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
    isAuthLoaded,
    webinarLoading,
  }
}
