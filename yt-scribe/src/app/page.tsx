import { TranscriptionForm } from '@/pages/dashboard'

export default function Home() {
  return (
    <div className='max-w-4xl mx-auto'>
      {/* Input Section */}
      <div className='text-center my-12 md:my-16'>
        <h1 className='text-4xl md:text-6xl font-bold mb-4 text-gray-800 dark:text-white'>
          Analiza wideo z AI.
        </h1>
        <p className='max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400'>
          Wklej link do filmu z YouTube, aby uzyskać automatyczną transkrypcję,
          streszczenie i listę poruszanych tematów.
        </p>
      </div>

      <TranscriptionForm />
    </div>
  )
}
