'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useState } from 'react'

import { CredentialAuth } from './components/CredentialAuth'
import { GoogleAuth } from './components/GoogleAuth'

export function LoginForm() {
  const [isAnyLoading, setIsAnyLoading] = useState(false)

  const handleLoadingChange = (loading: boolean) => {
    setIsAnyLoading(loading)
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your email and password to access your account
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
        />
      </CardContent>
    </Card>
  )
}
