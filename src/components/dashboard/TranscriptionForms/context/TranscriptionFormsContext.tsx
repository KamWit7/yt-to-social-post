'use client'

import { getStateFromSessionStorage } from '@/utils/sessionStorage'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  DASHBOARD_TABS,
  dashboardStateSchema,
  DashboardTab,
  StepCompleted,
  TRANSCRIPTION_FORMS_STORAGE_KEY,
} from '../../Dashboard.helpers'

export interface TranscriptionFormsContextType {
  // State
  transcript: string
  activeTab: DashboardTab
  stepCompleted: StepCompleted
  isLoading: boolean

  // Actions
  handleTranscriptChange: (transcript: string) => void
  handleTabChange: (tab: string) => void
  handleStepComplete: (step: keyof StepCompleted) => void
  handleLoadingStateChange: (isLoading: boolean) => void
  handleTranscriptUpdate: (transcript: string) => void
}

const TranscriptionFormsContext = createContext<
  TranscriptionFormsContextType | undefined
>(undefined)

export interface TranscriptionFormsProviderProps {
  children: ReactNode
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

export function TranscriptionFormsProvider({
  children,
  isLoading,
  setIsLoading,
}: TranscriptionFormsProviderProps) {
  const [transcript, setTranscript] = useState('')
  const [activeTab, setActiveTab] = useState<DashboardTab>(
    DASHBOARD_TABS.YOUTUBE
  )
  const [stepCompleted, setStepCompleted] = useState<StepCompleted>({
    [DASHBOARD_TABS.YOUTUBE]: false,
    [DASHBOARD_TABS.TRANSCRIPT]: false,
    [DASHBOARD_TABS.PURPOSE]: false,
    [DASHBOARD_TABS.RESULTS]: false,
  })

  useEffect(() => {
    try {
      const savedState = getStateFromSessionStorage(
        TRANSCRIPTION_FORMS_STORAGE_KEY
      )
      const parsedState = dashboardStateSchema.parse(savedState)

      if (
        parsedState &&
        parsedState.transcript &&
        parsedState.activeTab &&
        parsedState.stepCompleted
      ) {
        setTranscript(parsedState.transcript)
        setActiveTab(parsedState.activeTab)
        setStepCompleted(parsedState.stepCompleted)
      }
    } catch (error) {
      console.error('Error parsing saved state:', error)
    }
  }, [])

  // Handlers
  const handleTranscriptChange = useCallback((newTranscript: string) => {
    setTranscript(newTranscript)

    if (newTranscript && newTranscript.trim().length > 0) {
      setStepCompleted((prev) => ({ ...prev, youtube: true }))
    } else {
      setStepCompleted((prev) => ({ ...prev, youtube: false }))
    }
  }, [])

  const handleTranscriptUpdate = useCallback((updatedTranscript: string) => {
    setTranscript(updatedTranscript)
    // Keep the youtube step completed status since transcript exists
    if (updatedTranscript && updatedTranscript.trim().length > 0) {
      setStepCompleted({
        [DASHBOARD_TABS.YOUTUBE]: true,
        [DASHBOARD_TABS.TRANSCRIPT]: false,
        [DASHBOARD_TABS.PURPOSE]: false,
        [DASHBOARD_TABS.RESULTS]: false,
      })
    }
  }, [])

  const handleStepComplete = useCallback((step: keyof StepCompleted) => {
    setStepCompleted((prev) => ({ ...prev, [step]: true }))
  }, [])

  const handleLoadingStateChange = useCallback(
    (loading: boolean) => {
      setIsLoading(loading)
    },
    [setIsLoading]
  )

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as DashboardTab)
  }, [])

  const contextValue: TranscriptionFormsContextType = {
    transcript,
    activeTab,
    stepCompleted,
    isLoading,
    handleTranscriptChange,
    handleTabChange,
    handleStepComplete,
    handleLoadingStateChange,
    handleTranscriptUpdate,
  }

  console.log('contextValue', contextValue)

  return (
    <TranscriptionFormsContext.Provider value={contextValue}>
      {children}
    </TranscriptionFormsContext.Provider>
  )
}

export function useTranscriptionForms(): TranscriptionFormsContextType {
  const context = useContext(TranscriptionFormsContext)

  if (context === undefined) {
    throw new Error(
      'useTranscriptionForms must be used within a TranscriptionFormsProvider'
    )
  }

  return context
}
