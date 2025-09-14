'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface TextShimmerProps {
  children: React.ReactNode
  className?: string
  isLoading?: boolean
}

export default function TextShimmer({
  children,
  className = '',
  isLoading = false,
}: TextShimmerProps) {
  const pathname = usePathname()

  return (
    <motion.h1
      key={pathname}
      className={`relative overflow-hidden inline-block text-4xl font-bold text-gray-800 dark:text-white ${className}`}
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
    </motion.h1>
  )
}
