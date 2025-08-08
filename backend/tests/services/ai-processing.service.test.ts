import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals'
import { AIProcessingService } from '../../src/services/ai-processing.service'
import {
  ProcessTranscriptRequest,
  Purpose,
} from '../../src/validations/ai.validations'

// Mock Google Generative AI
jest.mock('@google/generative-ai')

const mockGenerateContent = jest.fn()
const mockResponse = {
  text: jest.fn().mockReturnValue('Mocked AI response'),
}
const mockResult = {
  response: Promise.resolve(mockResponse),
}

const mockModel = {
  generateContent: mockGenerateContent.mockReturnValue(mockResult),
} as unknown as GenerativeModel

const mockGenAI = {
  getGenerativeModel: jest.fn().mockReturnValue(mockModel),
} as unknown as GoogleGenerativeAI

describe('AIProcessingService', () => {
  let aiService: AIProcessingService
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env }

    // Set required environment variable
    process.env.GEMINI_API_KEY = 'test-api-key'

    // Reset mocks
    jest.clearAllMocks()

    // Mock GoogleGenerativeAI constructor
    ;(
      GoogleGenerativeAI as jest.MockedClass<typeof GoogleGenerativeAI>
    ).mockImplementation(() => mockGenAI)

    aiService = new AIProcessingService()
  })

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv
  })

  describe('Constructor', () => {
    test('should initialize with valid API key', () => {
      expect(aiService).toBeInstanceOf(AIProcessingService)
      expect(GoogleGenerativeAI).toHaveBeenCalledWith('test-api-key')
    })

    test('should throw error when API key is missing', () => {
      delete process.env.GEMINI_API_KEY
      expect(() => new AIProcessingService()).toThrow(
        'GEMINI_API_KEY is required'
      )
    })
  })

  describe('processTranscript - Basic Functionality', () => {
    const mockTranscript = 'This is a test transcript for AI processing.'

    test('should return basic summary and topics for any request', async () => {
      const request: ProcessTranscriptRequest = {
        transcript: mockTranscript,
        purpose: Purpose.Learning,
        options: {
          generateMindMap: false,
        },
      }

      const result = await aiService.processTranscript(request)

      expect(result).toHaveProperty('summary')
      expect(result).toHaveProperty('topics')
      expect(result.summary).toBe('Mocked AI response')
      expect(result.topics).toBe('Mocked AI response')
      expect(result.mindMap).toBeUndefined()
      expect(result.socialPost).toBeUndefined()
      expect(result.customOutput).toBeUndefined()
    })

    test('should call generateContent for summary and topics', async () => {
      const request: ProcessTranscriptRequest = {
        transcript: mockTranscript,
        purpose: Purpose.Learning,
        options: {
          generateMindMap: false,
        },
      }

      await aiService.processTranscript(request)

      expect(mockGenerateContent).toHaveBeenCalledTimes(2)
    })
  })

  describe('processTranscript - Learning Purpose', () => {
    const mockTranscript = 'Learning transcript content.'

    test('should generate mind map when purpose is Learning and generateMindMap is true', async () => {
      const request: ProcessTranscriptRequest = {
        transcript: mockTranscript,
        purpose: Purpose.Learning,
        options: {
          generateMindMap: true,
        },
      }

      const result = await aiService.processTranscript(request)

      expect(result.mindMap).toBe('Mocked AI response')
      expect(mockGenerateContent).toHaveBeenCalledTimes(3) // summary, topics, mindMap
    })

    test('should not generate mind map when generateMindMap is false', async () => {
      const request: ProcessTranscriptRequest = {
        transcript: mockTranscript,
        purpose: Purpose.Learning,
        options: {
          generateMindMap: false,
        },
      }

      const result = await aiService.processTranscript(request)

      expect(result.mindMap).toBeUndefined()
      expect(mockGenerateContent).toHaveBeenCalledTimes(2) // only summary and topics
    })

    test('should not generate mind map when generateMindMap is undefined', async () => {
      const request: ProcessTranscriptRequest = {
        transcript: mockTranscript,
        purpose: Purpose.Learning,
        options: {},
      }

      const result = await aiService.processTranscript(request)

      expect(result.mindMap).toBeUndefined()
      expect(mockGenerateContent).toHaveBeenCalledTimes(2)
    })
  })

  describe('processTranscript - Social Media Purpose', () => {
    const mockTranscript = 'Social media transcript content.'

    test('should generate social post when purpose is SocialMedia and generateSocialPost is true', async () => {
      const request: ProcessTranscriptRequest = {
        transcript: mockTranscript,
        purpose: Purpose.SocialMedia,
        options: {
          generateSocialPost: true,
        },
      }

      const result = await aiService.processTranscript(request)

      expect(result.socialPost).toBe('Mocked AI response')
      expect(mockGenerateContent).toHaveBeenCalledTimes(3) // summary, topics, socialPost
    })

    test('should not generate social post when generateSocialPost is false', async () => {
      const request: ProcessTranscriptRequest = {
        transcript: mockTranscript,
        purpose: Purpose.SocialMedia,
        options: {
          generateSocialPost: false,
        },
      }

      const result = await aiService.processTranscript(request)

      expect(result.socialPost).toBeUndefined()
      expect(mockGenerateContent).toHaveBeenCalledTimes(2)
    })

    test('should not generate social post when generateSocialPost is undefined', async () => {
      const request: ProcessTranscriptRequest = {
        transcript: mockTranscript,
        purpose: Purpose.SocialMedia,
        options: {},
      }

      const result = await aiService.processTranscript(request)

      expect(result.socialPost).toBeUndefined()
      expect(mockGenerateContent).toHaveBeenCalledTimes(2)
    })
  })

  describe('processTranscript - Custom Purpose', () => {
    const mockTranscript = 'Custom transcript content.'
    const customPrompt = 'Analyze this transcript and provide insights.'

    test('should generate custom output when purpose is Custom and customPrompt is provided', async () => {
      const request: ProcessTranscriptRequest = {
        transcript: mockTranscript,
        purpose: Purpose.Custom,
        options: {
          customPrompt,
        },
      }

      const result = await aiService.processTranscript(request)

      expect(result.customOutput).toBe('Mocked AI response')
      expect(mockGenerateContent).toHaveBeenCalledTimes(3) // summary, topics, customOutput
    })

    test('should not generate custom output when customPrompt is empty', async () => {
      const request: ProcessTranscriptRequest = {
        transcript: mockTranscript,
        purpose: Purpose.Custom,
        options: {
          customPrompt: '',
        },
      }

      const result = await aiService.processTranscript(request)

      expect(result.customOutput).toBeUndefined()
      expect(mockGenerateContent).toHaveBeenCalledTimes(2)
    })

    test('should not generate custom output when customPrompt is undefined', async () => {
      const request: ProcessTranscriptRequest = {
        transcript: mockTranscript,
        purpose: Purpose.Custom,
        options: {},
      }

      const result = await aiService.processTranscript(request)

      expect(result.customOutput).toBeUndefined()
      expect(mockGenerateContent).toHaveBeenCalledTimes(2)
    })
  })

  describe('processTranscript - Error Handling', () => {
    const mockTranscript = 'Error test transcript.'

    test('should handle AI service errors gracefully', async () => {
      // Mock AI service to throw error
      mockGenerateContent.mockRejectedValueOnce(new Error('AI service error'))

      const request: ProcessTranscriptRequest = {
        transcript: mockTranscript,
        purpose: Purpose.Learning,
        options: {
          generateMindMap: true,
        },
      }

      const result = await aiService.processTranscript(request)

      // Should still return partial results
      expect(result.summary).toBeUndefined()
      expect(result.topics).toBe('Mocked AI response')
      expect(result.mindMap).toBe('Mocked AI response')
    })

    test('should handle multiple AI service errors', async () => {
      // Mock all AI calls to fail
      mockGenerateContent.mockRejectedValue(new Error('AI service error'))

      const request: ProcessTranscriptRequest = {
        transcript: mockTranscript,
        purpose: Purpose.Learning,
        options: {
          generateMindMap: true,
        },
      }

      const result = await aiService.processTranscript(request)

      // Should return empty result object
      expect(result.summary).toBeUndefined()
      expect(result.topics).toBeUndefined()
      expect(result.mindMap).toBeUndefined()
    })
  })

  describe('processTranscript - Mind Map JSON Parsing', () => {
    const mockTranscript = 'Mind map test transcript.'

    test('should parse valid JSON mind map response', async () => {
      const mockJsonResponse = {
        text: jest.fn().mockReturnValue('{"nodes": [], "edges": []}'),
      }
      const mockJsonResult = {
        response: Promise.resolve(mockJsonResponse),
      }

      // Mock different responses for different calls
      mockGenerateContent
        .mockReturnValueOnce(mockResult) // summary
        .mockReturnValueOnce(mockResult) // topics
        .mockReturnValueOnce(mockJsonResult) // mindMap

      const request: ProcessTranscriptRequest = {
        transcript: mockTranscript,
        purpose: Purpose.Learning,
        options: {
          generateMindMap: true,
        },
      }

      const result = await aiService.processTranscript(request)

      expect(result.mindMap).toEqual({ nodes: [], edges: [] })
    })

    test('should handle invalid JSON mind map response', async () => {
      const mockInvalidJsonResponse = {
        text: jest.fn().mockReturnValue('invalid json'),
      }
      const mockInvalidJsonResult = {
        response: Promise.resolve(mockInvalidJsonResponse),
      }

      // Mock different responses for different calls
      mockGenerateContent
        .mockReturnValueOnce(mockResult) // summary
        .mockReturnValueOnce(mockResult) // topics
        .mockReturnValueOnce(mockInvalidJsonResult) // mindMap

      const request: ProcessTranscriptRequest = {
        transcript: mockTranscript,
        purpose: Purpose.Learning,
        options: {
          generateMindMap: true,
        },
      }

      const result = await aiService.processTranscript(request)

      expect(result.mindMap).toBe('{}')
    })
  })

  describe('processTranscript - Complex Scenarios', () => {
    const mockTranscript = 'Complex scenario transcript.'

    test('should handle all options enabled for Learning purpose', async () => {
      const request: ProcessTranscriptRequest = {
        transcript: mockTranscript,
        purpose: Purpose.Learning,
        options: {
          generateMindMap: true,
          generateSocialPost: true, // This should be ignored for Learning
          customPrompt: 'Custom prompt', // This should be ignored for Learning
        },
      }

      const result = await aiService.processTranscript(request)

      expect(result.summary).toBe('Mocked AI response')
      expect(result.topics).toBe('Mocked AI response')
      expect(result.mindMap).toBe('Mocked AI response')
      expect(result.socialPost).toBeUndefined() // Should be ignored
      expect(result.customOutput).toBeUndefined() // Should be ignored
    })

    test('should handle all options enabled for SocialMedia purpose', async () => {
      const request: ProcessTranscriptRequest = {
        transcript: mockTranscript,
        purpose: Purpose.SocialMedia,
        options: {
          generateMindMap: true, // This should be ignored for SocialMedia
          generateSocialPost: true,
          customPrompt: 'Custom prompt', // This should be ignored for SocialMedia
        },
      }

      const result = await aiService.processTranscript(request)

      expect(result.summary).toBe('Mocked AI response')
      expect(result.topics).toBe('Mocked AI response')
      expect(result.mindMap).toBeUndefined() // Should be ignored
      expect(result.socialPost).toBe('Mocked AI response')
      expect(result.customOutput).toBeUndefined() // Should be ignored
    })

    test('should handle all options enabled for Custom purpose', async () => {
      const request: ProcessTranscriptRequest = {
        transcript: mockTranscript,
        purpose: Purpose.Custom,
        options: {
          generateMindMap: true, // This should be ignored for Custom
          generateSocialPost: true, // This should be ignored for Custom
          customPrompt: 'Custom prompt',
        },
      }

      const result = await aiService.processTranscript(request)

      expect(result.summary).toBe('Mocked AI response')
      expect(result.topics).toBe('Mocked AI response')
      expect(result.mindMap).toBeUndefined() // Should be ignored
      expect(result.socialPost).toBeUndefined() // Should be ignored
      expect(result.customOutput).toBe('Mocked AI response')
    })
  })

  describe('processTranscript - Edge Cases', () => {
    test('should handle empty transcript', async () => {
      const request: ProcessTranscriptRequest = {
        transcript: '',
        purpose: Purpose.Learning,
        options: {
          generateMindMap: true,
        },
      }

      const result = await aiService.processTranscript(request)

      expect(result.summary).toBe('Mocked AI response')
      expect(result.topics).toBe('Mocked AI response')
      expect(result.mindMap).toBe('Mocked AI response')
    })

    test('should handle very long transcript', async () => {
      const longTranscript = 'A'.repeat(10000)
      const request: ProcessTranscriptRequest = {
        transcript: longTranscript,
        purpose: Purpose.Learning,
        options: {
          generateMindMap: true,
        },
      }

      const result = await aiService.processTranscript(request)

      expect(result.summary).toBe('Mocked AI response')
      expect(result.topics).toBe('Mocked AI response')
      expect(result.mindMap).toBe('Mocked AI response')
    })

    test('should handle transcript with special characters', async () => {
      const specialTranscript =
        'Transkrypcja z polskimi znakami: ąćęłńóśźż i emoji 🚀'
      const request: ProcessTranscriptRequest = {
        transcript: specialTranscript,
        purpose: Purpose.Learning,
        options: {
          generateMindMap: true,
        },
      }

      const result = await aiService.processTranscript(request)

      expect(result.summary).toBe('Mocked AI response')
      expect(result.topics).toBe('Mocked AI response')
      expect(result.mindMap).toBe('Mocked AI response')
    })
  })
})
