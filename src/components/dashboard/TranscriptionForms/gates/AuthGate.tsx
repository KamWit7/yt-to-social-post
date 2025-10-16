'use client'

import { AnimatedSection } from '@/components/animation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/utils/constants'
import { Lock } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

interface AuthGateProps {
  children: React.ReactNode
}

type LoadingState = 'login' | 'register' | null

export function AuthGate({ children }: AuthGateProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loadingState, setLoadingState] = useState<LoadingState>(null)

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setLoadingState('login')
    router.push(ROUTES.LOGIN)
  }

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setLoadingState('register')
    router.push(ROUTES.REGISTER)
  }

  // Show loading spinner while checking session
  if (status === 'loading') {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600'></div>
      </div>
    )
  }

  // If user is authenticated, render children (PurposeForm)
  if (session?.user) {
    return <>{children}</>
  }

  // If user is not authenticated, show auth gate
  return (
    <AnimatedSection isVisible>
      <div className='text-center space-y-6'>
        {/* Animated Icon */}
        <div className='flex justify-center'>
          <div className='relative'>
            <div className='absolute inset-0 bg-blue-500/20 rounded-full animate-pulse'></div>
            <div className='relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full'>
              <Lock className='w-8 h-8 text-white animate-pulse' />
            </div>
          </div>
        </div>

        {/* Title and Description */}
        <div className='space-y-3'>
          <h3 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
            Dostęp do AI wymaga logowania
          </h3>
          <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>
            Aby skorzystać z funkcji przetwarzania AI, musisz się zalogować lub
            utworzyć konto
          </p>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-3 pt-2 max-w-md mx-auto'>
          <Button
            asChild
            variant='outline'
            className={cn(
              `flex-1 ${
                loadingState === 'login' ? 'opacity-50 cursor-not-allowed' : ''
              }`
            )}>
            <Link href={ROUTES.LOGIN} onClick={handleLoginClick}>
              Zaloguj się
            </Link>
          </Button>
          <Button
            asChild
            className={cn(
              `flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ${
                loadingState === 'register'
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`
            )}>
            <Link href={ROUTES.REGISTER} onClick={handleRegisterClick}>
              Zarejestruj się
            </Link>
          </Button>
        </div>
      </div>
    </AnimatedSection>
  )
}
