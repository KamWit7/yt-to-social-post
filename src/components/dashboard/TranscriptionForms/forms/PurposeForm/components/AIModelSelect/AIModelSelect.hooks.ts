import { getUserUsageStats } from '@/lib/actions/usage'
import { AccountTier } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export function useUserAccountTier() {
  const { data: session } = useSession()
  const [accountTier, setAccountTier] = useState<AccountTier>(AccountTier.free)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchUserTier() {
      if (!session?.user?.id) {
        setIsLoading(false)
        return
      }

      try {
        setError(null)
        const stats = await getUserUsageStats()
        if (stats.success && stats.usage) {
          setAccountTier(stats.usage.accountTier)
        }
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to fetch user tier')
        setError(error)
        console.error('Error fetching user tier:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserTier()
  }, [session?.user?.id])

  return {
    accountTier,
    isLoading,
    error,
    isByokUser: accountTier === AccountTier.BYOK,
  }
}
