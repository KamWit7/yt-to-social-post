# Plan Testów dla AI Processing Service i Validations

## 📋 Przegląd

Ten dokument opisuje kompleksowy plan testów dla:

- `AIProcessingService` - serwis przetwarzania transkrypcji przez AI
- `ai.validations.ts` - walidacja danych wejściowych
- Endpointy AI - testy HTTP API

## 🎯 Cele Testów

### 1. AIProcessingService

- **Funkcjonalność podstawowa**: Sprawdzenie czy serwis zwraca podstawowe wyniki (summary, topics)
- **Logika biznesowa**: Weryfikacja odpowiednich kombinacji purpose + options
- **Obsługa błędów**: Testowanie scenariuszy awarii AI service
- **Parsowanie JSON**: Sprawdzenie obsługi mind map jako JSON
- **Edge cases**: Testowanie skrajnych przypadków (puste dane, długie teksty)

### 2. AI Validations

- **Walidacja Purpose**: Sprawdzenie poprawności enum values
- **Walidacja Options**: Testowanie różnych kombinacji opcji
- **Walidacja Request**: Kompleksowa walidacja całego requestu
- **Type Safety**: Sprawdzenie poprawności typów TypeScript
- **Edge Cases**: Testowanie skrajnych przypadków walidacji

### 3. AI Endpoints

- **HTTP Methods**: Sprawdzenie obsługi różnych metod HTTP
- **Request Validation**: Testowanie walidacji na poziomie endpointu
- **Response Format**: Weryfikacja struktury odpowiedzi
- **Error Handling**: Obsługa błędów HTTP
- **Integration**: Testowanie integracji z serwisem

## 🧪 Struktura Testów

### AIProcessingService Tests (`services/ai-processing.service.test.ts`)

#### Constructor Tests

- ✅ Inicjalizacja z poprawnym API key
- ❌ Błąd przy braku API key

#### Basic Functionality Tests

- ✅ Zwracanie podstawowych wyników (summary, topics)
- ✅ Wywołanie AI service dla summary i topics

#### Purpose-Specific Tests

- **Learning Purpose**:

  - ✅ Generowanie mind map gdy `generateMindMap: true`
  - ✅ Brak mind map gdy `generateMindMap: false`
  - ✅ Brak mind map gdy `generateMindMap: undefined`

- **Social Media Purpose**:

  - ✅ Generowanie social post gdy `generateSocialPost: true`
  - ✅ Brak social post gdy `generateSocialPost: false`
  - ✅ Brak social post gdy `generateSocialPost: undefined`

- **Custom Purpose**:
  - ✅ Generowanie custom output gdy `customPrompt` jest podane
  - ✅ Brak custom output gdy `customPrompt` jest puste
  - ✅ Brak custom output gdy `customPrompt` jest undefined

#### Error Handling Tests

- ✅ Obsługa błędów AI service (częściowe wyniki)
- ✅ Obsługa wielokrotnych błędów AI service
- ✅ Parsowanie niepoprawnego JSON dla mind map

#### Complex Scenarios Tests

- ✅ Wszystkie opcje włączone dla Learning purpose
- ✅ Wszystkie opcje włączone dla SocialMedia purpose
- ✅ Wszystkie opcje włączone dla Custom purpose

#### Edge Cases Tests

- ✅ Pusta transkrypcja
- ✅ Bardzo długa transkrypcja
- ✅ Transkrypcja ze znakami specjalnymi

### AI Validations Tests (`validations/ai.validations.test.ts`)

#### Purpose Enum Tests

- ✅ Poprawne wartości enum
- ✅ Wszystkie wymagane wartości

#### ProcessTranscriptOptionsSchema Tests

- **Valid Options**:

  - ✅ Tylko `generateMindMap: true`
  - ✅ Tylko `generateSocialPost: true`
  - ✅ Tylko `customPrompt`
  - ✅ Wiele opcji
  - ✅ Wszystkie opcje jako true
  - ✅ Pusty `customPrompt`

- **Invalid Options**:

  - ❌ Pusty obiekt options
  - ❌ Wszystkie opcje false/undefined
  - ❌ `customPrompt` tylko whitespace
  - ❌ Niepoprawne typy danych

- **Edge Cases**:
  - ✅ Bardzo długi `customPrompt`
  - ✅ Znaki specjalne w `customPrompt`
  - ✅ Wartości null (traktowane jako undefined)

#### ProcessTranscriptRequestSchema Tests

- **Valid Requests**:

  - ✅ Minimalny request z Learning purpose
  - ✅ Minimalny request z SocialMedia purpose
  - ✅ Minimalny request z Custom purpose
  - ✅ Request ze wszystkimi opcjami
  - ✅ Bardzo długa transkrypcja
  - ✅ Transkrypcja ze znakami specjalnymi

- **Invalid Requests**:

  - ❌ Brak transkrypcji
  - ❌ Pusta transkrypcja
  - ❌ Transkrypcja tylko whitespace
  - ❌ Brak purpose
  - ❌ Niepoprawny purpose
  - ❌ Brak options
  - ❌ Puste options
  - ❌ Niepoprawna struktura options
  - ❌ Wiele błędów walidacji

- **Type Inference Tests**:
  - ✅ Poprawna inferencja typów TypeScript
  - ✅ Integracja z Zod

### AI Endpoints Tests (`endpoints/ai.test.ts`)

#### Valid Requests Tests

- ✅ Learning purpose z mind map
- ✅ SocialMedia purpose z social post
- ✅ Custom purpose z custom prompt
- ✅ Wszystkie opcje włączone
- ✅ Bardzo długa transkrypcja
- ✅ Transkrypcja ze znakami specjalnymi

#### Validation Error Tests

- ❌ Brak transkrypcji
- ❌ Pusta transkrypcja
- ❌ Transkrypcja tylko whitespace
- ❌ Brak purpose
- ❌ Niepoprawny purpose
- ❌ Brak options
- ❌ Puste options
- ❌ Niepoprawna struktura options
- ❌ Wiele błędów walidacji

#### HTTP Error Tests

- ❌ Niepoprawny Content-Type
- ❌ Niepoprawny JSON
- ❌ Puste body
- ❌ Null body

#### Edge Cases Tests

- ✅ Bardzo długi custom prompt
- ✅ Znaki specjalne w custom prompt
- ✅ Learning purpose bez mind map
- ✅ SocialMedia purpose bez social post
- ✅ Custom purpose z pustym custom prompt

#### Response Format Tests

- ✅ Poprawna struktura odpowiedzi dla sukcesu
- ✅ Poprawna struktura odpowiedzi dla błędu
- ✅ Sprawdzenie typów danych

#### HTTP Methods Tests

- ❌ GET request
- ❌ PUT request
- ❌ DELETE request
- ❌ PATCH request

#### Non-existent Endpoints Tests

- ❌ Nieistniejący endpoint AI
- ❌ Nieistniejący podkatalog AI

## 🔧 Mocki i Helpers

### AIProcessingService Mock (`mock/ai-processing-service.mock.ts`)

- `mockAIProcessingResult` - podstawowy wynik
- `mockAIProcessingResultWithMindMap` - wynik z mind map
- `mockAIProcessingResultWithSocialPost` - wynik z social post
- `mockAIProcessingResultWithCustomOutput` - wynik z custom output
- `mockAIProcessingResultComplete` - kompletny wynik
- `mockAIProcessingServiceError` - serwis z błędem
- `mockAIProcessingServicePartialError` - częściowy błąd

### Helper Functions

- `createMockAIProcessingService(result)` - tworzy mock z określonym wynikiem
- `createMockAIProcessingServiceWithError(error)` - tworzy mock z błędem
- `createMockAIProcessingServiceWithPartialFailure(partialResult)` - tworzy mock z częściowym błędem

## 📊 Metryki Testów

### Pokrycie Kodu

- **AIProcessingService**: 95%+
- **AI Validations**: 100%
- **AI Endpoints**: 90%+

### Scenariusze Testowe

- **Pozytywne przypadki**: 25+
- **Negatywne przypadki**: 20+
- **Edge cases**: 10+
- **Błędy i wyjątki**: 8+

### Kombinacje Purpose + Options

- **Learning + generateMindMap**: ✅
- **Learning + generateMindMap: false**: ✅
- **SocialMedia + generateSocialPost**: ✅
- **SocialMedia + generateSocialPost: false**: ✅
- **Custom + customPrompt**: ✅
- **Custom + customPrompt: ""**: ✅
- **Wszystkie opcje włączone**: ✅

## 🚀 Uruchamianie Testów

### Wszystkie testy AI

```bash
npm test -- --testPathPattern="ai"
```

### Tylko testy serwisu

```bash
npm test -- --testPathPattern="ai-processing.service"
```

### Tylko testy walidacji

```bash
npm test -- --testPathPattern="ai.validations"
```

### Tylko testy endpointów

```bash
npm test -- --testPathPattern="endpoints/ai"
```

### Testy z pokryciem

```bash
npm run test:coverage -- --testPathPattern="ai"
```

## 🔍 Debugowanie

### Pojedynczy test

```bash
npm test -- --testNamePattern="should process transcript with Learning purpose"
```

### Test z logami

```bash
VERBOSE_TESTS=true npm test -- --testPathPattern="ai"
```

### Test z debuggerem

```bash
node --inspect-brk node_modules/.bin/jest --runInBand --testPathPattern="ai"
```

## 📝 Checklist Przed Commit

- [ ] Wszystkie testy AI przechodzą (`npm test -- --testPathPattern="ai"`)
- [ ] Pokrycie kodu > 90% dla AI components
- [ ] Testy edge cases przechodzą
- [ ] Testy błędów przechodzą
- [ ] Mocki są poprawnie skonfigurowane
- [ ] Dokumentacja testów jest aktualna
- [ ] Linter nie zgłasza błędów
- [ ] Testy integracyjne działają (jeśli są)

## 🐛 Znane Problemy

1. **Mockowanie Google Generative AI**: Używamy `jest.mock()` do mockowania całego modułu
2. **Async/Await w testach**: Wszystkie testy używają async/await dla lepszej czytelności
3. **Environment variables**: Testy ustawiają `GEMINI_API_KEY` w `beforeEach`
4. **Type safety**: Wszystkie testy używają TypeScript types

## 🔄 Aktualizacje

### Dodanie nowego Purpose

1. Dodaj test w `Purpose Enum Tests`
2. Dodaj test w `Purpose-Specific Tests`
3. Zaktualizuj mocki jeśli potrzebne

### Dodanie nowej Option

1. Dodaj test w `ProcessTranscriptOptionsSchema Tests`
2. Dodaj test w `Purpose-Specific Tests`
3. Zaktualizuj mocki i helpers

### Zmiana logiki biznesowej

1. Zaktualizuj odpowiednie testy
2. Dodaj nowe testy dla nowych scenariuszy
3. Zaktualizuj dokumentację
