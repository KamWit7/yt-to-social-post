import { AIProcessingResult } from '../../src/services/ai-processing.service'
import {
  ProcessTranscriptRequest,
  Purpose,
} from '../../src/validations/ai.validations'

export const mockAIProcessingResult: AIProcessingResult = {
  summary: 'Mocked summary of the transcript',
  topics: 'Mocked topics extracted from transcript',
  mindMap: undefined,
  socialPost: undefined,
  customOutput: undefined,
}

export const mockAIProcessingResultWithMindMap: AIProcessingResult = {
  ...mockAIProcessingResult,
  mindMap: { nodes: [], edges: [] },
}

export const mockAIProcessingResultWithSocialPost: AIProcessingResult = {
  ...mockAIProcessingResult,
  socialPost: 'Mocked social media post content',
}

export const mockAIProcessingResultWithCustomOutput: AIProcessingResult = {
  ...mockAIProcessingResult,
  customOutput: 'Mocked custom analysis output',
}

export const mockAIProcessingResultComplete: AIProcessingResult = {
  summary: 'Complete mocked summary',
  topics: 'Complete mocked topics',
  mindMap: { nodes: [{ id: '1', label: 'Topic 1' }], edges: [] },
  socialPost: 'Complete mocked social post',
  customOutput: 'Complete mocked custom output',
}

export const mockProcessTranscriptRequest: ProcessTranscriptRequest = {
  transcript: 'This is a test transcript for AI processing',
  purpose: Purpose.Learning,
  options: {
    generateMindMap: true,
  },
}

export const mockProcessTranscriptRequestSocialMedia: ProcessTranscriptRequest =
  {
    transcript: 'This is a test transcript for social media',
    purpose: Purpose.SocialMedia,
    options: {
      generateSocialPost: true,
    },
  }

export const mockProcessTranscriptRequestCustom: ProcessTranscriptRequest = {
  transcript: 'This is a test transcript for custom analysis',
  purpose: Purpose.Custom,
  options: {
    customPrompt: 'Analyze this transcript and provide insights',
  },
}

export const mockAIProcessingService = {
  processTranscript: jest.fn().mockResolvedValue(mockAIProcessingResult),
}

export const mockAIProcessingServiceWithMindMap = {
  processTranscript: jest
    .fn()
    .mockResolvedValue(mockAIProcessingResultWithMindMap),
}

export const mockAIProcessingServiceWithSocialPost = {
  processTranscript: jest
    .fn()
    .mockResolvedValue(mockAIProcessingResultWithSocialPost),
}

export const mockAIProcessingServiceWithCustomOutput = {
  processTranscript: jest
    .fn()
    .mockResolvedValue(mockAIProcessingResultWithCustomOutput),
}

export const mockAIProcessingServiceComplete = {
  processTranscript: jest
    .fn()
    .mockResolvedValue(mockAIProcessingResultComplete),
}

export const mockAIProcessingServiceError = {
  processTranscript: jest
    .fn()
    .mockRejectedValue(new Error('AI processing failed')),
}

export const mockAIProcessingServicePartialError = {
  processTranscript: jest.fn().mockResolvedValue({
    summary: undefined,
    topics: 'Partial result',
    mindMap: undefined,
    socialPost: undefined,
    customOutput: undefined,
  }),
}

// Helper function to create mock service with specific behavior
export const createMockAIProcessingService = (result: AIProcessingResult) => ({
  processTranscript: jest.fn().mockResolvedValue(result),
})

// Helper function to create mock service that throws error
export const createMockAIProcessingServiceWithError = (error: Error) => ({
  processTranscript: jest.fn().mockRejectedValue(error),
})

// Helper function to create mock service with partial failure
export const createMockAIProcessingServiceWithPartialFailure = (
  partialResult: Partial<AIProcessingResult>
) => ({
  processTranscript: jest.fn().mockResolvedValue({
    summary: undefined,
    topics: undefined,
    mindMap: undefined,
    socialPost: undefined,
    customOutput: undefined,
    ...partialResult,
  }),
})
