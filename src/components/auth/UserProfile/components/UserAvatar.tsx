import { UserProfileData } from '@/components/auth/UserProfile/UserProfile.helpers'
import { User } from 'lucide-react'
import Image from 'next/image'

interface UserAvatarProps {
  user?: Pick<UserProfileData, 'image' | 'name'>
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
} as const

const iconSizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
} as const

export function UserAvatar({
  user,
  size = 'md',
  className = '',
}: UserAvatarProps) {
  const containerClass = `${sizeClasses[size]} bg-primary/10 rounded-full flex items-center justify-center ${className}`
  const displayName = user?.name || 'User'

  return (
    <div className={containerClass}>
      {user?.image ? (
        <Image
          src={user.image}
          alt={displayName}
          width={size === 'sm' ? 32 : size === 'md' ? 64 : 96}
          height={size === 'sm' ? 32 : size === 'md' ? 64 : 96}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      ) : (
        <User className={`${iconSizeClasses[size]} text-primary`} />
      )}
    </div>
  )
}
