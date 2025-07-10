# YouTube Transcript API - Przykłady odpowiedzi

## Health Check

```http
GET http://localhost:3001/health
```

**Odpowiedź:**

```json
{
  "success": true,
  "message": "YouTube Transcript API is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Get Video Info

```http
GET http://localhost:3001/api/video-info?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

**Odpowiedź:**

```json
{
  "success": true,
  "data": {
    "title": "Rick Astley - Never Gonna Give You Up",
    "author": "Rick Astley",
    "lengthSeconds": 212,
    "viewCount": "1234567890",
    "videoId": "dQw4w9WgXcQ"
  }
}
```

## Get Transcript

```http
GET http://localhost:3001/api/transcript?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

**Odpowiedź:**

```json
{
  "success": true,
  "data": {
    "transcript": [
      {
        "text": "We're no strangers to love",
        "start": 0,
        "duration": 3
      },
      {
        "text": "You know the rules and so do I",
        "start": 3,
        "duration": 3
      },
      {
        "text": "A full commitment's what I'm thinking of",
        "start": 6,
        "duration": 4
      }
    ]
  }
}
```

## Get Description

```http
GET http://localhost:3001/api/description?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

**Odpowiedź:**

```json
{
  "success": true,
  "data": {
    "description": "Official Rick Astley - Never Gonna Give You Up (Official Music Video)\n\nListen On Spotify - http://smarturl.it/RickAstleySpotify\nListen On Apple Music - http://smarturl.it/RickAstleyGFA\nListen On Amazon - http://smarturl.it/RickAstleyAmazon\n\nFollow Rick Astley:\nFacebook: https://www.facebook.com/RickAstley\nTwitter: https://twitter.com/rickastley\nInstagram: https://www.instagram.com/rickastley\n\nLyrics:\nWe're no strangers to love\nYou know the rules and so do I\nA full commitment's what I'm thinking of\nYou wouldn't get this from any other guy\n\nI just wanna tell you how I'm feeling\nGotta make you understand\n\nNever gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry\nNever gonna say goodbye\nNever gonna tell a lie and hurt you\n\nWe've known each other for so long\nYour heart's been aching but you're too shy to say it\nInside we both know what's been going on\nWe know the game and we're gonna play it\n\nAnd if you ask me how I'm feeling\nDon't tell me you're too blind to see\n\nNever gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry\nNever gonna say goodbye\nNever gonna tell a lie and hurt you\n\nNever gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry\nNever gonna say goodbye\nNever gonna tell a lie and hurt you\n\n(Ooh, give you up)\n(Ooh, give you up)\nNever gonna give, never gonna give\n(Give you up)\nNever gonna give, never gonna give\n(Give you up)\n\nWe've known each other for so long\nYour heart's been aching but you're too shy to say it\nInside we both know what's been going on\nWe know the game and we're gonna play it\n\nI just wanna tell you how I'm feeling\nGotta make you understand\n\nNever gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry\nNever gonna say goodbye\nNever gonna tell a lie and hurt you\n\nNever gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry\nNever gonna say goodbye\nNever gonna tell a lie and hurt you\n\nNever gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry\nNever gonna say goodbye\nNever gonna tell a lie and hurt you"
  }
}
```

## Error Responses

### Missing URL Parameter

```http
GET http://localhost:3001/api/transcript
```

**Odpowiedź:**

```json
{
  "success": false,
  "error": "Missing or invalid URL parameter"
}
```

### Invalid YouTube URL

```http
GET http://localhost:3001/api/transcript?url=https://invalid-url.com
```

**Odpowiedź:**

```json
{
  "success": false,
  "error": "Failed to fetch transcript",
  "details": "Invalid YouTube URL"
}
```

### Rate Limiting

```http
GET http://localhost:3001/api/transcript?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

**Odpowiedź (po przekroczeniu limitu):**

```json
{
  "success": false,
  "error": "Too many requests from this IP, please try again later."
}
```

### 404 Not Found

```http
GET http://localhost:3001/api/nonexistent
```

**Odpowiedź:**

```json
{
  "success": false,
  "error": "Route /api/nonexistent not found"
}
```

## HTTP Status Codes

- `200` - Success
- `400` - Bad Request (missing/invalid parameters)
- `404` - Not Found (invalid route)
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error

## Testowanie z REST Client

1. Zainstaluj rozszerzenie **REST Client** w VS Code
2. Otwórz plik `api-tests.rest`
3. Kliknij **"Send Request"** nad każdym endpointem
4. Sprawdź odpowiedzi w panelu po prawej stronie

## Zmienne środowiskowe

Możesz zmienić URL w pliku `api-tests.rest`:

```http
@baseUrl = http://localhost:3001
@youtubeUrl = https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

Na przykład dla produkcji:

```http
@baseUrl = https://your-api-domain.com
@youtubeUrl = https://www.youtube.com/watch?v=dQw4w9WgXcQ
```
