import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CustomCardProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  copyAction?: React.ReactNode
}

export default function CustomCard({
  icon,
  title,
  children,
  copyAction,
}: CustomCardProps) {
  return (
    <Card className='bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50'>
      <CardHeader className='p-4 border-b border-gray-200/80 dark:border-gray-700/80 flex justify-between items-center'>
        <div className='flex items-center space-x-3'>
          {icon}
          <CardTitle className='font-semibold text-gray-800 dark:text-white'>
            {title}
          </CardTitle>
        </div>
        {copyAction}
      </CardHeader>
      <CardContent className='p-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed'>
        {children}
      </CardContent>
    </Card>
  )
}
