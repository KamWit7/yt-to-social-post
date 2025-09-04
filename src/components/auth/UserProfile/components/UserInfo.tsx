import { UserProfileData } from '@/components/auth/UserProfile/UserProfile.helpers'
import { Mail } from 'lucide-react'

import { UserAvatar } from './UserAvatar'

interface UserInfoProps {
  user: Pick<UserProfileData, 'name' | 'email' | 'image'>
  avatarSize?: 'sm' | 'md' | 'lg'
  showEmail?: boolean
  className?: string
}

export function UserInfo({
  user,
  avatarSize = 'md',
  showEmail = true,
  className = '',
}: UserInfoProps) {
  const displayName = user.name || 'User'

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <UserAvatar user={user} size={avatarSize} />

      <div className='text-center space-y-1'>
        <h3 className='font-semibold text-lg'>{displayName}</h3>

        {showEmail && user.email && (
          <div className='flex items-center justify-center space-x-2 text-sm text-muted-foreground'>
            <Mail className='w-4 h-4' />
            <span>{user.email}</span>
          </div>
        )}
      </div>
    </div>
  )
}
