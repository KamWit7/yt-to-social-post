'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'


export default function AILoadingAnimation() {
  return (
    <div className='flex flex-col items-center justify-center py-12 space-y-4'>
      <motion.div
        className='relative w-16 h-16 mb-4'
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}>
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

      <p className='text-lg font-medium text-gray-600 dark:text-gray-400'>
        Przetwarzam transkrypcję z AI...
      </p>
      <p className='text-sm text-gray-500 dark:text-gray-500'>
        to może potrwać kilka minut
      </p>
    </div>
  )
}
