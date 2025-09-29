'use client'
import { cn } from '@/lib/utils'
import { motion, useInView } from 'framer-motion'
import * as React from 'react'

type TextStaggeredFadeProps = {
  text: string
  className?: string
  delay?: number
  onAnimationComplete?: () => void
}

export function StaggeredFade({
  text,
  className = '',
  delay = 0.01,
  onAnimationComplete,
}: TextStaggeredFadeProps) {
  const variants = {
    hidden: { opacity: 0 },
    show: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * delay },
    }),
  }

  const letters = text.split('')
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.span
      ref={ref}
      initial='hidden'
      animate={isInView ? 'show' : ''}
      variants={variants}
      viewport={{ once: true }}
      className={cn(className)}
      onAnimationComplete={onAnimationComplete}>
      {letters.map((letter, i) => (
        <motion.span key={`${letter}-${i}`} variants={variants} custom={i}>
          {letter}
        </motion.span>
      ))}
    </motion.span>
  )
}
