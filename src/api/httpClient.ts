import { safeEnv } from '@/lib/env/validate-env'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type ApiFetchOptions<TBody> = {
  method?: HttpMethod
  headers?: Record<string, string>
  body?: TBody
  signal?: AbortSignal
}

export async function apiFetch<TResponse, TBody = unknown>(
  path: string,
  options: ApiFetchOptions<TBody> = {}
): Promise<TResponse> {
  const { method = 'GET', headers, body, signal } = options

  const url = path.startsWith('http')
    ? path
    : `${safeEnv.NEXT_PUBLIC_API_URL}${path}`

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  })

  const parsed = await response.json()

  return parsed as TResponse
}
