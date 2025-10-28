'use client'

import {
  getDefaultPreferences,
  useCookieConsent,
  type CookiePreferences,
} from '@/components/common/CookieBanner/hook/useCookieConsent'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useEffect, useState } from 'react'
import CookieToggle from './CookieToggle'

interface CookiePreferencesModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CookiePreferencesModal({
  isOpen,
  onClose,
}: CookiePreferencesModalProps) {
  const { savePreferences: saveCookiePreferences, acceptAll } =
    useCookieConsent()
  const [preferences, setPreferences] = useState<CookiePreferences>(
    getDefaultPreferences()
  )

  useEffect(() => {
    // Reset preferences when modal opens
    if (isOpen) {
      setPreferences(getDefaultPreferences())
    }
  }, [isOpen])

  const handleSave = () => {
    saveCookiePreferences(preferences)
    onClose()
  }

  const handleAcceptAll = () => {
    acceptAll()
    onClose()
  }

  const handleToggle = (key: keyof CookiePreferences, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}>
      <DialogContent className='bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-modal'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-gray-900'>
            Twoja Prywatność
          </DialogTitle>
          <DialogDescription className='text-sm text-gray-600'>
            Ta strona używa technologii śledzących. Możesz zdecydować o ich
            użyciu.
          </DialogDescription>
        </DialogHeader>

        {/* Cookie Toggles */}
        <div>
          <CookieToggle
            label='Niezbędne'
            description='Wymagane do podstawowego działania strony'
            checked={preferences.essential}
            onChange={() => {}}
            disabled={true}
          />
          <CookieToggle
            label='Analityczne'
            description='Pomagają nam zrozumieć, jak korzystasz ze strony'
            checked={preferences.analytics}
            onChange={(checked) => handleToggle('analytics', checked)}
          />
          <CookieToggle
            label='Marketingowe'
            description='Wykorzystywane do personalizacji reklam'
            checked={preferences.marketing}
            onChange={(checked) => handleToggle('marketing', checked)}
          />
          <CookieToggle
            label='Funkcjonalne'
            description='Umożliwiają zaawansowane funkcje strony'
            checked={preferences.functional}
            onChange={(checked) => handleToggle('functional', checked)}
          />
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between'>
          <div className='flex gap-3'>
            <Button variant='outline' size='sm' onClick={onClose}>
              Odrzuć
            </Button>
            <Button variant='outline' size='sm' onClick={handleAcceptAll}>
              Zaakceptuj wszystkie
            </Button>
          </div>
          <Button variant='default' size='default' onClick={handleSave}>
            Zapisz
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
