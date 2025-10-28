'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useState } from 'react'

import { AnimatedSection } from '@/components/animation'
import { CredentialAuth } from './components/CredentialAuth'
import { GoogleAuth } from './components/GoogleAuth'

interface LoginFormProps {
  initialError?: string
}

export function LoginForm({ initialError }: LoginFormProps) {
  const [isAnyLoading, setIsAnyLoading] = useState(false)

  const handleLoadingChange = (loading: boolean) => {
    setIsAnyLoading(loading)
  }

  return (
    <AnimatedSection isVisible>
      <Card className='w-full max-w-md mx-auto my-2'>
        <CardHeader>
          <CardTitle>Zaloguj się</CardTitle>
          <CardDescription>
            wprowadź swój email i hasło, aby uzyskać dostęp do konta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CredentialAuth
            onLoadingChange={handleLoadingChange}
            isDisabled={isAnyLoading}
          />
          <GoogleAuth
            onLoadingChange={handleLoadingChange}
            isDisabled={isAnyLoading}
            initialError={initialError}
          />
        </CardContent>
      </Card>
    </AnimatedSection>
  )
}
