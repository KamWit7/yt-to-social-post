import { handleApiError } from '@/app/api/result/errors/handler'
import { AIModels } from '@/components/dashboard/TranscriptionForms/forms/Form.constants'
import { GoogleGenAI } from '@google/genai'
import z from 'zod'

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

const requestSchema = z.object({
  prompt: z.string(),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        parts: z.array(z.object({ text: z.string() })),
      })
    )
    .optional(),
})

export async function POST(request: Request) {
  try {
    const requestData = await request.json()
    const body = requestSchema.parse(requestData)

    const { prompt, history } = body

    if (!prompt) {
      return new Response('Prompt is required', { status: 400 })
    }

    const chat = ai.chats.create({
      model: AIModels.Gemini25Flash,
      history: history,
    })

    const stream = await chat.sendMessageStream({ message: prompt })

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
