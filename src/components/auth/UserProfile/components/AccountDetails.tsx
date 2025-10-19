import {
  ACCOUNT_TIER_LABELS,
  UserProfileData,
} from '@/components/auth/UserProfile/UserProfile.helpers'
import { AccountTier } from '@prisma/client'
import { Sparkles } from 'lucide-react'

interface AccountDetailsProps {
  user: Pick<UserProfileData, 'id' | 'accountTier'>
  className?: string
}

interface DetailRowProps {
  label: string
  value: string | React.ReactNode
  valueClassName?: string
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className='flex justify-between items-center'>
      <span className='text-sm font-medium'>{label}</span>
      <span className='text-sm text-muted-foreground'>{value}</span>
    </div>
  )
}

export function AccountDetails({ user, className = '' }: AccountDetailsProps) {
  const isByokUser = user.accountTier === AccountTier.BYOK

  const modelAvailability = isByokUser ? (
    <span className='flex items-center gap-1.5 text-sm'>
      <Sparkles className='w-3.5 h-3.5 text-purple-600' />
      <span className='font-medium text-purple-700'>
        Wszystkie modele dostępne
      </span>
    </span>
  ) : (
    <span className='text-sm text-gray-600 dark:text-gray-400'>
      gemini 2.5 flash (tylko ten model)
    </span>
  )

  return (
    <div className={`border-t pt-4 ${className}`}>
      <div className='space-y-3'>
        <DetailRow label='ID konta' value={user.id} />

        <DetailRow label='Modele AI' value={modelAvailability} />

        <DetailRow
          label='Typ konta'
          value={ACCOUNT_TIER_LABELS[user.accountTier]}
        />
      </div>
    </div>
  )
}
