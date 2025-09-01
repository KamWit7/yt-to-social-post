import { RegisterForm } from '@/components/auth/RegisterForm'
import { ROUTES } from '@/utils/constants'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Create Account | YT Scribe',
  description:
    'Create a new account to start transcribing and summarizing YouTube videos',
}

export default function RegisterPage() {
  return (
    <div className='container mx-auto max-w-md py-8'>
      <div className='space-y-6'>
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold'>Create Account</h1>
          <p className='text-muted-foreground'>
            Join YT Scribe to start transcribing YouTube videos with AI
          </p>
        </div>

        <RegisterForm />

        <div className='text-center text-sm'>
          <span className='text-muted-foreground'>
            Already have an account?{' '}
          </span>
          <Link
            href={ROUTES.LOGIN}
            className='text-primary hover:underline font-medium'>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  )
}
