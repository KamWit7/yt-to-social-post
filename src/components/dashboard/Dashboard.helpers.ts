import z from 'zod'
import { PurposeOnlyFormData } from './TranscriptionForms/types/formTypes'
import { ApiResponse, AIProcessingResponse } from '@/types'

export const TRANSCRIPTION_FORMS_STORAGE_KEY = 'transcriptionForms'

export const DASHBOARD_TABS = {
  YOUTUBE: 'youtube',
  TRANSCRIPT: 'transcript',
  PURPOSE: 'purpose',
  RESULTS: 'results',
} as const

export type DashboardTab = (typeof DASHBOARD_TABS)[keyof typeof DASHBOARD_TABS]

export interface TabConfig {
  value: DashboardTab
  icon: React.ComponentType<{ className?: string }>
  label: string
  disabled: boolean
}

export interface FormStepsState {
  [DASHBOARD_TABS.YOUTUBE]?: string
  [DASHBOARD_TABS.TRANSCRIPT]?: string
  [DASHBOARD_TABS.PURPOSE]?: PurposeOnlyFormData
  [DASHBOARD_TABS.RESULTS]?: ApiResponse<AIProcessingResponse>
}

export interface StepCompleted {
  [DASHBOARD_TABS.YOUTUBE]: boolean
  [DASHBOARD_TABS.TRANSCRIPT]: boolean
  [DASHBOARD_TABS.PURPOSE]: boolean
  [DASHBOARD_TABS.RESULTS]: boolean
}

export const dashboardStateSchema = z.object({
  transcript: z.string(),
  url: z.string(),
  activeTab: z.enum(Object.values(DASHBOARD_TABS)),
  stepCompleted: z.record(z.enum(Object.values(DASHBOARD_TABS)), z.boolean()),
})
