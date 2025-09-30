import { getUserApiKey } from '@/lib/actions/usage'
import { serverEnv } from '@/lib/env/server'
import { decrypt } from '@/utils/encryption/encryption'
import { GoogleGenAI } from '@google/genai'
import { ProcessTranscriptRequestSchema } from './ai.validations'
import { PromptLoader } from './prompts'

export async function POST(request: Request) {
  try {
    const requestData = await request.json()
    const body = ProcessTranscriptRequestSchema.parse(requestData)

    const { transcript, purpose, language, customPrompt, model } = body

    if (!transcript) {
      return new Response('Transcript is required', { status: 400 })
    }

    const { apiKey, success } = await getUserApiKey()

    console.log('_____API KEY', apiKey, success)

    if (!success) {
      return new Response('API key is required', { status: 400 })
    }

    const decryptedApiKey = decrypt(apiKey ?? '', serverEnv.API_ENCRYPTION_KEY)

    const prompt = PromptLoader.loadPrompt(purpose, {
      transcript,
      language,
      customPrompt,
    })

    const ai = new GoogleGenAI({
      apiKey: decryptedApiKey || process.env.GEMINI_API_KEY,
    })

    const stream = await ai.models.generateContentStream({
      model: model,
      contents: prompt,
    })

    // string -> strumień bajtów (Unit8Array)
    const encoder = new TextEncoder()

    const redableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.text
            if (text) {
              const data = `data: ${JSON.stringify({ text })}`
              controller.enqueue(encoder.encode(data))
            }
          }
          // sygnał - aby front wiedział kiedy zamknąć połączenie
          controller.enqueue(encoder.encode('data: [DONE]'))
          controller.close()
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        }
      },
    })

    return new Response(redableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)

    if (error && typeof error === 'object' && 'message' in error) {
      try {
        const errorMessage = error.message as string
        if (
          errorMessage.includes('"code":503') ||
          errorMessage.includes('overloaded')
        ) {
          return new Response(
            JSON.stringify({
              error:
                'Model jest obecnie przeciążony. Spróbuj ponownie za chwilę.',
              code: 503,
              type: 'service_unavailable',
            }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        }

        if (
          errorMessage.includes('"code":429') ||
          errorMessage.includes('quota')
        ) {
          return new Response(
            JSON.stringify({
              error: 'Przekroczono limit zapytań. Spróbuj ponownie później.',
              code: 429,
              type: 'rate_limit',
            }),
            {
              status: 429,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        }

        if (
          errorMessage.includes('"code":400') ||
          errorMessage.includes('invalid')
        ) {
          return new Response(
            JSON.stringify({
              error: 'Nieprawidłowe żądanie. Sprawdź dane wejściowe.',
              code: 400,
              type: 'bad_request',
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        }
      } catch {
        // If parsing fails, fall through to generic error
      }
    }

    // Generic error for unknown cases
    return new Response(
      JSON.stringify({
        error: 'Wystąpił nieoczekiwany błąd serwera. Spróbuj ponownie.',
        code: 500,
        type: 'internal_error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
