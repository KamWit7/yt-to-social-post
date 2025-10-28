# Feature 0014: Simple and Elegant Cookie Banner

## Overview

Add a simple and elegant cookie banner to the application that appears on first visit, allows users to accept or customize cookie preferences, and persists their choice in localStorage. The banner should follow modern UX principles and integrate seamlessly with the existing purple gradient branding.

## Technical Requirements

### 1. Cookie Consent Component

**File to create:** `src/components/common/CookieBanner/CookieBanner.tsx`

A compact banner component displayed at the bottom of the page that:

- Displays on first visit (checks localStorage for `cookie-consent` key)
- Fixed position at bottom of viewport with clean white background
- Contains description text: "This site uses tracking technologies. You may opt in or opt out of the use of these technologies."
- Provides three action buttons in a row:
  - **"Deny"** - Rejects all non-essential cookies (text button style)
  - **"Accept all"** - Accepts all cookies (text button style)
  - **"Consent Settings"** - Opens preferences modal (dark button with rounded corners)
- Minimal height, horizontally centered layout
- Auto-dismisses with fade-out animation on user action

**Visual Design (matching reference screenshots):**

- Clean white background with subtle shadow
- Text is dark gray/black, left-aligned or centered
- Buttons arranged horizontally at the bottom/right
- "Consent Settings" button has black/dark background with white text and rounded corners
- "Deny" and "Accept all" are text-style buttons (no heavy background)
- Compact padding for minimal screen space usage
- Responsive: Stack buttons vertically on mobile if needed

**Component Structure:**

```typescript
interface CookieBannerProps {
  onAcceptAll?: () => void
  onDeny?: () => void
  onOpenSettings?: () => void
}
```

**State Management:**

- Local state for banner visibility using `useState`
- Local state for modal visibility using `useState`
- `useEffect` hook to check localStorage on mount
- Animation state using Framer Motion's `AnimatePresence`

**User Flows:**

1. **Accept All**: Closes banner immediately, saves all preferences as `true` to localStorage
2. **Deny**: Closes banner immediately, saves only `essential: true`, others as `false` to localStorage
3. **Consent Settings**: Opens the preferences modal (CookiePreferences component)

### 2. Cookie Preferences Modal

**File to create:** `src/components/common/CookieBanner/CookiePreferences.tsx`

A centered modal dialog component (matching reference screenshots) that provides granular cookie control:

**Layout (matching reference image 1):**

- Modal title: "Your Privacy" (large, bold heading at top)
- Description text below title: "This site uses tracking technologies. You may opt in or opt out of the use of these technologies."
- Four cookie category rows with toggle switches:
  - **Essential** - Toggle disabled (always on, grayed out)
  - **Marketing** - Interactive toggle
  - **Analytics** - Interactive toggle
  - **Functional** - Interactive toggle
- Three action buttons at bottom:
  - **"Deny"** - Text button on left
  - **"Accept all"** - Text button in middle
  - **"Save"** - Dark button on right (primary action)
- Privacy Policy link at bottom (optional)

**Visual Design:**

- White background with rounded corners (`rounded-2xl`)
- Centered on screen with backdrop overlay
- Each cookie row has label on left, toggle on right
- Toggle switches use standard styling (gray when off, colored when on)
- Padding: `p-8` for spacious feel
- Shadow: `shadow-xl` for elevation

**Component Structure:**

```typescript
interface CookiePreferencesProps {
  isOpen: boolean
  onClose: () => void
  onSave: (preferences: CookiePreferences) => void
}

interface CookiePreferences {
  essential: boolean // always true
  analytics: boolean
  marketing: boolean
  functional: boolean
}
```

### 3. Cookie Context Provider (Optional but Recommended)

**File to create:** `src/components/provider/CookieProvider.tsx`

Provides cookie consent state throughout the application:

- Manages cookie preferences state
- Provides helpers to check if specific cookie types are allowed
- Handles localStorage persistence
- Provides API for other components to query consent status

**Context Interface:**

```typescript
interface CookieContextValue {
  preferences: CookiePreferences | null
  hasConsent: boolean
  acceptAll: () => void
  savePreferences: (prefs: CookiePreferences) => void
  isAllowed: (type: keyof CookiePreferences) => boolean
}
```

### 4. Utility Functions

**File to create:** `src/lib/cookies.ts`

Utility functions for cookie management:

- `getCookiePreferences(): CookiePreferences | null` - Read from localStorage
- `setCookiePreferences(prefs: CookiePreferences): void` - Write to localStorage
- `hasUserConsented(): boolean` - Check if user has made a choice
- `COOKIE_CONSENT_KEY = 'cookie-consent'` - Storage key constant

**Storage Schema:**

```typescript
// Stored in localStorage under 'cookie-consent' key
{
  preferences: {
    essential: true,
    analytics: boolean,
    marketing: boolean,
    functional: boolean
  },
  timestamp: string, // ISO date of consent
  version: string // consent version for future updates
}
```

### 5. Integration Points

**File to modify:** `src/app/layout.tsx`

- Import and render `CookieBanner` component after `</body>` closing tag but before `</html>`
- Wrap with `CookieProvider` if using context approach
- Position: After `InitialTransition` component for proper layering

**Example Integration:**

```typescript
// Add to RootLayout return statement
<body>
  <SessionProvider>
    <QueryProvider>
      <UsageProvider>
        <CookieProvider>
          <div className='...'>
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
          <InitialTransition />
          <CookieBanner />
        </CookieProvider>
      </UsageProvider>
    </QueryProvider>
  </SessionProvider>
</body>
```

## Implementation Details

### Styling Approach (matching reference screenshots)

**Banner (compact at bottom):**

- Background: `bg-white` with `shadow-lg`
- Border: Optional subtle `border-t border-gray-200`
- Padding: `px-6 py-4` for compact feel
- Text: `text-gray-700 text-sm`
- Button layout: `flex gap-3 items-center justify-center` or `justify-end`
- "Consent Settings" button: `bg-black text-white rounded-lg px-6 py-2.5 hover:bg-gray-800`
- "Deny" and "Accept all": `text-gray-700 hover:text-black font-medium`

**Modal (centered):**

- Background: `bg-white rounded-2xl` with `shadow-2xl`
- Backdrop: `bg-black/50 backdrop-blur-sm`
- Width: `max-w-md` for compact modal
- Padding: `p-8`
- Title: `text-2xl font-bold mb-3`
- Description: `text-gray-600 text-sm mb-6`
- Cookie rows: `flex items-center justify-between py-4 border-b border-gray-100`
- Toggle switches: Use `@radix-ui/react-switch` or custom toggle component
- Save button: `bg-black text-white rounded-lg px-8 py-2.5 hover:bg-gray-800`
- Deny/Accept all buttons: `text-gray-600 hover:text-black font-medium`
- Privacy link: `text-xs text-gray-500 hover:text-gray-700 underline`

### Animation Specifications

- **Entrance:** Slide up from bottom with fade-in over 400ms using `ease-out`
- **Exit:** Fade out over 200ms using `ease-in`
- **Hover states:** Scale transform `hover:scale-[1.02]` with shadow increase
- **Button interactions:** `active:scale-[0.98]` for tactile feedback

### Accessibility Requirements

- ARIA labels on all interactive elements
- Keyboard navigation support (Tab, Enter, Escape)
- Focus visible states using existing `focus-visible:ring-ring` pattern
- Screen reader announcements for modal open/close
- High contrast text (WCAG AA compliant)
- Semantic HTML structure (`role="dialog"`, `aria-modal="true"`)

### Polish Language Content

All text content should be in Polish to match the application:

**Banner (compact view):**

- Description: "Ta strona używa technologii śledzących. Możesz zdecydować o ich użyciu."
- Deny button: "Odrzuć"
- Accept all button: "Zaakceptuj wszystkie"
- Settings button: "Ustawienia zgody"

**Modal (preferences view):**

- Modal title: "Twoja Prywatność"
- Modal description: "Ta strona używa technologii śledzących. Możesz zdecydować o ich użyciu."
- Essential: "Niezbędne"
- Marketing: "Marketingowe"
- Analytics: "Analityczne"
- Functional: "Funkcjonalne"
- Deny button: "Odrzuć"
- Accept all button: "Zaakceptuj wszystkie"
- Save button: "Zapisz"
- Privacy Policy link: "Przeczytaj jak przetwarzamy Twoje dane w naszej Polityce Prywatności"

### Z-Index Management

- Cookie banner: `z-50` (above content)
- Modal backdrop: `z-[60]` (above banner)
- Cookie preferences modal: `z-[70]` (above backdrop)

### Toggle Switch Component

Since the reference screenshots show standard toggle switches, implement or use:

- Custom toggle using `<input type="checkbox">` with Tailwind styling
- Or use Radix UI's `@radix-ui/react-switch` component
- Disabled state for "Essential" (grayed out, non-interactive)
- Active state: Background color (can use purple/blue for brand consistency)
- Inactive state: Gray background

## Component Interaction Flow

### Initial Load (No Consent Stored)

1. User visits site for the first time
2. **CookieBanner** (compact banner) slides up from bottom
3. User sees three options: "Odrzuć", "Zaakceptuj wszystkie", "Ustawienia zgody"

### User Actions

**Option 1: Click "Zaakceptuj wszystkie"**

- All cookies set to `true` (essential, analytics, marketing, functional)
- Save to localStorage with timestamp
- Banner fades out
- No modal shown

**Option 2: Click "Odrzuć"**

- Only essential cookies set to `true`, all others set to `false`
- Save to localStorage with timestamp
- Banner fades out
- No modal shown

**Option 3: Click "Ustawienia zgody"**

- Keep banner visible OR hide banner
- Open **CookiePreferences** modal (centered, with backdrop)
- Show 4 toggle switches (Essential disabled, others interactive)
- User can toggle individual preferences
- User clicks "Zapisz" → Save preferences and close modal
- User clicks "Zaakceptuj wszystkie" in modal → Same as Accept All
- User clicks "Odrzuć" in modal → Same as Deny
- Close modal → Return to banner OR hide everything if preferences saved

### Subsequent Visits

- Check localStorage for 'cookie-consent'
- If consent exists, don't show banner
- If consent doesn't exist, show banner

## Files Summary

### New Files to Create:

1. `src/components/common/CookieBanner/CookieBanner.tsx` - Main banner component (compact bottom banner)
2. `src/components/common/CookieBanner/CookiePreferences.tsx` - Preferences modal (full modal with toggles)
3. `src/components/common/CookieBanner/CookieToggle.tsx` - Toggle switch component (for cookie preferences)
4. `src/components/common/CookieBanner/index.ts` - Barrel export
5. `src/components/provider/CookieProvider.tsx` - Context provider (optional but recommended)
6. `src/lib/cookies.ts` - Utility functions
7. `src/types/cookies.ts` - TypeScript types

### Files to Modify:

1. `src/app/layout.tsx` - Integrate CookieBanner component

## Technical Considerations

### Performance

- Component is client-side only (`'use client'`)
- Minimal re-renders using `useCallback` for handlers
- Lazy load preferences modal (only mount when needed)
- Small bundle impact (~3-4KB gzipped)

### Browser Compatibility

- Uses standard localStorage API (supported in all modern browsers)
- Framer Motion animations with fallbacks
- CSS backdrop-filter with fallback background

### Future Enhancements (Out of Scope)

- Integration with Google Tag Manager based on consent
- Cookie policy page with detailed information
- Consent version management for GDPR compliance
- Analytics event tracking for consent actions
- A/B testing different banner designs
