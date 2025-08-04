Świetnie, przejdźmy do fazy wykonawczej. Poniżej znajduje się szczegółowy plan budowy projektu, podzielony na małe, iteracyjne kroki. Po planie znajdziesz serię gotowych promptów dla modelu LLM generującego kod, które krok po kroku zaimplementują cały projekt.

---

## **Blueprint Projektu: Od Szkieletu do Pełnej Funkcjonalności**

### **Etap 1: Fundamenty i Szkielet UI**

- **Cel:** Stworzenie podstawowych, statycznych komponentów interfejsu bez żadnej logiki.
- **Kroki:**
  1.  Utworzenie komponentu formularza (`TranscriptionForm.tsx`).
  2.  Utworzenie komponentu do wyświetlania wyników (`TranscriptionResults.tsx`).
  3.  Złożenie obu komponentów na stronie głównej.

### **Etap 2: Logika Formularza i Interaktywność UI**

- **Cel:** Ożywienie formularza za pomocą zarządzania stanem i logiki warunkowej.
- **Kroki:**
  1.  Integracja `react-hook-form` z `TranscriptionForm`.
  2.  Dodanie selektora celu (`purpose`).
  3.  Implementacja logiki warunkowej, która pokazuje/ukrywa dodatkowe opcje (checkboxy, pole tekstowe) w zależności od wybranego celu.

### **Etap 3: Szkielet Backendu (Mock API)**

- **Cel:** Stworzenie endpointu API, który na razie będzie zwracał fałszywe, statyczne dane. To pozwoli na rozwój frontendu niezależnie od AI.
- **Kroki:**
  1.  Utworzenie pliku API Route (`/api/process`).
  2.  Zaimplementowanie w nim logiki, która na żądanie `POST` zwraca predefiniowany obiekt JSON z przykładowym streszczeniem i tematami.

### **Etap 4: Połączenie Frontend-Backend**

- **Cel:** Sprawienie, by frontend komunikował się z naszym backendem (nadal używającym mock danych).
- **Kroki:**
  1.  Konfiguracja `React Query` w aplikacji.
  2.  Użycie hooka `useMutation` w `TranscriptionForm` do wysyłania danych do `/api/process`.
  3.  Przekazanie stanu zapytania (`data`, `isLoading`, `isError`) do `TranscriptionResults`.
  4.  Wyświetlenie mock danych, stanu ładowania lub błędu w `TranscriptionResults`.

### **Etap 5: Integracja z AI (Prawdziwy Backend)**

- **Cel:** Zastąpienie mock danych w API prawdziwymi wywołaniami do Google Gemini.
- **Kroki:**
  1.  Instalacja SDK Google AI i konfiguracja klucza API w zmiennych środowiskowych.
  2.  Modyfikacja API Route `/api/process` w celu parsowania żądania.
  3.  Implementacja logiki do równoległego wywoływania Gemini z odpowiednimi promptami.
  4.  Składanie odpowiedzi od AI i odsyłanie ich do frontendu.

### **Etap 6: Implementacja Wizualizacji Mapy Myśli**

- **Cel:** Stworzenie i zintegrowanie komponentu, który potrafi zwizualizować dane JSON jako graf.
- **Kroki:**
  1.  Instalacja `reactflow`.
  2.  Stworzenie komponentu `MindMapDisplay.tsx` z gotowym kodem (zawierającym funkcję do automatycznego układu).
  3.  Warunkowe renderowanie `MindMapDisplay` w `TranscriptionResults`, gdy API zwróci dane mapy myśli.

---

## **Prompty dla Modelu Generującego Kod**

Poniżej znajduje się seria promptów. Każdy z nich należy przekazać do modelu LLM w osobnej interakcji, aby iteracyjnie budować aplikację.

### **Prompt 1: Tworzenie Szkieletu UI**

```text
Użyj TypeScript i Next.js. Stwórz podstawowy szkielet aplikacji.

1.  Stwórz komponent w pliku `components/TranscriptionForm.tsx`. Powinien on renderować formularz (`<form>`) zawierający pole tekstowe (`<textarea>`) z etykietą "Wklej transkrypcję" oraz przycisk (`<button>`) z napisem "Generuj".
2.  Stwórz komponent w pliku `components/TranscriptionResults.tsx`. Na razie powinien on renderować tylko `<div>` z tekstem "Tutaj pojawią się wyniki...".
3.  W głównym pliku strony (`app/page.tsx`), zaimportuj i wyrenderuj oba komponenty: najpierw `TranscriptionForm`, a pod nim `TranscriptionResults`. Użyj podstawowego stylowania, aby oddzielić komponenty.
```

### **Prompt 2: Implementacja Logiki Formularza**

```text
Będziemy bazować na kodzie z poprzedniego kroku.

1.  Zainstaluj `react-hook-form` (`npm install react-hook-form`).
2.  Zmodyfikuj komponent `components/TranscriptionForm.tsx`, aby używał `react-hook-form` do zarządzania stanem formularza.
3.  Dodaj do formularza pole `<select>` z etykietą "Wybierz cel" i `name="purpose"`. Powinno ono zawierać opcje zdefiniowane w `PURPOSE_OPTIONS` z naszej specyfikacji (`Do nauki`, `Do pracy`, `Do tworzenia treści`, `Ogólne`, `Inny`).
4.  Dodaj logikę warunkową:
    * Użyj hooka `watch` z `react-hook-form`, aby obserwować zmiany w polu "purpose".
    * Jeśli wybrana jest opcja "Do nauki", pod spodem powinien pojawić się checkbox (`<input type="checkbox">`) z etykietą "Wygeneruj mapę myśli" i `name="options.generateMindMap"`.
    * Jeśli wybrana jest opcja "Do tworzenia treści", powinien pojawić się checkbox z etykietą "Wygeneruj post na social media" i `name="options.generateSocialPost"`.
    * Jeśli wybrana jest opcja "Ogólne", powinno pojawić się pole tekstowe (`<input type="text">`) z etykietą "Twoje polecenie" i `name="options.customPrompt"`.
```

### **Prompt 3: Stworzenie Mock API**

````text
Stwórz Next.js API Route w pliku `pages/api/process.ts`.

1.  Endpoint powinien obsługiwać tylko metodę `POST`.
2.  Gdy otrzyma żądanie, powinien zignorować jego treść i po prostu zwrócić status `200` oraz statyczny obiekt JSON o następującej strukturze:

```json
{
  "summary": "To jest przykładowe streszczenie wygenerowane przez mock API.",
  "topics": "- Pierwszy temat poruszony w filmie.\n- Drugi, równie ważny temat.",
  "mindMap": null,
  "socialPost": null,
  "customOutput": null
}
````

````

### **Prompt 4: Połączenie Frontend-Backend z React Query**

```text
Będziemy bazować na kodzie z poprzednich kroków.

1.  Zainstaluj `@tanstack/react-query` (`npm install @tanstack/react-query`).
2.  W głównym pliku aplikacji (`_app.tsx` lub `layout.tsx`), skonfiguruj `QueryClientProvider`, aby był dostępny w całej aplikacji.
3.  Zmodyfikuj `app/page.tsx`. Przenieś logikę stanu zapytania do tego komponentu. Użyj hooka `useMutation` z React Query do obsługi wywołania API do `/api/process`.
4.  W `TranscriptionForm.tsx` funkcja `onSubmit` powinna teraz wywoływać `mutation.mutate(data)`.
5.  Komponent `app/page.tsx` powinien przekazywać stan mutacji (`data`, `isLoading`, `isError`) jako propsy do komponentu `TranscriptionResults.tsx`.
6.  Zmodyfikuj `TranscriptionResults.tsx`, aby renderował:
    * Tekst "Generowanie..." gdy `isLoading` jest `true`.
    * Tekst "Wystąpił błąd." gdy `isError` jest `true`.
    * Dane `summary` i `topics` z obiektu `data`, gdy zapytanie się powiedzie.
````

### **Prompt 5: Implementacja Prawdziwej Logiki AI w Backendzie**

```text
Zmodyfikuj API Route w `pages/api/process.ts`. Zastąpimy mocka prawdziwymi wywołaniami AI.

1.  Zainstaluj SDK Google AI: `npm install @google/generative-ai`.
2.  Zaimportuj SDK. Odczytaj klucz API ze zmiennej środowiskowej `GEMINI_API_KEY`.
3.  Usuń statyczny obiekt JSON. Zamiast tego, odczytaj i sparsuj ciało żądania (`req.body`), które będzie zawierać `transcript`, `purpose` i `options`.
4.  Na podstawie otrzymanych danych, przygotuj listę zapytań do Gemini. Zawsze generuj streszczenie i tematy. Opcjonalne elementy (mapa myśli, post, etc.) dodawaj do listy zadań tylko jeśli użytkownik ich zażądał.
5.  Użyj `Promise.all`, aby równolegle wykonać wszystkie przygotowane zapytania do Gemini, używając promptów z naszej specyfikacji.
6.  Złóż wyniki w jeden obiekt odpowiedzi, zgodny ze schematem, i odeślij go do klienta ze statusem `200`. Dodaj podstawową obsługę błędów `try...catch`.
```

### **Prompt 6: Stworzenie Komponentu Mapy Myśli**

```text
Stwórz nowy, w pełni funkcjonalny komponent do wyświetlania mapy myśli.

1.  Zainstaluj `reactflow`: `npm install reactflow`.
2.  Stwórz plik `components/MindMapDisplay.tsx`.
3.  Wklej do niego kompletny kod z naszej specyfikacji (ten, który zawiera funkcję `getLayoutedElements`, definicje typów i renderuje komponent `<ReactFlow>`). Ten komponent jest gotowy do użycia i nie wymaga modyfikacji.
```

### **Prompt 7: Finalna Integracja Mapy Myśli**

```text
To ostatni krok. Połączymy wszystko w całość. Zmodyfikuj komponent `TranscriptionResults.tsx`.

1.  Zaimportuj komponent `MindMapDisplay` z `./MindMapDisplay`.
2.  Wewnątrz logiki renderowania, poniżej wyświetlania streszczenia i tematów, dodaj nowy blok.
3.  Użyj renderowania warunkowego: jeśli `data` istnieje i `data.mindMap` nie jest `null`, wyrenderuj nagłówek `<h3>Mapa Myśli</h3>` oraz komponent `<MindMapDisplay>`, przekazując do niego dane w propie `mindMapData={data.mindMap}`.
```
