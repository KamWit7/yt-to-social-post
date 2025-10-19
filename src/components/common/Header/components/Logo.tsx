import { ROUTES } from '@/utils/constants'
import Link from 'next/link'

export function Logo() {
  return (
    <Link
      href={ROUTES.DASHBOARD}
      className='group flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-gray-100/60 dark:hover:bg-gray-800/40 transition-all duration-200 ease-out'
      aria-label='YT Scribe - Przejdź do pulpitu'>
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
        className='h-6 w-6 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-all duration-200 group-hover:scale-105'>
        <path d='M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20' />
        <path d='M8 7h8' />
        <path d='M8 11h8' />
      </svg>
      <span className='text-lg font-semibold tracking-tight text-gray-800 dark:text-white group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200'>
        YT Scribe
      </span>
    </Link>
  )
}
