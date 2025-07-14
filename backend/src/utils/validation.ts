export function isValidUrl(url: string): boolean {
  let urlObject

  try {
    urlObject = new URL(url)
  } catch (_) {
    return false
  }

  return urlObject.protocol === 'http:' || urlObject.protocol === 'https:'
}
