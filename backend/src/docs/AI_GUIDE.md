# AI Guide - YouTube to Social Post Backend

## 1. Project Overview

**YouTube to Social Post Backend** is an Express.js API server that processes YouTube video transcripts using Google Gemini AI to generate various types of content. The backend provides RESTful endpoints for transcript processing, content generation, and YouTube data extraction.

### Main Features

- **Transcript Processing**: Process YouTube video transcripts for AI analysis
- **Content Generation**: Generate summaries, key topics, mind maps, and social media posts
- **YouTube Integration**: Extract transcripts and video metadata from YouTube URLs
- **AI Processing**: Integrate with Google Gemini AI for intelligent content generation
- **Rate Limiting**: Protect API endpoints from abuse
- **Health Monitoring**: Provide health check endpoints for monitoring

### Problem Solved

The backend solves the challenge of efficiently processing YouTube content through AI-powered analysis, providing a robust API for frontend applications to generate various content formats from video transcripts.

## 2. Development Commands

### Database Management

```bash
# No database currently implemented
# See todo.md for planned database implementation
```

### Development Workflow

#### Backend (Express.js)

```bash
cd backend
npm install                    # Install dependencies
npm run dev                    # Start development server with nodemon
npm run build                  # Build TypeScript to JavaScript
npm start                      # Start production server
npm run lint                   # Run ESLint
npm run lint:fix               # Fix ESLint issues
```

### Testing

```bash
# Backend testing
npm run test                   # Run all tests
npm run test:watch             # Run tests in watch mode
npm run test:coverage          # Run tests with coverage
npm run test:integration       # Run integration tests
npm run test:endpoints         # Run endpoint tests
npm run test:middleware        # Run middleware tests
npm run test:ai                # Run AI-related tests
npm run test:load              # Run load testing
```

### Setup Requirements

```bash
# Environment setup
cp .env.example .env           # Create environment file
# Add GEMINI_API_KEY to .env file
```

## 3. Architecture Overview

### Tech Stack

#### Backend

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **AI Integration**: Google Generative AI (Gemini)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Zod
- **Testing**: Jest with Supertest
- **Development**: Nodemon, ESLint

### Project Structure

```
├── backend/                   # Express.js backend
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API route definitions
│   │   ├── middleware/        # Express middleware
│   │   ├── types/             # TypeScript type definitions
│   │   ├── interfaces/        # Interface definitions
│   │   ├── utils/             # Utility functions
│   │   ├── validations/       # Zod validation schemas
│   │   ├── cors/              # CORS configuration
│   │   ├── parsers/           # Data parsing utilities
│   │   ├── docs/              # Documentation
│   │   ├── prompts/           # AI prompt templates
│   │   └── server.ts          # Main server file
│   ├── tests/                 # Test files
│   └── scripts/               # Utility scripts
└── docs/                      # Project documentation
```

### Database Schema

**Current Status**: No database implemented yet

**Planned Schema**: See `todo.md` for detailed database implementation plan

### Key Patterns

#### Data Fetching

- **Service Layer**: Business logic separated from HTTP concerns
- **Controllers**: Handle HTTP requests and responses
- **AI Integration**: Parallel processing using Promise.all for multiple AI requests

#### Authentication

- **Current**: No authentication implemented
- **Planned**: See `todo.md` for JWT-based authentication implementation plan

#### State Management

- **Request State**: Express.js request/response cycle
- **AI Processing**: Async/await pattern for AI operations
- **Error Handling**: Centralized error middleware

#### Error Handling

- **Centralized**: Error middleware with proper HTTP status codes
- **Validation**: Zod schema validation for request/response
- **Logging**: Structured error logging for debugging

## 4. Development Guidelines

### Package Management

- Use `npm` for package management
- Keep dependencies up to date
- Use exact versions for critical dependencies
- Document new dependencies in commit messages

### Service Layer Development

- Use TypeScript for all services
- Follow single responsibility principle
- Implement proper error handling and logging
- Use dependency injection where appropriate
- Keep business logic separate from HTTP concerns

### Request/Response Handling

- Use Zod validation schemas for all inputs
- Provide clear error messages and status codes
- Implement proper request/response typing
- Handle async operations with proper error catching

### Data Operations

- Use service layer pattern for business logic
- Implement proper error handling and logging
- Cache AI responses when appropriate
- Handle concurrent requests efficiently

### API Design Conventions

- Follow RESTful conventions
- Use consistent endpoint naming
- Implement proper HTTP status codes
- Document all endpoints with examples

### API Development

- Use RESTful conventions
- Implement proper HTTP status codes
- Use Zod for request/response validation
- Implement rate limiting and security headers
- Document API endpoints

### Testing Strategy

- Write unit tests for business logic
- Implement integration tests for API endpoints
- Use Jest for backend testing
- Test AI integrations with mocked responses
- Maintain good test coverage

### Code Quality

- Use ESLint for code linting
- Follow TypeScript strict mode
- Implement proper error handling
- Use meaningful variable and function names
- Write self-documenting code with comments where needed

### Security Best Practices

- Never expose API keys in client-side code
- Implement proper CORS configuration
- Use Helmet for security headers
- Validate all user inputs
- Implement rate limiting
- Use environment variables for sensitive data

### Performance Considerations

- Implement proper caching strategies for AI responses
- Optimize database queries when implemented
- Use connection pooling for database connections
- Monitor API response times and throughput
- Implement request queuing for heavy AI operations

## 5. Future Development

For detailed plans on future features, improvements, and implementation phases, see `todo.md` in this directory.
