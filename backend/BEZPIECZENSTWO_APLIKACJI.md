# 🛡️ Instrukcja Zabezpieczenia Aplikacji - Krok po Kroku

## Przegląd Obecnego Stanu Bezpieczeństwa

Twoja aplikacja już posiada podstawowe zabezpieczenia:

- ✅ **Helmet** - nagłówki bezpieczeństwa
- ✅ **Rate Limiting** - ograniczenie żądań
- ✅ **CORS** - kontrola źródeł
- ✅ **JSON body parser** z limitem 10mb
- ✅ **Custom error handler**
- ✅ **404 handler**

Jednak test `should handle malformed JSON in request body` pokazuje, że potrzebujesz dodatkowych zabezpieczeń.

---

## 🔧 Krok 1: Obsługa Błędów JSON

### Problem

Express automatycznie parsuje JSON, ale błędy parsowania nie są obsługiwane w sposób kontrolowany.

### Rozwiązanie

#### 1.1. Dodaj middleware do obsługi błędów JSON w `src/middleware/errorHandler.ts`

```typescript
// Dodaj na górę pliku
import type { ErrorRequestHandler } from 'express'

// Dodaj nowy middleware PRZED istniejącym errorHandler
export const jsonErrorHandler: ErrorRequestHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Sprawdź czy to błąd parsowania JSON
  if (error instanceof SyntaxError && 'body' in error) {
    console.error(`JSON Parse Error: ${error.message}`)

    res.status(400).json({
      success: false,
      error: 'Invalid JSON format in request body',
      name: 'JSON_PARSE_ERROR',
    })
    return
  }

  // Przekaż do następnego error handlera
  next(error)
}
```

#### 1.2. Dodaj middleware w `src/server.ts`

```typescript
// Import nowego middleware
import {
  errorHandler,
  notFoundHandler,
  jsonErrorHandler,
} from './middleware/errorHandler'

// Dodaj PRZED istniejącym errorHandler
app.use(jsonErrorHandler)
app.use(errorHandler)
```

---

## 🔧 Krok 2: Walidacja Rozmiaru i Typu Danych

### 2.1. Dodaj middleware walidacji rozmiaru JSON

```typescript
// W src/middleware/validation.ts (nowy plik)
import type { Request, Response, NextFunction } from 'express'

export const validateJsonSize = (maxSize: number = 1024 * 1024) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = req.get('content-length')

    if (contentLength && parseInt(contentLength) > maxSize) {
      return res.status(413).json({
        success: false,
        error: `Payload too large. Maximum allowed size: ${maxSize} bytes`,
        name: 'PAYLOAD_TOO_LARGE',
      })
    }

    next()
  }
}

export const validateContentType = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const contentType = req.get('content-type')

    if (!contentType) {
      return res.status(400).json({
        success: false,
        error: 'Content-Type header is required',
        name: 'MISSING_CONTENT_TYPE',
      })
    }

    if (
      !contentType.includes('application/json') &&
      !contentType.includes('application/x-www-form-urlencoded')
    ) {
      return res.status(415).json({
        success: false,
        error: 'Unsupported Media Type. Use application/json',
        name: 'UNSUPPORTED_MEDIA_TYPE',
      })
    }
  }

  next()
}
```

### 2.2. Zastosuj nowe middleware w `src/server.ts`

```typescript
import { validateJsonSize, validateContentType } from './middleware/validation'

// Dodaj PRZED body parsing middleware
app.use(validateContentType)
app.use(validateJsonSize(5 * 1024 * 1024)) // 5MB limit

// Body parsing middleware
app.use(express.json({ limit: '5mb' })) // Zmniejsz z 10mb
app.use(express.urlencoded({ extended: true, limit: '5mb' }))
```

---

## 🔧 Krok 3: Dodatkowe Zabezpieczenia Request Body

### 3.1. Middleware sanityzacji danych

```typescript
// W src/middleware/sanitization.ts (nowy plik)
import type { Request, Response, NextFunction } from 'express'

// Funkcja do oczyszczania stringa z potencjalnie niebezpiecznych znaków
const sanitizeString = (str: string): string => {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

// Funkcja rekurencyjna do sanityzacji obiektów
const sanitizeObject = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (typeof obj === 'string') {
    return sanitizeString(obj)
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item))
  }

  if (typeof obj === 'object') {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      sanitized[sanitizeString(key)] = sanitizeObject(value)
    }
    return sanitized
  }

  return obj
}

export const sanitizeRequestBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body && typeof req.body === 'object') {
    try {
      req.body = sanitizeObject(req.body)
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request body format',
        name: 'SANITIZATION_ERROR',
      })
    }
  }

  next()
}
```

### 3.2. Dodaj do `src/server.ts`

```typescript
import { sanitizeRequestBody } from './middleware/sanitization'

// Dodaj PO body parsing middleware
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true, limit: '5mb' }))
app.use(sanitizeRequestBody) // Dodaj tutaj
```

---

## 🔧 Krok 4: Ulepsz Rate Limiting

### 4.1. Różne limity dla różnych endpointów

```typescript
// W src/middleware/rateLimiting.ts (nowy plik)
import rateLimit from 'express-rate-limit'

// Ogólny rate limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minut
  max: 100,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
    name: 'RATE_LIMIT_EXCEEDED',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Stricte limity dla operacji kosztownych
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minut
  max: 20, // Tylko 20 requestów na 15 minut
  message: {
    success: false,
    error:
      'Too many expensive operations from this IP, please try again later.',
    name: 'STRICT_RATE_LIMIT_EXCEEDED',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Limiter dla health checków
export const healthLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuta
  max: 60, // 60 requestów na minutę
  message: {
    success: false,
    error: 'Too many health check requests.',
    name: 'HEALTH_RATE_LIMIT_EXCEEDED',
  },
})
```

### 4.2. Zastosuj w routerach

```typescript
// W src/routes/youtubeRoutes.ts
import { strictLimiter } from '../middleware/rateLimiting'

// Dodaj strict limiter dla kosztownych operacji
router.get('/transcript', strictLimiter, (req, res, next) =>
  youtubeController.getTranscript(req, res, next)
)

router.get('/screenshot', strictLimiter, (req, res, next) =>
  youtubeController.takeScreenshot(req, res, next)
)
```

```typescript
// W src/routes/healtRoutes.ts
import { healthLimiter } from '../middleware/rateLimiting'

router.get('/health', healthLimiter, (req, res, next) =>
  healthController.getHealth(req, res, next)
)
```

---

## 🔧 Krok 5: Monitoring i Logowanie

### 5.1. Dodaj middleware logowania

```typescript
// W src/middleware/logging.ts (nowy plik)
import type { Request, Response, NextFunction } from 'express'

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now()
  const timestamp = new Date().toISOString()

  // Log request
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`)

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    )
  })

  next()
}

export const errorLogger = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const timestamp = new Date().toISOString()

  console.error(`[${timestamp}] ERROR: ${error.message}`)
  console.error(`[${timestamp}] Route: ${req.method} ${req.originalUrl}`)
  console.error(`[${timestamp}] IP: ${req.ip}`)
  console.error(`[${timestamp}] User-Agent: ${req.get('user-agent')}`)
  console.error(`[${timestamp}] Stack: ${error.stack}`)

  next(error)
}
```

### 5.2. Dodaj do `src/server.ts`

```typescript
import { requestLogger, errorLogger } from './middleware/logging'

// Dodaj na początku middleware stack
app.use(requestLogger)

// Dodaj PRZED error handlers
app.use(errorLogger)
app.use(jsonErrorHandler)
app.use(errorHandler)
```

---

## 🔧 Krok 6: Walidacja Input Parameters

### 6.1. Ulepsz walidację URL

```typescript
// W src/middleware/validation.ts (dodaj do istniejącego pliku)
export const validateYouTubeUrl = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { url } = req.query

  if (!url) {
    return res.status(400).json({
      success: false,
      error: 'URL parameter is required',
      name: 'MISSING_URL_PARAMETER',
    })
  }

  if (typeof url !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'URL must be a string',
      name: 'INVALID_URL_TYPE',
    })
  }

  // Sprawdź czy URL jest prawidłowy
  try {
    new URL(url)
  } catch {
    return res.status(400).json({
      success: false,
      error: 'Invalid URL format',
      name: 'INVALID_URL_FORMAT',
    })
  }

  // Sprawdź czy to YouTube URL
  const youtubePattern = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//
  if (!youtubePattern.test(url)) {
    return res.status(400).json({
      success: false,
      error: 'URL must be a valid YouTube URL',
      name: 'INVALID_YOUTUBE_URL',
    })
  }

  next()
}
```

### 6.2. Zastosuj w routerach

```typescript
// W src/routes/youtubeRoutes.ts
import { validateYouTubeUrl } from '../middleware/validation'

router.get('/transcript', strictLimiter, validateYouTubeUrl, (req, res, next) =>
  youtubeController.getTranscript(req, res, next)
)

router.get('/screenshot', strictLimiter, validateYouTubeUrl, (req, res, next) =>
  youtubeController.takeScreenshot(req, res, next)
)
```

---

## 🔧 Krok 7: Zabezpieczenia HTTPS i nagłówków

### 7.1. Ulepsz konfigurację Helmet

```typescript
// W src/server.ts
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Wyłącz jeśli masz problemy z YouTube
  })
)
```

### 7.2. Dodaj middleware HTTPS redirect (dla produkcji)

```typescript
// W src/middleware/security.ts (nowy plik)
import type { Request, Response, NextFunction } from 'express'

export const forceHTTPS = (req: Request, res: Response, next: NextFunction) => {
  if (
    process.env.NODE_ENV === 'production' &&
    !req.secure &&
    req.get('x-forwarded-proto') !== 'https'
  ) {
    return res.redirect(301, `https://${req.get('host')}${req.originalUrl}`)
  }
  next()
}

export const securityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=()'
  )

  next()
}
```

---

## 🔧 Krok 8: Timeouty i Circuit Breaker

### 8.1. Dodaj middleware timeout

```typescript
// W src/middleware/timeout.ts (nowy plik)
import type { Request, Response, NextFunction } from 'express'

export const requestTimeout = (timeoutMs: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).json({
          success: false,
          error: 'Request timeout',
          name: 'REQUEST_TIMEOUT',
        })
      }
    }, timeoutMs)

    res.on('finish', () => {
      clearTimeout(timeout)
    })

    res.on('close', () => {
      clearTimeout(timeout)
    })

    next()
  }
}
```

### 8.2. Zastosuj dla kosztownych operacji

```typescript
// W src/routes/youtubeRoutes.ts
import { requestTimeout } from '../middleware/timeout'

router.get(
  '/transcript',
  strictLimiter,
  validateYouTubeUrl,
  requestTimeout(60000), // 60 sekund dla transkrypcji
  (req, res, next) => youtubeController.getTranscript(req, res, next)
)

router.get(
  '/screenshot',
  strictLimiter,
  validateYouTubeUrl,
  requestTimeout(30000), // 30 sekund dla zrzutów ekranu
  (req, res, next) => youtubeController.takeScreenshot(req, res, next)
)
```

---

## 🔧 Krok 9: Dodaj Route Test dla Malformed JSON

### 9.1. Dodaj testowy endpoint (tylko dla testów)

```typescript
// W src/routes/youtubeRoutes.ts
// Dodaj tylko w środowisku testowym
if (process.env.NODE_ENV === 'test') {
  router.post('/test', (req, res) => {
    res.json({
      success: true,
      message: 'Test endpoint',
      receivedData: req.body,
    })
  })
}
```

---

## 🔧 Krok 10: Monitoring Memory Usage

### 10.1. Dodaj middleware do monitorowania pamięci

```typescript
// W src/middleware/monitoring.ts (nowy plik)
import type { Request, Response, NextFunction } from 'express'

export const memoryMonitor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const memUsage = process.memoryUsage()
  const memoryThreshold = 500 * 1024 * 1024 // 500MB

  if (memUsage.heapUsed > memoryThreshold) {
    console.warn(
      `High memory usage: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`
    )

    // Możesz dodać alerting lub odrzucenie requestu
    if (memUsage.heapUsed > memoryThreshold * 2) {
      return res.status(503).json({
        success: false,
        error: 'Service temporarily unavailable due to high memory usage',
        name: 'HIGH_MEMORY_USAGE',
      })
    }
  }

  next()
}
```

---

## 📝 Podsumowanie Implementacji

### Kolejność dodawania middleware w `server.ts`:

```typescript
// 1. Security
app.use(forceHTTPS)
app.use(
  helmet({
    /* config */
  })
)
app.use(securityHeaders)

// 2. Logging
app.use(requestLogger)

// 3. CORS
app.use(
  cors({
    /* config */
  })
)

// 4. Monitoring
app.use(memoryMonitor)

// 5. Rate limiting
app.use('/api/', generalLimiter)

// 6. Validation
app.use(validateContentType)
app.use(validateJsonSize(5 * 1024 * 1024))

// 7. Body parsing
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true, limit: '5mb' }))

// 8. Sanitization
app.use(sanitizeRequestBody)

// 9. Routes
app.use('/api', youtubeRoutes)
app.use('/api', healthRoutes)

// 10. Error handling
app.use(notFoundHandler)
app.use(errorLogger)
app.use(jsonErrorHandler)
app.use(errorHandler)
```

---

## 🚀 Dodatkowe Rekomendacje

### Zmienne środowiskowe w `.env`:

```env
# Security
MAX_REQUEST_SIZE=5242880  # 5MB
REQUEST_TIMEOUT=30000     # 30 seconds
RATE_LIMIT_WINDOW=900000  # 15 minutes
RATE_LIMIT_MAX=100        # requests per window

# Monitoring
MEMORY_THRESHOLD=524288000  # 500MB
LOG_LEVEL=info

# Production
FORCE_HTTPS=true
```

### Regularne aktualizacje dependencies:

- Uruchamiaj `npm audit` co tydzień
- Aktualizuj `helmet`, `express-rate-limit`, i inne security packages
- Monitoruj CVE dla używanych bibliotek

### Monitoring produkcyjny:

- Zintegruj z systemami jak Sentry, DataDog
- Skonfiguruj alerty dla błędów 5xx
- Monitoruj metryki performance

---

Ten przewodnik implementuje wielowarstwowe zabezpieczenia, które chronią Twoją aplikację przed najczęstszymi atakami i błędami, włączając te związane z nieprawidłowym formatem JSON.
