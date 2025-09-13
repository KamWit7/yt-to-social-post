# Plan Połączenia Stron Profilu i Użycia

## Opis

Ta funkcjonalność łączy samodzielną stronę użycia (`/usage`) ze stroną profilu (`/profile`), aby skonsolidować informacje o koncie użytkownika i statystyki użycia w jednym miejscu. Użytkownik chce połączyć te dwie strony tak, aby informacje o użyciu były wyświetlane jako część strony profilu, a nie jako osobna trasa.

**Uwaga dotycząca lokalizacji**: Wszystkie zmiany muszą uwzględniać istniejące polskie tłumaczenia i zapewnić spójność językową w całej aplikacji zgodnie z planem lokalizacji `0011_POLISH_LOCALIZATION_PLAN.md`.

## Pliki i Funkcje do Zmiany

### Strony i Routing

- **`src/app/(user)/profile/page.tsx`** - Zaktualizować metadane, aby odzwierciedlały połączoną funkcjonalność profilu i użycia
  - Aktualne metadane: `title: 'Profil | YT Scribe'`, `description: 'Zarządzaj ustawieniami konta i wyświetl informacje o profilu'`
  - Nowe metadane: `description: 'Zarządzaj ustawieniami konta, wyświetl informacje o profilu i monitoruj statystyki użycia'`
- **`src/app/(user)/usage/page.tsx`** - Usunąć ten plik, ponieważ użycie zostanie zintegrowane z profilem
- **`src/app/(user)/layout.tsx`** - Zaktualizować funkcję `getPageConfig()`, aby usunąć konfigurację specyficzną dla użycia i zaktualizować logikę `isProfileOrUsage`

### Komponenty do Modyfikacji

- **`src/components/auth/UserProfile/UserProfile.tsx`** - Rozszerzyć o wyświetlanie statystyk użycia obok istniejących informacji użytkownika
  - Przetłumaczyć istniejące angielskie teksty: `"User Profile"` → `"Profil Użytkownika"`, `"Your account information and settings"` → `"Informacje o Twoim koncie i ustawienia"`
- **`src/components/usage/UsageStats.tsx`** - Zmodyfikować, aby można było osadzić w stronie profilu i przetłumaczyć wszystkie angielskie teksty:
  - `"Usage Overview"` → `"Przegląd Użycia"`
  - `"Track your monthly summary generations"` → `"Śledź swoje miesięczne generowanie podsumowań"`
  - `"Used This Month"` → `"Użyte w tym miesiącu"`
  - `"Monthly Limit"` → `"Miesięczny limit"`
  - `"Remaining"` → `"Pozostało"`
  - Komunikaty statusu:
    - `"You've reached your usage limit..."` → `"Osiągnąłeś swój limit użycia. Rozważ swój plan i uzyskaj nieograniczone podsumowania z własnym kluczem."`
    - `"You're approaching your usage limit..."` → `"Zbliżasz się do swojego limitu użycia. Monitoruj pozostałe podsumowania."`
    - `"You're well within your usage limits..."` → `"Jesteś w granicach swoich limitów użycia. Kontynuuj tworzenie podsumowań!"`
- **`src/components/usage/index.ts`** - Zaktualizować eksporty jeśli potrzebne dla nowej integracji

### Nawigacja i Stałe

- **`src/utils/constants.ts`** - Usunąć trasę `/usage` ze stałej ROUTES lub oznaczyć jako przestarzałą
- **`src/components/common/header/constants.ts`** - Zaktualizować `USER_MENU_ITEMS`, aby usunąć element menu użycia
  - Obecny stan: `{ href: ROUTES.USAGE, label: 'Użycie', icon: BarChart3 }` - do usunięcia
- **`src/components/common/header/UsageCounter/UsageCounter.tsx`** - Zaktualizować logikę sprawdzania pathname, ponieważ strona użycia nie będzie już istnieć

### Metadane i SEO

- Zaktualizować metadane strony profilu, aby odzwierciedlały, że teraz zawiera informacje o użyciu
- Zachować polskie tłumaczenia zgodnie z istniejącym planem lokalizacji

## Algorytm Implementacji

### Krok 1: Integracja Komponentów z Tłumaczeniami

1. Zmodyfikować `UserProfile.tsx`, aby przyjmował opcjonalny prop `showUsage` (domyślnie true)
2. Zaimportować i zintegrować komponent `UsageStats` w strukturze karty profilu
3. Dostosować układ, aby pomieścić zarówno informacje o użytkowniku, jak i statystyki użycia w spójnym designie
4. Zapewnić odpowiednie stany ładowania i obsługę błędów dla danych profilu użytkownika i użycia
5. **Przetłumaczyć wszystkie angielskie teksty w `UserProfile.tsx`** zgodnie z planem lokalizacji

### Krok 2: Adaptacja Komponentu Użycia z Lokalizacją

1. Utworzyć wariant `UsageStats`, który działa w kontekście profilu
2. Usunąć lub zmodyfikować samodzielny wrapper karty, aby pasował do układu profilu
3. Zachować całą istniejącą funkcjonalność (paski postępu, wskaźniki statusu, itp.)
4. **Przetłumaczyć wszystkie angielskie teksty w `UsageStats.tsx`** na polski:
   - Nagłówki, etykiety, komunikaty statusu
   - Zachować spójność z istniejącymi polskimi tłumaczeniami

### Krok 3: Aktualizacje Routingu i Nawigacji

1. Usunąć plik strony użycia i trasę
2. Zaktualizować menu nawigacji, aby usunąć link użycia z `USER_MENU_ITEMS`
3. Zaktualizować logikę układu, aby obsługiwać tylko stronę profilu (usunąć stylowanie specyficzne dla użycia)
4. Zaktualizować wszelkie wewnętrzne linki wskazujące na `/usage`, aby wskazywały na `/profile`
5. **Zachować polskie etykiety** w menu nawigacji zgodnie z `constants.ts`

### Krok 4: Aktualizacje Komponentu Licznika

1. Zmodyfikować `UsageCounter.tsx`, aby usunąć sprawdzanie pathname dla `/usage`, ponieważ ta trasa nie będzie już istnieć
2. Upewnić się, że licznik użycia nadal działa poprawnie na wszystkich innych stronach
3. **Zachować polskie tłumaczenia** w `USAGE_COUNTER_CONSTANTS`

### Krok 5: Metadane i Konfiguracja z Lokalizacją

1. Zaktualizować metadane strony profilu, aby zawierały słowa kluczowe związane z użyciem (po polsku)
2. Zaktualizować konfigurację układu, aby odzwierciedlała połączoną funkcjonalność
3. Przetestować, że cała istniejąca funkcjonalność użycia działa w kontekście profilu
4. **Upewnić się, że wszystkie nowe teksty są po polsku** zgodnie z planem lokalizacji

### Krok 6: Dodatkowe Uwagi Lokalizacyjne

1. Sprawdzić spójność terminologii między profilem a użyciem
2. Upewnić się, że wszystkie komunikaty błędów są po polsku
3. Zweryfikować, że metadane SEO są zaktualizowane po polsku
4. Przetestować całą ścieżkę użytkownika w języku polskim

## Uwagi Techniczne

- Zachować kompatybilność wsteczną dla istniejących zakładek do `/usage` poprzez potencjalne dodanie przekierowania
- Upewnić się, że ładowanie statystyk użycia nie blokuje wyświetlania informacji o profilu
- Zachować całą istniejącą funkcjonalność użycia, w tym aktualizacje w czasie rzeczywistym i poziomy ostrzeżeń
- Zachować te same zasady responsywnego designu dla połączonego interfejsu
- Zachować odpowiednie typy TypeScript dla zintegrowanych komponentów

### Specyficzne Uwagi Lokalizacyjne

- **Spójność terminologii**: Upewnić się, że terminy używane w połączonych komponentach są spójne z istniejącymi polskimi tłumaczeniami
- **Komunikaty błędów**: Wszystkie nowe komunikaty błędów muszą być po polsku
- **Metadane SEO**: Zaktualizowane metadane muszą być zoptymalizowane dla polskich wyszukiwań
- **Dostępność**: Zachować polskie etykiety dla czytników ekranu i innych technologii wspomagających
- **Walidacja formularzy**: Upewnić się, że wszystkie komunikaty walidacji są po polsku
- **Loading states**: Wszystkie stany ładowania muszą wyświetlać polskie komunikaty

### Testowanie Lokalizacji

- Przetestować wszystkie ścieżki użytkownika w języku polskim
- Sprawdzić poprawność gramatyczną i stylistyczną wszystkich nowych tekstów
- Zweryfikować spójność z istniejącymi tłumaczeniami w aplikacji
- Upewnić się, że nie ma mieszania języków angielskiego i polskiego

## Szczegółowe Tłumaczenia do Implementacji

### UserProfile.tsx - Teksty do Przetłumaczenia

```typescript
// Przed:
"User Profile" → "Profil Użytkownika"
"Your account information and settings" → "Informacje o Twoim koncie i ustawienia"
```

### UsageStats.tsx - Kompletne Tłumaczenia

```typescript
// Nagłówki i opisy:
"Usage Overview" → "Przegląd Użycia"
"Track your monthly summary generations" → "Śledź swoje miesięczne generowanie podsumowań"

// Etykiety statystyk:
"Used This Month" → "Użyte w tym miesiącu"
"Monthly Limit" → "Miesięczny limit"
"Remaining" → "Pozostało"
"of" → "z"  // w kontekście "X of Y used"
"used" → "użyte"

// Komunikaty statusu (zachować istniejącą logikę kolorów):
"You've reached your usage limit. Consider your plan and get unlimited summaries with your own key."
→ "Osiągnąłeś swój limit użycia. Rozważ swój plan i uzyskaj nieograniczone podsumowania z własnym kluczem."

"You're approaching your usage limit. Monitor your remaining summaries."
→ "Zbliżasz się do swojego limitu użycia. Monitoruj pozostałe podsumowania."

"You're well within your usage limits. Keep creating summaries!"
→ "Jesteś w granicach swoich limitów użycia. Kontynuuj tworzenie podsumowań!"
```

### Metadane Strony Profilu

```typescript
// Aktualizacja w profile/page.tsx:
description: 'Zarządzaj ustawieniami konta, wyświetl informacje o profilu i monitoruj statystyki użycia'
```

### Layout.tsx - Aktualizacje Konfiguracji

```typescript
// Usunąć konfigurację dla ROUTES.USAGE
// Zachować istniejące polskie tłumaczenia dla profilu:
title: 'Twój profil'
description: 'Zarządzaj informacjami o swoim koncie i monitoruj użycie' // zaktualizowany opis
```
