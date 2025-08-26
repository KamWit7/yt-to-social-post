# Product Brief: YouTube to Social Post Generator

## Project Overview / Description

A web application that transcribes YouTube videos and generates social media content using AI. The system processes video transcripts and creates optimized posts for various social media platforms. The application includes a language selection feature allowing users to choose between Polish and English for content generation.

## Target Audience

- Content creators and social media managers
- Marketing professionals
- Businesses looking to repurpose video content
- Users who need to create social media posts from video transcripts
- Polish and English speaking users

## Primary Benefits / Features

- **Video Transcription**: Extract text content from YouTube videos
- **AI-Powered Content Generation**: Automatically generate social media posts from transcripts
- **Multi-Language Support**: Generate content in Polish or English
- **Purpose-Based Generation**: Create content tailored to specific goals (marketing, educational, etc.)
- **Model Selection**: Choose from different AI models for content generation
- **Form-Based Interface**: Streamlined workflow for content creation

## High-Level Tech/Architecture

- **Frontend**: React-based dashboard with form components and controlled inputs
- **Backend**: Node.js/Express API with TypeScript
- **AI Integration**: AI processing service for content generation
- **Database**: Dictionary service for managing language options and form constants
- **Validation**: Zod schemas for form validation and type safety
- **State Management**: React Hook Form for form state management
- **API Design**: RESTful endpoints with dictionary-based configuration
