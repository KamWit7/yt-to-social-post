'use client'

import { AnimatePresence, motion, Variants } from 'framer-motion'
import { usePathname } from 'next/navigation'

const variants: Variants = {
  initial: { opacity: 0.5 },
  animate: { opacity: 1 },
  exit: { opacity: 0.5 },
}

export function PageAnimation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode='wait' key={pathname}>
      <motion.div
        variants={variants}
        initial='initial'
        animate='animate'
        exit='exit'
        transition={{ duration: 0.2, ease: 'linear' }}>
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
