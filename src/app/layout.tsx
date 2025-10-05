import InitialTransition from '@/components/animation/InitialTransition'
import Footer from '@/components/common/Footer'
import Header from '@/components/common/Header'
import { QueryProvider } from '@/components/provider/QueryProvider'
import { SessionProvider } from '@/components/provider/SessionProvider'
import { UsageProvider } from '@/context'
import { HEADERS_PATH_KEY } from '@/middleware'
import { ROUTES } from '@/utils/constants'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'
import { Dictionary } from '@/components/dashboard/TranscriptionForms/forms/Form.constants'

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const pathname = headersList.get(HEADERS_PATH_KEY)

  const isChatPage = pathname === ROUTES.CHAT
  return (
    <html lang={Dictionary.Language.Polish}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <QueryProvider>
            <UsageProvider>
              {isChatPage ? (
                children
              ) : (
                <div
                  className='bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 font-sans
              flex flex-col min-h-screen'>
                  <Header />

                  <main className='p-4 md:p-8 flex-1'>{children}</main>
                  <Footer />
                </div>
              )}
              <InitialTransition />
            </UsageProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
