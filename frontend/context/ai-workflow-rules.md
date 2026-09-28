# AI Workflow Rules — QuranMind Development

## Approach

Build QuranMind incrementally using a spec-driven workflow. The context files define what to build, how to build it, and the current state of progress. Always implement against these specs — do not infer or invent behavior from scratch. Each implementation step should be small enough to verify end-to-end in a single session.

Reference files in order before starting:
1. `context/project-overview.md` — product definition and features
2. `context/architecture.md` — system structure and invariants
3. `context/ui-context.md` — visual language and components
4. `context/code-standards.md` — implementation rules
5. `context/progress-tracker.md` — current phase and next steps

## Scoping Rules

- Work on one feature unit at a time — do not combine multiple unrelated systems in a single implementation
- Prefer small, verifiable increments over large speculative changes
- Each step should be callable/testable end-to-end without depending on future work
- If a feature requires database schema changes, backend routes, UI, and integration logic, split into: schema → data access → route → component

## When to Split Work

Split an implementation step if it combines:

- UI changes and API route changes (implement route first, then wire component)
- Multiple unrelated API routes (implement one route handler at a time)
- Behavior not clearly defined in the context files (clarify in progress-tracker.md first)
- Database changes and data transformation logic (schema first, then utilities)
- Analysis function and UI presentation (function first, then display component)

If a change cannot be verified end-to-end quickly (within 15–20 minutes), the scope is too broad — split it.

## Handling Missing Requirements

- Do not invent product behavior not defined in the context files
- If a requirement is ambiguous, resolve it in the relevant context file before implementing
- If a requirement is missing, add it as an open question in `progress-tracker.md` before continuing
- For AI agent behavior: always cite context files for what it should do; do not assume

## Protected Files

Do not modify unless explicitly instructed:

- `components/ui/*` — generated shadcn/ui library components (add new ones via CLI)
- `node_modules/` — third-party library internals
- `public/quran-data.json` — Quran source data (import and read, never mutate)

## Keeping Docs in Sync

Update the relevant context file whenever implementation changes:

- System architecture or boundaries → update `architecture.md`
- Storage model decisions (new tables, queries) → update `architecture.md` Storage Model section
- Code conventions or standards discovered → update `code-standards.md`
- Feature scope or product direction → update `project-overview.md`
- UI patterns or visual decisions → update `ui-context.md`
- Completed work or next steps → update `progress-tracker.md` (after every session)

## Verification Checklist

Before moving to the next feature unit:

1. ✓ The current unit works end-to-end within its defined scope
2. ✓ No invariant defined in `architecture.md` was violated
3. ✓ All user-facing text is in Arabic or properly localized
4. ✓ Analysis results include explicit type and evidence (no unsubstantiated claims)
5. ✓ `progress-tracker.md` reflects the completed work and updated next steps
6. ✓ `npm run build` passes with no TypeScript errors
7. ✓ Component and API boundaries are clear and testable

## Analysis Result Standards

Every analysis response must follow this structure:
```typescript
{
  type: 'verified' | 'calculation' | 'interpretation' | 'hypothesis' | 'error';
  data: { /* structured result */ };
  evidence: {
    verses: [{ surah, ayah, text }];
    sources: [{ title, url, note }];
    calculation?: string; // show the math
  };
  notes?: string; // clarify methodology or limitations
}
```

Never label something a "miracle" without a verification step. Always cite sources.
