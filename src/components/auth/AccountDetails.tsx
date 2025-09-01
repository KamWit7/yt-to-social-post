'use client'

import { ACCOUNT_TIER_LABELS, AccountTier } from '@/types/user'

interface AccountDetailsProps {
  userId: string
  accountTier: AccountTier
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

export function AccountDetails({
  userId,
  accountTier,
  className = '',
}: AccountDetailsProps) {
  return (
    <div className={`border-t pt-4 ${className}`}>
      <div className='space-y-3'>
        <DetailRow
          label='Account ID'
          value={userId}
          valueClassName='font-mono'
        />

        <DetailRow
          label='Account Type'
          value={ACCOUNT_TIER_LABELS[accountTier]}
        />
      </div>
    </div>
  )
}
