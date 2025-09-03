'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { CredentialAuth } from './components/CredentialAuth'
import { GoogleAuth } from './components/GoogleAuth'

export function LoginForm() {
  const handleLoadingChange = (loading: boolean) => {
    // This function can be used to coordinate loading states between auth components
    // Currently not used but provides extensibility for future loading coordination
    console.log('Auth loading state:', loading)
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
        <CredentialAuth onLoadingChange={handleLoadingChange} />
        <GoogleAuth onLoadingChange={handleLoadingChange} />
      </CardContent>
    </Card>
  )
}
