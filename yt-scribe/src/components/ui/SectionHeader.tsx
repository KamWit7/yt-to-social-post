'use client'

import { ReactNode } from 'react'

interface SectionHeaderProps {
  icon: ReactNode
  title: string
  subtitle: string
  iconBgColor?: string
  className?: string
}

export default function SectionHeader({
  icon,
  title,
  subtitle,
  iconBgColor = 'bg-gradient-to-r from-purple-500 to-blue-600',
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`flex items-center gap-4 pb-4 mb-4 ${className}`}>
      <div
        className={`w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center shadow-lg`}>
        {icon}
      </div>
      <div className='space-y-1'>
        <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-200'>
          {title}
        </h2>
        <p className='text-base text-gray-600 dark:text-gray-400 leading-relaxed'>
          {subtitle}
        </p>
      </div>
    </div>
  )
}
