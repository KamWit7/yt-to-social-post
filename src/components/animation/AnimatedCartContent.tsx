'use client'

import { motion, Variants } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedCartContentProps {
  children: ReactNode
  className?: string
}
const variants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export default function AnimatedCartContent({
  children,
  className,
}: AnimatedCartContentProps) {
  return (
    <motion.div
      variants={variants}
      initial='initial'
      animate='animate'
      exit='exit'
      className={className}>
      {children}
    </motion.div>
  )
}
