import { Webinar_info } from '../assets/Constants/Detail.js'

const TIME_PATTERN = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?$/i

export function parseWebinarTime(timeStr) {
  if (!timeStr) return { hours: 0, minutes: 0 }

  const match = String(timeStr).trim().match(TIME_PATTERN)
  if (!match) return { hours: 0, minutes: 0 }

  let hours = Number(match[1])
  const minutes = Number(match[2])
  const meridiem = match[4]?.toLowerCase()

  if (meridiem === 'pm' && hours < 12) hours += 12
  if (meridiem === 'am' && hours === 12) hours = 0

  return { hours, minutes }
}

export function getWebinarDateTime(webinar) {
  if (!webinar?.date) return new Date(Webinar_info.Date)

  const date = new Date(webinar.date)
  const { hours, minutes } = parseWebinarTime(webinar.time)

  date.setHours(hours, minutes, 0, 0)
  return date
}

export function formatWebinarDate(webinar, locale = 'en-IN') {
  return getWebinarDateTime(webinar).toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatWebinarTime(webinar, locale = 'en-IN') {
  const { hours, minutes } = parseWebinarTime(webinar?.time)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)

  return date.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatWebinarPrice(price) {
  if (!price || price <= 0) return 'Free'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}
