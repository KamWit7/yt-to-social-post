import { handleApiError } from '@/app/api/result/errors/handler'
import { isModelAvailable } from '@/components/dashboard/TranscriptionForms/forms/PurposeForm/PurposeForm.helpers'
import { getUserApiKey } from '@/lib/actions/usage'
import { authOptions } from '@/lib/auth'
import { getUserUsage } from '@/lib/db/usage'
import { safeEnv } from '@/lib/env/validate-env'
import { decrypt } from '@/utils/encryption/encryption'
import { getModelTemperature } from '@/utils/modelTemperature'
import { GoogleGenAI } from '@google/genai'
import { AccountTier } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { ProcessTranscriptRequestSchema } from './ai.validations'
import { PromptLoader } from './prompts'

export async function POST(request: Request) {
  try {
    // Sprawdzenie sesji użytkownika i uprawnień do modelu
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Pobranie accountTier użytkownika
    const userUsage = await getUserUsage(session.user.id)

    const requestData = await request.json()
    const body = ProcessTranscriptRequestSchema.parse({
      ...requestData,
      accountTier: userUsage?.accountTier || AccountTier.free,
    })

    const {
      transcript,
      purpose,
      language,
      customPrompt,
      model,
      temperatureMode,
      accountTier,
    } = body

    if (!transcript) {
      return new Response('Transcript is required', { status: 400 })
    }

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

    if (!success && !apiKey && accountTier === AccountTier.BYOK) {
      return new Response('API key is required', { status: 400 })
    }

    const decryptedApiKey =
      accountTier === AccountTier.BYOK
        ? decrypt(apiKey ?? '', safeEnv.API_ENCRYPTION_KEY)
        : safeEnv.GEMINI_API_KEY

    const ai = new GoogleGenAI({
      apiKey: decryptedApiKey,
    })

    const temperature = await getModelTemperature(
      temperatureMode,
      decryptedApiKey
    )

    const prompt = PromptLoader.loadPrompt(purpose, {
      transcript,
      language,
      customPrompt,
    })

    const stream = await ai.models.generateContentStream({
      model: model,
      contents: prompt,
      config: {
        temperature: temperature,
      },
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
