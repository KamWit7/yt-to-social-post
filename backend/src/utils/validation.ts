export function isValidUrl(url: string): boolean {
  let urlObject

  try {
    urlObject = new URL(url)
  } catch (_) {
    return false
  }

  return urlObject.protocol === 'http:' || urlObject.protocol === 'https:'
}

export function isValidYouTubeId(id: string): boolean {
  if (typeof id !== 'string' || id.length === 0) {
    return false
  }

  const regex = /^[a-zA-Z0-9_-]{11}$/

  return regex.test(id)
}

export function isValidYouTubeUrl(url: string): boolean {
  const isValid = isValidUrl(url)

  if (!isValid) {
    return false
  }

  try {
    const urlObject = new URL(url)
    const hostname = urlObject.hostname.toLowerCase()

    const youTubeDomains = [
      'youtube.com',
      'www.youtube.com',
      'youtu.be',
      'm.youtube.com',
    ]

    if (hostname.startsWith('youtu.be')) {
      const isYtId = isValidYouTubeId(urlObject.pathname.split('/').pop() ?? '')

      if (!isYtId) {
        return false
      }

      return true
    }

    const isYtId = isValidYouTubeId(urlObject.searchParams.get('v') ?? '')

    if (!isYtId) {
      return false
    }

    return youTubeDomains.includes(hostname)
  } catch (_) {
    return false
  }
}

export function extractVideoIdFromUrl(url: string): string | null {
  try {
    const urlObject = new URL(url)

    if (urlObject.hostname === 'youtu.be') {
      const videoId = urlObject.pathname.split('/')[1]
      return videoId && isValidYouTubeId(videoId) ? videoId : null
    }

    const videoId = urlObject.searchParams.get('v')
    return videoId && isValidYouTubeId(videoId) ? videoId : null
  } catch (_) {
    return null
  }
}
