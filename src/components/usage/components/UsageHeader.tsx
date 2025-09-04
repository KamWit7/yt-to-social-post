import { Button } from '@/components/ui/button'
import { ROUTES } from '@/utils/constants'
import { ArrowLeft, BarChart3, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function UsageHeader() {
  return (
    <div className='space-y-6'>
      {/* Navigation */}
      <div className='flex items-center gap-4'>
        <Link href={ROUTES.DASHBOARD}>
          <Button
            variant='ghost'
            size='sm'
            className='gap-2 hover:bg-muted/50 transition-all duration-300 hover:-translate-x-1'>
            <ArrowLeft className='w-4 h-4' />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className='text-center space-y-4 max-w-2xl mx-auto'>
        <div className='relative inline-flex items-center justify-center'>
          <div className='absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-full blur-2xl scale-150' />
          <div className='relative bg-gradient-to-br from-primary/10 to-primary/5 rounded-full p-4 border border-primary/20'>
            <BarChart3 className='w-8 h-8 text-primary' />
          </div>
        </div>

        <div className='space-y-2'>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent'>
            Usage Dashboard
          </h1>
          <p className='text-lg text-muted-foreground/80 leading-relaxed'>
            Monitor your summary generation usage and track your monthly limits
          </p>
        </div>

        {/* Feature highlights */}
        <div className='flex items-center justify-center gap-6 pt-2'>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Sparkles className='w-4 h-4 text-primary' />
            Real-time tracking
          </div>
          <div className='w-1 h-1 bg-muted-foreground/30 rounded-full' />
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <BarChart3 className='w-4 h-4 text-primary' />
            Visual analytics
          </div>
        </div>
      </div>
    </div>
  )
}
