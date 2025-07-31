'use client'

import { Button } from '@/components/ui/button'
import { LogIn } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <header className='sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-sm'>
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center space-x-4'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='h-6 w-6 text-gray-700 dark:text-gray-300'>
              <path d='M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z' />
              <path d='M10 2c1 .5 2 2 2 5' />
            </svg>
            <span className='text-lg font-semibold text-gray-800 dark:text-white'>
              Transkrypcje AI
            </span>
          </div>
          <Button
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            variant='ghost'
            className='flex items-center space-x-2 px-3 py-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/70 text-sm font-semibold transition-colors'>
            <LogIn className='w-4 h-4' />
            <span>{isLoggedIn ? 'Moje konto' : 'Zaloguj się'}</span>
          </Button>
        </div>
      </nav>
    </header>
  )
}
