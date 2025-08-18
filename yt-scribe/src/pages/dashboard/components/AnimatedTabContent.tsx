import { TabsContent } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedTabContentProps {
  value: string
  children: ReactNode
  className?: string
}

export default function AnimatedTabContent({
  value,
  children,
  className = 'mt-0',
}: AnimatedTabContentProps) {
  return (
    <TabsContent key={value} value={value} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}>
        {children}
      </motion.div>
    </TabsContent>
  )
}
