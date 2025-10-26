import { AnimatedSection } from '@/components/animation'
import SuccessCard from '@/components/common/SuccessCard'
import { Progress } from '@/components/ui/progress'
import { ROUTES } from '@/utils/constants'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const COUNT_DOWN_TIME = 10

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

  const handleLoginClick = () => {
    router.push(ROUTES.LOGIN)
  }

  const getCountdownLabel = (count: number): string => {
    if (count === 1) {
      return 'sekundę'
    }

    if (count > 1 && count < 5) {
      return 'sekundy'
    }

    return 'sekund'
  }

  const isCountdownActive = countdown !== null

  return (
    <AnimatedSection isVisible className='space-y-4'>
      <SuccessCard
        title='Rejestracja zakończona pomyślnie!'
        description='twoje konto zostało utworzone pomyślnie'
        buttonText='Przejdź do logowania teraz'
        onButtonClick={handleLoginClick}
        isPinging={isCountdownActive}
        additionalContent={
          <>
            {isCountdownActive && (
              <div className='w-full max-w-md mx-auto space-y-2'>
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
                    {getCountdownLabel(countdown)}
                  </span>
                </div>

                <Progress
                  value={progressPercentage}
                  className='w-full h-2 bg-gray-200'
                />
              </div>
            )}
          </>
        }
      />
    </AnimatedSection>
  )
}
