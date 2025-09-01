## API module guidelines: adding endpoints, services, and hooks

This document describes the conventions used in `src/api` for defining endpoint paths, building typed service functions, and exposing React Query hooks.

### Folder structure

- `src/api/endpoints.ts`: Central map of endpoint paths and path builders.
- `src/api/httpClient.ts`: Thin `fetch` wrapper that handles base URL, JSON, and error normalization.
- `src/api/services/*`: Typed service functions that call `httpClient` using `endpoints`.
- `src/api/hooks/*`: React Query hooks (`useQuery`/`useMutation`) that wrap service functions and expose caching/invalidations.

### Core primitives

- `endpoints` (in `endpoints.ts`)

  - Grouped by domain (e.g., `ai`, `transcript`, `dictionary`).
  - Static paths are strings; dynamic paths are functions that safely encode params using `encodeURIComponent`.
  - Exported as `as const` for strong typing.

- `apiFetch<TResponse, TBody = unknown>(path, options)` (in `httpClient.ts`)
  - Resolves `path` against `API_BASE_URL` from `config.ts`.
  - Sends JSON by default; parses JSON responses.
  - Throws `{ status: number; message: string }` on non‑OK responses.
  - Supports generic typing for both request and response.
  - Services return data wrapped in `ApiResponse<T>` for consistency: `{ success, data?, error?, details? }`.

### Naming conventions

- Services: imperative verbs describing the action

  - GET read: `get<Entity>`, `list<Entities>`
  - Create/update/delete: `create<Entity>`, `update<Entity>`, `delete<Entity>`
  - Domain-specific actions: `processWithAI`, `refreshToken`, etc.

- Hooks:

  - Queries: `use<Entity>` or `use<Domain><Entity>` (e.g., `useTranscript`)
  - Mutations: `use<Entity>Mutation` or domain action (e.g., `useAIProcessing`)
  - Provide a `get<Entity>QueryKey(...params)` factory co-located with the query hook.

- Query Keys:
  - Array form: `["domain", param1, { scoped: "object" }]`
  - Always include parameters that affect the result; avoid putting large objects directly as key parts.

### Patterns by layer

#### 1) Defining endpoint paths (`endpoints.ts`)

- Group under a domain key; keep values `as const`.
- For dynamic URL segments or query params, accept typed args and `encodeURIComponent` them inside the builder.

```ts
export const endpoints = {
  posts: {
    list: '/api/posts', // GET
    byId: (id: string) => `/api/posts/${encodeURIComponent(id)}`, // GET/PUT/DELETE
  },
  comments: {
    create: '/api/comments', // POST
  },
} as const
```

#### 2) Creating a typed service function (`src/api/services/*`)

- Services import `endpoints` and `apiFetch` only.
- Keep IO types (`Request`, `Response`) in `src/types` (or local to service if very narrow), and import them.
- Choose method and pass `body` only for non‑GET requests.

GET example:

```ts
import { ApiResponse, Post } from '../../types'
import { endpoints } from '../endpoints'
import { apiFetch } from '../httpClient'

export async function getPost(id: string): Promise<ApiResponse<Post>> {
  return apiFetch<ApiResponse<Post>>(endpoints.posts.byId(id))
}
```

POST example:

```ts
import { ApiResponse, CreateCommentRequest, Comment } from '../../types'
import { endpoints } from '../endpoints'
import { apiFetch } from '../httpClient'

export async function createComment(
  data: CreateCommentRequest
): Promise<ApiResponse<Comment>> {
  return apiFetch<ApiResponse<Comment>, CreateCommentRequest>(
    endpoints.comments.create,
    {
      method: 'POST',
      body: data,
    }
  )
}
```

#### 3) Exposing hooks (`src/api/hooks/*`)

- Queries use `useQuery<T>`; mutations use `useMutation<TResp, Error, TReq>`.
- Co-locate a query key factory with every query hook to standardize invalidations.
- Pass `options` as a `Partial<UseQueryOptions<T>>` or `Partial<UseMutationOptions<TResp, Error, TReq>>`.

Query hook example (with disabled state when param missing):

```ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { ApiResponse, Post } from '../../types'
import { getPost } from '../services/postService'

export const getPostQueryKey = (id?: string) => (id ? ['post', id] : ['post'])

export function usePost(
  id: string | null,
  options?: Partial<UseQueryOptions<ApiResponse<Post>>>
) {
  return useQuery<ApiResponse<Post>>({
    ...options,
    queryKey: getPostQueryKey(id ?? ''),
    queryFn: () => getPost(id ?? ''),
    enabled: Boolean(id) && (options?.enabled ?? true),
  })
}
```

Mutation hook example (with invalidation):

```ts
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query'
import { ApiResponse, CreateCommentRequest, Comment } from '../../types'
import { createComment } from '../services/commentService'
import { getPostQueryKey } from './usePost'

export function useCreateComment(
  postId: string,
  options?: Partial<
    UseMutationOptions<ApiResponse<Comment>, Error, CreateCommentRequest>
  >
) {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<Comment>, Error, CreateCommentRequest>({
    ...options,
    mutationFn: createComment,
    onSuccess: (data, variables, ctx) => {
      // Invalidate or update the related post query
      queryClient.invalidateQueries({ queryKey: getPostQueryKey(postId) })
      options?.onSuccess?.(data, variables, ctx)
    },
  })
}
```

### Error handling

- `apiFetch` throws `{ status, message }` for non‑OK responses.
- In UI code, rely on React Query's `error` field in query/mutation results.
- Surface useful `message` to the user or map to domain‑specific messages.

### Types and schemas

- Define request/response DTOs in `src/types` and import into services/hooks.
- Keep names aligned to the action: `AIProcessingRequest`, `AIProcessingResponse`, `TranscriptResponse`, etc.

### Practical checklist for a new endpoint

1. Add a path in `endpoints.ts` under the correct domain

```ts
dictionary: {
  byCode: (code: "purpose") => `/api/dictionary?code=${encodeURIComponent(code)}`,
}
```

2. Create a service in `src/api/services/<entity>Service.ts`

```ts
import { endpoints } from '../endpoints'
import { apiFetch } from '../httpClient'

export type DictionaryItem = { code: string; label: string }
export type DictionaryResponse = DictionaryItem[]

export async function getDictionary(
  code: 'purpose'
): Promise<ApiResponse<DictionaryResponse>> {
  return apiFetch<ApiResponse<DictionaryResponse>>(
    endpoints.dictionary.byCode(code)
  )
}
```

3. Expose a hook in `src/api/hooks/use<Thing>.ts`

```ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import {
  getDictionary,
  DictionaryResponse,
} from '../services/dictionaryService'
import { ApiResponse } from '../../types'

export const getDictionaryQueryKey = (code?: 'purpose') =>
  code ? ['dictionary', code] : ['dictionary']

export function useDictionary(
  code: 'purpose' | null,
  options?: Partial<UseQueryOptions<ApiResponse<DictionaryResponse>>>
) {
  return useQuery<ApiResponse<DictionaryResponse>>({
    ...options,
    queryKey: getDictionaryQueryKey(code ?? ('' as 'purpose')),
    queryFn: () => getDictionary((code ?? 'purpose') as 'purpose'),
    enabled: Boolean(code) && (options?.enabled ?? true),
  })
}
```

4. Use in components

```ts
const { data, isLoading, error } = useDictionary('purpose')
```

### Additional tips

- Always `encodeURIComponent` any user-supplied value in path/query builders.
- Prefer small, focused service functions over passing options through hooks.
- For non‑JSON or 204 responses, `apiFetch` returns `undefined`. Adjust return types accordingly.
- Keep hook files small and colocate query key factories with their hooks.
- When a hook depends on an optional param, gate execution with `enabled`.
