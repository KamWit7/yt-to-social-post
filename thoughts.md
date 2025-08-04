Oczywiście. Poniżej znajduje się finalna wersja pliku `plan.md`. Sekcja dotycząca użycia komponentu `MindMapDisplay` jest zawarta w podpunkcie **3.4** i pokazuje, jak zintegrować go w komponencie `TranscriptionResults.tsx`.

---

````markdown
# Plan Implementacji: Inteligentny Procesor Transkrypcji YouTube

## 1. Przegląd Projektu

Celem projektu jest rozbudowa istniejącej aplikacji w **Next.js**, która przyjmuje transkrypcję z filmu na YouTube i przetwarza ją za pomocą **AI (Google Gemini)**. Aplikacja będzie generować różne typy treści w zależności od celu wybranego przez użytkownika, takie jak streszczenia, listy tematów, mapy myśli w formacie JSON oraz posty na media społecznościowe.

---

## 2. Wymagania Funkcjonalne

### 2.1. Interfejs Użytkownika (UI)

- **Główny komponent wejściowy**: Istniejące pole tekstowe (`<textarea>`) do wklejenia transkrypcji wideo.
- **Wybór celu**: Pole wyboru (`<select>`) z następującymi opcjami:
  - `Do nauki`
  - `Do tworzenia treści`
  - `Ogólne`
- **Opcje warunkowe**: Po wybraniu celu, dynamicznie pojawia się dodatkowa opcja:
  - **Dla `Do nauki`**: Checkbox "☑️ Wygeneruj mapę myśli".
  - **Dla `Do tworzenia treści`**: Checkbox "☑️ Wygeneruj post na social media".
  - **Dla `Ogólne`**: Pole tekstowe do wpisania własnego polecenia dla AI.
- **Wyświetlanie wyników**: Istniejąca sekcja na wyniki, która będzie renderować wygenerowane treści. Każdy element (streszczenie, tematy, etc.) powinien mieć swój nagłówek i wyraźnie oddzieloną treść.

### 2.2. Generowane Treści

- **Zawsze generowane (niezależnie od celu)**:
  1.  **Streszczenie**: Zwięzły akapit podsumowujący treść.
  2.  **Tematy**: Lista punktowana kluczowych zagadnień.
- **Generowane opcjonalnie**:
  - **Mapa myśli**: Zwracana w formacie **JSON** do dalszego wykorzystania.
  - **Post na social media**: Gotowy tekst posta w stylu platformy LinkedIn.
  - **Wynik niestandardowy**: Tekst wygenerowany na podstawie polecenia użytkownika.

---

## 3. Architektura Techniczna

### 3.1. Frontend (Next.js / React)

- **Zarządzanie stanem**:
  - Zarządzanie stanem formularza za pomocą biblioteki **React Hook Form** (`useForm`). Będzie ona odpowiedzialna za obsługę i walidację wszystkich pól (transkrypcja, selektor celu, checkboxy, pole tekstowe).
  - **React Query** do zarządzania stanem zapytań API (ładowanie, błędy, dane, buforowanie), co ułatwi obsługę równoległych zapytań.
- **Modyfikacja istniejących komponentów**:
  - `TranscriptionForm.tsx`: Należy zaktualizować ten formularz, dodając logikę wyboru celu i warunkowego wyświetlania opcji (checkboxów, pola tekstowego) w ramach `react-hook-form`.
  - `TranscriptionResults.tsx`: Należy dostosować ten komponent do renderowania wielu różnych wyników (streszczenie, tematy, etc.) oraz obsługi stanów ładowania i błędów dla każdego z nich osobno.

### 3.2. Backend (Next.js API Routes)

- **Główny endpoint**: Należy utworzyć endpoint API, np. `POST /api/process`.
- **Logika**: Endpoint ten będzie bramą (gateway) do API Google Gemini. Będzie on odpowiedzialny za:
  1.  Odebranie transkrypcji i parametrów od klienta.
  2.  Bezpieczne dołączenie klucza API z zmiennych środowiskowych.
  3.  Wysłanie **kilku oddzielnych, równoległych zapytań** do Gemini API dla każdego żądanego zadania (np. za pomocą `Promise.all`).
  4.  Zebranie odpowiedzi i odesłanie ich do klienta w ustrukturyzowanej formie.

### 3.3. Integracja z AI

- **Dostawca**: **Google**.
- **Model**: **Gemini**. Rekomenduje się użycie:
  - `Gemini 1.5 Flash` dla prostszych zadań (streszczenie, tematy, post) ze względu na szybkość i niski koszt.
  - `Gemini 1.5 Pro` dla zadania generowania mapy myśli w JSON ze względu na wyższą precyzję.
- **Klucz API**: Klucz do API Google musi być przechowywany **wyłącznie po stronie serwera** w zmiennych środowiskowych (plik `.env.local`).

### 3.4. Implementacja Komponentu Mapy Myśli

#### Instalacja

```bash
npm install reactflow
```
````

#### Kod Komponentu (`components/MindMapDisplay.tsx`)

```typescript
import React, { useEffect, useState } from 'react'
import ReactFlow, {
  Controls,
  Background,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'

// Definicja typów dla danych przychodzących z naszego API
interface ApiNode {
  id: string
  label: string
}

interface ApiEdge {
  from: string
  to: string
}

interface MindMapData {
  nodes: ApiNode[]
  edges: ApiEdge[]
}

interface MindMapDisplayProps {
  mindMapData: MindMapData | null
}

const getLayoutedElements = (apiNodes: ApiNode[], apiEdges: ApiEdge[]) => {
  const initialNodes: Node[] = []
  const initialEdges: Edge[] = []

  apiEdges.forEach((edge) => {
    initialEdges.push({
      id: `e-${edge.from}-${edge.to}`,
      source: edge.from,
      target: edge.to,
      animated: true,
    })
  })

  const nodeLevels: { [key: string]: number } = {}
  const nodesByLevel: { [key: number]: string[] } = {}

  const roots = apiNodes.filter((n) => !apiEdges.some((e) => e.to === n.id))
  roots.forEach((r) => {
    nodeLevels[r.id] = 0
    if (!nodesByLevel[0]) nodesByLevel[0] = []
    nodesByLevel[0].push(r.id)
  })

  let level = 0
  while (nodesByLevel[level] && nodesByLevel[level].length > 0) {
    nodesByLevel[level].forEach((nodeId) => {
      apiEdges
        .filter((e) => e.from === nodeId)
        .forEach((childEdge) => {
          if (nodeLevels[childEdge.to] === undefined) {
            const nextLevel = level + 1
            nodeLevels[childEdge.to] = nextLevel
            if (!nodesByLevel[nextLevel]) nodesByLevel[nextLevel] = []
            nodesByLevel[nextLevel].push(childEdge.to)
          }
        })
    })
    level++
  }

  apiNodes.forEach((node) => {
    const level = nodeLevels[node.id] || 0
    const levelNodes = nodesByLevel[level] || []
    const nodeIndex = levelNodes.indexOf(node.id)

    initialNodes.push({
      id: node.id,
      data: { label: node.label },
      position: {
        x: level * 250,
        y: nodeIndex * 100,
      },
    })
  })

  return { initialNodes, initialEdges }
}

export const MindMapDisplay: React.FC<MindMapDisplayProps> = ({
  mindMapData,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  useEffect(() => {
    if (mindMapData && mindMapData.nodes && mindMapData.edges) {
      const { initialNodes, initialEdges } = getLayoutedElements(
        mindMapData.nodes,
        mindMapData.edges
      )
      setNodes(initialNodes)
      setEdges(initialEdges)
    }
  }, [mindMapData, setNodes, setEdges])

  if (!mindMapData) {
    return null
  }

  return (
    <div
      style={{
        height: '600px',
        width: '100%',
        border: '1px solid #ddd',
        borderRadius: '8px',
      }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  )
}
```

#### Użycie

```typescript
// w pliku TranscriptionResults.tsx
import { MindMapDisplay } from './MindMapDisplay';

// ... wewnątrz komponentu TranscriptionResults

// Załóżmy, że `data` to wynik z React Query, zgodny ze schematem z naszej specyfikacji
const { data, isLoading, isError } = useQuery(...);

// ...

{data?.mindMap && (
  <div>
    <h3>Mapa Myśli</h3>
    <MindMapDisplay mindMapData={data.mindMap} />
  </div>
)}
```

---

## 4\. Schematy Danych i Prompty

### 4.1. Schemat Danych

- **Request do `/api/process` (ciało zapytania)**:
  ```json
  {
    "transcript": "string",
    "purpose": "'Do nauki' | 'Do tworzenia treści' | 'Ogólne'",
    "options": {
      "generateMindMap": "boolean",
      "generateSocialPost": "boolean",
      "customPrompt": "string | null"
    }
  }
  ```
- **Response z `/api/process`**:
  ```json
  {
    "summary": "string | null",
    "topics": "string | null",
    "mindMap": "object | null",
    "socialPost": "string | null",
    "customOutput": "string | null"
  }
  ```
- **Schemat JSON dla Mapy Myśli**:
  ```json
  {
    "nodes": [{ "id": "string", "label": "string" }],
    "edges": [{ "from": "string", "to": "string" }]
  }
  ```

### 4.2. Treści Promptów

1.  **Streszczenie**: `Streszcz kluczowe informacje z poniższej transkrypcji w maksymalnie 5 zwięzłych zdaniach. Transkrypcja: "${transkrypcja}"`
2.  **Tematy**: `Wypisz w formie prostej listy (używając myślników) od 5 do 7 głównych tematów lub zagadnień poruszonych w poniższej transkrypcji. Transkrypcja: "${transkrypcja}"`
3.  **Mapa myśli (JSON)**: `Przeanalizuj poniższą transkrypcję i wygeneruj mapę myśli reprezentującą jej strukturę. Zwróć odpowiedź WYŁĄCZNIE w formacie JSON, bez żadnego dodatkowego tekstu. JSON musi być poprawny i gotowy do parsowania. Użyj następującej struktury: { "nodes": [...], "edges": [...] }. Transkrypcja: "${transkrypcja}"`
4.  **Post na social media**: `Zachowuj się jak ekspert od marketingu w social mediach. Na podstawie poniższej transkrypcji napisz krótki, angażujący post na platformę LinkedIn. Użyj profesjonalnego, ale przystępnego języka. Dodaj 3-4 relevantne hasztagi. Transkrypcja: "${transkrypcja}"`

---

## 5\. Obsługa Błędów

- **Frontend**:
  - Należy zaimplementować UI dla stanów ładowania (np. spinnery dla każdej sekcji wyników) oraz błędów, korzystając ze stanów dostarczanych przez React Query.
  - Jeśli jedno z zapytań (np. o mapę myśli) się nie powiedzie, pozostałe wyniki (streszczenie, tematy) powinny zostać normalnie wyświetlone, a w miejscu nieudanego elementu powinien pojawić się komunikat o błędzie.
  - Walidacja formularza po stronie klienta za pomocą `react-hook-form` (np. czy pole transkrypcji nie jest puste).
- **Backend (`/api/process`)**:
  - Walidacja przychodzących danych.
  - Obsługa błędów z API Gemini: endpoint powinien przechwytywać błędy (np. błąd autoryzacji `401`, błąd serwera Gemini `5xx`) i zwracać odpowiednie statusy HTTP.
  - Należy opakować każde zapytanie do Gemini w `try...catch`, aby awaria jednego z nich nie przerwała całego procesu i można było zwrócić częściowe dane.

<!-- end list -->

```

```
