# Ilm Repository Integration Plan — QuranMind

## 1. Evaluation & Strategic Value

The `ilm` repository (https://github.com/arriqaaq/ilm.git) contains an exceptionally well-curated dataset for Quranic scholarship and hadith isnad analysis. Integrating its data assets into QuranMind provides immediate production-grade depth:

### What It Delivers for QuranMind:
1. **Complete Quran Text (QPC Hafs)**:
   - Official Medina Mushaf King Fahd Complex (QPC) text for all 114 Surahs and 6,236 Ayahs (`qpc-hafs.json`).
   - Replaces sample data with the complete, canonical text.
2. **Word-by-Word & English Translations**:
   - Complete Sahih International translation (`en-sahih-international-simple.json`).
   - Word-by-word breakdowns and Arabic morphological tagging.
3. **Cross-Ayah Similarity & Recurrence (`matching-ayah.json`)**:
   - Pre-computed verse-to-verse similarity scores, coverage percentages, and matching word intervals across the entire Quran.
   - Directly powers our Verse Comparison and Relationship Mapping tools.
4. **Phrasal Repetition & Structural Symmetry (`phrases.json`)**:
   - Exact locations and counts of repeated Quranic phrases and n-grams across different Surahs.
   - Essential for our Symmetry Engine and structural analysis.
5. **Authentic Tafsir & Scholarship**:
   - Ibn Kathir commentary per ayah (`en-tafisr-ibn-kathir.json`).
   - Powers the Evidence Panel with authoritative scholarly context to prevent unsupported claims.
6. **Uthmanic Quran Typography**:
   - High-fidelity `UthmanicHafs_V22.woff2` font for genuine Medina Mushaf rendering.

---

## 2. Integration Architecture & Boundaries

### Non-Negotiable Invariants:
- **Preserve QuranMind Design & Tech Stack**:
  - Keep Next.js 16 (React 19) + TypeScript + Tailwind CSS.
  - Maintain the dark scientific workspace aesthetic (`#020b18`, `#00d4ff` electric blue, Cairo font, RTL Arabic layout).
  - Retain **Clerk** authentication, **Neon PostgreSQL** database with Drizzle ORM, **Supabase** storage, and **Redis (Docker)** caching.
- **Data Ingestion Model**:
  - Ingest the structured JSON datasets into `lib/quran/data/`.
  - Copy `UthmanicHafs_V22.woff2` into `public/fonts/`.
  - Do NOT adopt the Rust/SvelteKit codebase directly — extract the structured data and algorithmic logic into TypeScript utilities with Redis caching.

---

## 3. Implementation Steps

### Phase 1: Data Migration
1. Create `lib/quran/data/` directory.
2. Copy canonical datasets from `ilm_temp/qul/`:
   - `qpc-hafs.json` (Complete Arabic text)
   - `en-sahih-international-simple.json` (Complete English translations)
   - `matching-ayah.json` (Cross-verse similarity relationships)
   - `phrases.json` (Recurrent phrases & n-grams)
3. Copy `UthmanicHafs_V22.woff2` to `public/fonts/`.

### Phase 2: Quran Loader & Indexer (`lib/quran/quran-data.ts`)
1. Implement lazy-loaded, memory-indexed reader for all 6,236 verses.
2. Expose fast lookup by `surah:ayah`, surah name, or full-text search.
3. Integrate verse-to-verse relationship lookup using `matching-ayah.json`.
4. Integrate phrase repetition lookup using `phrases.json`.

### Phase 3: Research Workspace Upgrades
1. Update Quran Viewer to support full 114 Surah navigation.
2. Add "الآيات المتشابهة" (Matching Verses) tab in the Quran Viewer panel.
3. Add "العبارات المتكررة" (Repeated Phrases) inspection in the Evidence panel.
4. Connect AI Agent to query the full 6,236 verse corpus and cross-references.

### Phase 4: Cleanup
1. Remove `ilm_temp` after data ingestion to keep the repository clean and efficient.
2. Update `context/architecture.md` and `context/progress-tracker.md`.
