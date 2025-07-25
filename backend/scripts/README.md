# 🛠️ Backend Scripts

Narzędzia pomocnicze dla testowania i debugowania API.

## 📁 Zawartość

### `transcript-tester.js`

Skrypt do load testingu endpointu `/api/transcript` - sprawdza czy `description` jest poprawnie zwracana.

#### 🚀 Szybkie użycie:

```bash
# W katalogu backend/
npm run test:load         # 5 testów dla każdego domyślnego URL
npm run test:load:heavy   # 10 testów dla każdego domyślnego URL
```

#### 📖 Bezpośrednie użycie:

```bash
# Podstawowe testy
node scripts/transcript-tester.js

# Więcej testów
node scripts/transcript-tester.js --runs 10

# Testowanie konkretnego URL
node scripts/transcript-tester.js --url "https://youtube.com/watch?v=abc123" --runs 3

# Inny backend URL
node scripts/transcript-tester.js --api-url "http://localhost:4000"

# Pomoc
node scripts/transcript-tester.js --help
```

#### 📊 Co sprawdza:

- ✅ **API Health** - czy backend jest dostępny
- 📝 **Description** - czy zostało poprawnie pobrane (główny cel)
- 📄 **Title** - czy został pobrany
- 📜 **Transcript** - czy jest dostępny
- ⏱️ **Performance** - czasy odpowiedzi
- 📈 **Success Rate** - statystyki powodzenia

#### 🎯 Przykładowy wynik:

```
🧪 TRANSCRIPT API LOAD TESTER
==============================
✅ API jest dostępne
📊 PODSUMOWANIE TESTÓW
📈 Łączna liczba testów: 10
✅ Udane testy: 10 (100.0%)
📝 Testy z description: 4 (40.0%)  ← To jest problem!
⏱️  Średni czas odpowiedzi: 4002ms
```

#### 🚨 Troubleshooting:

**`❌ API nie jest dostępne`**
- Sprawdź czy backend działa: `npm run dev`
- Sprawdź port (domyślnie 3001)

**`Długie czasy odpowiedzi (>10s)`**
- Normalne dla web scrapingu
- Sprawdź połączenie internetowe

**`Mało description (< 50%)`**
- Problem z YouTube UI changes
- Sprawdź czy URL-e są aktualne
- Debug puppeteer script

## 🔧 Wymagania

- Node.js 18+ (dla wbudowanego `fetch`)
- Backend API uruchomiony na `localhost:3001` 