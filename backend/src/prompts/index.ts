import { readFileSync } from 'fs'
import { join } from 'path'

export const AVAILABLE_PROMPTS = {
  SUMMARY: 'summary',
  TOPICS: 'topics',
  MIND_MAP: 'mind-map',
  SOCIAL_POST: 'social-post',
  CUSTOM_OUTPUT: 'custom-output',
} as const

export type PromptName =
  (typeof AVAILABLE_PROMPTS)[keyof typeof AVAILABLE_PROMPTS]

export class PromptLoader {
  private static readonly PROMPTS_DIR = join(__dirname)

  static loadPrompt(
    promptName: PromptName,
    variables: Record<string, string> = {}
  ): string {
    const promptPath = join(this.PROMPTS_DIR, `${promptName}.prompt`)

    try {
      let prompt = readFileSync(promptPath, 'utf-8')

      // Replace template variables
      Object.entries(variables).forEach(([key, value]) => {
        prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), value)
      })

      return prompt
    } catch (error) {
      throw new Error(`Failed to load prompt '${promptName}': ${error}`)
    }
  }

  static getAvailablePrompts(): PromptName[] {
    return Object.values(AVAILABLE_PROMPTS)
  }
}
