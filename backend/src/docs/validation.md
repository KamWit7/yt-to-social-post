# Validation Implementation Guide

## Overview

This guide provides comprehensive instructions for implementing validation for new endpoints in the YouTube-to-Social-Post API. The validation system uses Zod schemas with Polish error messages and follows established patterns for consistency and maintainability.

## Architecture

### Validation Layer Structure

```
backend/src/validations/
├── index.ts                    # Export utilities and helper functions
├── ai.validations.ts          # AI processing endpoint validations
├── youtube.validations.ts     # YouTube endpoint validations
└── {feature}.validations.ts   # New feature validations
```

### Validation Flow

1. **Schema Definition**: Define Zod schemas in feature-specific validation files
2. **Middleware Integration**: Use validation middleware in routes
3. **Error Handling**: Automatic error responses with Polish messages
4. **Type Safety**: TypeScript types inferred from schemas

## Implementation Patterns

### 1. Basic Schema Structure

```typescript
// validations/feature.validations.ts
import { z } from 'zod'

// Define constants for enum values
export const FeatureStatus = {
  Active: 'active',
  Inactive: 'inactive',
  Pending: 'pending',
} as const

// Define the main request schema
export const FeatureRequestSchema = z.object({
  name: z.string().min(1, 'Nazwa nie może być pusta'),
  description: z.string().optional(),
  status: z.enum(Object.values(FeatureStatus)),
  metadata: z.record(z.unknown()).optional(),
})

// Export TypeScript types
export type FeatureRequest = z.infer<typeof FeatureRequestSchema>
```

### 2. Complex Validation with Refinement

```typescript
// Advanced validation with custom logic
export const AdvancedFeatureSchema = z
  .object({
    email: z.string().email('Nieprawidłowy format email'),
    age: z.number().min(18, 'Wiek musi być większy niż 18'),
    preferences: z
      .array(z.string())
      .min(1, 'Musisz wybrać przynajmniej jedną preferencję'),
  })
  .refine(
    (data) => {
      // Custom validation logic
      return data.email.includes('@') && data.age > 0
    },
    {
      message: 'Dane są nieprawidłowe',
      path: ['custom'], // Specify which field the error relates to
    }
  )
```

### 3. Nested Object Validation

```typescript
// Nested object validation pattern
export const NestedOptionsSchema = z
  .object({
    generateReport: z.boolean().optional(),
    includeMetadata: z.boolean().optional(),
    customSettings: z
      .object({
        format: z.enum(['json', 'xml', 'csv']).default('json'),
        compression: z.boolean().default(false),
      })
      .optional(),
  })
  .refine((data) => data.generateReport || data.includeMetadata, {
    message: 'Musisz wybrać przynajmniej jedną opcję',
    path: ['options'],
  })
```

## Validation Types

### 1. Body Validation

For POST/PUT requests with JSON body:

```typescript
// validations/feature.validations.ts
export const CreateFeatureSchema = z.object({
  name: z.string().min(1, 'Nazwa jest wymagana'),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

// routes/feature.routes.ts
import { validateBody } from '../middleware/validation.middleware'
import { CreateFeatureSchema } from '../validations/feature.validations'

router.post('/feature', validateBody(CreateFeatureSchema), (req, res, next) =>
  featureController.createFeature(req, res, next)
)
```

### 2. Query Parameter Validation

For GET requests with query parameters:

```typescript
// validations/feature.validations.ts
export const FeatureQuerySchema = z.object({
  page: z
    .string()
    .transform(Number)
    .pipe(z.number().min(1, 'Strona musi być większa niż 0'))
    .optional(),
  limit: z
    .string()
    .transform(Number)
    .pipe(z.number().min(1).max(100, 'Limit musi być między 1 a 100'))
    .optional(),
  status: z.enum(['active', 'inactive']).optional(),
  search: z.string().min(1, 'Wyszukiwanie nie może być puste').optional(),
})

// routes/feature.routes.ts
import { validateQuery } from '../middleware/validation.middleware'

router.get('/features', validateQuery(FeatureQuerySchema), (req, res, next) =>
  featureController.getFeatures(req, res, next)
)
```

### 3. URL Parameter Validation

For dynamic route parameters:

```typescript
// validations/feature.validations.ts
export const FeatureIdSchema = z.object({
  id: z.string().uuid('Nieprawidłowe ID funkcji'),
})

// routes/feature.routes.ts
import { validateParams } from '../middleware/validation.middleware'

router.get('/feature/:id', validateParams(FeatureIdSchema), (req, res, next) =>
  featureController.getFeature(req, res, next)
)
```

### 4. Combined Validation

For endpoints requiring multiple validation types:

```typescript
// validations/feature.validations.ts
export const UpdateFeatureSchema = z.object({
  name: z.string().min(1, 'Nazwa jest wymagana'),
  description: z.string().optional(),
})

export const FeatureIdParamSchema = z.object({
  id: z.string().uuid('Nieprawidłowe ID funkcji'),
})

// routes/feature.routes.ts
import { validateRequest } from '../middleware/validation.middleware'

router.put(
  '/feature/:id',
  validateRequest(UpdateFeatureSchema, undefined, FeatureIdParamSchema),
  (req, res, next) => featureController.updateFeature(req, res, next)
)
```

## Error Message Standards

### Polish Language Requirements

All validation error messages must be in Polish:

```typescript
// ✅ Correct - Polish messages
z.string().min(1, 'Nazwa nie może być pusta')
z.number().min(18, 'Wiek musi być większy niż 18')
z.email('Nieprawidłowy format email')

// ❌ Incorrect - English messages
z.string().min(1, 'Name cannot be empty')
z.number().min(18, 'Age must be greater than 18')
z.email('Invalid email format')
```

### Error Message Patterns

```typescript
// Common error message patterns
const errorMessages = {
  required: 'Pole jest wymagane',
  minLength: 'Minimalna długość to {min} znaków',
  maxLength: 'Maksymalna długość to {max} znaków',
  invalidFormat: 'Nieprawidłowy format',
  invalidValue: 'Nieprawidłowa wartość',
  mustBeGreater: 'Musi być większe niż {min}',
  mustBeLess: 'Musi być mniejsze niż {max}',
  mustChooseOne: 'Musisz wybrać przynajmniej jedną opcję',
}
```

## Advanced Validation Techniques

### 1. Conditional Validation

```typescript
export const ConditionalFeatureSchema = z
  .object({
    type: z.enum(['basic', 'premium']),
    features: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'premium') {
        return data.features && data.features.length > 0
      }
      return true
    },
    {
      message: 'Funkcje premium wymagają wyboru funkcji',
      path: ['features'],
    }
  )
```

### 2. Custom Transformations

```typescript
export const TransformFeatureSchema = z.object({
  tags: z
    .string()
    .transform((val) => val.split(',').map((tag) => tag.trim()))
    .pipe(z.array(z.string()).min(1, 'Musisz podać przynajmniej jeden tag')),
  price: z
    .string()
    .transform((val) => parseFloat(val))
    .pipe(z.number().min(0, 'Cena nie może być ujemna')),
})
```

### 3. Union Types

```typescript
export const UnionFeatureSchema = z.union([
  z.object({
    type: z.literal('text'),
    content: z.string().min(1, 'Treść nie może być pusta'),
  }),
  z.object({
    type: z.literal('file'),
    fileId: z.string().uuid('Nieprawidłowe ID pliku'),
  }),
])
```

## Testing Validation Schemas

### Unit Test Example

```typescript
// tests/validations/feature.validations.test.ts
import { FeatureRequestSchema } from '../../src/validations/feature.validations'

describe('FeatureRequestSchema', () => {
  it('should validate correct data', () => {
    const validData = {
      name: 'Test Feature',
      description: 'Test description',
      status: 'active',
    }

    const result = FeatureRequestSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject invalid data', () => {
    const invalidData = {
      name: '', // Empty name
      status: 'invalid_status', // Invalid status
    }

    const result = FeatureRequestSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toHaveLength(2)
    }
  })

  it('should provide Polish error messages', () => {
    const invalidData = { name: '' }
    const result = FeatureRequestSchema.safeParse(invalidData)

    if (!result.success) {
      const nameError = result.error.issues.find((issue) =>
        issue.path.includes('name')
      )
      expect(nameError?.message).toBe('Nazwa nie może być pusta')
    }
  })
})
```

## Integration with Controllers

### Type-Safe Controller Implementation

```typescript
// controllers/feature.controller.ts
import { NextFunction, Response } from 'express'
import { TypedRequestBody } from '../types/feature.types'
import { FeatureRequest } from '../validations/feature.validations'

type FeatureRequestBody = TypedRequestBody<FeatureRequest>

export class FeatureController {
  async createFeature(
    req: FeatureRequestBody,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // req.body is now fully typed and validated
      const { name, description, status } = req.body

      // Business logic here
      const result = await this.featureService.createFeature({
        name,
        description,
        status,
      })

      res.json({
        success: true,
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }
}
```

## Best Practices

### 1. Schema Organization

- **One file per feature**: Keep related schemas together
- **Export types**: Always export TypeScript types from schemas
- **Use constants**: Define enum values as constants
- **Group related schemas**: Keep request, response, and query schemas together

### 2. Error Handling

- **Consistent messages**: Use consistent Polish error messages
- **Specific paths**: Use path arrays to target specific fields
- **Meaningful messages**: Provide clear, actionable error messages
- **Validation order**: Validate required fields before optional ones

### 3. Performance

- **Lazy validation**: Only validate when needed
- **Efficient schemas**: Use appropriate Zod methods for performance
- **Caching**: Consider caching validation results for repeated data

### 4. Security

- **Input sanitization**: Always validate and sanitize user input
- **Type safety**: Leverage TypeScript for compile-time safety
- **No sensitive data**: Never expose internal errors to clients

## Checklist for New Validations

- [ ] Create validation file in `validations/` directory
- [ ] Define constants for enum values
- [ ] Create Zod schemas with Polish error messages
- [ ] Export TypeScript types from schemas
- [ ] Add validation to routes using middleware
- [ ] Update `validations/index.ts` exports
- [ ] Write unit tests for validation schemas
- [ ] Test error messages are in Polish
- [ ] Verify type safety in controllers
- [ ] Document validation requirements

## Common Validation Patterns

### URL Validation

```typescript
export const UrlSchema = z.string().refine(
  (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },
  { message: 'Nieprawidłowy URL' }
)
```

### Email Validation

```typescript
export const EmailSchema = z.string().email('Nieprawidłowy format email')
```

### UUID Validation

```typescript
export const UuidSchema = z.string().uuid('Nieprawidłowe ID')
```

### Date Validation

```typescript
export const DateSchema = z.string().datetime('Nieprawidłowy format daty')
```

### File Upload Validation

```typescript
export const FileUploadSchema = z.object({
  filename: z.string().min(1, 'Nazwa pliku jest wymagana'),
  mimetype: z
    .string()
    .refine(
      (type) => ['image/jpeg', 'image/png', 'application/pdf'].includes(type),
      { message: 'Nieobsługiwany typ pliku' }
    ),
  size: z.number().max(5 * 1024 * 1024, 'Plik nie może być większy niż 5MB'),
})
```

This guide ensures that all new validations follow the established patterns and maintain the high quality standards of the existing codebase.
