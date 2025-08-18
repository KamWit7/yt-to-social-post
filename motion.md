# Plan implementacji animacji Text Shimmer dla "Analiza wideo z AI."

## Analiza obecnego stanu:

- Projekt używa Next.js 15 z React 19
- Główny nagłówek znajduje się w `yt-scribe/src/app/page.tsx`
- Używa Tailwind CSS do stylowania
- **Brakuje biblioteki framer-motion** - trzeba ją dodać

## Szczegółowe kroki implementacji:

### Krok 1: Instalacja zależności

```bash
cd yt-scribe
npm install framer-motion
```

### Krok 2: Utworzenie komponentu TextShimmer

```typescript
// yt-scribe/src/components/ui/TextShimmer.tsx
import { motion } from 'framer-motion'

interface TextShimmerProps {
  text: string
  className?: string
}

export default function TextShimmer({
  text,
  className = '',
}: TextShimmerProps) {
  return (
    <motion.h1
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}>
      {text}
      <motion.span
        className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent'
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'easeInOut',
        }}
      />
    </motion.h1>
  )
}
```

### Krok 3: Modyfikacja głównej strony

```typescript
// yt-scribe/src/app/page.tsx
import Dashboard from '@/pages/dashboard/Dashboard'
import TextShimmer from '@/components/ui/TextShimmer'

export default function Home() {
  return (
    <div className='max-w-4xl mx-auto'>
      <div className='text-center my-10 md:my-12'>
        <TextShimmer
          text='Analiza wideo z AI.'
          className='text-4xl md:text-6xl font-bold mb-4 text-gray-800 dark:text-white'
        />
        <p className='max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400'>
          Wklej link do filmu z YouTube, aby uzyskać automatyczną transkrypcję,
          streszczenie i listę poruszanych tematów.
        </p>
      </div>

      <Dashboard />
    </div>
  )
}
```

### Krok 4: Dostosowanie animacji do ciemnego motywu

```typescript
// yt-scribe/src/components/ui/TextShimmer.tsx - wersja z obsługą ciemnego motywu
import { motion } from 'framer-motion'

interface TextShimmerProps {
  text: string
  className?: string
}

export default function TextShimmer({
  text,
  className = '',
}: TextShimmerProps) {
  return (
    <motion.h1
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}>
      {text}
      <motion.span
        className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10'
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'easeInOut',
        }}
      />
    </motion.h1>
  )
}
```

### Krok 5: Dodanie responsywności i optymalizacji

```typescript
// yt-scribe/src/components/ui/TextShimmer.tsx - wersja finalna
import { motion } from 'framer-motion'

interface TextShimmerProps {
  text: string
  className?: string
}

export default function TextShimmer({
  text,
  className = '',
}: TextShimmerProps) {
  return (
    <motion.h1
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: 'easeOut',
        delay: 0.2,
      }}>
      {text}
      <motion.span
        className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10'
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatDelay: 4,
          ease: 'easeInOut',
        }}
      />
    </motion.h1>
  )
}
```

## Komendy do wykonania:

```bash
cd yt-scribe
npm install framer-motion
```

Następnie utworzyć plik `yt-scribe/src/components/ui/TextShimmer.tsx` z komponentem i zmodyfikować `yt-scribe/src/app/page.tsx`.

## Podsumowanie:

Plan obejmuje 5 głównych kroków od instalacji framer-motion po finalną implementację z responsywnością i obsługą ciemnego motywu. Animacja będzie zawierać:

- Efekt fade-in z dołu do góry
- Efekt shimmer (błyszcząca linia przesuwająca się od lewej do prawej)
- Responsywność na różnych urządzeniach
- Obsługę ciemnego motywu
- Optymalizację wydajności

Każdy krok jest mały i bezpieczny, budując na poprzednim bez wprowadzania dużych zmian w architekturze projektu.
