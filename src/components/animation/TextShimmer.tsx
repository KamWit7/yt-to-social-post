'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface TextShimmerProps {
  children: React.ReactNode
  className?: string
  isLoading?: boolean
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
}

export default function TextShimmer({
  children,
  className = '',
  isLoading = false,
  as = 'h1',
}: TextShimmerProps) {
  const pathname = usePathname()
  const MotionComponent = motion[as]

  return (
    <MotionComponent
      key={pathname}
      className={`relative overflow-hidden inline-block font-bold text-gray-800 dark:text-white ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: 'easeOut',
        delay: 0.2,
      }}>
      {children}
      <motion.div
        className={cn(
          isLoading ? 'absolute' : 'hidden',
          'inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/10'
        )}
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          delay: 0.2,
          ease: 'easeInOut',
        }}
      />
    </MotionComponent>
  )
}
