# 🧪 Setup środowiska testowego

## Instalacja zależności

### 1. Zainstaluj zależności testowe

```bash
npm install --save-dev jest supertest @types/jest @types/supertest ts-jest jest-puppeteer
```

### 2. Sprawdź konfigurację

Upewnij się, że masz te pliki:

- ✅ `jest.config.js` - konfiguracja Jest
- ✅ `tests/setup.ts` - setup testów
- ✅ `tsconfig.json` - konfiguracja TypeScript

## Pierwsze uruchomienie

### 1. Uruchom testy podstawowe

```bash
npm test
```

Powinno pokazać:

```
✅ Health endpoint tests
✅ Transcript endpoint tests
✅ Screenshot endpoint tests
✅ Error handling tests
✅ Middleware tests
```

### 2. Sprawdź pokrycie testami

```bash
npm run test:coverage
```

### 3. Uruchom testy w trybie watch

```bash
npm run test:watch
```

## Rozwiązywanie problemów

### Problem: "Cannot find module 'supertest'"

```bash
npm install --save-dev supertest @types/supertest
```

### Problem: "Cannot find module '../src/server'"

Sprawdź, czy aplikacja kompiluje się poprawnie:

```bash
npm run build
```

### Problem: "Jest encountered an unexpected token"

Sprawdź konfigurację `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // ...
}
```

### Problem: Testy timeout

Zwiększ timeout w `jest.config.js`:

```javascript
module.exports = {
  // ...
  testTimeout: 30000,
}
```

## Struktura plików

Po instalacji powinieneś mieć:

```
backend/
├── jest.config.js           # ✅ Konfiguracja Jest
├── package.json            # ✅ Z scripts testowymi
├── tests/
│   ├── setup.ts            # ✅ Setup globalny
│   ├── endpoints/          # ✅ Testy API
│   ├── middleware/         # ✅ Testy middleware
│   ├── integration/        # ✅ Testy integracyjne
│   └── README.md           # ✅ Dokumentacja
└── src/                    # Kod aplikacji
```

## Weryfikacja instalacji

### Test 1: Sprawdź czy Jest działa

```bash
npx jest --version
```

### Test 2: Uruchom pojedynczy test

```bash
npx jest --testNamePattern="should return health status"
```

### Test 3: Sprawdź TypeScript compilation

```bash
npx ts-jest --help
```

## Następne kroki

1. **Uruchom wszystkie testy**: `npm test`
2. **Sprawdź pokrycie**: `npm run test:coverage`
3. **Skonfiguruj CI/CD** z testami
4. **Dodaj pre-commit hook** z testami

## Tips & Tricks

### Szybkie debugowanie

```bash
# Tylko konkretny test
npm test -- --testNamePattern="health"

# Z verbose output
npm test -- --verbose

# Stop na pierwszym błędzie
npm test -- --bail
```

### Development workflow

```bash
# Terminal 1: Aplikacja
npm run dev

# Terminal 2: Testy w watch mode
npm run test:watch

# Terminal 3: Linter
npm run lint:fix
```

## Gotowe do kodowania! 🚀

Jeśli wszystkie powyższe kroki przebiegły pomyślnie, jesteś gotowy do:

- ✅ Pisania nowych testów
- ✅ Uruchamiania testów podczas developmentu
- ✅ Sprawdzania pokrycia kodu
- ✅ Debugowania aplikacji z testami
