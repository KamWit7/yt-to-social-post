'use client'

import { User } from 'lucide-react'
import Image from 'next/image'

interface UserAvatarProps {
  src?: string | null
  alt: string
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
  src,
  alt,
  size = 'md',
  className = '',
}: UserAvatarProps) {
  const containerClass = `${sizeClasses[size]} bg-primary/10 rounded-full flex items-center justify-center ${className}`

  return (
    <div className={containerClass}>
      {src ? (
        <Image
          src={src}
          alt={alt}
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
