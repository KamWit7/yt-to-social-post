export const endpoints = {
  ai: {
    processTranscript: '/api/ai/process-transcript',
  },
  transcript: {
    byUrl: (url: string) => `/api/transcript?url=${encodeURIComponent(url)}`,
  },
  dictionary: {
    byCode: (code: 'purpose') =>
      `/api/dictionary?code=${encodeURIComponent(code)}`,
  },
} as const

export type EndpointPath = typeof endpoints
