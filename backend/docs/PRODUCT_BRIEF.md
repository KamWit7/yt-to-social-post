# Product Brief: YouTube to Social Media Post Generator

## Project Overview

A comprehensive backend API service that extracts transcripts from YouTube videos and transforms them into engaging social media content using AI. The service operates without requiring YouTube Data API keys by directly parsing YouTube pages, making it accessible and cost-effective for content creators.

## Target Audience

- **Content Creators**: YouTubers looking to repurpose their video content across social platforms
- **Social Media Managers**: Professionals managing multiple clients' social media presence
- **Digital Marketers**: Teams looking to maximize content reach and engagement
- **Small Businesses**: Organizations wanting to create social content from educational or promotional videos
- **Agencies**: Marketing agencies serving multiple clients with content transformation needs

## Primary Benefits & Features

### Core Functionality

- **API-Key-Free Transcript Extraction**: Direct HTML parsing eliminates YouTube API dependency and costs
- **AI-Powered Content Transformation**: Uses Google's Generative AI to convert transcripts into platform-optimized posts
- **Multi-Purpose Content Generation**: Supports various social media formats (Instagram posts, LinkedIn articles, Twitter threads, etc.)
- **Flexible Content Customization**: Custom purpose definitions and format options for different use cases

### Technical Features

- **Comprehensive Error Handling**: Robust validation and error management for production use
- **Security-First Design**: Rate limiting, CORS configuration, input validation, and security headers
- **High Performance**: Optimized transcript processing with efficient parsing algorithms
- **Scalable Architecture**: Modular service-oriented design supporting concurrent requests
- **Extensive Testing**: Unit, integration, and load testing for reliability

### Additional Services

- **Health Monitoring**: Real-time API status checking
- **Dictionary/Glossary Support**: Content enhancement with terminology management
- **Load Testing Tools**: Built-in performance testing capabilities

## High-Level Tech/Architecture

### Backend Stack

- **Runtime**: Node.js with TypeScript for type safety and developer experience
- **Framework**: Express.js with comprehensive middleware stack
- **AI Integration**: Google Generative AI (@google/generative-ai) for content transformation
- **Security**: Helmet for security headers, CORS configuration, express-rate-limit for API protection
- **Validation**: Zod for input validation and sanitization

### Architecture Pattern

- **Service-Oriented Architecture**: Modular services (YouTube, AI Processing, Dictionary, Health)
- **Controller-Service Pattern**: Clean separation of concerns with dedicated controllers and business logic services
- **Orchestrator Pattern**: YouTube transcript orchestrator coordinates complex extraction workflows
- **Parser-Based Extraction**: Custom HTML parsers for reliable transcript data extraction

### Development & Quality Assurance

- **Testing Framework**: Jest with Supertest for comprehensive API testing
- **Code Quality**: ESLint for linting, TypeScript for compile-time checking
- **Development Workflow**: Nodemon for hot-reload development, automated build processes
- **Performance Testing**: Custom load testing scripts for production readiness

### Deployment & Operations

- **Environment Configuration**: Dotenv for flexible environment management
- **Build Process**: TypeScript compilation to production-ready JavaScript
- **Monitoring**: Health check endpoints for service monitoring
- **Documentation**: REST Client test files and comprehensive API documentation
