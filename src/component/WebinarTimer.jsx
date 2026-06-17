import { useEffect, useMemo, useState } from 'react'
import { StaggerItem, StaggerReveal } from '../assets/animations/reveal.jsx'
import { useWebinar } from '../context/WebinarContext.jsx'
import { getWebinarDateTime } from '../utils/webinar.js'

const getTimeLeft = (targetMs) => {
  const diff = targetMs - Date.now()
  if (diff <= 0) return null

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

const pad = (value) => String(value).padStart(2, '0')

const WebinarTimer = () => {
  const { webinar, fallbackDate } = useWebinar()

  const targetMs = useMemo(() => {
    const date = webinar ? getWebinarDateTime(webinar) : fallbackDate
    return date.getTime()
  }, [webinar, fallbackDate])

  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetMs))

  useEffect(() => {
    setTimeLeft(getTimeLeft(targetMs))

    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetMs))
    }, 1000)

    return () => clearInterval(interval)
  }, [targetMs])

  if (!timeLeft) {
    return (
      <div className="webinar-timer webinar-timer-live" aria-live="polite">
        <span className="timer-label">Webinar</span>
        <span className="timer-live-text">Live now</span>
      </div>
    )
  }

  const units = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hrs' },
    { value: timeLeft.minutes, label: 'Min' },
    { value: timeLeft.seconds, label: 'Sec' },
  ]

  return (
    <div className="webinar-timer" aria-live="polite" aria-label="Countdown to webinar">
      <span className="timer-label">Starts in</span>
      <StaggerReveal className="timer-units" animateOnMount>
        {units.map(({ value, label }) => (
          <StaggerItem key={label} variant="textReveal" className="timer-unit">
            <span className="timer-value">{pad(value)}</span>
            <span className="timer-unit-label">{label}</span>
          </StaggerItem>
        ))}
      </StaggerReveal>
    </div>
  )
}

export default WebinarTimer
