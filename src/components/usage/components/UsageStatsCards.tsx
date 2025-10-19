interface UsageStatsCardsProps {
  current: number
  limit: number
  isFreeAccount: boolean
}

export function UsageStatsCards({
  current,
  limit,
  isFreeAccount,
}: UsageStatsCardsProps) {
  return (
    <div className='flex flex-col md:flex-row gap-4'>
      <div className='flex-1 text-center p-4 border rounded-lg hover:shadow-md transition-all duration-300'>
        <div className='space-y-2'>
          <p className='text-sm font-medium text-muted-foreground'>
            {isFreeAccount ? 'użyte w tym miesiącu' : 'łącznie użyte'}
          </p>
          <p className='text-2xl font-bold text-foreground'>{current}</p>
        </div>
      </div>
      <div className='flex-1 text-center p-4 border rounded-lg hover:shadow-md transition-all duration-300'>
        <div className='space-y-2'>
          <p className='text-sm font-medium text-muted-foreground'>
            {isFreeAccount ? 'miesięczny limit' : 'nieograniczone'}
          </p>
          <p className='text-2xl font-bold text-foreground'>
            {isFreeAccount ? limit : '∞'}
          </p>
        </div>
      </div>
    </div>
  )
}
