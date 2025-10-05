import { handleApiError } from '@/app/api/result/errors/api-error-handler'
import { isModelAvailable } from '@/components/dashboard/TranscriptionForms/forms/PurposeForm/PurposeForm.helpers'
import { getUserApiKey } from '@/lib/actions/usage'
import { authOptions } from '@/lib/auth'
import { getUserUsage } from '@/lib/db/usage'
import { serverEnv } from '@/lib/env/server'
import { decrypt } from '@/utils/encryption/encryption'
import { GoogleGenAI } from '@google/genai'
import { AccountTier } from '@prisma/client'
import { getServerSession } from 'next-auth'
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

    // Sprawdzenie sesji użytkownika i uprawnień do modelu
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Pobranie accountTier użytkownika
    const userUsage = await getUserUsage(session.user.id)
    const accountTier = userUsage?.accountTier || AccountTier.free

    // Walidacja uprawnień do wybranego modelu
    if (!isModelAvailable(model, accountTier)) {
      return new Response(
        JSON.stringify({
          error: 'Model not allowed',
          message: `Model ${model} jest dostępny tylko dla użytkowników z kontem BYOK. Zmień typ konta w ustawieniach.`,
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const { apiKey, success } = await getUserApiKey()

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
    return handleApiError(error, 'Chat API')
  }
}
