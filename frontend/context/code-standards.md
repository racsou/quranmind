# Code Standards — QuranMind

## 1. Core Rule: ONE FILE = ONE TASK
- Every file has exactly one reason to change. If you need "and" to describe its purpose, split it.
- **Max ~150 lines per file** (components $\le 120$ lines). Any file exceeding this threshold must be refactored and decomposed.
- One exported main function or component per file.
- File naming convention:
  - **Noun** for UI components: `verse-card.tsx`, `tab-item.tsx`, `sidebar-brand.tsx`.
  - **Verb-Noun** for logic/services: `create-slickpay-invoice.ts`, `load-quran-corpus.ts`, `validate-email.ts`.
- No barrel files that hide internal implementation details. `index.ts` is only used for high-level re-exports.

## 2. Layer Architecture (Strict One-Way Direction)
```
Route Handler (app/api/**) ──▶ Service (features/*/services) ──▶ Data Layer (shared/lib)
```
- **Route Handlers (`app/api/**/route.ts`):**
  - Thin entry points ($\le 30$ lines).
  - Parse + validate input with Zod $\to$ authenticate $\to$ call single service $\to$ return standardized response (`respond.ok()` / `respond.fail()`).
  - No business logic or direct DB calls in route handlers.
- **Services (`features/*/services/*.ts`):**
  - Pure use-case business logic.
  - Interacts with data layer or third-party gateways.
- **Data Layer (`shared/lib/*`):**
  - Only deals directly with Neon (Drizzle), Supabase Storage/Vector, or Redis.
- **Components (`features/*/components/`):**
  - Presentation and rendering only.
  - Data fetching and state orchestration isolated in custom hooks (`use-*.ts`).

## 3. TypeScript Standards
- TypeScript strict mode enabled throughout.
- Strict prohibition of `any`; use strictly typed interfaces or generic parameter constraints.
- Validate external boundaries (HTTP requests, URL params, webhook payloads) with schemas.

## 4. UI & Aesthetics Standards
- Eye-friendly light/white theme by default (soothing paper background `#f8fafc`, pure `#ffffff` cards, high-contrast charcoal text `#0f172a`, delicate `#e2e8f0` borders, serene cyan/emerald accents).
- High legibility for Arabic calligraphy using `UthmanicHafs` and `Cairo` typography.
- Layout, grids, and responsiveness must remain identical across refactoring phases.

## 5. Data Ownership Rules
- **Neon PostgreSQL + Drizzle ORM:** Single owner of all relational entities (`users`, `projects`, `evidence_items`, `bookmarks`, `research_notes`, `payments`, `analysis_cache`).
- **Supabase:** Single owner of Object Storage (`research-exports` bucket) and semantic vector embeddings.
- **Redis:** Single owner of calculation caching, rate limiting, and ephemeral query results.
