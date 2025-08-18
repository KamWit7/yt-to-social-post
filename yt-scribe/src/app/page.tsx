'use client'

import TextShimmer from '@/components/animation/TextShimmer'
import Dashboard from '@/pages/dashboard/Dashboard'
import { useState } from 'react'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <div className='max-w-4xl mx-auto'>
      <div className='text-center my-10 md:my-12'>
        <TextShimmer
          text='Analiza wideo z AI.'
          className='text-4xl md:text-6xl font-bold mb-4 text-gray-800 dark:text-white'
          isLoading={isLoading}
        />
        <p className='max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400'>
          Wklej link do filmu z YouTube, aby uzyskać automatyczną transkrypcję,
          streszczenie i listę poruszanych tematów.
        </p>
      </div>

      <Dashboard setIsLoading={setIsLoading} />
    </div>
  )
}
