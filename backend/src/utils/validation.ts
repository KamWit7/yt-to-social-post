export function isValidUrl(url: string): boolean {
  let urlObject

  try {
    urlObject = new URL(url)
  } catch (_) {
    return false
  }

  return urlObject.protocol === 'http:' || urlObject.protocol === 'https:'
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
      const isYtId = urlObject.pathname.split('/').pop()

      if (!isYtId) {
        return false
      }

      return true
    }

    const isYtId = urlObject.searchParams.get('v')

    if (!isYtId) {
      return false
    }

    return youTubeDomains.includes(hostname)
  } catch (_) {
    return false
  }
}
