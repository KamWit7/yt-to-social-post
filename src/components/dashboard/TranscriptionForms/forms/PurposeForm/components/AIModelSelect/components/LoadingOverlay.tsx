/**
 * Reusable loading overlay component that displays a spinner
 * with a backdrop blur effect over the parent container.
 */
export function LoadingOverlay() {
  return (
    <div className='absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center'>
      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600' />
    </div>
  )
}
