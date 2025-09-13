import {
  ACCOUNT_TIER_LABELS,
  UserProfileData,
} from '@/components/auth/UserProfile/UserProfile.helpers'

interface AccountDetailsProps {
  user: Pick<UserProfileData, 'id' | 'accountTier'>
  className?: string
}

interface DetailRowProps {
  label: string
  value: string
  valueClassName?: string
}

function DetailRow({ label, value, valueClassName = '' }: DetailRowProps) {
  return (
    <div className='flex justify-between items-center'>
      <span className='text-sm font-medium'>{label}</span>
      <span className={`text-sm text-muted-foreground ${valueClassName}`}>
        {value}
      </span>
    </div>
  )
}

export function AccountDetails({ user, className = '' }: AccountDetailsProps) {
  return (
    <div className={`border-t pt-4 ${className}`}>
      <div className='space-y-3'>
        <DetailRow
          label='ID konta'
          value={user.id}
          valueClassName='font-mono'
        />

        <DetailRow
          label='Typ konta'
          value={ACCOUNT_TIER_LABELS[user.accountTier]}
        />
      </div>
    </div>
  )
}
