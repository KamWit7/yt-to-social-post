## 0002 – Code review (backend)

### Zakres

Przegląd zmian backendu związanych z uproszczeniem body endpointu AI: usunięto `options`, dodano pola `customPrompt?` i `model?` z domyślnym modelem `gemini-2.5-pro`. Weryfikacja spójności walidacji, kontrolera, serwisu oraz testów.

### Realizacja planu – zgodność

- Typy i walidacja: `src/validations/ai.validations.ts`
  - Schema `ProcessTranscriptRequestSchema` zawiera: `transcript`, `purpose`, `customPrompt?` (trim → undefined, jeśli puste), `model?` jako `z.enum(Object.values(AIModels)).default(DEFAULT_AI_MODEL)`. Brak `options`. Zgodne z planem.
- Stałe modeli: `src/constants/ai.ts`
  - Dostępne wartości: `gemini-2.5-pro`, `gemini-2.5-flash`, `gemini-2.5-flash-lite`. `DEFAULT_AI_MODEL = gemini-2.5-pro`. Zgodne z planem.
- Routing i kontroler: `src/routes/ai.routes.ts`, `src/controllers/ai.controller.ts`
  - POST `/api/ai/process-transcript` korzysta z `validateBody(ProcessTranscriptRequestSchema)`. Kontroler przekazuje do serwisu: `transcript`, `purpose`, `customPrompt`, `model`. Zgodne z planem.
- Serwis: `src/services/ai-processing.service.ts`
  - Wybór modelu po `model ?? DEFAULT_AI_MODEL` (redundantne wobec domyślnej wartości z walidacji, ale nieszkodliwe). Logika generowania: `summary` i `topics` zawsze; `mindMap` tylko dla `purpose = learning`; `socialPost` tylko dla `purpose = social_media`; `customOutput` tylko dla `purpose = custom` oraz gdy `customPrompt` dostarczono. Zgodne z planem (decyzja po `purpose`, bez checkboxów/options).

### Testy – stan aktualny

- Walidacje: `tests/validations/ai.validations.test.ts` – zaktualizowane, brak `options`, testują `model` i jego domyślną wartość. OK.
- Endpointy: `tests/endpoints/ai.test.ts` – NIEZAKTUALIZOWANE. Wysyłają `options` i oczekują zachowania sterowanego flagami z `options`. To jest niezgodne z nowym API i będzie prowadzić do nieadekwatnych asercji (np. `customPrompt` pod `options.customPrompt`).

Rekomendacja: zaktualizować `tests/endpoints/ai.test.ts` do nowego kształtu body:

- Usunąć `options` wszędzie.
- Dla `purpose = custom` podawać `customPrompt` w korzeniu body.
- Opcjonalnie podawać `model`; w przeciwnym razie oczekiwać domyślnego `gemini-2.5-pro`.
- Oczekiwać, że `mindMap` i `socialPost` wynikają wyłącznie z `purpose`, a nie z checkboxów/flag.

### Potencjalne problemy / niuanse

- Typ odpowiedzi dla `mindMap`:

  - `AIProcessingResult.mindMap` jest typowane jako `string | undefined` (serwis) oraz w API-typach `src/types/ai.types.ts` także jako `string?`. Implementacja `generateMindMap` wykonuje `JSON.parse(jsonText)` i zwraca wynik (może być obiekt), co skutkuje rozjazdem typów runtime vs. TypeScript.
  - Skutki: konsument API może otrzymać obiekt, mimo że typy deklarują `string`. Część testów dopuszcza `typeof mindMap` jako `'string' | 'object' | 'undefined'`, więc praktyka jest „tolerowana”, ale typowość jest niespójna.
  - Rekomendacje (jedna z opcji):
    - Ujednolicić na „string”: zwracać string (np. `jsonText`) i nie parsować po stronie backendu.
    - Ujednolicić na „obiekt”: zmienić typy `mindMap?: unknown` lub zdefiniować konkretny typ struktury mind map i zwracać obiekt (plus aktualizacja `ProcessTranscriptResponse`).

- Podwójne domyślne dla modelu:

  - Walidacja ustawia `model` domyślnie, a serwis używa `model ?? DEFAULT_AI_MODEL`. To nadmiarowe, ale niegroźne. Można uprościć w serwisie do bezwarunkowego użycia `model` (bo po walidacji zawsze obecne).

- Brak wymogu backendowego dla `customPrompt` przy `purpose = custom`:

  - Obecnie brak warunku walidacyjnego typu „jeśli purpose = custom, to `customPrompt` wymagane”. To zgodne z dotychczasowymi testami endpointu (ze starej wersji), ale jeśli chcemy twardo egzekwować ten wymóg po stronie backendu, należy dodać `.refine` zależne od `purpose` w schemacie.

- Kompatybilność wsteczna klienci → nieznane pola:
  - `validateBody` opiera się na Zod, który domyślnie usuwa nieznane pola. Wysyłane przez stare klienty `options` nie spowoduje 400, a zostanie wycięte. To zachowanie jest w porządku, jeśli świadomie chcemy miękkiej migracji. W przeciwnym razie można rozważyć `schema.strict()` i zwracanie 400 dla nieznanych kluczy.

### Wnioski

- Backend w całości realizuje założenia planu: brak `options`, obecne `customPrompt?` i `model?` z domyślnym `gemini-2.5-pro`, decyzje po `purpose`.
- Główne prace do domknięcia: aktualizacja testów endpointów do nowego API oraz ujednolicenie typu `mindMap` między runtime a deklaracjami.

### Proponowane następne kroki

- Zaktualizować `tests/endpoints/ai.test.ts` zgodnie z nowym kontraktem request/response.
- Ujednolicić typ `mindMap` (string vs. obiekt) i dostosować typy/API lub implementację generowania.
- (Opcjonalnie) rozważyć walidację warunkową `customPrompt` dla `purpose = custom` po stronie backendu oraz `schema.strict()` do twardego odrzucania nieznanych pól.
