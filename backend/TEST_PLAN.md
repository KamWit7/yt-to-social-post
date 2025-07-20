# Plan testów dla YouTube Transcript API

## 🛠️ Rekomendowane technologie testowe

### Główne narzędzia

- **Jest** - Framework testowy z doskonałym wsparciem dla TypeScript
- **Supertest** - Biblioteka do testowania HTTP endpoint-ów Express.js
- **@types/jest** - Typy TypeScript dla Jest
- **ts-jest** - Preprocessor TypeScript dla Jest

### Dodatkowe narzędzia

- **nock** - Mockowanie HTTP requestów (jeśli potrzebne)
- **jest-puppeteer** - Integracja Puppeteer z Jest
- **@types/supertest** - Typy TypeScript dla Supertest

### Instalacja

```bash
npm install --save-dev jest supertest @types/jest @types/supertest ts-jest jest-puppeteer
```

---

## 📋 Plan testów dla endpointów

### 1. GET /health

**Cel testu:** Weryfikacja działania endpointu health check

**Implementacja:**

```typescript
describe('GET /health', () => {
  test('should return 200 and health status', async () => {
    const response = await request(app).get('/health').expect(200)

    expect(response.body).toMatchObject({
      success: true,
      message: 'YouTube Transcript API is running',
      timestamp: expect.any(String),
    })
  })

  test('should return valid timestamp format', async () => {
    const response = await request(app).get('/health')
    const timestamp = new Date(response.body.timestamp)
    expect(timestamp).toBeInstanceOf(Date)
    expect(timestamp.getTime()).not.toBeNaN()
  })
})
```

---

### 2. GET /api/transcript

**Cel testu:** Testowanie pobierania transkrypcji z YouTube

**Implementacja:**

```typescript
describe('GET /api/transcript', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return transcript for valid YouTube URL', async () => {
    const mockTranscriptData = {
      transcript: [{ text: 'Hello world', start: 0, duration: 2 }],
      title: 'Test Video',
      description: 'Test Description',
    }

    jest
      .spyOn(YouTubeService.prototype, 'getTranscript')
      .mockResolvedValue(mockTranscriptData)

    const response = await request(app)
      .get('/api/transcript')
      .query({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
      .expect(200)

    expect(response.body).toMatchObject({
      success: true,
      data: mockTranscriptData,
    })
  })

  test('should return 400 for missing URL parameter', async () => {
    const response = await request(app).get('/api/transcript').expect(400)

    expect(response.body).toMatchObject({
      success: false,
      error: expect.any(String),
    })
  })

  test('should return 400 for invalid URL format', async () => {
    const response = await request(app)
      .get('/api/transcript')
      .query({ url: 'invalid-url' })
      .expect(400)

    expect(response.body).toMatchObject({
      success: false,
      error: expect.stringContaining('Invalid URL'),
    })
  })

  test('should return 400 for non-YouTube URL', async () => {
    const response = await request(app)
      .get('/api/transcript')
      .query({ url: 'https://google.com' })
      .expect(400)

    expect(response.body).toMatchObject({
      success: false,
      error: expect.stringContaining('YouTube'),
    })
  })

  test('should handle service errors gracefully', async () => {
    jest
      .spyOn(YouTubeService.prototype, 'getTranscript')
      .mockRejectedValue(new Error('Puppeteer error'))

    const response = await request(app)
      .get('/api/transcript')
      .query({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
      .expect(500)

    expect(response.body).toMatchObject({
      success: false,
      error: expect.any(String),
    })
  })

  test('should respect rate limiting', async () => {
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

    // Make multiple requests to trigger rate limit
    const requests = Array(101)
      .fill(0)
      .map(() => request(app).get('/api/transcript').query({ url }))

    const responses = await Promise.all(requests)
    const rateLimitedResponses = responses.filter((r) => r.status === 429)

    expect(rateLimitedResponses.length).toBeGreaterThan(0)
  })
})
```

---

### 3. GET /api/screenshot

**Cel testu:** Testowanie funkcjonalności screenshot YouTube video

**Implementacja:**

```typescript
describe('GET /api/screenshot', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return screenshot data for valid YouTube URL', async () => {
    const mockScreenshotData = {
      path: 'screenshot.png',
      buffer: Buffer.from('mock-image-data'),
    }

    jest
      .spyOn(YouTubeService.prototype, 'takeScreenshot')
      .mockResolvedValue(mockScreenshotData)

    const response = await request(app)
      .get('/api/screenshot')
      .query({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
      .expect(200)

    expect(response.body).toMatchObject({
      success: true,
      data: mockScreenshotData,
    })
  })

  test('should return 400 for missing URL parameter', async () => {
    const response = await request(app).get('/api/screenshot').expect(400)

    expect(response.body).toMatchObject({
      success: false,
      error: expect.any(String),
    })
  })

  test('should return 400 for invalid URL format', async () => {
    const response = await request(app)
      .get('/api/screenshot')
      .query({ url: 'not-a-url' })
      .expect(400)

    expect(response.body).toMatchObject({
      success: false,
      error: expect.stringContaining('Invalid URL'),
    })
  })

  test('should handle screenshot service errors', async () => {
    jest
      .spyOn(YouTubeService.prototype, 'takeScreenshot')
      .mockRejectedValue(new Error('Screenshot failed'))

    const response = await request(app)
      .get('/api/screenshot')
      .query({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
      .expect(500)

    expect(response.body).toMatchObject({
      success: false,
      error: expect.any(String),
    })
  })
})
```

---

### 4. 404 Handler Test

**Cel testu:** Weryfikacja obsługi nieistniejących route-ów

**Implementacja:**

```typescript
describe('404 Handler', () => {
  test('should return 404 for non-existent routes', async () => {
    const response = await request(app).get('/api/nonexistent').expect(404)

    expect(response.body).toMatchObject({
      success: false,
      error: expect.stringContaining('Route /api/nonexistent not found'),
    })
  })

  test('should return 404 for invalid HTTP methods', async () => {
    const response = await request(app).post('/api/transcript').expect(404)

    expect(response.body).toMatchObject({
      success: false,
      error: expect.any(String),
    })
  })
})
```

---

### 5. Middleware Tests

**Cel testu:** Testowanie middleware (CORS, Security, Rate Limiting)

**Implementacja:**

```typescript
describe('Middleware', () => {
  describe('CORS', () => {
    test('should set CORS headers', async () => {
      const response = await request(app).get('/health').expect(200)

      expect(response.headers['access-control-allow-origin']).toBeDefined()
    })

    test('should handle preflight requests', async () => {
      const response = await request(app).options('/api/transcript').expect(200)

      expect(response.headers['access-control-allow-methods']).toBeDefined()
    })
  })

  describe('Security Headers', () => {
    test('should set security headers', async () => {
      const response = await request(app).get('/health')

      expect(response.headers['x-content-type-options']).toBe('nosniff')
      expect(response.headers['x-frame-options']).toBe('DENY')
      expect(response.headers['x-xss-protection']).toBe('1; mode=block')
    })
  })

  describe('Body Parser', () => {
    test('should reject payloads larger than 10mb', async () => {
      const largePayload = 'x'.repeat(11 * 1024 * 1024) // 11MB

      const response = await request(app)
        .post('/api/test')
        .send({ data: largePayload })
        .expect(413)
    })
  })
})
```

---

### 6. Integration Tests

**Cel testu:** End-to-end testowanie z prawdziwym Puppeteer (opcjonalne)

**Implementacja:**

```typescript
describe('Integration Tests', () => {
  // Te testy wymagają prawdziwego środowiska z Chrome/Chromium

  test('should fetch real transcript from YouTube (slow)', async () => {
    const realYouTubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

    const response = await request(app)
      .get('/api/transcript')
      .query({ url: realYouTubeUrl })
      .timeout(30000) // 30 seconds timeout

    if (response.status === 200) {
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('transcript')
      expect(response.body.data).toHaveProperty('title')
    }
  }, 30000)
}, 60000)
```

---

## 🧪 Setup testów

### jest.config.js

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/puppetieer/**', // Exclude Puppeteer files from coverage
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 10000,
}
```

### tests/setup.ts

```typescript
import { app } from '../src/server'
import request from 'supertest'

// Global test setup
global.request = request
global.app = app

// Mock Puppeteer for unit tests
jest.mock('../src/puppetieer/youtube/YoutubePuppeteer')

beforeAll(async () => {
  // Setup przed wszystkimi testami
})

afterAll(async () => {
  // Cleanup po wszystkich testach
})

beforeEach(() => {
  // Reset mocks przed każdym testem
  jest.clearAllMocks()
})
```

### package.json scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:integration": "jest --testNamePattern='Integration Tests'"
  }
}
```

---

## 📊 Metryki pokrycia

**Cel:** Minimum 80% pokrycia kodu testami

- **Controllers:** 90%+ coverage
- **Services:** 85%+ coverage
- **Routes:** 95%+ coverage
- **Middleware:** 90%+ coverage
- **Utils:** 95%+ coverage
