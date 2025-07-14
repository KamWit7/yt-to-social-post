# YouTube Transcript Backend API

Backend API do pobierania transkrypcji i opisów filmów YouTube.

## 🚀 Instalacja

```bash
cd backend
npm install
```

## 🔧 Konfiguracja

1. Skopiuj plik `.env.example` do `.env`:

```bash
cp .env.example .env
```

2. **Uzyskaj YouTube Data API v3 Key:**

   - Wejdź na [Google Cloud Console](https://console.cloud.google.com/)
   - Utwórz nowy projekt lub wybierz istniejący
   - Włącz YouTube Data API v3
   - Utwórz klucz API w sekcji "Credentials"
   - Skopiuj klucz API

3. Edytuj zmienne środowiskowe w pliku `.env`:

```env
YOUTUBE_API_KEY=your_youtube_api_key_here
```

## 🏃‍♂️ Uruchomienie

### Tryb developerski

```bash
npm run dev
```

### Tryb produkcyjny

```bash
npm run build
npm start
```

## 📡 API Endpoints

### GET /api/transcript

Pobiera listę dostępnych napisów (captions) filmu YouTube.

**Query Parameters:**

- `url` (string, wymagane) - URL filmu YouTube

**Przykład:**

```bash
GET /api/transcript?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

**Odpowiedź:**

```json
{
  "success": true,
  "data": {
    "transcript": [
      {
        "text": "Caption track: en - English",
        "start": 0,
        "duration": 0,
        "language": "en",
        "captionId": "caption_id_here"
      }
    ]
  }
}
```

### GET /api/captions

Pobiera szczegółową listę dostępnych napisów filmu YouTube.

**Query Parameters:**

- `url` (string, wymagane) - URL filmu YouTube

**Przykład:**

```bash
GET /api/captions?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

**Odpowiedź:**

```json
{
  "success": true,
  "data": [
    {
      "id": "caption_id_here",
      "snippet": {
        "videoId": "dQw4w9WgXcQ",
        "language": "en",
        "name": "English",
        "audioTrackType": "PRIMARY"
      }
    }
  ]
}
```

### GET /api/description

Pobiera opis filmu YouTube.

**Query Parameters:**

- `url` (string, wymagane) - URL filmu YouTube

**Przykład:**

```bash
GET /api/description?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

**Odpowiedź:**

```json
{
  "success": true,
  "data": {
    "description": "Official Rick Astley - Never Gonna Give You Up..."
  }
}
```

### GET /api/video-info

Pobiera podstawowe informacje o filmie YouTube.

**Query Parameters:**

- `url` (string, wymagane) - URL filmu YouTube

**Przykład:**

```bash
GET /api/video-info?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
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

### GET /health

Sprawdza status serwera.

**Odpowiedź:**

```json
{
  "success": true,
  "message": "YouTube Transcript API is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 🛠️ Skrypty

- `npm run dev` - Uruchamia serwer w trybie developerskim z hot reload
- `npm run build` - Buduje projekt do produkcji
- `npm start` - Uruchamia serwer produkcyjny
- `npm run lint` - Sprawdza kod ESLint
- `npm run lint:fix` - Automatycznie poprawia błędy ESLint
- `npm test` - Uruchamia testy

## 🔒 Bezpieczeństwo

- **Helmet** - Dodaje nagłówki bezpieczeństwa
- **CORS** - Konfigurowalne CORS
- **Rate Limiting** - Ograniczenie liczby requestów
- **Input Validation** - Walidacja URL YouTube

## 📁 Struktura projektu

```
backend/
├── src/
│   ├── controllers/     # Kontrolery API
│   ├── services/        # Logika biznesowa
│   ├── middleware/      # Middleware Express
│   ├── routes/          # Routing
│   ├── types/           # Typy TypeScript
│   ├── utils/           # Funkcje pomocnicze
│   └── server.ts        # Główny plik serwera
├── package.json
├── tsconfig.json
└── README.md
```
