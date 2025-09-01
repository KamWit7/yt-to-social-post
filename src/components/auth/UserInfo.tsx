'use client'

import { Mail } from 'lucide-react'

import { UserAvatar } from './UserAvatar'

interface UserInfoProps {
  name: string | null
  email: string | null
  image?: string | null
  avatarSize?: 'sm' | 'md' | 'lg'
  showEmail?: boolean
  className?: string
}

export function UserInfo({
  name,
  email,
  image,
  avatarSize = 'md',
  showEmail = true,
  className = '',
}: UserInfoProps) {
  const displayName = name || 'User'

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <UserAvatar src={image} alt={displayName} size={avatarSize} />

      <div className='text-center space-y-1'>
        <h3 className='font-semibold text-lg'>{displayName}</h3>

        {showEmail && email && (
          <div className='flex items-center justify-center space-x-2 text-sm text-muted-foreground'>
            <Mail className='w-4 h-4' />
            <span>{email}</span>
          </div>
        )}
      </div>
    </div>
  )
}
