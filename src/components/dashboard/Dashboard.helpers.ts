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

export interface StepCompleted {
  [DASHBOARD_TABS.YOUTUBE]: boolean
  [DASHBOARD_TABS.TRANSCRIPT]: boolean
  [DASHBOARD_TABS.PURPOSE]: boolean
  [DASHBOARD_TABS.RESULTS]: boolean
}
