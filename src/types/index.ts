import { Edge, Node } from 'reactflow'

export interface MindMapNodeData {
  label: string
  type: 'root' | 'branch' | 'leaf'
  level: number
  isCollapsed?: boolean
  children?: string[]
  originalValue?: unknown
}

export interface ApiResponse<T, E = string> {
  success: boolean
  data?: T
  error?: E
  details?: string
}

export interface TranscriptSegment {
  text: string
  duration: number
  offset: number
}

export interface ApiError {
  message: string
}

export const AIModels = {
  Gemini25Pro: 'gemini-2.5-pro',
  Gemini25Flash: 'gemini-2.5-flash',
  Gemini25FlashLite: 'gemini-2.5-flash-lite',
} as const

export type AIModelName = (typeof AIModels)[keyof typeof AIModels]

export const DEFAULT_AI_MODEL: AIModelName = AIModels.Gemini25Flash

export const DEFAULT_LANGUAGE = 'pl' as const

export interface AIProcessingRequest {
  transcript: string
  apiKey?: string | null
  purpose: string
  language: 'pl' | 'en'
  customPurpose?: string
  customPrompt?: string
  model?: AIModelName
}

export type MindMapData = {
  nodes: Node<MindMapNodeData>[]
  edges: Edge[]
}

export interface AIProcessingResponse {
  summary?: string
  topics?: string
  mindMap?: MindMapData
  socialPost?: string
  customOutput?: string
  error?: string
}
