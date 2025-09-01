'use client'

import { Mail, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

import { LogoutButton } from '@/components/auth/LogoutButton'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function UserProfile() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <Card className='w-full max-w-md mx-auto'>
        <CardContent className='pt-6'>
          <div className='animate-pulse space-y-4'>
            <div className='w-16 h-16 bg-gray-200 rounded-full mx-auto'></div>
            <div className='space-y-2'>
              <div className='h-4 bg-gray-200 rounded w-3/4 mx-auto'></div>
              <div className='h-4 bg-gray-200 rounded w-1/2 mx-auto'></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!session?.user) {
    return (
      <Card className='w-full max-w-md mx-auto'>
        <CardContent className='pt-6'>
          <div className='text-center'>
            <p className='text-muted-foreground'>No user session found</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>Your account information and settings</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='flex flex-col items-center space-y-4'>
          <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center'>
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || 'User'}
                width={64}
                height={64}
                className='w-16 h-16 rounded-full object-cover'
              />
            ) : (
              <User className='w-8 h-8 text-primary' />
            )}
          </div>

          <div className='text-center space-y-1'>
            <h3 className='font-semibold text-lg'>
              {session.user.name || 'User'}
            </h3>
            <div className='flex items-center justify-center space-x-2 text-sm text-muted-foreground'>
              <Mail className='w-4 h-4' />
              <span>{session.user.email}</span>
            </div>
          </div>
        </div>

        <div className='border-t pt-4'>
          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium'>Account ID</span>
              <span className='text-sm text-muted-foreground font-mono'>
                {session.user.id}
              </span>
            </div>

            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium'>Account Type</span>
              <span className='text-sm text-muted-foreground'>Free Tier</span>
            </div>
          </div>
        </div>

        <div className='pt-4'>
          <LogoutButton />
        </div>
      </CardContent>
    </Card>
  )
}
