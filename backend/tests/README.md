# Tests for YouTube Transcript API

## 🧪 Struktura testów

```
tests/
├── setup.ts                 # Konfiguracja globalna testów
├── endpoints/               # Testy endpointów API
│   ├── health.test.ts       # Testy /health
│   ├── transcript.test.ts   # Testy /api/transcript
│   └── errors.test.ts       # Testy obsługi błędów
├── middleware/              # Testy middleware
│   └── middleware.test.ts   # CORS, Security, Rate Limiting
├── integration/             # Testy integracyjne
│   └── integration.test.ts  # End-to-end testy
└── index.test.ts           # Główny plik testowy
```

## 🚀 Uruchamianie testów

### Podstawowe komendy

```bash
# Wszystkie testy (z mockami)
npm test

# Testy w trybie watch
npm run test:watch

# Testy z pokryciem kodu
npm run test:coverage

# Testy z verbose output
npm run test:verbose
```

### Specjalizowane testy

```bash
# Tylko testy endpointów
npm run test:endpoints

# Tylko testy middleware
npm run test:middleware

# Testy integracyjne (z prawdziwymi wywołaniami API)
npm run test:integration
```

## 🔧 Konfiguracja

### Zmienne środowiskowe

- `INTEGRATION_TESTS=true` - Włącza testy integracyjne z prawdziwymi wywołaniami API
- `VERBOSE_TESTS=true` - Pokazuje wszystkie logi podczas testów

### Przykłady

```bash
# Uruchom testy integracyjne
INTEGRATION_TESTS=true npm test

# Testy z logami
VERBOSE_TESTS=true npm test

# Kombinacja
INTEGRATION_TESTS=true VERBOSE_TESTS=true npm run test:integration
```

## 📊 Pokrycie testami

Docelowe pokrycie kodu testami:

- **Controllers:** 90%+
- **Services:** 85%+
- **Routes:** 95%+
- **Middleware:** 90%+
- **Utils:** 95%+

## 🎯 Typy testów

### Unit Tests

- Testują pojedyncze funkcje/klasy w izolacji
- Używają mocków dla zależności zewnętrznych
- Szybkie wykonanie (< 1s)

### Integration Tests

- Testują przepływ całej aplikacji
- Mogą używać prawdziwych wywołań API YouTube
- Wolniejsze (kilka sekund)

### API Tests

- Testują endpointy HTTP przez Supertest
- Sprawdzają format odpowiedzi
- Testują obsługę błędów

## 🛠️ Mockowanie

### Serwisy zewnętrzne

Domyślnie zmockowane w `setup.ts`:

- Wszystkie wywołania do zewnętrznych API są zastąpione mockami
- Zwraca przewidywalne dane testowe
- Nie wykonuje prawdziwych wywołań sieciowych

### YouTube Service

Mockowany na poziomie klasy:

- `getTranscript()` zwraca mock dane
- Błędy są symulowane przez `mockRejectedValue()`

## ⚠️ Ważne uwagi

1. **Testy integracyjne są wolne** - używaj oszczędnie
2. **Mockowanie jest włączone domyślnie** - dla szybkości testów
3. **Rate limiting** może wpływać na testy - uwzględnione w testach
4. **Testy integracyjne wymagają połączenia internetowego** - dla wywołań API YouTube

## 🐛 Debugowanie testów

```bash
# Pojedynczy test
npx jest --testNamePattern="should return health status"

# Konkretny plik
npx jest tests/endpoints/health.test.ts

# Z debuggerem
node --inspect-brk node_modules/.bin/jest --runInBand
```

## 📋 Checklist przed commitom

- [ ] Wszystkie testy przechodzą (`npm test`)
- [ ] Pokrycie kodu > 80% (`npm run test:coverage`)
- [ ] Nowe testy dla nowych funkcji
- [ ] Testy integracyjne działają (`npm run test:integration`)
- [ ] Linter nie zgłasza błędów (`npm run lint`)
