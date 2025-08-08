# Endpoint Implementation Guide

## Overview

This document provides comprehensive guidelines for implementing new endpoints in the YouTube-to-Social-Post backend API. The guide is based on the analysis of the existing architecture and follows established patterns for consistency, maintainability, and scalability.

## Architecture Analysis

### Current Structure

The backend follows a layered architecture with clear separation of concerns:

```
backend/src/
├── routes/           # Route definitions and middleware composition
├── controllers/      # Request/response handling and business logic coordination
├── services/         # Business logic and external API interactions
├── middleware/       # Request validation, error handling, and security
├── validations/      # Zod schemas for request validation
├── types/           # TypeScript type definitions
├── interfaces/      # Service contracts and abstractions
└── docs/           # Documentation (this file)
```

### Existing Endpoints

1. **YouTube Transcript Endpoint** (`GET /api/transcript`)

   - Fetches and parses YouTube video transcripts
   - Uses query parameter validation
   - Implements orchestrator pattern for complex operations

2. **AI Processing Endpoint** (`POST /api/ai/process-transcript`)

   - Processes transcripts using AI services
   - Uses body validation with Zod schemas
   - Implements lazy service initialization

3. **Health Check Endpoints** (`GET /api/health`, `POST /api/health`)
   - System health monitoring
   - Demonstrates both GET and POST patterns
   - Includes content-type validation

## Implementation Guidelines

### 1. Consistency Patterns

#### Naming Conventions

- **Routes**: Use kebab-case for route files (`feature-name.routes.ts`)
- **Controllers**: Use PascalCase with "Controller" suffix (`FeatureController`)
- **Services**: Use PascalCase with "Service" suffix (`FeatureService`)
- **Validations**: Use PascalCase with "Schema" suffix (`FeatureRequestSchema`)
- **Types**: Use PascalCase with descriptive names (`FeatureRequest`, `FeatureResponse`)

#### File Structure

```typescript
// routes/feature.routes.ts
import { Router } from 'express'
import { FeatureController } from '../controllers/feature.controller'
import { validateBody } from '../middleware/validation.middleware'
import { FeatureService } from '../services/feature.service'
import { FeatureRequestSchema } from '../validations/feature.validations'

const router = Router({ caseSensitive: true })

const featureService = new FeatureService()
const featureController = new FeatureController(featureService)

router.post('/feature', validateBody(FeatureRequestSchema), (req, res, next) =>
  featureController.processFeature(req, res, next)
)

export default router
```

### 2. Modularity Requirements

#### Service Layer

- Implement interfaces for all services
- Use dependency injection in controllers
- Separate business logic from HTTP concerns
- Handle external API calls and data transformations

#### Controller Layer

- Keep controllers thin - delegate to services
- Handle HTTP-specific concerns (status codes, headers)
- Use consistent error handling with `next(error)`
- Implement proper TypeScript typing

#### Validation Layer

- Use Zod schemas for all input validation
- Provide clear error messages in Polish (following existing pattern)
- Validate body, query, and params separately
- Use refinement for complex validation logic

### 3. Documentation Standards

#### Code Documentation

```typescript
/**
 * Service for processing feature-specific operations
 */
export class FeatureService {
  /**
   * Processes the main feature operation
   * @param data - Input data for processing
   * @returns Promise resolving to processing result
   * @throws {FeatureError} When processing fails
   */
  async processFeature(data: FeatureRequest): Promise<FeatureResponse> {
    // Implementation
  }
}
```

#### API Documentation

For each endpoint, document:

- **HTTP Method and Path**: `POST /api/feature`
- **Purpose**: Brief description of what the endpoint does
- **Authentication**: Required auth level (if any)
- **Request Format**: Input parameters and their types
- **Response Format**: Expected response structure and status codes
- **Error Cases**: Possible error scenarios and status codes
- **Example**: Sample request and response

### 4. Testing Requirements

#### Unit Tests

- Test all service methods independently
- Mock external dependencies
- Test both success and error scenarios
- Maintain >80% code coverage

#### Integration Tests

- Test complete request/response flow
- Validate middleware integration
- Test error handling end-to-end
- Verify response formats

### 5. Security Implementation

#### Input Validation

- Validate all inputs using Zod schemas
- Sanitize user-provided data
- Implement rate limiting (already configured)
- Use helmet for security headers (already configured)

#### Error Handling

- Never expose internal errors to clients
- Log errors appropriately
- Return consistent error response format
- Use appropriate HTTP status codes

### 6. Performance Considerations

#### Optimization Strategies

- Implement caching where appropriate
- Use async/await for I/O operations
- Consider lazy loading for heavy services
- Monitor response times and resource usage

#### Resource Management

- Implement proper cleanup for external connections
- Use connection pooling for databases
- Handle memory leaks in long-running operations

## Implementation Template

### Step 1: Define Types and Interfaces

```typescript
// types/feature.types.ts
export interface FeatureRequest {
  input: string
  options?: FeatureOptions
}

export interface FeatureResponse {
  result: string
  metadata?: Record<string, any>
}

export interface FeatureOptions {
  mode: 'fast' | 'quality'
  format?: 'json' | 'text'
}
```

### Step 2: Create Validation Schemas

```typescript
// validations/feature.validations.ts
import { z } from 'zod'

export const FeatureOptionsSchema = z.object({
  mode: z.enum(['fast', 'quality']).default('quality'),
  format: z.enum(['json', 'text']).optional(),
})

export const FeatureRequestSchema = z.object({
  input: z.string().min(1, 'Input nie może być pusty'),
  options: FeatureOptionsSchema.optional(),
})

export type FeatureRequest = z.infer<typeof FeatureRequestSchema>
```

### Step 3: Implement Service Layer

```typescript
// services/feature.service.ts
import { FeatureRequest, FeatureResponse } from '../types/feature.types'
import { Logger } from '../utils/logger'

export interface IFeatureService {
  processFeature(data: FeatureRequest): Promise<FeatureResponse>
}

export class FeatureService implements IFeatureService {
  async processFeature(data: FeatureRequest): Promise<FeatureResponse> {
    try {
      Logger.progress('Processing feature request')

      // Business logic implementation
      const result = await this.performFeatureOperation(data)

      Logger.success('Feature processing completed')

      return {
        result,
        metadata: {
          processedAt: new Date().toISOString(),
          mode: data.options?.mode || 'quality',
        },
      }
    } catch (error) {
      Logger.error('Feature processing failed', error)
      throw error
    }
  }

  private async performFeatureOperation(data: FeatureRequest): Promise<string> {
    // Implementation details
    return 'processed result'
  }
}
```

### Step 4: Create Controller

```typescript
// controllers/feature.controller.ts
import { NextFunction, Response } from 'express'
import { FeatureService } from '../services/feature.service'
import { TypedRequestBody } from '../types/feature.types'
import { FeatureRequest } from '../validations/feature.validations'

type FeatureRequestBody = TypedRequestBody<FeatureRequest>

export class FeatureController {
  constructor(private featureService: FeatureService) {}

  async processFeature(
    req: FeatureRequestBody,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { input, options } = req.body

      const result = await this.featureService.processFeature({
        input,
        options,
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

### Step 5: Define Routes

```typescript
// routes/feature.routes.ts
import { Router } from 'express'
import { FeatureController } from '../controllers/feature.controller'
import { validateBody } from '../middleware/validation.middleware'
import { FeatureService } from '../services/feature.service'
import { FeatureRequestSchema } from '../validations/feature.validations'

const router = Router({ caseSensitive: true })

const featureService = new FeatureService()
const featureController = new FeatureController(featureService)

router.post('/feature', validateBody(FeatureRequestSchema), (req, res, next) =>
  featureController.processFeature(req, res, next)
)

export default router
```

### Step 6: Register Routes

```typescript
// server.ts (add to existing file)
import featureRoutes from './routes/feature.routes'

// Add this line with other route registrations
app.use('/api', featureRoutes)
```

## Error Handling Patterns

### Custom Error Classes

```typescript
// utils/errors.ts
export class FeatureError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'FeatureError'
  }
}
```

### Service Error Handling

```typescript
// In service methods
if (!data) {
  throw new FeatureError('Invalid input data', 400, 'INVALID_INPUT')
}
```

### Controller Error Handling

```typescript
// Controllers automatically pass errors to error handler middleware
try {
  // Service call
} catch (error) {
  next(error) // Passes to error handler middleware
}
```

## Testing Template

### Unit Test Example

```typescript
// tests/services/feature.service.test.ts
import { FeatureService } from '../../src/services/feature.service'

describe('FeatureService', () => {
  let service: FeatureService

  beforeEach(() => {
    service = new FeatureService()
  })

  describe('processFeature', () => {
    it('should process valid input successfully', async () => {
      const input = { input: 'test data' }
      const result = await service.processFeature(input)

      expect(result.result).toBeDefined()
      expect(result.metadata).toBeDefined()
    })

    it('should throw error for invalid input', async () => {
      const input = { input: '' }

      await expect(service.processFeature(input)).rejects.toThrow()
    })
  })
})
```

## Best Practices Summary

1. **Follow the established patterns** - Consistency is key
2. **Use TypeScript strictly** - Leverage type safety
3. **Implement proper validation** - Never trust user input
4. **Handle errors gracefully** - Use the error handler middleware
5. **Document everything** - Code, APIs, and decisions
6. **Write comprehensive tests** - Both unit and integration
7. **Consider performance** - Optimize for production use
8. **Maintain security** - Validate, sanitize, and protect
9. **Use logging** - Track operations and debug issues
10. **Keep it simple** - Avoid over-engineering

## Checklist for New Endpoints

- [ ] Types and interfaces defined
- [ ] Validation schemas created
- [ ] Service layer implemented with interface
- [ ] Controller created with proper error handling
- [ ] Routes defined and registered
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] Documentation completed
- [ ] Error handling implemented
- [ ] Performance considerations addressed
- [ ] Security measures implemented
- [ ] Code review completed

This guide ensures that all new endpoints follow the established patterns and maintain the high quality standards of the existing codebase.
