export async function checkGeminiApiKey(
  apiKey: string
): Promise<boolean | Error> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Invalid API key when checking with Gemini API')
    }

    return response.ok
  } catch (error) {
    throw new Error('Invalid API key when checking with Gemini API', {
      cause: error,
    })
  }
}
