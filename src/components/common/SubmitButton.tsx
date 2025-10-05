import { Button } from '@/components/ui/button'
import { LucideIcon } from 'lucide-react'

type SubmitButtonProps = {
  disabled?: boolean
  isLoading?: boolean
  loadingText?: string
  normalText: string
  icon?: LucideIcon
  className?: string
  type?: 'button' | 'submit'
}

export function SubmitButton({
  disabled = false,
  isLoading = false,
  loadingText = 'Ładowanie...',
  normalText,
  icon: Icon,
  className = '',
  type = 'submit',
}: SubmitButtonProps) {
  return (
    <Button type={type} disabled={disabled || isLoading} className={className}>
      {isLoading ? (
        <>
          <div className='w-4 h-4 mr-2 animate-spin rounded-full border-2 border-b-transparent border-current' />
          {loadingText}
        </>
      ) : (
        <>
          {Icon && <Icon className='w-4 h-4 mr-2' />}
          {normalText}
        </>
      )}
    </Button>
  )
}
