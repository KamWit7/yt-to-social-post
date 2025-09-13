import { Suspense } from 'react'
import { AuthSection, Logo } from './header'

export default function Header() {
  return (
    <header className='sticky top-0 z-50 bg-gray-50/80 dark:bg-gray-950/60 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-800/40 transition-all duration-300 ease-out'>
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <Logo />
          <div className='flex items-center gap-4'>
            <Suspense
              fallback={
                <div className='flex items-center gap-3'>
                  <div className='w-16 h-6 bg-gray-200/60 dark:bg-gray-700/60 rounded-md animate-pulse' />
                  <div className='w-8 h-8 bg-gray-200/60 dark:bg-gray-700/60 rounded-full animate-pulse' />
                </div>
              }>
              <AuthSection />
            </Suspense>
          </div>
        </div>
      </nav>
    </header>
  )
}
