# QuranMind SaaS Architecture

## 1. Product Definition

QuranMind is an Arabic-first research SaaS for exploring Quranic text, language, numerical patterns, scientific references, and scholarly evidence. It combines a fixed research workspace, retrieval-augmented generation (RAG), deterministic Quran analysis, citations, saved projects, and transparent evidence grading.

The product must never present generated interpretation as established religious or scientific fact. Every result is labeled as one of: `verified observation`, `calculation`, `interpretation`, `hypothesis`, or `unverified claim`.

Primary users:

- Researchers studying Arabic language, Quranic structure, tafsir, and thematic relationships.
- Students and educators creating evidence-backed study projects.
- Curious readers using guided analysis with clear limitations.
- Contributors and institutions improving the open Quran research knowledge base.

## 2. Landing Page Information Architecture

The home page follows the supplied SaaS landing-page reference while remaining fully branded for QuranMind and Arabic RTL.

1. Header / navigation
   - QuranMind logo and short brand promise.
   - Links: المنتج، مساحة البحث، المزايا، التوثيق، الأسعار، عن المشروع.
   - Sign in and primary “ابدأ البحث” CTA.
2. Hero section
   - Strong Arabic headline focused on discovering Quranic patterns with responsible AI.
   - Short explanation of RAG, citations, deterministic analysis, and open-source values.
   - Primary CTA: ابدأ مساحة بحث مجانية.
   - Secondary CTA: شاهد كيف تعمل المنصة.
   - Real product imagery or generated QuranMind workspace artwork; do not use empty placeholders.
3. Trust / ecosystem section
   - Explain that the platform is designed around Quran text, tafsir references, Arabic morphology, and public research sources.
   - Use real source/category marks only when they are legally appropriate; otherwise use text-based source categories.
4. Features section
   - RAG research assistant with verse-level citations.
   - Quran viewer and multi-verse comparison.
   - Arabic normalization, morphology, roots, letter and word counts.
   - Pattern and symmetry analysis.
   - Evidence ledger with claim status and source quality.
   - Saved projects, notes, bookmarks, and export.
5. Product showcase
   - Show the three-panel dashboard: navigation/projects, AI agent, Quran/evidence workspace.
   - Explain that dashboard tabs navigate to routes and do not depend on long page scrolling.
6. Pricing / access section
   - Clearly distinguish free/open-source access from future hosted plans.
   - Never promise earnings or guaranteed research conclusions.
7. Testimonials / community section
   - Use labeled demo testimonials only until real contributors approve publication.
   - Include open-source contribution and feedback CTAs.
8. Call to action
   - Invite visitors to start a project, read documentation, inspect the repository, or support development.
9. Footer
   - Product links, documentation, repository, contact, donation/support placeholder, privacy, terms, and responsible-use statement.

## 3. Application Routes

### Public routes

- `/` — Arabic product landing page.
- `/docs` — Documentation hub and architecture explanations.
- `/about` — Mission, methodology, open-source status, and contributors.
- `/contact` — Contact/support form; production delivery uses a configured email provider.
- `/pricing` — Free/open-source and hosted plans, without fabricated guarantees.
- `/login` — Email/password login.
- `/signup` — Email/password registration.

### Authenticated routes

- `/dashboard` — Exact fixed-height QuranMind workspace shown in the supplied reference.
- `/dashboard/quran` — Quran reading and verse selection.
- `/dashboard/analysis` — Deterministic Arabic and numerical analysis.
- `/dashboard/agent` — RAG research assistant conversation.
- `/dashboard/projects` — User research projects.
- `/dashboard/library` — Saved sources, bookmarks, and notes.
- `/dashboard/statistics` — Research activity and computed metrics.
- `/dashboard/settings` — Profile, preferences, data export, and account controls.
- `/workspace` — Full connected three-panel research workspace; route-backed interaction, not scroll-based tabs.

## 4. Exact Dashboard Layout

The dashboard home must match the supplied screenshot at desktop sizes:

- Dark navy background with cyan/blue highlights and thin blue borders.
- Arabic RTL layout.
- Fixed-height viewport workspace with no document-level scrolling on desktop.
- Four visible regions:
  1. Left navigation/project rail.
  2. AI agent conversation panel.
  3. Quran viewer and analysis panel.
  4. Evidence and details panel.
- Top header includes global search, notifications, theme/settings controls, and user profile.
- Bottom status line includes connection state, last update, version, and project status.
- On smaller screens, panels collapse into a drawer or route-specific single-panel view; tabs navigate to routes rather than scrolling through sections.

Dashboard features:

- Sidebar: الرئيسية، القرآن الكريم، تحليل علمي، الوكيل الذكي، المشاريع البحثية، المكتبة العلمية، الإحصائيات، المخططات والرسوم البيانية، المفضلة، الإعدادات.
- Current projects list with project status and active project.
- Agent header with online state, conversation messages, prompt composer, suggested prompts, and model label.
- Quran viewer with surah/ayah controls, page artwork, previous/next navigation, search, and selected verse state.
- Analysis tabs: الدلالات، الحقائق العلمية، الأنماط والتماثل، الأعداد والحروف، المراجع.
- Evidence cards with metrics, source labels, confidence, citations, and limitations.
- Clear “بيانات تجريبية” label wherever mock data is shown.

## 5. Data Architecture

### Immutable Quran corpus

The Quran corpus is readonly after loading. It is never edited through user actions or AI output.

Recommended records:

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
  words: readonly QuranWord[]
  references: readonly SourceReference[]
}

interface QuranWord {
  text: string
  normalized: string
  root?: string
  lemma?: string
  morphology?: string
  letters: readonly string[]
}
```

Use static JSON or an indexed readonly data layer for canonical text, translations, morphology, roots, and cross-references. User annotations must live separately in Neon.

### Neon PostgreSQL domain data

Use Neon with Drizzle ORM for user-owned data:

- Better Auth users, sessions, accounts, and verification records.
- `research_projects`.
- `project_members` if collaboration is enabled.
- `research_queries`.
- `research_runs`.
- `research_claims`.
- `evidence_items`.
- `project_notes`.
- `bookmarks`.
- `saved_prompts`.
- `source_documents` and source metadata.
- `usage_events` and plan limits.

Every query touching user data must include the authenticated user ID or an authorized project membership check. Use parameterized queries and schema validation.

## 6. RAG AI Architecture

### Retrieval pipeline

1. User submits an Arabic or multilingual research question.
2. Validate input length, language, allowed scope, and abuse limits.
3. Query structured Quran retrieval first:
   - Exact verse and surah match.
   - Arabic normalized text.
   - Roots, lemmas, morphology, and word relationships.
   - Existing cross-references.
4. Query indexed scholarly and scientific sources:
   - Tafsir and classical references.
   - Arabic lexicons and morphology sources.
   - Public scientific references.
   - Approved QuranMind project evidence.
5. Perform hybrid ranking:
   - BM25/full-text matching.
   - Embedding similarity.
   - Metadata filters for source type, language, date, and trust status.
6. Deduplicate and rerank sources.
7. Build a bounded context packet containing source IDs, excerpts, verse IDs, and metadata.
8. Generate a structured answer with the Vercel AI SDK on the server through Vercel AI Gateway.
9. Stream answer text, citations, tool status, and evidence classifications to the client.
10. Persist the research run, citations, claim classifications, and user feedback when the user saves it.

### AI output contract

The assistant must return structured sections:

- `answer` — concise Arabic explanation.
- `verses` — referenced verse IDs and exact text.
- `sources` — source title, publisher, URL or corpus ID, excerpt, and relevance.
- `calculations` — reproducible arithmetic or normalization steps.
- `claims` — each claim with classification and confidence.
- `limitations` — missing evidence, ambiguity, disagreements, or unsupported inference.
- `followUpQuestions` — useful next research actions.

The model cannot invent citations. Citations must reference retrieved context IDs and be validated server-side before display.

### AI tools

Server-side tools should include:

- `searchQuran` — exact, normalized, root, and semantic search.
- `getVerseContext` — neighboring verses, surah metadata, and translations.
- `analyzeArabic` — deterministic word, letter, root, and morphology statistics.
- `compareVerses` — alignment and shared-term analysis.
- `searchSources` — hybrid search over approved documents.
- `calculatePattern` — transparent arithmetic with an explicit formula.
- `saveResearchRun` — authenticated persistence only after validation.
- `createProjectNote` — scoped to the authenticated project.

Expensive indexing and corpus processing run as background jobs or durable workflows, never inside a blocking request.

## 7. Workers and Background Processing

Use workers for long-running, retryable, and batch operations:

- Ingesting new tafsir, lexicon, and scientific source documents.
- Parsing PDFs/HTML and extracting clean text.
- Arabic normalization and chunking.
- Generating embeddings.
- Updating full-text and vector indexes.
- Deduplicating source passages.
- Recomputing source quality and citation metadata.
- Building project exports.
- Usage aggregation and analytics rollups.
- Scheduled corpus health checks.
- Deleting a user's data across indexes after an account deletion request.

Worker principles:

- Jobs are idempotent and have stable job IDs.
- Every job has retries with bounded exponential backoff.
- Poison jobs move to a dead-letter queue with an operator-visible error.
- Jobs record status, attempt count, started time, completed time, and error details.
- Workers never mutate canonical Quran text.
- Workers do not expose secrets to the browser.
- Use Workflow SDK when work must survive restarts, pause, wait for external events, or coordinate multiple steps.
- Use a queue or database-backed job table for ingestion and indexing workloads.

## 8. Search and Indexing

Maintain separate indexes:

1. Quran exact index — canonical verse and word data.
2. Quran semantic index — verse and passage embeddings.
3. Source full-text index — source chunks with language and metadata.
4. Source vector index — embeddings for semantic retrieval.
5. Project index — user-private saved research, notes, and claims.

Required metadata:

- `sourceId`, `sourceType`, `language`, `author`, `publisher`, `publicationDate`.
- `verseIds`, `surahNumbers`, `topics`, `rootTerms`.
- `verificationStatus`, `license`, `visibility`, and `createdAt`.

Private project material must be filtered by user/project authorization before retrieval. Do not leak one user's notes into another user's RAG context.

## 9. Authentication, Authorization, and Plans

Use Better Auth with email and password by default. Configure secure cookies, trusted preview origins, password hashing, session expiry, and sign-out.

Authorization levels:

- Guest: public landing page, docs, and limited read-only Quran browsing.
- Member: saved projects, notes, bookmarks, and bounded research runs.
- Contributor: approved source submission and moderation tools.
- Admin: source approval, user support, usage monitoring, and system controls.

Plan controls:

- Free/open-source: limited saved projects and daily research runs.
- Hosted individual: higher limits, exports, and history.
- Team/institution: collaboration, shared source collections, and admin controls.

Limits must be enforced on the server, not merely hidden in the UI.

## 10. Core Product Features

### Research

- Arabic-first prompt composer.
- Suggested questions.
- Verse and surah selection.
- Search by exact text, root, lemma, topic, and semantic meaning.
- Multi-verse comparison.
- Reproducible calculations.
- Citation panel and source preview.
- Claim classification and confidence.
- Research history and rerun.

### Projects

- Create, rename, archive, and delete projects.
- Save research runs.
- Add notes and hypotheses.
- Bookmark verses and sources.
- Tag findings.
- Export Markdown, JSON, and PDF summaries.
- Share read-only project links only when explicitly enabled.

### Evidence and safety

- Source quality labels.
- Verified vs unverified distinction.
- Methodology and calculation details.
- Disagreement and alternative interpretation fields.
- Responsible-use disclaimer: research assistance is not a fatwa, medical advice, or scientific peer review.
- Report incorrect citation or unsafe output.

### Collaboration and community

- Open-source repository link.
- Contributor guide and issue templates.
- Public methodology documentation.
- Moderated source submissions.
- Feedback and support contact.
- Donation/support CTA with transparent project usage.

## 11. API and Server Boundaries

Recommended route handlers/server actions:

- `POST /api/research/run` — validate, retrieve, stream AI response.
- `GET /api/quran/search` — public corpus search.
- `GET /api/quran/verses/[id]` — verse context.
- `POST /api/analysis/arabic` — deterministic analysis.
- `GET /api/projects` — authenticated project list.
- `POST /api/projects` — create project.
- `GET /api/projects/[id]` — authorized project detail.
- `POST /api/projects/[id]/runs` — save research run.
- `POST /api/projects/[id]/notes` — save note.
- `POST /api/feedback` — report result/source issue.
- `POST /api/ingestion/webhook` — authenticated worker callback only.

Do not expose database credentials, model credentials, worker tokens, or raw private source content to client components.

## 12. Observability and Operations

Track:

- Retrieval latency and result count.
- Generation latency and streaming failures.
- Citation validation failures.
- Worker success/failure/retry counts.
- Index freshness.
- Token and model usage by user/project.
- Search zero-result rate.
- User feedback and reported hallucinations.
- Database query latency.

Use structured logs with request IDs and project/user-safe identifiers. Never log passwords, session tokens, full private notes, or secret environment variables.

## 13. Testing Strategy

- Unit tests for Arabic normalization, counting, roots, morphology mapping, and calculations.
- Golden tests for Quran retrieval and citation validation.
- Contract tests for AI structured output.
- Authorization tests for every project query.
- Worker idempotency and retry tests.
- Route tests for all public and dashboard tabs.
- Browser tests for fixed dashboard layout, panel interactions, route navigation, login/signup, and responsive collapse.
- Accessibility checks for Arabic labels, keyboard navigation, focus states, color contrast, and screen-reader descriptions.

## 14. Delivery Milestones

### Milestone 1 — Foundation demo

- Arabic landing page and exact dashboard shell.
- Immutable sample Quran data.
- Deterministic analysis utilities.
- Mock route-based dashboard tabs.
- Documentation and architecture context.

### Milestone 2 — Real persistence and auth

- Neon integration and Drizzle schema.
- Better Auth email/password.
- Projects, notes, bookmarks, and saved research.
- Server-side ownership checks.

### Milestone 3 — RAG research assistant

- Quran and source retrieval.
- Embeddings and hybrid ranking.
- AI SDK streaming with structured citations.
- Evidence classification and validation.

### Milestone 4 — Workers and indexing

- Source ingestion pipeline.
- Chunking, embeddings, index updates, retries, and dead-letter handling.
- Durable workflows for exports and heavy analysis.

### Milestone 5 — Collaboration and SaaS operations

- Team projects and roles.
- Usage limits and plans.
- Admin moderation tools.
- Observability, billing readiness, exports, and public contribution workflows.

## 15. Non-Negotiable Principles

1. Arabic-first UX, RTL layout, and an Arabic-capable font.
2. Canonical Quran data is readonly and immutable.
3. No AI claim without retrieved evidence or an explicit unverified label.
4. Every saved user artifact is persisted before being reported as saved.
5. User-owned data is scoped by authenticated user and project membership.
6. Long-running work belongs in workers/workflows, not blocking request handlers.
7. Demo/mock data is always labeled clearly.
8. The UI must support research without presenting itself as religious authority.
9. Dashboard tabs navigate by route; they are not dependent on page scrolling.
10. Open-source messaging must be accurate, transparent, and linked to the real repository when available.

## 16. Supplied Image References

- The first supplied image is a QuranMind dashboard reference: a dark Arabic RTL research workspace with a left navigation rail, AI agent panel, central Quran page viewer and analysis cards, and a right evidence panel.
- The second supplied image is a generic SaaS landing-page structure reference labeled with header/navigation, hero, trust/logos, features, product showcase, pricing, testimonials, CTA, and footer. QuranMind should reuse this information architecture, not the unrelated FlowSaaS branding.

Both references are visual guidance only. Product copy, sources, pricing, testimonials, and claims must be truthful and clearly marked as demo content until verified.

## 17. Implementation Rules for This Repository

- Follow `context/architecture.md`, `context/quranmind-build-plan.md`, and `context/progress-tracker.md`.
- Prefer small components over one large page.
- Keep route navigation explicit.
- Use existing project conventions and installed dependencies.
- Before writing integration code, inspect and request the required integration.
- Before writing AI SDK code, load the current AI SDK skill and verify the installed version.
- Update progress tracking after each milestone.
- Preserve completed context files unless the change is a factual progress update.
- Never replace real backend behavior with localStorage or client-only persistence.

## 18. Open Decisions

- Final source corpus licensing and ingestion policy.
- Vector/search provider selection if Neon indexes are insufficient.
- Exact hosted pricing and usage limits.
- Whether collaboration ships in the first production release.
- Repository URL, contact destination, and donation provider.
- Moderation workflow for community-submitted sources.
- Supported translation languages beyond Arabic and English.

Until these decisions are finalized, use explicit placeholders and demo labels rather than inventing production commitments.

## 19. Definition of Done for the SaaS

The SaaS is ready for an initial production release when:

- Users can register, sign in, create projects, and save research securely.
- Quran retrieval and analysis are deterministic and test-covered.
- AI responses stream with validated verse/source citations.
- Every claim has a visible evidence classification and limitation.
- Workers process ingestion and expensive jobs with retries and observability.
- Dashboard tabs work by route and preserve the exact workspace mental model.
- Landing page explains the product, features, open-source status, support path, and responsible-use boundaries.
- Accessibility, security, performance, and error states have been tested.
- No demo data is presented as real research, real testimonials, verified scientific proof, or guaranteed outcome.
