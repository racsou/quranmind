# Architecture Context — QuranMind

## Stack

| Layer          | Technology                | Role                                              |
| -------------- | ------------------------- | ------------------------------------------------- |
| Framework      | Next.js 16 + TypeScript   | Full-stack app with SSR and API routes            |
| UI             | Tailwind CSS + shadcn/ui  | Premium dark research interface with Arabic fonts |
| AI Agent       | Vercel AI SDK             | Research assistant with streaming and tool calls |
| Database       | Neon (PostgreSQL)         | User data, research projects, notes, evidence     |
| Auth           | Better Auth               | User authentication and session management        |
| Quran Data     | In-memory JSON + indexed  | Quranic text, morphology, cross-references        |
| Analysis       | TypeScript utilities      | Letter counting, pattern detection, statistics   |

## System Boundaries

- `app/` — Next.js routes and layouts (pages, workspace, API)
- `components/` — React components (workspace panels, Quran Viewer, analysis tools, UI)
- `lib/` — Utilities (Quran data access, analysis functions, API helpers, auth)
- `public/` — Static assets (Quran data JSON, fonts, icons)
- `api/` — API routes for AI agent, analysis, and data queries

## Storage Model

- **Database (Neon PostgreSQL)**:
  - Users and authentication (Better Auth tables)
  - Research projects and metadata
  - Bookmarks and highlights
  - Notes and annotations
  - Saved research findings and hypotheses
  - Evidence collection and verification status

- **In-Memory Quran Data**:
  - Full Quranic text in Arabic with translations
  - Word morphology and root information
  - Letter and character data
  - Cross-references between verses
  - Loaded at application startup from JSON

## Auth and Access Model

- Authentication: Users sign in via Better Auth (email + password)
- Ownership: Every research project belongs to a single user
- Access Control: Users can only view and modify their own research projects
- Public Access: Quran data and general analysis tools are accessible to all authenticated users
- Guest Mode: Read-only access to Quran Viewer and analysis tools (no project saving)

## Invariants

1. Quran text and morphological data must never be mutated after application startup — always readonly
2. Every analysis result must explicitly state its category: verified observation, calculation, interpretation, hypothesis, or unverified claim
3. All user research data (projects, bookmarks, notes) must be persisted to the database before considering it saved
4. The AI agent must cite specific verses and show calculation logic — it cannot make assertions without evidence
5. Request handlers must not perform long-running analysis synchronously — defer to background processes or streaming responses for expensive operations
