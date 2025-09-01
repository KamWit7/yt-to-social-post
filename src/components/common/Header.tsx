'use client'

import { AuthSection, Logo } from './header'

export default function Header() {
  return (
    <header className='sticky top-0 z-50 bg-white/70 dark:bg-black/60 backdrop-blur-xl border-b border-border/60'>
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <Logo />
          <div className='flex items-center space-x-4'>
            <AuthSection />
          </div>
        </div>
      </nav>
    </header>
  )
}
