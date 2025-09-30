'use client'

import {
  useAIProcessingV2,
  UseAIProcessingV2Return,
} from '@/api/hooks/useAIProcessingV2'
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
  FormStepsState,
  StepCompleted,
  TRANSCRIPTION_FORMS_STORAGE_KEY,
} from '../../Dashboard.helpers'

export interface TranscriptionFormsContextType {
  // State
  formStepsState: FormStepsState
  activeTab: DashboardTab
  stepCompleted: StepCompleted
  isLoading: boolean

  // Actions
  handleTranscriptChange: (transcript: string) => void
  handleUrlChange: (url: string) => void
  handleTabChange: (tab: string) => void
  handleStepComplete: (step: keyof StepCompleted) => void
  handleLoadingStateChange: (isLoading: boolean) => void
  handleTranscriptUpdate: (transcript: string) => void
  handleFormStepUpdate: <T extends keyof FormStepsState>(
    step: T,
    data: FormStepsState[T]
  ) => void

  // AI Processing
  aiProcessing: UseAIProcessingV2Return
}

const TranscriptionFormsContext = createContext<
  TranscriptionFormsContextType | undefined
>(undefined)

export interface TranscriptionFormsProviderProps {
  children: ReactNode
}

export function TranscriptionFormsProvider({
  children,
}: TranscriptionFormsProviderProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Removed separate states - now using formStepsState
  const [formStepsState, setFormStepsState] = useState<FormStepsState>({
    [DASHBOARD_TABS.YOUTUBE]: undefined,
    [DASHBOARD_TABS.TRANSCRIPT]: undefined,
    [DASHBOARD_TABS.PURPOSE]: undefined,
    [DASHBOARD_TABS.RESULTS]: undefined,
  })

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

      if (!savedState) {
        return
      }

      const parsedState = dashboardStateSchema.parse(savedState)

      if (parsedState) {
        setFormStepsState({
          [DASHBOARD_TABS.YOUTUBE]: parsedState.url,
          [DASHBOARD_TABS.TRANSCRIPT]: parsedState.transcript,
          [DASHBOARD_TABS.PURPOSE]: undefined,
          [DASHBOARD_TABS.RESULTS]: undefined,
        })
        setActiveTab(parsedState.activeTab)
        setStepCompleted(parsedState.stepCompleted)
      }
    } catch (error) {
      console.error('Error parsing saved state:', error)
    }
  }, [])

  // Handlers
  const handleFormStepUpdate = useCallback(
    <T extends keyof FormStepsState>(step: T, data: FormStepsState[T]) => {
      setFormStepsState((prev) => ({
        ...prev,
        [step]: data,
      }))
    },
    []
  )

  const handleTranscriptChange = useCallback(
    (newTranscript: string) => {
      handleFormStepUpdate(DASHBOARD_TABS.TRANSCRIPT, newTranscript)

      if (newTranscript && newTranscript.trim().length > 0) {
        setStepCompleted((prev) => ({ ...prev, youtube: true }))
      } else {
        setStepCompleted((prev) => ({ ...prev, youtube: false }))
      }
    },
    [handleFormStepUpdate]
  )

  const handleUrlChange = useCallback(
    (newUrl: string) => {
      handleFormStepUpdate(DASHBOARD_TABS.YOUTUBE, newUrl)
    },
    [handleFormStepUpdate]
  )

  const handleTranscriptUpdate = useCallback(
    (updatedTranscript: string) => {
      handleFormStepUpdate(DASHBOARD_TABS.TRANSCRIPT, updatedTranscript)
      // Keep the youtube step completed status since transcript exists
      if (updatedTranscript && updatedTranscript.trim().length > 0) {
        setStepCompleted({
          [DASHBOARD_TABS.YOUTUBE]: true,
          [DASHBOARD_TABS.TRANSCRIPT]: false,
          [DASHBOARD_TABS.PURPOSE]: false,
          [DASHBOARD_TABS.RESULTS]: false,
        })
      }
    },
    [handleFormStepUpdate]
  )

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

  const {
    processTranscript,
    isLoading: aiLoading,
    isSuccess: aiSuccess,
    response: aiResponse,
    error: aiError,
    reset,
    resetByPurpose,
  } = useAIProcessingV2()

  const contextValue: TranscriptionFormsContextType = {
    formStepsState,
    activeTab,
    stepCompleted,
    isLoading,
    handleTranscriptChange,
    handleUrlChange,
    handleTabChange,
    handleStepComplete,
    handleLoadingStateChange,
    handleTranscriptUpdate,
    handleFormStepUpdate,
    aiProcessing: {
      isLoading: aiLoading,
      isSuccess: aiSuccess,
      response: aiResponse,
      error: aiError,
      processTranscript,
      reset,
      resetByPurpose,
    },
  }

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
