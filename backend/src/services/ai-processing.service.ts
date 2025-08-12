import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai'
import { Dictionary } from '../constants/dictionaries'
import { AVAILABLE_PROMPTS, PromptLoader } from '../prompts'
import { ProcessTranscriptRequest } from '../validations'

type PrittifyType<T> = {
  [K in keyof T]: T[K] & {}
}

export type AIProcessingResult = {
  summary?: string | undefined
  topics?: string | undefined
  mindMap?: string | undefined
  socialPost?: string | undefined
  customOutput?: string | undefined
}
type AIProcessingResultKeys = PrittifyType<keyof AIProcessingResult>

export class AIProcessingService {
  private genAI: GoogleGenerativeAI
  private model: GenerativeModel

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required')
    }

    this.genAI = new GoogleGenerativeAI(apiKey)

    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    })
  }

  async processTranscript(
    request: ProcessTranscriptRequest
  ): Promise<AIProcessingResult> {
    const { transcript, purpose, options } = request

    const tasks: Record<AIProcessingResultKeys, Promise<string | undefined>> = {
      summary: this.generateSummary(transcript),
      topics: this.generateTopics(transcript),
      mindMap: Promise.resolve(undefined),
      socialPost: Promise.resolve(undefined),
      customOutput: Promise.resolve(undefined),
    }

    if (purpose === Dictionary.Purpose.Learning && options?.generateMindMap) {
      tasks.mindMap = this.generateMindMap(transcript)
    }

    if (
      purpose === Dictionary.Purpose.SocialMedia &&
      options?.generateSocialPost
    ) {
      tasks.socialPost = this.generateSocialPost(transcript)
    }

    if (purpose === Dictionary.Purpose.Custom && options?.customPrompt) {
      tasks.customOutput = this.generateCustomOutput(
        transcript,
        options.customPrompt
      )
    }

    const results = await Promise.allSettled(Object.values(tasks))

    const response = results.reduce((acc, curr, index) => {
      const key = Object.keys(tasks)[index] as AIProcessingResultKeys
      acc[key] = curr.status === 'fulfilled' ? curr.value : undefined
      return acc
    }, {} as AIProcessingResult)

    console.log('___results', results)
    console.log('___response', response)

    return response
  }

  private async generateSummary(transcript: string): Promise<string> {
    const prompt = PromptLoader.loadPrompt(AVAILABLE_PROMPTS.SUMMARY, {
      transcript,
    })

    const result = await this.model.generateContent(prompt)
    const response = await result.response
    return response.text().trim()
  }

  private async generateTopics(transcript: string): Promise<string> {
    const prompt = PromptLoader.loadPrompt(AVAILABLE_PROMPTS.TOPICS, {
      transcript,
    })

    const result = await this.model.generateContent(prompt)
    const response = await result.response
    return response.text().trim()
  }

  private async generateMindMap(transcript: string): Promise<string> {
    const prompt = PromptLoader.loadPrompt(AVAILABLE_PROMPTS.MIND_MAP, {
      transcript,
    })

    const result = await this.model.generateContent(prompt)
    const response = await result.response
    const jsonText = response.text().trim()

    try {
      return JSON.parse(jsonText)
    } catch (error) {
      console.error('Error parsing mind map JSON:', error)
      return '{}'
    }
  }

  private async generateSocialPost(transcript: string): Promise<string> {
    const prompt = PromptLoader.loadPrompt(AVAILABLE_PROMPTS.SOCIAL_POST, {
      transcript,
    })

    const result = await this.model.generateContent(prompt)
    const response = await result.response
    return response.text().trim()
  }

  private async generateCustomOutput(
    transcript: string,
    customPrompt: string
  ): Promise<string> {
    const prompt = PromptLoader.loadPrompt(AVAILABLE_PROMPTS.CUSTOM_OUTPUT, {
      transcript,
      customPrompt,
    })

    const result = await this.model.generateContent(prompt)
    const response = await result.response
    return response.text().trim()
  }
}
