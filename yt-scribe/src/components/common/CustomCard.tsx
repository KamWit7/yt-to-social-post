import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CustomCardProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  copyAction?: React.ReactNode
  className?: string
}

function CustomCard({
  icon,
  title,
  children,
  copyAction,
  className = '',
}: CustomCardProps) {
  return (
    <Card
      className={`bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 ${className}`}>
      <CardHeader className='p-4 border-b border-gray-200/80 dark:border-gray-700/80 flex justify-between items-center'>
        <div className='flex items-center space-x-3'>
          <span aria-hidden='true'>{icon}</span>
          <CardTitle className='font-semibold text-gray-800 dark:text-white'>
            {title}
          </CardTitle>
        </div>
        {copyAction && <div className='flex-shrink-0'>{copyAction}</div>}
      </CardHeader>
      <CardContent className='p-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed'>
        {children}
      </CardContent>
    </Card>
  )
}

export default CustomCard
