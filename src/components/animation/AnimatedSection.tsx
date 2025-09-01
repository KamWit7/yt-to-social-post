'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  isVisible: boolean
  className?: string
  delay?: number
}

export default function AnimatedSection({
  children,
  isVisible,
  className = '',
  delay = 0,
}: AnimatedSectionProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={className}
          initial={{
            height: 0,
            opacity: 0,
            scale: 0.95,
            y: 20,
          }}
          animate={{
            height: 'auto',
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            height: 0,
            opacity: 0,
            scale: 0.95,
            y: -20,
          }}
          transition={{
            duration: 0.6,
            ease: [0.4, 0.0, 0.2, 1],
            delay,
            height: {
              duration: 0.5,
              ease: [0.4, 0.0, 0.2, 1],
            },
          }}
          style={{
            overflow: 'hidden',
          }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0.0, 0.2, 1],
              delay: delay + 0.2,
            }}>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
