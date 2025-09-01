import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown } from 'lucide-react'

interface CollapsibleCardProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  isVisible: boolean
  onToggle: () => void
  copyAction?: React.ReactNode
}

export default function CollapsibleCard({
  icon,
  title,
  children,
  isVisible,
  onToggle,
  copyAction,
}: CollapsibleCardProps) {
  return (
    <Card className='bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden'>
      <CardHeader className='p-4 flex justify-between items-center'>
        <div className='flex items-center space-x-3'>
          {icon}
          <CardTitle className='font-semibold text-gray-800 dark:text-white'>
            {title}
          </CardTitle>
        </div>
        <div className='flex items-center gap-2'>
          {copyAction}
          <Button
            onClick={onToggle}
            variant='ghost'
            size='sm'
            className='p-1 rounded-full hover:bg-gray-50/50 dark:hover:bg-gray-700/30'>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 ${
                isVisible ? 'rotate-180' : ''
              }`}
            />
          </Button>
        </div>
      </CardHeader>
      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
          isVisible ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}>
        <div className='overflow-hidden'>
          <CardContent className='p-6 pt-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed border-t border-gray-200/80 dark:border-gray-700/80'>
            {children}
          </CardContent>
        </div>
      </div>
    </Card>
  )
}
