import { useAuth, useUser } from '@clerk/react'
import { useEffect, useRef } from 'react'
import { syncAuthUser } from '../api/auth.js'

export function useSyncAuthUser() {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const { user } = useUser()
  const syncedUserIdRef = useRef(null)
  const syncingRef = useRef(false)

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id) return
    if (syncedUserIdRef.current === user.id || syncingRef.current) return

    const profile = {
      email: user.primaryEmailAddress?.emailAddress,
      name: user.fullName || user.username || '',
    }

    syncingRef.current = true

    const runSync = async () => {
      try {
        const token = await getToken()
        if (!token) {
          console.warn('Clerk session token not ready yet; retrying sync…')
          return
        }

        await syncAuthUser(() => Promise.resolve(token), profile)
        syncedUserIdRef.current = user.id
      } catch (error) {
        console.error('Failed to sync user with server:', error)
      } finally {
        syncingRef.current = false
      }
    }

    runSync()
  }, [isLoaded, isSignedIn, user, getToken])

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      syncedUserIdRef.current = null
    }
  }, [isLoaded, isSignedIn])
}
