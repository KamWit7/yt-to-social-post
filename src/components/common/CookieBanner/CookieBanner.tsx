'use client'

import { useCookieConsent } from '@/components/common/CookieBanner/hook/useCookieConsent'
import { Button } from '@/components/ui/button'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import CookiePreferencesModal from './components/CookiePreferences'

export default function CookieBanner() {
  const { hasConsent, acceptAll, denyAll } = useCookieConsent()
  const [isVisible, setIsVisible] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)

  useEffect(() => {
    if (hasConsent) {
      return
    }

    // Small delay for better UX
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1600)

    return () => clearTimeout(timer)
  }, [hasConsent])

  const handleAcceptAll = () => {
    acceptAll()
    setIsVisible(false)
  }

  const handleDeny = () => {
    denyAll()
    setIsVisible(false)
  }

  const handleOpenPreferences = () => {
    setShowPreferences(true)
  }

  const handleClosePreferences = () => {
    setShowPreferences(false)
  }

  // Don't render anything if consent already given
  if (hasConsent) {
    return null
  }

  return (
    <>
      {/* Cookie Banner */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className='fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200'>
            <div className='max-w-7xl mx-auto px-6 py-4'>
              <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
                {/* Description */}
                <p className='text-sm text-gray-700 text-center sm:text-left'>
                  Ta stona używa ciasteczek aby poprawić swoją pracę. Możesz
                  zdecydować o ich użyciu.
                </p>

                {/* Buttons */}
                <div className='flex flex-wrap items-center justify-center gap-3'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleDeny}
                    aria-label='Odrzuć wszystkie pliki cookie'>
                    Odrzuć
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleAcceptAll}
                    aria-label='Zaakceptuj wszystkie pliki cookie'>
                    Zaakceptuj wszystkie
                  </Button>
                  <Button
                    variant='secondary'
                    size='default'
                    onClick={handleOpenPreferences}
                    aria-label='Otwórz ustawienia plików cookie'>
                    Ustawienia zgody
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookie Preferences Modal */}
      <CookiePreferencesModal
        isOpen={showPreferences}
        onClose={handleClosePreferences}
      />
    </>
  )
}
