import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai'
import { jest } from '@jest/globals'

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
  generateContent: mockGenerateContent,
} as unknown as GenerativeModel

const mockGenAI = {
  getGenerativeModel: jest.fn().mockReturnValue(mockModel),
} as unknown as GoogleGenerativeAI

// Mock functions for different scenarios
const mockJsonResponse = {
  text: jest.fn().mockReturnValue('{"nodes": [], "edges": []}'),
}
const mockJsonResult = {
  response: Promise.resolve(mockJsonResponse),
}

const mockInvalidJsonResponse = {
  text: jest.fn().mockReturnValue('invalid json'),
}
const mockInvalidJsonResult = {
  response: Promise.resolve(mockInvalidJsonResponse),
}

// Helper functions to reset and configure mocks
const resetMocks = () => {
  jest.clearAllMocks()
  mockGenerateContent.mockReturnValue(mockResult)
  mockResponse.text.mockReturnValue('Mocked AI response')
  mockJsonResponse.text.mockReturnValue('{"nodes": [], "edges": []}')
  mockInvalidJsonResponse.text.mockReturnValue('invalid json')
}

const mockGoogleGenerativeAI = () => {
  ;(
    GoogleGenerativeAI as jest.MockedClass<typeof GoogleGenerativeAI>
  ).mockImplementation(() => mockGenAI as any)
}

const mockGenerateContentSuccess = () => {
  mockGenerateContent.mockReturnValue(mockResult)
}

const mockGenerateContentError = () => {
  const mockErrorResult = {
    response: Promise.reject(new Error('AI service error')),
  }
  mockGenerateContent.mockReturnValue(mockErrorResult)
}

const mockGenerateContentJson = () => {
  mockGenerateContent.mockReturnValue(mockJsonResult)
}

const mockGenerateContentInvalidJson = () => {
  mockGenerateContent.mockReturnValue(mockInvalidJsonResult)
}

export {
  mockGenAI,
  mockGenerateContent,
  mockGenerateContentError,
  mockGenerateContentInvalidJson,
  mockGenerateContentJson,
  mockGenerateContentSuccess,
  mockGoogleGenerativeAI,
  mockInvalidJsonResponse,
  mockInvalidJsonResult,
  mockJsonResponse,
  mockJsonResult,
  mockModel,
  mockResponse,
  mockResult,
  resetMocks,
}
