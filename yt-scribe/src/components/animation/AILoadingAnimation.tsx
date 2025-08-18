'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface AILoadingAnimationProps {
  message?: string
  className?: string
}

export default function AILoadingAnimation({
  message = 'Przetwarzam z AI...',
  className = '',
}: AILoadingAnimationProps) {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}>
      <motion.div
        className='relative w-16 h-16 mb-4'
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
        <div className='absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-20' />
        <motion.div
          className='absolute inset-2 w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center'
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              '0 0 0 0 rgba(147, 51, 234, 0.4)',
              '0 0 0 10px rgba(147, 51, 234, 0)',
              '0 0 0 0 rgba(147, 51, 234, 0)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}>
          <Sparkles className='w-6 h-6 text-white' />
        </motion.div>
      </motion.div>

      <motion.p
        className='text-lg font-medium text-gray-700 dark:text-gray-300 text-center'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}>
        {message}
      </motion.p>

      <motion.div
        className='flex space-x-2 mt-4'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className='w-2 h-2 bg-purple-500 rounded-full'
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}
