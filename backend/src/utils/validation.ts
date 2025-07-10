import ytdl from 'ytdl-core'

export function isValidYouTubeUrl(url: string): boolean {
  return ytdl.validateURL(url)
}

export function extractVideoId(url: string): string | null {
  try {
    return ytdl.getVideoID(url)
  } catch {
    return null
  }
}

export function validateAndExtractVideoId(url: string): {
  isValid: boolean
  videoId: string | null
} {
  const isValid = isValidYouTubeUrl(url)
  const videoId = isValid ? extractVideoId(url) : null

  return { isValid, videoId }
}
