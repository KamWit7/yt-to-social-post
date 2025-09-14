'use client'

import { Variants, motion } from 'framer-motion'

const blackBox: Variants = {
  initial: {
    height: '100vh',
  },
  animate: {
    height: 0,
    transition: {
      duration: 1.2,
      ease: [0.87, 0, 0.13, 1],
    },
  },
}

export default function InitialTransition() {
  return (
    <motion.div
      className='absolute inset-0 z-50 w-full bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900'
      initial='initial'
      animate='animate'
      variants={blackBox}
    />
  )
}
