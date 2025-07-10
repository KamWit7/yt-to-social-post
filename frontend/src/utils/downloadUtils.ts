export function downloadFile(content: string, filename: string): void {
  const a = document.createElement('a')
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

export function downloadTranscript(text: string): void {
  downloadFile(text, 'transkrypcja.txt')
}

export function downloadDescription(description: string): void {
  downloadFile(description, 'opis.txt')
}
