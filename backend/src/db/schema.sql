-- ==============================================================================
-- QuranMind SaaS Database Schema for Supabase (PostgreSQL)
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Ensure auth schema and helpers exist for Supabase RLS compatibility
CREATE SCHEMA IF NOT EXISTS auth;

CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid AS $$
  SELECT COALESCE(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION auth.role() RETURNS text AS $$
  SELECT COALESCE(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text;
$$ LANGUAGE sql STABLE;

-- ==============================================================================
-- 1. QURAN TABLES
-- ==============================================================================

-- Canonical Surahs (114 Surahs)
CREATE TABLE IF NOT EXISTS quran_surahs (
    number INTEGER PRIMARY KEY,
    name_ar TEXT NOT NULL,
    english_name TEXT NOT NULL,
    english_translation TEXT NOT NULL,
    number_of_ayahs INTEGER NOT NULL,
    revelation_type TEXT NOT NULL CHECK (revelation_type IN ('Meccan', 'Medinan')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Canonical Verses (6,236 Ayahs)
CREATE TABLE IF NOT EXISTS quran_verses (
    id TEXT PRIMARY KEY, -- e.g. '1:1', '2:255'
    surah_number INTEGER NOT NULL REFERENCES quran_surahs(number) ON DELETE CASCADE,
    ayah_number INTEGER NOT NULL,
    surah_name_ar TEXT NOT NULL,
    surah_english_name TEXT NOT NULL,
    text_uthmani TEXT NOT NULL,
    translation_en TEXT NOT NULL,
    transliteration TEXT,
    revelation_type TEXT NOT NULL,
    juz INTEGER,
    page INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_surah_ayah UNIQUE (surah_number, ayah_number)
);

CREATE INDEX IF NOT EXISTS idx_quran_verses_surah ON quran_verses(surah_number);
CREATE INDEX IF NOT EXISTS idx_quran_verses_surah_ayah ON quran_verses(surah_number, ayah_number);
CREATE INDEX IF NOT EXISTS idx_quran_verses_text_uthmani ON quran_verses USING gin(to_tsvector('arabic', text_uthmani));
CREATE INDEX IF NOT EXISTS idx_quran_verses_trans_en ON quran_verses USING gin(to_tsvector('english', translation_en));

-- Recurrent Phrases across the Quran
CREATE TABLE IF NOT EXISTS quran_phrases (
    id TEXT PRIMARY KEY,
    count INTEGER NOT NULL,
    surahs_count INTEGER NOT NULL,
    ayahs_count INTEGER NOT NULL,
    source_key TEXT NOT NULL,
    source_from INTEGER,
    source_to INTEGER,
    occurrences JSONB DEFAULT '[]'::jsonb,
    ayah_mapping JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quran_phrases_source_key ON quran_phrases(source_key);

-- Matching Ayahs & Similarity Graph
CREATE TABLE IF NOT EXISTS quran_matching_ayahs (
    id TEXT PRIMARY KEY, -- e.g. '1:1->27:30'
    source_ayah_key TEXT NOT NULL,
    matched_ayah_key TEXT NOT NULL,
    matched_words_count INTEGER NOT NULL,
    coverage NUMERIC NOT NULL,
    score NUMERIC NOT NULL,
    match_words JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_matching_source_key ON quran_matching_ayahs(source_ayah_key);
CREATE INDEX IF NOT EXISTS idx_matching_target_key ON quran_matching_ayahs(matched_ayah_key);

-- Scholarly Archive & Classical Tafsir Linkage
CREATE TABLE IF NOT EXISTS quran_tafsir (
    id TEXT PRIMARY KEY, -- e.g. '21:33'
    surah_number INTEGER NOT NULL,
    ayah_number INTEGER NOT NULL,
    ibn_kathir TEXT,
    jalalayn TEXT,
    asbab_nuzul TEXT,
    hadith_citations JSONB DEFAULT '[]'::jsonb,
    scientific_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quran_tafsir_verse ON quran_tafsir(surah_number, ayah_number);

-- ==============================================================================
-- 2. HADITH TABLES
-- ==============================================================================

-- Hadith Collections
CREATE TABLE IF NOT EXISTS hadith_collections (
    code TEXT PRIMARY KEY, -- e.g. 'bukhari', 'muslim'
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    total_hadiths INTEGER NOT NULL,
    canonical BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classical Books
CREATE TABLE IF NOT EXISTS hadith_books (
    id INTEGER PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    author TEXT NOT NULL,
    category TEXT NOT NULL, -- 'hadith_corpus' | 'hadith_grading' | 'tafsir'
    total_pages INTEGER NOT NULL,
    shamela_id INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prominent Hadith Scholars
CREATE TABLE IF NOT EXISTS hadith_scholars (
    key TEXT PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    death_year_ah INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Narrators & Biographies (Rijal al-Hadith)
CREATE TABLE IF NOT EXISTS hadith_narrators (
    id TEXT PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    generation TEXT NOT NULL, -- 'Sahabi' | 'Tabi_Senior' | 'Tabi_Junior' | 'Atba_Tabiin' | 'Compiler'
    reliability TEXT NOT NULL, -- 'ثقة ثبت' | 'ثقة' | 'صدوق' | 'مقبول'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_narrators_generation ON hadith_narrators(generation);
CREATE INDEX IF NOT EXISTS idx_narrators_name_ar ON hadith_narrators(name_ar);

-- Master Hadith Entries
CREATE TABLE IF NOT EXISTS hadiths (
    id TEXT PRIMARY KEY, -- e.g. 'bukhari-1'
    collection TEXT NOT NULL,
    collection_code TEXT,
    hadith_number INTEGER NOT NULL,
    arabic_matn TEXT NOT NULL,
    english_matn TEXT,
    primary_narrator TEXT NOT NULL,
    breadth TEXT NOT NULL DEFAULT 'gharib' CHECK (breadth IN ('mutawatir', 'mashhur', 'aziz', 'gharib')),
    min_narrators_in_tier INTEGER DEFAULT 1,
    breadth_explanation TEXT,
    themes JSONB DEFAULT '[]'::jsonb,
    variants JSONB DEFAULT '[]'::jsonb,
    chains JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hadiths_collection ON hadiths(collection);
CREATE INDEX IF NOT EXISTS idx_hadiths_number ON hadiths(hadith_number);
CREATE INDEX IF NOT EXISTS idx_hadiths_breadth ON hadiths(breadth);
CREATE INDEX IF NOT EXISTS idx_hadiths_primary_narrator ON hadiths(primary_narrator);
CREATE INDEX IF NOT EXISTS idx_hadiths_matn_search ON hadiths USING gin(to_tsvector('arabic', arabic_matn));

-- ==============================================================================
-- 3. USERS & SAAS SUBSCRIPTION PROFILES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- 'usr-admin-1' or Clerk user ID
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'scholar', 'student', 'patron')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'patron')),
    gateway TEXT DEFAULT 'stripe' CHECK (gateway IN ('slickpay', 'stripe', 'manual_waqf')),
    currency TEXT DEFAULT 'USD' CHECK (currency IN ('DZD', 'USD')),
    amount_paid NUMERIC DEFAULT 0,
    api_requests INTEGER DEFAULT 0,
    projects_count INTEGER DEFAULT 0,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_plan ON users(plan);

-- ==============================================================================
-- 4. RESEARCH WORKSPACE & USER DATA
-- ==============================================================================

-- Research Projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    hypothesis TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- Evidence Items
CREATE TABLE IF NOT EXISTS evidence_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    surah INTEGER NOT NULL,
    ayah INTEGER NOT NULL,
    surah_name TEXT,
    verse_text TEXT NOT NULL,
    analysis_type TEXT NOT NULL,
    classification TEXT NOT NULL DEFAULT 'hypothesis' CHECK (
        classification IN (
            'verified',
            'scientifically_supported',
            'possible_correspondence',
            'hypothesis',
            'disputed',
            'unsupported'
        )
    ),
    calculation_data JSONB,
    sources JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evidence_project_id ON evidence_items(project_id);
CREATE INDEX IF NOT EXISTS idx_evidence_user_id ON evidence_items(user_id);
CREATE INDEX IF NOT EXISTS idx_evidence_verse ON evidence_items(surah, ayah);

-- Bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    surah INTEGER NOT NULL,
    ayah INTEGER NOT NULL,
    surah_name TEXT NOT NULL,
    verse_text TEXT NOT NULL,
    notes TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);

-- Research Notes
CREATE TABLE IF NOT EXISTS research_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    surah INTEGER,
    ayah INTEGER,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_research_notes_user ON research_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_research_notes_project ON research_notes(project_id);

-- Analysis Cache
CREATE TABLE IF NOT EXISTS analysis_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cache_key TEXT NOT NULL UNIQUE,
    analysis_type TEXT NOT NULL,
    result JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analysis_cache_key ON analysis_cache(cache_key);

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on user-specific tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_notes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to Quran & Hadith knowledge tables
ALTER TABLE quran_surahs ENABLE ROW LEVEL SECURITY;
ALTER TABLE quran_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE quran_phrases ENABLE ROW LEVEL SECURITY;
ALTER TABLE quran_matching_ayahs ENABLE ROW LEVEL SECURITY;
ALTER TABLE quran_tafsir ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadith_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadith_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadith_scholars ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadith_narrators ENABLE ROW LEVEL SECURITY;
ALTER TABLE hadiths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read quran_surahs" ON quran_surahs FOR SELECT USING (true);
CREATE POLICY "Public read quran_verses" ON quran_verses FOR SELECT USING (true);
CREATE POLICY "Public read quran_phrases" ON quran_phrases FOR SELECT USING (true);
CREATE POLICY "Public read quran_matching_ayahs" ON quran_matching_ayahs FOR SELECT USING (true);
CREATE POLICY "Public read quran_tafsir" ON quran_tafsir FOR SELECT USING (true);
CREATE POLICY "Public read hadith_collections" ON hadith_collections FOR SELECT USING (true);
CREATE POLICY "Public read hadith_books" ON hadith_books FOR SELECT USING (true);
CREATE POLICY "Public read hadith_scholars" ON hadith_scholars FOR SELECT USING (true);
CREATE POLICY "Public read hadith_narrators" ON hadith_narrators FOR SELECT USING (true);
CREATE POLICY "Public read hadiths" ON hadiths FOR SELECT USING (true);

-- Allow authenticated users to manage their own projects & evidence
CREATE POLICY "Users can manage own projects" ON projects
    FOR ALL USING (auth.uid()::text = user_id OR user_id = 'demo-user');

CREATE POLICY "Users can manage own evidence" ON evidence_items
    FOR ALL USING (auth.uid()::text = user_id OR user_id = 'demo-user');

CREATE POLICY "Users can manage own bookmarks" ON bookmarks
    FOR ALL USING (auth.uid()::text = user_id OR user_id = 'demo-user');

CREATE POLICY "Users can manage own notes" ON research_notes
    FOR ALL USING (auth.uid()::text = user_id OR user_id = 'demo-user');
