# Progress Tracker — QuranMind

Update this file after every meaningful implementation change.

## Current Phase

**Foundation Setup**

Initializing project infrastructure: database schema, authentication, Quran data loading, and core UI framework.

## Current Goal

Set up the tech stack (Next.js 16, Neon + Better Auth, Quran data loader) and create the workspace layout with sidebar, AI agent chat, Quran Viewer stub, and analysis panel stub.

## Completed

- Created context folder with project specifications
- Updated all context files to match QuranMind scope and features
- Project stack decided: Next.js 16, Neon PostgreSQL, Better Auth, Vercel AI SDK

## In Progress

- Phase 1 workspace foundation is implemented as a demo: sample Quran data, deterministic analysis utilities, and connected research workspace UI.

- Production persistence, Better Auth, and AI SDK wiring remain for the next implementation milestone.

## Next Up

### Phase 1: Project Foundation (Sessions 1–2) — Demo foundation complete

- Added `/workspace` three-panel research workspace with connected verse selection, search, prompt interactions, and computed evidence.
- Added immutable sample Quran records in `lib/quran/sample-data.ts`.
- Added deterministic Arabic normalization and letter/word analysis in `lib/quran/analysis.ts`.

### Phase 1 Production Follow-up

1. **Initialize Tech Stack**
   - Set up Next.js 16 with TypeScript, Tailwind, shadcn/ui
   - Install dependencies: @vercel/ai, better-auth, @neondatabase/serverless, drizzle-orm
   - Create Neon database and initialize Better Auth schema

2. **Quran Data & Core Utilities**
   - Import/create Quran text data (Arabic + transliteration + morphology)
   - Build `lib/quran/` utilities for verse lookup, search, morphology access
   - Create analysis helper functions for letter/word counting and normalization

3. **Authentication & Layout**
   - Set up Better Auth with email/password
   - Create root layout with global UI structure
   - Build collapsible sidebar with main navigation items
   - Create placeholder panels for Quran Viewer and analysis

4. **AI Agent Chat Interface**
   - Create `/app/workspace/` page with three-column layout
   - Build AI chat component with streaming responses (Vercel AI SDK)
   - Wire up basic message history and display

### Phase 2: Quran Viewer (Sessions 3–4)

5. Build interactive Quran Viewer with surah/ayah navigation
6. Add verse search and highlighting
7. Implement word selection with morphology display
8. Create bookmarking and note system

### Phase 3: AI Analysis Integration (Sessions 5–6)

9. Build analysis tools: letter counting, pattern detection, verse comparison
10. Wire AI agent to trigger analysis functions and display results
11. Implement evidence panel with verification status display

### Phase 4: Research Organization (Sessions 7–8)

12. Create project management system (CRUD)
13. Build evidence collection and organization UI
14. Add statistics and insights dashboard

## Open Questions

- Should we pre-load all Quran data at startup or fetch on-demand? (Decision: Pre-load for instant search)
- How to handle different Quran translations? (Decision: Start with Arabic + English, extend later)
- Should analysis results cache in the database or compute fresh? (Decision: Compute on-demand for now, cache only expensive operations)
- UI layout on smaller screens? (Decision: Desktop-first tool, no responsive mobile for now)

## Architecture Decisions

### Data Model
- **Quran Data**: Immutable JSON loaded at startup, accessed via utility functions in `lib/quran/`
- **User Data**: PostgreSQL (Neon) with Drizzle ORM
- **Analysis Results**: Computed on-demand, optionally cached if expensive

### Authentication
- **Approach**: Better Auth with email + password
- **Why**: Simpler than Clerk for internal research tool, built for Neon, no OAuth complexity initially

### AI Agent
- **Framework**: Vercel AI SDK (streamText with tool calling)
- **Why**: Tight integration with Next.js, streaming support, tool calling for analysis functions

### Frontend Architecture
- **Layout**: Three-panel workspace (sidebar, chat, Quran Viewer + analysis)
- **State**: Server components for data, client components for interactivity
- **Theme**: Dark-only with premium research aesthetic

## Session Notes

**For next session:**
- Reference `quranmind-build-plan.md` for full feature specifications
- All context files now aligned with QuranMind scope
- Ready to begin Phase 1 implementation: tech setup and foundation
- Focus on getting basic workspace layout and AI chat working before advanced features
