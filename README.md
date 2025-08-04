# YouTube to Social Post - AI Processing App

Aplikacja do przetwarzania transkrypcji YouTube za pomocą AI (Google Gemini) i generowania różnych typów treści.

## Funkcjonalności

- **Przetwarzanie transkrypcji**: Wklej transkrypcję z filmu YouTube
- **Wybór celu**: Wybierz cel przetwarzania (nauka, praca, tworzenie treści, ogólne)
- **Generowanie treści**:
  - Streszczenie (zawsze)
  - Kluczowe tematy (zawsze)
  - Mapa myśli (opcjonalnie dla nauki)
  - Post na social media (opcjonalnie dla tworzenia treści)
  - Własne polecenie (dla opcji ogólne)

## Struktura projektu

```
├── yt-scribe/          # Frontend (Next.js)
│   ├── src/
│   │   ├── api/        # Serwisy i hooki API
│   │   ├── components/ # Komponenty UI
│   │   └── pages/      # Strony aplikacji
└── backend/            # Backend (Express.js)
    ├── src/
    │   ├── controllers/
    │   ├── services/
    │   └── routes/
```

## Instalacja i uruchomienie

### 1. Backend

```bash
cd backend
npm install
```

Stwórz plik `.env` na podstawie `.env.example`:

```bash
cp .env.example .env
```

Dodaj swój klucz API Google Gemini do pliku `.env`:

```
GEMINI_API_KEY=your_actual_api_key_here
```

Uruchom backend:

```bash
npm run dev
```

Backend będzie dostępny na `http://localhost:3001`

### 2. Frontend

```bash
cd yt-scribe
npm install
```

Uruchom frontend:

```bash
npm run dev
```

Frontend będzie dostępny na `http://localhost:3000`

## Użycie

1. Otwórz aplikację w przeglądarce
2. Wklej transkrypcję z filmu YouTube
3. Wybierz cel przetwarzania
4. W zależności od celu, wybierz dodatkowe opcje:
   - **Do nauki**: Zaznacz "Wygeneruj mapę myśli"
   - **Do tworzenia treści**: Zaznacz "Wygeneruj post na social media"
   - **Ogólne**: Wpisz własne polecenie
5. Kliknij "Generuj"
6. Poczekaj na wyniki i skopiuj je do schowka

## Technologie

### Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- React Hook Form
- React Query (TanStack Query)
- Radix UI

### Backend

- Express.js
- TypeScript
- Google Generative AI (Gemini)
- CORS
- Helmet
- Rate Limiting

## API Endpoints

- `GET /api/transcript` - Pobieranie transkrypcji YouTube
- `POST /api/process` - Przetwarzanie transkrypcji AI
- `GET /api/health` - Health check

## Zmienne środowiskowe

### Backend (.env)

- `PORT` - Port serwera (domyślnie 3001)
- `GEMINI_API_KEY` - Klucz API Google Gemini
- `ALLOWED_ORIGINS` - Dozwolone origins dla CORS
- `RATE_LIMIT_WINDOW_MS` - Okno rate limitingu
- `RATE_LIMIT_MAX_REQUESTS` - Maksymalna liczba requestów

### Frontend

- `NEXT_PUBLIC_API_URL` - URL backendu (domyślnie http://localhost:3001)
