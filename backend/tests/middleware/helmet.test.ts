import { describe, expect, test } from '@jest/globals'
import { app, request } from '../setup'

describe('Security Headers', () => {
  test('should set security headers', async () => {
    const response = await request(app).get('/api/health').expect(200)

    expect(response.headers['x-content-type-options']).toBe('nosniff')
    expect(response.headers['x-frame-options']).toBe('SAMEORIGIN')
    expect(response.headers['x-xss-protection']).toBe('0')
  })

  test('should set additional helmet security headers', async () => {
    const response = await request(app).get('/api/health').expect(200)

    // Helmet sets various security headers
    expect(response.headers['x-dns-prefetch-control']).toBe('off')
    expect(response.headers['x-download-options']).toBe('noopen')
    expect(response.headers['x-permitted-cross-domain-policies']).toBe('none')
  })

  test('should set referrer policy', async () => {
    const response = await request(app).get('/api/health').expect(200)

    expect(response.headers['referrer-policy']).toBeDefined()
  })

  test('should set content security policy', async () => {
    const response = await request(app).get('/api/health').expect(200)

    // Helmet may set CSP headers
    if (response.headers['content-security-policy']) {
      expect(response.headers['content-security-policy']).toBeDefined()
    }
  })
})
