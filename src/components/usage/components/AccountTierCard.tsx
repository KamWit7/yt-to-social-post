import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/utils/constants'
import { AccountTier } from '@prisma/client'
import { Crown } from 'lucide-react'
import Link from 'next/link'
import { getAccountTierInfo } from '../UsageStats.helpers'

interface AccountTierCardProps {
  accountTier: AccountTier
}

export function AccountTierCard({ accountTier }: AccountTierCardProps) {
  const tierInfo = getAccountTierInfo(accountTier)
  const isFreeAccount = accountTier === AccountTier.free

  return (
    <div
      className={cn(
        'p-4 rounded-lg border-2 transition-all duration-300',
        tierInfo.bgColor,
        tierInfo.borderColor
      )}>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div>
            <p className='font-semibold text-foreground'>
              Plan: {tierInfo.label}
            </p>
            <p className={cn('text-sm', tierInfo.textColor)}>
              {tierInfo.description}
            </p>
          </div>
        </div>
        {isFreeAccount && (
          <Link href={ROUTES.SETTINGS} className='w-1/2 flex justify-end'>
            <Button className='group bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 '>
              <Crown className='w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110' />
              Ulepsz
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
