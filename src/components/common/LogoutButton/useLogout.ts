'use client'

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
