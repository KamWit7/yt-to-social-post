'use client'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/utils/constants'
import { LogIn } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { UserMenu } from './UserMenu'

export function AuthSection() {
  const { data: session, status } = useSession()
  console.log('session', session)

  if (status === 'loading') {
    return (
      <div className='w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse' />
    )
  }

  if (session?.user) {
    return <UserMenu user={session.user} />
  }

  return (
    <div className='flex items-center space-x-2'>
      <Link href={ROUTES.LOGIN}>
        <Button variant='ghost' size='sm'>
          <LogIn className='w-4 h-4' />
          <span>Sign In</span>
        </Button>
      </Link>
      <Link href={ROUTES.REGISTER}>
        <Button size='sm' className='text-sm font-semibold'>
          Sign Up
        </Button>
      </Link>
    </div>
  )
}
