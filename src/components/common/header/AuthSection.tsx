'use server'

import { Button } from '@/components/ui/button'
import { authOptions } from '@/lib/auth'
import { ROUTES } from '@/utils/constants'
import { LogIn } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { UsageCounter } from './UsageCounter/UsageCounter'
import { UserMenu } from './UserMenu'

// HERE PROBLEM WITH getServerSession
export async function AuthSection() {
  const session = await getServerSession(authOptions)

  if (session?.user) {
    return (
      <div className='flex items-center gap-3'>
        <UsageCounter />
        <UserMenu user={session.user} />
      </div>
    )
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
