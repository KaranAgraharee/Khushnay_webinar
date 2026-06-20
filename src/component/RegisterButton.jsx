import { CTA } from '../assets/Constants/Cta_footer'
import { MotionButton } from '../assets/animations/reveal.jsx'
import { useRegisterWebinar } from '../hooks/useRegisterWebinar.js'
import { formatWebinarPrice } from '../utils/webinar.js'

const Register = ({ className = 'btn btn-primary', label, pulse = false }) => {
  const {
    register,
    status,
    message,
    webinar,
    isRegistered,
    isAuthLoaded,
    webinarLoading,
  } = useRegisterWebinar()

  const buttonLabel = isRegistered
    ? 'Already registered ✓'
    : label ??
      (`${CTA.buttonText} · 33 `)

  const buttonText = !isAuthLoaded
    ? 'Checking authentication…'
    : webinarLoading
      ? 'Loading webinar…'
      : status === 'loading'
        ? 'Processing your registration…'
        : buttonLabel

  const isBusy = status === 'loading' || !isAuthLoaded || webinarLoading

  const statusClass =
    status === 'error'
      ? 'error'
      : status === 'success'
        ? 'success'
        : 'info'

  return (
    <div className="register-action">
      <MotionButton
        type="button"
        className={className}
        onClick={register}
        disabled={status === 'loading' || isRegistered || !isAuthLoaded || webinarLoading}
        pulse={pulse && !isRegistered}
      >
        {buttonText}
      </MotionButton>
      {message ? (
        <p className={`register-status register-status--${statusClass}`} role="status">
          {message}
        </p>
      ) : null}
    </div>
  )
}

export default Register
