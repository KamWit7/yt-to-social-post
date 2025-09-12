# Plan Lokalizacji na Język Polski

## Opis

Kompleksowa lokalizacja aplikacji YouTube to Social Post z języka angielskiego na polski. Plan obejmuje identyfikację i tłumaczenie wszystkich tekstów widocznych dla użytkownika w interfejsie, komunikatach błędów, metadanych i innych elementach UX.

## Pliki wymagające zmian

### 1. Metadane i SEO

**src/app/layout.tsx**

- `title: 'Transkrypcje AI - Analiza wideo z AI'` ✅ (już po polsku)
- `description: 'Wklej link do filmu z YouTube...'` ✅ (już po polsku)
- `lang='pl'` ✅ (już ustawione)

**src/app/(user)/profile/page.tsx**

- `title: 'Profile | YT Scribe'` → `'Profil | YT Scribe'`
- `description: 'Manage your account settings...'` → `'Zarządzaj ustawieniami konta i wyświetl informacje o profilu'`

**src/app/login/page.tsx**

- `title: 'Sign In | YT Scribe'` → `'Logowanie | YT Scribe'`
- `description: 'Sign in to your account...'` → `'Zaloguj się do swojego konta, aby uzyskać dostęp do transkrypcji i podsumowań'`

**src/app/register/page.tsx**

- `title: 'Create Account | YT Scribe'` → `'Utwórz Konto | YT Scribe'`
- `description: 'Create a new account...'` → `'Utwórz nowe konto, aby rozpocząć transkrypcję i podsumowywanie filmów YouTube'`

### 2. Nawigacja i Header

**src/components/common/header/Logo.tsx**

- `YT Scribe` → pozostawić lub zmienić na `Transkrypcje AI` (zgodnie z footer)

**src/components/common/header/AuthSection.tsx**

- `Sign In` → `Zaloguj się`
- `Sign Up` → `Zarejestruj się`

**src/components/common/header/constants.ts**

- `Dashboard` → `Panel główny`
- `Usage` → `Użycie`
- `Profile` → `Profil`
- `Settings` → `Ustawienia`

**src/components/common/LogoutButton.tsx**

- `Signing out...` → `Wylogowywanie...`
- `Sign Out` → `Wyloguj się`

### 3. Strony uwierzytelniania

**src/app/login/page.tsx**

- `Welcome Back` → `Witaj ponownie`
- `Sign in to access your account and continue transcribing` → `Zaloguj się, aby uzyskać dostęp do swojego konta i kontynuować transkrypcję`
- `Don't have an account?` → `Nie masz konta?`
- `Create one here` → `Utwórz je tutaj`

**src/app/register/page.tsx**

- `Create Account` → `Utwórz konto`
- `Join YT Scribe to start transcribing YouTube videos with AI` → `Dołącz do YT Scribe, aby rozpocząć transkrypcję filmów YouTube z AI`
- `Already have an account?` → `Masz już konto?`
- `Sign in here` → `Zaloguj się tutaj`

**src/components/auth/LoginForm/LoginForm.tsx**

- `Sign In` → `Zaloguj się`
- `Enter your email and password to access your account` → `Wprowadź swój email i hasło, aby uzyskać dostęp do konta`

**src/components/auth/LoginForm/components/CredentialAuth.tsx**

- `Email` → `Email`
- `Enter your email` → `Wprowadź swój email`
- `Password` → `Hasło`
- `Enter your password` → `Wprowadź swoje hasło`
- `Signing in...` → `Logowanie...`
- `Sign In` → `Zaloguj się`

**src/components/auth/RegisterForm/RegisterForm.tsx**

- `Create Account` → `Utwórz konto`
- `Enter your information to create a new account` → `Wprowadź swoje dane, aby utworzyć nowe konto`
- `Full Name` → `Imię i nazwisko`
- `Enter your full name` → `Wprowadź swoje imię i nazwisko`
- `Email` → `Email`
- `Enter your email` → `Wprowadź swój email`
- `Password` → `Hasło`
- `Create a password` → `Utwórz hasło`
- `Confirm Password` → `Potwierdź hasło`
- `Confirm your password` → `Potwierdź swoje hasło`
- `Creating account...` → `Tworzenie konta...`
- `Create Account` → `Utwórz konto`
- `Registration Successful!` → `Rejestracja zakończona pomyślnie!`
- `Your account has been created successfully` → `Twoje konto zostało utworzone pomyślnie`
- `Redirecting to login in` → `Przekierowanie do logowania za`
- `second/seconds` → `sekunda/sekundy/sekund`
- `Go to login now` → `Przejdź do logowania teraz`

### 4. Layout użytkownika

**src/app/(user)/layout.tsx**

- `Usage Dashboard` → `Panel użycia`
- `Monitor your summary generation usage and track your monthly limits` → `Monitoruj użycie generowania podsumowań i śledź swoje miesięczne limity`
- `Real-time tracking` → `Śledzenie w czasie rzeczywistym`
- `Visual analytics` → `Analityka wizualna`
- `Your Profile` → `Twój profil`
- `Manage your account information` → `Zarządzaj informacjami o swoim koncie`
- `Settings` → `Ustawienia`
- `Manage your account settings` → `Zarządzaj ustawieniami konta`
- `Dashboard` → `Panel główny`
- `Manage your account and usage` → `Zarządzaj swoim kontem i użyciem`

### 5. Ustawienia

**src/app/(user)/settings/page.tsx**

- `Bring Your Own Key (BYOK)` → `Użyj Własnego Klucza (BYOK)`
- `Use your own Google Gemini API key for unlimited processing` → `Użyj własnego klucza API Google Gemini do nieograniczonego przetwarzania`

**src/components/settings/ApiKeyForm/ApiKeyForm.tsx**

- `API Key Active` → `Klucz API aktywny`
- `Your Google Gemini API key is configured and active. You have unlimited processing.` → `Twój klucz API Google Gemini jest skonfigurowany i aktywny. Masz nieograniczone przetwarzanie.`
- `Google Gemini API Key` → `Klucz API Google Gemini`
- `(Update)` → `(Aktualizuj)`
- `Enter new API key to update` → `Wprowadź nowy klucz API, aby zaktualizować`
- `Enter your Google Gemini API key to enable unlimited processing` → `Wprowadź swój klucz API Google Gemini, aby włączyć nieograniczone przetwarzanie`
- `Update API Key` → `Aktualizuj klucz API`
- `Save API Key & Upgrade to BYOK` → `Zapisz klucz API i przejdź na BYOK`
- `Benefits of BYOK Tier:` → `Korzyści z poziomu BYOK:`
- `Unlimited AI processing` → `Nieograniczone przetwarzanie AI`
- `No daily usage limits` → `Brak dziennych limitów użycia`
- `Use your own Google Gemini API quota` → `Użyj własnej kwoty Google Gemini API`
- `Priority processing` → `Priorytetowe przetwarzanie`

**src/components/settings/ApiKeyInstructions.tsx**

- `How to Get Your Google Gemini API Key` → `Jak uzyskać klucz API Google Gemini`
- `Follow these steps to obtain your Google Gemini API key for unlimited processing` → `Wykonaj te kroki, aby uzyskać klucz API Google Gemini do nieograniczonego przetwarzania`
- `Google AI Studio` → `Google AI Studio`
- `Google Cloud Console` → `Google Cloud Console`
- `Step-by-step guide:` → `Przewodnik krok po kroku:`
- `Visit Google AI Studio` → `Odwiedź Google AI Studio`
- `Go to Google AI Studio to create your API key` → `Przejdź do Google AI Studio, aby utworzyć swój klucz API`
- `Open AI Studio` → `Otwórz AI Studio`
- `Sign in with Google Account` → `Zaloguj się kontem Google`
- `Use your Google account to access AI Studio. If you don't have one, create a free Google account first.` → `Użyj swojego konta Google, aby uzyskać dostęp do AI Studio. Jeśli go nie masz, najpierw utwórz bezpłatne konto Google.`
- `Create API Key` → `Utwórz klucz API`
- `Click 'Create API Key' button and select your Google Cloud project (or create a new one if needed).` → `Kliknij przycisk 'Utwórz klucz API' i wybierz swój projekt Google Cloud (lub utwórz nowy, jeśli potrzeba).`
- `Copy Your API Key` → `Skopiuj swój klucz API`
- `Once created, copy the API key. It should start with 'AIza' and be 39 characters long.` → `Po utworzeniu skopiuj klucz API. Powinien zaczynać się od 'AIza' i mieć 39 znaków.`
- `Copy Example` → `Skopiuj przykład`
- `Copied!` → `Skopiowano!`
- `Paste in Settings` → `Wklej w ustawieniach`
- `Return to this page and paste your API key in the form above to upgrade to BYOK tier.` → `Wróć na tę stronę i wklej swój klucz API w formularzu powyżej, aby przejść na poziom BYOK.`

**src/components/settings/AdditionalInfo.tsx**

- `Important Notes:` → `Ważne uwagi:`
- `Keep your API key secure and never share it publicly` → `Zachowaj bezpieczeństwo klucza API i nigdy nie udostępniaj go publicznie`
- `Google Gemini API has its own pricing - check Google's pricing page` → `Google Gemini API ma własne ceny - sprawdź stronę cenową Google`
- `You can monitor your usage in Google Cloud Console` → `Możesz monitorować swoje użycie w Google Cloud Console`
- `The API key will be encrypted and stored securely in our database` → `Klucz API zostanie zaszyfrowany i bezpiecznie przechowany w naszej bazie danych`
- `You can update or remove your API key anytime in settings` → `Możesz zaktualizować lub usunąć swój klucz API w dowolnym momencie w ustawieniach`
- `Additional Resources:` → `Dodatkowe zasoby:`
- `Gemini API Pricing` → `Cennik API Gemini`
- `API Documentation` → `Dokumentacja API`

### 6. Dashboard i formularze

**src/components/dashboard/Dashboard.tsx**

- `YouTube Link` → `Link YouTube`
- `Transkrypcja` ✅ (już po polsku)
- `Cel` ✅ (już po polsku)
- `Wyniki` ✅ (już po polsku)

**src/components/dashboard/TranscriptionForms/forms/YouTubeForm/YouTubeForm.tsx**

- `Podaj Link z YouTube` ✅ (już po polsku)
- `Wklej link do filmu YouTube lub zostaw puste, aby wkleić transkrypcję ręcznie` ✅ (już po polsku)
- `Wygeneruj Transkrypcję` ✅ (już po polsku)

**src/components/dashboard/TranscriptionForms/forms/TranscriptForm/TranscriptForm.tsx**

- `Przygotuj Transkrypcję` ✅ (już po polsku)
- `Edytuj transkrypcję jeżeli tego potrzebujesz` ✅ (już po polsku)
- `Transkrypcja` ✅ (już po polsku)
- `Kopiuj transkrypcję` ✅ (już po polsku)
- `Wklej tutaj transkrypcję z filmu YouTube lub pobierz ją z linku powyżej...` ✅ (już po polsku)
- `Masz niezapisane zmiany w transkrypcji` ✅ (już po polsku)
- `Anuluj` ✅ (już po polsku)
- `Zapisz` ✅ (już po polsku)
- `Przechodzę...` ✅ (już po polsku)
- `Następny krok` ✅ (już po polsku)

**src/components/dashboard/TranscriptionForms/forms/PurposeForm/PurposeForm.tsx**

- `W jakim celu przetwarzasz transkrypcję?` ✅ (już po polsku)
- `Wybierz cel przetwarzania i dostosuj opcje do swoich potrzeb` ✅ (już po polsku)
- `Ustawienia przetwarzania` ✅ (już po polsku)
- `Dostosuj parametry do swoich potrzeb` ✅ (już po polsku)
- `📝 Typ treści` ✅ (już po polsku)
- `Wybierz cel...` ✅ (już po polsku)
- `🌍 Język` ✅ (już po polsku)
- `Wybierz język...` ✅ (już po polsku)
- `🤖 Model AI` ✅ (już po polsku)
- `Wybierz model...` ✅ (już po polsku)
- `Przetwarzam...` ✅ (już po polsku)
- `Przetwórz z AI` ✅ (już po polsku)

### 7. Wyniki

**src/components/dashboard/TranscriptionResults/TranscriptionResults.tsx**

- `Wystąpił błąd podczas przetwarzania` ✅ (już po polsku)
- `Brak wyników przetwarzania` ✅ (już po polsku)
- `Przetworz swój transkrypt w zakładce "Cel", aby zobaczyć wyniki` ✅ (już po polsku)
- `Streszczenie` ✅ (już po polsku)
- `Kopiuj streszczenie` ✅ (już po polsku)
- `Kluczowe tematy` ✅ (już po polsku)
- `Kopiuj tematy` ✅ (już po polsku)
- `Post na social media` ✅ (już po polsku)
- `Kopiuj post na social media` ✅ (już po polsku)
- `Wynik własnego polecenia` ✅ (już po polsku)
- `Kopiuj wynik własnego polecenia` ✅ (już po polsku)

### 8. Bramy dostępu

**src/components/dashboard/TranscriptionForms/forms/UsageGate/UsageGate.tsx**

- Wszystkie teksty już po polsku ✅

### 9. Stałe i komunikaty błędów

**src/components/auth/LoginForm/LoginForm.helpers.ts**

- Komunikaty błędów logowania do przetłumaczenia

**src/components/settings/ApiKeyForm/ApiKeyForm.helpers.ts**

- Komunikaty ładowania i sukcesu do przetłumaczenia

**src/lib/actions/register.ts**

- Komunikaty błędów rejestracji do przetłumaczenia

**src/lib/actions/usage.ts**

- Komunikaty błędów związanych z użyciem do przetłumaczenia

### 10. Komponenty pomocnicze

**src/components/common/SubmitButton.tsx**

- Sprawdzić czy wszystkie teksty są po polsku

**src/components/common/CopyButton.tsx**

- Sprawdzić komunikaty kopiowania

**src/components/common/form/ControlledInput.tsx**

- Sprawdzić komunikaty walidacji

## Algorytm implementacji

### Faza 1: Metadane i SEO

1. Zaktualizować wszystkie tytuły stron i opisy meta
2. Sprawdzić i zaktualizować Open Graph i Twitter Card metadata
3. Upewnić się, że lang='pl' jest ustawione we wszystkich miejscach

### Faza 2: Nawigacja i układ

1. Przetłumaczyć wszystkie elementy nawigacji
2. Zaktualizować menu użytkownika
3. Przetłumaczyć przyciski akcji (logowanie, wylogowanie)

### Faza 3: Formularze uwierzytelniania

1. Przetłumaczyć wszystkie etykiety pól
2. Zaktualizować komunikaty błędów
3. Przetłumaczyć komunikaty sukcesu i ładowania

### Faza 4: Dashboard i formularze główne

1. Sprawdzić i dopracować istniejące polskie tłumaczenia
2. Przetłumaczyć pozostałe angielskie teksty w formularzach
3. Zaktualizować komunikaty walidacji

### Faza 5: Ustawienia i konfiguracja

1. Przetłumaczyć wszystkie instrukcje API
2. Zaktualizować komunikaty związane z BYOK
3. Przetłumaczyć dodatkowe informacje i zasoby

### Faza 6: Komunikaty systemowe

1. Przetłumaczyć wszystkie komunikaty błędów
2. Zaktualizować komunikaty ładowania
3. Przetłumaczyć komunikaty sukcesu

### Faza 7: Testowanie i weryfikacja

1. Przejść przez całą aplikację i sprawdzić wszystkie teksty
2. Przetestować wszystkie ścieżki użytkownika
3. Sprawdzić poprawność gramatyczną i stylistyczną

## Pliki pomocnicze do utworzenia/zaktualizowania

1. **src/lib/constants/messages.ts** - Centralne miejsce dla wszystkich komunikatów
2. **src/lib/constants/labels.ts** - Centralne miejsce dla wszystkich etykiet
3. **src/lib/constants/errors.ts** - Centralne miejsce dla wszystkich komunikatów błędów

## Uwagi techniczne

- Wszystkie zmiany powinny zachować istniejącą funkcjonalność
- Należy zachować spójność terminologii w całej aplikacji
- Komunikaty błędów powinny być pomocne i zrozumiałe dla użytkownika
- Należy sprawdzić poprawność polskich znaków diakrytycznych
- Wszystkie tłumaczenia powinny być naturalne i idiomatyczne
