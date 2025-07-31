import Footer from '@/components/common/Footer'
import Header from '@/components/common/Header'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Transkrypcje AI - Analiza wideo z AI',
  description:
    'Wklej link do filmu z YouTube, aby uzyskać automatyczną transkrypcję, streszczenie i listę poruszanych tematów.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='pl'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className='bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 font-sans'>
          <Header />
          <main className='p-4 md:p-8 h-[calc(100vh-242px)]'>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
