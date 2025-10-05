'use client'

import { createContext, useCallback, useContext, type ReactNode } from 'react'

interface UsageContextType {
  refreshUsage: () => void
  registerRefreshUsageHandler: (handler: () => void) => () => void
}

const UsageContext = createContext<UsageContextType | undefined>(undefined)

interface UsageProviderProps {
  children: ReactNode
}

export function UsageProvider({ children }: UsageProviderProps) {
  const usageHandlers = new Set<() => void>()

  const registerRefreshUsageHandler = useCallback((handler: () => void) => {
    usageHandlers.add(handler)

    return () => {
      usageHandlers.delete(handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const refreshUsage = useCallback(() => {
    usageHandlers.forEach((handler) => {
      try {
        handler()
      } catch (error) {
        console.error('Error in usage refresh handler:', error)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const contextValue: UsageContextType = {
    refreshUsage,
    registerRefreshUsageHandler,
  }

  return (
    <UsageContext.Provider value={contextValue}>
      {children}
    </UsageContext.Provider>
  )
}

export function useUsage(): UsageContextType {
  const context = useContext(UsageContext)

  if (context === undefined) {
    throw new Error('useUsage must be used within a UsageProvider')
  }

  return context
}
