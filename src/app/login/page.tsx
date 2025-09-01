import { LoginForm } from '@/components/auth/LoginForm'
import { ROUTES } from '@/utils/constants'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sign In | YT Scribe',
  description:
    'Sign in to your account to access your transcriptions and summaries',
}

export default function LoginPage() {
  return (
    <div className='container mx-auto max-w-md py-8'>
      <div className='space-y-6'>
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold'>Welcome Back</h1>
          <p className='text-muted-foreground'>
            Sign in to access your account and continue transcribing
          </p>
        </div>

        <LoginForm />

        <div className='text-center text-sm'>
          <span className='text-muted-foreground'>
            Don&apos;t have an account?{' '}
          </span>
          <Link
            href={ROUTES.REGISTER}
            className='text-primary hover:underline font-medium'>
            Create one here
          </Link>
        </div>
      </div>
    </div>
  )
}
