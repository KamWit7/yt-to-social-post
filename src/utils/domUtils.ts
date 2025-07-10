export const getElementById = <T extends globalThis.HTMLElement>(
  id: string
): T => {
  const element = document.getElementById(id) as T | null

  if (!element) {
    throw new Error(`Element with id '${id}' not found`)
  }
  return element
}

export const getUrlInput = (): HTMLInputElement =>
  getElementById<HTMLInputElement>('yt-url')

export const getOutput = (): HTMLTextAreaElement =>
  getElementById<HTMLTextAreaElement>('output')
