'use client'

import { Loader2, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

interface LogoutButtonProps {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function LogoutButton({
  variant = 'outline',
  size = 'default',
  className,
}: LogoutButtonProps) {
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

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
      className={className}>
      {isLoading ? (
        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
      ) : (
        <LogOut className='mr-2 h-4 w-4' />
      )}
      {isLoading ? 'Wylogowywanie...' : 'Wyloguj się'}
    </Button>
  )
}
