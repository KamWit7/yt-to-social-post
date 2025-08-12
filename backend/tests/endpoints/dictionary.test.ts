import { describe, expect, test } from '@jest/globals'
import { app, request } from '../setup'

describe('GET /api/dictionary', () => {
  test('should return purpose dictionary when code=purpose', async () => {
    const response = await request(app)
      .get('/api/dictionary')
      .query({ code: 'purpose' })
      .expect(200)

    expect(response.body.success).toBe(true)
    // Expect array of dictionary items
    expect(Array.isArray(response.body.data)).toBe(true)
    const data = response.body.data as Array<{ code: string; label: string }>
    // Ensure required entries exist and match expected labels
    const byCode = Object.fromEntries(data.map((i) => [i.code, i.label]))
    expect(byCode['learning']).toBe('Nauka')
    expect(byCode['social_media']).toBe('Media społecznościowe')
    expect(byCode['custom']).toBe('Niestandardowy')
  })

  test('should return 400 when code is missing', async () => {
    const response = await request(app).get('/api/dictionary').expect(400)

    expect(response.body.success).toBe(false)
    expect(typeof response.body.error).toBe('string')
  })

  test('should return 400 when code is invalid', async () => {
    const response = await request(app)
      .get('/api/dictionary')
      .query({ code: 'unknown' })
      .expect(400)

    expect(response.body.success).toBe(false)
  })

  test('should have correct content type', async () => {
    const response = await request(app)
      .get('/api/dictionary')
      .query({ code: 'purpose' })

    expect(response.headers['content-type']).toMatch(/application\/json/)
  })

  test('should reject POST method', async () => {
    const response = await request(app)
      .post('/api/dictionary')
      .send({ code: 'purpose' })
      .expect(404)

    expect(response.body.success).toBe(false)
  })
})
