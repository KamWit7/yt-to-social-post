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
    <div className='flex items-center gap-2'>
      <Link href={ROUTES.LOGIN}>
        <Button
          variant='ghost'
          size='sm'
          className='group text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/60 dark:hover:bg-gray-800/40 transition-all duration-200 ease-out'>
          <LogIn className='w-3.5 h-3.5 mr-1.5 transition-transform duration-200 group-hover:scale-110' />
          <span>Zaloguj się</span>
        </Button>
      </Link>
      <Link href={ROUTES.REGISTER}>
        <Button
          size='sm'
          className='group text-sm font-semibold bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 ease-out hover:shadow-md'>
          <span className='transition-transform duration-200 group-hover:scale-105'>
            Zarejestruj się
          </span>
        </Button>
      </Link>
    </div>
  )
}
