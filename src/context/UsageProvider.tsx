'use client'

import { createContext, useCallback, useContext, type ReactNode } from 'react'

interface UsageContextType {
  refreshUsage: () => void
  registerRefreshHandler: (handler: () => void) => () => void
}

const UsageContext = createContext<UsageContextType | undefined>(undefined)

interface UsageProviderProps {
  children: ReactNode
}

export function UsageProvider({ children }: UsageProviderProps) {
  const refreshHandlers = new Set<() => void>()

  const registerRefreshHandler = useCallback((handler: () => void) => {
    refreshHandlers.add(handler)

    return () => {
      refreshHandlers.delete(handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const refreshUsage = useCallback(() => {
    refreshHandlers.forEach((handler) => {
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
    registerRefreshHandler,
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
