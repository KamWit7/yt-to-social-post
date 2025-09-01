### New Page Implementation (modeled after `@dashboard/`)

This project uses Tailwind CSS + shadcn/ui primitives with modern, accessible defaults. Follow these steps to add a new page that matches the dashboard’s architecture and styling.

#### 1) Create the page folder

- Path: `src/pages/<route>/`
- Recommended structure:
  - `src/pages/<route>/<PascalName>.tsx` — main page component
  - `src/pages/<route>/index.ts` — optional re-exports (like `@dashboard/`)
  - `src/pages/<route>/components/` — local UI fragments (optional)

Example:

```
src/pages/insights/
  Insights.tsx
  components/
  index.ts
```

#### 2) Page component template

Use the same primitives and class patterns as the dashboard. Prefer `Card`, `Button`, `Input`, `Textarea`, and consistent spacing/typography.

```tsx
// src/pages/insights/Insights.tsx
'use client'

import { Fragment } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Insights() {
  return (
    <Fragment>
      <Card className='bg-white/60 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 shadow-md border border-gray-200/60 dark:border-gray-800/60 mb-8'>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>Insights</span>
            <Button size='sm' variant='outline'>
              Akcja
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-sm leading-7 text-muted-foreground'>
            Tutaj treść Twojej nowej strony. Używaj spójnych odstępów i
            line-height.
          </p>
        </CardContent>
      </Card>
    </Fragment>
  )
}
```

#### 3) Optional: local exports

If you add internal components, re-export them via `index.ts` (like `@dashboard/`):

```ts
// src/pages/insights/index.ts
export { default as Insights } from './Insights'
// export other local components here if needed
```

#### 4) Styling guidelines (match dashboard)

- Containers: use `Card` with `rounded-2xl`, subtle `shadow-md`, and bordered surfaces.
- Spacing: use vertical rhythm similar to dashboard (`mb-8` for section spacing, `space-y-*` inside stacks).
- Typography: prefer `text-sm leading-7` for body text; titles via `CardTitle` with `font-semibold` and `tracking-tight`.
- Interactions: keep `Button` variants (`default`, `outline`, `ghost`) and rely on built-in focus rings.
- Inputs: use `Input`/`Textarea` as-is for consistent sizing, rounded corners, hover border, and focus ring.
- Dark mode: avoid hard-coded colors; rely on tokens (`bg-card`, `text-card-foreground`, `bg-muted`).

#### 5) Loading and empty states

Mirror the dashboard’s skeleton style for loading:

```tsx
<div className='space-y-6'>
  <div className='animate-pulse'>
    <div className='h-4 bg-muted rounded w-1/4 mb-4'></div>
    <div className='h-32 bg-muted rounded-lg'></div>
  </div>
</div>
```

#### 6) Composition tips

- Break complex sections into subcomponents in `components/` and render them inside a `Card`.
- Keep actions right-aligned in a `CardTitle` row for consistent hierarchy.
- Use `leading-7` on multi-line text blocks for readability.

That’s it. Create the folder, add the `<PascalName>.tsx` with a `Card`-based layout, keep styles consistent with the dashboard, and (optionally) re-export via `index.ts`.
