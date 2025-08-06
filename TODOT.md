Jasne, oto lista zadań (to-do list) w formacie Markdown, podsumowująca nasze ustalenia. Możesz jej używać do śledzenia postępów w projekcie.

---

### Lista Zadań: Aplikacja do Podsumowań Transkrypcji z YouTube

#### Etap 1: Fundamenty i MVP (Minimum Viable Product)

- [ ] **Architektura:** przetwarzania AI na backendzie.
- [+] **API Route:** Stworzyć główną logikę aplikacji wewnątrz API Route w Next.js (np. `/pages/api/summarize`).
- [+] **Wybór API AI:** Podjąć decyzję o wyborze API do generowania podsumowań.
  - Opcja A: **Google Gemini API** (dobry darmowy próg na start).
  - Opcja B: **OpenAI API** (dojrzałe i wydajne modele).
- [ ] **Bezpieczeństwo:** Przechowywać klucz do API AI wyłącznie po stronie serwera w zmiennych środowiskowych (`.env.local`).
- [ ] **Logika API Route:**
  - [+] Odbieranie linku do filmu z front-endu.
  - [+] Komunikacja z Twoim backendem w celu pobrania transkrypcji.
  - [ ] Wysłanie transkrypcji do wybranego API AI z odpowiednim promptem.
  - [ ] Odesłanie gotowego podsumowania do front-endu.
- [ ] **Front-end:** Zbudować interfejs do wklejania linku i wyświetlania wyniku.
- [ ] **(Opcjonalnie) Rate Limiting:** Zaimplementować podstawowe ograniczenie liczby zapytań na podstawie adresu IP, aby chronić się przed prostymi nadużyciami.

#### Etap 2: Uwierzytelnianie i Zarządzanie Użytkownikami

- [ ] **Logowanie:** Zintegrować system uwierzytelniania.
  - Sugerowane narzędzia: **NextAuth.js** lub **Clerk**.
- [ ] **Baza Danych:** Podłączyć aplikację do bazy danych (np. PostgreSQL, Supabase, MongoDB).
- [ ] **Model Użytkownika:** Stworzyć w bazie danych tabelę/kolekcję `User` powiązaną z systemem logowania.
- [ ] **Limity Użycia:** Wprowadzić logikę do śledzenia i ograniczania liczby darmowych podsumowań dla każdego zalogowanego użytkownika (np. zapisywać liczbę użyć w bazie danych).

#### Etap 3: Funkcje Zaawansowane - Model "Bring Your Own Key" (BYOK)

- [ ] **Interfejs Użytkownika:** Dodać w panelu użytkownika formularz do wprowadzania i zapisywania własnego klucza API.
- [ ] **Baza Danych:** Zaktualizować model `User`, dodając pole na zaszyfrowany klucz API (np. `encryptedApiKey`).
- [ ] **Szyfrowanie:** Zaimplementować na backendzie logikę do szyfrowania kluczy API przed zapisaniem ich w bazie i deszyfrowania przed użyciem.
- [ ] **Aktualizacja API Route:** Zmodyfikować logikę `/api/summarize`, aby:
  - [ ] Sprawdzała, czy zalogowany użytkownik ma zapisany własny klucz.
  - [ ] Jeśli tak – używała klucza użytkownika.
  - [ ] Jeśli nie – używała domyślnego klucza aplikacji i sprawdzała limity darmowego planu.
- [ ] **Obsługa Błędów:** Rozbudować system obsługi błędów, aby informował użytkownika, jeśli jego własny klucz API jest nieprawidłowy lub przekroczył limit.

Jasne, bazując na Twoich wymaganiach z to-do listy i wybranych przez Ciebie Next.js oraz PostgreSQL, oto rekomendowany, nowoczesny i spójny stack technologiczny, który świetnie sprawdzi się w Twoim projekcie.

Oto zestawienie polecanego stacku:

- **Framework:** Next.js (z App Router)
- **Język:** TypeScript
- **Baza Danych:** PostgreSQL
- **ORM:** Prisma
- **Uwierzytelnianie:** NextAuth.js (Auth.js)
- **Styling:** Tailwind CSS
- **Komponenty UI:** shadcn/ui
- **Deployment:** Vercel (dla aplikacji) + Neon (dla bazy danych)

---

STACK

### ## Framework: Next.js (App Router)

Używasz już Next.js, co jest świetnym wyborem. Rekomenduję skorzystanie z **App Router**, a nie starszego Pages Router. To nowoczesne podejście, które oferuje lepsze zarządzanie stanem ładowania, streaming UI oraz Komponenty Serverowe, idealne do komunikacji z bazą danych i AI.

---

### ## Baza Danych i ORM: PostgreSQL + Prisma

- **PostgreSQL:** Twój wybór, który jest potężną i skalowalną relacyjną bazą danych.
- **ORM - Prisma:** To najlepszy wybór do łączenia Next.js z PostgreSQL.
  - **Dlaczego to dobry wybór?** Prisma oferuje genialne autouzupełnianie i bezpieczeństwo typów dzięki TypeScript. Definiujesz schemat bazy w jednym pliku, a Prisma generuje dla Ciebie w pełni otypowanego klienta do komunikacji z bazą. Niezwykle upraszcza to operacje `CRUD` (Create, Read, Update, Delete) i zarządzanie migracjami bazy danych.

---

### ## Uwierzytelnianie: NextAuth.js (teraz Auth.js)

- **Dlaczego to dobry wybór?** To standard w ekosystemie Next.js do obsługi logowania. Jest elastyczny, darmowy i świetnie integruje się z **Prismą** za pomocą tzw. adapterów. Umożliwia łatwe wdrożenie logowania przez email/hasło oraz dostawców OAuth, takich jak Google czy GitHub, co idealnie pasuje do Etapu 2 Twojego planu.
- **Alternatywa:** **Clerk** – jeśli chcesz jeszcze szybciej wdrożyć gotowe UI do logowania i nie przeszkadza Ci zależność od zewnętrznej usługi.

---

### ## Styling i Komponenty UI: Tailwind CSS + shadcn/ui

- **Tailwind CSS:** To nowoczesne podejście do pisania stylów bezpośrednio w HTML za pomocą klas użytkowych. Znacząco przyspiesza pracę i ułatwia utrzymanie spójnego designu.
- **shadcn/ui:** To nie jest typowa biblioteka komponentów, a raczej zbiór gotowych, w pełni konfigurowalnych komponentów (przyciski, formularze, modale), które wklejasz do swojego projektu.
  - **Dlaczego to dobry wybór?** Masz 100% kontroli nad kodem i wyglądem komponentów, a jednocześnie nie musisz budować wszystkiego od zera. Idealnie współpracuje z Tailwind CSS. Znajdziesz tam gotowe elementy, których potrzebujesz do interfejsu z Etapu 1 i 3.

---

### ## Deployment: Vercel + Neon

- **Vercel:** Platforma stworzona przez twórców Next.js. Deployment jest banalnie prosty (łączy się z Twoim repozytorium Git) i oferuje hojny darmowy plan. Obsługuje bez problemu API Routes i funkcje serwerowe.
- **Neon:** To platforma oferująca bazy danych PostgreSQL w modelu "serverless".
  - **Dlaczego to dobry wybór?** Neon świetnie integruje się z Vercel. Oferuje darmowy plan, automatyczne skalowanie i proste zarządzanie bazą danych, idealne na start projektu.

Ten zestaw narzędzi jest nowoczesny, wydajny, ma ogromne wsparcie społeczności i doskonałą dokumentację, co znacznie ułatwi Ci realizację wszystkich etapów Twojego projektu.
