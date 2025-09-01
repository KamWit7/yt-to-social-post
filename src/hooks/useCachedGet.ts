import { queryClient } from '@/components/provider/QueryProvider'
import { QueryKey, QueryState, useIsFetching } from '@tanstack/react-query'
import { useMemo } from 'react'

type UseCachedGetReturn<T> = {
  cache: QueryState<T, Error>
  isLoading: boolean
}

const DEFAULT_CACHE = {
  data: undefined,
  dataUpdateCount: 0,
  dataUpdatedAt: 0,
  error: null,
  errorUpdateCount: 0,
  errorUpdatedAt: 0,
  fetchFailureCount: 0,
  fetchFailureReason: null,
  fetchMeta: null,
  isInvalidated: false,
  status: 'pending' as const,
  fetchStatus: 'idle' as const,
}

export function useCachedGet<T>(queryKey: QueryKey): UseCachedGetReturn<T> {
  const isLoading =
    useIsFetching({
      queryKey,
      exact: false,
    }) > 0

  const cache = useMemo(
    () => {
      const queries = queryClient
        .getQueryCache()
        .findAll({ queryKey, exact: false })
        .map((query) =>
          'state' in query ? (query.state as QueryState<T, Error>) : null
        )
        .filter((query) => query?.data)

      if (queries.length > 1) {
        return queries.sort((q1, q2) => {
          if (q1?.dataUpdatedAt && q2?.dataUpdatedAt) {
            return q2.dataUpdatedAt - q1.dataUpdatedAt
          }
          return 0
        })?.[0]
      }

      return queries?.[0]
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queryKey, isLoading]
  )

  return {
    cache: cache ?? DEFAULT_CACHE,
    isLoading: !!isLoading,
  }
}
