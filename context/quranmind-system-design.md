# QuranMind SaaS System Design

## 1. Purpose

QuranMind is an Arabic-first research SaaS for responsible exploration of Quranic text, Arabic language, numerical structures, scientific references, tafsir, and scholarly sources. The system combines deterministic computation with retrieval-augmented generation (RAG), citations, evidence grading, saved research projects, and transparent limitations.

The product is an assistant for research, not a replacement for qualified scholars. Generated content must never be presented as a fatwa, definitive religious interpretation, or established scientific conclusion without appropriate primary sources and human review.

## 2. Design Principles

- Arabic-first: RTL layout, Arabic-capable typography, Arabic search normalization, and bilingual metadata where useful.
- Evidence before generation: retrieve and rank sources before asking a model to synthesize.
- Deterministic before probabilistic: counts, normalization, morphology, and pattern calculations run in code.
- Citation by default: every factual answer includes verse/source references and retrieval metadata.
- Clear uncertainty: label claims as `verified observation`, `calculation`, `interpretation`, `hypothesis`, or `unverified claim`.
- Immutable source text: the Quran corpus is read-only and cannot be modified by users, workers, or models.
- Route-based product navigation: dashboard tabs navigate to routes and do not depend on long-page scrolling.
- Mock data is explicit: demo content is marked `بيانات تجريبية` until connected to production data.
- Privacy and tenant isolation: every user-owned query is scoped to the authenticated user and project.
- Open-source transparency: data provenance, prompts, calculations, and limitations should be inspectable.

## 3. Product Surfaces

### Public SaaS

- `/` — Arabic landing page following the SaaS structure: header, hero, trust/ecosystem, features, product showcase, access/pricing, testimonials/community, CTA, and footer.
- `/docs` — product, methodology, API, architecture, and responsible-use documentation.
- `/about` — mission, open-source status, methodology, and contributors.
- `/pricing` — free/open-source access and future hosted plans; no fabricated guarantees.
- `/contact` — support and contribution contact form.
- `/login` and `/signup` — email/password authentication.

### Authenticated product

- `/dashboard` — fixed-height workspace matching the QuranMind reference image.
- `/dashboard/quran` — Quran viewer, surah navigation, ayah selection, and comparison.
- `/dashboard/analysis` — deterministic linguistic, numerical, and pattern analysis.
- `/dashboard/agent` — RAG research assistant with citations and claim status.
- `/dashboard/projects` — research projects, notes, hypotheses, and evidence ledgers.
- `/dashboard/library` — saved sources, bookmarks, annotations, and exports.
- `/dashboard/statistics` — usage and computed research metrics.
- `/dashboard/settings` — profile, preferences, privacy, export, and account controls.
- `/workspace` — connected three-panel research mode.

## 4. High-Level Architecture

```text
Browser / Next.js App Router
        |
        | HTTPS, authenticated session, route handlers
        v
Application API and Server Actions
        |
        +--> Better Auth session and tenant authorization
        +--> Research orchestration service
        +--> Deterministic Quran analysis service
        +--> Retrieval service
        +--> Project and evidence service
        |
        +--> Neon Postgres + Drizzle
        +--> Vector index / hybrid search
        +--> Object storage for source files and exports
        +--> AI Gateway for generation and embeddings
        |
        v
Workers and durable workflows
        |
        +--> source ingestion
        +--> document parsing and chunking
        +--> embedding generation
        +--> index refresh
        +--> long-running research jobs
        +--> export generation
        +--> evaluation and observability
```

The web application remains responsive and request-scoped. Long-running work is delegated to workers or durable workflows. The browser never calls model providers directly and never receives provider secrets.

## 5. Frontend Architecture

### Core stack

- Next.js App Router and React Server Components.
- TypeScript with strict types.
- Tailwind CSS and shared semantic design tokens.
- Cairo or another Arabic-capable font loaded through `next/font`.
- Accessible semantic HTML and keyboard navigation.
- Reusable components for shell, panels, cards, evidence, citations, and forms.

### Rendering strategy

- Server Components load public content and initial authenticated data.
- Client Components are limited to interactive workspace controls, prompt composer, filters, drawers, and charts.
- Never fetch production data inside `useEffect`; use Server Components, Server Actions, or SWR for client synchronization.
- Use route segments for dashboard tabs. Do not represent navigation as hidden sections that require scrolling.
- Desktop dashboard uses a fixed viewport shell with panel-local scrolling. Mobile uses a route-specific panel or drawer layout.

### Dashboard shell

The desktop shell has four regions:

1. Navigation and project rail.
2. AI agent conversation panel.
3. Quran viewer and analysis panel.
4. Evidence and source detail panel.

The shell includes a global search header, notifications, profile state, project selector, connection status, and version/status footer. Panel-local overflow is allowed; document-level scrolling is avoided at desktop dashboard sizes.

## 6. Identity, Authentication, and Authorization

### Authentication

Use Better Auth with email/password as the default authentication method. OAuth, magic links, passkeys, and social providers are not enabled unless explicitly required.

Required protections:

- Password hashing and session management through Better Auth.
- Secure, HttpOnly, SameSite cookies.
- Development cookie attributes compatible with v0 preview origins.
- Trusted origins include localhost and exact preview origins.
- Rate limiting for login, signup, password reset, and agent endpoints.
- Generic login errors to reduce account enumeration.

### Authorization

Every server query touching user data includes the authenticated `userId`. Projects, notes, saved searches, evidence records, exports, and private sources are tenant-scoped.

Roles:

- `user` — owns personal projects and private research.
- `contributor` — may submit public source improvements for review.
- `reviewer` — moderates source submissions and evidence status.
- `admin` — manages platform configuration and moderation.

Authorization is checked in the server layer, not only in the UI.

## 7. Data Model

### Immutable corpus

```ts
interface QuranVerse {
  id: string
  surahNumber: number
  surahNameArabic: string
  ayahNumber: number
  textUthmani: string
  textSimple: string
  juz?: number
  page?: number
  hizb?: number
  sourceVersion: string
}
```

The corpus is versioned and immutable. Corrections create a new corpus version and an auditable migration; user content never overwrites canonical text.

### Research entities

```text
User
Organization / Workspace
Project
ProjectMember
ResearchQuestion
VerseSelection
AnalysisRun
AnalysisResult
Claim
EvidenceItem
SourceDocument
SourceChunk
Citation
Conversation
Message
SavedSearch
Bookmark
Annotation
ExportJob
AuditEvent
```

Important relationships:

- A user owns or belongs to a workspace.
- A project belongs to a workspace.
- A research question belongs to a project.
- An analysis run references an immutable corpus version.
- A claim has one or more evidence items and citations.
- A conversation belongs to a project and stores model/version metadata.
- Source documents are versioned; chunks reference a source version.

### Evidence record

```ts
interface EvidenceItem {
  id: string
  claimId: string
  type: 'verse' | 'tafsir' | 'linguistic' | 'scientific' | 'historical' | 'secondary'
  title: string
  excerpt: string
  sourceUrl?: string
  sourceAuthor?: string
  publicationDate?: string
  reliability: 'primary' | 'peer_reviewed' | 'institutional' | 'secondary' | 'uncertain'
  status: 'verified_observation' | 'calculation' | 'interpretation' | 'hypothesis' | 'unverified_claim'
  retrievalScore?: number
  reviewedBy?: string
}
```

## 8. RAG Architecture

### RAG objective

The RAG system answers research questions using Quran verses, tafsir, Arabic linguistic resources, scientific references, historical material, and approved public documents. It must expose what was retrieved, what was calculated, and what was generated.

### Ingestion pipeline

1. Register a source and its license/provenance.
2. Fetch or upload the source through a controlled worker.
3. Validate MIME type, size, encoding, and malware policy.
4. Extract text and preserve page, section, and paragraph boundaries.
5. Normalize Arabic for retrieval while preserving the original excerpt.
6. Split into semantic chunks with source offsets.
7. Generate embeddings through the AI Gateway.
8. Store chunks, metadata, hashes, and embedding references.
9. Index full text and vector representations.
10. Mark the source version active only after validation checks pass.

### Query pipeline

1. Authenticate the user and validate project access.
2. Normalize Arabic query text without changing display text.
3. Detect query intent: verse lookup, linguistic analysis, numerical analysis, evidence request, comparison, or general research.
4. Expand query terms using Arabic roots, spelling variants, surah metadata, and project context.
5. Run hybrid retrieval: lexical search plus vector similarity.
6. Apply metadata filters: source type, language, date, reliability, corpus version, and project scope.
7. Rerank candidates using relevance, source quality, verse proximity, and diversity.
8. Remove duplicate or contradictory low-quality candidates where possible.
9. Run deterministic analysis when the question asks for counts, patterns, normalization, or comparisons.
10. Send only grounded context to the model.
11. Generate a structured answer with claims, citations, limitations, and confidence.
12. Persist the conversation, retrieval trace, analysis version, and citations.

### Answer contract

```ts
interface ResearchAnswer {
  answer: string
  claims: Array<{
    text: string
    status: EvidenceItem['status']
    confidence: 'high' | 'medium' | 'low'
    citations: string[]
  }>
  calculations: Array<{
    name: string
    value: string
    methodVersion: string
  }>
  limitations: string[]
  retrievedSources: string[]
  model: string
  promptVersion: string
}
```

The model is not allowed to invent a citation. Citations must reference retrieved records or deterministic output IDs.

## 9. Deterministic Quran Analysis

Deterministic analysis runs independently from the language model.

Capabilities:

- Arabic diacritic normalization.
- Alef, ya, ta marbuta, hamza, and punctuation normalization.
- Tokenization and word counts.
- Letter counts and frequency distributions.
- Root and morphology lookup when a reviewed lexicon is available.
- Verse and surah comparison.
- Repeated phrase and n-gram detection.
- Symmetry and positional analysis.
- Numerical calculations with transparent formulas.
- Reproducible result hashes and method versions.

Every result stores:

- Input verse IDs and corpus version.
- Normalization profile.
- Method version.
- Formula or algorithm identifier.
- Output values.
- Warnings about interpretation.

The system must distinguish a mathematical observation from an interpretation about meaning.

## 10. Workers and Durable Workflows

### Why workers are required

Source ingestion, OCR, parsing, embeddings, bulk indexing, large comparisons, exports, and evaluation can exceed a request lifecycle. These workloads run asynchronously so the interface remains responsive and retries are safe.

### Worker types

- `source-fetch-worker` — downloads approved sources and records checksums.
- `document-parser-worker` — extracts text, pages, headings, and metadata.
- `arabic-normalization-worker` — creates retrieval fields and normalized tokens.
- `embedding-worker` — generates embeddings in batches.
- `index-worker` — updates lexical and vector indexes.
- `analysis-worker` — executes large deterministic comparisons.
- `research-worker` — runs multi-step RAG research jobs.
- `export-worker` — creates PDF, Markdown, CSV, or JSON exports.
- `evaluation-worker` — runs retrieval and answer-quality test sets.
- `cleanup-worker` — applies retention and removes expired temporary files.

### Workflow guarantees

- Idempotency keys for every externally triggered job.
- Retry with exponential backoff for transient errors.
- Dead-letter handling for permanently failed jobs.
- Progress events stored for UI status updates.
- Cancellation support for user-owned long-running research.
- No duplicate billing or duplicate exports on retry.
- Structured logs with job ID, project ID, source version, and method version.

## 11. Storage and Search

### Primary database

Neon Postgres with Drizzle ORM stores users, projects, conversations, source metadata, claims, citations, job state, and audit events.

Recommended indexes:

- `project(user_id, updated_at)`
- `conversation(project_id, created_at)`
- `evidence(claim_id, status)`
- `source_chunk(source_id, ordinal)`
- `audit_event(workspace_id, created_at)`

### Search indexes

Use a hybrid search layer with:

- PostgreSQL full-text search for exact terms and Arabic lexical matching.
- Vector similarity for semantic retrieval.
- Metadata filters for source type, language, reliability, and corpus version.
- Optional dedicated search infrastructure when corpus size or latency requires it.

Search documents must include `objectID`, source version, chunk boundaries, searchable text, display excerpt, citation metadata, and access scope.

### Object storage

Private object storage holds uploaded documents, generated exports, page images, and OCR artifacts. Access uses short-lived signed URLs and project authorization. Public access is used only for explicitly public assets.

## 12. AI Layer

Use the Vercel AI SDK with Vercel AI Gateway for generation, structured output, embeddings, and model abstraction. Model calls stay on the server.

AI responsibilities:

- Intent classification.
- Query expansion.
- Grounded answer generation.
- Claim extraction and status assignment.
- Source summarization.
- Project note assistance.
- Optional multilingual explanation.

Non-AI responsibilities:

- Quran text retrieval.
- Corpus normalization.
- Counts and formulas.
- Citation resolution.
- Permissions.
- Evidence status enforcement.

Prompt templates are versioned. Each answer records model ID, prompt version, retrieval IDs, temperature/configuration, and safety instructions.

## 13. API and Server Actions

### Route handlers

- `POST /api/research` — start a grounded research request.
- `POST /api/analysis` — run a deterministic analysis.
- `GET /api/verses/search` — search canonical verses.
- `GET /api/projects` — list authorized projects.
- `POST /api/projects` — create a project.
- `GET /api/projects/:id/evidence` — list project evidence.
- `POST /api/sources` — submit a source for ingestion.
- `GET /api/jobs/:id` — read job status.
- `POST /api/exports` — create an export job.

All handlers validate input with a schema library, authenticate the session, authorize project scope, and use parameterized queries.

### Streaming research

Streaming is allowed for the assistant response, but the final structured answer is persisted only after citations and claim validation complete. The UI displays a clear state for retrieving, calculating, drafting, and completed evidence.

## 14. Security and Privacy

- Server-only provider credentials.
- Secure cookies and CSRF protection where applicable.
- Input validation and output escaping.
- Parameterized SQL and scoped queries.
- File type, size, and malware validation.
- Signed private object URLs.
- Rate limits for auth, search, generation, and ingestion.
- Audit events for source changes, exports, permission changes, and moderation.
- PII minimization in prompts and logs.
- Configurable retention and account deletion.
- Content-security and baseline security headers in deployment config.
- Prompt-injection defenses: retrieved text is untrusted data, never instructions.

## 15. Observability and Evaluation

### Metrics

- Search latency and retrieval hit rate.
- Citation coverage.
- Unsupported-claim rate.
- Answer completion and cancellation rate.
- Model latency and token usage.
- Worker retry and dead-letter rates.
- Index freshness.
- Analysis reproducibility.
- Auth failures and rate-limit events.

### Evaluation datasets

Maintain reviewed test sets for:

- Arabic spelling and normalization.
- Verse lookup and exact citation.
- Tafsir retrieval.
- Numerical calculation correctness.
- Scientific-source grounding.
- Prompt-injection resistance.
- Unsupported interpretation detection.

Run evaluations before changing prompts, models, normalization profiles, or ranking logic.

## 16. Landing Page System Design

The home page follows the supplied SaaS reference structure while remaining QuranMind-specific and Arabic RTL:

1. Header/navigation — logo, product routes, documentation, repository, login, and primary CTA.
2. Hero — responsible AI research promise, concise explanation, real dashboard imagery, and two CTAs.
3. Trust/ecosystem — Quran text, tafsir, Arabic language, scientific references, and open-source methodology.
4. Features — RAG citations, Quran viewer, deterministic analysis, evidence ledger, projects, exports, and collaboration.
5. Product showcase — three-panel dashboard image and route-based workspace explanation.
6. Access/pricing — clearly labeled free/open-source access and future hosted plans.
7. Community/testimonials — approved testimonials only; otherwise use demo labels.
8. CTA — start research, read documentation, inspect repository, or support development.
9. Footer — product links, docs, repository, contact, donation placeholder, privacy, terms, and responsible-use statement.

Images must be real generated or supplied assets, not empty placeholders. Accessibility requires alt text, visible focus states, semantic headings, and sufficient contrast.

## 17. Delivery Phases

### Phase 1: Foundation

- Finalize route map and design tokens.
- Add immutable sample Quran corpus.
- Implement deterministic normalization and analysis.
- Complete fixed three-panel dashboard shell.
- Keep demo data clearly labeled.

### Phase 2: Database and authentication

- Connect Neon.
- Add Drizzle schema and migrations.
- Add Better Auth email/password.
- Implement project and user scoping.
- Add audit events.

### Phase 3: Retrieval and ingestion

- Add source registry and provenance.
- Build parsing, chunking, normalization, embeddings, and indexing workers.
- Implement hybrid search and citation resolution.

### Phase 4: Research assistant

- Add AI SDK server route.
- Add structured answer contract.
- Add claim/evidence ledger.
- Add streaming UI and persisted conversations.

### Phase 5: Collaboration and exports

- Add notes, bookmarks, annotations, project sharing, review queue, and exports.
- Add contribution workflows for public sources.

### Phase 6: Production hardening

- Add evaluation suite, rate limiting, observability, retention, backups, security review, and performance budgets.
- Replace mock testimonials and placeholder links only after approval.

## 18. Definition of Done

A feature is complete when:

- It has a typed data contract.
- It has authenticated authorization checks where needed.
- It has deterministic tests for calculations and validation.
- It has citations or provenance for factual output.
- It handles loading, empty, error, and retry states.
- It works in Arabic RTL and remains accessible by keyboard.
- It is responsive without relying on document scrolling for dashboard tabs.
- It is observable with structured logs and useful metrics.
- It documents limitations and marks demo data.
- It passes type checking, linting, tests, build, and targeted browser verification.

## 19. Non-Goals

- Presenting AI interpretations as religious rulings.
- Claiming scientific proof from numerical coincidence alone.
- Editing or generating canonical Quran text.
- Building a generic chatbot without citations.
- Using client-side storage as the production database.
- Adding payment promises or earnings claims.
- Allowing unreviewed public sources to influence trusted evidence labels.

## 20. Decision Record

The first implementation should remain a transparent demo while the production services are added incrementally. The dashboard and landing page establish the user experience; Neon, Better Auth, workers, hybrid retrieval, and AI SDK are introduced behind typed interfaces so mock data can be replaced without redesigning the UI or changing route contracts.
