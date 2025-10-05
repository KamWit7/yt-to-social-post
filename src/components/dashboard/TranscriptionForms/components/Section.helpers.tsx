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

// Common delay values
export const ANIMATION_DELAYS = {
  conditionalOptions: 0.3,
  section: 0.2,
  content: 0.1,
} as const
