import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getWebinars } from '../api/webinars.js'
import { Webinar_info } from '../assets/Constants/Detail.js'
import { getWebinarDateTime } from '../utils/webinar.js'
import { getUserFriendlyError } from '../utils/errorMessages.js'

const WebinarContext = createContext(null)

export function WebinarProvider({ children }) {
  const [webinars, setWebinars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchWebinars = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getWebinars()
      setWebinars(result.data ?? [])
    } catch (err) {
      setError(
        getUserFriendlyError(err, {
          context: 'webinar',
          fallback: 'Could not load webinar details. Please refresh the page.',
        })
      )
      setWebinars([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWebinars()
  }, [fetchWebinars])

  const webinar = useMemo(() => {
    if (!webinars.length) return null

    const upcoming = [...webinars].sort(
      (a, b) => getWebinarDateTime(a) - getWebinarDateTime(b)
    )

    return upcoming[0]
  }, [webinars])

  const fallbackDate = useMemo(() => new Date(Webinar_info.Date), [])

  const value = useMemo(
    () => ({
      webinar,
      webinars,
      loading,
      error,
      refetch: fetchWebinars,
      fallbackDate,
      hasWebinar: Boolean(webinar),
    }),
    [webinar, webinars, loading, error, fetchWebinars, fallbackDate]
  )

  return (
    <WebinarContext.Provider value={value}>{children}</WebinarContext.Provider>
  )
}

export function useWebinar() {
  const context = useContext(WebinarContext)
  if (!context) {
    throw new Error('useWebinar must be used within WebinarProvider')
  }
  return context
}
