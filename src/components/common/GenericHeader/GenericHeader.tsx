import { Button } from '@/components/ui/button'
import { ROUTES } from '@/utils/constants'
import { ArrowLeft, LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface GenericHeaderProps {
  title: string
  description: string
  icon: LucideIcon
  features?: Array<{
    icon: LucideIcon
    text: string
  }>
}

export function GenericHeader({
  title,
  description,
  icon: Icon,
  features = [],
}: GenericHeaderProps) {
  return (
    <div className='max-w-7xl mx-auto px-4 pb-6 relative'>
      {/* Navigation */}
      <div className='absolute top-0 left-0 px-4 sm:px-6 lg:px-8'>
        <Link href={ROUTES.DASHBOARD}>
          <Button
            variant='ghost'
            size='sm'
            className='gap-2 hover:bg-muted/50 transition-all duration-300 hover:-translate-x-1'>
            <ArrowLeft className='w-4 h-4' />
            Strona główna
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className='text-center space-y-4 max-w-2xl mx-auto'>
        <div className='relative inline-flex items-center justify-center'>
          <div className='absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-full blur-2xl scale-150' />
          <div className='relative bg-gradient-to-br from-primary/10 to-primary/5 rounded-full p-4 border border-primary/20'>
            <Icon className='w-8 h-8 text-primary' />
          </div>
        </div>

        <div className='space-y-2'>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent'>
            {title}
          </h1>
          <p className='text-lg text-muted-foreground/80 leading-relaxed'>
            {description}
          </p>
        </div>

        {/* Feature highlights */}
        {features.length > 0 && (
          <div className='flex items-center justify-center gap-6 pt-2'>
            {features.map((feature, index) => (
              <div key={index} className='flex items-center gap-2'>
                {index > 0 && (
                  <div className='w-1 h-1 bg-muted-foreground/30 rounded-full mr-4' />
                )}
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <feature.icon className='w-4 h-4 text-primary' />
                  {feature.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
