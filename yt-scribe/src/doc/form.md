## Form conventions for yt-scribe (based on `TranscriptionForm`)

### Tech stack and libraries

- **React/Next.js client components**: start files with `'use client'` when using hooks.
- **react-hook-form**: `useForm`, `FormProvider`, `useWatch` for state and context.
- **zod** + **@hookform/resolvers/zod**: schema-driven validation with `zodResolver`.
- **TypeScript**: infer form types from the zod schema (`z.infer`).
- **UI**: Tailwind CSS classes, icons via `lucide-react`.

### Directory structure

For each form page, mirror this structure:

```
pages/.../YourForm/
  YourForm.tsx               # Main composed form
  components/
    FormFields.tsx           # All field controls, conditional UI
    SubmitButton.tsx         # Submit control with loading/valid state
    ErrorMessage.tsx         # Centralized error renderer
  constants/
    formConstants.ts         # Field names, defaults, options, messages
  schemas/
    yourSchema.ts            # zod schema and inferred type
  types/
    formTypes.ts             # (Optional) local prop types
```

### Naming and constants

- Centralize all field names in `FORM_FIELD_NAMES`. Use dot-notation for nested objects (e.g., `options.generateMindMap`).
- Keep initial state in `DEFAULT_VALUES` with the same shape as the schema.
- Keep select options (e.g., `PURPOSE_OPTIONS`) and UX texts (e.g., `LOADING_MESSAGES`) in `constants`.

Example (`constants/formConstants.ts`):

```ts
export const FORM_FIELD_NAMES = {
  URL: 'url',
  TRANSCRIPT: 'transcript',
  PURPOSE: 'purpose',
  CUSTOM_PURPOSE: 'customPurpose',
  GENERATE_MIND_MAP: 'options.generateMindMap',
  GENERATE_SOCIAL_POST: 'options.generateSocialPost',
  CUSTOM_PROMPT: 'options.customPrompt',
} as const

export const DEFAULT_VALUES = {
  url: '',
  transcript: '',
  purpose: 'Do nauki',
  customPurpose: '',
  options: {
    generateMindMap: false,
    generateSocialPost: false,
    customPrompt: '',
  },
} as const
```

### Validation schema (zod)

- Define the schema in `schemas/*`. Reference `FORM_FIELD_NAMES` to avoid string drift.
- Use `.refine` for conditional validations based on other fields.
- Export the inferred type as the authoritative form type.

Pattern (`schemas/transcriptionSchema.ts`):

```ts
export const transcriptionSchema = z
  .object({
    [FORM_FIELD_NAMES.URL]: z
      .string()
      .optional()
      .refine(
        (url) => !url || YOUTUBE_URL_PATTERNS.some((p) => p.test(url.trim())),
        'Proszę wprowadzić prawidłowy link YouTube'
      ),
    [FORM_FIELD_NAMES.TRANSCRIPT]: z.string().min(1).min(10),
    [FORM_FIELD_NAMES.PURPOSE]: z.string().min(1),
    [FORM_FIELD_NAMES.CUSTOM_PURPOSE]: z.string().optional(),
    options: z
      .object({
        generateMindMap: z.boolean().optional(),
        generateSocialPost: z.boolean().optional(),
        customPrompt: z.string().optional(),
      })
      .optional(),
  })
  .refine(/* conditional rules for CUSTOM_PURPOSE */)
  .refine(/* conditional rules for CUSTOM_PROMPT */)

export type TranscriptionFormData = z.infer<typeof transcriptionSchema>
```

### Main form component

- Initialize with `useForm<TranscriptionFormData>({ resolver: zodResolver(schema), mode: 'onChange', defaultValues })`.
- Wrap the JSX with `FormProvider` to make the form context available to child components.
- Use `handleSubmit(onSubmit)` and gate the submit button with `isValid`.
- Prefer `useWatch` for cross-field effects and conditional UI.
- Keep external side-effects (e.g., fetching) in the main form and pass only minimal props to children.

Pattern (`TranscriptionForm.tsx`):

```tsx
'use client'

export default function YourForm() {
  const methods = useForm<YourFormData>({
    resolver: zodResolver(yourSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  })

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isValid },
  } = methods

  // Example: watch URL and trigger fetching via a local state
  const [url, setUrl] = useState('')
  const watchedUrl = watch(FORM_FIELD_NAMES.URL)

  useEffect(() => {
    if (watchedUrl && watchedUrl !== url) setUrl(watchedUrl)
  }, [watchedUrl, url])

  const onSubmit = useCallback((data: YourFormData) => {
    // Submit via a mutation hook/service
  }, [])

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <FormFields isLoading={isSubmitting} />
        <SubmitButton isLoading={isSubmitting} isValid={isValid} />
      </form>
      <ErrorMessage message={errorMessage} />
    </FormProvider>
  )
}
```

### Field components (`components/FormFields.tsx`)

- Use controlled wrappers from `@/components/common/form`: `ControlledInput`, `ControlledSelect`, `ControlledTextarea`, `ControlledCheckbox`.
- Drive conditional sections by `useWatch({ name: FORM_FIELD_NAMES.FIELD })`.
- Disable inputs when `isLoading` or a relevant async flag is true.
- Provide accessible labels, placeholders, and icons.

Key patterns:

```tsx
const purpose = useWatch({ name: FORM_FIELD_NAMES.PURPOSE })

// PURPOSE_OPTIONS now sourced from API dictionary as [{ code, label }]
<ControlledSelect
  name={FORM_FIELD_NAMES.PURPOSE}
  options={purposeOptions} // mapped from useDictionary('purpose') to { label, value }
  required
  disabled={isLoading}
/>

{purpose === 'Inny' && (
  <ControlledInput name={FORM_FIELD_NAMES.CUSTOM_PURPOSE} />
)}
```

### Submit button and error handling

- Submit button: disabled when `isLoading || !isValid`. Show loading state using `LOADING_MESSAGES` and an icon (`Loader2`).
- Error message: central `ErrorMessage` returns `null` for empty strings and renders with `role='alert'`.

### Side-effects and async patterns

- Derive remote fetch flags in the main component and pass down as props (e.g., `isTranscriptLoading`).
- When remote data maps to form fields, update via `setValue(FORM_FIELD_NAMES.FIELD, value)` inside `useEffect`.
- Coalesce multiple error sources into a single `message` prop for `ErrorMessage`.

### Types

- Prefer `export type YourFormData = z.infer<typeof yourSchema>` and use it in `useForm<YourFormData>()`.
- Keep extra prop types close to the components that need them.

### Checklist for creating a new form

1. Create the folder structure with `components/`, `constants/`, `schemas/`, `types/`.
2. Define `FORM_FIELD_NAMES`, `DEFAULT_VALUES`, select options, and UX messages in `constants`.
3. Write a zod schema in `schemas/*` using keys from `FORM_FIELD_NAMES`; add conditional `.refine` rules.
4. Export `YourFormData = z.infer<typeof yourSchema>`.
5. Build `YourForm.tsx`:
   - `useForm` with `zodResolver`, `mode: 'onChange'`, and `DEFAULT_VALUES`.
   - Wrap children in `FormProvider`.
   - Implement side-effects (fetching, mapping to fields) with `useEffect` + `setValue`.
   - Prepare `onSubmit` and call mutation/service.
6. Implement `FormFields.tsx` using controlled components and `useWatch` for conditional UI.
7. Implement `SubmitButton.tsx` and `ErrorMessage.tsx` with the standard API.
8. Keep Tailwind classes consistent for spacing, sizing, and disabled states.

### Minimal skeleton (copy/paste)

```tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { FORM_FIELD_NAMES, DEFAULT_VALUES } from './constants/formConstants'
import { yourSchema } from './schemas/yourSchema'
import type { YourFormData } from './types/formTypes'
import { FormFields } from './components/FormFields'
import { SubmitButton } from './components/SubmitButton'
import { ErrorMessage } from './components/ErrorMessage'

export default function YourForm() {
  const methods = useForm<YourFormData>({
    resolver: zodResolver(yourSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  })

  const {
    handleSubmit,
    formState: { isValid },
  } = methods

  const onSubmit = (data: YourFormData) => {
    // call your mutation/service
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <FormFields isLoading={false} />
        <SubmitButton isLoading={false} isValid={isValid} />
      </form>
      <ErrorMessage message='' />
    </FormProvider>
  )
}
```
