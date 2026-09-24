import { pgTable, text, integer, timestamp, jsonb, uuid, pgEnum } from 'drizzle-orm/pg-core'

export const projectStatusEnum = pgEnum('project_status', ['active', 'archived', 'draft'])

export const evidenceStatusEnum = pgEnum('evidence_status', [
  'verified',
  'scientifically_supported',
  'possible_correspondence',
  'hypothesis',
  'disputed',
  'unsupported',
])

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  hypothesis: text('hypothesis'),
  status: text('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const evidenceItems = pgTable('evidence_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(),
  surah: integer('surah').notNull(),
  ayah: integer('ayah').notNull(),
  surahName: text('surah_name'),
  verseText: text('verse_text').notNull(),
  analysisType: text('analysis_type').notNull(), // 'letter_count' | 'symmetry' | 'root_morphology' | 'scientific_correlation'
  classification: text('classification').notNull().default('hypothesis'),
  calculationData: jsonb('calculation_data').$type<{
    letters?: number
    words?: number
    symmetryRatio?: number
    normalizedText?: string
    abjadValue?: number
    mathExplanation?: string
    [key: string]: unknown
  }>(),
  sources: jsonb('sources').$type<
    Array<{
      title: string
      url?: string
      citation?: string
      notes?: string
    }>
  >(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const bookmarks = pgTable('bookmarks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  surah: integer('surah').notNull(),
  ayah: integer('ayah').notNull(),
  surahName: text('surah_name').notNull(),
  verseText: text('verse_text').notNull(),
  notes: text('notes'),
  tags: jsonb('tags').$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const researchNotes = pgTable('research_notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'set null' }),
  surah: integer('surah'),
  ayah: integer('ayah'),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const analysisCache = pgTable('analysis_cache', {
  id: uuid('id').defaultRandom().primaryKey(),
  cacheKey: text('cache_key').notNull().unique(),
  analysisType: text('analysis_type').notNull(),
  result: jsonb('result').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type EvidenceItem = typeof evidenceItems.$inferSelect
export type NewEvidenceItem = typeof evidenceItems.$inferInsert
export type Bookmark = typeof bookmarks.$inferSelect
export type NewBookmark = typeof bookmarks.$inferInsert
