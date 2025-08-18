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
  stepKey: keyof StepCompleted
}

export interface StepCompleted {
  youtube: boolean
  transcript: boolean
  purpose: boolean
  results: boolean
}
