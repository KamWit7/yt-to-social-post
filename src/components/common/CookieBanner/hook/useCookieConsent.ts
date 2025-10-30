'use client'

import { useEffect, useState } from 'react'

export interface CookiePreferences {
  essential: boolean // always true
  analytics: boolean
  marketing: boolean
  functional: boolean
}

interface CookieConsent {
  preferences: CookiePreferences
  timestamp: string // ISO date of consent
  version: string // consent version for future updates
}

const COOKIE_CONSENT_KEY = 'cookie-consent'
const COOKIE_CONSENT_VERSION = '1.0'

function getCookiePreferences(): CookiePreferences | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!stored) {
      return null
    }

    const consent: CookieConsent = JSON.parse(stored)
    return consent.preferences
  } catch (error) {
    console.error('Error reading cookie preferences:', error)
    return null
  }
}

function setCookiePreferences(preferences: CookiePreferences): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const consent: CookieConsent = {
      preferences,
      timestamp: new Date().toISOString(),
      version: COOKIE_CONSENT_VERSION,
    }

    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent))
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new Event('cookieConsentChanged'))
  } catch (error) {
    console.error('Error saving cookie preferences:', error)
  }
}

function hasUserConsented(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  return localStorage.getItem(COOKIE_CONSENT_KEY) !== null
}

export function getDefaultPreferences(): CookiePreferences {
  return {
    essential: true,
    analytics: true,
    marketing: true,
    functional: true,
  }
}

export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null)
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    const loadPreferences = () => {
      const storedPreferences = getCookiePreferences()
      const userConsented = hasUserConsented()

      setPreferences(storedPreferences)
      setHasConsent(userConsented)
    }

    loadPreferences()

    window.addEventListener('cookieConsentChanged', loadPreferences)
    window.addEventListener('storage', loadPreferences)

    return () => {
      window.removeEventListener('cookieConsentChanged', loadPreferences)
      window.removeEventListener('storage', loadPreferences)
    }
  }, [])

  const acceptAll = () => {
    const allEnabled = getDefaultPreferences()
    setCookiePreferences(allEnabled)
    setPreferences(allEnabled)
    setHasConsent(true)
  }

  const savePreferences = (prefs: CookiePreferences) => {
    setCookiePreferences(prefs)
    setPreferences(prefs)
    setHasConsent(true)
  }

  return {
    preferences,
    hasConsent,
    acceptAll,
    savePreferences,
  }
}
