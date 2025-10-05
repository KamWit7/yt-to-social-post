'use client'

import { TRANSCRIPTION_FORMS_STORAGE_KEY } from '@/components/dashboard/Dashboard.helpers'
import { clearStateFromSessionStorage } from '@/utils/sessionStorage'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await signOut({
        callbackUrl: '/',
        redirect: true,
      })

      clearStateFromSessionStorage(TRANSCRIPTION_FORMS_STORAGE_KEY)
    } catch (error) {
      console.error('Error signing out:', error)
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    handleLogout,
  }
}
