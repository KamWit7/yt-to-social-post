# Health Endpoints

## Overview

Health endpoints provide system monitoring and status checking capabilities for the YouTube-to-Social-Post API. These endpoints are essential for monitoring system health, debugging, and ensuring the API is functioning correctly.

## Endpoints

### GET /api/health

**Purpose**: Basic health check to verify the API is running and responsive.

**Authentication**: None required

**Request Format**: No request body or parameters required

**Response Format**:

```json
{
  "success": true,
  "data": {
    "success": true,
    "timestamp": "2024-01-15T10:30:00.000Z",
    "message": "get health check"
  }
}
```

**Status Codes**:

- `200 OK`: API is healthy and responding
- `500 Internal Server Error`: API is experiencing issues

**Error Cases**:

- System errors are handled by the global error handler middleware
- Returns appropriate HTTP status codes with error details

**Example Request**:

```bash
curl -X GET http://localhost:3000/api/health
```

**Example Response**:

```json
{
  "success": true,
  "data": {
    "success": true,
    "timestamp": "2024-01-15T10:30:00.000Z",
    "message": "get health check"
  }
}
```

---

### POST /api/health

**Purpose**: Extended health check that accepts and processes request data for debugging purposes.

**Authentication**: None required

**Request Format**:

- **Content-Type**: `application/json` (validated by middleware)
- **Body**: Any JSON data (optional)

**Response Format**:

```json
{
  "success": true,
  "data": {
    "success": true,
    "timestamp": "2024-01-15T10:30:00.000Z",
    "message": "post health check: {request_body_data}"
  }
}
```

**Status Codes**:

- `200 OK`: Health check completed successfully
- `400 Bad Request`: Invalid content type
- `500 Internal Server Error`: Processing error

**Error Cases**:

- Invalid content type (non-JSON requests)
- System processing errors
- Malformed request body

**Example Request**:

```bash
curl -X POST http://localhost:3000/api/health \
  -H "Content-Type: application/json" \
  -d '{"test": "data", "status": "checking"}'
```

**Example Response**:

```json
{
  "success": true,
  "data": {
    "success": true,
    "timestamp": "2024-01-15T10:30:00.000Z",
    "message": "post health check: {\"test\":\"data\",\"status\":\"checking\"}"
  }
}
```

## Implementation Details

### Architecture

The health endpoints follow the established layered architecture:

- **Controller**: `HealthController` handles HTTP concerns and delegates to service
- **Service**: `HealthService` contains business logic for health checks
- **Middleware**: Content-type validation for POST requests
- **Types**: `HealthResponse` interface defines response structure

### Key Features

1. **Simple Status Checking**: GET endpoint provides basic availability check
2. **Debug Information**: POST endpoint processes and returns request data
3. **Timestamp Tracking**: All responses include ISO timestamp
4. **Error Handling**: Consistent error handling through middleware
5. **Content Validation**: POST requests require proper JSON content type

### Use Cases

- **Load Balancer Health Checks**: Use GET endpoint for automated monitoring
- **System Monitoring**: Regular polling to ensure API availability
- **Debugging**: POST endpoint for testing request processing
- **Integration Testing**: Verify API connectivity and response format

### Performance Considerations

- Minimal processing overhead for quick response times
- No external dependencies or database queries
- Suitable for high-frequency health check polling
- Memory-efficient with no data persistence

### Security Notes

- No authentication required (intended for monitoring)
- Input sanitization on POST requests
- No sensitive data exposure in responses
- Rate limiting applies to all endpoints
