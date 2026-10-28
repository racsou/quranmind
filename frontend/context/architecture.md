# Architecture Context — QuranMind

## Stack

| Layer          | Technology                     | Role                                                               |
| -------------- | ------------------------------ | ------------------------------------------------------------------ |
| Framework      | Next.js 16 + TypeScript        | Full-stack app with SSR and API routes                             |
| UI             | Tailwind CSS + shadcn/ui       | Eye-friendly white research interface (`#f8fafc`, `#ffffff`, `#0f172a`, Cairo font) |
| Auth           | Clerk (`@clerk/nextjs`)        | User authentication, session management, and route protection     |
| Database       | Neon (PostgreSQL) + Drizzle    | User research projects, hypotheses, evidence items, and bookmarks  |
| Storage/Vector | Supabase (`@supabase/supabase`) | Storage for research exports, evidence attachments, and embeddings |
| Cache & Queue  | Redis (Docker `redis:7-alpine`)| Ultra-fast caching for heavy calculations, symmetry, and agent     |
| Quran Corpus   | QPC Hafs (from `ilm` dataset)  | Complete 114 Surahs (6,236 Ayahs), cross-references & phrases      |
| Analysis       | TypeScript Deterministic Engine| 4-mode Arabic normalization, letter counts, Abjad, symmetry engine |

## System Boundaries

- `app/` — Routing only: thin Next.js App Router pages and route handlers
- `features/` — Feature-based modules ("one file = one task", max ~150 lines/file):
  - `features/dashboard/` — Dashboard shell, sidebar, topbar, tab strip, 3-pane workspace
  - `features/quran/` — Mushaf viewer, audio reciter, root concordance, morphology
  - `features/hadith/` — Hadith studio, Mustalah engine, Isnad breadth classifier
  - `features/agent/` — AI research agent chat, calculations, citations
  - `features/graph/` — Topological research graph visualization and layout
  - `features/projects/` — Projects management, study notes, academic dossier export
  - `features/payments/` — SlickPay and Stripe checkout modals and gateways
  - `features/settings/` — Profile, security, billing, sessions management
  - `features/admin/` — Admin dashboard, user metrics, quota management
  - `features/docs/` — API documentation and endpoint tester
- `shared/` — Common infrastructure, reusable UI primitives, types, API helpers
- `components/` — Thin orchestrator wrappers maintaining backward compatibility
- `lib/` — Core infrastructure utilities:
  - `lib/db/` — Drizzle ORM schema and Neon client with development fallback
  - `lib/redis/` — Redis client connecting to Docker container with in-memory fallback
  - `lib/supabase/` — Supabase storage and vector client
  - `lib/quran/` — Complete Quran corpus loader, cross-ayah relationships, phrases, and analysis engine
- `public/` — Static assets (fonts `UthmanicHafs_V22.woff2`, logos, icons)

## Storage Model

- **Database (Neon PostgreSQL + Drizzle ORM)**:
  - User research projects (`projects`)
  - Evidence items with verified classification (`evidence_items`)
  - Verse bookmarks and tags (`bookmarks`)
  - Research annotations (`research_notes`)
  - Analysis calculation cache (`analysis_cache`)

- **Cache Layer (Docker Redis)**:
  - Normalization and symmetry calculation results
  - Frequent Quran verse searches
  - AI research query synthesis and citations

- **In-Memory Quran Data**:
  - Full canonical QPC Hafs Quran text (6,236 verses across 114 Surahs)
  - Sahih International English translations
  - Cross-verse similarity mappings (`matching-ayah.json`)
  - Recurrent n-gram phrase occurrences (`phrases.json`)

## Invariants

1. Quran text and morphological data must never be mutated after application startup — always readonly.
2. Every analysis result must explicitly state its category: verified observation, calculation, interpretation, hypothesis, or unsupported.
3. All user research data (projects, bookmarks, notes) must be persisted to the database before considering it saved.
4. The AI agent must cite specific verses and show calculation logic — it cannot make assertions without evidence.
5. High-computation operations (full-surah distributions, symmetry loops) must leverage the Redis cache.
