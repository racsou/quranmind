# QuranMind — Workspace & Evidence Graph System Architecture

## Executive Summary & Architectural Evaluation

This document defines the architectural blueprint to implement the **3-Pane Unified Quran Workspace & Evidence Graph System** in QuranMind:

```
                           QURAN WORKSPACE
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
    Quran Pane                 AI Agent               Research Graph
        │                         │                         │
   Uthmani text              ┌────┴────┐               Verse nodes
   word selection            │         │               Root links
   tafsir                   Search   Tools             Themes
   audio                    RAG      Counts            Similarity
        │                    │         │                    │
        └────────────────────┼─────────┼────────────────────┘
                             │
                      EVIDENCE LAYER
                             │
       ┌─────────────────────┼─────────────────────┐
       ↓                     ↓                     ↓
   Quran text              Roots                 Tafsir
   morphology              lexicons              sources
       │                     │                     │
       └─────────────────────┼─────────────────────┘
                             ↓
                        AI reasoning
                             ↓
                     Answer + citations
```

---

## 1. Architectural Compatibility & Review: Does it Cross-Pass?

### Verdict: **Zero Conflict — Complete Synergistic Evolution**
The proposed system does **not** cross-pass, conflict, or invalidate any part of our existing implementation. On the contrary, it represents the **exact target topology** toward which our earlier work was built:

1. **The Quran Pane** is already 100% created:
   - `Uthmani text`: Official King Fahd Complex Hafs font (`public/fonts/UthmanicHafs_V22.woff2`).
   - `word selection`: Interactive word token chips launching `WordConcordanceModal`.
   - `tafsir`: Classical Ibn Kathir, Al-Jalalayn, Asbab al-Nuzul in `lib/quran/tafsir-hadith.ts`.
   - `audio`: Multi-reciter streaming CDN player in `components/audio-reciter.tsx`.

2. **The AI Agent & Tools** are already built in the core:
   - `Search & RAG`: Full-text search and cached semantic retrieval across 6,236 verses.
   - `Tools & Counts`: Deterministic calculations for Abjad Gematria, letter counts, word counts, and palindromic symmetry matching.
   - `Evidence Citations`: The `/api/agent` route already formats answers with summary points, symmetry insights, and verse citations.

3. **The Evidence Layer** is already codified:
   - `Quran text & morphology`: `lib/quran/quran-data.ts` and `lib/quran/morphology.ts`.
   - `Roots & lexicons`: Trilateral root map, `matching-ayah.json`, and `phrases.json`.
   - `Tafsir & Hadith sources`: `lib/quran/tafsir-hadith.ts` with Bukhari/Muslim Isnads.

4. **The New Deliverable to Implement**:
   - **The Research Graph Pane**: An interactive visual Knowledge Graph rendering Verse nodes, Root links, Themes, and Similarity edges in real-time, bi-directionally synchronized with the Quran Pane and the AI Agent.

---

## 2. Component-by-Component Specifications

### A. Top Layer: The Tri-Pane Quran Workspace

The workspace layout is structured as a responsive, synchronized 3-pane viewport:

```
+-----------------------------------------------------------------------------------------------+
| TOP BAR: Project Context | Normalization Mode | Manuscripts Modal | Dossier Export | Auth Profile|
+------------------------------+-------------------------------+--------------------------------+
| PANE 1: QURAN PANE           | PANE 2: AI AGENT PANE         | PANE 3: RESEARCH GRAPH PANE    |
| (Source & Interaction)       | (Reasoning & Inquiry)         | (Topological Knowledge Map)   |
|                              |                               |                                |
| • Surah / Ayah Selector      | • Chat History & Prompts      | • Force-Directed Node Graph    |
| • Uthmanic Verse Text        | • Natural Language Query Box  | • Verse Nodes (Cyan)           |
| • Clickable Word Tokens      | • Tool Execution Traces       | • Root Nodes (Emerald)         |
| • Audio Reciter (3 Reciters) | • Epistemic Classification    | • Theme Clusters (Amber)       |
| • Tafsir & Asbab al-Nuzul    | • Grounded Answer & Citations | • Cross-Verse Similarity Edges |
| • Verse Relationship Stats   | • "Save Evidence" to Neon     | • Zoom, Pan, Node-Click Focus  |
+------------------------------+-------------------------------+--------------------------------+
| BOTTOM STATUS: Redis Cache Connected | Neon Database Active | Supabase Storage Ready          |
+-----------------------------------------------------------------------------------------------+
```

---

### B. Pane 1: Quran Pane Detailed Contract

- **Uthmani Text Rendering**:
  - Direct rendering of QPC Hafs Unicode text with the custom font face `UthmanicHafs`.
- **Word Selection (Morphology)**:
  - Splitting `verse.text` into individual clickable spans.
  - Hover effect with turquoise glow (`#00d4ff`).
  - Clicking any token queries the Morphology Engine:
    ```typescript
    export interface WordMorphologyToken {
      word: string
      root: string
      abjad: number
      occurrencesCount: number
      sampleVerses: Array<{ surah: number; ayah: number; text: string }>
    }
    ```
- **Tafsir & Hadith Context**:
  - Accessible via inline drawer or tab showing classical scholarship (Ibn Kathir, Jalalayn) alongside Hadith isnads.
- **Synchronized Audio**:
  - EveryAyah CDN stream with Mishary Alafasy, Al-Husary, or Abdulbasit.
  - Auto-scroll and auto-advance synchronization.

---

### C. Pane 2: AI Agent & Reasoning Engine

- **Search (RAG)**:
  - Multi-tiered lookup:
    1. Direct canonical verse key (e.g. `21:30`, `36:40`).
    2. Exact Arabic substring and normalized search.
    3. Structural n-gram phrase matches from `phrases.json`.
    4. Classical Tafsir & Hadith keyword correlation.
- **Deterministic Tools Execution**:
  - `calculateAbjad(text)`: Mashriqi Gematria system.
  - `checkSymmetry(text)`: Letter-by-letter forward and reverse alignment.
  - `countFrequencies(text)`: Character frequency histogram.
  - `extractRoot(word)`: Trilateral morphological root deduction.
- **Reasoning Invariant**:
  - The agent never generates unverified speculative claims. Every claim must belong to one of 5 strict epistemic categories:
    `verified` | `scientifically_supported` | `possible_correspondence` | `hypothesis` | `unsupported`.
- **Grounded Citations**:
  - Structured output with Surah number, Ayah number, exact Arabic text, and matched evidence item.

---

### D. Pane 3: Research Graph (The Knowledge Graph Visualizer)

The visual topological graph acts as a spatial mind-map of Quranic interconnectedness:

#### 1. Graph Data Model
```typescript
export interface GraphNode {
  id: string // e.g. "v:21:33" | "r:فلك" | "t:cosmology"
  label: string // e.g. "الأنبياء 33" | "جذر فلك" | "علم الفلك"
  type: 'verse' | 'root' | 'theme' | 'concept'
  data: {
    surah?: number
    ayah?: number
    text?: string
    root?: string
    count?: number
  }
}

export interface GraphEdge {
  id: string
  source: string // Node ID
  target: string // Node ID
  type: 'root_link' | 'similarity' | 'thematic' | 'palindromic'
  weight?: number // e.g. similarity percentage (0.0 to 1.0)
  label?: string
}

export interface ResearchGraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}
```

#### 2. Visual Attributes & Semantics
- **Verse Nodes** (Color: `#00d4ff` Electric Cyan):
  - Size proportional to degree (number of connected themes, similarity edges, and roots).
  - Hover shows verse preview snippet.
  - Click selects verse in Quran Pane and updates Agent context.
- **Root Nodes** (Color: `#10b981` Emerald Green):
  - Central hubs connecting multiple verses that share the same morphological root (e.g. root `ف-ل-ك` connecting 21:33, 36:40, 2:164).
- **Theme Nodes** (Color: `#f59e0b` Amber Gold):
  - Connects verses addressing common subjects (e.g. `cosmology`, `water_and_life`, `palindromic_symmetry`).
- **Similarity Edges** (Color: `#38bdf8` dashed lines):
  - Ingested directly from `matching-ayah.json` (1,162 pre-calculated similarity pairs).
  - Edge thickness corresponds to text overlap score.

#### 3. Interactive Controls
- **Graph Filter Bar**: Toggle visibility of Verse Nodes, Root Links, Themes, or Similarity Edges.
- **Node Search**: Instant highlight of any root or verse in the visual canvas.
- **Radial / Force Layout**: Smooth spring-embedded physics with zoom, pan, and node dragging.

---

### E. The Evidence Layer

The foundational data substrate powering all three panes:

```
                          EVIDENCE LAYER
                                 │
    ┌────────────────────────────┼────────────────────────────┐
    ↓                            ↓                            ↓
1. Quran Text & Morphology   2. Roots & Lexicons          3. Tafsir & Hadith
   • 6,236 Hafs Verses          • Trilateral Roots Map       • Ibn Kathir Commentary
   • 4 Normalization Modes      • matching-ayah.json         • Jalalayn Lexical Notes
   • Letter/Word Counts         • phrases.json n-grams       • Asbab al-Nuzul Context
   • Abjad Numerical Weights    • Root Concordance Graph     • Bukhari/Muslim Isnads
```

- **Persistence Integration**:
  - Backed by **Neon PostgreSQL** via Drizzle ORM (`evidence_items` table).
  - Caching via **Docker Redis** (`redis:7-alpine`) on port 6379 for sub-millisecond graph query responses.
  - Document & Dossier Exports stored in **Supabase Cloud Storage** (`research-exports` bucket).

---

## 3. Implementation Status (All Steps Completed)

### Step 1: Research Graph Data Generator (`lib/quran/research-graph.ts`) [x] COMPLETED
- [x] Function `buildVerseResearchGraph(surah, ayah)` extracts center verse, roots, themes, and similarity edges.
- [x] Integrated trilateral root extraction and `matching-ayah.json` similarity scores.
- [x] Node and edge weighting and degree calculations for visual scaling.

### Step 2: Graph API Endpoint (`app/api/quran/graph/route.ts`) [x] COMPLETED
- [x] `GET /api/quran/graph?surah=X&ayah=Y` operational.
- [x] Cached in Docker Redis (`redisCache.getOrSet`) with in-memory fallback.

### Step 3: Interactive Visual Graph Component (`components/research-graph.tsx`) [x] COMPLETED
- [x] High-performance SVG canvas with radial concentric orbits and grid background.
- [x] Verses (cyan), Roots (emerald), and Themes (amber) color-coded with badges.
- [x] Zoom in, Zoom out, Pan, and Reset View controls.
- [x] Filter toggles: `[الآيات] [الجذور] [الموضوعات]`.
- [x] Click-to-focus event triggering `onSelectVerse(surah, ayah)`.
- [x] Root click triggering `onSelectRoot(root)` concordance explorer.

### Step 4: Tri-Pane Workspace Integration (`components/research-workspace.tsx`) [x] COMPLETED
- [x] Column 1: Quran Pane (Uthmanic text, clickable word tokens, tafsir, audio reciter, manuscripts, dossier exporter).
- [x] Column 2: AI Agent (search, tools, Abjad, symmetry, citations).
- [x] Column 3: Research Graph & Evidence Pane with toggle between visual Research Graph and detailed math cards.
- [x] Bi-directional synchronization: clicking nodes in graph updates the Quran Pane and Agent context.

---

## 4. Verification and Non-Regression Criteria

1. **Zero Text Mutation**: Quranic text must remain strictly readonly and byte-identical to official Medina Hafs.
2. **Deterministic Calculations**: Abjad calculations and symmetry ratios must remain 100% deterministic with zero floating math errors.
3. **Responsive Degradation**: On mobile/tablet screens, the 3 panes collapse gracefully into high-speed tabs `[المصحف] [الوكيل الذكي] [شبكة المعرفة]`.
4. **Build Integrity**: Clean build passing `npx tsc --noEmit` and `npm run build` with 0 warnings or errors.
