import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/utils/constants'
import { Link } from 'lucide-react'

export function EmptySessionCard() {
  return (
    <Card className='w-full max-w-md mx-auto group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-dashed border-2 hover:border-solid hover:border-primary/20 bg-gradient-to-br from-background via-background to-muted/20'>
      <CardContent className='pt-8 pb-8'>
        <div className='text-center space-y-6'>
          <div className='relative mx-auto w-20 h-20 mb-2'>
            <div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500'></div>
            <div className='relative bg-gradient-to-br from-primary/10 to-primary/5 rounded-full w-full h-full flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-all duration-300'>
              <svg
                className='w-8 h-8 text-primary/70 group-hover:text-primary transition-colors duration-300 group-hover:scale-110 transform'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
            </div>
          </div>

          <div className='space-y-3'>
            <h3 className='text-xl font-semibold text-foreground/90 tracking-tight'>
              Welcome Back
            </h3>
            <p className='text-muted-foreground/80 text-sm leading-relaxed max-w-xs mx-auto'>
              Sign in to access your personalized dashboard and continue where
              you left off
            </p>
          </div>

          <div className='pt-2'>
            <Link href={ROUTES.LOGIN} className='block'>
              <Button
                className='w-full group/btn relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] h-11'
                aria-label='Sign in to your account'>
                <span className='relative z-10 flex items-center justify-center gap-2 font-medium'>
                  Sign In
                  <svg
                    className='w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    aria-hidden='true'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 7l5 5m0 0l-5 5m5-5H6'
                    />
                  </svg>
                </span>
                <div className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700'></div>
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
