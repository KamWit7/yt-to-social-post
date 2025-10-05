export const endpoints = {
  transcript: {
    byUrl: (url: string) => `/api/transcript?url=${encodeURIComponent(url)}`,
  },
} as const
