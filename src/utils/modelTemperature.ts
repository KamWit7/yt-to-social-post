export const TemperatureMode = {
  PRECISE: 'precise',
  BALANCED: 'balanced',
  CREATIVE: 'creative',
} as const

export type TemperatureMode =
  (typeof TemperatureMode)[keyof typeof TemperatureMode]

interface GeminiModel {
  name: string
  version: string
  displayName: string
  description: string
  inputTokenLimit: number
  outputTokenLimit: number
  supportedGenerationMethods: string[]
  temperature?: number
  topP?: number
  topK?: number
  maxTemperature?: number
  thinking?: boolean
}

interface GeminiModelsResponse {
  models: GeminiModel[]
}

const DEFAULT_TEMPERATURE_MAP: Record<TemperatureMode, number> = {
  [TemperatureMode.PRECISE]: 0.2,
  [TemperatureMode.BALANCED]: 0.7,
  [TemperatureMode.CREATIVE]: 1.2,
}

const getModelTemperatureMap = (
  maxTemperature: number,
  defaultTemperature: number
) => ({
  [TemperatureMode.PRECISE]: 0.1 * maxTemperature,
  [TemperatureMode.BALANCED]: defaultTemperature,
  [TemperatureMode.CREATIVE]: 0.9 * maxTemperature,
})

export async function getModelTemperature(
  mode: TemperatureMode,
  apiKey: string
): Promise<number> {
  let temperature = DEFAULT_TEMPERATURE_MAP[mode]

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const data: GeminiModelsResponse = await response.json()

    // Try to find a model whose displayName matches the mode (case-insensitive)
    const matchedModel = data.models.find(
      (m) => m.name.toLowerCase() === `model/${mode.toLowerCase()}`
    )

    if (
      matchedModel &&
      matchedModel.maxTemperature !== undefined &&
      matchedModel.temperature !== undefined
    ) {
      const modelTemperatureMap = getModelTemperatureMap(
        matchedModel?.maxTemperature,
        matchedModel?.temperature
      )

      temperature = modelTemperatureMap[mode]
    }
  } catch (error) {
    console.error('Error getting model temperature:', error)

    return temperature
  }

  return temperature
}
