import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ROUTES } from '@/utils/constants'
import { UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const COUNT_DOWN_TIME = 5

export function RegisterSuccessMessage() {
  const [countdown, setCountdown] = useState<number>(COUNT_DOWN_TIME)
  const router = useRouter()

  // Timer effect for countdown
  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown === 0) {
        router.push(ROUTES.LOGIN)
        return
      }

      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, router])

  const progressPercentage =
    ((COUNT_DOWN_TIME - countdown) / COUNT_DOWN_TIME) * 100

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardContent className='pt-6'>
        <div className='text-center space-y-6'>
          <div className='relative'>
            <div className='w-16 h-16 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto shadow-lg'>
              <UserPlus className='w-8 h-8 text-green-600' />
            </div>
            <div className='absolute inset-0 w-16 h-16 bg-green-200 rounded-full mx-auto animate-ping opacity-20'></div>
          </div>

          <div className='space-y-2'>
            <h3 className='text-xl font-bold text-green-800'>
              Rejestracja zakończona pomyślnie!
            </h3>
            <p className='text-sm text-muted-foreground'>
              twoje konto zostało utworzone pomyślnie
            </p>
          </div>

          {countdown !== null && (
            <div className='space-y-4'>
              <div className='flex items-center justify-center space-x-2'>
                <span className='text-sm text-muted-foreground'>
                  przekierowanie do logowania za
                </span>
                <div className='flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full'>
                  <span className='text-sm font-bold text-primary'>
                    {countdown}
                  </span>
                </div>
                <span className='text-sm text-muted-foreground'>
                  {countdown === 1
                    ? 'sekundę'
                    : countdown < 5
                    ? 'sekundy'
                    : 'sekund'}
                </span>
              </div>

              <Progress
                value={progressPercentage}
                className='w-full h-2 bg-gray-200'
              />

              <Button
                variant='ghost'
                size='sm'
                onClick={() => {
                  router.push(ROUTES.LOGIN)
                }}
                className='text-sm'>
                Przejdź do logowania teraz
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
