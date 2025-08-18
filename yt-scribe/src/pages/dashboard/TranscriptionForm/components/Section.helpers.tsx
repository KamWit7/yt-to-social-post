import { DashboardTab } from '@/pages/dashboard/Dashboard.helpers'

export type BaseSectionProps = {
  isLoading: boolean
  isTranscriptLoading?: boolean
  transcriptError?: Error | null
  onFetchTranscript?: () => void
  onStepComplete?: (step: DashboardTab) => void
  onTabChange?: (tab: string) => void
}

export const LoadingSpinner = ({
  className = 'w-5 h-5',
}: {
  className?: string
}) => (
  <svg className={`animate-spin ${className}`} viewBox='0 0 24 24'>
    <circle
      className='opacity-25'
      cx='12'
      cy='12'
      r='10'
      stroke='currentColor'
      strokeWidth='4'
      fill='none'
    />
    <path
      className='opacity-75'
      fill='currentColor'
      d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
    />
  </svg>
)

// Common button styles
export const BUTTON_STYLES = {
  // Purpose (purple, matches Sparkles icon bg)
  purposeFullWidth:
    'w-full flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-base',
  // Transcript (blue, matches FileText icon bg)
  transcriptFullWidth:
    'w-full flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-base',
  // YouTube (red, matches YouTube icon bg)
  youtubeFullWidth:
    'w-full flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-base',
} as const

// Common section visibility logic
export const getSectionVisibility = (showTab?: boolean): boolean =>
  Boolean(showTab)

// Common delay values
export const ANIMATION_DELAYS = {
  section: 0.2,
  content: 0.1,
} as const
