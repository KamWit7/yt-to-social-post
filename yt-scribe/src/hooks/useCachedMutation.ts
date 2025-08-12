import { queryClient } from '@/components/provider/QueryProvider'
import {
  MutationKey,
  MutationState,
  useIsMutating,
} from '@tanstack/react-query'
import { useMemo } from 'react'

type UseCachedMutationReturn<
  TData,
  TError = Error,
  TVariables = unknown,
  TContext = unknown
> = {
  cache: MutationState<TData, TError, TVariables, TContext>
  isLoading: boolean
  error: TError | null
  data: TData | undefined
}

const DEFAULT_CACHE: MutationState<unknown, Error, unknown, unknown> = {
  context: undefined,
  data: undefined,
  error: null,
  failureCount: 0,
  failureReason: null,
  isPaused: false,
  status: 'idle',
  variables: undefined,
  submittedAt: 0,
}

export function useCachedMutation<
  TData,
  TError = Error,
  TVariables = unknown,
  TContext = unknown
>(
  mutationKey: MutationKey
): UseCachedMutationReturn<TData, TError, TVariables, TContext> {
  const isLoading =
    useIsMutating({
      mutationKey,
      exact: false,
    }) > 0

  const cache = useMemo(
    () => {
      const mutations = queryClient
        .getMutationCache()
        .findAll({ mutationKey, exact: false })
        .map((mutation) =>
          'state' in mutation
            ? (mutation.state as MutationState<
                TData,
                TError,
                TVariables,
                TContext
              >)
            : null
        )
        .filter((m) => m)

      if (mutations.length > 1) {
        return mutations.sort((m1, m2) => {
          const s1 = m1?.submittedAt ?? 0
          const s2 = m2?.submittedAt ?? 0
          return s2 - s1
        })?.[0]
      }

      return mutations?.[0]
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mutationKey, isLoading]
  )

  return {
    cache: (cache ?? DEFAULT_CACHE) as MutationState<
      TData,
      TError,
      TVariables,
      TContext
    >,
    isLoading: !!isLoading,
    error: cache?.error ?? null,
    data: cache?.data as TData | undefined,
  }
}
